import { defineType, defineField } from 'sanity'

/**
 * Reusable SEO metadata block.
 * Add to any document that represents a public URL:
 *
 *   defineField({ name: 'seo', title: 'SEO', type: 'seoMetadata' })
 *
 * All fields have sensible fallback semantics — the front end should
 * use metaTitle || document.title, metaDescription || document.bio, etc.
 */
export const seoMetadata = defineType({
  name: 'seoMetadata',
  title: 'SEO metadata',
  type: 'object',
  groups: [
    { name: 'basic', title: 'Basic', default: true },
    { name: 'og', title: 'Open Graph' },
    { name: 'twitter', title: 'Twitter / X' },
    { name: 'advanced', title: 'Advanced' },
  ],
  fields: [
    // ── Basic ───────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'localeString',
      group: 'basic',
      description: 'Appears in the browser tab and search results. Aim for 50–60 characters.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'localeText',
      group: 'basic',
      description: 'Shown in search result snippets. Aim for 150–160 characters.',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'basic',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'basic',
      description: 'Override the canonical URL if this content is syndicated or has duplicate paths.',
      validation: (Rule) => Rule.uri({ scheme: ['https', 'http'] }),
    }),

    // ── Open Graph ──────────────────────────────────────────────────────
    defineField({
      name: 'ogTitle',
      title: 'OG title',
      type: 'localeString',
      group: 'og',
      description: 'Overrides Meta title for social sharing. Falls back to Meta title.',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG description',
      type: 'localeText',
      group: 'og',
      description: 'Overrides Meta description for social sharing.',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG image',
      type: 'image',
      group: 'og',
      options: { hotspot: true },
      description: 'Recommended: 1200×630 px. Used for Facebook, LinkedIn previews.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'localeString',
        }),
      ],
    }),
    defineField({
      name: 'ogType',
      title: 'OG type',
      type: 'string',
      group: 'og',
      options: {
        list: [
          { title: 'Website', value: 'website' },
          { title: 'Profile', value: 'profile' },
          { title: 'Article', value: 'article' },
        ],
      },
      initialValue: 'website',
    }),

    // ── Twitter / X ─────────────────────────────────────────────────────
    defineField({
      name: 'twitterCard',
      title: 'Twitter card type',
      type: 'string',
      group: 'twitter',
      options: {
        list: [
          { title: 'Summary (small image)', value: 'summary' },
          { title: 'Summary large image', value: 'summary_large_image' },
        ],
        layout: 'radio',
      },
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'twitterTitle',
      title: 'Twitter title',
      type: 'localeString',
      group: 'twitter',
      description: 'Overrides OG title for Twitter. Falls back through OG → Meta title chain.',
    }),
    defineField({
      name: 'ogSiteName',
      title: 'OG site name',
      type: 'string',
      group: 'og',
      initialValue: 'Jatin Kumar — Portfolio',
      description: 'The name of the overall website, used in OG tags.',
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter description',
      type: 'localeText',
      group: 'twitter',
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter image',
      type: 'image',
      group: 'twitter',
      options: { hotspot: true },
      description: 'Falls back to OG image if not set. Recommended: 1200×600 px.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'localeString',
        }),
      ],
    }),

    // ── Advanced ────────────────────────────────────────────────────────
    defineField({
      name: 'noIndex',
      title: 'No index',
      type: 'boolean',
      group: 'advanced',
      initialValue: false,
      description: 'Prevents search engines from indexing this page.',
    }),
    defineField({
      name: 'noFollow',
      title: 'No follow',
      type: 'boolean',
      group: 'advanced',
      initialValue: false,
      description: 'Prevents search engines from following links on this page.',
    }),
  ],
  preview: {
    select: { title: 'metaTitle.en', subtitle: 'metaDescription.en' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'SEO metadata', subtitle }
    },
  },
})
