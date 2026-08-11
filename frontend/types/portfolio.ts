import { localize } from '@/lib/locale';

/** Matches whatever your `localize()` helper actually accepts (localized-string, portable text, etc.) */
export type LocalizedText = Parameters<typeof localize>[0];

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string | null;
    dimensions?: { width: number; height: number; aspectRatio?: number } | null;
  } | null;
}

export interface SanityImage {
  asset?: SanityImageAsset | null;
  alt?: string | null;
}

export interface SkillRef {
  _id: string;
  name: LocalizedText;
  slug?: { current: string } | null;
  category?: string | null;
  filter_category?: string | null;
  icon?: { asset?: SanityImageAsset | null } | null;
  svg_icon?: string | null;
}

export interface Organization {
  _id: string;
  name: LocalizedText;
  slug?: { current: string } | null;
  logo?: SanityImage | null;
  website?: string | null;
}

export interface ExperienceEntry {
  _id: string;
  role: LocalizedText;
  employmentType?: string | null;
  location?: string | null;
  startDate: string; // ISO date
  endDate?: string | null;
  isCurrent: boolean;
  description?: LocalizedText | null;
  organization: Organization;
  skills?: SkillRef[] | null;
}

export interface PortfolioHero {
  name: LocalizedText;
  greeting?: LocalizedText | null;
  headline?: LocalizedText | null;
  bio_short?: LocalizedText | null;
  avatar?: SanityImage | null;
}

export interface PortfolioData {
  hero_section: PortfolioHero;
  skills: SkillRef[];
  experience: ExperienceEntry[];
}