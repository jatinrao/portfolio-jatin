import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

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

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
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
  "projects": *[_type == "project" ]{
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