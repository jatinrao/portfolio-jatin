import type { Metadata } from 'next'
import { locales, type Locale } from '@/i18n/config'
import { localize } from '@/lib/locale'
import { sanityFetch } from '@/sanity/lib/live'
import { METADATA_QUERY, SITE_AUTHOR_QUERY } from '@/sanity/lib/queries'
import { buildSiteJsonLdGraph, type PersonDefaults } from '@/lib/seo/build-json-ld'
import { siteUrl } from '@/lib/site-url'

/**
 * Shared by app/[lang]/layout.tsx (for every locale) and app/page.tsx (root,
 * which renders the same content as /en directly instead of redirecting to
 * it — see app/page.tsx for why). Both must produce identical output for
 * lang: 'en', which they get for free since this only depends on `lang`,
 * never on the request URL.
 */
export async function buildLocaleMetadata(lang: Locale): Promise<Metadata> {
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
    }
  }

  const title = localize(seo.metaTitle, lang) || 'Jatin Kumar | Software Engineer'
  const description = localize(seo.metaDescription, lang) || undefined
  const ogImageUrl = seo.ogImage?.asset?.url
  const twitterImageUrl = seo.twitterImage?.asset?.url ?? ogImageUrl

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
      // Always /{lang} — even called from root (lang: 'en'), this points at
      // /en, consolidating SEO signals onto the one canonical URL instead of
      // splitting them between / and /en.
      canonical: seo.canonicalUrl || pageUrl,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
        'x-default': `${siteUrl}/en`,
      },
    },
  }
}

/** Site-wide Person/WebSite/WebPage JSON-LD graph — see build-json-ld.ts. */
export async function buildSiteJsonLd(lang: Locale): Promise<Record<string, unknown> | null> {
  const authorSlug = process.env.SITE_AUTHOR_SLUG
  const res = await sanityFetch({
    query: SITE_AUTHOR_QUERY,
    params: { authorSlug: authorSlug ?? '' },
    stega: false,
  })
  const author = res.data
  // Cast: the generated GROQ result's portable-text children are typed
  // slightly stricter (required array) than lib/locale's PortableTextBlock
  // alias (optional) — same runtime shape, just typegen variance.
  return buildSiteJsonLdGraph(
    author?.structuredData,
    author?.websiteSchema,
    author as PersonDefaults | undefined,
    {lang, siteUrl},
  )
}
