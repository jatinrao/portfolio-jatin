import { defineType, defineField } from 'sanity'
import { EditIcon } from '@sanity/icons'

export const blog = defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  icon: EditIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'body', title: 'Body' },
    { name: 'seo', title: 'SEO & Schema' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString', group: 'content', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'content', options: { source: 'title.en' }, validation: (R) => R.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      description: 'Eyebrow badge above the headline, e.g. "Update", "Shipping Notes".',
      options: {
        list: ['Update', 'News', 'Shipping Notes', 'Press Release'],
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'dek', title: 'Dek', type: 'localeText', group: 'content', description: 'Subhead under the headline — also the meta-description fallback.', validation: (R) => R.required() }),
    defineField({ name: 'publishedDate', title: 'Published date', type: 'date', group: 'content', validation: (R) => R.required() }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'person' }], group: 'content' }),
    defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', group: 'content', initialValue: false }),

    // ── Media ──────────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'customImage',
      group: 'media',
      description: 'Full-width hero image and OG sharing image.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'media',
      description: 'Optional stat strip shown below the hero (e.g. "633 bundled icons"). Leave empty to omit.',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // ── Body ───────────────────────────────────────────────────────────
    defineField({ name: 'body', title: 'Body', type: 'blogBlockContent', group: 'body' }),
    defineField({
      name: 'footerLinks',
      title: 'Footer links',
      type: 'array',
      group: 'body',
      description: 'Optional list of links shown at the end of the article.',
      of: [
        {
          type: 'object',
          name: 'footerLink',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        },
      ],
    }),

    // ── SEO & Schema ───────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO metadata', type: 'seoMetadata', group: 'seo' }),
    defineField({ name: 'structuredData', title: 'Structured data', type: 'webSchema', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'category', media: 'coverImage' },
  },
})
