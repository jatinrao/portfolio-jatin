import type { Metadata } from 'next';
import Link from 'next/link';
import { locales } from '@/i18n/config';
import { BrowserLocaleRedirect } from '@/components/shared/Browserlocaleredirect';
import PortfolioTemplate from '@/components/templates/LandingPage';
import { buildLocaleMetadata, buildSiteJsonLd } from '@/lib/seo/site-metadata';

/**
 * Root renders the same content as /en directly instead of redirecting to
 * it. Redirecting unconditionally (middleware on Vercel, client-side JS here
 * on the Cloudflare static export, which has no server for middleware to
 * run on at all) meant every single visitor — and every non-JS crawler,
 * schema validator, or social-card scraper — got nothing at `/` but a
 * redirect: an extra round trip for real browsers, and literally no content
 * for anything that doesn't execute JS (see the schema.org validator
 * failing on `/` while `/en` validated fine).
 *
 * generateMetadata/buildSiteJsonLd are called with lang: 'en' — identical to
 * what /en produces, including `alternates.canonical` pointing at /en (not
 * `/`), so this consolidates as one page for SEO rather than splitting
 * signals between two URLs.
 *
 * BrowserLocaleRedirect (below) still exists for the *non*-English case: a
 * French-preferring visitor lands here first, then gets redirected to /fr.
 * It now only redirects on an actual locale mismatch — English visitors see
 * real content immediately with no redirect at all.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildLocaleMetadata('en');
}

export default async function RootPage() {
  const siteGraph = await buildSiteJsonLd('en');

  return (
    <>
      {siteGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }}
        />
      )}
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
      <PortfolioTemplate lang="en" />
    </>
  );
}
