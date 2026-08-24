'use client';

import { motion } from 'framer-motion';
import type { RefObject } from 'react';
import { useTimelineScrollContext } from '@/context/timeline-scroll-context';
import { useCardScrollMotion } from '@/hooks/use-card-scroll-motion';
import type { ExperienceEntry } from '@/types/portfolio';
import { localize, type LangId } from '@/lib/locale';
import Image from 'next/image';
import Badge from '@/components/atoms/Badge';

interface TimelineStepCardProps {
  entry: ExperienceEntry;
  locale?: LangId;
}

function formatDateRange(entry: ExperienceEntry,locale:LangId) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { month: 'short', year: 'numeric' }).toUpperCase();
  const start = fmt(entry.startDate);
  if (entry.isCurrent) return `${start} — PRESENT`;
  return entry.endDate ? `${start} — ${fmt(entry.endDate)}` : start;
}

export function TimelineStepCard({ entry, locale = 'en' }: TimelineStepCardProps) {
  const { containerRef } = useTimelineScrollContext();
  const { cardRef, wrapperStyle } = useCardScrollMotion(
    containerRef as RefObject<HTMLDivElement>
  );

  const role = localize(entry.role, locale);
  const orgName = localize(entry.organization.name,locale);
  const description = entry.description ? localize(entry.description, locale) : null;
  const logoUrl = entry.organization.logo?.asset?.url;
  const logoAlt = typeof entry.organization.logo?.alt === 'string'
    ? entry.organization.logo.alt
    : localize(entry.organization.logo?.alt, locale) ?? '';
 
  return (
    <motion.div ref={cardRef} style={wrapperStyle} className="flex h-full w-full">
      <div className="timeline-step-card rooms-material flex h-full w-full flex-col rounded-[var(--radius-card)] border px-5 py-6 sm:px-6 sm:py-8 md:px-7 md:py-10">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <span className="timeline-step-date font-label-caps text-label-sm text-primary">{formatDateRange(entry,locale)}</span>
        </div>
        <div className='flex flex-row w-full gap-2'>
          <div className='flex'>
          {logoUrl && (
                      <Image
                        src={logoUrl}
                        alt={logoAlt}
                        width={40}
                        height={40}
                        placeholder={entry.organization.logo?.asset?.metadata?.lqip ? 'blur' : undefined}
                        blurDataURL={entry.organization.logo?.asset?.metadata?.lqip ?? undefined}
                        className="h-10 w-10 shrink-0 rounded-full border border-outline-variant bg-white object-cover"
                      />
          
                    )}
          </div>
          <div className='flex flex-col'>
            <div> 
            <h3 className="timeline-step-role tight-heading -mb-1 font-headline-lg text-base uppercase sm:text-sm md:text-lg">{role}</h3>
        <p className="timeline-step-org mb-4 font-label-caps text-sm font-bold text-secondary">{orgName}</p>
          </div>
          </div>
        </div>
        

        {description && <p className="timeline-step-body mb-4 text-sm text-on-surface">{description}</p>}

        {entry.skills && entry.skills.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {entry.skills.map((skill) => (
              <Badge key={skill._id} className="timeline-step-chip px-2 py-1 text-label-xs uppercase">
                {localize(skill.name, locale)}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
