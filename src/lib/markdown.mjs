import { Marked } from 'marked';
import config from '../../site.config.mjs';
import { escape } from './html.mjs';

/**
 * Markdown for the news and the changelog. Besides GFM, it understands the two Discord marks
 * found in texts that come from there: the footnote line `-# text` and the channel mention
 * `<#channel>`, which becomes a link to the server.
 */
const subtext = {
  name: 'subtext',
  level: 'block',
  start: (src) => src.match(/^-# /m)?.index,
  tokenizer(src) {
    const match = /^-# ([^\n]+)(?:\n|$)/.exec(src);
    if (match) return { type: 'subtext', raw: match[0], tokens: this.lexer.inlineTokens(match[1]) };
  },
  renderer(token) {
    return `<p class="subtext">${this.parser.parseInline(token.tokens)}</p>\n`;
  },
};

const channel = {
  name: 'channel',
  level: 'inline',
  start: (src) => src.indexOf('<#'),
  tokenizer(src) {
    const match = /^<#([\w-]+)>/.exec(src);
    if (match) return { type: 'channel', raw: match[0], name: match[1] };
  },
  renderer(token) {
    return `<a class="channel" href="${config.discord}" rel="noopener">#${token.name}</a>`;
  },
};

/**
 * @param {string} source
 * @param {{ resolveUrl?: (href: string) => string, headingShift?: number }} [options]
 *   resolveUrl rewrites relative links and images; headingShift demotes the headings
 *   (in the changelog, each file's "# " becomes an h3 inside the page).
 */
export function renderMarkdown(source, { resolveUrl = (href) => href, headingShift = 0 } = {}) {
  const marked = new Marked({ gfm: true });
  marked.use({
    extensions: [subtext, channel],
    walkTokens(token) {
      if (token.type === 'heading') token.depth = Math.min(6, token.depth + headingShift);
      if ((token.type === 'link' || token.type === 'image') && token.href) token.href = resolveUrl(token.href);
      // HTML comments (Discord message markers) don't go to the page.
      if (token.type === 'html' && /^\s*<!--[\s\S]*-->\s*$/.test(token.raw)) token.text = '';
    },
    renderer: {
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const attrs = external ? ' rel="noopener"' : '';
        return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ''}${attrs}>${text}</a>`;
      },
      image({ href, title, text }) {
        return `<img draggable="false" src="${escape(href)}" alt="${escape(text)}" loading="lazy" decoding="async"${title ? ` title="${escape(title)}"` : ''}>`;
      },
    },
  });
  return marked.parse(source.replace(/^﻿/, ''));
}

/** Plain text of a piece of Markdown, for summaries and meta descriptions. */
export function plainText(source) {
  return source
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
