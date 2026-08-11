"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import type { Artifact } from "@/types/artifact";
import { useCoverflow } from "@/hooks/use-coverflow";
import { useCarouselGeometry } from "@/hooks/use-carousel-geometry";
import { NavButton } from "@/components/atoms/nav-button";
import { CoverCard } from "@/components/molecules/cover-card";
import { CarouselIndicators } from "@/components/molecules/carousel-indicators";
import { Project, Section } from "@/sanity.types";
import { LangId } from "@/lib/locale";
import { useViewportKeyboardNav } from "@/hooks/use-keyboard-nav";

export interface CoverflowCarouselProps {
  data: Project[];
  locale:LangId;
  section:Section;
  /** Defaults to the item marked `featured`, else the middle card. */
  initialIndex?: number;
}

/** Drag distance (px) below which a release is treated as a tap, not a peek. */
const CLICK_SUPPRESSION_THRESHOLD = 6;

/**
 * Client-only interactive carousel. The parent page can remain a server
 * component and render this statically at build time (SSG) — nothing
 * here depends on request-time data, only on the `artifacts` prop.
 */
export function ProjectCarousel({ data,locale,section,initialIndex=0 }: CoverflowCarouselProps) {
  const reducedMotion = useReducedMotion();
  const geometry = useCarouselGeometry();
  const featuredIndex = data.findIndex((item) => item.isFeatured);
  const resolvedInitialIndex =
    initialIndex ?? (featuredIndex >= 0 ? featuredIndex : Math.floor(data.length / 2));

  const { activeIndex, springIndex, goTo, goNext, goPrev, canGoPrev, canGoNext, dragHandlers, onKeyDown } =
    useCoverflow({
      count: data.length,
      initialIndex: resolvedInitialIndex,
      reducedMotion: Boolean(reducedMotion),
    });

  // Which card (if any) is flipped open into its detail face. Lives here
  // rather than in CoverCard so navigating away always closes it.
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const draggedPastThresholdRef = useRef(false);

  useEffect(() => {
    setFlippedIndex(null);
  }, [activeIndex]);

  // A hold-and-drag (the "peek" effect) shouldn't also fire a click when
  // released, so track whether this pointer-down travelled far enough to
  // count as a drag before deciding what a click on a card should do.
  const handleDragStart = useCallback(
    (...args: Parameters<typeof dragHandlers.onDragStart>) => {
      draggedPastThresholdRef.current = false;
      dragHandlers.onDragStart(...args);
    },
    [dragHandlers],
  );

  const handleDrag = useCallback(
    (event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) > CLICK_SUPPRESSION_THRESHOLD) {
        draggedPastThresholdRef.current = true;
      }
      dragHandlers.onDrag(event, info);
    },
    [dragHandlers],
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (draggedPastThresholdRef.current) return;
      if (flippedIndex === index) {
        setFlippedIndex(null);
        return;
      }
      if (index === activeIndex) {
        setFlippedIndex(index);
        return;
      }
      goTo(index);
    },
    [activeIndex, flippedIndex, goTo],
  );

  const handleCloseFlip = useCallback((index: number) => {
    setFlippedIndex((current) => (current === index ? null : current));
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && flippedIndex !== null) {
        event.preventDefault();
        setFlippedIndex(null);
        return;
      }
      onKeyDown(event);
    },
    [flippedIndex, onKeyDown],
  );

  const handleDragEnd = useCallback(
  (...args: Parameters<typeof dragHandlers.onDragEnd>) => {
    dragHandlers.onDragEnd(...args);
    // Deferred, not synchronous: the browser's trailing click event from
    // this same drag gesture still needs to see the flag as `true` so
    // handleCardClick correctly suppresses it. Clearing on the next tick
    // (after that click has already been processed) is what lets the
    // *next*, unrelated click go through instead of staying stuck.
    window.setTimeout(() => {
      draggedPastThresholdRef.current = false;
    }, 0);
  },
  [dragHandlers],
);

  const active = data[activeIndex];
 const viewportRef = useViewportKeyboardNav<HTMLDivElement>(handleKeyDown as any);
  return (
    <div
      className="flex z-20 w-full flex-col items-center"
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects Section"
      ref={viewportRef}
    >
      <div
        tabIndex={0}
        //onKeyDown={handleKeyDown}
        style={{ height: geometry.containerHeight }}
        className="relative w-full select-none outline-none transition-[height] duration-300 [perspective:2000px] focus:outline-none"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          dragMomentum={false}
          {...dragHandlers}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="relative flex h-full w-full cursor-grab select-none items-center justify-center outline-none [transform-style:preserve-3d] focus:outline-none active:cursor-grabbing"
        >
          {data.map((project, index) => (
            <CoverCard
              key={String(project._id) + index}
              project={project}
              locale={locale}
              index={index}
              springIndex={springIndex}
              geometry={geometry}
              isFlipped={flippedIndex === index}
              onClick={handleCardClick}
              onClose={handleCloseFlip}
            />
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-margin-mobile md:px-margin-desktop">
          <div className="pointer-events-auto">
            <NavButton direction="prev" onClick={goPrev} disabled={!canGoPrev} label="Previous artifact">
              <span className="connect-icon"><svg
  className="connect-icon"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24"
  height="24"
  fill="currentColor"
  aria-hidden="true"
>
  <g transform="translate(24,0) scale(-1,1)">
    <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
  </g>
</svg></span>
            </NavButton>
          </div>
          <div className="pointer-events-auto">
            <NavButton direction="next" onClick={goNext} disabled={!canGoNext} label="Next artifact">
              <span className="material-symbols-outlined"><svg
  className="connect-icon"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24"
  height="24"
  fill="#fff"
  aria-hidden="true"
>
  <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
</svg></span>
            </NavButton>
          </div>
        </div>
      </div>

      {/* Live region for assistive tech, since position changes via drag/flick as well as buttons */}
      <p aria-live="polite" className="sr-only">
        {active
          ? flippedIndex !== null
            ? `${active.title} detail expanded`
            : `${active.title} of ${data.length}`
          : ""}
      </p>

      <CarouselIndicators count={data.length} springIndex={springIndex} onSelect={goTo} />

      {/* <p className="mt-6 max-w-sm px-margin-mobile text-center font-label-caps text-[10px] text-outline">
        FLICK OR USE ARROW KEYS TO BROWSE — CLICK CENTER CARD TO FLIP FOR FULL SPEC
      </p> */}
    </div>
  );
}
