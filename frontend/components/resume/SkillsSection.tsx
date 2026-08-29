
import { Icon } from '@web-portfolio/icons';
import { stegaClean } from '@sanity/client/stega';
import type { ResumeSkillEntry } from '@/lib/resume/types';
import { SectionHeading } from './SectionHeading';
import { LangId, localize } from '@/lib/locale';
import { LocaleString } from '@/sanity.types';
import { SkillFilterOption } from '../molecules/SkillFilterBar';
import SvgIcon from '../atoms/SvgIcon';

/** Reference's `.skill-chiclet img{width:18px;height:18px}`. */
const SKILL_GLYPH_SIZE = 18;

/**
 * @web-portfolio/icons' `<Icon>` paints every glyph one flat colour —
 * correct for brands that really are monochrome (Next.js, three.js,
 * Express, all genuinely black/white marks), but this package's registry
 * ships several *other* well-known logos as a bare currentColor
 * silhouette too, with no colour baked in at all. Left alone those
 * render in whatever text colour the chiclet uses instead of the brand
 * colour a reader would actually recognise. Keyed by the same `iconName`
 * the CMS stores, so a name with no entry here just falls through to the
 * package's own default.
 *
 * Applied via `style={{ color }}`, not `<Icon>`'s own `color` prop —
 * that prop only sets the *root* SVG's `fill` attribute, but every one
 * of these registry entries has its `<path>` declare its own literal
 * `fill="currentColor"`, and an explicit child attribute always wins
 * over whatever the parent's `fill` was set to. `currentColor` doesn't
 * mean "the nearest ancestor's fill" though — it means the CSS `color`
 * property, a completely different property that `fill` doesn't touch,
 * so the `color` prop silently did nothing for every icon here except
 * `php` (whose path has no fill attribute at all, so it actually
 * inherits the root's fill normally). Setting real CSS `color` instead
 * cascades correctly to `fill="currentColor"` regardless of which case
 * an icon falls into.
 */
const BRAND_SOLID_COLORS: Record<string, string> = {
  html5: '#E44D26',
  angularjs: '#DD0031',
  nodejs: '#339933',
  redis: '#DC382D',
  jest: '#C21325',
  mongodb: '#47A248',
  git: '#F05033',
  eslint: '#4B32C3',
  php: '#777BB4',
};

/**
 * Figma and Firebase are the two logos here whose real brand identity is
 * a gradient/multi-colour mark, not a solid — a single `color` prop
 * can't reproduce that. The package also only ships each as one merged
 * silhouette path (no separate per-shape colouring to restore), so
 * these are hand-copied from the same path data with a <linearGradient>
 * added — an approximation of each brand's real gradient, not an exact
 * reproduction of Figma's 5 discrete shape colours or Firebase's 3-tone
 * flame, both of which need shapes this merged path doesn't have.
 */
const FIGMA_GRADIENT_SVG = `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="skillFigmaGradient" x1="24" y1="0" x2="110" y2="129" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#1ABCFE"/><stop offset="0.35" stop-color="#A259FF"/><stop offset="0.7" stop-color="#F24E1E"/><stop offset="1" stop-color="#0ACF83"/>
</linearGradient></defs>
<path fill="url(#skillFigmaGradient)" d="M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5m0-43C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67zm43 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5m0 0"/>
</svg>`;

const FIREBASE_GRADIENT_SVG = `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="skillFirebaseGradient" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#FFCA28"/><stop offset="1" stop-color="#F57C00"/>
</linearGradient></defs>
<path fill="url(#skillFirebaseGradient)" d="M34.872 0a2 2 0 0 0-.307.028A1.93 1.93 0 0 0 32.97 1.64L17.911 98l9.911-18.867 25.066-47.724L36.6 1.028l-.002-.002A1.94 1.94 0 0 0 34.872 0m28.387 18.294c-.722 0-1.38.396-1.716 1.035l-7.459 14.203-.008-.014-34.1 64.922 10.75-10.767 34.46-34.52 11.503-11.524-11.712-22.3a1.94 1.94 0 0 0-1.718-1.035m32.175 8.301a2 2 0 0 0-.52.054 1.94 1.94 0 0 0-.913.514L79.18 42.006 66.623 54.589l-48.994 49.078 41.613 23.337h.002a7.85 7.85 0 0 0 7.653 0l42.532-23.647-12.145-75.153v.008a1.94 1.94 0 0 0-1.324-1.524 2 2 0 0 0-.526-.093m14.938 77.4-.6.049.249.146z"/>
</svg>`;

const GRADIENT_ICONS: Record<string, string> = {
  figma: FIGMA_GRADIENT_SVG,
  firebase: FIREBASE_GRADIENT_SVG,
};

/** Same convention as SvgIcon.tsx/ResumeConnectIcons.tsx: pin an explicit size since this markup is also used standalone in the PDF pipeline, with no ancestor stylesheet to size it via CSS. */
function sizedGradientMarkup(svg: string, size: number): string {
  return svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
}

/**
 * A bare <span dangerouslySetInnerHTML> defaults to `display: inline`,
 * sizing itself off an inherited line-height rather than the icon inside
 * it — taller than the actual glyph, so even though GLYPH_WRAPPER_STYLE
 * centers this span correctly, the visible icon sits high within it
 * (same mechanism, and the same fix, as ResumeConnectIcons.tsx's
 * Portfolio/Mail icons). `inline-flex` gives the span its own sizing
 * context instead, so it wraps its content exactly.
 */
const GRADIENT_ICON_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function SkillGlyph({ skill }: { skill: ResumeSkillEntry }) {
  const iconName = skill.iconName ? stegaClean(skill.iconName) : undefined;
  const gradientSvg = iconName ? GRADIENT_ICONS[iconName] : undefined;
  if (gradientSvg) {
    return <span aria-hidden="true" style={GRADIENT_ICON_STYLE} dangerouslySetInnerHTML={{ __html: sizedGradientMarkup(gradientSvg, SKILL_GLYPH_SIZE) }} />;
  }
  if (iconName) {
    const brandColor = BRAND_SOLID_COLORS[iconName];
    return <Icon name={iconName} size={SKILL_GLYPH_SIZE} style={brandColor ? { color: brandColor } : undefined} />;
  }
  return <SvgIcon src={skill.svg_icon as any} width={SKILL_GLYPH_SIZE} />;
}

/** Reference's `.skill-cat-title`. */
const CATEGORY_LABEL_STYLE: React.CSSProperties = {
  fontSize: '7.5pt',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--r-text-tertiary)',
  margin: '0 0 4.5pt',
};

const GLYPH_WRAPPER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: `${SKILL_GLYPH_SIZE}px`,
};

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
    <section style={{ marginBottom: '10.5pt', breakInside: 'avoid' }}>
  <SectionHeading>Skills</SectionHeading>

  {orderedGroups.map((group) => (
    <div key={group.label} style={{ marginBottom: '9.75pt', breakInside: 'avoid' }}>
      <div style={CATEGORY_LABEL_STYLE}>
        {group.label}
      </div>
      <ul className="resume-chiclet-grid">
        {group.skills.map((skill, i) => (
          <li key={skill._id ?? 'key' + i} className="resume-chiclet">
            <span style={GLYPH_WRAPPER_STYLE}>
              <SkillGlyph skill={skill} />
            </span>
            <span>{localize(skill.name, locale)}</span>
          </li>
        ))}
      </ul>
    </div>
  ))}

  {uncategorized.length > 0 && (
    <div style={{ breakInside: 'avoid' }}>
      <div style={CATEGORY_LABEL_STYLE}>
        Other
      </div>
      <ul className="resume-chiclet-grid">
        {uncategorized.map((skill, i) => (
          <li key={skill._id ?? 'key' + i} className="resume-chiclet">
            <span style={GLYPH_WRAPPER_STYLE}>
              <SkillGlyph skill={skill} />
            </span>
            <span>{localize(skill.name, locale)}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</section>
  )
}