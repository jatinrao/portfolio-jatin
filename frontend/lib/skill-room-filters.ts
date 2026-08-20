import type { Skill } from '@/sanity.types';

export const SKILL_ROOM_FILTERS = [
  { value: 'frontend', label: 'FRONTEND' },
  { value: 'backend', label: 'BACKEND' },
  { value: 'ai', label: 'AI' },
] as const;

export type SkillRoomFilterValue = (typeof SKILL_ROOM_FILTERS)[number]['value'];

const ROOM_FILTER_VALUES = new Set<string>(SKILL_ROOM_FILTERS.map((filter) => filter.value));

/** Apple TV 4K entertainment river: 3 rows × 9 posters. */
export const APPLE_RIVER_POSTERS_PER_ROW = 9;

/** Duplicated sequences on each track so the river can wrap. */
export const SKILL_RIVER_COPIES = 2;

export interface SkillRiverRow {
  id: string;
  label: string;
  uniqueCount: number;
  loopItems: number;
  skills: Skill[];
}

function cycleToLength<T>(items: T[], length: number): T[] {
  if (items.length === 0 || items.length >= length) return items;
  const out: T[] = [];
  while (out.length < length) {
    out.push(...items);
  }
  return out.slice(0, length);
}

function uniqueCategoryRows(skills: Skill[] | null | undefined): SkillRiverRow[] {
  const list = skills ?? [];
  const rows: SkillRiverRow[] = SKILL_ROOM_FILTERS.map((filter) => ({
    id: filter.value,
    label: filter.label,
    uniqueCount: 0,
    loopItems: 0,
    skills: list.filter((skill) => skill.filter_category === filter.value),
  }));

  list
    .filter((skill) => !skill.filter_category || !ROOM_FILTER_VALUES.has(skill.filter_category))
    .forEach((skill) => {
      const shortest = rows.reduce((a, b) => (a.skills.length <= b.skills.length ? a : b));
      shortest.skills.push(skill);
    });

  return rows.map((row) => ({
    ...row,
    uniqueCount: row.skills.length,
    loopItems: row.skills.length,
  }));
}

/**
 * One river row per category. Short rows pad to Apple’s 9-poster loop;
 * longer categories keep every unique skill.
 */
export function groupSkillsIntoRiverRows(skills: Skill[] | null | undefined): SkillRiverRow[] {
  return uniqueCategoryRows(skills).map((row) => {
    const loop = cycleToLength(row.skills, Math.max(APPLE_RIVER_POSTERS_PER_ROW, row.skills.length));
    return {
      ...row,
      loopItems: loop.length,
      skills: loop,
    };
  });
}

function wrapOffset(distance: number, loopWidth: number) {
  if (loopWidth <= 0) return 0;
  return ((distance % loopWidth) + loopWidth) % loopWidth;
}

/** Pixel span of one unique pass vs one looping unit, from a duplicated track. */
export function skillRiverTrackMetrics(track: HTMLElement) {
  const childCount = track.childElementCount;
  const uniqueCount = Math.max(0, Number(track.dataset.uniqueCount) || 0);
  const loopItems = Math.max(1, Number(track.dataset.loopItems) || Math.floor(childCount / SKILL_RIVER_COPIES) || 1);
  const uniqueWidth = childCount > 0 ? track.scrollWidth * (uniqueCount / childCount) : 0;
  const loopWidth = childCount > 0 ? track.scrollWidth * (loopItems / childCount) : track.scrollWidth / SKILL_RIVER_COPIES;
  return { uniqueWidth, loopWidth };
}

/**
 * Drives every `.skill-river-track` under `clip` from a single 0-1 progress
 * value — shared by desktop's scroll-jack (use-room-wipe.ts) and mobile's
 * natural-scroll-linked equivalent (use-skill-river-scroll.ts) so both
 * produce the exact same per-row pan (skillRiverLoopTranslateX).
 */
export function applySkillRiverProgress(clip: HTMLElement, progress: number) {
  const tracks = clip.querySelectorAll<HTMLElement>('.skill-river-track');
  let longestUnique = 0;
  tracks.forEach((track) => {
    longestUnique = Math.max(longestUnique, skillRiverTrackMetrics(track).uniqueWidth);
  });
  tracks.forEach((track, rowIndex) => {
    const { loopWidth } = skillRiverTrackMetrics(track);
    const x = skillRiverLoopTranslateX(progress, rowIndex, loopWidth, longestUnique);
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  });
}

/**
 * Apple TV 4K river: row 1 left 15w, row 2 right from -15w, row 3 left 10w.
 * Speeds 15:15:10; start offsets keep rows from lining up.
 */
const APPLE_RIVER_ROW_MOTION = [
  { dir: 1, speed: 1, start: 0 },
  { dir: -1, speed: 1, start: 0.15 },
  { dir: 1, speed: 10 / 15, start: 0 },
] as const;

/**
 * Per-row pan with wrap. Travel is the longest unique pass (every skill
 * on that row is seen once); shorter rows loop extra times.
 */
export function skillRiverLoopTranslateX(
  progress: number,
  rowIndex: number,
  loopWidth: number,
  longestUniqueWidth: number,
) {
  const key = APPLE_RIVER_ROW_MOTION[rowIndex] ?? APPLE_RIVER_ROW_MOTION[0];
  const p = Math.min(1, Math.max(0, progress));
  const distance = key.start * loopWidth + key.dir * p * longestUniqueWidth * key.speed;
  return -wrapOffset(distance, loopWidth);
}

/** Hijack budget: unique skills on the longest row, at 4× pan speed. */
export function skillRiverScrollSteps(skills: Skill[] | null | undefined): number {
  const longest = Math.max(1, ...uniqueCategoryRows(skills).map((row) => row.uniqueCount));
  return Math.max(1, longest / 4);
}
