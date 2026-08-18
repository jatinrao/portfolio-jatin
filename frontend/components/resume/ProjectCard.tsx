// components/resume/ProjectMiniCard.tsx
import Image from 'next/image';
import { localize, type LangId } from '@/lib/locale';
import { Project } from '@/sanity.types';


interface ProjectMiniCardProps {
  project: Project;
  locale: LangId;
}

function formatProjectDateRange(startDate?: string, endDate?: string) {
  if (!startDate) return null;
  const fmt = (iso: string) => new Date(iso).getFullYear();
  return endDate ? `${fmt(startDate)} — ${fmt(endDate)}` : `${fmt(startDate)}`;
}

/**
 * Static counterpart to CoverCard's front face — same data stitching
 * (title/description localized, coverImage via asset.url with a plain
 * non-localized alt, `body` deliberately skipped since this tray has no
 * room for full rich text), just laid out for a narrow vertical stack
 * instead of a large flip-able tile. No motion/hooks: this never needs
 * to be more than server-rendered markup.
 */
export function ProjectMiniCard({ project, locale }: ProjectMiniCardProps) {
  const title = localize(project.title, locale);
  const description = localize(project.description, locale);
//   const description = localize(project.description, locale);
  // Sanity's asset reference type may not expose `url` in the type defs
  // so cast to any to safely read the runtime `url` if present.
//   const imageUrl = (project.coverImage?.asset as any)?.url;
//   const dateRange = formatProjectDateRange(project.startDate, project.endDate);

  return (
    <article
    style={{
    display: 'flex',
    flexDirection: 'column',
    // gap: '1mm',
    // marginTop:"2mm"
    // border: '1px solid #1a1a1a', // border-heading-ink
    // backgroundColor: '#ffffff',
    // padding: '12px',
    // boxShadow: '3px -3px 0px 0px #c9a84c',
    // transitionProperty: 'all',
    // transitionDuration: '200ms',
    // marginTop:"12mm"
  }}
>
  {/* Row 1: title */}
  <div style={{ display: 'flex', }}>
    <p
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',fontSize: '10.5pt', fontWeight: 700, color: 'var(--color-heading-ink)',
        // fontFamily: 'var(--font-headline-lg)',
        // fontSize: '13px',
        // textTransform: 'uppercase',
        // lineHeight: 1.1, // tight-heading
      }}
    >
      {title}
    </p>
  </div>

  {/* Row 2: image + description */}
  {/* <div style={{ display: 'flex', alignItems: 'center'}}>
    {imageUrl && (
      <div
        style={{
          position: 'relative',
          height: '96px',
          width: '100%',
          flexShrink: 0,
          overflow: 'hidden',
          border: '1px solid #1a1a1a',
        }}
      >
        <img
          src={imageUrl}
          alt={localize(project.coverImage?.alt,locale) ?? title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // filter: 'grayscale(1)',
            transitionProperty: 'all',
            transitionDuration: '200ms',
          }}
          sizes="56px"
        />
      </div>
    )}

    <div style={{ minWidth: 0, flex: 1 }}>
      {dateRange && (
        <p
          style={{
            marginTop: '2px',
            fontFamily: 'var(--font-label-caps)',
            fontSize: '9px',
            color: 'var(--color-primary, #2d5a3d)',
          }}
        >
          {dateRange}
        </p>
      )}

      
    </div>
    </div> */}
    <div >
        {description && (
        <p
          style={{
            marginTop: '-2mm',
            // display: '-webkit-box',
            // WebkitLineClamp: 2,
            // WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            // fontFamily: 'var(--font-body-md)',
            fontSize: '10pt',
            // lineHeight: 1.375, // leading-snug
            // color: 'var(--color-on-surface-variant, #6b7280)',
          }}
        >
          {description}
        </p>
      )}

    </div>
</article>
  );
}