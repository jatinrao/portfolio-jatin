import type { PortableTextBlock } from '@portabletext/types'

// ─── Language registry ────────────────────────────────────────────────────
// Keep this in sync with sanity-schema/config/languages.ts
export const LANGUAGES = [
  { id: 'en', code: 'EN', label: 'English'            },
  { id: 'es', code: 'ES', label: 'Español'            },
  { id: 'zh', code: '中文', label: '中文 (Simplified)' },
  { id: 'hi', code: 'हि', label: 'हिंदी'              },
  { id: 'fr', code: 'FR', label: 'Français'           },
  { id: 'ar', code: 'AR', label: 'العربية'            },
  // Add more languages here — matches sanity-schema/config/languages.ts
] as const

const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur']);

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.has(locale);

}
export type LangId = (typeof LANGUAGES)[number]['id']
export const DEFAULT_LANG: LangId = 'en'

// ─── Field shape aliases ──────────────────────────────────────────────────
export type LocaleString     = Partial<Record<LangId, string>>
export type LocaleText       = Partial<Record<LangId, string>>
export type LocaleBlockContent = Partial<Record<LangId, PortableTextBlock[]>>

// ─── Localize helpers ─────────────────────────────────────────────────────

/** Resolve a localeString/localeText to a plain string for the active language. */
export function localize(
  obj: LocaleString | null | undefined,
  lang: LangId,
): string {
  if (!obj) return ''
  return obj[lang] ?? obj[DEFAULT_LANG] ?? Object.values(obj).find(Boolean) ?? ''
}

/** Resolve a localeBlockContent to blocks for the active language. */
export function localizeBlocks(
  obj: LocaleBlockContent | null | undefined,
  lang: LangId,
): PortableTextBlock[] {
  if (!obj) return []
  return obj[lang] ?? obj[DEFAULT_LANG] ?? []
}

/** Extract plain text from a PortableText block array (no markup). */
export function blocksToPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !Array.isArray(block.children)) return ''
      return (block.children as Array<{ text?: string }>)
        .map((span) => span.text ?? '')
        .join('')
    })
    .filter(Boolean)
    .join('\n\n')
}
