import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO & Schema' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString', group: 'content', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'content', options: { source: 'title.en' }, validation: (R) => R.required() }),
    defineField({ name: 'owner', title: 'Owner', type: 'reference', to: [{ type: 'person' }], group: 'content', validation: (R) => R.required() }),
    defineField({ name: 'featuredProjects', title: 'Featured projects', type: 'array', of: [{ type: 'reference', to: [{ type: 'project' }] }], group: 'content' }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: [{ type: 'section' }], group: 'content' }),

    // ── Media ──────────────────────────────────────────────────────────
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'icon',
      group: 'media',
      description: 'SVG or 512×512 PNG. Shown in browser tabs and bookmarks.',
    }),
    defineField({
      name: 'appleTouchIcon',
      title: 'Apple touch icon',
      type: 'image',
      group: 'media',
      description: '180×180 PNG for iOS home screen shortcut.',
    }),
    defineField({
      name: 'themeColor',
      title: 'Theme color (hex)',
      type: 'string',
      group: 'media',
      description: 'e.g. #0a0a0a — used in <meta name="theme-color">.',
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).warning('Must be a hex colour, e.g. #1a2b3c'),
    }),

    // ── SEO & Schema ───────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO metadata', type: 'seoMetadata', group: 'seo' }),
    defineField({ name: 'websiteSchema', title: 'WebSite structured data', type: 'webSchema', group: 'seo', description: 'Generates the schema.org/WebSite JSON-LD block.' }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'owner.name' },
  },
})
