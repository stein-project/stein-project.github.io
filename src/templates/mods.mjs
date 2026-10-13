import { html, raw } from '../lib/html.mjs';
import { format } from '../i18n/index.mjs';
import { community, downloadButton, steps } from './home.mjs';
import { downloadFile, icon, modIcon, modSummary, pageHead, sectionHead, time, title } from './partials.mjs';

/**
 * The mods page: the official mods (the Stein Loader index's sources) and the third-party ones,
 * each with what it does, its version, its file and where its code is. The Stein Client installs
 * and updates them, so the page leads there first and leaves the manual install for last.
 */
export function modsPage(ctx) {
  const { t, mods } = ctx;
  const m = t.mods;
  const official = mods.filter((mod) => mod.official);
  const thirdParty = mods.filter((mod) => !mod.official);

  return html`
    ${pageHead('III', m.label, m.heading, m.lead)}

    <section class="section section--tight">
      <div class="wrap">
        <aside class="featured card mods-howto">
          <div class="featured__info">
            <span class="sl-tag sl-tag--pill sl-tag--ritual">${t.common.recommended}</span>
            <h2 class="featured__title">${title(m.howTitle)}</h2>
            ${steps(m.howStepsHtml, 'inline')}
          </div>
          <div class="featured__action">${downloadButton(ctx)}</div>
        </aside>
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="t-official">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('', m.officialLabel)}
          <h2 class="section__title" id="t-official">${title(m.officialTitle)}</h2>
          <p class="section__lead">${m.officialLead}</p>
        </header>
        <div class="mod-list">${official.map((mod) => modCard(ctx, mod))}</div>
      </div>
    </section>

    ${thirdParty.length ? html`
    <section class="section section--sunken" aria-labelledby="t-third">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('', m.thirdLabel)}
          <h2 class="section__title" id="t-third">${title(m.thirdTitle)}</h2>
          <p class="section__lead">${raw(m.thirdLeadHtml)}</p>
        </header>
        <div class="mod-list">${thirdParty.map((mod) => modCard(ctx, mod))}</div>
      </div>
    </section>` : ''}

    <section class="section" aria-labelledby="t-manual">
      <div class="wrap">
        <header class="section__head">
          ${sectionHead('', m.manualLabel)}
          <h2 class="section__title" id="t-manual">${title(m.manualTitle)}</h2>
          <p class="section__lead">${raw(format(m.manualLeadHtml, { downloads: ctx.href('/downloads/') }))}</p>
        </header>
        <aside class="notice" role="note">${icon('code')}<p>${raw(format(m.authorsHtml, { sdk: ctx.href('/downloads/#sdk') }))}</p></aside>
      </div>
    </section>

    ${community(ctx)}`;
}

function modCard(ctx, mod) {
  const { t } = ctx;
  const m = t.mods;
  const features = m.features[mod.id];
  return html`
    <article class="card mod-card" id="${mod.id}">
      <div class="mod-card__head">
        ${icon(modIcon(mod.id), 26, 'ico mod__ico')}
        <div>
          <h3 class="card__title">${mod.name}</h3>
          <p class="mod-card__by mono">${format(m.by, { author: mod.author })}</p>
        </div>
        <span class="mod__tag mono${mod.official ? '' : ' mod__tag--third'}">${mod.official ? m.official : m.thirdParty}</span>
      </div>

      <p>${modSummary(ctx, mod)}</p>
      ${features ? html`<ul class="mod-card__features">${features.map((item) => html`<li>${icon('check', 14)}<span>${raw(item)}</span></li>`)}</ul>` : ''}

      <dl class="meta mono">
        <div><dt>${t.common.version}</dt><dd>${mod.version}</dd></div>
        ${mod.publishedAt ? html`<div><dt>${t.common.published}</dt><dd>${time(ctx, mod.publishedAt)}</dd></div>` : ''}
        <div><dt>${m.needs}</dt><dd>Stein Loader ${mod.loader}+</dd></div>
      </dl>

      ${mod.official ? '' : html`
      <div class="source-link">
        <span class="source-link__label mono">${m.sourceLabel}</span>
        <div class="source-link__row">
          <code class="source-link__url">${mod.source}</code>
          <button class="sl-btn source-link__copy" type="button" data-copy="${mod.source}" data-copied="${m.copied}" hidden>${icon('copy', 14)}<span>${m.copy}</span></button>
        </div>
      </div>`}

      ${downloadFile(ctx, { name: mod.file, url: mod.url, size: mod.size, sha256: mod.sha256 })}

      <div class="mod-card__links mono">
        <a class="inline-link" href="${mod.homepage}" rel="noopener">${m.code} ${icon('arrow', 12)}</a>
      </div>
    </article>`;
}
