import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseFrontMatter } from './frontmatter.mjs';
import { compareVersions } from './format.mjs';
import { LOCALES, fallbackOrder } from '../i18n/index.mjs';

/**
 * News: one folder per post in content/news/<YYYY-MM-DD>-<slug>/, with one file per locale
 * (index.en.md, index.es.md, index.pt.md) and the images they use. The URL slug is the folder
 * name without the date, the same in every locale. One locale is enough: the others show that
 * text with a notice (see localize()).
 *
 * Front matter: title (required), date (YYYY-MM-DD; default: the folder's date), summary,
 * cover, tags, draft.
 */
export async function loadNews(dir, { drafts = false } = {}) {
  const folders = (await readdir(dir, { withFileTypes: true })).filter((entry) => entry.isDirectory());

  const posts = await Promise.all(
    folders.map(async ({ name }) => {
      const folder = path.join(dir, name);
      const naming = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)$/.exec(name);
      if (!naming) throw new Error(`${folder}: the folder must be named YYYY-MM-DD-slug (lowercase, digits and hyphens)`);

      const files = await readdir(folder);
      const translations = {};
      for (const locale of LOCALES) {
        const file = `index.${locale.code}.md`;
        if (!files.includes(file)) continue;
        const full = path.join(folder, file);
        const { data, body } = parseFrontMatter(await readFile(full, 'utf8'), full);
        if (!data.title) throw new Error(`${full}: "title" is missing from the front matter`);
        const date = String(data.date ?? naming[1]);
        if (Number.isNaN(Date.parse(date))) throw new Error(`${full}: invalid "date" (${date})`);
        translations[locale.code] = {
          title: String(data.title),
          summary: data.summary ? String(data.summary) : '',
          // Noon in Brasília, so the date doesn't move back a day when shown in another time zone.
          date: new Date(`${date}T12:00:00-03:00`),
          cover: data.cover ? String(data.cover) : null,
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          draft: data.draft === true,
          body,
        };
      }
      if (!Object.keys(translations).length) {
        throw new Error(`${folder}: no index.<locale>.md (${LOCALES.map((l) => l.code).join(', ')})`);
      }

      const any = Object.values(translations)[0];
      return {
        slug: naming[2],
        folder,
        date: any.date,
        draft: Object.values(translations).some((translation) => translation.draft),
        translations,
        assets: files.filter((file) => !/^index\.[a-z]{2}\.md$/.test(file)),
      };
    }),
  );

  const slugs = new Set();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`two posts with the same slug: ${post.slug}`);
    slugs.add(post.slug);
  }

  return posts.filter((post) => drafts || !post.draft).sort((a, b) => b.date - a.date);
}

/**
 * Changelog: every published release of the products and of the mods. The notes come from the
 * changelog/<version>.<locale>.md files of the public source repository, one per locale; when a
 * version has none (private source, or older than the folder), the English release body is used,
 * without the install instructions and checksums that every release repeats.
 *
 * Only released versions are listed: the date and the link come from the release, so the site
 * never announces a version that can't be downloaded yet.
 */
export function loadChangelog(config, data) {
  const components = [
    ...config.products.map((product) => ({
      component: { id: product.id, label: product.label },
      releases: data.products[product.id] ?? [],
      notes: data.notes[product.changelog] ?? {},
    })),
    ...data.mods.map((mod) => ({
      component: { id: mod.id, label: mod.name, thirdParty: !mod.official },
      releases: mod.releases,
      notes: data.notes[mod.repo] ?? {},
    })),
  ];

  const entries = [];
  for (const { component, releases, notes } of components) {
    for (const release of releases) {
      const translations = {};
      for (const locale of LOCALES) {
        const source = notes[release.version]?.[locale.changelog];
        if (source) translations[locale.code] = splitHeading(source, component, release.version);
      }
      if (!translations[LOCALES[0].code]) {
        const body = releaseNotes(release.body);
        if (body) translations[LOCALES[0].code] = splitHeading(body, component, release.version);
      }
      if (!Object.keys(translations).length) continue;

      entries.push({
        id: `${component.id}-${release.version}`,
        component,
        version: release.version,
        date: new Date(release.publishedAt),
        release,
        translations,
      });
    }
  }

  return entries.sort((a, b) => b.date - a.date || compareVersions(b.version, a.version));
}

/** The first "# Title" line is the title; the rest is the body. */
function splitHeading(source, component, version) {
  const text = source.replace(/^﻿/, '');
  const heading = /^#{1,2}\s+(.+)\r?\n/.exec(text);
  return {
    title: heading ? heading[1].trim() : `${component.label} ${version}`,
    body: heading ? text.slice(heading[0].length) : text,
  };
}

/** A release body without the parts every release repeats (how to install, checksums). */
function releaseNotes(body) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const end = lines.findIndex((line) => /^\*\*(Install|Portable|SHA-256)/.test(line));
  return (end < 0 ? lines : lines.slice(0, end)).join('\n').trim();
}

/**
 * The translation of a post or changelog entry in the requested locale or, without it, in the
 * default one and then the others. `fallback` names the locale used when it isn't the requested one.
 */
export function localize(item, locale) {
  const used = fallbackOrder(locale).find((candidate) => item.translations[candidate.code]);
  return { ...item, ...item.translations[used.code], lang: used.lang, fallback: used === locale ? null : used };
}

/** The latest release of each product that has one, in config order, with its listed files. */
export function latestDownloads(products, releases) {
  return products
    .map((product) => {
      const release = releases[product.id]?.[0];
      if (!release) return null;
      const files = product.files.map((name) => release.assets.find((asset) => asset.name === name)).filter(Boolean);
      return files.length ? { product, release, files } : null;
    })
    .filter(Boolean);
}
