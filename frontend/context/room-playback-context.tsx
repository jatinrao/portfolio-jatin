'use client';

import { createContext, useContext } from 'react';

export interface RoomPlayback {
  skillsProgress: number;
  experienceProgress: number;
  activeKind?: string;
}

const DEFAULT_PLAYBACK: RoomPlayback = {
  skillsProgress: 0,
  experienceProgress: 0,
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
