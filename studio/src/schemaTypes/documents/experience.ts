import { defineType, defineField } from 'sanity'
import { CaseIcon } from '@sanity/icons'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'reference',
      to: [{ type: 'organization' }],
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Contract', value: 'contract' },
          { title: 'Freelance', value: 'freelance' },
          { title: 'Internship', value: 'internship' },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      hidden: ({ parent }) => !!(parent as { isCurrent?: boolean })?.isCurrent,
    }),
    defineField({
      name: 'isCurrent',
      title: 'Currently working here',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'skills',
      title: 'Skills used',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'skill' }] }],
    }),
  ],
  preview: {
    select: { title: 'role.en', subtitle: 'organization.name.en' },
  },
})
