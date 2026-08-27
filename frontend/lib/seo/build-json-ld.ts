import type { LangId, LocaleBlockContent } from '@/lib/locale'
import { blocksToPlainText, localize, localizeBlocks } from '@/lib/locale'

/** Shape returned by sanity/lib/queries.ts SITE_AUTHOR_QUERY's `structuredData`/`websiteSchema` selections. */
export interface WebSchemaData {
  schemaType?: 'Person' | 'WebSite' | 'WebPage' | 'CreativeWork' | 'Organization' | null
  personJobTitle?: string | null
  personDescription?: Record<string, string> | null
  personSameAs?: string[] | null
  personAlumniOf?: string | null
  personWorksFor?: string | null
  websiteName?: Record<string, string> | null
  websiteUrl?: string | null
  pageName?: Record<string, string> | null
  pageUrl?: string | null
  pageBreadcrumb?: ({name?: string | null; url?: string | null} | null)[] | null
  workName?: Record<string, string> | null
  workDescription?: Record<string, string> | null
  workUrl?: string | null
  workDateCreated?: string | null
  customJsonLd?: string | null
}

/** Fields from the `person` document used as fallbacks when a structuredData field is empty. */
export interface PersonDefaults {
  name?: Record<string, string> | null
  headline?: Record<string, string> | null
  bio_short?: LocaleBlockContent | null
  avatar?: {asset?: {url?: string | null} | null} | null
  channels?: ({url?: string | null} | null)[] | null
}

/**
 * Builds a single schema.org JSON-LD object from the CMS's `webSchema` helper
 * fields, falling back to the owning `person` document's identity fields where
 * a structured-data field was left empty. `customJsonLd` (if present and valid
 * JSON) is shallow-merged on top and wins over everything generated here —
 * matches the "escape hatch" contract documented in
 * studio/src/schemaTypes/objects/webSchema.ts.
 *
 * Exception: if `customJsonLd` itself has a top-level `@graph` array, it's
 * returned as-is instead of being merged. A `@graph` means the author is
 * hand-authoring multiple related nodes (e.g. WebSite + WebPage) themselves —
 * merging our single-node scaffold into that would corrupt it (the generated
 * node's fields would survive as stray properties alongside the `@graph`,
 * since nothing in a `{@context, @graph}` payload overrides them).
 */
export function buildJsonLd(
  webSchema: WebSchemaData | null | undefined,
  person: PersonDefaults | null | undefined,
  {lang, pageUrl}: {lang: LangId; pageUrl: string},
): Record<string, unknown> | null {
  if (!webSchema?.schemaType) return null

  let generated: Record<string, unknown>

  switch (webSchema.schemaType) {
    case 'Person': {
      const name = localize(person?.name, lang)
      generated = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: name || undefined,
        jobTitle: webSchema.personJobTitle || localize(person?.headline, lang) || undefined,
        description:
          localize(webSchema.personDescription, lang) ||
          blocksToPlainText(localizeBlocks(person?.bio_short, lang)) ||
          undefined,
        image: person?.avatar?.asset?.url || undefined,
        url: pageUrl,
        sameAs:
          webSchema.personSameAs?.length
            ? webSchema.personSameAs
            : person?.channels?.map((c) => c?.url).filter((u): u is string => !!u) || undefined,
        alumniOf: webSchema.personAlumniOf || undefined,
        worksFor: webSchema.personWorksFor ? {'@type': 'Organization', name: webSchema.personWorksFor} : undefined,
      }
      break
    }
    case 'WebSite': {
      generated = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: localize(webSchema.websiteName, lang) || localize(person?.name, lang) || undefined,
        url: webSchema.websiteUrl || pageUrl,
      }
      break
    }
    case 'WebPage': {
      generated = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: localize(webSchema.pageName, lang) || undefined,
        url: webSchema.pageUrl || pageUrl,
        breadcrumb: webSchema.pageBreadcrumb?.length
          ? {
              '@type': 'BreadcrumbList',
              itemListElement: webSchema.pageBreadcrumb.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item?.name,
                item: item?.url,
              })),
            }
          : undefined,
      }
      break
    }
    case 'CreativeWork': {
      generated = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: localize(webSchema.workName, lang) || undefined,
        description: localize(webSchema.workDescription, lang) || undefined,
        url: webSchema.workUrl || pageUrl,
        dateCreated: webSchema.workDateCreated || undefined,
      }
      break
    }
    case 'Organization': {
      generated = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: webSchema.personWorksFor || localize(person?.name, lang) || undefined,
        url: pageUrl,
      }
      break
    }
    default:
      return null
  }

  // Drop undefined keys so the emitted JSON-LD stays clean.
  generated = Object.fromEntries(Object.entries(generated).filter(([, v]) => v !== undefined))

  if (webSchema.customJsonLd) {
    try {
      const custom = JSON.parse(webSchema.customJsonLd)
      if (Array.isArray(custom?.['@graph'])) return custom
      return {...generated, ...custom}
    } catch {
      // Studio-side validation already guards against invalid JSON; if it
      // somehow slips through, prefer the generated object over a crash.
      return generated
    }
  }

  return generated
}

/**
 * Flattens a buildJsonLd() result into one or more top-level graph nodes.
 * A plain node becomes a single `{@id, ...}` entry (falling back to
 * `fallbackId` when it has none of its own). A `{@context, @graph}` override
 * (see buildJsonLd's customJsonLd exception above) is spread directly into
 * the graph instead of being nested as a property of some other node.
 */
function toGraphNodes(
  ld: Record<string, unknown> | null,
  fallbackId: string,
): Record<string, unknown>[] {
  if (!ld) return []
  if (Array.isArray(ld['@graph'])) return ld['@graph'] as Record<string, unknown>[]

  const node = Object.fromEntries(Object.entries(ld).filter(([key]) => key !== '@context'))
  return [{'@id': (node['@id'] as string | undefined) ?? fallbackId, ...node}]
}

/**
 * Builds the site-wide Person + WebSite JSON-LD graph, explicitly linked via
 * `@id` (WebSite.author -> Person) instead of two unrelated `<script>` blocks.
 * Both objects are always sourced from SITE_AUTHOR_QUERY's canonical author —
 * never from "whichever person this page happens to be about" — so the graph
 * stays fixed even once other `person` documents exist for other pages.
 */
export function buildSiteJsonLdGraph(
  personSchema: WebSchemaData | null | undefined,
  websiteSchema: WebSchemaData | null | undefined,
  author: PersonDefaults | null | undefined,
  {lang, siteUrl}: {lang: LangId; siteUrl: string},
): Record<string, unknown> | null {
  const personId = `${siteUrl}/#person`
  const websiteId = `${siteUrl}/#website`

  const personLd = buildJsonLd(personSchema, author, {lang, pageUrl: siteUrl})
  const websiteLd = buildJsonLd(websiteSchema, author, {lang, pageUrl: siteUrl})

  if (!personLd && !websiteLd) return null

  const personNodes = toGraphNodes(personLd, personId)
  const websiteNodes = toGraphNodes(websiteLd, websiteId)

  // Only auto-link WebSite -> Person for a plain generated/merged node (one
  // node, not itself a `@graph` override) — a hand-authored graph override
  // is trusted to declare its own relationships (e.g. WebPage.about -> Person).
  const websiteIsOverride = !!websiteLd && Array.isArray(websiteLd['@graph'])
  if (!websiteIsOverride && websiteNodes.length && personNodes.length && !('author' in websiteNodes[0])) {
    websiteNodes[0] = {...websiteNodes[0], author: {'@id': personId}}
  }

  return {'@context': 'https://schema.org', '@graph': [...personNodes, ...websiteNodes]}
}
