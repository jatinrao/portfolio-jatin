import Image from 'next/image';
import { Icon } from '@web-portfolio/icons';
import { localize, type LangId } from '@/lib/locale';

interface EducationCardProps {
  education: any;
  locale: LangId;
}

export function EducationCard({ education, locale }: EducationCardProps) {
  const institutionName = education.institution ? localize(education.institution.name, locale) : undefined;
  const degree = localize(education.degree, locale) ?? '';
  const fieldOfStudy = education.fieldOfStudy ? String(education.fieldOfStudy).toUpperCase() : '';
  const logoUrl = (education.institution?.logo as { asset?: { url?: string } } | undefined)?.asset?.url;
  const programLabel = fieldOfStudy ? `${degree}\n${fieldOfStudy}` : degree;

  return (
    <div className="education-card rooms-material relative z-20 w-full min-w-0 max-w-[15.6rem] rounded-[var(--radius-card)] border px-5 py-6">
      <div className="flex flex-col gap-4 md:items-center">
        <div className="w-full flex space-y-1 text-center ">
          {institutionName && (
            <p className="education-card-name font-headline-lg uppercase text-heading-ink md:font-headline-md text-headline-sm w-full">
              {institutionName}
            </p>
          )}
        </div>
        <div className='flex flex-row w-full'>
        <div className="education-card-mark rooms-material relative flex h-14 w-14 shrink-0 scale-110 items-center justify-center rounded-[var(--radius-control)] border">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={localize(education.institution?.logo?.alt,locale) ?? institutionName ?? 'Institution'}
              width={64}
              height={64}
              className="object-cover opacity-80 mix-blend-multiply"
            />
          ) : (
            <Icon name="school" size={36} />
          )}
          <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-primary" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-primary" aria-hidden="true" />
          
        </div>

        <div className="flex flex-col gap-4 border-t pt-1 border-outline-variant sm:flex-row sm:items-center w-full">
            {programLabel && (
                <span className="education-card-program font-label-caps text-left pl-3 text-sm uppercase tracking-widest text-secondary whitespace-pre-wrap">
                  {programLabel}
                </span>
            )}
          </div>
        </div>  
      </div>
    </div>
  );
}
