import type { Metadata } from 'next';
import { locales, isValidLocale} from '@/i18n/config';
import PortfolioTemplate from '@/components/templates/LandingPage';
import { LangId } from '@/lib/locale';

interface HomeProps {
  params: Promise<{ lang: string }>;
}

// Re-declared here (in addition to the layout) only because Next requires
// generateStaticParams to be reachable from whichever segment is actually
// being statically built; having it on the layout already covers this page,
// so this export is optional — kept only as a visible reminder of intent.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
//   const { lang } = await params;
//   const locale: LangId = isValidLocale(lang) ? lang : 'en';

//   // Swap for real localized copy (e.g. from a Sanity `siteSettings`
//   // document) once that's wired up — this is just a safe static default.
//   return {
//     title: 'Portfolio',
//     alternates: {
//       languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
//     },
//     other: { 'current-locale': locale },
//   };
// }

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;
  // The [lang] layout already calls notFound() for anything invalid, so by
  // the time we get here `lang` is guaranteed to be a real Locale — this
  // cast just satisfies TypeScript without re-running that check.
  const locale = lang as LangId;

  return <PortfolioTemplate lang={locale} />;
}