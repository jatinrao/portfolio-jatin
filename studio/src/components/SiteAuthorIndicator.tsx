import { useFormValue } from 'sanity'
import { Checkbox, Flex, Text } from '@sanity/ui'

const AUTHOR_SLUG = process.env.SANITY_STUDIO_SITE_AUTHOR_SLUG

/**
 * Read-only indicator, not a real stored field. Never calls onChange, so
 * nothing is ever written to the document — it only reflects whether this
 * document's slug matches SANITY_STUDIO_SITE_AUTHOR_SLUG, the single source
 * of truth for which person is the site's canonical author (see
 * frontend/sanity/lib/queries.ts SITE_AUTHOR_QUERY).
 */
export function SiteAuthorIndicator() {
  const slug = useFormValue(['slug', 'current']) as string | undefined
  const isAuthor = !!AUTHOR_SLUG && slug === AUTHOR_SLUG

  return (
    <Flex align="center" gap={3}>
      <Checkbox checked={isAuthor} readOnly disabled />
      <Text size={1} muted>
        {AUTHOR_SLUG
          ? isAuthor
            ? `Matches SANITY_STUDIO_SITE_AUTHOR_SLUG ("${AUTHOR_SLUG}") — this is the site author.`
            : `Does not match SANITY_STUDIO_SITE_AUTHOR_SLUG ("${AUTHOR_SLUG}").`
          : 'SANITY_STUDIO_SITE_AUTHOR_SLUG is not set.'}
      </Text>
    </Flex>
  )
}
