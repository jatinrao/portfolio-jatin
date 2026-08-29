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
        fields: [{ name: 'href', type: 'url', title: 'URL' }],
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
