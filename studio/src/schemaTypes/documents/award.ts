import { defineType, defineField } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const award = defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issuing organization',
      type: 'reference',
      to: [{ type: 'organization' }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'date',
      title: 'Date received',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Reference URL',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'issuer.name' },
  },
})
