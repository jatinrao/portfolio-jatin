import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusBadge } from '@/components/atoms/status-badge'

const meta = {
  title: 'Atoms/StatusBadge',
  component: StatusBadge,
  args: { status: 'ACTIVE' },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Emphasized: Story = { args: { emphasized: true } }
