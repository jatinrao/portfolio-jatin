import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'feedbackSection',
  title: 'Feedback Section',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'form', title: 'Form' },
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      description: 'For the Studio list view only — never rendered on the site.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badgeLabel',
      title: 'Badge label',
      description: 'The small tag stamped on the card corner, e.g. "PROTOCOL_09: CONNECT".',
      type: 'localeString',
      group: 'content',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Small uppercase label above the heading, e.g. "Transmission".',
      type: 'localeString',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The section heading, e.g. "Feedback Loop".',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      group: 'content',
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact person',
      description:
        'Who this feedback is routed to / represents the point of contact for this form. Used to address submissions and can optionally be displayed (e.g. "Direct line to {name}").',
      type: 'reference',
      to: [{ type: 'person' }],
      group: 'content',
    }),
    defineField({
      name: 'fields',
      title: 'Form fields',
      type: 'array',
      of: [{ type: 'formField' }],
      validation: (Rule) => Rule.min(1),
      group: 'form',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      description: 'e.g. "TRANSMIT_SIGNAL".',
      type: 'localeString',
      group: 'form',
    }),
    defineField({
      name: 'submitIcon',
      title: 'Submit button icon',
      description: 'Material Symbols icon name shown next to the submit label, e.g. "send".',
      type: 'string',
      group: 'form',
    }),
  ],
  preview: {
    select: { title: 'internalTitle', subtitle: 'title.en' },
  },
});