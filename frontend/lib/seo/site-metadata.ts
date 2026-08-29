import type { Metadata } from 'next'
import { locales, type Locale } from '@/i18n/config'
import { localize } from '@/lib/locale'
import { sanityFetch } from '@/sanity/lib/live'
import { METADATA_QUERY, SITE_AUTHOR_QUERY } from '@/sanity/lib/queries'
import { buildSiteJsonLdGraph, type PersonDefaults } from '@/lib/seo/build-json-ld'
import { siteUrl } from '@/lib/site-url'
import type { BLOG_BY_SLUG_QUERY_RESULT } from '@/sanity.types'

/**
 * Shared by app/[lang]/layout.tsx (for every locale) and app/page.tsx (root,
 * which renders the same content as /en directly instead of redirecting to
 * it — see app/page.tsx for why). Both must produce identical output for
 * lang: 'en', which they get for free since this only depends on `lang`,
 * never on the request URL.
 */
/**
 * Sanity's image CDN accepts resize params directly on the asset URL
 * (`?w=&h=&fit=`) — no need to route through the image-url builder, which
 * expects a raw (non-dereferenced) asset reference and our queries already
 * dereference straight to `asset->url`.
 */
function sanitySquareUrl(url: string, size: number): string {
  return `${url}?w=${size}&h=${size}&fit=crop&auto=format`
}

/** Built from the `person.logoImage` field (same asset the header logo uses) so favicon/apple-icon/OG fallback all stay in sync with whatever's set in the CMS. */
function buildLogoIcons(logoImageUrl: string | undefined) {
  if (!logoImageUrl) return undefined
  return {
    icon: [
      { url: sanitySquareUrl(logoImageUrl, 32), sizes: '32x32', type: 'image/png' },
      { url: sanitySquareUrl(logoImageUrl, 16), sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: sanitySquareUrl(logoImageUrl, 180), sizes: '180x180', type: 'image/png' }],
  }
}

export async function buildLocaleMetadata(lang: Locale): Promise<Metadata> {
  const res = await sanityFetch({
    query: METADATA_QUERY,
    // Metadata should never contain stega
    stega: false,
  })
  const seo = res.data?.seo
  const logoImage = res.data?.logoImage
  const logoImageUrl = logoImage?.asset?.url ?? undefined
  const icons = buildLogoIcons(logoImageUrl)
  const pageUrl = `${siteUrl}/${lang}`

  if (!seo) {
    return {
      title: 'Jatin Kumar | Software Engineer',
      alternates: { canonical: pageUrl },
      icons,
    }
  }

  const title = localize(seo.metaTitle, lang) || 'Jatin Kumar | Software Engineer'
  const description = localize(seo.metaDescription, lang) || undefined
  // Falls back to the header logo when no dedicated OG/Twitter image has
  // been set in the CMS yet, so link previews (Slack, WhatsApp, iMessage,
  // Google) always have something to show instead of a blank card.
  const ogImageUrl = seo.ogImage?.asset?.url ?? logoImageUrl
  const twitterImageUrl = seo.twitterImage?.asset?.url ?? ogImageUrl
  const usingLogoAsOgImage = !seo.ogImage?.asset?.url && !!logoImageUrl

  return {
    title,
    description,
    keywords: seo.keywords ?? undefined,
    robots: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
    },
    icons,
    openGraph: {
      title: localize(seo.ogTitle, lang) || title,
      description: localize(seo.ogDescription, lang) || description,
      siteName: seo.ogSiteName ?? 'Jatin Kumar — Portfolio',
      type: (seo.ogType as 'website' | 'profile' | 'article') ?? 'website',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: usingLogoAsOgImage
                ? logoImage?.asset?.metadata?.dimensions?.width ?? 192
                : seo.ogImage?.asset?.metadata?.dimensions?.width ?? 1200,
              height: usingLogoAsOgImage
                ? logoImage?.asset?.metadata?.dimensions?.height ?? 192
                : seo.ogImage?.asset?.metadata?.dimensions?.height ?? 630,
              alt: localize(seo.ogImage?.alt, lang) || localize(logoImage?.alt, lang) || title,
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

/**
 * Per-post metadata for app/[lang]/blog/[slug]/page.tsx — same
 * seo-field-with-fallback pattern as buildLocaleMetadata above, but scoped
 * to one blog post: title/description fall back to `title`/`dek`, and the
 * OG/Twitter image falls back to `coverImage` when no dedicated seo.ogImage
 * is set.
 */
export function buildBlogPostMetadata(
  post: NonNullable<BLOG_BY_SLUG_QUERY_RESULT>,
  lang: Locale,
): Metadata {
  const seo = post.seo
  const title = localize(seo?.metaTitle, lang) || localize(post.title, lang)
  const description = localize(seo?.metaDescription, lang) || localize(post.dek, lang)
  const pageUrl = `${siteUrl}/${lang}/blog/${post.slug.current}`

  const ogImage = seo?.ogImage?.asset?.url ?? post.coverImage?.asset?.url
  const ogImageAlt =
    localize(seo?.ogImage?.alt, lang) || localize(post.coverImage?.alt, lang) || title
  const ogImageWidth = seo?.ogImage?.asset?.metadata?.dimensions?.width ??
    post.coverImage?.asset?.metadata?.dimensions?.width ?? 1200
  const ogImageHeight = seo?.ogImage?.asset?.metadata?.dimensions?.height ??
    post.coverImage?.asset?.metadata?.dimensions?.height ?? 630

  return {
    title,
    description: description || undefined,
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noFollow,
    },
    openGraph: {
      title: localize(seo?.ogTitle, lang) || title,
      description: localize(seo?.ogDescription, lang) || description || undefined,
      type: 'article',
      publishedTime: post.publishedDate,
      images: ogImage ? [{ url: ogImage, width: ogImageWidth, height: ogImageHeight, alt: ogImageAlt }] : undefined,
    },
    twitter: {
      card: (seo?.twitterCard as 'summary' | 'summary_large_image') ?? 'summary_large_image',
      title: localize(seo?.twitterTitle, lang) || title,
      description: localize(seo?.twitterDescription, lang) || description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: seo?.canonicalUrl || pageUrl,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/blog/${post.slug.current}`])),
        'x-default': `${siteUrl}/en/blog/${post.slug.current}`,
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
