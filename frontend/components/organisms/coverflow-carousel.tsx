"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { KeyboardEvent } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { Icon } from "@web-portfolio/icons";
import { useCoverflow } from "@/hooks/use-coverflow";
import { useCarouselGeometry } from "@/hooks/use-carousel-geometry";
import { NavButton } from "@/components/atoms/nav-button";
import { CoverCard } from "@/components/molecules/cover-card";
import { CarouselIndicators } from "@/components/molecules/carousel-indicators";
import { Project, Section } from "@/sanity.types";
import { LangId, localize } from "@/lib/locale";
import { useViewportKeyboardNav } from "@/hooks/use-keyboard-nav";
import { useRoomsChrome } from "@/context/rooms-chrome-context";
import { useRoomPlayback } from "@/context/room-playback-context";
import "./projects-section.css";

export interface CoverflowCarouselProps {
  data: Project[];
  locale: LangId;
  section: Section;
  initialIndex?: number;
}

const CLICK_SUPPRESSION_THRESHOLD = 6;

export function ProjectCarousel({
  data,
  locale,
  section,
  initialIndex,
}: CoverflowCarouselProps) {
  const reducedMotion = useReducedMotion();
  const geometry = useCarouselGeometry();
  const chrome = useRoomsChrome();
  const featuredIndex = data.findIndex((item) => item.isFeatured);
  const resolvedInitialIndex =
    initialIndex ?? (featuredIndex >= 0 ? featuredIndex : Math.floor(data.length / 2));

  const { activeIndex, springIndex, goTo, goNext, goPrev, canGoPrev, canGoNext, dragHandlers, onKeyDown } =
    useCoverflow({
      count: data.length,
      initialIndex: resolvedInitialIndex,
      reducedMotion: Boolean(reducedMotion),
    });

  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const draggedPastThresholdRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setFlippedIndex(null);
  }, [activeIndex]);

  // Rooms with a scroll-jack budget (renderSection.tsx) page this carousel
  // as the user scrolls through the room, same as skills/experience. Anchored
  // at resolvedInitialIndex — not 0 — and only ever moves forward from
  // there, so arriving at the room via scroll (progress starts at 0) never
  // yanks the carousel away from the featured card it's already showing;
  // scroll only carries it onward toward the last card. Backward navigation
  // stays available via buttons/drag/keyboard regardless.
  const playback = useRoomPlayback();
  const lastProjectsStepRef = useRef(resolvedInitialIndex);

  useEffect(() => {
    if (data.length <= 1) return;
    const progress = playback.projectsProgress ?? 0;
    const span = data.length - 1 - resolvedInitialIndex;
    const index = span > 0 ? Math.round(resolvedInitialIndex + progress * span) : resolvedInitialIndex;
    if (lastProjectsStepRef.current === index) return;
    lastProjectsStepRef.current = index;
    goTo(index);
  }, [playback.projectsProgress, data.length, resolvedInitialIndex, goTo]);

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
      window.setTimeout(() => {
        draggedPastThresholdRef.current = false;
      }, 0);
    },
    [dragHandlers],
  );

  const active = data[activeIndex];
  const viewportRef = useViewportKeyboardNav<HTMLDivElement>(handleKeyDown as never);
  const regionLabel = localize(section.heading, locale) || "Projects Section";

  const desk = data.length > 0 ? (
    <div className="projects-desk-controls">
      <NavButton direction="prev" onClick={goPrev} disabled={!canGoPrev} label="Previous">
        <Icon name="arrow_back" size={24} />
      </NavButton>
      <CarouselIndicators count={data.length} springIndex={springIndex} onSelect={goTo} />
      <NavButton direction="next" onClick={goNext} disabled={!canGoNext} label="Next">
        <Icon name="arrow_forward" size={24} />
      </NavButton>
    </div>
  ) : null;

  const deskTarget = mounted ? chrome?.deskRef.current : null;

  return (
    <div
      className="projects-section relative z-20 flex h-full w-full min-h-0 items-center justify-center"
      role="region"
      aria-roledescription="carousel"
      aria-label={regionLabel}
      ref={viewportRef}
    >
      <div
        tabIndex={0}
        className="absolute inset-0 select-none outline-none [perspective:2000px] focus:outline-none"
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
      </div>

      <p aria-live="polite" className="sr-only">
        {active
          ? flippedIndex !== null
            ? `${localize(active.title, locale)} detail expanded`
            : `${localize(active.title, locale)} of ${data.length}`
          : ""}
      </p>

      {deskTarget && desk ? createPortal(desk, deskTarget) : desk}
    </div>
  );
}
