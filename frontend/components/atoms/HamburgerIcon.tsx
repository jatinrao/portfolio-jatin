'use client';

import './hamburger-icon.css';

interface HamburgerIconProps {
  isOpen: boolean;
  size?: number;
  className?: string;
}

/**
 * Three-bar hamburger that morphs into an X, matching apple.com's
 * globalnav-menutrigger: outer bars rotate 45deg to cross at center, the
 * middle bar shrinks away. --hamburger-gradient (light/dark) lives in
 * hamburger-icon.css.
 */
export function HamburgerIcon({ isOpen, size = 18, className = '' }: HamburgerIconProps) {
  const barBase =
    'absolute left-1/2 top-1/2 h-[1.4px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[image:var(--hamburger-gradient)] transition-transform duration-[var(--transition-standard)] ease-[var(--ease-standard)] motion-reduce:transition-none';

  return (
    <span
      aria-hidden="true"
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className={`${barBase} ${isOpen ? 'translate-y-0 rotate-45' : '-translate-y-[5px] rotate-0'}`}
      />
      <span
        className={`${barBase} transition-[opacity,transform] duration-[var(--transition-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none ${
          isOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
        }`}
      />
      <span
        className={`${barBase} ${isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[5px] rotate-0'}`}
      />
    </span>
  );
}
