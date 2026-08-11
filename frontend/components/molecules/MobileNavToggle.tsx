'use client';

import Link from 'next/link';
import { useDisclosure } from '@/hooks/use-disclousre';

interface NavItem {
  label: string;
  anchorId: string;
}

interface MobileNavToggleProps {
  navItems: NavItem[];
  activeHref?: string;
  contactHref: string;
}

export function MobileNavToggle({ navItems, activeHref, contactHref }: MobileNavToggleProps) {
  const { isOpen, toggle, close } = useDisclosure();

  return (
    <div className="md:hidden bg-surface">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="flex h-9 w-9 items-center justify-center border-2 border-heading-ink bg-white"
      >
        <span className="text-heading-ink">{isOpen ? <svg className="w-full h-auto" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg> : <svg className="w-full h-auto" focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabIndex={-1} ><path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"></path></svg>}</span>
      </button>

      {isOpen && (
        // top-[var(--header-height)] reads a CSS var set on <header> itself
        // (see Header.tsx) rather than a guessed pixel offset, so this
        // always sits flush against the real header, even if its height
        // changes later.
        <div className="fixed inset-x-0 top-[var(--header-height)] z-[99] border-b-4 border-heading-ink bg-white px-margin-mobile py-6 shadow-lg">
          <nav className="flex flex-col gap-5">
            {navItems.map((item, index) => (
              <Link
                key={item.anchorId}
                href={`#${item.anchorId}`}
                onClick={close}
                className={[
                  'font-label-caps text-label-caps uppercase',
                  `#${item.anchorId}` === activeHref ? 'text-primary' : 'text-on-surface-variant',
                ].join(' ')}
              >
                {String(index + 1).padStart(2, '0')}_{item.label}
              </Link>
            ))}
            <Link
              href={contactHref}
              onClick={close}
              className="mt-2 inline-flex w-fit items-center gap-2 border-2 border-heading-ink bg-secondary px-4 py-2 font-label-caps text-label-caps text-white shadow-[4px_4px_0px_0px_#1a1a1a]"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}