import { TimelineScrollProvider } from '@/context/timeline-scroll-context';
import { TimelineDotTrack } from '@/components/molecules/TimelineDotTrack';
import { TimelineProgressFill } from '@/components/molecules/TimelineProgressFill';
import { TimelineStepCard } from '@/components/molecules/TimelineStepCard';
import { TimelineNode } from '@/components/atoms/TimelineNode';
import type { ExperienceEntry } from '@/types/portfolio';
import type { LangId } from '@/lib/locale';
import { Education } from '@/sanity.types';
import { EducationCard } from '../molecules/EducationCard';
import { ResumeEducationEntry } from '@/lib/resume/types';

interface TimelineProps {
  data: {experience:ExperienceEntry[],education:ResumeEducationEntry[]};
  locale?: LangId;
}

// Widths in three tiers, and half-widths reused below for the centering
// padding — keep these two in sync if you change either.
const COLUMN = 'w-[280px] shrink-0 sm:w-[340px] lg:w-[380px]';
const END_COLUMN = 'w-[312px] shrink-0 sm:w-[240] lg:w-[312px]';
const ROW_GAP = 'gap-10 sm:gap-16 lg:gap-24';

// `calc(50% - half-card-width)`, per breakpoint, so the first and last
// cards have room to sit centered in the viewport at the scroll extremes
// instead of pinned flush against the container edge. `max()` keeps a
// sane minimum on very narrow viewports.
// LEFT: nothing precedes card 1 except this padding, so it only needs to
// clear half the card's own width to let card 1 reach viewport center.
const START_PADDING =
  'pl-[max(1rem,calc(50%_-_140px))] sm:pl-[max(1.5rem,calc(50%_-_170px))] lg:pl-[max(2rem,calc(50%_-_190px))]';

// RIGHT: the END_COLUMN badge and the two row-gaps around it already sit
// between the last card and this padding, so those have to be subtracted
// out of the same "clear half a viewport" target — otherwise (as just
// happened) a flat margin either double-counts that space (too much) or
// ignores it (too little, which is why the last card couldn't center).
//   subtract = halfCardWidth + END_COLUMN width + 2 × row-gap
//   mobile: 140 + 140 + 2×40  = 360
//   sm:     170 + 170 + 2×64  = 468
//   lg:     190 + 200 + 2×96  = 582
const END_PADDING =
  'pr-[max(1rem,calc(50%_-_280px))] sm:pr-[max(1.5rem,calc(50%_-_360px))] lg:pr-[max(2rem,calc(50%_-_460px))]';
export function Timeline({ data, locale = 'en' }: TimelineProps) {
  return (
    <section className="relative w-full z-20 bg-[radial-gradient(#d0c5b2_1px,transparent_1px)] bg-[24px_24px] bg-[#fcf9f3]">
      <TimelineScrollProvider>
        <div className={`inline-flex min-w-full flex-col ${START_PADDING} ${END_PADDING}`}>
          {/* Row 1: index labels */}
          {/* <div className={`flex items-center ${ROW_GAP}`}>
            {data.map((entry, index) => (
              <div key={entry._id} className={`${COLUMN} text-center`}>
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">
                  NODE_IDX_{String(index + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
            <div className={END_COLUMN} aria-hidden="true" />
          </div> */}

          {/* Row 2: nodes + dotted connector */}
          <div className={`relative my-6 flex items-center ${ROW_GAP}`}>
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-4 -translate-y-1/2">
              <TimelineDotTrack />
              <TimelineProgressFill />
            </div>
            {data.experience.map((entry) => (
              <div key={entry._id} className={`${COLUMN} flex justify-center`}>
                <TimelineNode />
              </div>
            ))}
            <div className={`${END_COLUMN} flex justify-center`}>
              <div className="z-10 flex h-10 w-10 items-center justify-center border-4 border-heading-ink bg-white shadow-[4px_4px_0px_0px_#c9a84c] sm:h-12 sm:w-12">
                <span className="material-symbols-outlined text-heading-ink">
                  <svg
    className="connect-icon"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24"
  height="24"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M23 11.99 20.56 9.2l.34-3.69-3.61-.82L15.4 1.5 12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 11.99l2.44 2.79-.34 3.7 3.61.82 1.89 3.2 3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69zm-3.95 1.48-.56.65.08.85.18 1.95-1.9.43-.84.19-.44.74-.99 1.68-1.78-.77-.8-.34-.79.34-1.78.77-.99-1.67-.44-.74-.84-.19-1.9-.43.18-1.96.08-.85-.56-.65L3.67 12l1.29-1.48.56-.65-.09-.86-.18-1.94 1.9-.43.84-.19.44-.74.99-1.68 1.78.77.8.34.79-.34 1.78-.77.99 1.68.44.74.84.19 1.9.43-.18 1.95-.08.85.56.65 1.29 1.47z"/>
  <path d="m10.09 13.75-2.32-2.33-1.48 1.49 3.8 3.81 7.34-7.36-1.48-1.49z"/>
</svg>
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: cards */}
          <div className={`mt-8 flex sm:mt-10 ${ROW_GAP}`}>
            {data.experience?.map((entry) => (
              <div key={entry._id} className={COLUMN}>
                <TimelineStepCard entry={entry} locale={locale} />
              </div>
            ))}
            <div className={`${END_COLUMN} flex flex-col items-center justify-center text-center`}>
              
              <div className="flex flex-col gap-gutter">
        {data.education.map((entry) => (
          <EducationCard key={entry._id} education={entry} locale={locale} />
        ))}
      </div>
              </div>
            </div>
          </div>
        
      </TimelineScrollProvider>
    </section>
  );
}