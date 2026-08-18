'use client';

import Link from 'next/link';
import { Icon } from '@web-portfolio/icons';
import { useDisclosure } from '@/hooks/use-disclousre';
import { GlassButton } from '@/components/atoms/GlassButton';
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

  return (
    <div className="md:hidden bg-surface">
      <GlassButton
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="hig-circle-button h-9 w-9 min-h-9 min-w-9 p-0"
      >
        <span className="text-heading-ink">{isOpen ? <Icon name="close" size={20} /> : <Icon name="menu" size={20} />}</span>
      </GlassButton>

      {isOpen && (
        <div className="liquid-glass-surface fixed inset-x-0 top-[var(--header-height)] z-[99] border-b-[0.5px] border-heading-ink px-margin-mobile py-6 shadow-lg">
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
            <Button href={contactHref} onClick={close} className="mt-2 w-fit">
              Contact
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
