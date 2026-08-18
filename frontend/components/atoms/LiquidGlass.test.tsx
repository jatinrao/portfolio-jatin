import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LiquidGlass } from './LiquidGlass'

describe('LiquidGlass', () => {
  it('renders children on the glass surface', () => {
    render(
      <LiquidGlass engine="css">
        <p>Panel</p>
      </LiquidGlass>,
    )
    expect(screen.getByText('Panel')).toBeInTheDocument()
  })
})
