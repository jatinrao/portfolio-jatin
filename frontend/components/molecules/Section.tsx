import type { ComponentType } from "react";
import type { Section } from "@/sanity.types";
import { SectionComponentProps } from "@/lib/section";
import { LangId, localize } from "@/lib/locale";

type SectionProps<T> = {
  section: Section;
  data: T;
  component: ComponentType<SectionComponentProps<T>>;
  locale?: LangId;
  isOdd?:boolean,
};



export function SectionComponent<T>({ section, data, component: Component, locale = "en",isOdd = true }: SectionProps<T>) {
  const heading = localize(section.heading, locale);
  const subheading = localize(section.subheading, locale);

  return (
    <section
      id={section.sectionId?.current}
      className={`bg-surface ${ !isOdd ?"bg-[radial-gradient(#d0c5b2_1px,transparent_1px)] bg-[length:24px_24px]" :''} scroll-mt-24 py-10 md:py-16  border-secondary-fixed border-b-[3px] relative flex min-h-screen flex-col items-center justify-center overflow-hidden`}
      aria-labelledby={heading ? `${section.sectionId?.current}-heading` : undefined}
    >
      {(heading || subheading) && (
        <div className="z-10 grid w-full max-w-6xl grid-cols-1 gap-12 px-margin-mobile md:grid-cols-2 md:px-margin-desktop h-fit">
          <div className="h-full flex justify-start md:justify-end">
            {/* <p className="mb-2 font-label-caps text-label-caps uppercase text-secondary"> */}
              {/* Technical Specification v.3.0 */}
            {/* </p> */}
            <h1 className="mb-4 font-black font-headline-xl text-headline-xl uppercase tight-heading  border-secondary-fixed pb-0.5 text-primary">
              {heading}
            </h1>
          </div>
          <div>
            <h2 className="max-w-md text-body-md text-muted-body pl-4 border-l-[3px] border-secondary-fixed ">
              {subheading}
            </h2>
          </div>
        </div>
      )}

      <Component data={data} section={section} locale={locale} />
    </section>
  );
}