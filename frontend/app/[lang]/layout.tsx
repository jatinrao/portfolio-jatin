import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { locales, isValidLocale } from '@/i18n/config';
import { LocaleHtmlSync } from '@/components/shared/LocaleHtmlSync';

// This is the actual SSG mechanism: Next prerenders /en, /fr, /de (etc.) at
// build time as fully static HTML.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Fully static: a locale that isn't in the list above 404s instead of being
// generated on demand. Remove this if you'd rather allow lazy on-request
// generation for locales added after build (that would no longer be "pure"
// SSG for those params, though).
export const dynamicParams = false;

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <>
      <LocaleHtmlSync lang={lang} />
      {children}
    </>
  );
}