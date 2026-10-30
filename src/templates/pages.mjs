import { escape, html, raw } from '../lib/html.mjs';
import { formatBytes, formatLongDate, isoDate } from '../lib/format.mjs';
import { renderMarkdown } from '../lib/markdown.mjs';
import { format } from '../i18n/index.mjs';
import { community, downloadButton, downloadFile, icon, langAttr, pageHead, postCard, sectionHead, steps, time, title } from './partials.mjs';

/* ── Downloads ──────────────────────────────────────────────────────────── */

export function downloadsPage(ctx) {
  const { t, downloads } = ctx;
  const d = t.downloads;
  const client = downloads.find((item) => item.product.id === 'client');
  const manual = downloads.filter((item) => item.product.id !== 'client');

  return html`
    ${pageHead('', d.label, d.heading, d.lead)}

    <section class="section section--tight">
      <div class="wrap">
        ${client ? featuredClient(ctx, client) : html`<p class="empty">${d.none}</p>`}
      </div>
    </section>

    <section class="section section--sunken" aria-labelledby="t-manual">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('', d.manualLabel)}
          <h2 class="section__title" id="t-manual">${title(d.manualTitle)}</h2>
          <p class="section__lead">${raw(format(d.manualLeadHtml, { mods: escape(ctx.href('/mods/')) }))}</p>
        </header>

        <div class="downloads">
          ${manual.map(({ product, release, files }) => {
            const text = t.products[product.id];
            return html`
          <article class="card download" id="${product.id}">
            <div class="download__head">
              <span class="card__k mono">${text.kind}</span>
              <span class="download__ver mono">${release.version} · ${time(ctx, release.publishedAt)}</span>
            </div>
            <h3 class="card__title">${product.label}</h3>
            <p>${text.summary}${text.platforms ? html` <span class="dim">${text.platforms}.</span>` : ''}</p>
            ${files.map((file) => downloadFile(ctx, file))}
            <div class="mod-card__links mono">
              ${product.source ? html`<a class="inline-link" href="${product.source}" rel="noopener">${t.mods.code} ${icon('arrow', 12)}</a>` : ''}
            </div>
          </article>`;
          })}
        </div>

        <aside class="notice" role="note">${icon('bolt')}<p>${raw(d.installerHtml)}</p></aside>
      </div>
    </section>

    ${community(ctx)}`;
}

function featuredClient(ctx, { product, release, files }) {
  const { t } = ctx;
  const file = files[0];
  return html`
    <article class="featured card">
      <div class="featured__info">
        <span class="sl-tag sl-tag--pill sl-tag--ritual">${t.common.recommended}</span>
        <h2 class="featured__title">${product.label}</h2>
        <p>${t.products.client.summary}</p>
        <dl class="meta mono">
          <div><dt>${t.common.version}</dt><dd>${release.version}</dd></div>
          <div><dt>${t.common.published}</dt><dd>${time(ctx, release.publishedAt)}</dd></div>
          <div><dt>${t.common.system}</dt><dd>${t.products.client.platforms}</dd></div>
          <div><dt>${t.common.size}</dt><dd>${formatBytes(file.size, ctx.locale.intl)}</dd></div>
        </dl>
      </div>
      <div class="featured__action">
        ${downloadButton(ctx)}
        ${file.sha256 ? html`
        <p class="featured__hash mono">SHA-256 <code class="hash">${file.sha256}</code></p>` : ''}
        <a class="inline-link mono" href="${ctx.href(`/changelog/#client-${release.version}`)}">${t.common.releaseNotes} ${icon('arrow', 12)}</a>
      </div>
    </article>
    ${steps(t.downloads.stepsHtml, 'inline')}
    <p class="fine">${raw(t.downloads.smartScreenHtml)}</p>`;
}

/* ── News ───────────────────────────────────────────────────────────────── */

export function newsPage(ctx) {
  const { t, posts, config } = ctx;
  const n = t.news;
  const [latest, ...older] = posts;

  return html`
    ${pageHead('V', n.label, n.heading, n.lead)}

    <section class="section section--tight">
      <div class="wrap">
        ${latest ? html`
        <article class="lead-post card card--hover"${langAttr(ctx, latest)}>
          <a href="${ctx.href(`/news/${latest.slug}/`)}">
            ${latest.cover ? html`<div class="lead-post__cover"><img draggable="false" src="${ctx.url(`/news/${latest.slug}/${latest.cover}`)}" alt="" loading="lazy"></div>` : ''}
            <div class="lead-post__body">
              <span class="card__k mono">${n.latest} · ${time(ctx, latest.date)}</span>
              <h2 class="lead-post__title">${latest.title}</h2>
              ${latest.summary ? html`<p>${latest.summary}</p>` : ''}
              <span class="card__link mono">${t.common.readPost} ${icon('arrow', 12)}</span>
            </div>
          </a>
        </article>
        ${older.length ? html`<div class="cards cards--2 post-grid">${older.map((post) => postCard(ctx, post))}</div>` : ''}
        ` : html`<p class="empty">${n.none}</p>`}
        <p class="fine">${raw(format(n.alsoHtml, { feed: escape(ctx.href('/news/feed.xml')), discord: escape(config.discord) }))}</p>
      </div>
    </section>`;
}

export function postPage(ctx, post) {
  const { t } = ctx;
  // Images live once, in the post's folder at the root, and serve every locale.
  const assets = ctx.url(`/news/${post.slug}/`);
  const body = renderMarkdown(post.body, {
    resolveUrl: (href) => (/^(https?:|mailto:|#|\/)/.test(href) ? href : assets + href),
  });
  const index = ctx.posts.findIndex((item) => item.slug === post.slug);
  const newer = ctx.posts[index - 1];
  const older = ctx.posts[index + 1];

  return html`
    <article class="post">
      <header class="post__head">
        <div class="wrap wrap--narrow">
          <a class="back mono" href="${ctx.href('/news/')}">${icon('arrowLeft', 12)}${t.news.back}</a>
          <p class="card__k mono">${time(ctx, post.date, formatLongDate)}${post.tags.length ? html` · ${post.tags.join(' · ')}` : ''}${post.draft ? html` · ${t.common.draft}` : ''}</p>
          <h1 class="post__title"${langAttr(ctx, post)}>${post.title}</h1>
          ${post.summary ? html`<p class="section__lead"${langAttr(ctx, post)}>${post.summary}</p>` : ''}
          ${post.fallback ? html`<p class="fallback mono">${format(t.fallback.post, { language: t.languages[post.fallback.code] })}</p>` : ''}
        </div>
        ${post.cover ? html`<div class="wrap post__cover"><img draggable="false" src="${assets + post.cover}" alt=""></div>` : ''}
      </header>

      <div class="wrap wrap--narrow prose"${langAttr(ctx, post)}>${raw(body)}</div>

      <nav class="wrap wrap--narrow post__nav" aria-label="${t.news.others}">
        ${older ? html`<a class="post__nav-item" href="${ctx.href(`/news/${older.slug}/`)}"><span class="mono">${t.common.previous}</span>${older.title}</a>` : html`<span></span>`}
        ${newer ? html`<a class="post__nav-item post__nav-item--next" href="${ctx.href(`/news/${newer.slug}/`)}"><span class="mono">${t.common.next}</span>${newer.title}</a>` : ''}
      </nav>
    </article>
    ${community(ctx)}`;
}

/* ── Changelog ──────────────────────────────────────────────────────────── */

/** The Stein Client, the Stein Loader and the SDK; each mod has a page of its own. */
export function changelogPage(ctx) {
  const { t, changelog } = ctx;
  const c = t.changelog;
  const entries = changelog.filter((entry) => !entry.component.mod);
  const present = [...new Map(entries.map((entry) => [entry.component.id, entry.component])).values()];

  return html`
    ${pageHead('VI', c.label, c.heading, c.lead)}

    <section class="section section--tight">
      <div class="wrap wrap--narrow">
        ${fallbackNotice(ctx, entries)}
        ${modLinks(ctx)}
        <div class="filters" role="toolbar" aria-label="${c.filter}" data-filters hidden>
          <button class="filter" type="button" aria-pressed="true" data-filter="all">${c.all}</button>
          ${present.map((component) => html`<button class="filter" type="button" aria-pressed="false" data-filter="${component.id}">${component.label}</button>`)}
        </div>
        ${timeline(ctx, entries)}
      </div>
    </section>`;
}

/** The notes of one mod, on their own. */
export function modChangelogPage(ctx, mod) {
  const { t, changelog } = ctx;
  const entries = changelog.filter((entry) => entry.component.mod && entry.component.id === mod.id);

  return html`
    ${pageHead('VI', t.changelog.label, format(t.changelog.modHeading, { mod: mod.name }), '')}

    <section class="section section--tight">
      <div class="wrap wrap--narrow">
        <a class="back mono" href="${ctx.href('/changelog/')}">${icon('arrowLeft', 12)}${t.changelog.label}</a>
        ${fallbackNotice(ctx, entries)}
        ${modLinks(ctx, mod)}
        ${entries.length ? timeline(ctx, entries) : html`<p class="empty">${t.changelog.none}</p>`}
      </div>
    </section>`;
}

/** A single notice at the top for the notes not translated yet; each carries the badge of the language it is shown in. */
function fallbackNotice(ctx, entries) {
  const { t } = ctx;
  const fallback = entries.find((entry) => entry.fallback)?.fallback;
  return fallback ? html`<p class="fallback mono">${format(t.fallback.changelog, { language: t.languages[fallback.code] })}</p>` : '';
}

/** A link to each mod's notes. */
const modLinks = (ctx, current) => html`
  <nav class="filters filters--links" aria-label="${ctx.t.changelog.mods}">
    <span class="filters__label mono">${ctx.t.changelog.mods}</span>
    ${ctx.mods.map((mod) => html`<a class="filter" href="${ctx.href(`/changelog/${mod.id}/`)}"${mod === current ? html` aria-current="page"` : ''}>${mod.name}</a>`)}
  </nav>`;

const timeline = (ctx, entries) => html`
  <ol class="timeline">
    ${entries.map((entry) => html`
    <li class="entry" id="${entry.id}" data-component="${entry.component.id}">
      <div class="entry__meta mono">
        <span class="entry__tag">${entry.component.label}</span>
        <span class="entry__ver">${entry.version}</span>
        ${time(ctx, entry.date)}
        ${entry.fallback ? html`<span class="entry__lang" title="${ctx.t.languages[entry.fallback.code]}">${entry.fallback.short}</span>` : ''}
      </div>
      <div class="entry__body"${langAttr(ctx, entry)}>
        <h2 class="entry__title"><a href="#${entry.id}">${entry.title}</a></h2>
        <div class="prose prose--compact">${raw(renderMarkdown(entry.body, { headingShift: 2 }))}</div>
        <a class="inline-link mono" href="${entry.release.url}" rel="noopener" lang="${ctx.locale.lang}">${ctx.t.common.releaseOnGithub} ${icon('arrow', 12)}</a>
      </div>
    </li>`)}
  </ol>`;

/* ── 404 ────────────────────────────────────────────────────────────────── */

export function notFoundPage(ctx) {
  const { t } = ctx;
  return html`
    <section class="section notfound">
      <div class="wrap community__inner">
        <span class="notfound__code">404</span>
        <h1 class="section__title">${title(t.notFound.heading)}</h1>
        <p class="section__lead">${t.notFound.lead}</p>
        <div class="actions actions--center">
          <a class="sl-btn sl-btn--lg" href="${ctx.href('/')}">${t.notFound.home}</a>
          ${downloadButton(ctx)}
        </div>
      </div>
    </section>`;
}

/* ── Feed and sitemap ───────────────────────────────────────────────────── */

export function feed(ctx) {
  const { t, posts, locale } = ctx;
  const link = (pathname) => ctx.absolute(locale.prefix + pathname) || ctx.href(pathname);
  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escape(post.title)}</title>
      <link>${escape(link(`/news/${post.slug}/`))}</link>
      <guid isPermaLink="true">${escape(link(`/news/${post.slug}/`))}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>${post.summary ? `
      <description>${escape(post.summary)}</description>` : ''}
    </item>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(t.meta.feedTitle)}</title>
    <link>${escape(link('/news/'))}</link>
    <description>${escape(t.news.description)}</description>
    <language>${locale.lang.toLowerCase()}</language>
    <lastBuildDate>${ctx.buildDate.toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>
`;
}

/** @param {{ path: string, date?: Date }[]} entries paths already carrying the locale prefix */
export function sitemap(absolute, entries) {
  const urls = entries
    .map((entry) => `  <url><loc>${escape(absolute(entry.path))}</loc>${entry.date ? `<lastmod>${isoDate(entry.date)}</lastmod>` : ''}</url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
