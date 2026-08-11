import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const publication = defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'person',
      title: 'Primary author',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coAuthors',
      title: 'Co-authors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'person' }] }],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher / Venue',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Abstract / Description',
      type: 'localeText',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'publisher' },
  },
})
