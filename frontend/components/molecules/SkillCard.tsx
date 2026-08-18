'use client';

import { Icon } from '@web-portfolio/icons';
import type { Skill } from '@/sanity.types';
import { localize, LangId } from '@/lib/locale';
import SvgIcon from '@/components/atoms/SvgIcon';
import { getSkillPosterGradient } from '@/lib/skill-poster-gradient';

type SkillWithMetrics = Skill & {
  proficiency?: number;
  experience?: number;
};

interface SkillCardProps {
  skill: SkillWithMetrics;
  locale?: LangId;
  isExiting?: boolean;
  ariaHidden?: boolean;
}

function formatExperience(years: number) {
  return `${years}+ Yr${years === 1 ? '' : 's'}`;
}

export function SkillCard({ skill, locale = 'en', isExiting = false, ariaHidden = false }: SkillCardProps) {
  const label = localize(skill.name, locale);
  const palette = getSkillPosterGradient(skill._id);
  const hasProficiency = typeof skill.proficiency === 'number';
  const hasExperience = typeof skill.experience === 'number';

  return (
    <article
      className={['skill-poster', isExiting ? 'is-exiting' : ''].filter(Boolean).join(' ')}
      aria-hidden={ariaHidden || undefined}
      style={{
        ['--skill-poster-from' as string]: palette.from,
        ['--skill-poster-to' as string]: palette.to,
        ['--skill-poster-angle' as string]: palette.angle,
      }}
    >
      <div className="skill-poster-inner">
        <div className="skill-poster-icon">
          {skill.iconName ? (
            <Icon name={skill.iconName} size={48} color={palette.from} />
          ) : (
            <SvgIcon src={skill?.svg_icon} width={48} accentColor={palette.from} />
          )}
        </div>

        <div className="skill-poster-scrim">
          <div className="skill-poster-meta">
            <span className="skill-poster-name">{label}</span>
            {hasExperience && (
              <span className="skill-poster-years">{formatExperience(skill.experience!)}</span>
            )}
          </div>
          {hasProficiency && (
            <div className="skill-poster-proficiency">
              <div className="skill-poster-bar">
                <div
                  className="skill-poster-bar-fill"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
              <span className="skill-poster-proficiency-label">{skill.proficiency}%</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
