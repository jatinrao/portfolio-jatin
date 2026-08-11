import React, { useCallback, useEffect, useMemo } from 'react'
import { ObjectInputProps, set } from 'sanity'
import {
  Box,
  Card,
  Flex,
  Grid,
  Label,
  Stack,
  Text,
  Select,
  TextInput,
} from '@sanity/ui'

const SVG_TARGET_SELECTOR =
  'path, circle, rect, polyline, polygon, line, ellipse, svg'

interface SvgSettings {
  strokeColor: string
  strokeWidth: string
  strokeLinecap: string
  strokeLinejoin: string
  size: string
}

interface AdvancedSvgValue extends Partial<SvgSettings> {
  sourceSvg?: string
  svg?: string
}

const DEFAULT_SETTINGS: SvgSettings = {
  strokeColor: '#000000',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  size: '24',
}

function generateSvg(sourceSvg: string, settings: SvgSettings): string | null {
  if (!sourceSvg) return null

  try {
    const parser = new DOMParser()
    const document = parser.parseFromString(sourceSvg, 'image/svg+xml')

    const svgElement = document.querySelector('svg')

    if (!svgElement) {
      return null
    }

    svgElement.setAttribute('width', settings.size)
    svgElement.setAttribute('height', settings.size)

    svgElement.querySelectorAll(SVG_TARGET_SELECTOR).forEach((element) => {
      if (
        element.tagName.toLowerCase() === 'svg' ||
        element.hasAttribute('stroke')
      ) {
        element.setAttribute('stroke', settings.strokeColor)
      }

      element.setAttribute('stroke-width', settings.strokeWidth)
      element.setAttribute('stroke-linecap', settings.strokeLinecap)
      element.setAttribute('stroke-linejoin', settings.strokeLinejoin)
    })

    return new XMLSerializer().serializeToString(document)
  } catch (error) {
    console.error('Unable to generate SVG.', error)
    return null
  }
}

export function SvgInput(props: ObjectInputProps) {
  const { value, onChange, renderDefault } = props

  const currentValue = (value ?? {}) as AdvancedSvgValue

  const settings = useMemo<SvgSettings>(
    () => ({
      ...DEFAULT_SETTINGS,
      strokeColor: currentValue.strokeColor ?? DEFAULT_SETTINGS.strokeColor,
      strokeWidth: currentValue.strokeWidth ?? DEFAULT_SETTINGS.strokeWidth,
      strokeLinecap:
        currentValue.strokeLinecap ?? DEFAULT_SETTINGS.strokeLinecap,
      strokeLinejoin:
        currentValue.strokeLinejoin ?? DEFAULT_SETTINGS.strokeLinejoin,
      size: currentValue.size ?? DEFAULT_SETTINGS.size,
    }),
    [
      currentValue.strokeColor,
      currentValue.strokeWidth,
      currentValue.strokeLinecap,
      currentValue.strokeLinejoin,
      currentValue.size,
    ]
  )

  const sourceSvg = currentValue.sourceSvg ?? ''

  const updateSvg = useCallback(
    (changes: Partial<SvgSettings> = {}) => {
      if (!sourceSvg) return

      const nextSettings: SvgSettings = {
        ...settings,
        ...changes,
      }

      const svg = generateSvg(sourceSvg, nextSettings)

      if (!svg) return

      if (svg === currentValue.svg) return

      onChange([set(svg, ['svg'])])
    },
    [sourceSvg, settings, currentValue.svg, onChange]
  )

  useEffect(() => {
    if (!sourceSvg) return

    updateSvg()
  }, [sourceSvg, updateSvg])

  const handleSettingChange = (
    field: keyof SvgSettings,
    value: string
  ) => {
    onChange([set(value, [field])])

    updateSvg({
      [field]: value,
    })
  }

  const previewSvg = currentValue.svg ?? sourceSvg

  return (
    <Stack space={4}>
      {renderDefault(props)}

      {sourceSvg && (
        <Card padding={4} border radius={3}>
          <Grid columns={[1, 1, 2]} gap={4}>
            <Stack space={4}>
              <Text weight="semibold" size={1}>
                SVG Settings
              </Text>

              <Grid columns={2} gap={3}>
                <Box>
                  <Label size={1}>Stroke Color</Label>

                  <input
                    type="color"
                    value={settings.strokeColor}
                    onChange={(event) =>
                      handleSettingChange(
                        'strokeColor',
                        event.currentTarget.value
                      )
                    }
                    style={{
                      width: '100%',
                      height: 38,
                      border: '1px solid #d6d6d6',
                      borderRadius: 4,
                      cursor: 'pointer',
                      marginTop: 6,
                    }}
                  />
                </Box>

                <Box>
                  <Label size={1}>Size</Label>

                  <TextInput
                    type="number"
                    value={settings.size}
                    min={12}
                    max={512}
                    onChange={(event) =>
                      handleSettingChange(
                        'size',
                        event.currentTarget.value
                      )
                    }
                  />
                </Box>
              </Grid>

              <Grid columns={3} gap={3}>
                <Box>
                  <Label size={1}>Stroke Width</Label>

                  <TextInput
                    type="number"
                    value={settings.strokeWidth}
                    min={0.5}
                    max={10}
                    step={0.5}
                    onChange={(event) =>
                      handleSettingChange(
                        'strokeWidth',
                        event.currentTarget.value
                      )
                    }
                  />
                </Box>

                <Box>
                  <Label size={1}>Line Cap</Label>

                  <Select
                    value={settings.strokeLinecap}
                    onChange={(event) =>
                      handleSettingChange(
                        'strokeLinecap',
                        event.currentTarget.value
                      )
                    }
                  >
                    <option value="round">Round</option>
                    <option value="butt">Butt</option>
                    <option value="square">Square</option>
                  </Select>
                </Box>

                <Box>
                  <Label size={1}>Line Join</Label>

                  <Select
                    value={settings.strokeLinejoin}
                    onChange={(event) =>
                      handleSettingChange(
                        'strokeLinejoin',
                        event.currentTarget.value
                      )
                    }
                  >
                    <option value="round">Round</option>
                    <option value="miter">Miter</option>
                    <option value="arcs">Arcs</option>
                    <option value="bevel">Bevel</option>
                  </Select>
                </Box>
              </Grid>
            </Stack>

            <Flex
              direction="column"
              align="center"
              justify="center"
              style={{
                minHeight: 180,
                background: '#f6f6f6',
                borderRadius: 8,
              }}
            >
              <Label size={1}>Preview</Label>

              <Box
                marginTop={3}
                style={{
                  width: `${settings.size}px`,
                  height: `${settings.size}px`,
                  transition: 'all 150ms ease',
                }}
                dangerouslySetInnerHTML={{
                  __html: previewSvg,
                }}
              />
            </Flex>
          </Grid>
        </Card>
      )}
    </Stack>
  )
}