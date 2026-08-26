import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'
import { SiteAuthorIndicator } from '../../components/SiteAuthorIndicator'

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'hero', title: 'Hero Section' },
    { name: 'media', title: 'Media' },
    { name: 'contact', title: 'Contact' },
    { name: 'seo', title: 'SEO & Schema' },
    { name: 'page', title: 'Page contents' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Full name', type: 'localeString', group: 'identity', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'identity', options: { source: 'name' }, validation: (R) => R.required() }),
    defineField({ name: 'headline', title: 'Headline / Tagline', type: 'localeString', group: 'identity', description: 'e.g. "Full-Stack Developer & Product Designer"' }),
    defineField({ name: 'bio_short', title: 'Short Bio', type: 'localeBlockContent', group: 'identity' }),
    defineField({ name: 'bio', title: 'Bio', type: 'localeBlockContent', group: 'identity' }),

   defineField({
      name: 'greeting',
      title: 'Greeting text',
      type: 'localeString',
      group: 'hero',
      description: 'Small eyebrow line above the name. e.g. "Hi, my name is"',
    }),
    defineField({
      name: 'header_title',
      title: 'Header title',
      type: 'localeString',
      group: 'hero',
      description: 'Text shown in Header. e.g. "Full-Stack Developer & Product Designer"',
    }),
    defineField({ name: 'logoImage',  title: 'header logo/image',   type: 'customImage', group: 'hero',description: 'Wide banner shown at the top of the portfolio page.' }),
      defineField({
      name: 'headerCta',
      title: 'Header CTA button',
      type: 'ctaButton',
      group: 'hero',
      description: 'Optional button shown in the header.',
    }),
    defineField({
      name: "channels",
      title: "Channels",
      type: "array",
      group:"hero",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "localeString",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "icon",
              title: "Icon",
              type: "svg",
              description:
                "Material Symbols icon name (phone, mail, work, calendar_month, etc.)",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "url",
              title: "URL",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "openInNewTab",
              title: "Open in new tab",
              type: "boolean",
              initialValue: true,
            }),
          ],
        }
        ]
        }),

    defineField({
      name: 'openToWork',
      title: 'Open to work',
      type: 'boolean',
      group: 'hero',
      initialValue: false,
      description: 'Shows the badge on the avatar when enabled.',
    }),
    
    defineField({
      name: 'openToWorkLabel',
      title: 'Open to work label',
      type: 'localeString',
      group: 'hero',
      description: 'Text inside the badge. e.g. "Open to Work"',
      hidden: ({ parent }) => !(parent as { openToWork?: boolean })?.openToWork,
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'hero',
      description: 'Key numbers shown below the bio (e.g. "5+ Years Experience").',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. "5+"', validation: (R) => R.required() }),
            defineField({ name: 'label', title: 'Label', type: 'localeString', description: 'e.g. "Years Experience"' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label.en' } },
        },
      ],
    }),
    defineField({
      name: 'featureHighlights',
      title: 'Feature highlights (App highlights)',
      type: 'array',
      group: 'hero',
      description:
        'Icon + big number + label tiles shown below the hero (e.g. "100 / Lighthouse score"). Renders as the feature-highlight row on the front end.',
      of: [
        {
          type: 'object',
          name: 'featureHighlight',
          fields: [
            defineField({
              name: 'iconName',
              title: 'Icon',
              type: 'iconRef',
              description: 'Pick from the bundled @web-portfolio/icons set — same picker as Skill\'s "Icon (picker)" field.',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'kicker',
              title: 'Kicker (big number)',
              type: 'string',
              description: 'e.g. "100" or "6"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'localeString',
              description: 'e.g. "Lighthouse score"',
              validation: (R) => R.required(),
            }),
          ],
          preview: { select: { title: 'kicker', subtitle: 'label.en' } },
        },
      ],
    }),
    defineField({
      name: 'featureIntro',
      title: 'Feature intro text',
      type: 'localeText',
      group: 'hero',
      description: 'Paragraph shown below the feature-highlight tiles.',
    }),
    defineField({
      name: 'featureLinkUrl',
      title: 'Feature link URL',
      type: 'string',
      group: 'hero',
      description: 'e.g. a link to the GitHub repo. Leave blank to hide the link.',
    }),
    defineField({
      name: 'featureLinkLabel',
      title: 'Feature link label',
      type: 'localeString',
      group: 'hero',
      description: 'e.g. "Learn more". Falls back to "Learn more" on the front end if left blank.',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA button',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'text', title: 'Button text', type: 'localeString' }),
        defineField({ name: 'href', title: 'Link',        type: 'string', description: 'e.g. "#projects" or "/projects"' }),
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA button',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'text', title: 'Button text', type: 'localeString' }),
        defineField({ name: 'href', title: 'Link',        type: 'string' }),
      ],
    }),

    // ── Media ─────────────────────────────────────────────────────────
    defineField({ name: 'avatar',      title: 'Profile picture',        type: 'customImage', group: 'media' }),
    defineField({ name: 'coverImage',  title: 'Cover / Hero image',   type: 'customImage', group: 'media', description: 'Profile image shown in Hero Section .' }),
    defineField({ name: 'resumeImage',  title: 'Resume image',   type: 'customImage', group: 'media',description: 'Profile image shown in resume .' }),

    // ── Contact ────────────────────────────────────────────────────────
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (R) => R.email() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', group: 'contact' }),
    defineField({ name: 'location', title: 'Location', type: 'localeString', group: 'contact' }),
    defineField({ name: 'skills', title: 'Skills', type: 'array', of: [{ type: 'reference', to: [{ type: 'skill' }] }] }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Drag to reorder. Controls project order on the portfolio and resume.',
    }),
    defineField({ name: 'socialProfiles', title: 'Social profiles', type: 'array', of: [{ type: 'socialProfile' }] }),

    defineField({
  name: 'sections',
  title: 'Sections',
  group:'page',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'section' }] }],
  description: 'Drag to reorder. Controls section order on the page.',
}),
    // ── SEO & Schema ───────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO metadata', type: 'seoMetadata', group: 'seo' }),
    defineField({ name: 'structuredData', title: 'Structured data', type: 'webSchema', group: 'seo' }),
    defineField({ name: 'websiteSchema', title: 'WebSite structured data', type: 'webSchema', group: 'seo', description: 'Generates the schema.org/WebSite JSON-LD block.' }),
    defineField({
      name: 'isSiteAuthor',
      title: 'Site author',
      type: 'boolean',
      group: 'seo',
      readOnly: true,
      description:
        'Read-only indicator, not stored. True when this slug matches the SANITY_STUDIO_SITE_AUTHOR_SLUG env var — the site-wide WebSite JSON-LD always links to whichever person that is, regardless of which page is being viewed.',
      components: { input: SiteAuthorIndicator },
    }),
  ],
  preview: {
    select: { title: 'name.en', subtitle: 'headline.en', media: 'avatar' },
  },
})
