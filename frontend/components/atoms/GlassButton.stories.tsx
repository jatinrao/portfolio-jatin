import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { GlassButton } from '@/components/atoms/GlassButton'

const meta = {
  title: 'HIG/Glass Button',
  component: GlassButton,
  args: { children: 'Glass control' },
} satisfies Meta<typeof GlassButton>

export default meta
type Story = StoryObj<typeof meta>

export const Regular: Story = {}

export const Clear: Story = {
  args: { variant: 'clear' },
}

export const Tinted: Story = {
  args: { tint: '#ff8d28' },
}

export const OnBusyBackground: Story = {
  render: (args) => (
    <div
      className="flex min-h-48 items-center justify-center rounded-[var(--radius-card)] p-10"
      style={{ background: 'linear-gradient(120deg, #5e5ce6, #ff375f, #34c759)' }}
    >
      <GlassButton {...args} />
    </div>
  ),
}
