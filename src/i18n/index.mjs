import en from './en.mjs';
import es from './es.mjs';
import pt from './pt.mjs';

/**
 * The site's locales. The first is the default and lives at the root (/); the others in /<code>/.
 *
 * code       short code, used in the URL and in the content files (index.<code>.md)
 * intl       Intl locale (dates and numbers)
 * changelog  suffix of the changelog files (<version>.<suffix>.md), the one every Stein repository uses
 */
export const LOCALES = [
  { code: 'en', lang: 'en', intl: 'en-US', og: 'en_US', changelog: 'en_US', name: 'English', short: 'EN', strings: en },
  { code: 'es', lang: 'es', intl: 'es-ES', og: 'es_ES', changelog: 'es_ES', name: 'Español', short: 'ES', strings: es },
  { code: 'pt', lang: 'pt-BR', intl: 'pt-BR', og: 'pt_BR', changelog: 'pt_BR', name: 'Português', short: 'PT', strings: pt },
].map((locale, index) => ({ ...locale, prefix: index === 0 ? '' : `/${locale.code}`, isDefault: index === 0 }));

export const DEFAULT_LOCALE = LOCALES[0];

/** The order to try for a piece of content: the requested locale, then the default, then the others. */
export function fallbackOrder(locale) {
  return [locale, ...LOCALES.filter((other) => other !== locale && other.isDefault), ...LOCALES.filter((other) => other !== locale && !other.isDefault)];
}

/** Replaces {key} with the given values. */
export const format = (template, values) => template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);

/** Fails the build when a locale has more or fewer keys than the default one. */
export function checkDictionaries() {
  const keys = (value, prefix = '') =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? Object.entries(value).flatMap(([key, child]) => keys(child, prefix ? `${prefix}.${key}` : key))
      : [prefix];

  const reference = new Set(keys(DEFAULT_LOCALE.strings));
  for (const locale of LOCALES.slice(1)) {
    const own = new Set(keys(locale.strings));
    const missing = [...reference].filter((key) => !own.has(key));
    const extra = [...own].filter((key) => !reference.has(key));
    if (missing.length || extra.length) {
      throw new Error(`translations for "${locale.code}" out of sync. Missing: ${missing.join(', ') || '-'}. Extra: ${extra.join(', ') || '-'}`);
    }
  }
}
