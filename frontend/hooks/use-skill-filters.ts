'use client';

import { useCallback, useRef, useState } from 'react';
import type { Skill } from '@/sanity.types';

const EXIT_DURATION = 300; // must match SkillCard's exit transition duration

function matches(skill: Skill, filter: string) {
  return filter === 'all' || skill.filter_category === filter;
}

/** Owns the two-phase (fade-out, then swap) filter transition state. */
export function useSkillFilter(skills: Skill[], initialFilter = 'all') {
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [displayed, setDisplayed] = useState<Skill[]>(() =>
    skills?.filter((skill) => matches(skill, initialFilter)),
  );
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const pendingTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const setFilter = useCallback(
    (next: string) => {
      if (next === activeFilter) return;

      const toExit = displayed.filter((skill) => !matches(skill, next));
      setActiveFilter(next);

      if (toExit.length === 0) {
        setDisplayed(skills.filter((skill) => matches(skill, next)));
        return;
      }

      setExitingIds(new Set(toExit.map((skill) => skill._id)));
      if (pendingTimeout.current) {
        clearTimeout(pendingTimeout.current);
      }
      pendingTimeout.current = setTimeout(() => {
        setDisplayed(skills.filter((skill) => matches(skill, next)));
        setExitingIds(new Set());
      }, EXIT_DURATION);
    },
    [activeFilter, displayed, skills],
  );

  return { activeFilter, displayed, exitingIds, setFilter };
}