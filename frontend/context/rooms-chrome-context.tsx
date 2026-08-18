'use client';

import { createContext, useContext, type ReactNode, type RefObject } from 'react';

export interface RoomsChrome {
  deskRef: RefObject<HTMLDivElement | null>;
}

const RoomsChromeContext = createContext<RoomsChrome | null>(null);

export function RoomsChromeProvider({
  value,
  children,
}: {
  value: RoomsChrome;
  children: ReactNode;
}) {
  return <RoomsChromeContext.Provider value={value}>{children}</RoomsChromeContext.Provider>;
}

export function useRoomsChrome() {
  return useContext(RoomsChromeContext);
}
