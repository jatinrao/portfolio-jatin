'use client';

import { SkillIcon } from '@/components/atoms/SkillIcon';
import { CATEGORY_ACCENTS } from '@/lib/resume-query-result';
import type { Skill } from '@/sanity.types';
import { localize, LangId } from '@/lib/locale';
import { SkillCategoryTag } from '@/components/atoms/SkillCategoryTag';
import SvgIcon from '@/components/atoms/SvgIcon';

/**
 * `proficiency`/`experience` layered on as an intersection so this compiles
 * even before they exist on the generated `Skill` type — add them to the
 * Sanity schema (proficiency: number 0-100, experience: number, years) and
 * regenerate types, and this becomes a plain, fully-typed field access.
 */
type SkillWithMetrics = Skill & {
  proficiency?: number;
  /** Years of experience, e.g. 5 → rendered as "5+ Yrs" */
  experience?: number;
};

interface SkillCardProps {
  skill: SkillWithMetrics;
  locale?: LangId;
  isDimmed?: boolean;
  isExiting?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

function formatExperience(years: number) {
  return `${years}+ Yr${years === 1 ? '' : 's'}`;
}

export function SkillCard({
  skill,
  locale = 'en',
  isDimmed = false,
  isExiting = false,
  onHoverStart,
  onHoverEnd,
}: SkillCardProps) {
  const label = localize(skill.name, locale);
  const accentColor = skill.category ? CATEGORY_ACCENTS[skill.category] : '#7e7665';
  const hasProficiency = typeof skill.proficiency === 'number';
  const hasExperience = typeof skill.experience === 'number';

  return (
    <div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={[
        'group relative flex items-center justify-center',
        'h-[var(--skill-card-height,7rem)] w-[var(--skill-card-width,7rem)]',
        'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        'md:h-[var(--skill-card-height-md,10rem)] md:w-[var(--skill-card-width-md,9rem)]',
        isExiting ? 'pointer-events-none scale-75 opacity-0' : isDimmed ? 'scale-90 opacity-50' : '',
      ].join(' ')}
    >
      <div
        className={[
          // Base card: border/background/position match `.skill-card`,
          // `overflow-hidden` removed so the offset `after:` square below
          // isn't clipped (the reference's `.skill-card` has no overflow
          // rule for the same reason — `::after` uses `inset: -4px`, i.e.
          // it deliberately extends outside the card's own box).
          'skill-card relative flex h-full w-full flex-col items-center justify-center',
          'border border-[#7e7665] bg-[#fcf9f3] p-3 text-center opacity-80',
          'transition-all duration-300 ease-in-out',
          // `.skill-card-container:hover .skill-card`: translate(-4px,-4px),
          // background → white, z-index → 50. No border-color change and
          // no opacity change on hover in the reference — only the
          // offset square (below) changes color.
          'group-hover:z-50 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:bg-white',
          // `.skill-card::after`: the offset accent square — inset:-4px,
          // 2px gold border, sits behind the card (z-[-1]).
          "after:absolute after:-inset-1 after:z-[-1] after:border-2 after:border-[#c9a84c] after:content-['']",
          "after:transition-all after:duration-200 after:ease-[ease]",
          // `.skill-card-container:hover .skill-card::after`: translate(6px,6px),
          // border/background → green.
          'group-hover:after:translate-x-1.5 group-hover:after:translate-y-1.5',
          // 'group-hover:after:border-[#3b684a] group-hover:after:bg-[#3b684a]',
          // `.skill-card-container:active .skill-card` / `::after`: both
          // reset to translate(0,0), overriding the hover transform above
          // (source-order-dependent in the plain CSS; `!` here guarantees
          // the same override regardless of Tailwind's generated variant
          // order).
          'group-active:!translate-x-0 group-active:!translate-y-0',
          'group-active:after:!translate-x-0 group-active:after:!translate-y-0',
          'hover:scale-125'
        ].join(' ')}
      >
        <SvgIcon src={skill?.svg_icon} width={48} accentColor={accentColor}  />
        {/* <SkillIcon skill={skill} size={48} accentColor={accentColor} /> */}
        <span className="font-label-caps text-[10px] uppercase leading-tight tracking-wider">
          {label}
        </span>

        <div className="max-h-0 w-full overflow-hidden px-2 opacity-0 transition-all duration-300 ease-out group-hover:mt-2 group-hover:max-h-[100px] group-hover:opacity-100">
          <div className="flex items-center justify-between gap-2">
            {skill.category && <SkillCategoryTag category={skill.category} />}
            {hasExperience && (
              <span className="font-label-caps text-[8px] font-bold uppercase text-primary">
                {formatExperience(skill.experience!)}
              </span>
            )}
          </div>

          {hasProficiency && (
            <>
              <div className="mt-1.5 h-[3px] w-full bg-[#d0c5b2]">
                <div
                  className="h-full transition-[width] duration-500 ease-out"
                  style={{ width: `${skill.proficiency}%`, backgroundColor: accentColor }}
                />
              </div>
              <div className="mt-1 text-center font-label-caps text-[7px] uppercase tracking-tighter text-outline">
                Proficiency: {skill.proficiency}%
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}