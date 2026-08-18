import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SvgIcon from './SvgIcon'

describe('SvgIcon', () => {
  it('returns nothing without markup', () => {
    const { container } = render(<SvgIcon src={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('inlines tinted SVG', () => {
    const { container } = render(
      <SvgIcon
        src={{ _type: 'svg', svg: '<svg><path fill="#000" d="M0 0h1v1H0z"/></svg>' } as never}
        accentColor="#1b7a4a"
        width={24}
      />,
    )
    expect(container.innerHTML).toContain('#1b7a4a')
  })
})
