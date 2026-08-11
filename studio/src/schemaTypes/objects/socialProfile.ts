import { defineType, defineField } from 'sanity'

export const socialProfile = defineType({
  name: 'socialProfile',
  title: 'Social profile',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'GitHub', value: 'github' },
          { title: 'Twitter / X', value: 'twitter' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Dribbble', value: 'dribbble' },
          { title: 'Behance', value: 'behance' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Personal website', value: 'website' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Profile URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'username',
      title: 'Display username / handle',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'platform', subtitle: 'username' },
  },
})
