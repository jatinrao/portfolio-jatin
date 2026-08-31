import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImageFrame3D } from "./ImageFrame3D";

const meta = {
  title: "Molecules/ImageFrame3D",
  component: ImageFrame3D,
  parameters: { layout: "fullscreen" },
  args: {
    src: "/images/frame-demo-photo.jpg",
    alt: "A hazy horizon over sand and sea",
  },
} satisfies Meta<typeof ImageFrame3D>;

export default meta;
type Story = StoryObj<typeof meta>;

const stage = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "4rem",
  boxSizing: "border-box" as const,
  background:
    "radial-gradient(120% 90% at 46% 26%, #f0f0f0 0%, #e7e7e8 46%, #dcdcdd 100%)",
};

export const Default: Story = {
  render: (args) => (
    <div style={stage}>
      <div style={{ width: "min(940px, 100%)" }}>
        <ImageFrame3D {...args} />
      </div>
    </div>
  ),
};

export const Small: Story = {
  render: (args) => (
    <div style={stage}>
      <div style={{ width: "320px" }}>
        <ImageFrame3D {...args} />
      </div>
    </div>
  ),
};

export const Angled: Story = {
  args: { yaw: 3, pitch: 0.6 },
  render: (args) => (
    <div style={stage}>
      <div style={{ width: "min(940px, 100%)" }}>
        <ImageFrame3D {...args} />
      </div>
    </div>
  ),
};

export const AsBlogCover: Story = {
  render: (args) => (
    <div style={{ ...stage, padding: "2rem" }}>
      <div style={{ width: "360px" }}>
        <ImageFrame3D {...args} />
      </div>
    </div>
  ),
};
