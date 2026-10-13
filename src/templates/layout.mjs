import { html } from '../lib/html.mjs';
import { format, LOCALES } from '../i18n/index.mjs';
import { brand, clientDownloadUrl, icon, iconSprite } from './partials.mjs';

export const STYLESHEETS = ['ds/fonts', 'ds/colors', 'ds/typography', 'ds/spacing', 'ds/motion', 'ds/base', 'ds/components', 'site'].map(
  (name) => `/assets/css/${name}.css`,
);
export const SCRIPTS = ['/assets/js/main.js'];
const PRELOAD_FONTS = ['cinzel-latin-400-normal', 'eb-garamond-latin-400-normal', 'jetbrains-mono-latin-400-normal'];

const NAV = [
  { key: 'home', path: '/' },
  { key: 'downloads', path: '/downloads/' },
  { key: 'mods', path: '/mods/' },
  { key: 'news', path: '/news/' },
  { key: 'changelog', path: '/changelog/' },
];
const NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

/**
 * The whole page: head, top bar, content and footer.
 * @param ctx     the locale context (see scripts/build.mjs)
 * @param page    { key, path, title, description, image, type, alternates }
 *                path is the path without the locale prefix; alternates, the locales the page
 *                exists in (default: all)
 * @param content html fragment for <main>
 */
export function layout(ctx, page, content) {
  const { config, t, locale } = ctx;
  const fullTitle = page.title ? `${page.title} · ${config.name}` : t.meta.title;
  const description = page.description || t.meta.description;
  const alternates = page.alternates || LOCALES;
  const image = ctx.absolute(page.image || '/assets/img/og.png');

  return html`<!doctype html>
<html lang="${locale.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fullTitle}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#0a0614">
  <meta name="color-scheme" content="dark">
  ${ctx.absolute('/') ? html`
  <link rel="canonical" href="${ctx.absolute(locale.prefix + page.path)}">
  ${alternates.map((alt) => html`
  <link rel="alternate" hreflang="${alt.lang}" href="${ctx.absolute(alt.prefix + page.path)}">`)}
  <link rel="alternate" hreflang="x-default" href="${ctx.absolute(page.path)}">` : ''}

  <meta property="og:type" content="${page.type || 'website'}">
  <meta property="og:locale" content="${locale.og}">
  <meta property="og:site_name" content="${config.name}">
  <meta property="og:title" content="${page.title || t.meta.title}">
  <meta property="og:description" content="${description}">
  ${image ? html`<meta property="og:image" content="${image}">` : ''}
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" type="image/png" href="${ctx.url('/assets/img/stein.png')}">
  <link rel="apple-touch-icon" href="${ctx.url('/assets/img/stein.png')}">
  <link rel="alternate" type="application/rss+xml" title="${t.meta.feedTitle}" href="${ctx.href('/news/feed.xml')}">
  ${PRELOAD_FONTS.map((font) => html`
  <link rel="preload" href="${ctx.url(`/assets/fonts/${font}.woff2`)}" as="font" type="font/woff2" crossorigin>`)}
  ${STYLESHEETS.map((sheet) => html`
  <link rel="stylesheet" href="${ctx.asset(sheet)}">`)}
  ${SCRIPTS.map((script) => html`
  <script src="${ctx.asset(script)}" defer></script>`)}
</head>
<body data-page="${page.key}">
  ${iconSprite}
  <a class="skip" href="#content">${t.nav.skip}</a>

  <header class="topbar" data-topbar>
    <div class="topbar__inner">
      <a class="wordmark" href="${ctx.href('/')}" aria-label="${t.nav.homeLabel}">
        <img draggable="false" src="${ctx.url('/assets/img/stein.png')}" width="30" height="30" alt="">
        <span class="wordmark__name">Stein <em>Project</em></span>
      </a>

      <nav class="nav" id="nav" aria-label="${t.nav.main}">
        ${NAV.map((item, index) => html`
        <a class="nav__link" href="${ctx.href(item.path)}"${item.key === page.key ? html` aria-current="page"` : ''}>
          <span class="nav__n">${NUMERALS[index]}</span>${t.nav[item.key]}
        </a>`)}
        <a class="nav__link nav__link--compact" href="${config.discord}" rel="noopener">${t.nav.discord}</a>
        <a class="nav__link nav__link--compact" href="${config.github}" rel="noopener">GitHub</a>
      </nav>

      <div class="social">
        <a class="social__link" href="${config.github}" rel="noopener" aria-label="GitHub" title="GitHub">${brand('github', 17)}</a>
        <a class="social__link" href="${config.discord}" rel="noopener" aria-label="Discord" title="Discord">${brand('discord', 18)}</a>
      </div>

      ${languageSwitcher(ctx, page, alternates)}

      <a class="sl-btn sl-btn--accent topbar__cta" href="${clientDownloadUrl(config)}">
        ${icon('down', 14)}${t.nav.download}
      </a>
      <button class="topbar__toggle" type="button" aria-controls="nav" aria-expanded="false" aria-label="${t.nav.openMenu}" data-nav-toggle>
        ${icon('menu', 20)}
      </button>
    </div>
  </header>

  <main id="content">
    ${content}
  </main>

  <footer class="footer">
    <div class="wrap footer__inner">
      <div class="footer__brand">
        <a class="wordmark" href="${ctx.href('/')}" aria-label="${t.nav.homeLabel}">
          <img draggable="false" src="${ctx.url('/assets/img/stein.png')}" width="26" height="26" alt="">
          <span class="wordmark__name">Stein <em>Project</em></span>
        </a>
        <p class="footer__by">${format(t.footer.by, { author: config.author })}</p>
      </div>
      <nav class="footer__links mono" aria-label="${t.nav.footer}">
        ${NAV.map((item) => html`<a href="${ctx.href(item.path)}">${t.nav[item.key]}</a>`)}
        <a href="${config.discord}" rel="noopener">${t.nav.discord}</a>
        <a href="${config.github}" rel="noopener">GitHub</a>
        <a href="${ctx.href('/news/feed.xml')}">RSS</a>
      </nav>
      <p class="footer__legal">${t.footer.alpha}<br>${t.footer.legal}</p>
      <p class="footer__copy mono">© ${ctx.buildDate.getFullYear()} ${config.name}</p>
    </div>
  </footer>
</body>
</html>
`;
}

/**
 * Language picker: a <details> that works without JavaScript. Each link leads to the same page
 * in the other language and stores the choice (data-lang), so the automatic redirect at the
 * root doesn't undo it.
 */
function languageSwitcher(ctx, page, alternates) {
  const { locale, t } = ctx;
  return html`
      <details class="lang" data-lang-menu>
        <summary class="lang__current mono" aria-label="${t.nav.language}: ${locale.name}">
          ${icon('globe', 14)}${locale.short}${icon('chevronDown', 12)}
        </summary>
        <ul class="lang__list">
          ${alternates.map((alt) => html`
          <li><a class="lang__item" href="${ctx.url(alt.prefix + page.path)}" hreflang="${alt.lang}" lang="${alt.lang}" data-lang="${alt.code}"${alt === locale ? html` aria-current="true"` : ''}>
            <span class="mono">${alt.short}</span>${alt.name}
          </a></li>`)}
        </ul>
      </details>`;
}
