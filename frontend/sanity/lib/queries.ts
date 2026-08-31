import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

// Shared by any `richTextBlock`-based body field (blog, project): dereferences
// the `link` mark's internal-page reference so the frontend can resolve a
// slug without a second round trip. External links carry their own `href`
// already, no dereference needed there. Gated on `_type == "block"` — the
// other array members (calloutBox, customImage, ...) have no `markDefs`
// field at all, and projecting it unconditionally would tack a spurious
// `markDefs: null` onto every one of them.
const richTextLinkDeref = /* groq */ `
  _type == "block" => {
    markDefs[]{
      ...,
      _type == "link" => {
        ...,
        internalRef->{ _type, "slug": slug.current }
      }
    }
  }
`

// blogBlockContent-only: dereferences an embedded image's asset, same shape
// as coverImage elsewhere.
const blogBodyImageDeref = /* groq */ `
  _type == "customImage" => {
    asset->{ _id, url, metadata { lqip, dimensions } }
  }
`

// blogBlockContent/localeBlockContent are per-language OBJECTS (one array
// per locale — en/es/fr/zh/hi/ar, see frontend/i18n/config.ts), not a single
// flat array — GROQ has no wildcard-key projection, so every locale is
// projected explicitly. (Typegen statically parses these query strings, so
// this can't be built with `.map()`/`.join()` — it needs a literal template.)
const blogBodyField = /* groq */ `body{
  _type,
  en[]{ ..., ${richTextLinkDeref}, ${blogBodyImageDeref} },
  es[]{ ..., ${richTextLinkDeref}, ${blogBodyImageDeref} },
  fr[]{ ..., ${richTextLinkDeref}, ${blogBodyImageDeref} },
  zh[]{ ..., ${richTextLinkDeref}, ${blogBodyImageDeref} },
  hi[]{ ..., ${richTextLinkDeref}, ${blogBodyImageDeref} },
  ar[]{ ..., ${richTextLinkDeref}, ${blogBodyImageDeref} },
}`

const projectBodyField = /* groq */ `body{
  _type,
  en[]{ ..., ${richTextLinkDeref} },
  es[]{ ..., ${richTextLinkDeref} },
  fr[]{ ..., ${richTextLinkDeref} },
  zh[]{ ..., ${richTextLinkDeref} },
  hi[]{ ..., ${richTextLinkDeref} },
  ar[]{ ..., ${richTextLinkDeref} },
}`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

// `body` itself is projected separately (see blogBodyField) since its
// embedded images and internal links need dereferencing — everything else
// here needs no dereference: comparisonTable's per-cell `icon` is a plain
// iconRef string (a registry key, not an asset reference), same as
// skill.iconName elsewhere.
const blogFields = /* groq */ `
  _id,
  title,
  slug,
  category,
  dek,
  publishedDate,
  isFeatured,
  author->{ name, avatar{ asset->{ _id, url, metadata { lqip, dimensions } }, alt } },
  coverImage{
    asset->{ _id, url, metadata { lqip, dimensions } },
    alt,
    caption,
    credit
  },
  stats,
`

export const blogSlugs = defineQuery(`
  *[_type == "blog" && defined(slug.current)]
  {"slug": slug.current}
`)

export const ALL_BLOGS_QUERY = defineQuery(`
  *[_type == "blog" && defined(slug.current)] | order(publishedDate desc) {
    ${blogFields}
  }
`)

export const BLOG_BY_SLUG_QUERY = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ${blogFields}
    ${blogBodyField},
    footerLinks,
    seo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage{
        asset->{ url, metadata { dimensions } },
        alt
      },
      twitterCard,
      twitterTitle,
      twitterDescription,
      noIndex,
      noFollow
    },
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const projectSlugs = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  {"slug": slug.current}
`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
*[_type == "project" && slug.current == $slug][0]{
  title,
  slug,
  description,
  ${projectBodyField},
  projectUrl,
  repositoryUrl,
  startDate,
  endDate,
  isFeatured,
  coverImage{
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    caption,
    credit
  },
  gallery[]{
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt,
    caption,
    credit
  },
}
`)

export const RESUME_BY_SLUG_QUERY = defineQuery(`
*[_type == "person" && slug.current == $slug][0]{
_id,
_updatedAt,
slug,  
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
  
  },
  
  "hero_section": {
    name,
    greeting,
    headline,
    bio_short,
    channels[],
    "stats": stats[]{ value, label },
    openToWork,
    openToWorkLabel,
    "primaryCta":   { "href": primaryCta.href,   "text": primaryCta.text   },
    "secondaryCta": { "href": secondaryCta.href, "text": secondaryCta.text },
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
    },
    resumeImage{
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
    }},
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
    iconName,
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
      svg_icon,
      iconName
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
  "projects": projects[]->{
    title,
     slug,
  description,
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
  

  },
  "education": *[
  _type == "education" &&
  person._ref == ^._id
] | order(startDate asc) {
  _id,
 institution->{
 name
 },
  degree,
  fieldOfStudy,
  description,
  startDate,
  endDate,
  isCurrent
}
  
    
  }`);

export const PORTFOLIO_BY_SLUG_QUERY = defineQuery(`
*[_type == "person" && slug.current == $slug][0]{
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
    "stats": stats[]{ value, label },
    openToWork,
    openToWorkLabel,
    "primaryCta":   { "href": primaryCta.href,   "text": primaryCta.text   },
    "secondaryCta": { "href": secondaryCta.href, "text": secondaryCta.text },
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
    iconName,
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
      svg_icon,
      iconName
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
  
    
  }`);

export const METADATA_QUERY = defineQuery(`*[_type == "person"][0]{
    seo{
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage{
        asset->{
          url,
          metadata{ dimensions }
        },
        alt
      },
      ogType,
      ogSiteName,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage{
        asset->{
          url,
          metadata{ dimensions }
        },
        alt
      },
      noIndex,
      noFollow
    },
    name,
    headline,
    bio_short,
    channels[],
    avatar{
      asset->{
        url,
        metadata{ dimensions }
      },
      alt
    },
    logoImage{
      asset->{
        url,
        metadata{ dimensions }
      },
      alt
    }
  }
`)

/**
 * Resolves the site's canonical author by slug (the SITE_AUTHOR_SLUG env
 * var), independent of whichever person a given page happens to be about.
 * Powers the site-wide Person/WebSite JSON-LD graph in app/[lang]/layout.tsx
 * — see lib/seo/build-json-ld.ts's buildSiteJsonLdGraph.
 */
export const SITE_AUTHOR_QUERY = defineQuery(`*[_type == "person" && slug.current == $authorSlug][0]{
    name,
    headline,
    bio_short,
    channels[],
    avatar{
      asset->{
        url,
        metadata{ dimensions }
      },
      alt
    },
    logoImage{
      asset->{
        url,
        metadata{ dimensions }
      },
      alt
    },
    structuredData{
      schemaType,
      personJobTitle,
      personDescription,
      personSameAs,
      personAlumniOf,
      personWorksFor,
      websiteName,
      websiteUrl,
      pageName,
      pageUrl,
      pageBreadcrumb[]{ name, url },
      workName,
      workDescription,
      workUrl,
      workDateCreated,
      customJsonLd
    },
    websiteSchema{
      schemaType,
      personJobTitle,
      personDescription,
      personSameAs,
      personAlumniOf,
      personWorksFor,
      websiteName,
      websiteUrl,
      pageName,
      pageUrl,
      pageBreadcrumb[]{ name, url },
      workName,
      workDescription,
      workUrl,
      workDateCreated,
      customJsonLd
    }
  }
`)

export const FEEDBACK_SECTION_QUERY = defineQuery(`*[_type == "feedbackSection"][0]{
  badgeLabel,
  eyebrow,
  title,
  description,
  submitLabel,
  submitIcon,
  contactPerson->{
    _id,
    name,
    avatar {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt
    }
  },
  fields[]{
    name,
    step,
    label,
    placeholder,
    fieldType,
    required,
    colSpan
  }
}`);