import type {MetadataRoute} from 'next'
import {locales} from '@/i18n/config'

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more
 * about sitemaps in Next.js here:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * `page`/`post` document types removed — this site only has the single
 * per-locale home route, so the sitemap is just that, once per locale,
 * with hreflang alternates linking the translations together. No Sanity
 * fetch needed anymore, so this is fully static with zero data dependency.
 *
 * If you add more routes later (e.g. a case-study or blog document type),
 * reintroduce a sanityFetch here and push one entry per locale per
 * document, same pattern as the home loop below.
 */
// TO_DO : det domain from env variable
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jatin.getresume.dev').replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
  }))
}