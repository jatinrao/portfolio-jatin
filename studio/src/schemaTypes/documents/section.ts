import { defineField, defineType } from 'sanity';

export const section = defineType({
  name: 'section',
  title: 'Section',
  type: 'document',
  fields: [
    
    defineField({
      name: 'sectionType',
      title: 'Section type',
      type: 'string',
      options: {
        list: [
          { title: 'About / Bio', value: 'about' },
          { title: 'Experience', value: 'experience' },
          { title: 'Education', value: 'education' },
          { title: 'Projects', value: 'projects' },
          { title: 'Skills', value: 'skills' },
          { title: 'Certifications', value: 'certifications' },
          { title: 'Awards', value: 'awards' },
          { title: 'Publications', value: 'publications' },
          { title: 'Testimonials', value: 'testimonials' },
          { title: 'Contact', value: 'contact' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'dropdown',
      },
      description:
        'Determines which layout/component renders this section on the frontend. Choose "Custom" for one-off sections.',
      validation: (Rule) => Rule.required().error('Select a section type.'),
    }),
    defineField({
      name: 'sectionId',
      title: 'Section ID (anchor link)',
      type: 'slug',
      description:
        'Used as the HTML id for this section, e.g. "about" → #about. Keep it short, lowercase, no spaces.',
      options: {
        source: (doc, options) => {
          const parent = options.parent as { sectionType?: string; internalTitle?: string };
          // Prefer sectionType for a clean, predictable anchor; fall back to title for "custom"
          return parent?.sectionType && parent.sectionType !== 'custom'
            ? parent.sectionType
            : parent?.internalTitle ?? '';
        },
        maxLength: 50,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
      },
      validation: (Rule) => Rule.required().error('Section ID is required for anchor navigation.'),
    }),
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description:
        'For CMS reference only — not shown on the site. Required when Section type is "Custom".',
      validation: (Rule) =>
        Rule.custom((value, context: any) =>
          context.parent?.sectionType === 'custom' && !value
            ? 'Internal title is required for custom sections'
            : true
        ),
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in navbar',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle off to hide this section from the navbar without deleting the nav item.',
    }),
    defineField({
      name: 'navLabel',
      title: 'Nav label',
      type: 'localeString',
      description: 'Text shown in the navbar. Falls back to Internal title if left blank.',
    }),
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'localeString',
    }),
    defineField({
      name: 'subheading',
      title: 'Section subheading',
      type: 'localeText',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Controls the order this section appears on the page (lower = higher up).',
    }),
  ],
  preview: {
    select: {
      title: 'internalTitle',
      type: 'sectionType',
      subtitle: 'sectionId.current',
    },
    prepare({ title, type, subtitle }) {
      return {
        title: title || type || 'Untitled section',
        subtitle: subtitle ? `#${subtitle} · ${type}` : `No anchor ID · ${type ?? 'no type'}`,
      };
    },
  },
});

