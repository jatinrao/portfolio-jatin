import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, isValidLocale } from '@/i18n/config';
import { LocaleHtmlSync } from '@/components/shared/LocaleHtmlSync';
import { buildLocaleMetadata, buildSiteJsonLd } from '@/lib/seo/site-metadata';

// This is the actual SSG mechanism: Next prerenders /en, /fr, /de (etc.) at
// build time as fully static HTML.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Fully static: a locale that isn't in the list above 404s instead of being
// generated on demand. Remove this if you'd rather allow lazy on-request
// generation for locales added after build (that would no longer be "pure"
// SSG for those params, though).
export const dynamicParams = false;

/**
 * Lives here (not the true root layout) because this is the first segment
 * that actually receives the `lang` param — see the note on the root
 * layout.tsx for why generateMetadata can't live there. No `slug` route
 * exists in this app, so canonical/alternate URLs are just `/{lang}`,
 * matching app/sitemap.ts. app/page.tsx (root) calls buildLocaleMetadata
 * directly with lang: 'en' for the same reason it renders English directly
 * instead of redirecting to /en — see that file.
 */
export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isValidLocale(rawLang) ? rawLang : 'en';
  return buildLocaleMetadata(lang);
}

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const siteGraph = await buildSiteJsonLd(lang);

  return (
    <>
      <LocaleHtmlSync lang={lang} />
      {siteGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }}
        />
      )}
      {children}
    </>
  );
}
