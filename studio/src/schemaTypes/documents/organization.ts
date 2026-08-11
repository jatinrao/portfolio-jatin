import { defineType, defineField } from 'sanity'

export const organization = defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO & Schema' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'localeString', group: 'identity', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'identity', options: { source: 'name' }, validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localeText', group: 'identity' }),
    defineField({ name: 'website', title: 'Website', type: 'url', group: 'identity' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string', group: 'identity' }),
    defineField({ name: 'location', title: 'Location', type: 'string', group: 'identity' }),

    // ── Media ──────────────────────────────────────────────────────────
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'customImage',
      group: 'media',
      description: 'Full-colour logo. Hotspot enabled for responsive cropping.',
    }),
    defineField({
      name: 'logoMark',
      title: 'Logo mark / icon',
      type: 'icon',
      group: 'media',
      description: 'Square symbol / favicon variant of the logo. Accepts SVG or PNG.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'customImage',
      group: 'media',
    }),

    // ── SEO & Schema ───────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO metadata', type: 'seoMetadata', group: 'seo' }),
    defineField({ name: 'structuredData', title: 'Structured data', type: 'webSchema', group: 'seo' }),
  ],
  preview: {
    select: { title: 'name.en', subtitle: 'industry', media: 'logo' },
  },
})
