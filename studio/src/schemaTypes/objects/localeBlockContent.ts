import { defineType, defineField, defineArrayMember } from 'sanity'
import { languages } from '../../config/languages'
import { AutoTranslateBlockInput } from '../../components/AutoTranslateBlockInput'

/** Exported so other locale-array content types (e.g. blogBlockContent) can
 * reuse the same paragraph/heading/quote block shape without duplicating it. */
export const richTextBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H3', value: 'h3' },
    { title: 'H4', value: 'h4' },
    { title: 'Quote', value: 'blockquote' },
  ],
  marks: {
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'linkType',
            title: 'Link type',
            type: 'string',
            options: {
              list: [
                { title: 'External URL', value: 'external' },
                { title: 'Internal page', value: 'internal' },
              ],
              layout: 'radio',
            },
            initialValue: 'external',
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            hidden: ({ parent }) => parent?.linkType !== 'external',
            validation: (Rule) =>
              Rule.custom((value, context: any) =>
                context.parent?.linkType === 'external' && !value ? 'Enter a URL' : true,
              ).uri({ scheme: ['http', 'https', 'mailto'] }),
          }),
          defineField({
            name: 'internalRef',
            title: 'Page',
            type: 'reference',
            to: [{ type: 'blog' }, { type: 'project' }],
            hidden: ({ parent }) => parent?.linkType !== 'internal',
            validation: (Rule) =>
              Rule.custom((value, context: any) =>
                context.parent?.linkType === 'internal' && !value ? 'Select a page' : true,
              ),
          }),
          defineField({
            name: 'openInNewTab',
            title: 'Open in new tab',
            type: 'boolean',
            initialValue: false,
          }),
        ],
      },
    ],
  },
})

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized rich text',
  type: 'object',
  components: { input: AutoTranslateBlockInput },
  fieldsets: [
    {
      name: 'translations',
      title: 'Translations',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: languages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'array',
      of: [richTextBlock],
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
  preview: {
    prepare() {
      return { title: 'Localized rich text' }
    },
  },
})
