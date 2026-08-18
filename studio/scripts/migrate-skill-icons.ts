/**
 * One-off migration: populate `skill.iconName` (the new @web-portfolio/icons-sanity
 * picker field) from the skill's `name`, for skills that map cleanly onto the
 * bundled 622-icon registry (devicon + Material Symbols + Simple Icons).
 *
 * Does NOT touch or remove the old `svg_icon`/`icon` fields — this is additive.
 * Skills already carrying an `iconName`, and skills with no confident mapping
 * below, are left untouched (see UNMATCHED_SKILL_NAMES logged at the end —
 * pick those manually in Studio's new icon picker).
 *
 * The name->icon mapping below was verified against the actual bundled
 * registry keys in @web-portfolio/icons' dist build (not guessed) — see the
 * migration PR/commit for how that list was extracted. If you add skills
 * later, check the full searchable icon list at https://github.com/jatinrao/icons
 * before adding a mapping here.
 *
 * Usage (from studio/):
 *   npx sanity exec scripts/migrate-skill-icons.ts --with-user-token
 *
 * Dry-run by default — logs every planned change without writing anything.
 * Pass --apply to actually patch the dataset:
 *   npx sanity exec scripts/migrate-skill-icons.ts --with-user-token -- --apply
 */

import { getCliClient } from 'sanity/cli'

// Matched against the real bundled registry (verified, not guessed).
// Key = the skill's English name in Sanity, lowercased, as a loose match.
const NAME_TO_ICON: Record<string, string> = {
  'scss': 'sass',
  'framer motion': 'framermotion',
  'three.js': 'threejs',
  'material ui': 'materialui',
  'arduino': 'arduino',
  'express.js': 'express',
  'sanity cms': 'sanity',
  'php': 'php',
  'aws': 'amazonwebservices',
  'node.js': 'nodejs',
  'reactjs': 'react',
  'redis': 'redis',
  'firebase': 'firebase',
  'git': 'git',
  'html 5': 'html5',
  'redux': 'redux',
  'springboot': 'spring',
  'next.js': 'nextjs',
  'figma': 'figma',
  'jest': 'jest',
  'mongodb': 'mongodb',
  'angularjs': 'angularjs',
  'jenkins': 'jenkins',
  'nginx': 'nginx',
  'eslint': 'eslint',
  'tailwind': 'tailwindcss',
  'docker': 'docker',
  'mobx': 'mobx',
  'deno': 'denojs',
  'storybook': 'storybook',
}

// No confident match in the 622-icon registry as of this writing — left for
// manual picking in Studio (some may not exist in the set at all; check the
// searchable list at the repo linked above before assuming).
const KNOWN_UNMATCHED = [
  'sql', 'google analytics', 'ollama', 'langchain', 'pydantic', 'mcp', 'google stitch',
  'connected tv', 'segment', 'statsig',
]

const apply = process.argv.includes('--apply')

async function main() {
  const client = getCliClient({ apiVersion: '2024-01-01' })

  const skills: { _id: string; name?: { en?: string }; iconName?: string }[] = await client.fetch(
    `*[_type == "skill"]{ _id, name, iconName }`
  )

  const toPatch: { _id: string; name: string; iconName: string }[] = []
  const alreadySet: string[] = []
  const unmatched: string[] = []

  for (const skill of skills) {
    const name = skill.name?.en ?? '(untitled)'
    if (skill.iconName) {
      alreadySet.push(name)
      continue
    }
    const key = name.trim().toLowerCase()
    const iconName = NAME_TO_ICON[key]
    if (iconName) {
      toPatch.push({ _id: skill._id, name, iconName })
    } else {
      unmatched.push(name)
    }
  }

  console.log(`\nFound ${skills.length} skill document(s).\n`)

  console.log(`Already has iconName (skipped): ${alreadySet.length}`)
  for (const n of alreadySet) console.log(`  - ${n}`)

  console.log(`\n${apply ? 'Patching' : 'Would patch'} ${toPatch.length} skill(s):`)
  for (const p of toPatch) console.log(`  - ${p.name} -> "${p.iconName}"`)

  console.log(`\nNo confident match — needs manual picking in Studio: ${unmatched.length}`)
  for (const n of unmatched) {
    const flagged = KNOWN_UNMATCHED.includes(n.trim().toLowerCase()) ? '' : ' (not in the known-unmatched list — new skill?)'
    console.log(`  - ${n}${flagged}`)
  }

  if (!apply) {
    console.log('\nDry run only — nothing was written. Re-run with `-- --apply` to commit these changes.\n')
    return
  }

  if (toPatch.length === 0) {
    console.log('\nNothing to patch.\n')
    return
  }

  let tx = client.transaction()
  for (const p of toPatch) {
    tx = tx.patch(p._id, (patch) => patch.set({ iconName: p.iconName }))
  }
  await tx.commit()
  console.log(`\nDone — patched ${toPatch.length} skill document(s).\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
