const TIME_ZONE = 'America/Sao_Paulo';
const cache = new Map();

function formatter(intl, options) {
  const key = intl + JSON.stringify(options);
  if (!cache.has(key)) cache.set(key, new Intl.DateTimeFormat(intl, { ...options, timeZone: TIME_ZONE }));
  return cache.get(key);
}

/** Oct 5, 2026 · 5 oct 2026 · 5 de out. de 2026: the short, unambiguous form used in lists. */
export const formatDate = (date, intl) =>
  formatter(intl, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));

/** October 5, 2026 · 5 de octubre de 2026 · 5 de outubro de 2026 */
export const formatLongDate = (date, intl) =>
  formatter(intl, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));

/** 2026-10-05, for the datetime attribute. */
export const isoDate = (date) => new Date(date).toISOString().slice(0, 10);

/** 14.3 MB · 14,3 MB */
export function formatBytes(bytes, intl) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit++;
  }
  return `${value.toLocaleString(intl, { maximumFractionDigits: unit < 2 ? 0 : 1 })} ${units[unit]}`;
}

/** Compares x.y.z versions (numerically, field by field). */
export function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff) return diff;
  }
  return 0;
}
