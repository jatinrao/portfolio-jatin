import { defineType, defineField } from 'sanity'
import { ProjectsIcon } from '@sanity/icons'

export const education = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'reference',
      to: [{ type: 'organization' }],
      description: 'School, university, or training provider.',
    }),
    defineField({
      name: 'degree',
      title: 'Degree / Program',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fieldOfStudy',
      title: 'Field of study',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      hidden: ({ parent }) => !!(parent as { isCurrent?: boolean })?.isCurrent,
    }),
    defineField({
      name: 'isCurrent',
      title: 'Currently studying here',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'grade',
      title: 'Grade / GPA',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'degree.en', subtitle: 'institution.name.en' },
  },
})
