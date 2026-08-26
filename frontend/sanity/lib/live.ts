import {defineLive} from 'next-sanity/live'
import {client} from '@/sanity/lib/client'
import {token} from '@/sanity/lib/token'
import {stegaEnabled} from '@/sanity/lib/api'

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */

const {sanityFetch: baseSanityFetch, SanityLive} = defineLive({
  client,
  // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
  serverToken: token,
  // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
  browserToken: token,
})

/**
 * `defineLive`'s own client always forces `stega: false` internally and
 * only ever honors a `stega` key passed per-call — it has no client-level
 * config of its own. This wrapper makes NEXT_PUBLIC_SANITY_STEGA_ENABLED
 * (see sanity/lib/api.ts) the default for every call site, while callers
 * that must never carry stega (SEO metadata, resume/PDF text) can still
 * pass `stega: false` explicitly to override it.
 */
export const sanityFetch: typeof baseSanityFetch = (options) =>
  baseSanityFetch({stega: stegaEnabled, ...options})

export {SanityLive}
