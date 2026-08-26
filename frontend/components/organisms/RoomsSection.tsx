'use client';

import { useRef, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useRoomWipe } from '@/hooks/use-room-wipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { RoomPlaybackProvider, useRoomPlayback } from '@/context/room-playback-context';
import { RoomsChromeProvider } from '@/context/rooms-chrome-context';
import './rooms-tv.css';
import './projects-section.css';

// Same breakpoint the pinned TV layout switches off at (rooms-tv.css).
const ROOMS_MOBILE_QUERY = '(max-width: 734px), (max-width: 1024px) and (orientation: portrait)';

// ssr:false keeps the whole three.js/R3F stack out of the server-rendered
// HTML and the first-paint JS chunk — only fetched once a room's eyebrow
// actually mounts one of these (see RoomCopy's showIcon gate below).
const RoomIconSkills = dynamic(() => import('./RoomIconSkills'), { ssr: false });
const RoomIconExperience = dynamic(() => import('./RoomIconExperience'), { ssr: false });
const RoomIconProjects = dynamic(() => import('./RoomIconProjects'), { ssr: false });

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface RoomDef {
  id: string;
  /** Matches header nav's anchorId (Sanity sectionId.current) — set as this room's DOM id so `#anchorId` links actually scroll here. */
  anchorId?: string;
  kind?: string;
  heading?: string;
  subheading?: string;
  isProject?: boolean;
  colorVar: string;
  screenColorVar: string;
  scrollSteps?: number;
  content: ReactNode;
}

interface RoomsSectionProps {
  rooms: RoomDef[];
}

function TvScreens({ rooms }: { rooms: RoomDef[] }) {
  return (
    <div className="rooms-tv">
      <div className="rooms-tv-bezel" aria-hidden="true" />
      <div className="tv-screen-stack">
        {rooms.map((room, index) => (
          <div
            key={room.id}
            className={`tv-screen${index === 0 ? ' is-base' : ''}`}
            data-room={room.id}
            style={{ zIndex: index + 1 }}
          >
            <div
              className="tv-screen-panel"
              data-kind={room.kind}
              style={{ backgroundColor: `var(${room.screenColorVar})` }}
            >
              {room.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomCopy({ room, isMobile }: { room: RoomDef; isMobile: boolean }) {
  // Mounting is gated on this room being the active one (via
  // RoomPlaybackProvider, driven by hooks/use-room-wipe.ts) — but that
  // alone isn't a reliable mobile gate: useRoomWipe's very first `apply()`
  // call runs synchronously on mount and sets `activeKind` to whichever
  // room is active at scrollY 0 (skills) *before* useIsMobile's own
  // mount-effect has corrected `isMobile` to true, and nothing ever resets
  // `playback` back to a blank state once RoomsSection settles into
  // RoomsMobileFlow — so `activeKind` stays permanently stuck at that
  // stale value on mobile instead of going back to undefined. `isMobile`
  // (passed down from RoomsSection's own already-corrected value, not a
  // second independent useIsMobile() instance in here) is the actual gate.
  const { activeKind } = useRoomPlayback();
  // const showIcon = activeKind === room.kind && !prefersReducedMotion();

  return (
    <div className="rooms-copy">
      <div className="rooms-copy-inner">
        <div className="rooms-copy-eyebrow" data-kind={room.kind} aria-hidden="true">
          {true && (
            <div className="rooms-copy-eyebrow-icon">
              {room.kind === 'skills' && <RoomIconSkills />}
              {room.kind === 'experience' && <RoomIconExperience />}
              {room.kind === 'projects' && <RoomIconProjects />}
            </div>
          )}
        </div>
        {(room.heading || room.subheading) && (
          <div className="rooms-copy-body">
            {room.heading && <h2 className="rooms-copy-heading">{room.heading}</h2>}
            {room.subheading && <p className="rooms-copy-subheading">{room.subheading}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile: plain stacked flow, no pinned frame and no scroll-jack wipe —
// each room's copy sits directly above its own content, in document order.
function RoomsMobileFlow({ rooms }: { rooms: RoomDef[] }) {
  return (
    <div className="rooms-mobile-flow">
      {rooms.map((room) => (
        <section
          key={room.id}
          id={room.anchorId}
          className="rooms-mobile-room"
          data-room-kind={room.kind}
          style={{ backgroundColor: `var(${room.colorVar})` }}
        >
          <RoomCopy room={room} isMobile />
          <div className="rooms-mobile-screen" data-kind={room.kind}>
            {room.content}
          </div>
        </section>
      ))}
    </div>
  );
}

export function RoomsSection({ rooms }: RoomsSectionProps) {
  const galleryRef = useRef<HTMLElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(ROOMS_MOBILE_QUERY);
  const { playback, activeIndex } = useRoomWipe(galleryRef, undefined, isMobile);
  const activeKind = rooms[activeIndex]?.kind ?? playback.activeKind;

  if (rooms.length === 0) return null;

  return (
    <RoomPlaybackProvider value={playback}>
      <RoomsChromeProvider value={{ deskRef }}>
        {isMobile ? (
          <RoomsMobileFlow rooms={rooms} />
        ) : (
          <section
            ref={galleryRef}
            className="rooms-gallery"
            data-active-kind={activeKind}
          >
            <div className="rooms-device">
              <div className="rooms-device-column">
                <TvScreens rooms={rooms} />
              </div>
            </div>
            <div className="rooms-track">
              {rooms.map((room) => (
                <article
                  key={room.id}
                  id={room.anchorId}
                  data-room-copy
                  data-room-kind={room.kind}
                  data-scroll-steps={room.scrollSteps ?? 1}
                  className="rooms-page"
                  style={{
                    backgroundColor: `var(${room.colorVar})`,
                    minHeight: `${Math.max(1, room.scrollSteps ?? 1) * 100}vh`,
                  }}
                >
                  <div className="rooms-page-glass" aria-hidden="true" />
                  <RoomCopy room={room} isMobile={false} />
                </article>
              ))}
            </div>
          </section>
        )}
      </RoomsChromeProvider>
    </RoomPlaybackProvider>
  );
}
