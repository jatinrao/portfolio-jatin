import { defineType, defineField, type PreviewConfig } from 'sanity'
import { languages, defaultLanguage } from '../../config/languages'
import { AutoTranslateInput } from '../../components/AutoTranslateInput'

const previewSelect: Record<string, string> = languages.reduce(
  (acc, lang) => ({ ...acc, [lang.id]: lang.id }),
  {} as Record<string, string>,
)

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  // Wire in the translate toolbar — all fields still rendered by renderDefault()
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
      type: 'string',
      fieldset: lang.isDefault ? undefined : 'translations',
    }),
  ),
  preview: {
    select: previewSelect,
    prepare(selection: Record<string, string | undefined>) {
      return {
        title:
          selection[defaultLanguage.id] ||
          Object.values(selection).find(Boolean) ||
          '(empty)',
      }
    },
  } satisfies PreviewConfig,
})
