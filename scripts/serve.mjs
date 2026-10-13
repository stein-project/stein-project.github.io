#!/usr/bin/env node
/**
 * Static server for dist/, to check the site locally (the way GitHub Pages serves it:
 * /folder/ → /folder/index.html and 404.html for the rest).
 *
 *   node scripts/serve.mjs [port]     default: 4000
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 4000);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

async function resolve(pathname) {
  const file = path.join(DIST, decodeURIComponent(pathname));
  if (!file.startsWith(DIST)) return null;
  try {
    const info = await stat(file);
    return info.isDirectory() ? path.join(file, 'index.html') : file;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost');
  const file = await resolve(pathname);
  try {
    const body = await readFile(file ?? '');
    response.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': TYPES['.html'] });
    response.end(await readFile(path.join(DIST, '404.html')).catch(() => 'Not found'));
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
