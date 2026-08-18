import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HeroSection } from '@/components/organisms/HeroSection'
import { mockHero } from '@/stories/fixtures'

const meta = {
  title: 'Sections/Hero',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
  args: { locale: 'en', data: mockHero },
} satisfies Meta<typeof HeroSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
