import { defineType, defineField, defineArrayMember } from 'sanity'
import { languages } from '../../config/languages'
import { AutoTranslateBlockInput } from '../../components/AutoTranslateBlockInput'
import { richTextBlock } from './localeBlockContent'

/**
 * Localized rich text for blog post bodies — same per-language array shape
 * as `localeBlockContent`, but its `of` array also accepts the blog-specific
 * content blocks (callout box, code snippet, comparison table, image) alongside
 * the standard paragraph/heading/quote/list block. Pull quotes reuse the
 * standard block's existing "Quote" style rather than a dedicated object
 * type, styled as a pull-quote on the front end. Images reuse `customImage`
 * as-is (alt/caption/credit already localized) rather than a body-specific
 * wrapper type.
 */
export const blogBlockContent = defineType({
  name: 'blogBlockContent',
  title: 'Blog body content',
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
      of: [
        richTextBlock,
        defineArrayMember({ type: 'calloutBox' }),
        defineArrayMember({ type: 'codeSnippet' }),
        defineArrayMember({ type: 'comparisonTable' }),
        defineArrayMember({ type: 'customImage', title: 'Image' }),
      ],
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
  preview: {
    prepare() {
      return { title: 'Blog body content' }
    },
  },
})
