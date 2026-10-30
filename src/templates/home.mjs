import { html } from '../lib/html.mjs';
import { community, icon, postCard, releaseRow, title } from './partials.mjs';

/** The front door: Stein Client or Stein Loader, a line on what the project is, and what is new. */
export function home(ctx) {
  const { t, posts, changelog } = ctx;
  const h = t.home;

  return html`
    <section class="hero hero--door">
      <div class="wrap">
        <div class="hero__copy">
          <img draggable="false" class="door__mark" src="${ctx.url('/assets/img/stein.png')}" width="88" height="88" alt="">
          <h1 class="hero__title">${title(h.title)}</h1>
          <p class="hero__lead">${h.lead}</p>
        </div>

        <div class="door">
          ${[['client', 'loop'], ['loader', 'layers']].map(
            ([id, name]) => html`
          <a class="card card--hover door__card" href="${ctx.href(`/${id}/`)}">
            <span class="door__top">${icon(name, 26, 'ico mod__ico')}<span class="card__k mono">${h[id].kind}</span></span>
            <h2 class="door__name">Stein <em>${h[id].name}</em></h2>
            <p>${h[id].text}</p>
            <ul class="mod-card__features">${h[id].points.map((point) => html`<li>${icon('check', 14)}<span>${point}</span></li>`)}</ul>
            <span class="card__link mono">${h[id].go} ${icon('arrow', 12)}</span>
          </a>`,
          )}
        </div>
      </div>
    </section>

    <section class="section section--sunken" aria-label="${h.aboutLabel}">
      <div class="wrap">
        <div class="cards cards--3">
          ${h.about.map(([name, heading, text]) => html`<article class="pledge">${icon(name, 22)}<h3>${heading}</h3><p>${text}</p></article>`)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap feed feed--2">
        <div class="feed__block">
          <div class="feed__head"><h2 class="mono">${t.clientPage.start.news}</h2><a class="mono" href="${ctx.href('/news/')}">${t.common.viewAll} ${icon('arrow', 12)}</a></div>
          ${posts.length ? posts.slice(0, 2).map((post) => postCard(ctx, post)) : html`<p class="empty">${t.clientPage.start.noNews}</p>`}
        </div>
        <div class="feed__block">
          <div class="feed__head"><h2 class="mono">${t.clientPage.start.releases}</h2><a class="mono" href="${ctx.href('/changelog/')}">${t.nav.changelog} ${icon('arrow', 12)}</a></div>
          <ul class="release-list">${changelog.slice(0, 5).map((entry) => releaseRow(ctx, entry))}</ul>
        </div>
      </div>
    </section>

    ${community(ctx)}
  `;
}
