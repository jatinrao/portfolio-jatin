import Link from 'next/link';
import { locales } from '@/i18n/config';
import { BrowserLocaleRedirect } from '@/components/shared/Browserlocaleredirect';
 
// In a normal (non-static-export) deployment, middleware.ts already
// redirects `/` before this page is ever rendered — this file exists as a
// fallback for `output: 'export'`/CDN-only setups where middleware doesn't
// run at all, and as a no-JS safety net (the links below) in case client
// JS fails to execute for any visitor who does reach this shell.
export default function RootFallbackPage() {
  return (
    <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <BrowserLocaleRedirect />
      <noscript>
        <ul>
          {locales.map((locale) => (
            <li key={locale}>
              <Link href={`/${locale}`}>{locale}</Link>
            </li>
          ))}
        </ul>
      </noscript>
    </main>
  );
}