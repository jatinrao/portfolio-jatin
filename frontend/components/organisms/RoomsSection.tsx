'use client';

import { useRef, type ReactNode } from 'react';
import { useRoomWipe } from '@/hooks/use-room-wipe';
import { RoomPlaybackProvider } from '@/context/room-playback-context';
import { RoomsChromeProvider } from '@/context/rooms-chrome-context';
import './rooms-tv.css';
import './projects-section.css';

export interface RoomDef {
  id: string;
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

export function RoomsSection({ rooms }: RoomsSectionProps) {
  const galleryRef = useRef<HTMLElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const { playback, activeIndex } = useRoomWipe(galleryRef);
  const activeKind = rooms[activeIndex]?.kind ?? playback.activeKind;
  const projectsRoom = rooms.find((room) => room.kind === 'projects');
  console.log(projectsRoom, 'projectsRoom');
  if (rooms.length === 0) return null;

  return (
    <RoomPlaybackProvider value={playback}>
      <RoomsChromeProvider value={{ deskRef }}>
        <section
          ref={galleryRef}
          className="rooms-gallery"
          data-active-kind={activeKind}
        >
          <div className="rooms-device">
            <div className="rooms-device-column">
              <TvScreens rooms={rooms} />
              
              {/* {projectsRoom && rooms[activeIndex].isProject && (projectsRoom.heading || projectsRoom.subheading) ? (<>
                <div className="rooms-desk" ref={deskRef} />
                <div className="rooms-below">
                  <div className="projects-below">
                    {projectsRoom.heading ? (
                      <h3 className="projects-headline">{projectsRoom.heading}</h3>
                    ) : null}
                    {projectsRoom.subheading ? (
                      <p className="projects-intro">{projectsRoom.subheading}</p>
                    ) : null}
                  </div>
                </div>
                </>
              ) : null} */}
            </div>
          </div>
          <div className="rooms-track">
            {rooms.map((room) => (
              <article
                key={room.id}
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
                
              </article>
            ))}
          </div>
        </section>
      </RoomsChromeProvider>
    </RoomPlaybackProvider>
  );
}
