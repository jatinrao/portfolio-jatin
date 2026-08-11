import { defineType, defineField } from 'sanity'

/**
 * Extends the built-in `image` type with:
 *  - Localized alt text  (accessibility + SEO)
 *  - Localized caption   (rendered below the image on the front end)
 *  - Credit / attribution string
 *
 * Usage in a document schema:
 *   defineField({ name: 'avatar', type: 'customImage' })
 *
 * GROQ:
 *   avatar { asset->, alt, caption }
 */
export const customImage = defineType({
  name: 'customImage',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
    metadata: ['palette', 'lqip', 'blurhash'], // useful for front-end image loaders
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localeString',
      description: 'Describe the image for screen readers and search engines.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
    }),
    defineField({
      name: 'credit',
      title: 'Credit / Attribution',
      type: 'string',
      description: 'Photographer, illustrator, or source.',
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt.en', subtitle: 'caption.en' },
  },
})
