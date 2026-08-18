import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Button from '@/components/atoms/Button'

const meta = {
  title: 'HIG/Buttons',
  component: Button,
  args: { children: 'Continue' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'glass', 'outline', 'ghost', 'destructive'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Prominent: Story = {
  name: 'Prominent (primary)',
  args: { variant: 'primary' },
}

export const Glass: Story = {
  args: { variant: 'glass', children: 'Secondary' },
  render: (args) => (
    <div
      className="inline-flex rounded-[28px] p-10"
      style={{ background: 'linear-gradient(120deg, #1c63a0, #ff8d28)' }}
    >
      <Button {...args} />
    </div>
  ),
}

export const Outline: Story = { args: { variant: 'outline' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } }
