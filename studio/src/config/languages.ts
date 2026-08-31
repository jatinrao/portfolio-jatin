export interface LanguageDefinition {
  id: string
  title: string
  isDefault?: boolean
}

/**
 * Central language registry.
 *
 * Every localized field type (localeString, localeText, localeBlockContent…)
 * builds its sub-fields FROM THIS ARRAY. To support a 6th, 7th, … language,
 * just add an entry below — no other schema file needs to change.
 *
 * `isDefault: true` marks the fallback language used in document previews.
 */
export const languages: LanguageDefinition[] = [
  { id: 'en', title: 'English', isDefault: true },
  { id: 'es', title: 'Spanish' },
  { id: 'zh', title: 'Chinese' },
  { id: 'hi', title: 'Hindi' },
  { id: 'fr', title: 'French' },
  { id: 'ar', title: 'Arabic' },
];

  // ── To extend, uncomment or add more entries like these ──────────────
  // { id: 'de', title: 'German' },
  // { id: 'ar', title: 'Arabic' },
  // { id: 'pt', title: 'Portuguese' },
  // { id: 'ja', title: 'Japanese' },

export const defaultLanguage: LanguageDefinition =
  languages.find((l) => l.isDefault) ?? languages[0]

export const baseLanguageIds: string[] = languages.map((l) => l.id)
