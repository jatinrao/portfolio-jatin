import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GlassButton } from './GlassButton'

describe('GlassButton', () => {
  it('renders a 44pt control', () => {
    render(<GlassButton>Done</GlassButton>)
    expect(screen.getByRole('button', { name: 'Done' })).toBeEnabled()
  })

  it('forwards click', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<GlassButton onClick={onClick}>Tap</GlassButton>)
    await user.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
