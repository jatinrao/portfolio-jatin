import { defineField, defineType } from 'sanity';

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (Rule) => Rule.required().error('Every navigation must belong to a person.'),
    }),
    defineField({
      name: 'logoText',
      title: 'Logo / brand text',
      type: 'string',
      initialValue: 'Jatin Kumar',
    }),
    defineField({
      name: 'navItems',
      title: 'Nav items',
      type: 'array',
      of: [{ type: 'navItem' }],
      validation: (Rule) => Rule.min(1).error('Add at least one nav item'),
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA button (optional, e.g. "Hire Me")',
      type: 'navItem',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' };
    },
  },
});