import React, {
  ChangeEvent,
  ClipboardEvent,
  DragEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { StringInputProps, set, unset } from 'sanity'
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Label,
  Stack,
  Text,
  TextArea,
  useToast,
} from '@sanity/ui'

import { TrashIcon, UploadIcon } from '@sanity/icons'

const MAX_FILE_SIZE = 100 * 1024

const FORBIDDEN_ELEMENTS = [
  'script',
  'foreignObject',
  'iframe',
  'object',
  'embed',
  'audio',
  'video',
]

const DRAWABLE_ELEMENTS = [
  'path',
  'circle',
  'rect',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'g',
]
const DRAWABLE_SELECTOR = DRAWABLE_ELEMENTS.join(',')

interface ValidationResult {
  svg: string
}

function normalizeSvg(document: Document): void {
  const svg = document.documentElement

  // 1. Remove presentation size (controlled externally)
  svg.removeAttribute('width')
  svg.removeAttribute('height')

  // 2. Remove inline style attributes everywhere
  const allElements = svg.querySelectorAll('*')

  allElements.forEach((el) => {
    el.removeAttribute('style')
  })

  // 3. Normalize drawable elements
  const drawableElements = svg.querySelectorAll(
    DRAWABLE_SELECTOR
  )

  drawableElements.forEach((el) => {
    // Force stroke control to be external (your UI)
    el.setAttribute('stroke', 'currentColor')
   const fill = el.getAttribute('fill')

if (fill && fill !== 'none') {
    el.setAttribute('fill', 'currentColor')
}
    // Remove hardcoded stroke/fill overrides
    // el.removeAttribute('stroke-width')
    // el.removeAttribute('stroke-opacity')
    el.removeAttribute('fill-opacity')
  })

  // 4. Clean root SVG attributes that may interfere
//   svg.removeAttribute('stroke')
//   svg.removeAttribute('fill')
  svg.removeAttribute('style')
}

function validateSvg(svg: string): ValidationResult {
  const value = svg.trim()

  if (!value) {
    throw new Error('SVG cannot be empty.')
  }

  if (value.length > MAX_FILE_SIZE) {
    throw new Error('SVG exceeds the maximum supported size (100 KB).')
  }

  const parser = new DOMParser()

  const document = parser.parseFromString(
    value,
    'image/svg+xml'
  )

  if (document.querySelector('parsererror')) {
    throw new Error('The SVG contains invalid XML.')
  }

  const svgElement = document.documentElement

  if (svgElement.tagName.toLowerCase() !== 'svg') {
    throw new Error('Root element must be <svg>.')
  }

  if (!svgElement.hasAttribute('viewBox')) {
    throw new Error(
      'SVG must define a viewBox attribute.'
    )
  }

  for (const tag of FORBIDDEN_ELEMENTS) {
    if (document.querySelector(tag)) {
      throw new Error(
        `Unsupported SVG element: <${tag}>.`
      )
    }
  }

  const hasDrawableContent =
    DRAWABLE_ELEMENTS.some(tag =>
      document.querySelector(tag)
    )

  if (!hasDrawableContent) {
    throw new Error(
      'SVG does not contain drawable elements.'
    )
  }

  const hasEventHandlers = Array.from(
    document.querySelectorAll('*')
  ).some(node =>
    Array.from(node.attributes).some(attribute =>
      attribute.name
        .toLowerCase()
        .startsWith('on')
    )
  )

  if (hasEventHandlers) {
    throw new Error(
      'SVG contains inline event handlers.'
    )
  }
  normalizeSvg(document);
  return {
    svg: new XMLSerializer().serializeToString(
      document
    ),
  }
}

export function InlineSvgInput(
  props: StringInputProps
) {
  const { value, onChange } = props

  const toast = useToast()

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [editorValue, setEditorValue] =
    useState(value ?? '')

  const [previewSvg, setPreviewSvg] =
    useState(value ?? '')

  const [dragging, setDragging] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    setEditorValue(value ?? '')
    setPreviewSvg(value ?? '')
  }, [value])

    const commitSvg = useCallback(
    (svg: string) => {
      try {
        const { svg: validatedSvg } = validateSvg(svg)

        setError(null)
        setEditorValue(validatedSvg)
        setPreviewSvg(validatedSvg)

        onChange(set(validatedSvg))
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to process SVG.'

        setError(message)

        toast.push({
          closable: true,
          status: 'error',
          title: message,
        })
      }
    },
    [onChange, toast]
  )

  const readFile = useCallback(
    (file: File) => {
      if (
        file.type !== 'image/svg+xml' &&
        !file.name.toLowerCase().endsWith('.svg')
      ) {
        setError('Please select a valid SVG file.')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setError('SVG exceeds the maximum supported size (100 KB).')
        return
      }

      const reader = new FileReader()

      reader.onload = event => {
        const result = event.target?.result

        if (typeof result === 'string') {
          commitSvg(result)
        }
      }

      reader.onerror = () => {
        const message = 'Unable to read the selected SVG.'

        setError(message)

        toast.push({
          closable: true,
          status: 'error',
          title: message,
        })
      }

      reader.readAsText(file)
    },
    [commitSvg, toast]
  )

  const browseSvg = () => {
    fileInputRef.current?.click()
  }

  const clearSvg = () => {
    setEditorValue('')
    setPreviewSvg('')
    setError(null)

    onChange(unset())
  }

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    readFile(file)

    // Allow selecting the same file again
    event.target.value = ''
  }

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()

    setDragging(false)

    const file = event.dataTransfer.files?.[0]

    if (!file) {
      return
    }

    readFile(file)
  }

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()

    if (!dragging) {
      setDragging(true)
    }
  }

  const handleDragLeave = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()

    if (event.currentTarget === event.target) {
      setDragging(false)
    }
  }

  const handlePaste = (
    event: ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const pastedText =
      event.clipboardData.getData('text')

    if (!pastedText.trim()) {
      return
    }

    event.preventDefault()

    setEditorValue(pastedText)

    commitSvg(pastedText)
  }

  const handleBlur = () => {
    if (editorValue !== previewSvg) {
      commitSvg(editorValue)
    }
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === 'Enter'
    ) {
      event.preventDefault()

      commitSvg(editorValue)
    }
  }

    return (
    <Stack space={4}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        hidden
        onChange={handleFileChange}
      />

      <Grid columns={[1, 1, 2]} gap={4}>
        <Card
          padding={4}
          radius={3}
          border
          tone={dragging ? 'primary' : 'transparent'}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            transition: '150ms ease',
            borderStyle: dragging ? 'solid' : 'dashed',
          }}
        >
          <Stack space={4}>
            <Flex align="center" justify="space-between">
              <Label>Source SVG</Label>

              <Flex gap={2}>
                <Button
                  icon={UploadIcon}
                  mode="ghost"
                  text="Browse"
                  onClick={browseSvg}
                />

                <Button
                  icon={TrashIcon}
                  mode="ghost"
                  tone="critical"
                  text="Clear"
                  disabled={!editorValue.trim()}
                  onClick={clearSvg}
                />
              </Flex>
            </Flex>

            <Text size={1} muted>
              Drag &amp; drop an SVG, browse for a file, or paste SVG markup.
              Press <strong>Ctrl/Cmd + Enter</strong> or leave the field to
              apply your changes.
            </Text>

            <TextArea
              rows={18}
              value={editorValue}
              placeholder="<svg ...>...</svg>"
              onChange={(event) =>
                setEditorValue(event.currentTarget.value)
              }
              onPaste={handlePaste}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '12px',
              }}
            />

            {error && (
              <Card padding={3} radius={2} tone="critical">
                <Text size={1}>{error}</Text>
              </Card>
            )}
          </Stack>
        </Card>

        <Card
          padding={4}
          radius={3}
          border
        >
          <Stack space={4}>
            <Label>Preview</Label>

            <Flex
              align="center"
              justify="center"
              style={{
                minHeight: 360,
                borderRadius: 6,
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                backgroundImage: `
                  linear-gradient(45deg,#ececec 25%,transparent 25%),
                  linear-gradient(-45deg,#ececec 25%,transparent 25%),
                  linear-gradient(45deg,transparent 75%,#ececec 75%),
                  linear-gradient(-45deg,transparent 75%,#ececec 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition:
                  '0 0, 0 10px, 10px -10px, -10px 0',
              }}
            >
              {previewSvg ? (
                <Box
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    padding: '2rem',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: previewSvg,
                  }}
                />
              ) : (
                <Stack space={2}>
                  <Text muted align="center">
                    No SVG loaded
                  </Text>

                  <Text size={1} muted align="center">
                    Upload, drop or paste an SVG to preview it.
                  </Text>
                </Stack>
              )}
            </Flex>

            {previewSvg && (
              <Text size={1} muted>
                The preview always displays the last successfully validated SVG.
              </Text>
            )}
          </Stack>
        </Card>
      </Grid>
    </Stack>
  )
}