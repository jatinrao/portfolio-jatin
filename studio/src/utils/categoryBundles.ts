import {defineLocaleResourceBundle} from 'sanity'

// Single source of truth for every string key used by the `category`
// field's custom input (CategorySelectInput.tsx) and the Structure Tool's
// "filter by category" pane (structure.ts). Add a key here BEFORE using it
// in either place, and add it to every locale bundle below at the same
// time — a key missing from one locale silently falls back to whichever
// locale IS defined for it (or the raw key, if none are), so it's easy to
// end up with a half-translated field without a build-time signal.
//
// NOTE: this is Sanity Studio's own UI-chrome i18n (the language the
// *authoring interface* is displayed in) — a separate system from the
// visitor-facing `localeString` fields we used for the actual site content
// (English/French/German page copy). A Spanish-speaking editor and an
// English-only website can coexist; these bundles only affect what editors
// see inside Sanity Studio.

const categoryResourceKeys = {
  'category.title': 'Category',
  'category.description': 'What kind of skill this is.',
  'category.options.placeholder': 'Select a category…',
  'category.options.technical': 'Technical',
  'category.options.design': 'Design',
  'category.options.soft-skill': 'Soft skill',
  'category.options.language': 'Language',
  'category.options.tool': 'Tool / Platform',
  'category.options.other': 'Other',
  'category.filter.title': 'Filter by category',
  'category.filter.all': 'All skills',
} as const

// TypeScript net: every other locale bundle's `resources` object must have
// exactly these keys, so a typo or an omission fails `tsc` instead of
// shipping a silently-untranslated string.
export type CategoryResourceKey = keyof typeof categoryResourceKeys

const enCategory = defineLocaleResourceBundle({
  locale: 'en',
  namespace: 'studio',
  resources: categoryResourceKeys,
})

const esCategory = defineLocaleResourceBundle({
  locale: 'es',
  namespace: 'studio',
  resources: {
    'category.title': 'Categoría',
    'category.description': 'Qué tipo de habilidad es.',
    'category.options.placeholder': 'Selecciona una categoría…',
    'category.options.technical': 'Técnica',
    'category.options.design': 'Diseño',
    'category.options.soft-skill': 'Habilidad blanda',
    'category.options.language': 'Idioma',
    'category.options.tool': 'Herramienta / Plataforma',
    'category.options.other': 'Otra',
    'category.filter.title': 'Filtrar por categoría',
    'category.filter.all': 'Todas las habilidades',
  } satisfies Record<CategoryResourceKey, string>,
})

// Add more locales the same way — one defineLocaleResourceBundle per
// locale, `satisfies Record<CategoryResourceKey, string>` catches missing
// keys immediately.
export const categoryI18nBundles = [enCategory, esCategory]