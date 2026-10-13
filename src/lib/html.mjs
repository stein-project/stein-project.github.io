/**
 * Template literal with automatic escaping. Everything interpolated is escaped, except values
 * marked with `raw()` (already trusted HTML, such as the result of another `html`).
 * Arrays are joined; null, undefined and false become an empty string.
 */
const RAW = Symbol('raw');

export function raw(value) {
  return { [RAW]: true, value: String(value ?? '') };
}

export function escape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function render(value) {
  if (value == null || value === false) return '';
  if (Array.isArray(value)) return value.map(render).join('');
  if (typeof value === 'object' && value[RAW]) return value.value;
  return escape(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return raw(out);
}

export const toString = (fragment) => render(fragment);
