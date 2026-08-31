import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { mockBlogListItem } from "@/stories/fixtures";
import type { ALL_BLOGS_QUERY_RESULT } from "@/sanity.types";
import { BlogCard } from "./BlogCard";

type BlogListItem = ALL_BLOGS_QUERY_RESULT[number];

// mockBlogListItem's coverImage carries a plain `url`, not a Sanity asset
// `_ref` — fine for BlogCard.test.tsx (which mocks urlForImage entirely),
// but the real url builder derives a ref from that `url` and rejects it,
// which Storybook can't mock away. Swap in a bare `_ref` (dropping `url`,
// which the builder otherwise prefers) so it resolves without throwing;
// the frame's own chrome (mat, rails, shadow) is what these stories are
// demonstrating, not this particular asset's pixels.
const storyPost: BlogListItem = {
  ...mockBlogListItem,
  coverImage: {
    ...mockBlogListItem.coverImage,
    asset: { _ref: "image-0000000000000000000000000000000000000000-1600x860-jpg" } as unknown as BlogListItem["coverImage"]["asset"],
  },
};

const meta = {
  title: "Molecules/BlogCard",
  component: BlogCard,
  parameters: { layout: "padded" },
  args: {
    post: storyPost,
    locale: "en",
  },
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "360px" }}>
      <BlogCard {...args} />
    </div>
  ),
};

export const NoCoverImage: Story = {
  render: (args) => (
    <div style={{ width: "360px" }}>
      <BlogCard {...args} post={{ ...args.post, coverImage: { ...args.post.coverImage, asset: null } }} />
    </div>
  ),
};

export const Grid: Story = {
  render: (args) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      <BlogCard {...args} />
      <BlogCard {...args} post={{ ...args.post, _id: "2", title: { _type: "localeString", en: "A Shorter Title" } }} />
      <BlogCard {...args} post={{ ...args.post, _id: "3", coverImage: { ...args.post.coverImage, asset: null } }} />
    </div>
  ),
};
