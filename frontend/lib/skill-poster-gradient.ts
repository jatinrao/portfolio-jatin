/** Vivid poster hues (site tokens + Apple-river-like accents). Hex so SVG fill always paints. */
const POSTER_STOPS = [
  '#1c63a0',
  '#ff8d28',
  '#34c759',
  '#5e5ce6',
  '#ff375f',
  '#00a8e1',
  '#f5c518',
  '#7b2ff7',
  '#00c2a8',
  '#ff6a00',
] as const;

export interface SkillPosterPalette {
  from: string;
  to: string;
  angle: string;
}

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getSkillPosterGradient(skillId: string): SkillPosterPalette {
  const hash = hashString(skillId);
  const fromIndex = hash % POSTER_STOPS.length;
  const span = 1 + ((hash >>> 8) % (POSTER_STOPS.length - 1));
  const toIndex = (fromIndex + span) % POSTER_STOPS.length;
  const angle = 105 + (hash % 70);

  return {
    from: POSTER_STOPS[fromIndex],
    to: POSTER_STOPS[toIndex],
    angle: `${angle}deg`,
  };
}
