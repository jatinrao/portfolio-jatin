import Image from 'next/image';
import { localize, type LangId } from '@/lib/locale';



interface EducationCardProps {
  education: any;
  locale: LangId;
}

// function formatGraduationStatus(entry: ResumeEducationEntry) {
//   if (entry.isCurrent) return 'STUDYING';
//   if (!entry.endDate) return null;
//   return `GRADUATED_${new Date(entry.endDate).getFullYear()}`;
// }

/**
 * Static (server-rendered, no motion/hooks) — matches the reference
 * HTML's brutalist card chrome: 3px border in the theme's gold container
 * color, hard offset shadow, corner-accent brackets on the institution
 * graphic. Same data-stitching conventions as ProjectMiniCard/CoverCard:
 * localized fields go through `localize()`, plain string fields
 * (`fieldOfStudy`, image `alt`) don't.
 */
export function EducationCard({ education, locale }: EducationCardProps) {
  const institutionName = education.institution ? localize(education.institution.name, locale) : undefined;
  const degree = localize(education.degree, locale) ?? '';
  const fieldOfStudy = education.fieldOfStudy ? String(education.fieldOfStudy).toUpperCase() : '';
  const logoUrl = (education.institution?.logo as { asset?: { url?: string } } | undefined)?.asset?.url;
//   const status = formatGraduationStatus(education);

  // "B.S. SYSTEMS_ENGINEERING" style combined label — degree alone if no
  // fieldOfStudy was set, rather than rendering a trailing separator.
  const programLabel = fieldOfStudy ? `${degree}\n${fieldOfStudy}` : degree;

  return (
    <div className="relative z-20 border-[1.5px] border-primary-container py-4 px-4 min-w-56 ">
      <div className="flex flex-col gap-4 md:items-center">
        <div className="w-full flex space-y-1 text-center ">
          {institutionName && (
            <p className="font-headline-lg-mobile uppercase text-heading-ink md:font-headline-md text-headline-sm w-full">
              {institutionName}
            </p>
          )}
          {/* {education.description && localize(education.description, locale) && (
            <p className="font-body-md text-sm leading-snug text-on-surface-variant">
              {localize(education.description, locale)}
            </p>
          )} */}
        </div>
        {/* Institution graphic */}
        <div className='flex flex-row w-full'>
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center scale-110  bg-surface-container">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={localize(education.institution?.logo?.alt,locale) ?? institutionName ?? 'Institution'}
              width={64}
              height={64}
              className="object-cover opacity-80 mix-blend-multiply"
            />
          ) : (
            <span className="material-symbols-outlined text-4xl text-outline" aria-hidden="true">
              school
            </span>
          )}
          <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-primary" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-primary" aria-hidden="true" />
          
        </div>

        <div className="flex flex-col gap-4 border-t pt-1 border-outline-variant sm:flex-row sm:items-center w-full">
            {programLabel && (
                <span className="font-label-caps text-left pl-3 text-sm uppercase tracking-widest text-secondary whitespace-pre-wrap">
                  {programLabel}
                </span>
            )}

            {/* {status && (
              <>
                <div className="hidden h-4 w-px bg-outline-variant sm:block" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <span className="block h-2 w-2 bg-outline" aria-hidden="true" />
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
                    {status}
                  </span>
                </div>
              </>
            )} */}
          </div>
        </div>  

        {/* Details */}
        
      </div>
    </div>
  );
}