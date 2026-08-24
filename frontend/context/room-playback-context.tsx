'use client';

import { createContext, useContext } from 'react';

export interface RoomPlayback {
  skillsProgress: number;
  experienceProgress: number;
  /** 0-1 scroll progress through the Projects room's own hijack budget — drives ProjectCarousel's goTo paging. */
  projectsProgress?: number;
  activeKind?: string;
}

const DEFAULT_PLAYBACK: RoomPlayback = {
  skillsProgress: 0,
  experienceProgress: 0,
  projectsProgress: 0,
};

const RoomPlaybackContext = createContext<RoomPlayback>(DEFAULT_PLAYBACK);

export function RoomPlaybackProvider({
  value,
  children,
}: {
  value: RoomPlayback;
  children: React.ReactNode;
}) {
  return <RoomPlaybackContext.Provider value={value}>{children}</RoomPlaybackContext.Provider>;
}

export function useRoomPlayback() {
  return useContext(RoomPlaybackContext);
}
