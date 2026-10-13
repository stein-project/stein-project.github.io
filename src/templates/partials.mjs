import { html, raw } from '../lib/html.mjs';
import { formatBytes, formatDate, isoDate } from '../lib/format.mjs';

/** Design system icons: stroke only, 24×24 (the Stein Client's ui/src/ds/Icon.tsx). */
const ICONS = {
  down: '<path d="M12 5v12"/><path d="M7 12.5l5 5 5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="M8.4 12.4l2.6 2.6 4.6-5.2"/>',
  bolt: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5"/><circle cx="12" cy="16" r=".9" fill="currentColor" stroke="none"/>',
  loop: '<path d="M4.5 9.5a8 8 0 0 1 13.5-2.5"/><path d="M18.5 4v3h-3"/><path d="M19.5 14.5a8 8 0 0 1-13.5 2.5"/><path d="M5.5 20v-3h3"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
  layers: '<polygon points="12,3 21,8 12,13 3,8"/><path d="M3 13l9 5 9-5"/>',
  shield: '<path d="M12 3 20 6.5v5.5c0 5-3.6 7.5-8 8.5-4.4-1-8-3.5-8-8.5V6.5z"/>',
  users: '<circle cx="12" cy="8" r="3.3"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/>',
  plug: '<path d="M9 7.5V4"/><path d="M15 7.5V4"/><path d="M7 7.5h10v2.5a5 5 0 0 1-10 0z"/><path d="M12 15v4.5"/>',
  key: '<rect x="3.5" y="7" width="17" height="10" rx="1.5"/><line x1="7" y1="10.5" x2="8" y2="10.5"/><line x1="11.5" y1="10.5" x2="12.5" y2="10.5"/><line x1="16" y1="10.5" x2="17" y2="10.5"/><line x1="8" y1="14" x2="16" y2="14"/>',
  replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v3.5H8"/><path d="M10.5 9.2v5.6l4.4-2.8z"/>',
  code: '<path d="M8.5 8 4.5 12l4 4"/><path d="M15.5 8l4 4-4 4"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5V5.5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3"/>',
  share: '<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><line x1="8.1" y1="11" x2="15.9" y2="7"/><line x1="8.1" y1="13" x2="15.9" y2="17"/>',
  ban: '<circle cx="12" cy="12" r="8"/><path d="M6.5 6.5 17.5 17.5"/>',
  list: '<line x1="9" y1="7" x2="20" y2="7"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="17" x2="20" y2="17"/><circle cx="4.5" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="17" r="1" fill="currentColor" stroke="none"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5s1.2-6.2 3.6-8.5z"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  menu: '<line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/>',
};

/** The icon of each known mod; any other mod gets the generic one. */
const MOD_ICONS = { hud: 'grid', connect: 'plug', keybind: 'key', replay: 'replay' };
export const modIcon = (id) => MOD_ICONS[id] ?? 'layers';

export const iconSprite = html`<svg class="sprite" aria-hidden="true"><defs>${Object.entries(ICONS).map(
  ([name, body]) => html`<symbol id="i-${name}" viewBox="0 0 24 24">${raw(body)}</symbol>`,
)}<symbol id="i-cross" viewBox="0 0 16 16"><path d="M8 0v5M8 11v5M0 8h5M11 8h5"/></symbol></defs></svg>`;

/** Brand marks, filled (the design system's icons are stroke only). */
const BRANDS = {
  discord: { viewBox: '0 0 71 55', path: 'M60.1 4.9A58.5 58.5 0 0 0 45.6.4a40 40 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A39 39 0 0 0 25.8.4 58.4 58.4 0 0 0 11.2 4.9C2 18.7-.5 32.2.7 45.5a58.9 58.9 0 0 0 18 9.1 43.5 43.5 0 0 0 3.8-6.2 38 38 0 0 1-6-2.9l1.5-1.1a42 42 0 0 0 35.9 0l1.5 1.1a38 38 0 0 1-6 2.9 43 43 0 0 0 3.8 6.2 58.7 58.7 0 0 0 18-9.1c1.5-15.4-2.5-28.8-10.6-40.6ZM23.7 37.3c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.3 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.3 6.4 7.2c0 4-2.8 7.2-6.4 7.2Z' },
  github: {
    viewBox: '0 0 16 16',
    path: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z',
  },
};

export const brand = (name, size = 18) => {
  const mark = BRANDS[name];
  const [, , w, h] = mark.viewBox.split(' ').map(Number);
  return html`<svg width="${size}" height="${Math.round((size * h) / w)}" viewBox="${mark.viewBox}" fill="currentColor" aria-hidden="true"><path d="${mark.path}"/></svg>`;
};

export const icon = (name, size = 18, className = 'ico') =>
  html`<svg class="${className}" width="${size}" height="${size}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

export const crosshairs = html`${['tl', 'tr', 'bl', 'br'].map(
  (corner) => html`<svg class="crosshair crosshair--${corner}" width="16" height="16" aria-hidden="true"><use href="#i-cross"/></svg>`,
)}`;

/** Design system section header: numeral, rule and label. */
export const sectionHead = (numeral, label, { center = false } = {}) => html`
  <div class="sl-shead${center ? ' sl-shead--center' : ''}">
    ${numeral ? html`<span class="sl-shead__n">${numeral}</span>` : ''}
    <span class="sl-shead__rule"></span>
    <span class="sl-shead__label">${label}</span>
    ${center ? html`<span class="sl-shead__rule"></span>` : ''}
  </div>`;

/** A title with the gold word: "Text *emphasis* text" → <em>. */
export const title = (text) =>
  text.split(/\*([^*]+)\*/).map((part, index) => (index % 2 ? html`<em>${part}</em>` : part));

/** The header of an inner page. */
export const pageHead = (numeral, label, heading, lead) => html`
  <header class="page-head">
    <div class="wrap">
      ${sectionHead(numeral, label)}
      <h1 class="page-head__title">${title(heading)}</h1>
      ${lead ? html`<p class="section__lead">${lead}</p>` : ''}
    </div>
  </header>`;

export const time = (ctx, date, format = formatDate) =>
  html`<time datetime="${isoDate(date)}">${format(date, ctx.locale.intl)}</time>`;

/** The address that always serves a file from the latest release, so links never go stale. */
export const latestUrl = (repo, file) => `https://github.com/${repo}/releases/latest/download/${file}`;

export const clientDownloadUrl = (config) => {
  const client = config.products.find((product) => product.id === 'client');
  return latestUrl(client.releases, client.files[0]);
};

/** A card's download: the main button, the file's name and size, and its SHA-256 on demand. */
export const downloadFile = (ctx, file) => html`
  <div class="dl">
    <div class="dl__row">
      <a class="sl-btn sl-btn--accent dl__btn" href="${file.url}">${icon('down', 14)}${ctx.t.nav.download}</a>
      <span class="dl__file mono"><code>${file.name}</code>${file.size ? html` · ${formatBytes(file.size, ctx.locale.intl)}` : ''}</span>
    </div>
    ${file.sha256
      ? html`<details class="file__hash">
          <summary class="mono">SHA-256</summary>
          <code class="hash">${file.sha256}</code>
        </details>`
      : ''}
  </div>`;

/** Marks the language of a piece shown in a language other than the page's. */
export const langAttr = (ctx, item) => (item.fallback ? html` lang="${item.fallback.lang}"` : '');

/** A post card, in the lists. */
export const postCard = (ctx, post) => html`
  <article class="card card--hover post-card"${langAttr(ctx, post)}>
    <a class="post-card__link" href="${ctx.href(`/news/${post.slug}/`)}">
      <span class="card__k mono">${time(ctx, post.date)}${post.tags.length ? html` · ${post.tags.join(' · ')}` : ''}${post.fallback ? html` · ${post.fallback.short}` : ''}</span>
      <h3 class="card__title">${post.title}</h3>
      ${post.summary ? html`<p>${post.summary}</p>` : ''}
      <span class="card__link mono">${ctx.t.common.readPost} ${icon('arrow', 12)}</span>
    </a>
  </article>`;

/** A compact release line, on the home page. */
export const releaseRow = (ctx, entry) => html`
  <li class="release-row"${langAttr(ctx, entry)}>
    <a href="${ctx.href(`/changelog/#${entry.id}`)}">
      <span class="release-row__tag mono">${entry.component.label}</span>
      <span class="release-row__title">${entry.title}</span>
      <span class="release-row__date mono">${time(ctx, entry.date)}</span>
    </a>
  </li>`;

/** What a mod does, in the page's language: the site's text when there is one, else the index's. */
export const modSummary = (ctx, mod) => ctx.t.mods.summaries[mod.id] ?? mod.description;
