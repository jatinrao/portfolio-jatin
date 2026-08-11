import { defineType, defineField, type PreviewConfig } from 'sanity'
import { languages, defaultLanguage } from '../../config/languages'
import { AutoTranslateInput } from '../../components/AutoTranslateInput'

const previewSelect: Record<string, string> = languages.reduce(
  (acc, lang) => ({ ...acc, [lang.id]: lang.id }),
  {} as Record<string, string>,
)

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  components: { input: AutoTranslateInput },
  fieldsets: [
    {
      name: 'translations',
      title: 'Translations',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: languages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'text',
      rows: 4,
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
  preview: {
    select: previewSelect,
    prepare(selection: Record<string, string | undefined>) {
      const value = selection[defaultLanguage.id] || Object.values(selection).find(Boolean) || ''
      return { title: value.length > 80 ? `${value.slice(0, 80)}…` : value || '(empty)' }
    },
  } satisfies PreviewConfig,
})
