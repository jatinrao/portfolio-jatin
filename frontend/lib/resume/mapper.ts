import "server-only";
import type { ResumeQueryResult } from "@/lib/resume-query-result";
import type {
  ResumeModel,
  ResumeEducationEntry,
} from "@/lib/resume/types";
import { Experience, LocaleString} from "@/sanity.types";

function orUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

function orEmptyArray<T>(value: T[] | null | undefined): T[] {
  return value ?? [];
}

function orEmptyString(value: string | null | undefined): string {
  return value ?? "";
}

function orEmptyLocaleString(value: string | Record<string, string> | null | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  console.log('')
  const localeValue = (value as Record<string, string>).en
    ?? Object.values(value as Record<string, string>)[0]
    ?? "";

  return localeValue;
}

function orEmptyObject<T extends object>(value: T | null | undefined): T {
  return value ?? ({} as T);
}

function byStartDateDesc<T extends { startDate: string | null }>(a: T, b: T): number {
  return (b.startDate ?? "").localeCompare(a.startDate ?? "");
}

// `experience` is now its own document collection (`person._ref == ^._id`),
// so each item is a real Sanity document with `_id` — not an inline array
// item with `_key` like the previous query shape. `skills[]->` is a
// dereference too, so those items are also full documents with `_id`.
type RawSkillRef = ResumeQueryResult extends { skills: (infer S)[] | null | undefined }
  ? NonNullable<S>
  : any;
type RawExperience = ResumeQueryResult extends { experience: (infer E)[] | null | undefined }
  ? NonNullable<E>
  : any;
// education/projects: not part of this query (were already commented out
// below before this change) — types kept as harmless fallbacks in case
// they're reinstated later.
type RawEducation = ResumeQueryResult extends { education: (infer E)[] | null | undefined }
  ? NonNullable<E>
  : any;
type RawProject = ResumeQueryResult extends { projects: (infer E)[] | null | undefined }
  ? NonNullable<E>
  : any;

/**
 * Shared shape for a dereferenced skill ref (`skills[]->{...}`), used for
 * both the top-level `skills` array and each experience entry's own
 * `skills[]->`. Neither ever fetches system document fields — those are
 * synthesized here rather than added to the query, since the query would
 * just be paying for bytes this mapper can safely default instead.
 */
function mapSkillRef(skill: RawSkillRef, fallbackUpdatedAt: string) {
  return {
    ...skill,
    _type: (skill as any)?._type ?? "skill",
    _createdAt: (skill as any)?._createdAt ?? fallbackUpdatedAt,
    _updatedAt: (skill as any)?._updatedAt ?? fallbackUpdatedAt,
    _rev: (skill as any)?._rev ?? "",
    // Both are real, individually-optional schema fields now — left
    // `undefined` when unset rather than defaulted to `0`/`[]`, so
    // SkillCard's `typeof skill.proficiency === 'number'` guard correctly
    // hides the progress bar instead of rendering a misleading 0% one.
    proficiency: orUndefined((skill as any)?.proficiency),
    experience: orUndefined((skill as any)?.experience),
  } as any;
}

function mapExperience(item: RawExperience, fallbackUpdatedAt: string): Experience {
  return {
    _id: item._id,
    _type: (item as any)?._type ?? "experience",
    _createdAt: (item as any)?._createdAt ?? fallbackUpdatedAt,
    _updatedAt: (item as any)?._updatedAt ?? fallbackUpdatedAt,
    _rev: (item as any)?._rev ?? "",
    person: orUndefined((item as any)?.person),
    // TODO(types): `ResumeExperienceEntry.company` is currently a plain
    // string; the query now returns a full `organization->` reference.
    // Mapping the localized org name into `company` keeps this compiling
    // against the existing type without touching @/lib/resume/types in
    // this pass — but `logo`/`website`/`slug` only survive via the extra
    // `organization` field below, which needs a matching field added to
    // ResumeExperienceEntry to actually be kept (and to typecheck without
    // the `as` cast) once that file's in scope.
    company: orEmptyLocaleString(item.organization?.name),
    organization: item.organization
      ? {
          id: item.organization._id,
          name: orEmptyObject(item.organization.name),
          slug: orUndefined(item.organization.slug?.current),
          logo: orUndefined(item.organization.logo),
          website: orUndefined(item.organization.website),
        }
      : undefined,
    role: orEmptyObject(item.role),
    employmentType: orUndefined(item.employmentType),
    location: orUndefined(item.location),
    startDate: item.startDate ?? "",
    endDate: orUndefined(item.endDate),
    isCurrent: Boolean(item.isCurrent),
    description: orEmptyObject(item.description),
    skills: orEmptyArray(item.skills).map((s) => mapSkillRef(s as any, fallbackUpdatedAt)),
    // `highlights` no longer exists on the query (replaced by `description`
    // + `skills`) — dropped rather than silently defaulted to `[]`, so it's
    // obvious the source moved rather than looking like empty data.
  } as Experience;
}

function mapEducation(item: RawEducation): ResumeEducationEntry {
  return {
    _id: (item as any)._id ?? (item as any)._key ?? "",
    institution: orEmptyObject(item.institution?.name) ?? "",
    degree: orEmptyObject(item.degree),
    fieldOfStudy: orUndefined(item.fieldOfStudy)
      ? orEmptyObject(item.fieldOfStudy as any)
      : undefined,
    startDate: item.startDate ?? "",
    endDate: orUndefined(item.endDate),
  };
}

// function mapProject(item: RawProject): Project {
//   return {
//     _id: (item as any)._id ?? (item as any)._key ?? "",
//     title: (item as any).title ?? "",
//     description: orEmptyObject(item.description),
//     url: orUndefined(item.projectUrl ?? item.repositoryUrl),
//     technologies: orEmptyArray((item as any).technologies),
//   };
// }

export class ResumeMapper {
  static toResumeModel(doc: ResumeQueryResult): ResumeModel {
    const fallbackUpdatedAt = doc._updatedAt;

    return {
      // TODO(query): the new projection never selects `"slug": slug.current`
      // at the root (only filters by it) — add that back to the GROQ so
      // this actually populates. Defaulted to "" here so the mapper
      // doesn't throw in the meantime.
      slug: orUndefined((doc as any).slug?.current) ?? "",

      // Previously read straight off `doc` — now nested under `hero_section`.
      name: orEmptyObject(doc.hero_section?.name),
      headline: orEmptyObject(doc.hero_section?.headline),
      bio_short: orEmptyObject(doc.hero_section?.bio_short) as unknown as Partial<Record<string, any[]>>,
      resumeImage:orUndefined(doc.hero_section.resumeImage),
      channels:orUndefined(doc.hero_section.channels),
      projects:orEmptyArray(doc.projects),
      // TODO(types): no home yet on ResumeModel — add `greeting`, `avatar`,
      // and `header` there to keep these without the outer `as any` below.
      greeting: orUndefined(doc.hero_section?.greeting),
      avatar: orUndefined(doc.hero_section?.avatar),
      header: doc.header
        ? {
            title: orUndefined(doc.header.header_title),
            location: orUndefined(doc.header.location),
            logo: orUndefined(doc.header.logoImage),
          }
        : undefined,

      skills: orEmptyArray(doc.skills).map((s) => mapSkillRef(s, fallbackUpdatedAt)),

      experience: orEmptyArray(doc.experience)
        .map((entry) => mapExperience(entry, fallbackUpdatedAt))
        // Query already orders by startDate desc — re-sorting is a cheap,
        // harmless safety net if that ever drifts from this mapper later.
        .sort(byStartDateDesc),
      education:orEmptyArray(doc.education).map(entry => mapEducation(entry)),
      // education / projects: still not part of this query — left out,
      // same as before this change (mapEducation/mapProject stay unused).

      // TODO(types): add `sections: PortfolioSection[]` (or equivalent) to
      // ResumeModel to drop the `as any` cast below.
      sections: orEmptyArray(doc.sections),

      updatedAt: doc._updatedAt,
    } as any; // remove once the TODO(types) fields above are added to ResumeModel
  }
}