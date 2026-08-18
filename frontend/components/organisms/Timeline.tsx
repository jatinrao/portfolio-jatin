import { TimelineScrollProvider } from '@/context/timeline-scroll-context';
import { TimelineGlassSlider } from '@/components/molecules/TimelineGlassSlider';
import { TimelineStepCard } from '@/components/molecules/TimelineStepCard';
import { TimelineNode } from '@/components/atoms/TimelineNode';
import { Icon } from '@web-portfolio/icons';
import type { ExperienceEntry } from '@/types/portfolio';
import type { LangId } from '@/lib/locale';
import { EducationCard } from '../molecules/EducationCard';
import { ResumeEducationEntry } from '@/lib/resume/types';
import './timeline-section.css';

interface TimelineProps {
  data: {experience:ExperienceEntry[],education:ResumeEducationEntry[]};
  locale?: LangId;
}

const COLUMN = 'w-[min(21rem,calc(100%-1.25rem))] shrink-0 sm:w-[min(22.2rem,calc(100%-1rem))] lg:w-[384px]';
const END_COLUMN = 'w-[min(18.6rem,calc(100%-1.25rem))] shrink-0 sm:w-[min(19.8rem,calc(100%-1rem))] lg:w-[322px]';
const ROW_GAP = 'gap-8 sm:gap-12 lg:gap-16';

const START_PADDING =
  'pl-[max(0.75rem,calc(50%_-_168px))] sm:pl-[max(1rem,calc(50%_-_178px))] lg:pl-[max(1.25rem,calc(50%_-_192px))]';

const END_PADDING =
  'pr-[max(0.75rem,calc(50%_-_264px))] sm:pr-[max(1rem,calc(50%_-_312px))] lg:pr-[max(1.25rem,calc(50%_-_384px))]';

export function Timeline({ data, locale = 'en' }: TimelineProps) {
  return (
    <section className="timeline-section relative z-20 h-full w-full min-h-0">
      <TimelineScrollProvider>
        <div className={`inline-flex min-w-full flex-col ${START_PADDING} ${END_PADDING}`}>
          <div className={`relative mt-3 mb-1 flex items-center ${ROW_GAP}`}>
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2">
              <TimelineGlassSlider />
            </div>
            {data.experience.map((entry) => (
              <div key={entry._id} className={`${COLUMN} flex justify-center`}>
                <TimelineNode />
              </div>
            ))}
            <div className={`${END_COLUMN} flex justify-center`}>
              <div className="timeline-end-badge rooms-material z-10 flex h-10 w-10 items-center justify-center rounded-full border sm:h-12 sm:w-12">
                <Icon name="verified" size={24} />
              </div>
            </div>
          </div>

          <div className={`mt-1 flex items-stretch ${ROW_GAP}`}>
            {data.experience?.map((entry) => (
              <div key={entry._id} className={`${COLUMN} flex`}>
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
