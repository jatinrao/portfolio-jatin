"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  animate,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { CarouselGeometry } from "@/hooks/use-carousel-geometry";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Project } from "@/sanity.types";
import { LangId, localize } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/utils";
import type { CustomImage } from "@/sanity.types";
import { PortableText } from "next-sanity";

export interface CoverCardProps {
  project: Project;
  locale: LangId;
  index: number;
  springIndex: MotionValue<number>;
  geometry: CarouselGeometry;
  isFlipped: boolean;
  onClick: (index: number) => void;
  onClose: (index: number) => void;
}

const FLIP_SCALE_BUMP = 1.15;
const FLIP_DURATION = 0.5;
const FLIP_EASE = [0.22, 1, 0.36, 1] as const;
const RESIZE_TRANSITION = { duration: 0.3, ease: "easeOut" } as const;

const backfacePortableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-2 font-body-md text-[12px] leading-snug text-on-surface-variant md:text-[13px]">
        {children}
      </p>
    ),
  },
};

function formatProjectDateRange(startDate?: string, endDate?: string) {
  if (!startDate) return null;
  const fmt = (iso: string) => new Date(iso).getFullYear();
  return endDate ? `${fmt(startDate)} — ${fmt(endDate)}` : `${fmt(startDate)}`;
}

export function CoverCard({
  project,
  locale,
  index,
  springIndex,
  geometry,
  isFlipped,
  onClick,
  onClose,
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
  const filter = useTransform(absDistance, (value) =>
    value > 0.4 ? "grayscale(1) contrast(1.15)" : "grayscale(0) contrast(1)",
  );
  const shadow = useTransform(absDistance, (value) =>
    value < 0.4 ? "12px 12px 0px 0px #3b684a" : "8px 8px 0px 0px #755b00",
  );
  const borderColor = useTransform(absDistance, (value) => (value < 0.4 ? "#755b00" : "#1a1a1a"));

  const flipScale = useMotionValue(1);
  const flipRotate = useMotionValue(0);
  useEffect(() => {
    const scaleControls = animate(flipScale, isFlipped ? FLIP_SCALE_BUMP : 1, {
      duration: FLIP_DURATION,
      ease: FLIP_EASE,
    });
    const rotateControls = animate(flipRotate, isFlipped ? 180 : 0, {
      duration: FLIP_DURATION,
      ease: FLIP_EASE,
    });
    return () => {
      scaleControls.stop();
      rotateControls.stop();
    };
  }, [isFlipped, flipScale, flipRotate]);

  const combinedScale = useTransform([distanceScale, flipScale], (values: number[]) => {
    const [base, flip] = values;
    return base * flip;
  });
  const combinedRotateY = useTransform([rotateY, flipRotate], (values: number[]) => {
    const [base, flip] = values;
    return base + flip;
  });
  const positionTransform = useMotionTemplate`translate3d(${x}px, 0, ${z}px) rotateY(${combinedRotateY}deg) scale(${combinedScale})`;

  const isFeatured = Boolean(project.isFeatured);

  

  // Gallery falls back to the single cover image if no gallery was set in
  // Studio, so the back face never renders with zero images.
  const backfaceImages: CustomImage[] =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : project.coverImage
        ? [project.coverImage]
        : [];

  // Local to this card, reset whenever the card is re-flipped closed so the
  // next time it's opened it starts from the first image again.
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useEffect(() => {
    if (!isFlipped) setActiveImageIndex(0);
  }, [isFlipped]);

  const activeImage = backfaceImages[activeImageIndex];
  const coverImageUrl = project.coverImage ? urlForImage(project.coverImage)?.url() : undefined;
  const activeImageUrl = activeImage ? urlForImage(activeImage)?.url() : undefined;
  const title = localize(project.title, locale);
  const description = localize(project.description, locale);
  const dateRange = formatProjectDateRange(project.startDate, project.endDate);

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={title}
      aria-expanded={isFlipped}
      onClick={() => onClick(index)}
      style={{
        transform: positionTransform,
        opacity,
        zIndex: isFlipped ? 100 : zIndex,
        pointerEvents,
      }}
      animate={{ width: cardWidth, height: cardHeight }}
      transition={RESIZE_TRANSITION}
      className="absolute cursor-pointer [transform-style:preserve-3d]"
    >
      <div className="relative h-full w-full [transform-style:preserve-3d]">
        {/* Front face */}
        <motion.div
          style={{ backfaceVisibility: "hidden", boxShadow: shadow, borderColor }}
          className="absolute inset-0 flex flex-col border-2 bg-white"
          aria-hidden={isFlipped ? "true" : "false"}
        >
          <motion.div
            style={{ filter }}
            className="relative h-3/4 w-full overflow-hidden border-b-2 border-heading-ink"
          >
            <Image
              src={coverImageUrl ?? ""}
              alt={localize(project.coverImage?.alt,locale) ?? title}
              fill
              sizes="(max-width: 560px) 210px, (max-width: 900px) 300px, 380px"
              className="object-cover"
              priority={isFeatured}
            />
          </motion.div>
          <div className="flex flex-1 flex-col justify-between bg-white p-4 md:p-6">
            <div>
              {isFeatured && (
                <div className="mb-1 flex items-start justify-between">
                  <p className="font-label-caps text-[10px] text-primary">{dateRange}</p>
                  <span className="border border-heading-ink bg-primary-container px-2 py-0.5 font-label-caps text-[8px] text-on-primary-container">
                    Featured
                  </span>
                </div>
              )}
              {!isFeatured && dateRange && (
                <p className="mb-1 font-label-caps text-[10px] text-primary">{dateRange}</p>
              )}
              <h3
                className={[
                  "font-headline-lg tight-heading uppercase",
                  isFeatured ? "text-lg md:text-xl" : "text-base md:text-lg",
                ].join(" ")}
              >
                {title}
              </h3>
              {description && (
                <p className="mt-1 line-clamp-2 font-body-md text-[12px] leading-snug text-on-surface-variant">
                  {description}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Back face */}
        <motion.div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: shadow,
            borderColor,
          }}
          className="absolute inset-0 flex flex-col overflow-hidden border-2 bg-white"
          aria-hidden={isFlipped ? "false" : "true"}
          inert={!isFlipped ? true : undefined}
        >
          <div className="relative h-1/3 w-full shrink-0 overflow-hidden border-b-2 border-heading-ink">
            {activeImage && (
              <Image
                src={activeImageUrl ?? ""}
                alt={localize(activeImage.alt,locale) ?? title}
                fill
                sizes="(max-width: 560px) 210px, (max-width: 900px) 300px, 380px"
                className="object-cover"
              />
            )}

            {backfaceImages.length > 1 && (
              <div
                role="tablist"
                aria-label="Gallery images"
                className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5"
              >
                {backfaceImages.map((image, imageIndex) => (
                  <button
                    key={imageIndex}
                    type="button"
                    role="tab"
                    aria-selected={imageIndex === activeImageIndex}
                    aria-label={`Show image ${imageIndex + 1} of ${backfaceImages.length}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveImageIndex(imageIndex);
                    }}
                    className={[
                      "h-2 w-2 rounded-full border border-white transition-all",
                      imageIndex === activeImageIndex ? "w-4 bg-white" : "bg-white/50",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4 md:p-5">
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-headline-lg text-sm uppercase tight-heading md:text-base">{title}</h3>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClose(index);
                  }}
                  aria-label="Close detail"
                  className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-heading-ink bg-white"
                >
                  <span className="material-symbols-outlined text-[14px]"><svg className="w-full h-auto" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></span>
                </button>
              </div>

              {project.body && project.body[locale] && (
                <PortableText value={project.body[locale]!} components={backfacePortableTextComponents} />
              )}

              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-outline-variant pt-2">
                {dateRange && (
                  <div>
                    <dt className="font-label-caps text-[8px] text-muted-body">Timeline</dt>
                    <dd className="font-label-caps text-[10px] text-heading-ink">{dateRange}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t-2 border-heading-ink pt-2">
              {/* {project.repositoryUrl && (
                
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="font-label-caps text-[10px] text-primary underline"
                >
                  Code
                </a>
              )} */}
              {/* {project.projectUrl && (
                
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="font-label-caps text-[10px] text-primary underline"
                >
                  Live Demo
                </a>
              )} */}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}