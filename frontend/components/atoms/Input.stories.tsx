import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  args: { placeholder: 'Your name' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {}

export const TextArea: Story = {
  render: () => <Textarea placeholder="Message" />,
}
