// Single source of truth for supported languages. Update this list and
// every piece of locale logic (middleware, SSG params, client fallback)
// picks it up automatically.
export const locales = ["en", "es", "fr", "zh","hi","ar"] as const;
 
export type Locale = (typeof locales)[number];
 
export const defaultLocale: Locale = 'en';
 
export const localeCookieName = 'NEXT_LOCALE';
 
export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}