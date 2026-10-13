/**
 * Front matter in the simplest YAML form: `key: value` per line, between two `---` lines.
 * Accepts strings (quoted or not), numbers, booleans and inline lists (`[a, b]`).
 * Enough for the news; anything else is an error, not a silent value.
 */
export function parseFrontMatter(source, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { data: {}, body: source };

  const data = {};
  match[1].split(/\r?\n/).forEach((line, index) => {
    if (!line.trim() || line.trimStart().startsWith('#')) return;
    const pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!pair) throw new Error(`${file}: invalid front matter on line ${index + 2}: "${line}"`);
    data[pair[1]] = parseValue(pair[2].trim());
  });
  return { data, body: source.slice(match[0].length) };
}

function parseValue(value) {
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).split(',').map((item) => parseValue(item.trim())).filter((item) => item !== '');
  }
  const quoted = /^(['"])([\s\S]*)\1$/.exec(value);
  return quoted ? quoted[2].replace(/\\"/g, '"') : value;
}
