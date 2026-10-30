import { escape, html, raw } from '../lib/html.mjs';
import { format } from '../i18n/index.mjs';
import { community, downloadFile, icon, sectionHead, steps, time, title } from './partials.mjs';

/** A product's card: version, what it is, its file and its code. */
const productCard = (ctx, id, { product, release, files }) => {
  const { t } = ctx;
  const text = t.products[id];
  return html`
        <article class="card download">
          <div class="download__head">
            <span class="card__k mono">${text.kind}</span>
            <span class="download__ver mono">${release.version} · ${time(ctx, release.publishedAt)}</span>
          </div>
          <h3 class="card__title">${product.label}</h3>
          <p>${text.summary}${text.platforms ? html` <span class="dim">${text.platforms}.</span>` : ''}</p>
          ${files.map((file) => downloadFile(ctx, file))}
          <div class="mod-card__links mono">
            <a class="inline-link" href="${product.source}" rel="noopener">${t.mods.code} ${icon('arrow', 12)}</a>
          </div>
        </article>`;
};

/** The Stein Loader's area: for who plays on their own launcher, runs a server or writes mods. */
export function loaderPage(ctx) {
  const { t, downloads, changelog } = ctx;
  const l = t.loaderPage;
  const installer = downloads.find((item) => item.product.id === 'loader');
  const sdk = downloads.find((item) => item.product.id === 'sdk');
  const notes = changelog.filter((entry) => entry.component.id === 'loader').slice(0, 3);

  return html`
    <section class="hero">
      <div class="wrap hero__copy">
        <h1 class="hero__title">${title(l.hero.title)}</h1>
        <p class="hero__lead">${l.hero.lead}</p>
        <div class="actions">
          <a class="sl-btn sl-btn--accent sl-btn--lg cta-glow" href="#install">${icon('down', 16)}${l.hero.install}</a>
          <a class="sl-btn sl-btn--lg" href="#mods">${l.hero.write}${icon('arrow', 14)}</a>
        </div>
      </div>
    </section>

    <section class="section section--sunken" aria-labelledby="t-what">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('I', l.what.label)}
          <h2 class="section__title" id="t-what">${title(l.what.title)}</h2>
        </header>
        <div class="cards cards--2">
          ${l.what.items.map(([name, heading, text]) => html`<article class="pledge">${icon(name, 22)}<h3>${heading}</h3><p>${text}</p></article>`)}
        </div>
      </div>
    </section>

    <section class="section" id="install" aria-labelledby="t-install">
      <div class="wrap split split--start">
        <div>
          ${sectionHead('II', l.install.label)}
          <h2 class="section__title" id="t-install">${title(l.install.title)}</h2>
          ${steps(l.install.stepsHtml)}
        </div>
        ${installer ? productCard(ctx, 'loader', installer) : ''}
      </div>
    </section>

    <section class="section section--sunken" aria-labelledby="t-servers">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('III', l.servers.label)}
          <h2 class="section__title" id="t-servers">${title(l.servers.title)}</h2>
          <p class="section__lead">${raw(l.servers.leadHtml)}</p>
        </header>
      </div>
    </section>

    <section class="section" id="mods" aria-labelledby="t-mods">
      <div class="wrap split split--start">
        <div>
          ${sectionHead('IV', l.mods.label)}
          <h2 class="section__title" id="t-mods">${title(l.mods.title)}</h2>
          <p class="section__lead">${raw(format(l.mods.leadHtml, { mods: escape(ctx.href('/mods/')) }))}</p>
        </div>
        ${sdk ? productCard(ctx, 'sdk', sdk) : ''}
      </div>
    </section>

    ${notes.length ? html`
    <section class="section section--sunken" aria-label="${l.notes}">
      <div class="wrap wrap--narrow">
        ${sectionHead('V', l.notes)}
        <ul class="release-list">
          ${notes.map((entry) => html`
          <li class="release-row"><a href="${ctx.href(`/changelog/#${entry.id}`)}"><span class="release-row__tag mono">${entry.version}</span><span class="release-row__title">${entry.title}</span><span class="release-row__date mono">${time(ctx, entry.date)}</span></a></li>`)}
        </ul>
      </div>
    </section>` : ''}

    ${community(ctx)}`;
}
