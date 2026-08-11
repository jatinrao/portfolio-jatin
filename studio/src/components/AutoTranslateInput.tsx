import React, { useState, useCallback } from 'react'
import { ObjectInputProps, set, setIfMissing } from 'sanity'
import { Stack, Flex, Button, Text, Card, Badge, Spinner, Box } from '@sanity/ui'
import { TranslateIcon, CheckmarkCircleIcon, ErrorOutlineIcon } from '@sanity/icons'
import { languages, defaultLanguage } from '../config/languages'
import { translateText } from '../lib/translateText'

type LangStatus = 'idle' | 'loading' | 'success' | 'error'

type LocaleValue = Record<string, string | undefined>

function statusTone(s: LangStatus): 'default' | 'positive' | 'critical' | 'primary' {
  if (s === 'success') return 'positive'
  if (s === 'error') return 'critical'
  if (s === 'loading') return 'primary'
  return 'default'
}

function statusIcon(s: LangStatus): React.ComponentType | undefined {
  if (s === 'success') return CheckmarkCircleIcon
  if (s === 'error') return ErrorOutlineIcon
  return undefined
}

function statusLabel(s: LangStatus, title: string): string {
  if (s === 'loading') return `${title}…`
  if (s === 'success') return `✓ ${title}`
  if (s === 'error') return `✗ ${title}`
  return title
}

/**
 * AutoTranslateInput
 *
 * Drop-in custom input for `localeString` and `localeText` object types.
 * Renders a toolbar above the standard field group that lets editors:
 *
 *  - Click a language button to translate English → that language only
 *  - Click "Translate all" to fill every non-default language at once
 *
 * Wire it up in a schema type via:
 *   components: { input: AutoTranslateInput }
 */
export function AutoTranslateInput(props: ObjectInputProps) {
  const { value, onChange, renderDefault } = props

  const [statuses, setStatuses] = useState<Record<string, LangStatus>>({})

  const sourceText = (value as LocaleValue | undefined)?.[defaultLanguage.id]?.trim()
  const targetLanguages = languages.filter((l) => !l.isDefault)
  const anyLoading = Object.values(statuses).some((s) => s === 'loading')
  const hasSource = !!sourceText

  // Translate into a single target language
  const translateOne = useCallback(
    async (langId: string, langTitle: string) => {
      if (!sourceText) return
      setStatuses((prev) => ({ ...prev, [langId]: 'loading' }))
      try {
        const result = await translateText({
          text: sourceText,
          from: defaultLanguage.id,
          to: langId,
          toTitle: langTitle,
        })
        onChange([setIfMissing({}), set(result, [langId])])
        setStatuses((prev) => ({ ...prev, [langId]: 'success' }))
      } catch (err) {
        console.error(`[AutoTranslate] ${langId}:`, err)
        setStatuses((prev) => ({ ...prev, [langId]: 'error' }))
      }
    },
    [sourceText, onChange],
  )

  // Translate into all target languages in parallel
  const translateAll = useCallback(async () => {
    if (!sourceText) return
    setStatuses(Object.fromEntries(targetLanguages.map((l) => [l.id, 'loading'])))

    const patches: ReturnType<typeof set>[] = []

    await Promise.all(
      targetLanguages.map(async (lang) => {
        try {
          const result = await translateText({
            text: sourceText,
            from: defaultLanguage.id,
            to: lang.id,
            toTitle: lang.title,
          })
          patches.push(set(result, [lang.id]))
          setStatuses((prev) => ({ ...prev, [lang.id]: 'success' }))
        } catch (err) {
          console.error(`[AutoTranslate] ${lang.id}:`, err)
          setStatuses((prev) => ({ ...prev, [lang.id]: 'error' }))
        }
      }),
    )

    if (patches.length > 0) {
      onChange([setIfMissing({}), ...patches])
    }
  }, [sourceText, targetLanguages, onChange])

  return (
    <Stack space={3}>
      {/* ── Translate toolbar ─────────────────────────────────────── */}
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

          <Flex gap={2} wrap="wrap" align="center">
            {/* Per-language buttons */}
            {targetLanguages.map((lang) => {
              const s = statuses[lang.id] ?? 'idle'
              return (
                <Button
                  key={lang.id}
                  text={statusLabel(s, lang.title)}
                  icon={s === 'loading' ? undefined : statusIcon(s)}
                  onClick={() => translateOne(lang.id, lang.title)}
                  disabled={!hasSource || anyLoading}
                  tone={statusTone(s)}
                  mode={s === 'success' ? 'default' : 'ghost'}
                  fontSize={1}
                  padding={2}
                />
              )
            })}

            {/* Divider */}
            <Box style={{ width: 1, height: 20, background: 'var(--card-border-color)' }} />

            {/* Translate all */}
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

          {/* Error hint */}
          {Object.entries(statuses).some(([, s]) => s === 'error') && (
            <Text size={0} muted>
              Some languages failed. Check your{' '}
              <code>SANITY_STUDIO_ANTHROPIC_API_KEY</code> or{' '}
              <code>SANITY_STUDIO_TRANSLATE_ENDPOINT</code> env var and retry.
            </Text>
          )}
        </Stack>
      </Card>

      {/* ── Standard field rendering ──────────────────────────────── */}
      {renderDefault(props)}
    </Stack>
  )
}
