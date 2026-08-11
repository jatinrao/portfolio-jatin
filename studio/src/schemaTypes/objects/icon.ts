import { defineType, defineField } from 'sanity'

/**
 * Icon asset — accepts SVG and raster images (PNG, WebP).
 *
 * Hotspot is disabled because icon crops are handled by the front end.
 * The image pipeline (cropping, format conversion) doesn't apply to SVG
 * files, so SVGs are served as-is via the CDN asset URL.
 *
 * Usage:
 *   defineField({ name: 'icon', type: 'icon' })
 *
 * GROQ:
 *   icon { asset->{ url, mimeType }, alt }
 *
 * Front-end tip:
 *   if (icon.asset.mimeType === 'image/svg+xml') {
 *     // render as <img> or inline fetch the SVG source
 *   } else {
 *     // use @sanity/image-url builder as usual
 *   }
 */
export const icon = defineType({
  name: 'icon',
  title: 'Icon',
  type: 'image',
  options: {
    hotspot: false,
    accept: 'image/svg+xml, image/png, image/webp',
    metadata: [], // Skip expensive palette/lqip extraction for small icons
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localeString',
      description: 'Describe the icon for screen readers.',
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt.en' },
    prepare({ media, title }: { media?: unknown; title?: string }) {
      return { media, title: title || 'Icon' }
    },
  },
})
