import { defineType, defineField } from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.en' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'proficiency',
      title: 'Proficiency',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(8),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Technical',     value: 'technical' },
      { title: 'Framework',     value: 'framework' },
      { title: 'Library',       value: 'library' },
      { title: 'Tool', value: 'tool' },
      { title: 'Platform', value: 'platform' },
      { title: 'Design',        value: 'design' },
      { title: 'Language',      value: 'language' },
      { title: 'Cloud & DevOps', value: 'cloud-devops' },
      { title: 'Database',      value: 'database' },
      { title: 'Soft skill',    value: 'soft-skill' },
      { title: 'Other',         value: 'other' },

        ],
      },
    }),
    defineField({
      name: 'filter_category',
      title: 'FilterCategory',
      type: 'string',
      options: {
        list: [
      { title: 'All',     value: 'all' },
      { title: 'Frontend', value: 'frontend' },
      { title: 'Backend', value: 'backend' },
      { title: 'AI', value: 'ai' },
      { title: 'Others',   value: 'others' },

        ],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon (legacy, unused)',
      type: 'image',
      description: 'Not rendered anywhere on the frontend — superseded by "Icon (picker)" below.',
    }),
    defineField({
      name: 'svg_icon',
      title: 'SVG Icon (legacy)',
      type: 'svg',
      description: 'Old raw-SVG-paste field. Superseded by "Icon (picker)" below — kept as a fallback until every skill has been migrated.',
    }),
    defineField({
      name: 'iconName',
      title: 'Icon (picker)',
      type: 'iconRef',
      description: 'Pick from the bundled icon set. Takes priority over the legacy SVG field on the frontend once set.',
    }),
  ],
  preview: {
    select: { title: 'name.en', subtitle: 'category' },
  },
})
