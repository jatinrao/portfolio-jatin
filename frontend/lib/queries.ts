import { defineQuery, groq }         from 'next-sanity'
import type { LocaleString, LocaleBlockContent, LangId } from './locale'

// ─── Shared image type ────────────────────────────────────────────────────

export interface SanityImageAsset {
  _id:  string
  url:  string
  metadata: {
    lqip:       string    // base64 blur placeholder
    dimensions: { width: number; height: number }
  }
}
import type { PortableTextBlock } from "@portabletext/types";
import { sanityFetch } from '@/sanity/lib/live'

export interface Post {
  _id: string;
  _type: "post";
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  publishedAt?: string;
  mainImage?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  };
  body?: PortableTextBlock[];
}

export interface SanityImage {
  asset:    SanityImageAsset
  alt:      LocaleString
  caption?: LocaleString
  credit?:  string
}

// ─── Hero data shape ──────────────────────────────────────────────────────
// All localized fields are returned as full objects (all languages),
// so the client-side language switch is instant — no extra fetches.

export interface HeroRawData {
  name:            LocaleString
  greeting:        LocaleString
  headline:        LocaleString
  bio_short:       LocaleBlockContent
  avatar?:          SanityImage
  stats?:           Array<{ value: string; label: LocaleString }>
  openToWork?:      boolean
  openToWorkLabel?: LocaleString
  primaryCta?:   { href: string; text: LocaleString }
  secondaryCta?: { href: string; text: LocaleString }
  channels?:Array<{
    label: LocaleString
    icon: any
    url: string
    openInNewTab?: boolean
    _key: string
  }>
}

// ─── GROQ query ───────────────────────────────────────────────────────────
// Fetches all language variants in one round-trip.
// The front-end picks the active language with localize().

export const heroQuery = groq`
  *[_type == "person"][0]{
    name,
    greeting,
    headline,
    bio_short,
    avatar {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt,
      caption,
      credit
    },
    "stats": stats[]{ value, label },
    openToWork,
    openToWorkLabel,
    "primaryCta":   { "href": primaryCta.href,   "text": primaryCta.text   },
    "secondaryCta": { "href": secondaryCta.href, "text": secondaryCta.text },
  }
`

// ─── Fetch helper ─────────────────────────────────────────────────────────

export async function fetchHeroData(slug: string): Promise<any> {
  const heroQuery = defineQuery(`*[_type == "person" && slug.current == "${slug}"][0]{
    name,
    greeting,
    headline,
    bio_short, avatar {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt,
      caption,
      credit
    }  
    }`)
  return await sanityFetch({query: heroQuery});
}
export async function fetchPortfolioData(slug: string): Promise<any> {
  const heroQuery = defineQuery(`*[_type == "person" && slug.current == "${slug}"][0]{
  "header":{
  header_title,
  location,
  logoImage {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt,
  }, 
  headerCta{
    text,
    ariaLabel,
    href
  },
  "navItems": (
  sections[]->{
    sectionId,
    sectionType,
    showInNav,
    navLabel
  }
)[showInNav != false]{
  "anchorId": sectionId.current,
  "label": navLabel
  }
  
  },
  
    "hero_section": {
    name,
    greeting,
    headline,
    bio_short,
    channels[],
    avatar {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt,
      caption,
      credit
    }
  },
"category_labels": *[_type == "skillCategoryLabels"][0],
  skills[]->{
    _id,
    name,
    slug,
    category,
    filter_category,
    icon {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      }
    },
    svg_icon,
    proficiency,
    experience
  },

  "experience": *[
    _type == "experience" &&
    person._ref == ^._id
  ] | order(startDate desc) {
    _id,
    role,
    employmentType,
    location,
    startDate,
    endDate,
    isCurrent,
    description,

    organization->{
      _id,
      name,
      slug,
      logo {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        },
        alt
      },
      website
    },

    skills[]->{
      _id,
      name,
      slug,
      category,
      filter_category,
      icon {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        }
      },
      svg_icon
    }
  },
  "sections": sections[]->{
    _id,
    sectionType,
    sectionId,
    internalTitle,
    heading,
    subheading,
    content,
    showInNav,
    navLabel
  },
  "navItems": (
  sections[]->{
    sectionId,
    sectionType,
    showInNav,
    navLabel
  }
)[showInNav != false]{
  "anchorId": sectionId.current,
  "label": navLabel
  },
  "projects": *[_type == "project" ]{
    title,
     slug,
  description,
  body,
  projectUrl,
  repositoryUrl,
  startDate,
  endDate,
  isFeatured,
  coverImage{
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
        }
      },
  gallery[] {
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions
    }
  },
  alt,
  caption,
  credit
},
  thumbnail,
  organization,
  skills
  },
  "education": *[
  _type == "education" &&
  person._ref == ^._id
] | order(startDate asc) {
  _id,
  institution->{
    _id,
    name,
    slug,
    logo {
      asset->{
        _id,
        url,
        metadata { lqip, dimensions }
      },
      alt
    },
    website
  },
  degree,
  fieldOfStudy,
  description,
  startDate,
  endDate,
  isCurrent
}
    
  }`)
  return await sanityFetch({query: heroQuery});
}

export const SKILLS_QUERY = defineQuery(`*[_type == "skill"] | order(category asc, name.en asc){
  _id,
  name,
  slug,
  category,
  icon {
    asset->{ _id, url, metadata { lqip, dimensions } }
  }
}`);
 
// export async function fetchSkillsData(): Promise<SKILLS_QUERYResult> {
 
//   const { data } = await sanityFetch({ query: SKILLS_QUERY });
//   return data ?? [];
// }

// export const RESUME_BY_SLUG_QUERY = defineQuery(`
// *[_type == "person" && slug.current == $slug][0]{
//   _id,
//   _updatedAt,
//   slug,
//   "fullName": name,
//   headline,
//   "summary": bio_short,
//   email,
//   phone,
//   location,
//   "website": socialProfiles[platform == "website"][0].url,
//   "linkedin": socialProfiles[platform == "linkedin"][0].url,
//   "github": socialProfiles[platform == "github"][0].url,
//   "skills": skills[]->title,
//   "experience": *[_type == "experience" && references(^._id)] | order(startDate desc) {
//     "_key": _id,
//     company,
//     role,
//     location,
//     startDate,
//     endDate,
//     highlights
//   },
//   "education": *[_type == "education" && references(^._id)] | order(startDate desc) {
//     "_key": _id,
//     institution,
//     degree,
//     fieldOfStudy,
//     startDate,
//     endDate
//   },
//   "projects": *[_type == "project" && references(^._id)] {
//     "_key": _id,
//     name,
//     description,
//     url,
//     technologies
//   }
// }
// `);

