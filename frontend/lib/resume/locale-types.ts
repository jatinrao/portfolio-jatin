/**
 * Domain-level locale types used by ResumeModel (see types.ts). Kept
 * separate from the Typegen-generated `ResumeQueryResult` shape
 * (lib/sanity/resume-query-result.ts) on purpose: the generated type
 * reflects Sanity's schema exactly (e.g. a `localeString` object type
 * might generate as `{ _type: "localeString"; en?: string; es?: string }
 * | null`), while `LocaleString` here is the simpler, schema-agnostic
 * shape `localize()` from `@/lib/locale` already expects. The mapper is
 * the one place that bridges the two.
 */
export type LocaleString = Partial<Record<string, string>>;

export interface PortableTextSpan {
  _type: "span";
  text: string;
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  children: PortableTextSpan[];
}

export type LocaleBlockContent = Partial<Record<string, PortableTextBlock[]>>;
