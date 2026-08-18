import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NavButton } from './nav-button'

describe('NavButton', () => {
  it('uses GlassButton with an accessible name', () => {
    render(
      <NavButton direction="next" label="Next" onClick={() => undefined}>
        →
      </NavButton>,
    )
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('does not fire when disabled', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <NavButton direction="prev" label="Previous" onClick={onClick} disabled>
        ←
      </NavButton>,
    )
    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
