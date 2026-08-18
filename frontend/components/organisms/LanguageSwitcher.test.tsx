import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LanguageProvider } from './LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('opens a language listbox', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider lang="en">
        <LanguageSwitcher />
      </LanguageProvider>,
    )
    await user.click(screen.getByRole('button', { name: /current language/i }))
    expect(screen.getByRole('listbox', { name: 'Select language' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /english/i })).toHaveAttribute('aria-selected', 'true')
  })
})
