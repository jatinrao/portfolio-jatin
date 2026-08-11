'use client';

import { LangId } from '@/lib/locale';
import { createContext, useContext, useEffect, useState } from 'react';


export const STORAGE_KEY = 'current-lang';

const LanguageContext = createContext<{ lang: LangId } | null>(null);

// `lang` comes from the [lang] route segment — server-known, matches the
// statically generated HTML exactly. No client-side resolution here.
export function LanguageProvider({
  lang,
  children,
}: {
  lang: LangId;
  children: React.ReactNode;
}) {
  // Just remember the choice for next time someone lands on the
  // unlocalized root — this does NOT feed back into `lang` above.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}