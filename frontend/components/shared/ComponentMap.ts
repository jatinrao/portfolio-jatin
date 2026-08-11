// import SkillsSection  from '@/components/organisms/SkillsSection'

import { Timeline } from '@/components/organisms//Timeline'
import { SkillCloud } from '@/components/organisms/SkillCloud';
import { RichTextSection } from '@/components/molecules/RichTextSection';
import { Person } from '@/sanity.types';

const skillsDefinition = {
  component: SkillCloud,
  selectData: (person: Person) => person.skills ?? [],
} as const;

// const experienceDefinition = {
//   component: Timeline,
//   selectData: (person: Person) => person.experience ?? [],
// } as const;


const richTextDefinition = {
  component: RichTextSection,
  selectData: () => undefined,
} as const;

// Maps every real `sectionType` from the Sanity schema to its definition.
// "custom" here is the schema's own content type (editorial rich text) —
// NOT the fallback for unmapped types, which is handled separately in renderSection.
export const SECTION_REGISTRY = {
//   experience: experienceDefinition,
  skills: skillsDefinition,
  custom: richTextDefinition, // editorial one-off, still real content
} as const;

export type SectionType = keyof typeof SECTION_REGISTRY;