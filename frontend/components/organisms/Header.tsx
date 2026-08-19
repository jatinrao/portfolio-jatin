import Image from 'next/image';
import Link from 'next/link';
import { MobileNavToggle } from '@/components/molecules/MobileNavToggle';
import { LiquidGlass } from '@/components/atoms/LiquidGlass';
import Button from '@/components/atoms/Button';
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
const HEADER_HEIGHT = '52px';

export function Header({ locale, data, activeHref }: HeaderProps) {
  // No `header` document/field yet, or it hasn't been filled in — render
  // nothing rather than a half-empty bar. Adjust if you'd rather show a
  // minimal fallback shell instead.
  if (!data) return null;

  const title = localize(data.header_title, locale);
  const navItems = data.navItems ?? [];
  const cta = data.headerCta;

  const ctaText = cta ? localize(cta.text, locale) : '';
  const ctaAriaLabel = cta ? localize(cta.ariaLabel, locale) || ctaText : undefined;
  const logoUrl = data.logoImage?.asset?.url;
  const logoAlt = localize(data.logoImage?.alt, locale) || title;

  return (
    <header
      style={{ ['--header-height' as string]: HEADER_HEIGHT ,    transition: "background .24s cubic-bezier(0.28, 0.11, 0.32, 1)",
    backdropFilter: "saturate(180%) blur(20px)"}}
      className="relative sticky top-0 z-50 h-[var(--header-height)] w-full border-b border-black/10 transition-colors duration-300 dark:border-white/10"
    >
      {/* <LiquidGlass
        variant="regular"
        inertSurface
        className="pointer-events-none absolute inset-0"
      /> */}
      <div className="relative z-[1] mx-auto flex h-full w-full max-w-[980px] items-center justify-between px-[22px]">
        <div className="flex min-w-0 items-center gap-2">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={32}
              height={32}
              placeholder={data.logoImage?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={data.logoImage?.asset?.metadata?.lqip ?? undefined}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          )}

          <p className="truncate leading-6 tracking-[0.231px] opacity-85 font-apple font-medium text-[19px] text-black dark:text-[#f5f5f7]">
            {title}
          </p>
        </div>

        <div className="flex items-center gap-5">
          {navItems.length > 0 && (
            <nav className="hidden items-center gap-5 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.anchorId}
                  href={`#${item.anchorId}`}
                  className={[
                    'font-apple whitespace-nowrap border-b border-transparent py-px text-[12px] font-normal leading-5.5 inline-block opacity-80 tracking-[-0.12px] transition-[color,border-color,opacity] duration-[var(--transition-fast)] ease-[var(--ease-standard)] hover:opacity-100',
                    `#${item.anchorId}` === activeHref
                      ? 'border-black text-black dark:border-[#f5f5f7] dark:text-[#f5f5f7]'
                      : 'text-black hover:text-[#06c] dark:text-[#f5f5f7]',
                  ].join(' ')}
                >
                  {localize(item.label, locale)}
                </Link>
              ))}
            </nav>
          )}

          {cta?.href && ctaText && (
            <Button
              href={cta.href}
              aria-label={ctaAriaLabel}
              className="hidden min-h-7 px-3 py-1 text-[12px] font-normal leading-4 tracking-[-0.12px] md:inline-flex"
            >
              {ctaText}
            </Button>
          )}

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