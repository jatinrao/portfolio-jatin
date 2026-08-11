'use client';

import { useEffect, useRef } from 'react';
import { SkillCard } from '@/components/molecules/SkillCard';
import { SkillFilterBar, type SkillFilterOption } from '@/components/molecules/SkillFilterBar';
import { useSkillFilter } from '@/hooks/use-skill-filters';
import { useFlipReflow } from '@/hooks/use-flip-reflow';
import { useHoverFocus } from '@/hooks/use-hover-focus';
import type { Skill } from '@/sanity.types';
import { localize, type LangId } from '@/lib/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { getSkillCardSize } from '@/lib/skillCards';

export const FILTER_OPTIONS: SkillFilterOption[] = [
  { value: 'all', label: 'ALL' },
  { value: 'frontend', label: 'FRONTEND' },
  { value: 'backend', label: 'BACKEND' },
  {value:"ai",label:"AI"},
  // { value: 'others', label: 'MISC' },
];

interface SkillCloudProps {
  data: {skills:Skill[];category_labels:any}
  locale?: LangId;
  description?: string;
}

export function SkillCloud({ data, locale = 'en', description }: SkillCloudProps) {
  const { activeFilter, displayed, exitingIds, setFilter } = useSkillFilter(data.skills);
  const { getFocusProps } = useHoverFocus();
  const containerRef = useRef<HTMLDivElement>(null!);
  const isMobile = useIsMobile();

  useFlipReflow(containerRef, [displayed]);
  const filterOptions = FILTER_OPTIONS.map((option) => ({value:option.value,label:localize(data.category_labels?.[option.value],locale)}));

  // Mobile: "All" is hidden from the filter bar entirely (see below) —
  // if it's somehow the active filter while on mobile (initial default,
  // or the viewport shrank below the breakpoint while "All" was already
  // selected), fall through to the next real option instead.
  useEffect(() => {
    if (!isMobile || activeFilter !== 'all') return;
    const fallback = filterOptions.find((option) => option.value !== 'all');
    if (fallback) setFilter(fallback.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, activeFilter]);

  const visibleFilterOptions = isMobile
    ? filterOptions.filter((option) => option.value !== 'all')
    : filterOptions;

  // Cards shrink as the filtered count grows (and grow back as it shrinks)
  // so the grid's total height stays in a similar band across filters —
  // "ALL" showing 30 items and "AI" showing 3 shouldn't make the section
  // balloon/collapse and shift everything below it. See
  // lib/skillCardSize.ts for the actual tiers.
  const cardSize = getSkillCardSize(displayed?.length ?? 0);

  return (
    <div className="space-y-10 z-20 px-gutter">
      <SkillFilterBar
        options={visibleFilterOptions}
        active={activeFilter}
        onChange={setFilter}
        description={description}
      />

      <div
        ref={containerRef}
        style={{
          ['--skill-card-width' as string]: cardSize.baseWidth,
          ['--skill-card-height' as string]: cardSize.baseHeight,
          ['--skill-card-width-md' as string]: cardSize.mdWidth,
          ['--skill-card-height-md' as string]: cardSize.mdHeight,
        }}
        className="flex min-h-[220px] flex-wrap items-center justify-center gap-6 md:gap-8 [&>div:nth-child(even)]:translate-y-5"
      >
        {displayed?.map((skill) => (
          <div key={skill._id} data-flip-id={skill._id}>
            <SkillCard
              skill={skill}
              locale={locale}
              isExiting={exitingIds.has(skill._id)}
              {...getFocusProps(skill._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}