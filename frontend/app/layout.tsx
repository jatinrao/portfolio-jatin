import './globals.css'
import type {Metadata} from 'next'
import {Inter, IBM_Plex_Mono} from 'next/font/google'
import {sanityFetch, } from '@/sanity/lib/live'
import {METADATA_QUERY} from '@/sanity/lib/queries'
import {defaultLocale} from '@/i18n/config'
import { isRtlLocale, localize } from '@/lib/locale'
import GoogleAnalytics from '@/components/shared/GoogleAnalytics'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 *
 * Not locale-aware yet: this lives on the true root layout (above
 * app/[lang]/**), so it has no `lang` param to key off of. If `settings`
 * ever becomes localized in Sanity, move this into app/[lang]/layout.tsx
 * (which does receive `params`) so it can fetch/return per-locale copy.
 */
export async function generateMetadata({params}:any): Promise<Metadata> {
  const { lang, slug } = params;
  
  const res = await sanityFetch({
    query: METADATA_QUERY,
    // Metadata should never contain stega
    stega: false,
  })
  const seo = res.data?.seo
  if (!seo) {
    return {
      title: "Jatin Kumar | Software Engineer",
      
    };
  }

  const title = localize(seo.metaTitle,lang) ?? "Jatin Kumar | Software Engineer";
  const description = localize(seo.metaDescription,lang) ?? "Desc";
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
      title: seo.ogTitle?.en ?? title,
      description: seo.ogDescription?.en ?? description,
      siteName: seo.ogSiteName ?? "Jatin Kumar — Portfolio",
      type: (seo.ogType as "website" | "profile" | "article") ?? "website",
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: seo.ogImage?.asset?.metadata?.dimensions?.width ?? 1200,
              height: seo.ogImage?.asset?.metadata?.dimensions?.height ?? 630,
              alt: seo.ogImage?.alt?.en ?? title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: (seo.twitterCard as "summary" | "summary_large_image") ?? "summary_large_image",
      title: seo.twitterTitle?.en ?? title,
      description: seo.twitterDescription?.en ?? description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
    alternates: {
      canonical: `https://jatin.getresume.dev/${lang}/${slug}`,
      languages: {
        "en": `https://jatin.getresume.dev/en/${slug}`,
        "en-US": `https://jatin.getresume.dev/en/${slug}`,
        "es": `https://jatin.getresume.dev/es/${slug}`,
        "fr": `https://jatin.getresume.dev/fr/${slug}`,
        "x-default": `https://jatin.getresume.dev/en/${slug}`, // fallback for unmatched locales
      },
    },
  };
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})


 export default async function RootLayout({children}: LayoutProps<'/'>) {

  return (
    // `lang` is kept at the build-time default here on purpose — this
    // layout is the ONE place <html> can be declared (nested layouts can't
    // redeclare it), but it sits above app/[lang]/**, so it has no `lang`
    // param yet. app/[lang]/layout.tsx renders <LocaleHtmlSync> to correct
    // `document.documentElement.lang` client-side once the real locale is
    // known — see that file for why draftMode() here doesn't interfere
    // with static generation of the [lang] routes.
    <html
      lang={defaultLocale}
      dir={isRtlLocale(defaultLocale) ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${ibmPlexMono.variable} bg-surface text-on-surface`}
    >
      <body>
        <section className="min-h-screen">
          <main className="">{children}</main>
        </section>
        <GoogleAnalytics/>
      </body>
    </html>
  )
}