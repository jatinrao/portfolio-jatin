// import { ProtocolBadge } from '@/atoms/';
import { FeedbackFormHeader } from '@/components/molecules/Feedbackcardheader';
import { FeedbackForm } from '@/components/molecules/FeedbackForm';
import { LangId, localize } from '@/lib/locale';

interface FeedbackSectionProps {
  locale?: LangId;
    data?: {
      badgeLabel: Record<string, string>;
      eyebrow: Record<string, string>;
      title: Record<string, string>;
      description: Record<string, string>;
      submitLabel: Record<string, string>;
      contactPerson: string;
      fields: any[];
      submitIcon: string;
    }
}

export async function FeedbackSection({ data,locale = 'en' }: FeedbackSectionProps) {
 

  if (!data) {
    return null;
  }

  const badgeLabel = localize(data.badgeLabel, locale);
  const eyebrow = localize(data.eyebrow, locale);
  const title = localize(data.title, locale);
  const description = localize(data.description, locale);
  const submitLabel = localize(data.submitLabel, locale) || 'Submit';

  return (
    <section className="w-full border-t-4 border-heading-ink bg-surface-container-low px-margin-mobile py-20 md:px-margin-desktop">
      <div className="mx-auto mb-20 flex max-w-4xl flex-col items-center">
        <div className="relative w-full border-2 border-heading-ink bg-white p-8 shadow-[8px_8px_0px_0px_#755b00] md:p-12">
          {/* <ProtocolBadge label={badgeLabel} /> */}

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <FeedbackFormHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
            //   contactPerson={data.contactPerson}
              locale={locale}
            />

            <FeedbackForm
              fields={data.fields}
              submitLabel={submitLabel}
              submitIcon={data.submitIcon}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </section>
  );
}