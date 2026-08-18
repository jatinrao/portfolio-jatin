import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Footer } from '@/components/organisms/Footer'

const meta = {
  title: 'Chrome/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDirectory: Story = {
  args: {
    brandName: 'Jatin Kumar',
    tagline: 'Full stack engineer',
    locale: 'en',
    navItems: [
      { anchorId: 'skills', label: 'Skills' },
      { anchorId: 'experience', label: 'Experience' },
      { anchorId: 'projects', label: 'Projects' },
    ],
    socialLinks: [{ label: 'LinkedIn', href: 'https://linkedin.com' }],
    legalLinks: [{ label: 'Privacy', href: '/privacy' }],
  },
}
