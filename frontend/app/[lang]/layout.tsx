import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, isValidLocale } from '@/i18n/config';
import { LocaleHtmlSync } from '@/components/shared/LocaleHtmlSync';
import { localize } from '@/lib/locale';
import { sanityFetch } from '@/sanity/lib/live';
import { METADATA_QUERY } from '@/sanity/lib/queries';
import { buildJsonLd, type PersonDefaults } from '@/lib/seo/build-json-ld';

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

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jatin.getresume.dev').replace(/\/$/, '')

/**
 * Lives here (not the true root layout) because this is the first segment
 * that actually receives the `lang` param — see the note on the root
 * layout.tsx for why generateMetadata can't live there. No `slug` route
 * exists in this app, so canonical/alternate URLs are just `/{lang}`,
 * matching app/sitemap.ts.
 */
export async function generateMetadata({ params }: LangLayoutProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isValidLocale(rawLang) ? rawLang : 'en';

  const res = await sanityFetch({
    query: METADATA_QUERY,
    // Metadata should never contain stega
    stega: false,
  })
  const seo = res.data?.seo
  const pageUrl = `${siteUrl}/${lang}`

  if (!seo) {
    return {
      title: 'Jatin Kumar | Software Engineer',
      alternates: { canonical: pageUrl },
    };
  }

  const title = localize(seo.metaTitle, lang) || 'Jatin Kumar | Software Engineer';
  const description = localize(seo.metaDescription, lang) || undefined;
  const ogImageUrl = seo.ogImage?.asset?.url;
  const twitterImageUrl = seo.twitterImage?.asset?.url ?? ogImageUrl;

  return {
    title,
    description,
    keywords: seo.keywords ?? undefined,
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
    },
    openGraph: {
      title: localize(seo.ogTitle, lang) || title,
      description: localize(seo.ogDescription, lang) || description,
      siteName: seo.ogSiteName ?? 'Jatin Kumar — Portfolio',
      type: (seo.ogType as 'website' | 'profile' | 'article') ?? 'website',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: seo.ogImage?.asset?.metadata?.dimensions?.width ?? 1200,
              height: seo.ogImage?.asset?.metadata?.dimensions?.height ?? 630,
              alt: localize(seo.ogImage?.alt, lang) || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: (seo.twitterCard as 'summary' | 'summary_large_image') ?? 'summary_large_image',
      title: localize(seo.twitterTitle, lang) || title,
      description: localize(seo.twitterDescription, lang) || description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
        'x-default': `${siteUrl}/en`,
      },
    },
  };
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

  const res = await sanityFetch({
    query: METADATA_QUERY,
    stega: false,
  })
  const person = res.data
  // Cast: the generated GROQ result's portable-text children are typed
  // slightly stricter (required array) than lib/locale's PortableTextBlock
  // alias (optional) — same runtime shape, just typegen variance.
  const jsonLd = buildJsonLd(person?.structuredData, person as PersonDefaults | undefined, {
    lang,
    pageUrl: `${siteUrl}/${lang}`,
  })

  return (
    <>
      <LocaleHtmlSync lang={lang} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}