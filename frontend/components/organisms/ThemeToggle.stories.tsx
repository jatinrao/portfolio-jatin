import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ThemeToggle } from '@/components/organisms/ThemeToggle'

const meta = {
  title: 'Chrome/ThemeToggle',
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-10">
      <ThemeToggle />
    </div>
  ),
}
