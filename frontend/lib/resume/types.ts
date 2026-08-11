import type { LocaleString, LocaleBlockContent } from "@/lib/resume/locale-types";
import { Organization, Project, SkillCategoryLabels } from "@/sanity.types";

// lib/resume/types.ts



/**
 * TODO(types): replace with the real portable-text block type if
 * `@portabletext/types` (or `sanity`'s own `PortableTextBlock`) is already
 * a dependency — this is a structurally-loose placeholder so localized
 * rich-text fields (bio, descriptions) still type as "array of blocks per
 * locale" without pulling in an assumed package.
 */
export type PortableTextBlock = Record<string, unknown>;

/** Sanity's `localeBlockContent`-style object: one portable-text array per locale. */
// export type LocaleBlockContent = Partial<Record<string, PortableTextBlock[]>>;

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio?: number };
  };
}

export interface SanityImage {
  asset?: SanityImageAsset;
  alt?: string;
  caption?: string;
  credit?: string;
}

export interface ResumeSlug {
  current: string;
}

/**
 * A dereferenced skill (`skills[]->`), after mapping. `proficiency`/
 * `experience` are genuinely optional — a skill document can have either
 * left blank in Studio, and that's a valid, meaningful state (render as
 * "no data" — see SkillCard's `typeof === 'number'` guards) rather than
 * something the mapper should paper over with a 0/[] default.
 */
export interface ResumeSkillEntry {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: LocaleString;
  slug?: ResumeSlug;
  category?: string;
  filter_category?: string;
  icon?: SanityImage;
  svg_icon?: string;
  /** 0–100 */
  proficiency?: number;
  /** Years */
  experience?: number;
}

export interface ResumeOrganization {
  id: string;
  name: LocaleString;
  slug?: string;
  logo?: SanityImage;
  website?: string;
}

export interface ResumeExperienceEntry {
  id: string;
  /**
   * @deprecated Derived from `organization.name` for backward compat with
   * existing callers. Read `organization.name` directly instead — this
   * field will be removed once nothing references it.
   */
  company: LocaleString;
  organization?: ResumeOrganization;
  role: LocaleString;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: LocaleBlockContent;
  skills: ResumeSkillEntry[];
}

export interface ResumeEducationEntry {
  _id: string;
  institution:LocaleString;
  degree: LocaleString;
  fieldOfStudy?: LocaleString;
  startDate: string;
  endDate?: string;
}

export interface ResumeProjectEntry {
  id: string;
  name: string;
  description: LocaleBlockContent;
  url?: string;
  technologies: string[];
}

export interface ResumeHeader {
  title?: LocaleString;
  location?: string;
  logo?: SanityImage;
  resumeImage?:SanityImage;
}

/**
 * `sectionType` kept as an open union (`(string & {})`) rather than a
 * closed literal set — Studio content editors can introduce new section
 * types the mapper/type layer hasn't seen yet, and this keeps `sections`
 * typed without a build-time dependency on an exhaustive list.
 */
export type ResumeSectionType = "hero" | "skills" | "experience" | (string & {});

export interface ResumeSection {
  id: string;
  sectionType: ResumeSectionType;
  sectionId?: string;
  internalTitle?: string;
  heading?: LocaleString;
  subheading?: LocaleString;
  content?: unknown;
  showInNav?: boolean;
  navLabel?: LocaleString;
}

export interface ResumeModel {
  slug: string;
  name: LocaleString;
  headline: LocaleString;
  bio_short: LocaleBlockContent;
  greeting?: LocaleString;
  avatar?: SanityImage;
  header?: ResumeHeader;
  skills: ResumeSkillEntry[];
  channels:any[];
  resumeImage?:SanityImage;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
  projects: Project[];
  categoryLabels:Record<string,SkillCategoryLabels>;
  sections: ResumeSection[];
  updatedAt: string;
}