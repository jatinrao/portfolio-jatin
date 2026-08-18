import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { motionValue } from 'framer-motion'
import { describe, expect, it, vi } from 'vitest'
import { CarouselIndicators } from './carousel-indicators'

describe('CarouselIndicators', () => {
  it('renders a page control for each project', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<CarouselIndicators count={3} springIndex={motionValue(0)} onSelect={onSelect} />)
    expect(screen.getByRole('navigation', { name: 'Project pages' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Go to page 2 of 3' }))
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
