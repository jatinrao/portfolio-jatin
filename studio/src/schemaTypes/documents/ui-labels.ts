import { defineField, defineType } from 'sanity';

export const uiLabels = defineType({
  name: 'uiLabels',
  title: 'UI Labels',
  type: 'document',
  // Meant to exist as exactly one document — a simple settings-style
  // singleton for small, repeated pieces of site chrome copy (button/link
  // text) that would otherwise be hardcoded English strings in the
  // frontend and unavailable in the site's other languages. Same
  // uncustomized-singleton pattern as `skillCategoryLabels`.
  fields: [
    defineField({
      name: 'learnMore',
      title: 'Learn more (project card button)',
      type: 'localeString',
      description: 'Button on each project card that links to its detail page.',
    }),
    defineField({
      name: 'reachOut',
      title: 'Reach out (hero CTA)',
      type: 'localeString',
      description: 'Primary hero call-to-action link label.',
    }),
    defineField({
      name: 'connect',
      title: 'Connect (hero CTA)',
      type: 'localeString',
      description: 'Secondary hero call-to-action link label.',
    }),
    defineField({
      name: 'footerExplore',
      title: 'Footer "Explore" heading',
      type: 'localeString',
      description: 'Heading above the footer\'s section nav links.',
    }),
    defineField({
      name: 'footerConnect',
      title: 'Footer "Connect" heading',
      type: 'localeString',
      description: 'Heading above the footer\'s social/contact links.',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn (footer link label)',
      type: 'localeString',
      description: 'Label for the LinkedIn link in the footer\'s Connect list.',
    }),
    defineField({
      name: 'mail',
      title: 'Mail (footer link label)',
      type: 'localeString',
      description: 'Label for the email link in the footer\'s Connect list.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'UI Labels' }),
  },
});
