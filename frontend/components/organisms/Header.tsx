import Image from 'next/image';
import Link from 'next/link';
import { MobileNavToggle } from '@/components/molecules/MobileNavToggle';
import { LangId, localize } from '@/lib/locale';
import type {LocaleString, SanityImageDimensions} from '@/sanity.types'
type LocalizedText = string | Record<string, string | undefined>;
 
export interface HeaderLogoImage {
  asset: {
    _id: string;
    url: string;
    metadata: {
      lqip: string | null;
      dimensions: { width: number; height: number; aspectRatio: number };
    };
  } | null;
  alt: string | null;
}
 
export interface HeaderCta {
  text: LocalizedText | null;
  ariaLabel: LocalizedText | null;
  href: string | null;
}
 
export interface HeaderNavItem {
  anchorId: string;
  label: LocalizedText;
}
 
export interface HeaderData  {
      header_title: LocaleString | null
      location: LocaleString | null
      logoImage: {
        asset: {
          _id: string
          url: string
          metadata: {
            lqip: string | null
            dimensions: SanityImageDimensions | null
          } | null
        } | null
        alt: LocaleString | null
      } | null ;
      headerCta: {
      text: LocaleString
      ariaLabel: LocaleString | null
      href: string
    } | null
    navItems: Array<{
      anchorId: string
      label: LocaleString | null
    }> | null
    }

interface HeaderProps {
  locale: LangId;
  data: HeaderData | null;
  /** Current route, if the page knows it (e.g. pass the segment path). Omit for no active-tab underline. */
  activeHref?: string;
}

// Single source of truth for header height — used both for spacing below
// it (see Footer/page usage note) and read by MobileNavToggle's panel via
// the CSS var below, instead of a separately-guessed pixel value there.
const HEADER_HEIGHT = '72px';

export function Header({ locale, data, activeHref }: HeaderProps) {
  // No `header` document/field yet, or it hasn't been filled in — render
  // nothing rather than a half-empty bar. Adjust if you'd rather show a
  // minimal fallback shell instead.
  if (!data) return null;

  const title = localize(data.header_title, locale);
  const location = localize(data.location, locale);
  const navItems = data.navItems ?? [];
  const cta = data.headerCta;
  
  const ctaText = cta ? localize(cta.text, locale) : '';
  const ctaAriaLabel = cta ? localize(cta.ariaLabel, locale) || ctaText : undefined;
  const logoUrl = data.logoImage?.asset?.url;
  const logoAlt  = localize(data.logoImage?.alt, locale) || title


  return (
    <header
      style={{ ['--header-height' as string]: HEADER_HEIGHT }}
      className="z-50 h-[var(--header-height)] w-full border-b border-outline-variant bg-surface transition-colors duration-300 dark:border-outline dark:bg-inverse-surface"
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={40}
              height={40}
              placeholder={data.logoImage?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={data.logoImage?.asset?.metadata?.lqip ?? undefined}
              className="h-10 w-10 shrink-0 rounded-full border border-outline-variant object-cover"
            />

          )}

          <div className="flex flex-col font-headline-md text-headline-sm font-bold text-primary dark:text-primary-fixed">
            {title}
            {location && (
              <span className="flex items-center font-label-caps text-label-caps text-muted-body">
                <span
                  className="material-symbols-outlined mr-1 text-[16px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://w3.org">
                  <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="currentColor"/>
                </svg>
                </span>
                {location}
              </span>
            )}
          </div>
        </div>

        {navItems.length > 0 && (
          <nav className="hidden items-center gap-x-gutter md:flex">
  {navItems.map((item) => (
    <Link
      key={item.anchorId}
      href={`#${item.anchorId}`}
      className={[
        'whitespace-nowrap border-b-2 border-transparent py-1 font-label-caps text-label-caps leading-none transition-colors duration-200',
        `#${item.anchorId}` === activeHref
          ? 'border-primary text-primary dark:border-primary-fixed dark:text-primary-fixed'
          : 'text-on-surface-variant hover:border-primary/40 hover:text-primary dark:text-on-secondary-fixed-variant dark:hover:border-primary-fixed/40 dark:hover:text-primary-fixed',
      ].join(' ')}
    >
      {localize(item.label, locale)}
    </Link>
  ))}
</nav>
        )}

        <div className="flex items-center gap-3 md:gap-6">
          {cta?.href && ctaText && (
            <Link
              href={cta.href}
              aria-label={ctaAriaLabel}
              className="group relative z-10 hidden items-center justify-center overflow-hidden border-[3px] border-primary bg-transparent px-6 py-3 font-label-caps text-label-caps uppercase tracking-wider text-primary transition-transform duration-200 ease-out before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-secondary before:transition-transform before:duration-300 before:content-[''] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:border-secondary hover:text-on-secondary hover:before:translate-y-0 md:flex"
            >
              {ctaText}
            </Link>
          )}

          {/* MobileNavToggle wasn't part of this update — passing it
              already-localized plain strings so it doesn't need to know
              about `lang`/localize itself. */}
          <MobileNavToggle
            navItems={navItems.map((item) => ({ ...item, label: localize(item.label, locale) }))}
            activeHref={activeHref}
            contactHref={cta?.href ?? '#'}
          />
        </div>
      </div>
    </header>
  );
}