"use client";

import Image from "next/image";
import { Icon } from "@web-portfolio/icons";
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";
import type { CarouselGeometry } from "@/hooks/use-carousel-geometry";
import { Project } from "@/sanity.types";
import { LangId, localize } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/utils";
import { formatProjectDateRange } from "@/lib/format-date-range";
// import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

export interface CoverCardProps {
  project: Project;
  locale: LangId;
  index: number;
  springIndex: MotionValue<number>;
  geometry: CarouselGeometry;
  onClick: (index: number) => void;
  /** CMS-driven "Learn More" button text — falls back to the English default when unset. */
  learnMoreLabel?: string;
  /**
   * True only for the card rendered as the carousel's initial/active slide.
   * `project.isFeatured` is a CMS content flag that can be true on several
   * projects at once — using it here would mark every featured card's
   * (offscreen) cover image `priority`, preloading images that compete
   * with the actual hero LCP image for bandwidth on first load.
   */
  isInitial?: boolean;
  /**
   * Only the active (centered, full-opacity) slide is meant to be reachable
   * by assistive tech — the rest are dimmed 3D "peek" previews a sighted
   * user can click to bring to front, and their text is dimmed by `opacity`
   * below WCAG contrast at any distance > 0. `aria-hidden` pulls them out of
   * the accessibility tree (the carousel's `aria-live` region already
   * announces the active card), and `inert` goes with it so their nested
   * links can't still be tabbed to while hidden from screen readers.
   */
  isActive: boolean;
}

const RESIZE_TRANSITION = { duration: 0.3, ease: "easeOut" } as const;

export function CoverCard({
  project,
  locale,
  index,
  springIndex,
  geometry,
  onClick,
  learnMoreLabel,
  isInitial = false,
  isActive,
}: CoverCardProps) {
  const { cardWidth, cardHeight, xOffsets, zDepths } = geometry;

  const signedDistance = useTransform(springIndex, (value) => index - value);
  const absDistance = useTransform(signedDistance, (value) => Math.abs(value));

  const x = useTransform(signedDistance, [-2, -1, 0, 1, 2], xOffsets);
  const rotateY = useTransform(signedDistance, [-2, -1, 0, 1, 2], [48, 30, 0, -30, -48], {
    clamp: true,
  });
  const z = useTransform(absDistance, [0, 1, 2], zDepths, { clamp: true });
  const distanceScale = useTransform(absDistance, [0, 1, 2], [1, 0.92, 0.82], { clamp: true });
  const opacity = useTransform(absDistance, [0, 1, 2, 3], [1, 0.85, 0.4, 0], { clamp: true });
  const zIndex = useTransform(absDistance, (value) => Math.round(50 - value * 15));
  const pointerEvents = useTransform(absDistance, (value) => (value > 2.4 ? "none" : "auto"));
  // The repo/live-project icon links are a fixed 32px box, but the 3D
  // coverflow's own scale+rotateY+perspective (not just `distanceScale`
  // above) shrinks off-center cards well below that — down to ~19px on
  // mobile, under the 24px min tap-target size. Off-center cards are
  // previews you bring to front by tapping the card itself (`onClick`
  // below), not places to hit a micro icon, so only the near-active card
  // exposes these as real tap targets.
  const iconPointerEvents = useTransform(absDistance, (value) => (value < 0.5 ? "auto" : "none"));
  const filter = useTransform(absDistance, (value) =>
    value > 0.4 ? "grayscale(1) contrast(1.15)" : "grayscale(0) contrast(1)",
  );

  const positionTransform = useMotionTemplate`translate3d(calc(-50% + ${x}px), -50%, ${z}px) rotateY(${rotateY}deg) scale(${distanceScale})`;

  const isFeatured = Boolean(project.isFeatured);

  const coverImageUrl = project.coverImage ? urlForImage(project.coverImage)?.url() : undefined;
  const title = localize(project.title, locale);
  const description = localize(project.description, locale);
  const dateRange = formatProjectDateRange(project.startDate, project.endDate);
  const slug = project.slug?.current;

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={title}
      aria-hidden={!isActive}
      inert={!isActive}
      onClick={() => onClick(index)}
      style={{
        transform: positionTransform,
        opacity,
        zIndex,
        pointerEvents,
      }}
      animate={{ width: cardWidth, height: cardHeight }}
      transition={RESIZE_TRANSITION}
      className="absolute left-1/2 top-1/2 cursor-pointer"
    >
      <div
        className="cover-card-face rooms-material relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-card)] border"
      >
        <motion.div
          style={{ filter }}
          className="cover-card-media relative h-[67.5%] w-full overflow-hidden border-b-[0.5px] border-heading-ink"
        >
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt={localize(project.coverImage?.alt, locale) ?? title}
              fill
              sizes="(max-width: 560px) 210px, (max-width: 900px) 300px, 380px"
              className="object-cover"
              priority={isInitial}
            />
          )}

          {/* Self-contained glass pill (not the shared LiquidGlass/GlassToolbar
              atoms — scoped to this card only) keeps the repo/live-project
              icons legible over any cover image, without a flat scrim
              dimming the artwork underneath. */}
          <motion.div
            style={{ pointerEvents: iconPointerEvents }}
            className="absolute bottom-2 right-2 z-10"
          >
            <div
              role="toolbar"
              aria-label={`Links for ${title}`}
              className="flex items-center gap-0.5 rounded-full p-1"
              style={{
                background: "var(--glass-fill)",
                border: "0.5px solid var(--glass-hairline)",
                boxShadow: "var(--glass-shadow)",
                backdropFilter: "blur(20px) saturate(1.8)",
                WebkitBackdropFilter: "blur(20px) saturate(1.8)",
              }}
            >
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`View repository for ${title}`}
                  className="flex h-8 w-8 items-center justify-center text-primary transition-opacity hover:opacity-80"
                >
                  <Icon name="git" size={18} />
                </a>
              )}
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`View live project: ${title}`}
                  className="flex h-8 w-8 items-center justify-center text-primary transition-opacity hover:opacity-80"
                >
                  <Icon name="open_in_new" size={18} />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
        <div className="flex flex-1 flex-col justify-between p-4 md:p-6">
          <div>
            {/* {isFeatured && (
              <div className="mb-1 flex items-start justify-between">
                <p className="cover-card-date font-label-caps text-label-sm text-primary">{dateRange}</p>
                <Badge className="cover-card-featured rounded-full border-none px-2 py-0.5">
                  Featured
                </Badge>
              </div>
            )} */}
            {dateRange && (
              <p className="cover-card-date mb-1 font-label-caps text-label-sm text-primary">{dateRange}</p>
            )}
            <h3
              className={[
                "cover-card-title font-headline-lg tight-heading uppercase",
                isFeatured ? "text-lg md:text-xl" : "text-base md:text-lg",
              ].join(" ")}
            >
              {title}
            </h3>
            {description && (
              <p className="cover-card-body mt-1 line-clamp-2 font-body-md text-body-sm leading-snug text-on-surface-variant">
                {description}
              </p>
            )}
          </div>

          {slug && (
            <div className="mt-3" onClick={(event) => event.stopPropagation()}>
              <Button
                variant="primary"
                href={`/${locale}/projects/${slug}`}
                className="!mx-0 !my-0 self-start !translate-y-0"
              >
                {learnMoreLabel || "Learn More"}
                {/* aria-label alone doesn't help here: search-engine crawlers
                    and Lighthouse's "descriptive link text" SEO audit read
                    the link's rendered text content, not its accessible
                    name — so the project title has to be part of the DOM
                    text too, just visually hidden. */}
                <span className="sr-only"> about {title}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}