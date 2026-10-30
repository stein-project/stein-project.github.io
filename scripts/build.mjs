#!/usr/bin/env node
/**
 * Builds the site into dist/, in every locale (English at the root, the others in /<locale>/).
 *
 *   node scripts/build.mjs              reads the releases and mod indexes on GitHub (and caches them in .cache/)
 *   node scripts/build.mjs --offline    uses the cache, no network
 *   node scripts/build.mjs --drafts     includes the posts marked "draft: true"
 *
 * Environment:
 *   SITE_URL       public address, no trailing slash (e.g. https://stein-project.github.io).
 *                  Sets the base path of the links, the canonical URLs, hreflang, the feed and the sitemap.
 *   GITHUB_TOKEN   optional; raises the GitHub API limit (CI provides one).
 */
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '../site.config.mjs';
import { toString } from '../src/lib/html.mjs';
import { loadData } from '../src/lib/github.mjs';
import { latestDownloads, loadChangelog, loadNews, localize } from '../src/lib/content.mjs';
import { checkDictionaries, DEFAULT_LOCALE, format, LOCALES } from '../src/i18n/index.mjs';
import { layout, SCRIPTS, STYLESHEETS } from '../src/templates/layout.mjs';
import { clientPage } from '../src/templates/client.mjs';
import { home } from '../src/templates/home.mjs';
import { loaderPage } from '../src/templates/loader.mjs';
import { modsPage } from '../src/templates/mods.mjs';
import { changelogPage, downloadsPage, feed, modChangelogPage, newsPage, notFoundPage, postPage, sitemap } from '../src/templates/pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const STATIC = path.join(ROOT, 'static');
const CONTENT = path.join(ROOT, 'content');

const args = new Set(process.argv.slice(2));
const offline = args.has('--offline');
const drafts = args.has('--drafts');

const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '');
const base = siteUrl ? new URL(siteUrl).pathname.replace(/\/+$/, '') : '';
const origin = siteUrl ? new URL(siteUrl).origin : '';

async function main() {
  const started = performance.now();
  checkDictionaries();

  const data = await loadData({ config, cacheDir: path.join(ROOT, '.cache'), offline });
  const posts = await loadNews(path.join(CONTENT, 'news'), { drafts });
  const changelog = loadChangelog(config, data);
  const downloads = latestDownloads(config.products, data.products);
  // The base mods first, in the order of the index; then the extras and the third-party ones.
  const mods = ['base', 'extra', 'third'].flatMap((kind) => data.mods.filter((mod) => mod.kind === kind));

  await rm(DIST, { recursive: true, force: true });
  await cp(STATIC, DIST, { recursive: true });

  // Post images: a single copy in /news/<slug>/, shared by every locale.
  for (const post of posts) {
    for (const file of post.assets) await cp(path.join(post.folder, file), path.join(DIST, 'news', post.slug, file));
  }

  // CSS and JS carry ?v=<content hash>: the browser cache holds until the file changes.
  const versions = new Map();
  for (const file of [...STYLESHEETS, ...SCRIPTS]) {
    versions.set(file, createHash('sha256').update(await readFile(path.join(STATIC, file))).digest('hex').slice(0, 10));
  }

  const buildDate = new Date();
  const absolute = (pathname) => (origin ? origin + base + pathname : '');
  const sitemapEntries = [];
  let pageCount = 0;

  for (const locale of LOCALES) {
    const ctx = {
      config,
      locale,
      t: locale.strings,
      buildDate,
      downloads,
      mods,
      posts: posts.map((post) => localize(post, locale)),
      changelog: changelog.map((entry) => localize(entry, locale)),
      url: (pathname) => base + pathname,
      href: (pathname) => base + locale.prefix + pathname,
      asset: (file) => `${base}${file}?v=${versions.get(file)}`,
      absolute,
    };
    const { t } = ctx;

    const pages = [
      { key: 'home', path: '/', content: home(ctx), date: buildDate },
      { key: 'client', path: '/client/', title: t.clientPage.pageTitle, description: t.clientPage.description, content: clientPage(ctx), date: buildDate },
      { key: 'loader', path: '/loader/', title: t.loaderPage.pageTitle, description: t.loaderPage.description, content: loaderPage(ctx), date: buildDate },
      { key: 'downloads', path: '/downloads/', title: t.downloads.title, description: t.downloads.description, content: downloadsPage(ctx), date: buildDate },
      { key: 'mods', path: '/mods/', title: t.mods.title, description: t.mods.description, content: modsPage(ctx), date: buildDate },
      { key: 'news', path: '/news/', title: t.news.title, description: t.news.description, content: newsPage(ctx), date: ctx.posts[0]?.date },
      { key: 'changelog', path: '/changelog/', title: t.changelog.title, description: t.changelog.description, content: changelogPage(ctx), date: ctx.changelog[0]?.date },
      ...mods.map((mod) => ({
        key: 'changelog',
        path: `/changelog/${mod.id}/`,
        title: `${t.changelog.title}: ${mod.name}`,
        description: format(t.changelog.modDescription, { mod: mod.name }),
        content: modChangelogPage(ctx, mod),
        date: ctx.changelog.find((entry) => entry.component.id === mod.id)?.date,
      })),
      ...ctx.posts.map((post) => ({
        key: 'news',
        path: `/news/${post.slug}/`,
        title: post.title,
        description: post.summary,
        image: post.cover ? `/news/${post.slug}/${post.cover}` : undefined,
        type: 'article',
        content: postPage(ctx, post),
        date: post.date,
      })),
    ];

    for (const page of pages) {
      await write(path.join(locale.prefix, page.path, 'index.html'), toString(layout(ctx, page, page.content)));
      sitemapEntries.push({ path: locale.prefix + page.path, date: page.date });
    }
    pageCount += pages.length;

    await write(path.join(locale.prefix, 'news', 'feed.xml'), feed(ctx));
    // GitHub Pages only uses the root 404.html; it comes out in the default locale.
    if (locale === DEFAULT_LOCALE) {
      await write('404.html', toString(layout(ctx, { key: 'notfound', path: '/', title: t.notFound.title }, notFoundPage(ctx))));
    }
  }

  if (origin) {
    await write('sitemap.xml', sitemap(absolute, sitemapEntries));
    await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`);
  }

  const elapsed = Math.round(performance.now() - started);
  console.log(
    `dist/ in ${elapsed} ms: ${pageCount} pages in ${LOCALES.length} locales, ${posts.length} posts, ` +
      `${changelog.length} releases in the changelog, ${downloads.length} products, ${mods.length} mods` +
      `${offline ? ' (offline)' : ''}${drafts ? ' (with drafts)' : ''}${origin ? ` · ${siteUrl}` : ''}`,
  );
}

async function write(relative, content) {
  const file = path.join(DIST, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
