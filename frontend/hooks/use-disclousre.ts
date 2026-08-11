'use client';

import { useCallback, useState } from 'react';

/** Generic open/close boolean state — reused wherever something needs a toggle (mobile nav, dropdowns, etc). */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);
  return { isOpen, open, close, toggle };
}