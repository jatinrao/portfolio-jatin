import { defineType, defineField } from 'sanity'

/**
 * ctaButton — reusable CTA link/button object with SEO + accessibility fields.
 *
 * Usage anywhere in the schema:
 *   defineField({ name: 'primaryCta', type: 'ctaButton', ... })
 *
 * ── SEO fields ───────────────────────────────────────────────────────────
 *   rel[]        Declare link relationships (nofollow, sponsored, ugc, me).
 *                noopener + noreferrer are added automatically on the
 *                frontend whenever openInNewTab is true — no editor input needed.
 *
 *   openInNewTab Renders target="_blank" rel="noopener noreferrer".
 *
 * ── Accessibility fields ─────────────────────────────────────────────────
 *   ariaLabel    Screen-reader label. Required when the visible text is
 *                ambiguous ("Read more" → "Read more about my experience").
 *                Omit when text is already fully descriptive.
 *
 *   ariaDescribedBy  ID of an element on the page that provides extra
 *                    context (e.g. a nearby paragraph explaining the action).
 *
 *   title        Tooltip shown on hover/focus. Use sparingly — never
 *                duplicate the visible button text.
 *
 *   isDownload   Adds the HTML download attribute. For resume PDFs, CV links.
 *   downloadFilename  Suggested filename the browser offers in the save dialog.
 */
export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  groups: [
    { name: 'link',  title: 'Link',            default: true },
    { name: 'seo',   title: 'SEO'                            },
    { name: 'a11y',  title: 'Accessibility'                  },
  ],
  fields: [
    // ── Visible content ───────────────────────────────────────────────
    defineField({
      name: 'text',
      title: 'Button text',
      type: 'localeString',
      group: 'link',
      description: 'The visible label on the button.',
      validation: (R) => R.required(),
    }),

    // ── Link ──────────────────────────────────────────────────────────
    defineField({
      name: 'href',
      title: 'URL / Path',
      type: 'string',
      group: 'link',
      description:
        'Internal path: "/projects" or "#contact". ' +
        'External URL: "https://github.com/username". ' +
        'File: "https://cdn.example.com/resume.pdf".',
      validation: (R) =>
        R.required().custom((value: string | undefined) => {
          if (!value) return true
          const isInternal = value.startsWith('/') || value.startsWith('#')
          const isExternal = /^https?:\/\//.test(value)
          if (!isInternal && !isExternal)
            return 'Must be an internal path (/…, #…) or a full URL (https://…)'
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      group: 'link',
      initialValue: false,
      description:
        'Adds target="_blank". The frontend automatically appends ' +
        'rel="noopener noreferrer" for security — no manual entry needed.',
    }),

    // ── Download ──────────────────────────────────────────────────────
    defineField({
      name: 'isDownload',
      title: 'Downloadable file',
      type: 'boolean',
      group: 'link',
      initialValue: false,
      description:
        'Adds the HTML download attribute. Use for resume PDFs, CV docs, etc.',
    }),
    defineField({
      name: 'downloadFilename',
      title: 'Download filename',
      type: 'string',
      group: 'link',
      description:
        'Suggested filename shown in the browser save dialog. ' +
        'e.g. "JatinKumar-Resume.pdf". Leave blank to use the URL filename.',
      hidden: ({ parent }) => !(parent as { isDownload?: boolean })?.isDownload,
      validation: (R) =>
        R.custom((value: string | undefined, ctx) => {
          const parent = ctx.parent as { isDownload?: boolean } | undefined
          if (parent?.isDownload && value && !value.includes('.'))
            return 'Filename should include an extension, e.g. "Resume.pdf"'
          return true
        }),
    }),

    // ── SEO ───────────────────────────────────────────────────────────
    defineField({
      name: 'rel',
      title: 'rel attribute',
      type: 'array',
      group: 'seo',
      of: [{ type: 'string' }],
      options: {
        list: [
          {
            title: 'nofollow — do not pass SEO equity to the destination',
            value: 'nofollow',
          },
          {
            title: 'sponsored — marks a paid or affiliate link',
            value: 'sponsored',
          },
          {
            title: 'ugc — user-generated content (comments, forum posts)',
            value: 'ugc',
          },
          {
            title: 'me — confirms this link points to your own profile (used by Google for authorship)',
            value: 'me',
          },
        ],
        layout: 'grid',
      },
      description:
        'Declare the relationship between this page and the link destination. ' +
        '"noopener noreferrer" are added automatically when Open in new tab is on.',
    }),

    // ── Accessibility ─────────────────────────────────────────────────
    defineField({
      name: 'ariaLabel',
      title: 'ARIA label',
      type: 'localeString',
      group: 'a11y',
      description:
        'Overrides button text for screen readers. ' +
        'Add when the visible text is ambiguous in isolation — ' +
        '"Read more" → "Read more about my open-source projects". ' +
        'Leave blank when the button text is already self-explanatory.',
    }),
    defineField({
      name: 'ariaDescribedBy',
      title: 'aria-describedby (element ID)',
      type: 'string',
      group: 'a11y',
      description:
        'DOM id of a nearby element that provides extra context for screen readers. ' +
        'e.g. "hero-bio" if a paragraph with id="hero-bio" describes this action. ' +
        'Leave blank if not applicable.',
      validation: (R) =>
        R.custom((value: string | undefined) => {
          if (value && /\s/.test(value))
            return 'Must be a single HTML id (no spaces). Use aria-labelledby for multiple ids.'
          return true
        }),
    }),
    defineField({
      name: 'title',
      title: 'Title (tooltip)',
      type: 'localeString',
      group: 'a11y',
      description:
        'Renders as the HTML title attribute — shown as a tooltip on hover/focus. ' +
        'Do not duplicate the button text. Use for supplementary hints only.',
    }),
  ],
  preview: {
    select: { title: 'text.en', subtitle: 'href' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title:    title    || '(no label)',
        subtitle: subtitle || '(no link)',
      }
    },
  },
})
