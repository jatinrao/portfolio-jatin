/**
 * One-off migration: populate `person.featureHighlights` / `featureIntro` /
 * `featureLinkUrl` / `featureLinkLabel` — the fields backing the
 * feature-highlight row under the hero (Lighthouse score / CMS coverage /
 * Languages supported / Packages published) — from the values that were
 * previously hardcoded in frontend/components/molecules/HeroFeatureGroup.tsx.
 *
 * featureHighlights[].iconName references the @web-portfolio/icons registry
 * (same picker as Skill's "Icon (picker)" field) rather than an uploaded
 * image — the 4 names below (bolt/translate/checklist/gift) were added to
 * that package's registry specifically for this migration, replacing the
 * Apple SF Symbol PNGs that were never safe to redistribute in an openly
 * published icon package. Only touches the person document whose slug
 * matches PERSON_SLUG below, and only if that document has no
 * featureHighlights set yet (idempotent — safe to re-run).
 *
 * Usage (from studio/):
 *   npx sanity exec scripts/migrate-feature-highlights.ts --with-user-token
 *
 * Dry-run by default — logs the planned change without writing anything.
 * Pass --apply to actually patch the dataset:
 *   npx sanity exec scripts/migrate-feature-highlights.ts --with-user-token -- --apply
 */

import { getCliClient } from 'sanity/cli'

const PERSON_SLUG = 'jatin-kumar'

const FEATURES = [
  { iconName: 'bolt', kicker: '100', label: 'Lighthouse score' },
  { iconName: 'checklist', kicker: '100%', label: 'CMS coverage' },
  { iconName: 'translate', kicker: '6', label: 'Languages supported' },
  { iconName: 'gift', kicker: '3', label: 'Packages published' },
]

const FEATURE_INTRO =
  'An open Next.js and Sanity workspace for this site — live visual editing, six locales including RTL, scroll rooms, and a resume-to-PDF pipeline. One CMS, one deploy, every page in sync.'

const FEATURE_LINK_URL = 'https://github.com/jatinrao/portfolio-jatin'
const FEATURE_LINK_LABEL = 'Learn more'

const apply = process.argv.includes('--apply')

async function main() {
  const client = getCliClient({ apiVersion: '2024-01-01' })

  const person: { _id: string; featureHighlights?: unknown[] } | null = await client.fetch(
    `*[_type == "person" && slug.current == $slug][0]{ _id, featureHighlights }`,
    { slug: PERSON_SLUG },
  )

  if (!person) {
    console.error(`\nNo person document found with slug "${PERSON_SLUG}" — nothing to do.\n`)
    process.exit(1)
  }

  if (person.featureHighlights && person.featureHighlights.length > 0) {
    console.log(
      `\nperson "${PERSON_SLUG}" already has ${person.featureHighlights.length} featureHighlights — skipping (idempotent, nothing to patch).\n`,
    )
    return
  }

  const featureHighlights = FEATURES.map((feature) => ({
    _type: 'featureHighlight',
    _key: feature.iconName,
    iconName: feature.iconName,
    kicker: feature.kicker,
    label: { en: feature.label },
  }))

  console.log(`\nWould set on person "${PERSON_SLUG}" (${person._id}):`)
  console.log(`  featureHighlights: ${FEATURES.length} tiles`)
  for (const f of FEATURES) console.log(`    - ${f.iconName} · ${f.kicker} · ${f.label}`)
  console.log(`  featureIntro: "${FEATURE_INTRO.slice(0, 60)}..."`)
  console.log(`  featureLinkUrl: ${FEATURE_LINK_URL}`)
  console.log(`  featureLinkLabel: ${FEATURE_LINK_LABEL}`)

  if (!apply) {
    console.log('\nDry run only — nothing was written. Re-run with `-- --apply` to commit these changes.\n')
    return
  }

  await client
    .patch(person._id)
    .set({
      featureHighlights,
      featureIntro: { en: FEATURE_INTRO },
      featureLinkUrl: FEATURE_LINK_URL,
      featureLinkLabel: { en: FEATURE_LINK_LABEL },
    })
    .commit()

  console.log(`\nDone — patched person "${PERSON_SLUG}" with ${featureHighlights.length} feature highlights.\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
