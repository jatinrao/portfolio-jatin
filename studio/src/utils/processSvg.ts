export interface ProcessSvgOptions {
  svg: string

  strokeColor: string
  fillColor: string

  strokeWidth: string
  strokeLinecap: string
  strokeLinejoin: string

  size: string
}

const DRAWABLE_ELEMENTS = [
  'path',
  'circle',
  'rect',
  'ellipse',
  'line',
  'polyline',
  'polygon',
] as const

const DRAWABLE_SELECTOR =
  DRAWABLE_ELEMENTS.join(',')

export function processSvg({
  svg,
  strokeColor,
  fillColor,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
  size,
}: ProcessSvgOptions): string {
  if (!svg) {
    return ''
  }

  try {
    const parser = new DOMParser()

    const document =
      parser.parseFromString(
        svg,
        'image/svg+xml'
      )

    const svgElement =
      document.documentElement

    svgElement.setAttribute(
      'width',
      size
    )

    svgElement.setAttribute(
      'height',
      size
    )

    svgElement
      .querySelectorAll(
        DRAWABLE_SELECTOR
      )
      .forEach((element) => {
        if (
          element.hasAttribute(
            'stroke'
          )
        ) {
          element.setAttribute(
            'stroke',
            strokeColor
          )

          element.setAttribute(
            'stroke-width',
            strokeWidth
          )

          element.setAttribute(
            'stroke-linecap',
            strokeLinecap
          )

          element.setAttribute(
            'stroke-linejoin',
            strokeLinejoin
          )
        }

        const fill =
          element.getAttribute(
            'fill'
          )

        if (
          fill &&
          fill !== 'none'
        ) {
          element.setAttribute(
            'fill',
            fillColor
          )
        }
      })

    return new XMLSerializer().serializeToString(
      document
    )
  } catch (error) {
    console.error(
      'Unable to process SVG',
      error
    )

    return svg
  }
}