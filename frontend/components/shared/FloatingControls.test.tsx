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

  it('omits the download button when no resumeSlug is given', () => {
    render(
      <LanguageProvider lang="en">
        <FloatingControls />
      </LanguageProvider>,
    )
    expect(screen.queryByRole('link', { name: /download resume/i })).not.toBeInTheDocument()
  })

  it('adds a resume download link when resumeSlug is given', () => {
    render(
      <LanguageProvider lang="en">
        <FloatingControls resumeSlug="jatin-kumar" />
      </LanguageProvider>,
    )
    const link = screen.getByRole('link', { name: /download resume/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('slug=jatin-kumar'))
    expect(link).toHaveAttribute('href', expect.stringContaining('lang=en'))
  })
})
