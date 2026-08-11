import { locales, defaultLocale, type Locale } from './config';
 
/**
 * Given an ordered list of language preferences (e.g. from `Accept-Language`
 * or `navigator.languages`), returns the first supported locale, matching
 * both exact codes ("fr-CA") and base language prefixes ("fr-CA" -> "fr").
 * Falls back to `defaultLocale` if nothing matches.
 */
export function matchLocale(preferences: string[]): Locale {
  for (const preference of preferences) {
    const normalized = preference.trim().toLowerCase();
    if (!normalized) continue;
 
    const exact = locales.find((locale) => locale.toLowerCase() === normalized);
    if (exact) return exact;
 
    const base = normalized.split('-')[0];
    const baseMatch = locales.find((locale) => locale.toLowerCase() === base);
    if (baseMatch) return baseMatch;
  }
 
  return defaultLocale;
}
 
/**
 * Parses a raw `Accept-Language` header value ("fr-CA,fr;q=0.9,en;q=0.8")
 * into an ordered array of language tags, highest quality first.
 */
export function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
 
  return header
    .split(',')
    .map((part) => {
      const [tag, qValue] = part.trim().split(';q=');
      return { tag, quality: qValue ? parseFloat(qValue) : 1 };
    })
    .sort((a, b) => b.quality - a.quality)
    .map((entry) => entry.tag);
}
 