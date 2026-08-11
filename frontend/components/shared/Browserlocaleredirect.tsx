'use client';
 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales, localeCookieName, defaultLocale, type Locale } from '@/i18n/config';
import { matchLocale } from '@/i18n/matchLocale';
 
export function BrowserLocaleRedirect() {
  const router = useRouter();
 
  useEffect(() => {
    const preferences =
      typeof navigator !== 'undefined' && navigator.languages?.length
        ? [...navigator.languages]
        : [navigator.language ?? defaultLocale];
 
    const locale: Locale = matchLocale(preferences);
 
    document.cookie = `${localeCookieName}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.replace(`/${locale}`);
  }, [router]);
 
  return null;
}
 
// Re-exported only so this file can also serve as the single source of
// "which locales get a visible fallback link" in the no-JS markup below.
export { locales };