import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Badge from '@/components/atoms/Badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  args: { children: 'Open to work' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
