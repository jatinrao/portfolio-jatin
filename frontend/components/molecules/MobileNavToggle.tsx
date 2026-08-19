'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useDisclosure } from '@/hooks/use-disclousre';
import { GlassButton } from '@/components/atoms/GlassButton';
import { HamburgerIcon } from '@/components/atoms/HamburgerIcon';
import Button from '@/components/atoms/Button';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  const menu = (
    <div
      id="mobile-nav-menu"
      inert={!isOpen ? true : undefined}
      aria-hidden={!isOpen}
      // `.liquid-glass-surface` hardcodes position:relative, which (same
      // specificity, later in the cascade) silently wins over the `fixed`
      // utility class — force it back with an inline style instead.
      style={{ position: 'fixed' }}
      className={[
        // --header-height is set inline on <header> and only cascades to
        // its descendants — this panel is portalled to <body>, outside
        // that scope, so it needs the same fallback hero.css already uses.
        'liquid-glass-surface inset-x-0 top-[var(--header-height,_52px)] bottom-0 z-[100] flex flex-col justify-between px-margin-mobile py-8 transition-opacity duration-[var(--transition-standard)] ease-[var(--ease-standard)] motion-reduce:transition-none',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      <nav className="flex flex-col gap-1">
        {navItems.map((item, index) => (
          <Link
            key={item.anchorId}
            href={`#${item.anchorId}`}
            onClick={close}
            className={[
              'font-apple-display border-b border-outline-variant py-4 text-[32px] font-semibold leading-tight tracking-[-0.01em] transition-[opacity,transform] duration-[var(--transition-standard)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
              `#${item.anchorId}` === activeHref ? 'text-primary' : 'text-heading-ink',
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
            ].join(' ')}
            style={{ transitionDelay: isOpen ? `${60 + index * 60}ms` : '0ms' }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div
        className={[
          'transition-[opacity,transform] duration-[var(--transition-standard)] ease-[var(--ease-standard)] motion-reduce:transition-none motion-reduce:transform-none',
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        ].join(' ')}
        style={{ transitionDelay: isOpen ? `${60 + navItems.length * 60}ms` : '0ms' }}
      >
        <Button href={contactHref} onClick={close} className="w-full justify-center py-3 text-[15px]">
          Contact
        </Button>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <GlassButton
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        rimHighlight={false}
        className="hig-circle-button relative z-[110] h-9 w-9 min-h-9 min-w-9 p-0"
      >
        <HamburgerIcon isOpen={isOpen} />
      </GlassButton>

      {/* Portalled to body — header's own backdrop-filter makes it a
          containing/stacking context for fixed descendants, which would
          otherwise trap this full-screen overlay under later page content
          (e.g. Hero's sticky/transformed layers) instead of on top of it. */}
      {mounted ? createPortal(menu, document.body) : menu}
    </div>
  );
}
