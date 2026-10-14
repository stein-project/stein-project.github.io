import { html, raw } from '../lib/html.mjs';
import { formatBytes } from '../lib/format.mjs';
import { format } from '../i18n/index.mjs';
import { brand, clientDownloadUrl, icon, modIcon, modSummary, postCard, releaseRow, sectionHead, title } from './partials.mjs';

/** The big download button; every call to action on the site leads to the same file. */
export const downloadButton = (ctx, size = 'lg') =>
  html`<a class="sl-btn sl-btn--accent sl-btn--${size} cta-glow" href="${clientDownloadUrl(ctx)}">${icon('down', 16)}${ctx.t.common.downloadClient}</a>`;

/** Version, size and requirement under a download button. */
export function downloadNote(ctx) {
  const { t, downloads } = ctx;
  const client = downloads.find((item) => item.product.id === 'client');
  return html`<p class="hero__note mono">${client ? html`${format(t.common.versionLine, { version: client.release.version, size: formatBytes(client.files[0].size, ctx.locale.intl) })} · ` : ''}${t.common.requirement}</p>`;
}

export function home(ctx) {
  const { t, mods, posts, changelog } = ctx;
  const h = t.home;
  const official = mods.filter((mod) => mod.official);

  return html`
    <section class="hero">
      <div class="wrap hero__copy">
        <img draggable="false" class="hero__logo" src="${ctx.url('/assets/img/stein-client.png')}" width="560" height="461" alt="Stein Client">
        <h1 class="hero__title">${title(h.hero.title)}</h1>
        <p class="hero__lead">${h.hero.lead}</p>
        <div class="actions">
          ${downloadButton(ctx)}
          <a class="sl-btn sl-btn--lg" href="${ctx.href('/mods/')}">${t.common.seeMods}${icon('arrow', 14)}</a>
        </div>
        ${downloadNote(ctx)}
      </div>
    </section>

    <section class="section section--sunken" id="client" aria-labelledby="t-client">
      <div class="wrap split">
        <div>
          ${sectionHead('I', h.client.label)}
          <h2 class="section__title" id="t-client">${title(h.client.title)}</h2>
          <p class="section__lead">${h.client.lead}</p>
          <ul class="features">
            ${h.client.features.map(([name, heading, text]) => html`<li>${icon(name)}<div><h3>${heading}</h3><p>${text}</p></div></li>`)}
          </ul>
          <div class="actions">
            ${downloadButton(ctx)}
            <a class="sl-btn sl-btn--lg" href="${ctx.href('/downloads/')}">${t.common.allDownloads}${icon('arrow', 14)}</a>
          </div>
        </div>

        <div class="sl-term sl-term--scan client__term" role="img" aria-label="${h.client.termAria}">
          <div class="sl-term__bar">
            <span class="sl-term__dots"><i></i><i></i><i></i></span>
            <span class="sl-term__title">Stein Client</span>
            <span class="sl-term__live sl-tag"><span class="sl-tag__dot sl-tag__dot--live"></span>${h.client.termReady}</span>
          </div>
          <div class="sl-term__body" aria-hidden="true">
            ${[...h.client.term, ['ok', format(h.client.termMods, { mods: official.map((mod) => mod.name).join(', ') })], ...h.client.termEnd].map(
              ([kind, text], index, lines) => html`<span class="sl-term__line sl-term__line--${kind}">${text}${index === lines.length - 1 ? html`<span class="sl-term__cursor"></span>` : ''}</span>`,
            )}
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="project" aria-labelledby="t-project">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('II', h.project.label)}
          <h2 class="section__title" id="t-project">${title(h.project.title)}</h2>
          <p class="section__lead">${h.project.lead}</p>
        </header>

        <div class="perf">
          <div class="perf__readouts">
            ${readout(h.project.crowdLabel, '~503', 'FPS', h.project.crowdDelta)}
            ${readout(h.project.lowLabel, '~260', 'FPS', h.project.lowDelta)}
            ${readout(h.project.cityLabel, h.project.cityValue, 'FPS', h.project.cityDelta)}
          </div>

          <figure class="perf__chart card">
            <figcaption class="card__head mono"><span>${h.project.chartTitle}</span><span class="dim">FPS</span></figcaption>
            <div class="sl-chart" role="img" aria-label="${h.project.chartAria}">
              <div class="sl-chart__plot">
                ${[[50, false], [98, false], [503, true]].map(
                  ([fps, hot]) => html`<div class="sl-bar"><span class="sl-bar__val">${fps}</span><span class="sl-bar__col${hot ? ' is-hot' : ''}" style="height: ${((fps / 503) * 100).toFixed(1)}%"></span></div>`,
                )}
              </div>
              <div class="sl-chart__labels">
                <span class="sl-chart__lbl">OptiFine</span>
                <span class="sl-chart__lbl">${h.project.chartBefore}</span>
                <span class="sl-chart__lbl">Stein</span>
              </div>
            </div>
          </figure>
        </div>

        <p class="fine">${h.project.fine}</p>
      </div>
    </section>

    <section class="section section--sunken" id="stein" aria-labelledby="t-stein">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('III', h.stein.label)}
          <h2 class="section__title" id="t-stein">${title(h.stein.title)}</h2>
        </header>

        <div class="cards cards--2">
          <article class="card">
            <span class="card__k mono">${h.stein.bridgeKind}</span>
            <h3 class="card__title">Stein Bridge</h3>
            <p>${h.stein.bridgeText}</p>
            <p class="card__meta mono">${h.stein.bridgeMeta}</p>
          </article>
          <article class="card">
            <span class="card__k mono">${h.stein.loaderKind}</span>
            <h3 class="card__title">Stein Loader</h3>
            <p>${h.stein.loaderText}</p>
          </article>
        </div>

        <div class="cards ${mods.length % 3 === 0 ? 'cards--3' : 'cards--4'} mods">
          ${mods.map(
            (mod) => html`
          <a class="card card--hover mod" href="${ctx.href(`/mods/#${mod.id}`)}">
            <span class="mod__top">${icon(modIcon(mod.id), 22, 'ico mod__ico')}<span class="mod__tag mono${mod.official ? '' : ' mod__tag--third'}">${mod.official ? t.mods.official : t.mods.thirdParty}</span></span>
            <h3 class="card__title">${mod.name}</h3>
            <p>${modSummary(ctx, mod)}</p>
          </a>`,
          )}
        </div>

        <div class="actions actions--center">
          <a class="sl-btn sl-btn--lg" href="${ctx.href('/mods/')}">${t.common.allMods}${icon('arrow', 14)}</a>
        </div>
      </div>
    </section>

    <section class="section" id="gfx" aria-labelledby="t-gfx">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('IV', h.gfx.label)}
          <h2 class="section__title" id="t-gfx">${title(h.gfx.title)}</h2>
          <p class="section__lead">${h.gfx.lead}</p>
        </header>

        <div class="readouts-3">
          ${readout(h.gfx.callsLabel, '3', '', h.gfx.callsDelta)}
          ${readout(h.gfx.frameLabel, h.gfx.frameValue, 'ms', h.gfx.frameDelta)}
          ${readout(h.gfx.statusLabel, h.gfx.statusValue, '', h.gfx.statusDelta)}
        </div>

        <p class="fine">${h.gfx.fine} <a class="inline-link" href="${ctx.href('/news/')}">${h.gfx.follow}</a>.</p>
      </div>
    </section>

    <section class="section section--sunken" id="eula" aria-labelledby="t-eula">
      <div class="wrap">
        <header class="section__head section__head--center">
          ${sectionHead('V', h.eula.label, { center: true })}
          <h2 class="section__title" id="t-eula">${title(h.eula.title)}</h2>
        </header>
        <div class="cards cards--3">
          ${h.eula.itemsHtml.map(([name, heading, text]) => html`<article class="pledge">${icon(name, 22)}<h3>${heading}</h3><p>${raw(text)}</p></article>`)}
        </div>
      </div>
    </section>

    <section class="section" id="start" aria-labelledby="t-start">
      <div class="wrap split split--start">
        <div>
          ${sectionHead('VI', h.start.label)}
          <h2 class="section__title" id="t-start">${title(h.start.title)}</h2>
          ${steps(h.start.stepsHtml)}
          ${downloadButton(ctx)}
          ${downloadNote(ctx)}
        </div>

        <div class="feed">
          <div class="feed__block">
            <div class="feed__head"><h3 class="mono">${h.start.news}</h3><a class="mono" href="${ctx.href('/news/')}">${t.common.viewAll} ${icon('arrow', 12)}</a></div>
            ${posts.length ? posts.slice(0, 2).map((post) => postCard(ctx, post)) : html`<p class="empty">${h.start.noNews}</p>`}
          </div>
          <div class="feed__block">
            <div class="feed__head"><h3 class="mono">${h.start.releases}</h3><a class="mono" href="${ctx.href('/changelog/')}">${t.nav.changelog} ${icon('arrow', 12)}</a></div>
            <ul class="release-list">${changelog.slice(0, 5).map((entry) => releaseRow(ctx, entry))}</ul>
          </div>
        </div>
      </div>
    </section>

    ${community(ctx)}
  `;
}

const readout = (label, value, unit, delta, direction = 'up') => html`
  <div class="sl-readout">
    <span class="sl-readout__label">${label}</span>
    <span class="sl-readout__num">${value}${unit ? html`<span class="sl-readout__unit">${unit}</span>` : ''}</span>
    <span class="sl-readout__delta sl-readout__delta--${direction}">${delta}</span>
  </div>`;

/** Numbered steps; each text may carry <code>. */
export const steps = (items, modifier = '') => html`
  <ol class="steps${modifier ? ` steps--${modifier}` : ''}">
    ${items.map(([heading, text], index) => html`
    <li><span class="steps__n mono">${String(index + 1).padStart(2, '0')}</span><div><h3>${heading}</h3><p>${raw(text)}</p></div></li>`)}
  </ol>`;

/** The Discord invitation, at the end of the pages. */
export function community(ctx) {
  const { t, config } = ctx;
  return html`
    <section class="section community" aria-labelledby="t-community">
      <div class="wrap community__inner">
        <img draggable="false" class="community__mark" src="${ctx.url('/assets/img/stein.png')}" width="88" height="88" alt="">
        <h2 class="section__title" id="t-community">${title(t.community.title)}</h2>
        <p class="section__lead">${t.community.lead}</p>
        <a class="discord-btn" href="${config.discord}" rel="noopener">
          <span class="discord-btn__glow"></span>
          ${brand('discord', 26)}
          <span class="discord-btn__lbl">${t.community.button}</span>
          <span class="discord-btn__sep"></span>
          <span class="discord-btn__url">${config.discord.replace(/^https:\/\//, '')}</span>
        </a>
      </div>
    </section>`;
}
