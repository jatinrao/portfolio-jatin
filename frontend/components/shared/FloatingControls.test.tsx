import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LanguageProvider } from '@/components/organisms/LanguageContext'
import { FloatingControls } from './FloatingControls'

describe('FloatingControls', () => {
  it('groups theme and language on one toolbar', async () => {
    render(
      <LanguageProvider lang="en">
        <FloatingControls />
      </LanguageProvider>,
    )
    expect(screen.getByRole('toolbar', { name: 'Site controls' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /current language/i })).toBeInTheDocument()
  })
})
