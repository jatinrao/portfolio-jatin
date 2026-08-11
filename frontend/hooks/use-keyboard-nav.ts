"use client";

import { useEffect, useRef, useState } from "react";

interface KeyLike {
  key: string;
  preventDefault: () => void;
}

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function isEditableTarget(target: Element | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return EDITABLE_TAGS.has(target.tagName) || target.isContentEditable;
}

/**
 * Lets keyboard nav respond as soon as the carousel is scrolled into
 * view, rather than requiring an explicit click/Tab to focus it first.
 * Still defers to typing elsewhere on the page: if focus is currently in
 * an input/textarea/contenteditable, keys are left alone, so this
 * doesn't hijack unrelated text entry just because the section happens
 * to be visible at the same time.
 */
export function useViewportKeyboardNav<T extends HTMLElement>(onKey: (event: KeyLike) => void, threshold = 0.4) {
  const containerRef = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!isInView) return;
    function handleWindowKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(document.activeElement)) return;
      onKey(event);
    }
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [isInView, onKey]);

  return containerRef;
}