import type { HeaderData } from '@/components/organisms/Header'
import type { HeroRawData } from '@/lib/queries'
import type { ExperienceEntry } from '@/types/portfolio'
import type { Project, Section, Skill } from '@/sanity.types'

const loc = (en: string) => ({ _type: 'localeString' as const, en })

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
