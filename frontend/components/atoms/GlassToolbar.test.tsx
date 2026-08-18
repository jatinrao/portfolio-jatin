import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GlassToolbar } from './GlassToolbar'

describe('GlassToolbar', () => {
  it('exposes a named toolbar', () => {
    render(
      <GlassToolbar label="Site controls">
        <button type="button">Theme</button>
      </GlassToolbar>,
    )
    expect(screen.getByRole('toolbar', { name: 'Site controls' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument()
  })
})
