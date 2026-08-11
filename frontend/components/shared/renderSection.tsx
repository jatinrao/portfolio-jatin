import { SectionComponent } from "@/components/molecules/Section";
import { NotFoundSection } from "@/components/molecules/NotFoundSection";
import type { PORTFOLIO_BY_SLUG_QUERY_RESULT, Section } from "@/sanity.types";
import type { Person } from "@/sanity.types";
import { RichTextSection } from "../molecules/RichTextSection";
import { SkillCloud } from "../organisms/SkillCloud";
import { Timeline } from "../organisms/Timeline";
import type { LangId } from "@/lib/locale";
import { ProjectCarousel } from "../organisms/coverflow-carousel";



const skillsDefinition = {
  component: SkillCloud,
  selectData: (person: Person & {category_labels:any}) => ({'skills':person.skills,'category_labels':person.category_labels}),
} as const;

const experienceDefinition = {
  component: Timeline,
  // Accept the generic Person shape here; the full portfolio query result
  // may include extra fields (header, hero_section, experience, ...).
  // Use a loose cast to avoid TypeScript errors when calling with `person`.
  selectData: (person: Person) => ({'experience':(person as any)?.experience,"education":(person as any )?.education}),
} as const;
const projectDefinition = {
  component:ProjectCarousel ,
  // Accept the generic Person shape here; the full portfolio query result
  // may include extra fields (header, hero_section, experience, ...).
  // Use a loose cast to avoid TypeScript errors when calling with `person`.
  selectData: (person: Person) => (person as any)?.projects ?? [],
} as const;

const richTextDefinition = {
  component: RichTextSection,
  selectData: () => undefined,
} as const;


// Maps every real `sectionType` from the Sanity schema to its definition.
// "custom" here is the schema's own content type (editorial rich text) —
// NOT the fallback for unmapped types, which is handled separately in renderSection.
export const SECTION_REGISTRY = {
  experience: experienceDefinition,
  skills: skillsDefinition,
  custom: richTextDefinition,
  projects: projectDefinition, // editorial one-off, still real content
} as const;

export type SectionType = keyof typeof SECTION_REGISTRY;

export function renderSection(section: Section, person: Person, locale: LangId = "en",isOdd:boolean = false) {
  const isKnownType = section.sectionType in SECTION_REGISTRY;

  if (!isKnownType) {
    // Genuine fallback: sectionType doesn't match anything in the registry.
    // This is a data/config bug, not editorial content — flagged visibly in dev only.
    return (
      <SectionComponent
        key={section._id}
        section={section}
        data={undefined}
        component={NotFoundSection}
        locale={locale}
        isOdd={isOdd}
      />
    );
  }

  const definition = SECTION_REGISTRY[section.sectionType as SectionType];
  // Cast here because different registry entries expect different shapes
  // (e.g. skills expects category_labels). At call sites we have the
  // generic Person, so cast to any to satisfy TypeScript.
  const data = definition.selectData(person as any);

  return (
    <SectionComponent
      key={section._id}
      section={section}
      data={data}
      component={definition.component as any}
      locale={locale}
       isOdd={isOdd}
    />
  );
}

