
import type { ResumeSkillEntry } from '@/lib/resume/types';
import { SectionHeading } from './SectionHeading';
import { LangId, localize } from '@/lib/locale';
import { LocaleString } from '@/sanity.types';
import { SkillFilterOption } from '../molecules/SkillFilterBar';
import SvgIcon from '../atoms/SvgIcon';

interface SkillsSectionProps {
  skills: ResumeSkillEntry[];
  locale: LangId;
  /** `data.category_labels` from the resume query — one LocaleString per category value. */
  categoryLabels?: Partial<Record<string, LocaleString>>;
}

const FILTER_OPTIONS: SkillFilterOption[] = [
  { value: 'frontend', label: 'FRONTEND' },
  { value: 'backend', label: 'BACKEND' },
  {value:"ai",label:"AI"},
  // { value: 'others', label: 'MISC' },
];

/**
 * Groups skills by `filter_category` and renders each as its own labeled
 * row, in `FILTER_OPTIONS`'s canonical order — no interactive
 * filtering here (this is a static print document), just categorized
 * grouping. A category with zero matching skills is skipped entirely
 * rather than printed with an empty chip row.
 */
function groupSkillsByCategory(
  skills: ResumeSkillEntry[],
  locale: LangId,
  categoryLabels: SkillsSectionProps['categoryLabels'],
) {
  const groups = new Map<string, { label: string; skills: ResumeSkillEntry[] }>();
  const safeOptions = FILTER_OPTIONS ?? [];

  for (const option of safeOptions) {
    groups.set(option.value, {
      label: localize(categoryLabels?.[option.value], locale) || option.label,
      skills: [],
    });
  }

  // Anything with a `filter_category` that doesn't match a known option —
  // including skills with no category set at all — goes here instead of
  // silently vanishing from the printed resume, which is exactly the kind
  // of silent data loss the earlier mapper fixes were trying to prevent.
  const uncategorized: ResumeSkillEntry[] = [];

  for (const skill of skills) {
    const bucket = skill.filter_category ? groups.get(skill.filter_category) : undefined;
    if (bucket) {
      bucket.skills.push(skill);
    } else {
      uncategorized.push(skill);
    }
  }

  const orderedGroups = safeOptions.map((option) => groups.get(option.value)!).filter(
    (group) => group.skills.length > 0,
  );

  return { orderedGroups, uncategorized };
}

// Skill names (e.g. "TypeScript", "React") aren't translated content, but
// category *labels* now are (via `category_labels`), so this section
// takes `locale` for that purpose even though skill names themselves
// don't need it.
export function SkillsSection({ skills, locale, categoryLabels }: SkillsSectionProps) {
  if (skills.length === 0) return null

  const { orderedGroups, uncategorized } = groupSkillsByCategory(skills, locale, categoryLabels)

  return (
    <section style={{ marginBottom: '14px', breakInside: 'avoid' }}>
  <SectionHeading>Skills</SectionHeading>

  {orderedGroups.map((group) => (
    <div key={group.label} style={{ marginBottom: '8px', breakInside: 'avoid' }}>
      <div
        style={{
          fontSize: '8pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5pt',
          color: '#755b00',
          marginBottom: '4px',
        }}
      >
        {group.label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {group.skills.map((skill, i) => (
          <span
            key={skill._id ?? 'key' + i}
            style={{
              fontSize: '9pt',
              border: '1px solid #c9a84c',
              borderRadius: '3px',
              color: '#1a1a1a',
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              padding: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SvgIcon src={skill.svg_icon as any} width={12} />
            </div>
            <div style={{ display: 'flex' }}>{localize(skill.name, locale)}</div>
          </span>
        ))}
      </div>
    </div>
  ))}

  {uncategorized.length > 0 && (
    <div style={{ breakInside: 'avoid' }}>
      <div
        style={{
          fontSize: '8pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5pt',
          color: '#6b6b5e',
          marginBottom: '4px',
        }}
      >
        Other
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {uncategorized.map((skill, i) => (
          <span
            key={skill._id ?? 'key' + i}
            style={{
              fontSize: '9pt',
              border: '1px solid #c9a84c',
              borderRadius: '3px',
              color: '#1a1a1a',
              display: 'flex',
              flexDirection: 'row',
              gap: '4px',
              padding: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SvgIcon src={skill.svg_icon as any} width={12} />
            </div>
            <div style={{ display: 'flex' }}>{localize(skill.name, locale)}</div>
          </span>
        ))}
      </div>
    </div>
  )}
</section>
  )
}