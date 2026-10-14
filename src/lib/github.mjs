import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API = 'https://api.github.com';
const USER_AGENT = { 'User-Agent': 'stein-site-build' };
const CHANGELOG_FILE = /^(\d+(?:\.\d+)*)\.([a-z]{2}_[A-Z]{2})\.md$/;

/**
 * Everything the build reads from GitHub, in one object that is cached in `.cache/data.json`
 * for the offline build (`--offline`) used in local development:
 *
 *   products   releases of each product, by product id
 *   mods       every mod from the official and third-party sources, with its releases
 *   notes      changelog files by repository, version and changelog locale (en_US, pt_BR...)
 *
 * With GITHUB_TOKEN in the environment (CI has one), the API limit goes from 60 to 1,000+ an
 * hour. The indexes and the changelog files come from the CDN and don't count against it.
 *
 * @returns {Promise<SiteData>}
 */
export async function loadData({ config, cacheDir, offline }) {
  const cacheFile = path.join(cacheDir, 'data.json');

  if (offline) {
    try {
      return JSON.parse(await readFile(cacheFile, 'utf8'));
    } catch {
      throw new Error(`offline build without a cache: run "npm run build" once with internet access (${cacheFile})`);
    }
  }

  const index = await firstJson(config.modIndex);
  const sources = [
    ...(index.sources ?? []).map((url) => ({ url, official: true })),
    ...config.thirdPartySources.map((url) => ({ url, official: false })),
  ];

  const [products, modLists] = await Promise.all([
    Promise.all(config.products.map(async (product) => [product.id, await productReleases(product.releases)])),
    Promise.all(sources.map(loadSource)),
  ]);
  const mods = modLists.flat();

  const repos = new Set([...config.products.map((product) => product.changelog).filter(Boolean), ...mods.map((mod) => mod.repo)]);
  const notes = Object.fromEntries(await Promise.all([...repos].map(async (repo) => [repo, await fetchChangelog(repo)])));

  const data = { products: Object.fromEntries(products), mods, notes };
  await mkdir(cacheDir, { recursive: true });
  await writeFile(cacheFile, JSON.stringify(data, null, 2));
  return data;
}

/** The mods of one steinmods.json, each with the releases of the repository it comes from. */
async function loadSource({ url, official }) {
  const index = await fetchJson(url);
  const repo = repoOf(index.homepage) ?? repoOf(url);
  if (!repo) throw new Error(`${url}: no GitHub repository in "homepage" or in the source address`);
  const releases = await fetchReleases(repo);

  return (index.mods ?? []).map((mod) => {
    const release = releases.find((item) => item.version === mod.version);
    return {
      id: mod.id,
      name: mod.name,
      file: mod.file,
      version: mod.version,
      url: mod.url,
      sha256: mod.sha256,
      loader: mod.loader,
      description: mod.description ?? '',
      author: index.author ?? '',
      homepage: index.homepage ?? `https://github.com/${repo}`,
      source: url,
      repo,
      official,
      publishedAt: release?.publishedAt ?? null,
      size: release?.assets.find((asset) => asset.name === mod.file)?.size ?? null,
      releases,
    };
  });
}

/** owner/repo from a github.com address, or null. */
function repoOf(url) {
  const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)/.exec(url ?? '');
  return match ? `${match[1]}/${match[2]}` : null;
}

function apiHeaders() {
  const headers = { ...USER_AGENT, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: USER_AGENT });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.json();
}

/** The first of the addresses that answers, as JSON. */
async function firstJson(urls) {
  let last;
  for (const url of urls) {
    try {
      return await fetchJson(url);
    } catch (error) {
      last = error;
    }
  }
  throw last;
}

/** The releases of every repository of a product, together, newest first. */
async function productReleases(repos) {
  const lists = await Promise.all(repos.map(fetchReleases));
  return lists.flat().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

/** Published releases, newest first, without drafts or pre-releases. */
async function fetchReleases(repo) {
  const response = await fetch(`${API}/repos/${repo}/releases?per_page=100`, { headers: apiHeaders() });
  // A product whose repository isn't public yet simply doesn't show up.
  if (response.status === 404) {
    console.warn(`warning: ${repo} not found; it is left out`);
    return [];
  }
  if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${repo}: ${await response.text()}`);

  const list = await response.json();
  return list
    .filter((release) => !release.draft && !release.prerelease)
    .map((release) => ({
      repo,
      tag: release.tag_name,
      version: release.tag_name.replace(/^v/, ''),
      name: release.name,
      url: release.html_url,
      publishedAt: release.published_at,
      body: release.body ?? '',
      assets: release.assets.map((asset) => ({
        name: asset.name,
        size: asset.size,
        url: asset.browser_download_url,
        sha256: asset.digest?.startsWith('sha256:') ? asset.digest.slice(7) : null,
      })),
    }))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

/**
 * The changelog/<version>.<locale>.md files of a repository, as { version: { locale: text } }.
 * A repository without the folder gives an empty object: its notes come from the release body.
 */
async function fetchChangelog(repo) {
  const response = await fetch(`${API}/repos/${repo}/contents/changelog`, { headers: apiHeaders() });
  if (response.status === 404) return {};
  if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${repo}/changelog: ${await response.text()}`);

  const notes = {};
  const files = (await response.json()).filter((file) => CHANGELOG_FILE.test(file.name));
  await Promise.all(
    files.map(async (file) => {
      const [, version, locale] = CHANGELOG_FILE.exec(file.name);
      const text = await fetch(file.download_url, { headers: USER_AGENT });
      if (!text.ok) throw new Error(`${file.download_url} answered ${text.status}`);
      (notes[version] ??= {})[locale] = await text.text();
    }),
  );
  return notes;
}

/**
 * @typedef {{ repo: string, tag: string, version: string, name: string, url: string, publishedAt: string, body: string,
 *   assets: { name: string, size: number, url: string, sha256: string | null }[] }} Release
 * @typedef {{ id: string, name: string, file: string, version: string, url: string, sha256: string,
 *   loader: string, description: string, author: string, homepage: string, source: string, repo: string,
 *   official: boolean, publishedAt: string | null, size: number | null, releases: Release[] }} Mod
 * @typedef {{ products: Record<string, Release[]>, mods: Mod[],
 *   notes: Record<string, Record<string, Record<string, string>>> }} SiteData
 */
