import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'
import { SkillIconPreview } from '../../components/SkillIconPreview'

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  // Presentation Tool's hover overlay badge uses this schema-type icon
  // directly (@sanity/visual-editing falls back to a generic file icon
  // when unset) — separate from, and not covered by, the preview.media
  // below (that only drives Structure tool rows / reference previews).
  icon: TagIcon,
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
    // Commented out (not deleted) to check for side effects per section
    // before removing for good — both are superseded by "Icon (picker)"
    // below. Re-enable by uncommenting if either turns out to still be
    // needed.
    // defineField({
    //   name: 'icon',
    //   title: 'Icon (legacy, unused)',
    //   type: 'image',
    //   description: 'Not rendered anywhere on the frontend — superseded by "Icon (picker)" below.',
    // }),
    // defineField({
    //   name: 'svg_icon',
    //   title: 'SVG Icon (legacy)',
    //   type: 'svg',
    //   description: 'Old raw-SVG-paste field. Superseded by "Icon (picker)" below — kept as a fallback until every skill has been migrated.',
    // }),
    defineField({
      name: 'iconName',
      title: 'Skill Icon',
      type: 'iconRef',
      description: 'Pick from the @web-portfolio/icons package.',
    }),
  ],
  preview: {
    select: { title: 'name.en', subtitle: 'category', iconName: 'iconName', svgIcon: 'svg_icon.svg' },
    prepare({ title, subtitle, iconName, svgIcon }: { title?: string; subtitle?: string; iconName?: string; svgIcon?: string }) {
      return {
        title,
        subtitle,
        media: <SkillIconPreview iconName={iconName} svgIcon={svgIcon} />,
      }
    },
  },
})
