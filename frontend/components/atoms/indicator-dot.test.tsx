import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { motionValue } from 'framer-motion'
import { describe, expect, it, vi } from 'vitest'
import { IndicatorDot } from './indicator-dot'

describe('IndicatorDot', () => {
  it('is a page-control hit target', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <IndicatorDot index={0} springIndex={motionValue(0)} label="Go to page 1" onClick={onClick} />,
    )
    await user.click(screen.getByRole('button', { name: 'Go to page 1' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
