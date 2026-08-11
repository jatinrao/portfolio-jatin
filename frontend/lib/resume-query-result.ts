// import "server-only";
import type { RESUME_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
 import type { Skill } from "@/sanity.types";
// Single skill = one element of the generated query-result array. No hand
// authored shape here — this stays in sync automatically whenever the
// schema or the SKILLS_QUERY projection changes and typegen is re-run.

 
// Pull the literal union straight off the generated field instead of
// retyping the schema's `options.list` values by hand, and drop the `null`
// since it only matters at the query-result level, not in the display maps.
export type SkillCategory = NonNullable<Skill['category']>;
 
export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  'technical' : 'Technical',
  'framework' : 'Framework',
  'design' : 'Design',
  'language' : 'Language',
  'cloud-devops' : 'Cloud & DevOps',
  'database' : 'Database',
  'library': 'Library',
  'tool': 'Tool',
  'platform': 'Platform',
  'soft-skill' : 'Soft Skill',
  'other' : 'Other'
};
 
// Rotates through the three accent colors already used across the page
// (gold, forest green, indigo) so the grid keeps its "organic" variety.
export const CATEGORY_ACCENTS: Record<SkillCategory, string> = {
  technical: '#c9a84c',
  design: '#4d5a98',
  'soft-skill': '#3b684a',
  language: '#4d5a98',
  tool: '#3b684a',
  framework: '#c9a84c',
  'cloud-devops': '#c9a84c',
  database: '#7e7665',
  platform: '#7e7665',
  library: '#4d5a98',
  other: '#7e7665',
};

/**
 * Sanity Typegen generates one result type per named query constant —
 * `RESUME_BY_SLUG_QUERY` in lib/sanity/queries.ts produces
 * `RESUME_BY_SLUG_QUERYResult` here after running:
 *
 *   npx sanity typegen generate
 *
 * (see sanity-typegen.json for the schema/query glob config). This file
 * is the ONLY place that imports from the generated `sanity.types.ts` —
 * if Typegen's naming convention or output path ever changes, this is
 * the one line to fix; `mapper.ts` and `repository.ts` just import
 * `ResumeQueryResult` from here.
 *
 * `NonNullable` because the query's `[0]` projection types the result as
 * `... | null` (no matching document); the repository is what turns that
 * `null` into `ResumeRepository.findBySlug`'s return type — this alias
 * describes the shape once a document IS found.
 */
export type ResumeQueryResult = NonNullable<RESUME_BY_SLUG_QUERY_RESULT>;
