import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MobileNavToggle } from './MobileNavToggle'

describe('MobileNavToggle', () => {
  it('opens the menu and lists nav items', async () => {
    const user = userEvent.setup()
    render(
      <MobileNavToggle
        navItems={[{ label: 'Skills', anchorId: 'skills' }]}
        contactHref="#contact"
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('link', { name: /skills/i })).toHaveAttribute('href', '#skills')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })
})
