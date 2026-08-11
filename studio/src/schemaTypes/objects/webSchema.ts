import { defineType, defineField } from 'sanity'

/**
 * JSON-LD structured data for schema.org
 *
 * Provides structured helper fields per schema.org type (Person, WebSite,
 * WebPage, CreativeWork, Organization), covering the most useful properties
 * for a portfolio site. A `customJsonLd` text field serves as an escape hatch
 * for anything the structured fields don't cover.
 *
 * The front end is responsible for merging helper fields → customJsonLd and
 * emitting the final <script type="application/ld+json"> tag. A utility
 * like `buildJsonLd(webSchema, person)` in your front-end code is the
 * recommended pattern; see README for an example.
 *
 * Usage:
 *   defineField({ name: 'webSchema', title: 'Structured data', type: 'webSchema' })
 */
export const webSchema = defineType({
  name: 'webSchema',
  title: 'Structured data (JSON-LD)',
  type: 'object',
  groups: [
    { name: 'type', title: 'Type', default: true },
    { name: 'person', title: 'Person' },
    { name: 'website', title: 'WebSite' },
    { name: 'webpage', title: 'WebPage' },
    { name: 'work', title: 'CreativeWork / Project' },
    { name: 'custom', title: 'Custom override' },
  ],
  fields: [
    // ── Schema type selector ─────────────────────────────────────────────
    defineField({
      name: 'schemaType',
      title: 'Schema type',
      type: 'string',
      group: 'type',
      options: {
        list: [
          { title: 'Person', value: 'Person' },
          { title: 'WebSite', value: 'WebSite' },
          { title: 'WebPage', value: 'WebPage' },
          { title: 'CreativeWork (Project)', value: 'CreativeWork' },
          { title: 'Organization', value: 'Organization' },
        ],
      },
      description: 'Determines which structured fields are shown below.',
    }),

    // ── Person ───────────────────────────────────────────────────────────
    defineField({
      name: 'personJobTitle',
      title: 'Job title',
      type: 'string',
      group: 'person',
      description: 'schema:jobTitle — e.g. "Full-Stack Developer"',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'Person',
    }),
    defineField({
      name: 'personDescription',
      title: 'Description',
      type: 'localeText',
      group: 'person',
      description: 'schema:description — short bio for search engines.',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'Person',
    }),
    defineField({
      name: 'personSameAs',
      title: 'Same as URLs',
      type: 'array',
      of: [{ type: 'url' }],
      group: 'person',
      description:
        'schema:sameAs — list of social/profile URLs that confirm identity ' +
        '(LinkedIn, GitHub, Twitter, Wikipedia, etc.).',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'Person',
    }),
    defineField({
      name: 'personAlumniOf',
      title: 'Alumni of',
      type: 'string',
      group: 'person',
      description: 'schema:alumniOf — name of the educational institution.',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'Person',
    }),
    defineField({
      name: 'personWorksFor',
      title: 'Works for (organization name)',
      type: 'string',
      group: 'person',
      description: 'schema:worksFor — current employer name.',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'Person',
    }),

    // ── WebSite ──────────────────────────────────────────────────────────
    defineField({
      name: 'websiteName',
      title: 'Site name',
      type: 'localeString',
      group: 'website',
      description: 'schema:name — the name of the website.',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'WebSite',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Site URL',
      type: 'url',
      group: 'website',
      description: 'schema:url — canonical base URL of the site.',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'WebSite',
    }),
    defineField({
      name: 'websiteDescription',
      title: 'Site description',
      type: 'localeText',
      group: 'website',
      description: 'schema:description',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'WebSite',
    }),

    // ── WebPage ──────────────────────────────────────────────────────────
    defineField({
      name: 'pageName',
      title: 'Page name',
      type: 'localeString',
      group: 'webpage',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'WebPage',
    }),
    defineField({
      name: 'pageUrl',
      title: 'Page URL',
      type: 'url',
      group: 'webpage',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'WebPage',
    }),
    defineField({
      name: 'pageBreadcrumb',
      title: 'Breadcrumb',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'breadcrumbItem',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Label' }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
          ],
          preview: { select: { title: 'name', subtitle: 'url' } },
        },
      ],
      group: 'webpage',
      description: 'schema:BreadcrumbList — ordered list of breadcrumb items.',
      hidden: ({ parent }) => (parent as { schemaType?: string })?.schemaType !== 'WebPage',
    }),

    // ── CreativeWork / Project ───────────────────────────────────────────
    defineField({
      name: 'workName',
      title: 'Work name',
      type: 'localeString',
      group: 'work',
      hidden: ({ parent }) =>
        (parent as { schemaType?: string })?.schemaType !== 'CreativeWork',
    }),
    defineField({
      name: 'workDescription',
      title: 'Description',
      type: 'localeText',
      group: 'work',
      hidden: ({ parent }) =>
        (parent as { schemaType?: string })?.schemaType !== 'CreativeWork',
    }),
    defineField({
      name: 'workUrl',
      title: 'Work URL',
      type: 'url',
      group: 'work',
      description: 'schema:url — live URL of the project or publication.',
      hidden: ({ parent }) =>
        (parent as { schemaType?: string })?.schemaType !== 'CreativeWork',
    }),
    defineField({
      name: 'workDateCreated',
      title: 'Date created',
      type: 'date',
      group: 'work',
      hidden: ({ parent }) =>
        (parent as { schemaType?: string })?.schemaType !== 'CreativeWork',
    }),

    // ── Custom JSON-LD override ──────────────────────────────────────────
    defineField({
      name: 'customJsonLd',
      title: 'Custom JSON-LD override',
      type: 'text',
      group: 'custom',
      rows: 12,
      description:
        'Raw JSON-LD object. Must be valid JSON. ' +
        'When present this is merged with (and overrides) the generated structured data above. ' +
        'Do NOT include the <script> wrapper.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          try {
            JSON.parse(value as string)
            return true
          } catch {
            return 'Must be valid JSON'
          }
        }),
    }),
  ],
  preview: {
    select: { schemaType: 'schemaType' },
    prepare({ schemaType }: { schemaType?: string }) {
      return { title: schemaType ? `schema.org/${schemaType}` : 'Structured data' }
    },
  },
})
