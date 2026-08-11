import React, { useState, useCallback } from 'react'
import { ObjectInputProps, set, setIfMissing, PortableTextBlock } from 'sanity'
import { Stack, Flex, Button, Text, Card, Badge, Box } from '@sanity/ui'
import { TranslateIcon, CheckmarkCircleIcon, ErrorOutlineIcon } from '@sanity/icons'
import { languages, defaultLanguage } from '../config/languages'
import { translateText } from '../lib/translateText'

type LangStatus = 'idle' | 'loading' | 'success' | 'error'

type LocaleBlockValue = Record<string, PortableTextBlock[] | undefined>

/**
 * Flattens Portable Text blocks into a single plain-text string for translation,
 * then wraps the result back into a single `normal` paragraph block.
 *
 * Rich formatting (bold, links, headings) is deliberately collapsed —
 * translating markdown/HTML produced by AI reliably is fragile.
 * Translators can re-apply formatting in the Studio after translation.
 */
function blocksToText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !Array.isArray(block.children)) return ''
      return (block.children as Array<{ text?: string }>).map((c) => c.text ?? '').join('')
    })
    .join('\n\n')
    .trim()
}

function textToBlocks(text: string): PortableTextBlock[] {
  return text.split(/\n\n+/).map((para, i) => ({
    _type: 'block',
    _key: `translated_${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `span_${i}`, text: para, marks: [] }],
  }))
}

function statusTone(s: LangStatus): 'default' | 'positive' | 'critical' | 'primary' {
  if (s === 'success') return 'positive'
  if (s === 'error') return 'critical'
  if (s === 'loading') return 'primary'
  return 'default'
}

function statusLabel(s: LangStatus, title: string): string {
  if (s === 'loading') return `${title}…`
  if (s === 'success') return `✓ ${title}`
  if (s === 'error') return `✗ ${title}`
  return title
}

/**
 * Custom input component for `localeBlockContent`.
 * Adds the same auto-translate toolbar used by AutoTranslateInput, but
 * converts Portable Text ↔ plain text around the translation call.
 */
export function AutoTranslateBlockInput(props: ObjectInputProps) {
  const { value, onChange, renderDefault } = props
  const [statuses, setStatuses] = useState<Record<string, LangStatus>>({})

  const sourceBlocks = (value as LocaleBlockValue | undefined)?.[defaultLanguage.id]
  const sourceText = sourceBlocks ? blocksToText(sourceBlocks) : ''
  const targetLanguages = languages.filter((l) => !l.isDefault)
  const anyLoading = Object.values(statuses).some((s) => s === 'loading')
  const hasSource = sourceText.length > 0

  const translateOne = useCallback(
    async (langId: string, langTitle: string) => {
      if (!sourceText) return
      setStatuses((prev) => ({ ...prev, [langId]: 'loading' }))
      try {
        const translated = await translateText({ text: sourceText, from: defaultLanguage.id, to: langId, toTitle: langTitle })
        onChange([setIfMissing({}), set(textToBlocks(translated), [langId])])
        setStatuses((prev) => ({ ...prev, [langId]: 'success' }))
      } catch (err) {
        console.error(`[AutoTranslateBlock] ${langId}:`, err)
        setStatuses((prev) => ({ ...prev, [langId]: 'error' }))
      }
    },
    [sourceText, onChange],
  )

  const translateAll = useCallback(async () => {
    if (!sourceText) return
    setStatuses(Object.fromEntries(targetLanguages.map((l) => [l.id, 'loading'])))
    const patches: ReturnType<typeof set>[] = []

    await Promise.all(
      targetLanguages.map(async (lang) => {
        try {
          const translated = await translateText({ text: sourceText, from: defaultLanguage.id, to: lang.id, toTitle: lang.title })
          patches.push(set(textToBlocks(translated), [lang.id]))
          setStatuses((prev) => ({ ...prev, [lang.id]: 'success' }))
        } catch (err) {
          console.error(`[AutoTranslateBlock] ${lang.id}:`, err)
          setStatuses((prev) => ({ ...prev, [lang.id]: 'error' }))
        }
      }),
    )

    if (patches.length > 0) onChange([setIfMissing({}), ...patches])
  }, [sourceText, targetLanguages, onChange])

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone={hasSource ? 'transparent' : 'caution'} border>
        <Stack space={3}>
          <Flex align="center" gap={2}>
            <TranslateIcon />
            <Text size={1} weight="semibold">
              Auto-translate from {defaultLanguage.title}
            </Text>
            {!hasSource && (
              <Badge tone="caution" fontSize={0}>
                Fill {defaultLanguage.title} field first
              </Badge>
            )}
          </Flex>
          <Text size={0} muted>
            Note: rich formatting is flattened to plain paragraphs during translation.
            Re-apply bold/links etc. in the translated field after reviewing.
          </Text>
          <Flex gap={2} wrap="wrap" align="center">
            {targetLanguages.map((lang) => {
              const s = statuses[lang.id] ?? 'idle'
              return (
                <Button
                  key={lang.id}
                  text={statusLabel(s, lang.title)}
                  icon={s === 'success' ? CheckmarkCircleIcon : s === 'error' ? ErrorOutlineIcon : undefined}
                  onClick={() => translateOne(lang.id, lang.title)}
                  disabled={!hasSource || anyLoading}
                  tone={statusTone(s)}
                  mode={s === 'success' ? 'default' : 'ghost'}
                  fontSize={1}
                  padding={2}
                />
              )
            })}
            <Box style={{ width: 1, height: 20, background: 'var(--card-border-color)' }} />
            <Button
              text={anyLoading ? 'Translating…' : 'Translate all'}
              icon={TranslateIcon}
              onClick={translateAll}
              disabled={!hasSource || anyLoading}
              tone="primary"
              fontSize={1}
              padding={2}
            />
          </Flex>
        </Stack>
      </Card>
      {renderDefault(props)}
    </Stack>
  )
}
