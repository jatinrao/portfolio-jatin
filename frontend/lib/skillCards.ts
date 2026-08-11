export interface SkillCardSize {
  /** --skill-card-width (base/mobile — stays square with baseHeight) */
  baseWidth: string;
  /** --skill-card-height (base/mobile) */
  baseHeight: string;
  /** --skill-card-width-md (md: and up — deliberately narrower than tall) */
  mdWidth: string;
  /** --skill-card-height-md (md: and up) */
  mdHeight: string;
}

/**
 * Tiers chosen so that as item count goes up, cards get smaller — more of
 * them fit per row, which keeps total row count (and therefore grid
 * height) in a similar band across filters instead of "ALL" ballooning the
 * section height and every other filter collapsing it.
 *
 * Mobile stays square (matches the original fixed h-28/w-28 at the medium
 * tier). Desktop is a deliberately non-square rectangle — the ratio here
 * (height ≈ 1.11× width) is taken directly from the hand-picked h-40/w-36
 * (10rem/9rem) values, scaled proportionally to every tier rather than
 * just the one count band those happened to be tuned for.
 */
const SIZE_TIERS: Array<{ maxCount: number; size: SkillCardSize }> = [
  {
    maxCount: 6,
    size: { baseWidth: '8.5rem', baseHeight: '8.5rem', mdWidth: '10.75rem', mdHeight: '12rem' },
  },
  {
    maxCount: 12,
    size: { baseWidth: '7.5rem', baseHeight: '7.5rem', mdWidth: '9.5rem', mdHeight: '10.5rem' },
  },
  {
    // Matches the current hand-picked default exactly: md 9rem × 10rem
    // (w-36 / h-40), base 7rem square (h-28/w-28).
    maxCount: 20,
    size: { baseWidth: '7rem', baseHeight: '7rem', mdWidth: '9rem', mdHeight: '10rem' },
  },
  {
    maxCount: Infinity,
    size: { baseWidth: '6rem', baseHeight: '6rem', mdWidth: '7.25rem', mdHeight: '8rem' },
  },
];

export function getSkillCardSize(count: number): SkillCardSize {
  const tier = SIZE_TIERS.find((t) => count <= t.maxCount);
  return tier?.size ?? SIZE_TIERS[SIZE_TIERS.length - 1].size;
}