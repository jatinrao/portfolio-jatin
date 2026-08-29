import type {MetadataRoute} from 'next'
import {locales} from '@/i18n/config'
import {siteUrl} from '@/lib/site-url'
import {client} from '@/sanity/lib/client'
import {blogSlugs} from '@/sanity/lib/queries'

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more
 * about sitemaps in Next.js here:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * `page`/`post` document types were removed, leaving only the single
 * per-locale home route — this reintroduces a Sanity fetch for the `blog`
 * document type, added once real content routes existed to list, per the
 * comment this replaced.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
  }))

  const blogListPages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${siteUrl}/${locale}/blog`,
    lastModified: new Date(),
    priority: 0.6,
    changeFrequency: 'weekly',
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/blog`])),
    },
  }))

  const slugs = await client.fetch<{slug: string}[]>(blogSlugs)
  const blogPosts: MetadataRoute.Sitemap = (slugs ?? []).flatMap(({slug}) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}/blog/${slug}`,
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: 'monthly' as const,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/blog/${slug}`])),
      },
    })),
  )

  return [...home, ...blogListPages, ...blogPosts]
}