import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PROJECT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import ProjectDetail from "./ProjectDetail";

vi.mock("@/sanity/lib/utils", () => ({
  urlForImage: () => ({ url: () => "/hero/gift.png" }),
  // Mirrors the real resolveRichTextLink closely enough for this test —
  // see the identical note in BlogDetail.test.tsx for why this is a plain
  // stub rather than importOriginal.
  resolveRichTextLink: (
    link: { linkType?: string; href?: string; internalRef?: { _type: string; slug: string } | null } | null,
    locale: string,
  ) => {
    if (!link) return null;
    if (link.linkType === "internal" && link.internalRef?.slug) {
      const base = link.internalRef._type === "project" ? "projects" : "blog";
      return { href: `/${locale}/${base}/${link.internalRef.slug}` };
    }
    if (link.linkType === "external" && link.href) return { href: link.href };
    return null;
  },
}));

const mockProject = {
  title: { _type: "localeString", en: "Icon Registry" },
  slug: { _type: "slug", current: "icon-registry" },
  description: null,
  projectUrl: null,
  repositoryUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: null,
  coverImage: null,
  gallery: null,
  body: {
    _type: "localeBlockContent",
    en: [
      {
        _type: "block",
        _key: "p1",
        style: "normal",
        markDefs: [
          { _type: "link", _key: "link-ext", linkType: "external", href: "https://example.com", internalRef: null },
        ],
        children: [
          { _type: "span", _key: "p1-s1", text: "Read the ", marks: [] },
          { _type: "span", _key: "p1-s2", text: "changelog", marks: ["link-ext"] },
          { _type: "span", _key: "p1-s3", text: ".", marks: [] },
        ],
      },
    ],
    es: null,
    fr: null,
    zh: null,
    hi: null,
    ar: null,
  },
} as unknown as NonNullable<PROJECT_BY_SLUG_QUERY_RESULT>;

describe("ProjectDetail", () => {
  it("resolves an external link inside body text", () => {
    render(<ProjectDetail project={mockProject} locale="en" />);
    const link = screen.getByRole("link", { name: "changelog" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
