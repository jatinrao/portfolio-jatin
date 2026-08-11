import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const certification = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issuer',
      type: 'reference',
      to: [{ type: 'organization' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'credentialId',
      title: 'Credential ID',
      type: 'string',
    }),
    defineField({
      name: 'credentialUrl',
      title: 'Credential URL',
      type: 'url',
    }),
    defineField({
      name: 'issueDate',
      title: 'Issue date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry date',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'issuer.name' },
  },
})
