import type { Section } from "@/sanity.types";
import { LangId } from "./locale";

export type SectionComponentProps<T = undefined> = {
  data: T;
  section: Section;
  locale?: LangId;
  customContent?:string;
};