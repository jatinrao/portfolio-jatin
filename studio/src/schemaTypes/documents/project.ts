import { defineType, defineField } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'people', title: 'People & Skills' },
    { name: 'seo', title: 'SEO & Schema' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString', group: 'content', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'content', options: { source: 'title.en' }, validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localeText', group: 'content' }),
    defineField({ name: 'body', title: 'Body (rich text)', type: 'localeBlockContent', group: 'content' }),
    defineField({ name: 'projectUrl', title: 'Live URL', type: 'url', group: 'content' }),
    defineField({ name: 'repositoryUrl', title: 'Repository URL', type: 'url', group: 'content' }),
    defineField({ name: 'startDate', title: 'Start date', type: 'date', group: 'content' }),
    defineField({ name: 'endDate', title: 'End date', type: 'date', group: 'content' }),
    defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', group: 'content', initialValue: false }),

    // ── Media ──────────────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'customImage',
      group: 'media',
      description: 'Main image used in project cards and OG sharing.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'customImage' }],
      group: 'media',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail icon',
      type: 'icon',
      group: 'media',
      description: 'Small icon (SVG or PNG) for list/grid views.',
    }),

    // ── People & Skills ────────────────────────────────────────────────
    defineField({ name: 'contributors', title: 'Contributors', type: 'array', of: [{ type: 'reference', to: [{ type: 'person' }] }], group: 'people' }),
    defineField({ name: 'organization', title: 'Organization', type: 'reference', to: [{ type: 'organization' }], group: 'people' }),
    defineField({ name: 'skills', title: 'Skills / Technologies', type: 'array', of: [{ type: 'reference', to: [{ type: 'skill' }] }], group: 'people' }),

    // ── SEO & Schema ───────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO metadata', type: 'seoMetadata', group: 'seo' }),
    defineField({ name: 'structuredData', title: 'Structured data', type: 'webSchema', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'organization.name', media: 'coverImage' },
  },
})
