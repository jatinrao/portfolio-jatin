import type { HeaderData } from '@/components/organisms/Header'
import type { HeroRawData } from '@/lib/queries'
import type { ExperienceEntry } from '@/types/portfolio'
import type { Project, Section, Skill } from '@/sanity.types'
import type {
  ALL_BLOGS_QUERY_RESULT,
  BLOG_BY_SLUG_QUERY_RESULT,
} from '@/sanity.types'

const loc = (en: string) => ({ _type: 'localeString' as const, en })
const locText = (en: string) => ({ _type: 'localeText' as const, en })

export const mockHeader: HeaderData = {
  header_title: loc('Jatin Kumar'),
  location: loc('Remote'),
  logoImage: null,
  headerCta: {
    text: loc('Contact'),
    ariaLabel: loc('Contact'),
    href: '#contact',
  },
  navItems: [
    { anchorId: 'skills', label: loc('Skills') },
    { anchorId: 'experience', label: loc('Experience') },
    { anchorId: 'projects', label: loc('Projects') },
  ],
}

export const mockHero: HeroRawData = {
  name: { en: 'Jatin Kumar' },
  greeting: { en: 'Hi, my name is' },
  headline: { en: 'I build product surfaces that feel inevitable.' },
  bio_short: {
    en: [
      {
        _type: 'block',
        _key: 'bio',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 't',
            text: 'Full-stack engineer working across Next.js, Sanity, and design systems.',
            marks: [],
          },
        ],
      },
    ],
  },
  avatar: {
    asset: {
      _id: 'avatar',
      url: '/hero/gift.png',
      metadata: {
        lqip: '',
        dimensions: { width: 800, height: 800 },
      },
    },
    alt: { en: 'Portrait' },
  },
  stats: [
    { value: '8+', label: { en: 'Years' } },
    { value: '12', label: { en: 'Products' } },
  ],
  openToWork: true,
  openToWorkLabel: { en: 'Open to Work' },
  channels: [
    {
      _key: 'li',
      label: { en: 'LinkedIn' },
      icon: null,
      url: 'https://linkedin.com',
      openInNewTab: true,
    },
  ],
}

function skill(
  id: string,
  name: string,
  iconName: string,
  filter_category: Skill['filter_category'],
): Skill {
  return {
    _id: id,
    _type: 'skill',
    _createdAt: '2024-01-01',
    _updatedAt: '2024-01-01',
    _rev: '1',
    name: loc(name),
    slug: { _type: 'slug', current: id },
    proficiency: 88,
    experience: 6,
    filter_category,
    iconName,
  }
}

export const mockSkills: Skill[] = [
  skill('react', 'React', 'react', 'frontend'),
  skill('next', 'Next.js', 'nextjs', 'frontend'),
  skill('css', 'CSS', 'css3', 'frontend'),
  skill('node', 'Node.js', 'nodejs', 'backend'),
  skill('sanity', 'Sanity', 'sanity', 'backend'),
  skill('sql', 'SQL', 'postgresql', 'backend'),
  skill('ai', 'AI', 'openai', 'ai'),
  skill('py', 'Python', 'python', 'ai'),
  skill('ts', 'TypeScript', 'typescript', 'frontend'),
]

export const mockExperience: ExperienceEntry[] = [
  {
    _id: 'exp-1',
    role: { en: 'Staff Engineer' },
    startDate: '2022-03-01',
    isCurrent: true,
    description: { en: 'Leading the design system and CMS-backed marketing surfaces.' },
    organization: {
      _id: 'org-1',
      name: { en: 'Acme' },
      logo: null,
    },
  },
  {
    _id: 'exp-2',
    role: { en: 'Senior Engineer' },
    startDate: '2019-01-01',
    endDate: '2022-02-01',
    isCurrent: false,
    description: { en: 'Shipped product infrastructure for a multi-locale storefront.' },
    organization: {
      _id: 'org-2',
      name: { en: 'Northwind' },
      logo: null,
    },
  },
]

export const mockEducation = [
  {
    _id: 'edu-1',
    institution: { name: { en: 'State University' } },
    degree: { en: 'B.S.' },
    fieldOfStudy: 'Computer Science',
    startDate: '2014-09-01',
    endDate: '2018-05-01',
  },
]

export const mockProjects = [
  {
    _id: 'proj-1',
    _type: 'project',
    _createdAt: '2024-01-01',
    _updatedAt: '2024-01-01',
    _rev: '1',
    title: loc('Portfolio'),
    slug: { _type: 'slug', current: 'portfolio' },
    description: { en: 'A Sanity-powered site with rooms, resume PDF, and liquid glass chrome.' },
    isFeatured: true,
    startDate: '2025-01-01',
  },
  {
    _id: 'proj-2',
    _type: 'project',
    _createdAt: '2024-01-01',
    _updatedAt: '2024-01-01',
    _rev: '1',
    title: loc('Design Tokens'),
    slug: { _type: 'slug', current: 'tokens' },
    description: { en: 'Live token editor wired to CSS custom properties.' },
    startDate: '2024-06-01',
    endDate: '2025-01-01',
  },
  {
    _id: 'proj-3',
    _type: 'project',
    _createdAt: '2024-01-01',
    _updatedAt: '2024-01-01',
    _rev: '1',
    title: loc('Skill River'),
    slug: { _type: 'slug', current: 'skills' },
    description: { en: 'Scroll-revealed skill posters in an Apple TV-style river.' },
    startDate: '2025-03-01',
  },
] as unknown as Project[]

export const mockProjectsSection = {
  _id: 'section-projects',
  _type: 'section',
  _createdAt: '2024-01-01',
  _updatedAt: '2024-01-01',
  _rev: '1',
  sectionType: 'projects',
  sectionId: { _type: 'slug', current: 'projects' },
  heading: loc('Projects'),
} as Section

// ─── Blog ───────────────────────────────────────────────────────────────

const mockCoverImage = {
  asset: {
    _id: 'blog-cover',
    url: '/hero/gift.png',
    metadata: {
      lqip: '',
      dimensions: { _type: 'sanity.imageDimensions' as const, width: 1200, height: 630, aspectRatio: 1200 / 630 },
    },
  },
  alt: loc('Cover art'),
  caption: null,
  credit: null,
}

/** Exercises every blog body block variant: paragraph, pull-quote
 * (blockquote), calloutBox, codeSnippet, and a comparisonTable with a
 * group row + two data rows. */
export const mockBlogPost: NonNullable<BLOG_BY_SLUG_QUERY_RESULT> = {
  _id: 'blog-1',
  title: loc('Mount the Frame, Not the Picture'),
  slug: { _type: 'slug', current: 'mount-the-frame-not-the-picture' },
  category: 'Shipping Notes',
  dek: locText('An icon needs a frame to hang in and a picture to hang there.'),
  publishedDate: '2026-08-01',
  isFeatured: true,
  author: {
    name: loc('Jatin Kumar'),
    avatar: null,
  },
  coverImage: mockCoverImage,
  stats: [
    { _type: 'stat', _key: 's1', value: '633', label: 'bundled icons' },
    { _type: 'stat', _key: 's2', value: '1', label: 'shared registry' },
  ],
  body: {
    _type: 'blogBlockContent',
    en: [
      {
        _type: 'block',
        _key: 'p1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'p1-s', text: 'Every icon makes two decisions at once.', marks: [] }],
      },
      {
        _type: 'block',
        _key: 'p-links',
        style: 'normal',
        markDefs: [
          {
            _type: 'link',
            _key: 'link-ext',
            linkType: 'external',
            href: 'https://icons.getresume.dev',
            internalRef: null,
          },
          {
            _type: 'link',
            _key: 'link-int',
            linkType: 'internal',
            internalRef: { _type: 'blog', slug: 'a-minimal-post' },
          },
        ],
        children: [
          { _type: 'span', _key: 'p-links-s1', text: 'See the ', marks: [] },
          { _type: 'span', _key: 'p-links-s2', text: 'docs', marks: ['link-ext'] },
          { _type: 'span', _key: 'p-links-s3', text: ' or the ', marks: [] },
          { _type: 'span', _key: 'p-links-s4', text: 'other post', marks: ['link-int'] },
          { _type: 'span', _key: 'p-links-s5', text: '.', marks: [] },
        ],
      },
      {
        _type: 'customImage',
        _key: 'img1',
        asset: mockCoverImage.asset,
        alt: loc('A framed screenshot mid-body'),
        caption: loc('Editors can drop images between paragraphs.'),
        credit: 'Sanity Studio',
      },
      {
        _type: 'block',
        _key: 'q1',
        style: 'blockquote',
        markDefs: [],
        children: [{ _type: 'span', _key: 'q1-s', text: 'Mount the frame, hand the picture over.', marks: [] }],
      },
      {
        _type: 'calloutBox',
        _key: 'c1',
        label: "What we're actually claiming",
        text: locText('A narrower claim than "faster" or "smaller".'),
      },
      {
        _type: 'codeSnippet',
        _key: 'cs1',
        label: 'packages/react — usage',
        language: 'tsx',
        code: `<Icon name="docker" size={32} />`,
      },
      {
        _type: 'comparisonTable',
        _key: 'ct1',
        caption: 'Evaluated against packages/core',
        columns: [
          { _type: 'tableColumn', _key: 'col1', name: 'Icon font', descriptor: 'Font Awesome', highlight: false },
          { _type: 'tableColumn', _key: 'col2', name: '@web-portfolio/icons', descriptor: 'This repo', highlight: true },
        ],
        rows: [
          { _type: 'tableGroupRow', _key: 'g1', label: 'Writing it' },
          {
            _type: 'tableDataRow',
            _key: 'r1',
            label: 'Adding an icon',
            cells: [
              { _type: 'tableCell', _key: 'r1c1', icon: 'close', note: 'nothing checks the glyph exists' },
              { _type: 'tableCell', _key: 'r1c2', icon: 'check', note: 'one prop' },
            ],
          },
        ],
        footnote: 'Scoped to this row only.',
      },
    ],
    es: null,
    fr: null,
    zh: null,
    hi: null,
    ar: null,
  },
  footerLinks: [
    { _type: 'footerLink', _key: 'l1', label: 'icons.getresume.dev', url: 'https://icons.getresume.dev' },
  ],
  seo: null,
}

/** Minimal variant — stats/footerLinks/comparisonTable all omitted, author
 * null, to exercise the "optional and absent" render paths. */
export const mockBlogPostMinimal: NonNullable<BLOG_BY_SLUG_QUERY_RESULT> = {
  _id: 'blog-2',
  title: loc('A Minimal Post'),
  slug: { _type: 'slug', current: 'a-minimal-post' },
  category: 'Update',
  dek: locText('A post with no optional sections filled in.'),
  publishedDate: '2026-07-01',
  isFeatured: false,
  author: null,
  coverImage: mockCoverImage,
  stats: null,
  body: {
    _type: 'blogBlockContent',
    en: [
      {
        _type: 'block',
        _key: 'mp1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'mp1-s', text: 'Just a paragraph.', marks: [] }],
      },
    ],
    es: null,
    fr: null,
    zh: null,
    hi: null,
    ar: null,
  },
  footerLinks: null,
  seo: null,
}

export const mockBlogListItem: ALL_BLOGS_QUERY_RESULT[number] = {
  _id: mockBlogPost._id,
  title: mockBlogPost.title,
  slug: mockBlogPost.slug,
  category: mockBlogPost.category,
  dek: mockBlogPost.dek,
  publishedDate: mockBlogPost.publishedDate,
  isFeatured: mockBlogPost.isFeatured,
  author: mockBlogPost.author,
  coverImage: mockBlogPost.coverImage,
  stats: mockBlogPost.stats,
}
