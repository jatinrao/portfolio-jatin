'use client';

import { useRef, type ReactNode } from 'react';
import { useRoomWipe } from '@/hooks/use-room-wipe';
import { useIsMobile } from '@/hooks/use-mobile';
import { RoomPlaybackProvider } from '@/context/room-playback-context';
import { RoomsChromeProvider } from '@/context/rooms-chrome-context';
import './rooms-tv.css';
import './projects-section.css';

// Same breakpoint the pinned TV layout switches off at (rooms-tv.css).
const ROOMS_MOBILE_QUERY = '(max-width: 734px), (max-width: 1024px) and (orientation: portrait)';

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

function RoomCopy({ room }: { room: RoomDef }) {
  return (
    <div className="rooms-copy">
      <div className="rooms-copy-inner">
        <span className="rooms-copy-eyebrow" data-kind={room.kind} aria-hidden="true" />
        {(room.heading || room.subheading) && (
          <p className="rooms-copy-body">
            {room.heading && (
              <>
                <strong className="rooms-copy-heading">{room.heading}</strong>
                {room.subheading ? ' ' : null}
              </>
            )}
            {room.subheading}
          </p>
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
          <RoomCopy room={room} />
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
                  <RoomCopy room={room} />
                </article>
              ))}
            </div>
          </section>
        )}
      </RoomsChromeProvider>
    </RoomPlaybackProvider>
  );
}
