import { SectionComponent } from "@/components/molecules/Section";
import { NotFoundSection } from "@/components/molecules/NotFoundSection";
import type { PORTFOLIO_BY_SLUG_QUERY_RESULT, Section } from "@/sanity.types";
import type { Person } from "@/sanity.types";
import { RichTextSection } from "../molecules/RichTextSection";
import { SkillCloud } from "../organisms/SkillCloud";
import { skillRiverScrollSteps } from "@/lib/skill-room-filters";
import { Timeline } from "../organisms/Timeline";
import { localize, type LangId } from "@/lib/locale";
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

// Section types rendered inside the "rooms" sequence (see RoomsSection)
// instead of as their own standalone stacked section.
const ROOM_SECTION_TYPES = new Set<SectionType>(["skills", "experience", "projects"]);

const ROOM_PAGE_VARS: Record<"skills" | "experience" | "projects", string> = {
  skills: "--color-surface",
  experience: "--color-surface-container",
  projects: "--color-surface",
};

const ROOM_SCREEN_VARS: Record<"skills" | "experience" | "projects", string> = {
  skills: "--color-room-screen-skills",
  experience: "--color-room-screen-experience",
  projects: "--color-room-screen-projects",
};

export function isRoomSection(section: Section): boolean {
  return ROOM_SECTION_TYPES.has(section.sectionType as SectionType);
}

export function buildRoomDef(section: Section, person: Person, locale: LangId = "en") {
  const definition = SECTION_REGISTRY[section.sectionType as SectionType];
  const data = definition.selectData(person as any);
  const Component = definition.component as any;

  return {
    id: section._id,
    // Header's navItems derive anchorId from this same field (sectionId.current)
    // — reused here so the DOM element the nav link scrolls to actually exists.
    anchorId: section.sectionId?.current,
    kind: section.sectionType as string,
    heading: localize(section.heading, locale),
    subheading: localize(section.subheading, locale),
    colorVar: ROOM_PAGE_VARS[section.sectionType as keyof typeof ROOM_PAGE_VARS] ?? "--color-surface",
    screenColorVar:
      ROOM_SCREEN_VARS[section.sectionType as keyof typeof ROOM_SCREEN_VARS] ?? "--color-room-screen-skills",
    scrollSteps:
      section.sectionType === "skills"
        ? skillRiverScrollSteps((person as any)?.skills)
        : section.sectionType === "experience"
          ? Math.max(3, ((person as any)?.experience?.length ?? 3) as number)
          : 1,
    isProject: section.sectionType === "projects" ? true:false,
    content: <Component key={section._id} data={data} section={section} locale={locale} />,
  };
}

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
  const Component = definition.component as any;

  return (
    <SectionComponent
      key={section._id}
      section={section}
      data={data}
      component={Component}
      locale={locale}
       isOdd={isOdd}
    />
  );
}

