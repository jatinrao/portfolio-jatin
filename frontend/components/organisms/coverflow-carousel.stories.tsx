import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProjectCarousel } from '@/components/organisms/coverflow-carousel'
import { mockProjects, mockProjectsSection } from '@/stories/fixtures'

const meta = {
  title: 'Sections/ProjectCarousel',
  component: ProjectCarousel,
  parameters: { layout: 'fullscreen' },
  args: {
    locale: 'en',
    data: mockProjects,
    section: mockProjectsSection,
  },
} satisfies Meta<typeof ProjectCarousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="h-[640px] bg-surface">
      <ProjectCarousel {...args} />
    </div>
  ),
}

export const DeskChrome: Story = {
  name: 'Headline and desk chrome',
  render: (args) => (
    <div className="flex min-h-[900px] flex-col bg-surface">
      <div className="relative h-[520px]">
        <ProjectCarousel {...args} />
      </div>
    </div>
  ),
}
