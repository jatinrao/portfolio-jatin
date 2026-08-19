'use client';

import { useRef } from 'react';
import { SkillCard } from '@/components/molecules/SkillCard';
import type { Skill } from '@/sanity.types';
import type { LangId } from '@/lib/locale';
import { groupSkillsIntoRiverRows, SKILL_RIVER_COPIES } from '@/lib/skill-room-filters';
import { useSkillRiverScroll } from '@/hooks/use-skill-river-scroll';
import './skill-river.css';

interface SkillCloudProps {
  data: { skills: Skill[]; category_labels: any };
  locale?: LangId;
  description?: string;
}

export function SkillCloud({ data, locale = 'en', description }: SkillCloudProps) {
  const rows = groupSkillsIntoRiverRows(data.skills);
  const riverRef = useRef<HTMLDivElement>(null);
  useSkillRiverScroll(riverRef);

  return (
    <div className="z-20 flex h-full w-full min-h-0 flex-col overflow-hidden">
      {description && (
        <p className="skill-river-caption shrink-0 px-3 pt-2 text-right font-body-md text-body-sm italic text-muted-body md:px-5">
          {description}
        </p>
      )}

      <div ref={riverRef} className="skill-river" role="region" aria-label="Skills, revealed by scrolling">
        <div className="skill-river-overflow">
          <div className="skill-river-lanes">
            {rows.map((row, rowIndex) => (
              <div key={row.id} className="skill-river-row" data-row={rowIndex + 1}>
                <div
                  className="skill-river-track"
                  data-unique-count={row.uniqueCount}
                  data-loop-items={row.loopItems}
                >
                  {Array.from({ length: SKILL_RIVER_COPIES }, (_, copy) =>
                    row.skills.map((skill, index) => (
                      <SkillCard
                        key={`${copy}-${skill._id}-${index}`}
                        skill={skill}
                        locale={locale}
                        ariaHidden={copy > 0}
                      />
                    )),
                  ).flat()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
