import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LanguageSwitcher } from '@/components/organisms/LanguageSwitcher'

const meta = {
  title: 'Chrome/LanguageSwitcher',
  component: LanguageSwitcher,
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex min-h-80 items-end justify-end p-10">
      <LanguageSwitcher />
    </div>
  ),
}
