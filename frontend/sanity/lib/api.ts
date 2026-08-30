/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
)

/**
 * see https://www.sanity.io/docs/api-versioning for how versioning works
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25'

/**
 * Used to configure edit intent links, for Presentation Mode, as well as to configure where the Studio is mounted in the router.
 */
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'

/**
 * Cloudflare Pages serves a static export built once at `next build` time
 * (see next.config.ts's isCloudflareBuild / scripts/extract-static-for-cloudflare.ts)
 * with no server to ever regenerate it from fresh, non-stega content. Stega
 * baked into that export would ship to every visitor permanently, not just
 * editors — so this is a hard `false` regardless of NODE_ENV or the env
 * override below, even if NEXT_PUBLIC_SANITY_STEGA_ENABLED is set globally
 * across both deploy targets.
 */
const isCloudflareBuild = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'cloudflare'

/**
 * Stega-encodes query results with hidden Sanity metadata so the
 * Presentation Tool's overlay can click-to-select content. Defaults to on
 * in development and off in production; set NEXT_PUBLIC_SANITY_STEGA_ENABLED
 * explicitly ("true"/"false") to override either default — e.g. Vercel sets
 * it to "true" in production so the Presentation Tool's live preview (which
 * points at the deployed Vercel URL, not localhost) still gets click-to-edit.
 * Never enabled for the Cloudflare static export regardless of this env var.
 */
export const stegaEnabled =
  !isCloudflareBuild &&
  (process.env.NEXT_PUBLIC_SANITY_STEGA_ENABLED === undefined
    ? process.env.NODE_ENV !== 'production'
    : process.env.NEXT_PUBLIC_SANITY_STEGA_ENABLED === 'true')
