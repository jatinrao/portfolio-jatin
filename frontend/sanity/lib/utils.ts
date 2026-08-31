import {dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {createDataAttribute, CreateDataAttributeProps} from 'next-sanity'
import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'
import {DereferencedLink} from '@/sanity/lib/types'

const builder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// Create an image URL builder using the client
// Export a function that can be used to get image URLs
export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

export function resolveOpenGraphImage(
  image?: SanityImageSource | null,
  width = 1200,
  height = 627,
) {
  if (!image) return
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url()
  if (!url) return
  return {url, alt: (image as {alt?: string})?.alt || '', width, height}
}

// Depending on the type of link, we need to fetch the corresponding page, post, or URL.  Otherwise return null. TO-DO: This is a temporary solution until we can implement a more robust link resolver that can handle all types of links in a more flexible way.
export function linkResolver(link: any | DereferencedLink | undefined) {
  if (!link) return null

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!link.linkType && link.href) {
    link.linkType = 'href'
  }

  switch (link.linkType) {
    case 'href':
      return link.href || null
    case 'page':
      if (link?.page && typeof link.page === 'string') {
        return `/${link.page}`
      }
    case 'post':
      if (link?.post && typeof link.post === 'string') {
        return `/posts/${link.post}`
      }
    default:
      return null
  }
}

/** Shape of the `link` Portable Text annotation (localeBlockContent.ts's
 * richTextBlock), after BLOG_BY_SLUG_QUERY/PROJECT_BY_SLUG_QUERY's
 * markDefs projection dereferences `internalRef`. */
export interface RichTextLinkMark {
  linkType?: 'external' | 'internal' | null
  href?: string | null
  internalRef?: { _type: 'blog' | 'project'; slug: string } | null
  openInNewTab?: boolean | null
}

/**
 * Resolves a rich-text `link` annotation to an href + target, for both
 * external URLs and internal blog/project references. Links authored
 * before `linkType` existed only ever had a bare `href`, so a missing
 * `linkType` with an `href` present is treated as external (same
 * accommodation the legacy `linkResolver` above made).
 */
export function resolveRichTextLink(
  link: RichTextLinkMark | null | undefined,
  locale: string,
): {href: string; target?: '_blank'} | null {
  if (!link) return null
  const linkType = link.linkType ?? (link.href ? 'external' : null)

  if (linkType === 'internal' && link.internalRef?.slug) {
    const base = link.internalRef._type === 'project' ? 'projects' : 'blog'
    return {
      href: `/${locale}/${base}/${link.internalRef.slug}`,
      target: link.openInNewTab ? '_blank' : undefined,
    }
  }

  if (linkType === 'external' && link.href) {
    return {href: link.href, target: link.openInNewTab ? '_blank' : undefined}
  }

  return null
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config)
}
