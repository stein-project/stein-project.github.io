# Stein Project — website

The Stein Project website: Stein Client downloads, the mods, news and the changelog. It is published on
GitHub Pages in English (the default, at the root), Spanish (`/es/`) and Portuguese (`/pt/`).

The site is static, built by a Node script with no framework. Its look is the Stein Client design system,
copied unchanged into `static/assets/css/ds/`.

## Development

Requires Node 20 or newer.

```sh
npm install
npm run build        # builds dist/ from the releases and mod indexes on GitHub
npm run dev          # offline build, with drafts, and a server at http://localhost:4000
```

`npm run build` caches what it reads in `.cache/`; after that, `npm run build:offline` works without a
network. With `GITHUB_TOKEN` in the environment, the GitHub API limit goes from 60 to over 1,000 requests
an hour.

## Layout

```
content/news/<YYYY-MM-DD>-<slug>/   a post: index.en.md, index.es.md, index.pt.md and its images
design/og.html                      source of the share image (static/assets/img/og.png)
scripts/build.mjs                   builds dist/
scripts/serve.mjs                   local server for dist/
site.config.mjs                     links, products and mod sources
src/i18n/                           interface texts, one file per locale
src/lib/                            GitHub data, content, Markdown and formatting
src/templates/                      the pages
static/                             copied as is into dist/
```

## Where the content comes from

Only the news live in this repository. Everything else is read from GitHub on every build, so a release
shows up on the site without anyone touching it.

### Downloads

The latest release of each product in `site.config.mjs` (`products`): version, date, size and SHA-256.
A product with no release doesn't show up. The Stein Client buttons point to
`releases/latest/download/SteinClient.exe`, which never goes stale.

### Mods

The official mods are the `sources` of the Stein Loader index (`modIndex`), the same list Stein Client and
the installer read: a mod added there shows up here on the next build. Third-party mods are the indexes in
`thirdPartySources`. Each index is a `steinmods.json` published with the mod's releases; the site shows its
version, file, SHA-256, minimum Loader and, for third-party mods, the source link to paste in Stein Client.

What each mod does comes from `mods.summaries` and `mods.features` in `src/i18n/<locale>.mjs`; a mod
without them shows the `description` from its index.

### Changelog

Every published release of the products and the mods. The notes come from `changelog/<version>.<locale>.md`
in the public source repository; a version without them shows the English release
body, without the install instructions and checksums. A locale without its file shows the
text in English with a badge.

### News

One folder per post, one file per locale; one locale is enough, the others show that text with a notice.

```md
---
title: "In development: Stein GFX"
date: 2026-10-03
summary: "One sentence for the lists, the feed and link previews."
cover: 1-title.png
tags: [stein-gfx]
draft: false
---

Markdown text. Images relative to the folder: ![description](chart.png)
```

`title` is required. `date` is optional (default: the date in the folder name). With `draft: true`, the
post only shows in `npm run dev`. The Markdown also takes the Discord marks `-# footnote` and `<#channel>`
(a link to the server), so texts from there can be reused.

### Interface texts

In `src/i18n/<locale>.mjs`. The build fails when a locale has more or fewer keys than English.

## Publishing

`.github/workflows/deploy.yml` builds and publishes the site:

- on every push to `main`;
- on a `repository_dispatch` of type `release-published` or `content-updated`;
- every hour, so downloads, mods and changelog follow the releases;
- by hand, in Actions → Deploy → Run workflow.

One-time setup in the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

A release workflow elsewhere can refresh the site right away instead of waiting for the hour, with a token
that has **Contents: Read and write** on this repository:

```sh
gh api "repos/<owner>/<this-repository>/dispatches" -f event_type=release-published
```

## License

[Mozilla Public License 2.0](LICENSE).
