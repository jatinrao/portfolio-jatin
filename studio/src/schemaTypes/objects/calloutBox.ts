import { defineType, defineField } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

/** Highlighted callout used inside blog body content, e.g. a "what we're
 * actually claiming" summary box. */
export const calloutBox = defineType({
  name: 'calloutBox',
  title: 'Callout box',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'Small eyebrow above the text, e.g. "What we\'re actually claiming".' }),
    defineField({ name: 'text', title: 'Text', type: 'localeText', validation: (R) => R.required() }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'text.en' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'Callout', subtitle }
    },
  },
})
