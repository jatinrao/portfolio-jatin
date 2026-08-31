/**
 * One-off seed: creates the first `blog` document — "Mount the Frame, Not
 * the Picture" — from the shipping-notes writeup about @web-portfolio/icons
 * and @web-portfolio/icons-sanity. Content only; the artifact's own visual
 * skin (Fraunces serif, olive palette, numbered `.tab` section badges) was
 * a one-off mockup styling and is intentionally not carried over — the
 * front end renders this through BlogDetail's Apple-Newsroom-style
 * template instead.
 *
 * NOTE: `coverImage` is left unset — this script has no image asset to
 * upload for the hero. Add one in Studio before publishing; the schema
 * marks it required for editors, but a raw create() mutation isn't
 * validation-blocked, so the draft is still created without it.
 *
 * Usage (from studio/):
 *   npx sanity exec scripts/seed-blog-mount-the-frame.ts --with-user-token
 *
 * Dry-run by default — logs the planned document without writing anything.
 * Pass --apply to actually create it:
 *   npx sanity exec scripts/seed-blog-mount-the-frame.ts --with-user-token -- --apply
 */

import { getCliClient } from 'sanity/cli'

const SLUG = 'mount-the-frame-not-the-picture'
const apply = process.argv.includes('--apply')

const block = (key: string, text: string, style: 'normal' | 'blockquote' | 'h3' = 'normal') => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
})

// blogBlockContent's richTextBlock only offers Normal/H3/H4/Quote styles
// (see studio/src/schemaTypes/objects/localeBlockContent.ts) — section
// headings use 'h3', which BlogDetail renders as a visually prominent <h2>.
const heading = (key: string, text: string) => block(key, text, 'h3')

const body = [
  block(
    'origin-lede',
    "This started as a question, not a plan: should an icon be content, or code? A portfolio's skill list and contact links change more often than its components do — a new job means a new employer logo, a new blog means a new link — so treating icons as something Sanity could hold, editable without a redeploy, felt like the obvious call. It wasn't obvious for long.",
  ),

  heading('origin-h1', "Where 'icon as content' actually led"),
  block(
    'origin-p1',
    "The first version stored an icon as raw SVG markup in a plain text field, because that's the obvious shape for \"icon as content\": an editor pastes what they have, the frontend renders it. That's also where it stopped being obvious.",
  ),
  block(
    'origin-p2',
    'Every pasted icon came from somewhere different — one export with a clean two-color path, another with a hardcoded fill and a nested <g> full of inline styles no editor could see or remove. Some had a 24×24 viewBox, some 512×512, some none at all. There was no one shape to build a component around.',
  ),
  block(
    'origin-p3',
    "So the component tried to force one — a size, a color, a stroke — and that's the part that made uniformity worse, not better. currentColor only works if the source markup doesn't already hardcode its own fill. A stroke-width override only reaches paths that don't already set their own. Every newly pasted icon needed its own case, which defeats the point of a content field that's supposed to need no code changes at all.",
  ),
  block(
    'origin-pull1',
    "A content field that needs a code change every time someone uses it isn't really a content field.",
    'blockquote',
  ),
  block(
    'origin-p4',
    'Underneath all of it was the actually dangerous part: that field was rendered with dangerouslySetInnerHTML. A text box any editor can type or paste into, injected straight into the DOM as markup, is an XSS vector with a content editor\'s name on it, not an attacker\'s. Mitigating all three — normalizing arbitrary SVG, sanitizing untrusted markup, and still trying to hold a consistent look — kept adding code without touching the actual problem: the field\'s value was still just whatever got pasted into it.',
  ),

  heading('code-h1', "The code-only fixes don't solve it either"),
  block(
    'code-p1',
    'Falling back to how everyone else handles icons in code doesn\'t get the content question back, though. Icon fonts glue frame and picture into a class name — <i class="fa fa-docker"> — and a typo just renders blank. Sprite sheets glue the same way, through an id instead. Inline SVG components glue hardest: the picture is baked into the import graph, so there\'s no registry, and no field, at all. Third-party libraries like lucide-react get the developer experience right, but import { Docker } is still a code change, just a nicer one.',
  ),
  block(
    'code-pull1',
    'Each is a perfectly reasonable way to write an icon in code. None of them let which picture shows up change without touching code — which was the entire point.',
    'blockquote',
  ),

  heading('h2', 'Mount it: a frame that just wants a picture'),
  block(
    'p2',
    "@web-portfolio/icons unglues that. <Icon> is a frame — its name prop takes a picture from a registry packages/core builds by reconciling devicon, Material Symbols, and Simple Icons through SVGO. <Icon> can't tell a literal from a variable, so the same call works either way:",
  ),
  {
    _type: 'codeSnippet',
    _key: 'snippet1',
    label: 'packages/react — usage',
    language: 'tsx',
    code: [
      "import { Icon } from '@web-portfolio/icons'",
      '',
      '<Icon name="docker" size={32} />          // a literal picture',
      '<Icon name={skill.icon} size={32} />       // a picture from a CMS field',
    ].join('\n'),
  },
  block(
    'p3',
    "That's the opening @web-portfolio/icons-sanity needed: a picture is just a string, so it can come from an editor picking it instead of a developer typing it. Its iconRef schema type turns a field into a searchable grid in Sanity Studio — IconPickerInput only ever writes back a picture it found in the same registry <Icon> reads. A developer's job was never to choose the picture — just to mount the frame.",
  ),
  block(
    'p4',
    "Worth pricing out, too: since both packages bundle the same registry, the only thing that crosses the wire from Sanity to the frontend is that string — ~7 bytes on average, against ~955 bytes for the median icon's actual markup (up to several KB for a complex logo). Storing raw SVG in a CMS field instead — the workaround this plugin exists to avoid — costs 130–285× more per icon, on every fetch. Icon fonts and sprite sheets dodge that too, by referencing a name; inline SVG components and import-based libraries can't, not without first building the exact registry this package already is.",
  ),
  block(
    'p5',
    'That same swap fixes a common pain point: shipping an icon before design approves one. Hang the closest picture today — name="link" — and change just that value once the real mark ships, no re-import, no new component. Route it through a CMS field instead and whoever owns the moment — design, marketing, whoever\'s running this week\'s campaign — swaps the picture themselves, in Studio, no PR at all.',
  ),
  block(
    'pull2',
    'The placeholder ships in the same commit as the feature. Only the picture changes later.',
    'blockquote',
  ),

  heading('h3', 'Where it actually wins'),
  block(
    'p6',
    "Graded against the same four approaches, split into three questions: what's it like to write, what does it cost at runtime, and what happens when the icon needs to change and the person changing it isn't a developer.",
  ),
  {
    _type: 'comparisonTable',
    _key: 'table1',
    columns: [
      { _type: 'tableColumn', _key: 'col-font', name: 'Icon font', descriptor: 'Font Awesome — a class name picks a glyph', highlight: false },
      { _type: 'tableColumn', _key: 'col-sprite', name: 'SVG sprite sheet', descriptor: 'One <symbol> sheet, referenced by id', highlight: false },
      { _type: 'tableColumn', _key: 'col-inline', name: 'Inline SVG components', descriptor: 'Each icon hand-copied into its own file', highlight: false },
      { _type: 'tableColumn', _key: 'col-lib', name: 'Third-party library', descriptor: 'lucide-react — import each icon by name', highlight: false },
      { _type: 'tableColumn', _key: 'col-ours', name: '@web-portfolio/icons', descriptor: '<Icon name> against the bundled registry', highlight: true },
      { _type: 'tableColumn', _key: 'col-ours-plus', name: 'icons + icons-sanity', descriptor: 'Same registry, editable from Studio', highlight: true },
    ],
    rows: [
      { _type: 'tableGroupRow', _key: 'grp-writing', label: 'Writing it' },
      {
        _type: 'tableDataRow', _key: 'row-add-code', label: 'Adding an icon in code',
        cells: [
          { _type: 'tableCell', _key: 'c1', icon: 'remove', note: 'fa-docker — nothing checks the glyph exists' },
          { _type: 'tableCell', _key: 'c2', icon: 'remove', note: '#docker — same blind-typing risk' },
          { _type: 'tableCell', _key: 'c3', icon: 'close', note: 'A new component file per icon, copy-pasted' },
          { _type: 'tableCell', _key: 'c4', icon: 'check', note: 'import { Docker } — editor autocompletes' },
          { _type: 'tableCell', _key: 'c5', icon: 'check', note: '<Icon name="docker"/> — one prop' },
          { _type: 'tableCell', _key: 'c6', icon: 'check', note: 'Same call — the string can come from a field' },
        ],
      },
      {
        _type: 'tableDataRow', _key: 'row-type-safety', label: 'Type safety / autocomplete',
        cells: [
          { _type: 'tableCell', _key: 'c7', icon: 'close', note: 'A class name string — nothing checks it exists' },
          { _type: 'tableCell', _key: 'c8', icon: 'close', note: 'An id string — same problem' },
          { _type: 'tableCell', _key: 'c9', icon: 'check', note: 'Each icon is its own named import' },
          { _type: 'tableCell', _key: 'c10', icon: 'check', note: 'Named exports — a typo fails the build' },
          { _type: 'tableCell', _key: 'c11', icon: 'close', note: 'name is a plain string — a typo only warns' },
          { _type: 'tableCell', _key: 'c12', icon: 'remove', note: 'Picker only writes real keys — a Studio guarantee, not a type one' },
        ],
      },
      {
        _type: 'tableDataRow', _key: 'row-styling', label: 'Styling — color, stroke, size',
        cells: [
          { _type: 'tableCell', _key: 'c13', icon: 'remove', note: 'Color inherits, but weight is baked into the glyph' },
          { _type: 'tableCell', _key: 'c14', icon: 'check', note: 'fill: currentColor works cleanly' },
          { _type: 'tableCell', _key: 'c15', icon: 'remove', note: 'Only as consistent as whoever pasted it' },
          { _type: 'tableCell', _key: 'c16', icon: 'check', note: 'Typed size/color/strokeWidth props' },
          { _type: 'tableCell', _key: 'c17', icon: 'check', note: 'size/color/stroke props on <Icon>' },
          { _type: 'tableCell', _key: 'c18', icon: 'check', note: 'Same props, same component' },
        ],
      },
      { _type: 'tableGroupRow', _key: 'grp-running', label: 'Running it' },
      {
        _type: 'tableDataRow', _key: 'row-bundle', label: 'Bundle impact',
        cells: [
          { _type: 'tableCell', _key: 'c19', icon: 'close', note: 'Whole font file loads either way' },
          { _type: 'tableCell', _key: 'c20', icon: 'remove', note: 'Ships every icon in one sheet' },
          { _type: 'tableCell', _key: 'c21', icon: 'check', note: 'Only imported icons ship' },
          { _type: 'tableCell', _key: 'c22', icon: 'check', note: 'Tree-shaken per icon' },
          { _type: 'tableCell', _key: 'c23', icon: 'close', note: 'One registry — pulls in all 633 icons' },
          // "close" (cross) overstated this — the cost only applies client-side;
          // a server component never ships the registry to the browser at all.
          { _type: 'tableCell', _key: 'c24', icon: 'remove', note: 'Same cost as icons alone' },
        ],
      },
      {
        _type: 'tableDataRow', _key: 'row-wiring', label: 'Runtime selection',
        cells: [
          { _type: 'tableCell', _key: 'c25', icon: 'check', note: 'Already string-keyed' },
          { _type: 'tableCell', _key: 'c26', icon: 'check', note: 'Already id-keyed' },
          { _type: 'tableCell', _key: 'c27', icon: 'close', note: 'Needs a manual name map' },
          { _type: 'tableCell', _key: 'c28', icon: 'close', note: 'Same — build the map yourself' },
          { _type: 'tableCell', _key: 'c29', icon: 'check', note: 'No wiring needed' },
          { _type: 'tableCell', _key: 'c30', icon: 'check', note: 'Same, via the picker' },
        ],
      },
      { _type: 'tableGroupRow', _key: 'grp-living', label: 'Living with it' },
      {
        _type: 'tableDataRow', _key: 'row-dynamic', label: 'Selecting from dynamic data',
        cells: [
          { _type: 'tableCell', _key: 'c31', icon: 'remove', note: "A string — nothing renders a picker for it" },
          { _type: 'tableCell', _key: 'c32', icon: 'remove', note: 'Same — an id string with no picker' },
          { _type: 'tableCell', _key: 'c33', icon: 'close', note: 'The icon is a specific import, not a swappable value' },
          { _type: 'tableCell', _key: 'c34', icon: 'close', note: 'Same — each icon is a component, not a lookup key' },
          { _type: 'tableCell', _key: 'c35', icon: 'remove', note: "name can come from anywhere — nothing helps you set it right" },
          { _type: 'tableCell', _key: 'c36', icon: 'check', note: 'Lives in Sanity content, updates without a redeploy' },
        ],
      },
      {
        _type: 'tableDataRow', _key: 'row-non-dev', label: 'Non-developer control',
        cells: [
          { _type: 'tableCell', _key: 'c37', icon: 'close', note: 'Needs a hand-built picker that knows glyph names' },
          { _type: 'tableCell', _key: 'c38', icon: 'close', note: 'Same — someone still has to build that picker' },
          { _type: 'tableCell', _key: 'c39', icon: 'close', note: 'Changing the icon means changing code' },
          { _type: 'tableCell', _key: 'c40', icon: 'close', note: "Same — it's a code-level import" },
          { _type: 'tableCell', _key: 'c41', icon: 'close', note: 'No editing surface — still a developer changing a prop' },
          { _type: 'tableCell', _key: 'c42', icon: 'check', note: 'IconPickerInput ships that picker already built' },
        ],
      },
      {
        _type: 'tableDataRow', _key: 'row-new-icon', label: 'Adding a brand-new icon',
        cells: [
          { _type: 'tableCell', _key: 'c43', icon: 'close', note: 'Regenerate the font file, rebuild, redeploy' },
          { _type: 'tableCell', _key: 'c44', icon: 'remove', note: 'Edit the sprite file, redeploy' },
          { _type: 'tableCell', _key: 'c45', icon: 'check', note: 'Paste the SVG, done — no shared file to touch' },
          { _type: 'tableCell', _key: 'c46', icon: 'close', note: 'You get whatever the library ships, nothing else' },
          { _type: 'tableCell', _key: 'c47', icon: 'remove', note: 'Seed the source, run generate-registry, republish' },
          { _type: 'tableCell', _key: 'c48', icon: 'remove', note: "Same constraint — an admin's raw-SVG paste is the escape hatch" },
        ],
      },
      {
        _type: 'tableDataRow', _key: 'row-consistency', label: 'Consistency across sources',
        cells: [
          { _type: 'tableCell', _key: 'c49', icon: 'check', note: 'One family, one visual language, by construction' },
          { _type: 'tableCell', _key: 'c50', icon: 'remove', note: 'Only as consistent as what went into the sheet' },
          { _type: 'tableCell', _key: 'c51', icon: 'close', note: 'No shared discipline unless someone enforces it' },
          { _type: 'tableCell', _key: 'c52', icon: 'remove', note: "Consistent internally, but brand logos usually aren't in it" },
          { _type: 'tableCell', _key: 'c53', icon: 'check', note: 'devicon, Material Symbols, Simple Icons reconciled into one registry' },
          { _type: 'tableCell', _key: 'c54', icon: 'check', note: "Same registry — Studio also flags a value that's since gone stale" },
        ],
      },
      {
        _type: 'tableDataRow', _key: 'row-license', label: 'License & provenance',
        cells: [
          { _type: 'tableCell', _key: 'c55', icon: 'remove', note: "Whatever the font package's license says, rarely per glyph" },
          { _type: 'tableCell', _key: 'c56', icon: 'close', note: 'Usually untracked once icons are copied into one file' },
          { _type: 'tableCell', _key: 'c57', icon: 'close', note: 'Untracked — attribution lives with whoever pasted it, if anyone' },
          { _type: 'tableCell', _key: 'c58', icon: 'check', note: 'One license for the whole package, typically clear' },
          { _type: 'tableCell', _key: 'c59', icon: 'check', note: 'Attributed once per source, in the registry and README' },
          { _type: 'tableCell', _key: 'c60', icon: 'check', note: 'Same attribution, inherited unchanged' },
        ],
      },
    ],
  },

  heading('h4', 'The trade-off, no sugar-coating it'),
  block(
    'p7',
    'Two rows above are real losses. registry.generated.ts is one object, not 633 separate exports — why one <Icon> pulls in every entry regardless, and why an import-based library only dodges that cost by giving up runtime selection. The footnote above has the fix, scoped to that one row; hydrate <Icon> instead, and a tree-shaken library wins on size every time. Rendered server-side, though, it\'s not just "no worse" — it ties inline SVG and a tree-shaken import (same zero-JS markup) and beats the other two outright: a font still needs its own file fetch, and a sprite sheet either inlines every symbol or costs a request of its own.',
  ),
  block(
    'p8',
    'Type safety splits the same way: typed by hand, name is a string a typo won\'t catch. Through icons-sanity, IconPickerInput only writes back a real key — a Studio guarantee, not a schema one, which is why it\'s a trade-off, not a win.',
  ),

  heading('h5', 'When you should actually reach for this'),
  block(
    'p9',
    'This fits a CMS-backed project — portfolio, agency site, marketing page — where "which icon" is a content call, not an engineering one. If nothing\'s ever edited outside the codebase, just take the tree-shaken library: the picture was always going to stay the same, so there was no frame worth mounting in the first place.',
  ),
  block(
    'p10',
    "Get the frame precisely right once — squared, anchored, built for the wall it's actually going on — and swapping what hangs in it stops being a renovation. Pull the picture out, push a new one in; the frame never comes off the wall, no fresh holes, no risk of knocking it crooked and needing to patch and repaint just to try something else. That's what building the registry and the picker this deliberately buys: the frame — <Icon name>, the registry, IconPickerInput — never changes again. Only the name in it does.",
  ),
  block('pull3', 'Mount the frame, hand the picture over, get back to shipping.', 'blockquote'),
]

const doc = {
  _type: 'blog',
  title: { _type: 'localeString', en: 'Mount the Frame, Not the Picture' },
  slug: { _type: 'slug', current: SLUG },
  category: 'Shipping Notes',
  dek: {
    _type: 'localeText',
    en:
      'An icon needs a frame to hang in and a picture to hang there. @web-portfolio/icons and @web-portfolio/icons-sanity exist so a developer only ever mounts the frame — the picture can come from wherever that decision actually belongs.',
  },
  publishedDate: new Date().toISOString().slice(0, 10),
  isFeatured: true,
  stats: [
    { _type: 'stat', _key: 'stat-1', value: '633', label: 'bundled icons' },
    { _type: 'stat', _key: 'stat-2', value: '1', label: 'shared registry' },
    { _type: 'stat', _key: 'stat-3', value: '2', label: 'entry points' },
    { _type: 'stat', _key: 'stat-4', value: '0', label: 'runtime fetches' },
  ],
  body: { _type: 'blogBlockContent', en: body },
  footerLinks: [
    { _type: 'footerLink', _key: 'link-1', label: 'icons.getresume.dev', url: 'https://icons.getresume.dev' },
    { _type: 'footerLink', _key: 'link-2', label: 'npm / icons', url: 'https://www.npmjs.com/package/@web-portfolio/icons' },
    { _type: 'footerLink', _key: 'link-3', label: 'npm / icons-sanity', url: 'https://www.npmjs.com/package/@web-portfolio/icons-sanity' },
    { _type: 'footerLink', _key: 'link-4', label: 'github.com/jatinrao/icons', url: 'https://github.com/jatinrao/icons' },
  ],
}

async function main() {
  const client = getCliClient({ apiVersion: '2024-01-01' })

  const existing: { _id: string } | null = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{ _id }`,
    { slug: SLUG },
  )

  if (existing) {
    // Idempotent for creation, but the `body` field itself is still kept in
    // sync — this script is the source of truth for it, and a previous run
    // shipped a bug (heading() wasn't applying the 'h3' style, so every
    // section heading rendered as a plain paragraph). Only `body` is
    // patched; coverImage and any other manual Studio edits are untouched.
    console.log(`\nblog "${SLUG}" already exists (${existing._id}) — would patch body only.\n`)
    if (!apply) {
      console.log('Dry run only — nothing was written. Re-run with `-- --apply` to commit this patch.\n')
      return
    }
    await client.patch(existing._id).set({ body: doc.body }).commit()
    console.log(`Done — patched body on blog "${SLUG}" (${existing._id}).\n`)
    return
  }

  console.log(`\nWould create blog "${SLUG}":`)
  console.log(`  ${body.length} body blocks (paragraphs, a code snippet, a ${doc.body.en.filter((b: any) => b._type === 'comparisonTable').length ? '6x10 comparison table' : ''})`)
  console.log(`  ${doc.footerLinks.length} footer links`)
  console.log('  coverImage: NOT SET — add one in Studio before publishing')

  if (!apply) {
    console.log('\nDry run only — nothing was written. Re-run with `-- --apply` to commit these changes.\n')
    return
  }

  const created = await client.create(doc)
  console.log(`\nDone — created blog "${SLUG}" (${created._id}).\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
