'use client';

import { motion } from 'framer-motion';
import type { RefObject } from 'react';
import { useTimelineScrollContext } from '@/context/timeline-scroll-context';
import { useCardScrollMotion } from '@/hooks/use-card-scroll-motion';
import type { ExperienceEntry } from '@/types/portfolio';
import { localize, type LangId } from '@/lib/locale';
import Image from 'next/image';

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
  const { cardRef, wrapperStyle, cardStyle } = useCardScrollMotion(
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
    <motion.div ref={cardRef} style={wrapperStyle} className="h-full w-full">
      <motion.div style={cardStyle} className="flex h-full flex-col border-2 border-[#c9a84c] bg-[#fcf9f3] p-5 sm:p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <span className="font-label-caps text-[10px] text-primary">{formatDateRange(entry,locale)}</span>
          {/* <span
            className={[
              'px-2 py-0.5 font-label-caps text-[8px] uppercase',
              entry.isCurrent ? 'bg-secondary text-white' : 'bg-[#edeae0] text-heading-ink',
            ].join(' ')}
          >
            {entry.isCurrent ? 'Active Deployment' : 'Terminated_Success'}
          </span> */}
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
                        className="h-10 w-10 shrink-0 rounded-full border border-outline-variant object-cover"
                      />
          
                    )}
          </div>
          <div className='flex flex-col'>
            <div> 
            <h3 className="tight-heading -mb-1 font-headline-lg text-base uppercase sm:text-sm md:text-lg">{role}</h3>
        <p className="mb-4 font-label-caps text-sm font-bold text-secondary">{orgName}</p>
          </div>
          </div>
        </div>
        

        {description && <p className="mb-6 text-sm text-on-surface">{description}</p>}

        {entry.skills && entry.skills.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {entry.skills.map((skill) => (
              <span key={skill._id} className="border border-outline-variant px-2 py-1 font-label-caps text-[9px] uppercase">
                {localize(skill.name, locale)}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}