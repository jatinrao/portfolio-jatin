import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
// import type { ContactPerson } from '../../types/feedbackSection';
import { localize } from '@/lib/locale';

interface FeedbackFormHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
//   contactPerson?: ContactPerson;
  locale: string;
}

export function FeedbackFormHeader({
  eyebrow,
  title,
  description,
//   contactPerson,
  locale,
}: FeedbackFormHeaderProps) {
  return (
    <div className="md:col-span-1">
      {eyebrow && (
        <p className="mb-4 font-label-caps text-label-caps uppercase text-secondary">{eyebrow}</p>
      )}
      <h2 className="tight-heading mb-6 font-headline-lg text-headline-lg uppercase leading-none">
        {title}
      </h2>
      {description && (
        <p className="font-body-md text-sm text-muted-body">{description}</p>
      )}

      {/* {contactPerson && (
        <div className="mt-6 flex items-center gap-3">
          {contactPerson.avatar?.asset?.url && (
            <Image
              src={urlForImage(contactPerson.avatar).width(64).height(64).url()}
              alt={contactPerson.avatar.alt ?? contactPerson.name ?? ''}
              width={32}
              height={32}
              className="rounded-full border border-heading-ink object-cover"
            />
          )}
          <p className="font-label-caps text-[10px] uppercase text-outline">
            Direct line to {localize(contactPerson.name, locale)}
          </p>
        </div>
      )} */}
    </div>
  );
}