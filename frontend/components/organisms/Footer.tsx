import Link from 'next/link';
import { LANGUAGES, type LangId } from '@/lib/locale';
import './footer.css';

interface FooterLink {
  label: string;
  href: string;
}

export interface FooterNavItem {
  anchorId: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  tagline?: string;
  year?: number;
  locale?: LangId;
  navItems?: FooterNavItem[];
  legalLinks?: FooterLink[];
  socialLinks?: FooterLink[];
  exploreLabel?: string;
  connectLabel?: string;
}

const DEFAULT_LEGAL_LINKS: FooterLink[] = [];

export function Footer({
  brandName = 'Jatin Kumar',
  tagline = 'Full stack engineer',
  year = new Date().getFullYear(),
  locale = 'en',
  navItems = [],
  legalLinks = DEFAULT_LEGAL_LINKS,
  socialLinks = [],
  exploreLabel = 'Explore',
  connectLabel = 'Connect',
}: FooterProps) {
  const language = LANGUAGES.find((item) => item.id === locale);
  const localeLabel = language?.label ?? locale;

  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <ol className="site-footer-crumbs">
          <li>
            <Link href="/">{brandName}</Link>
          </li>
          {tagline ? (
            <li>
              <span className="site-footer-sep" aria-hidden="true">
                ›
              </span>{' '}
              <span>{tagline}</span>
            </li>
          ) : null}
        </ol>

        {(navItems.length > 0 || socialLinks.length > 0) && (
          <div className="site-footer-directory">
            {navItems.length > 0 && (
              <div>
                <h3 className="site-footer-heading">{exploreLabel}</h3>
                <ul className="site-footer-list">
                  {navItems.map((item) => (
                    <li key={item.anchorId}>
                      <Link href={`#${item.anchorId}`}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div>
                <h3 className="site-footer-heading">{connectLabel}</h3>
                <ul className="site-footer-list">
                  {socialLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noreferrer noopener">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tagline ? (
          <p className="site-footer-shop">
            {tagline}
            {socialLinks[0] ? (
              <>
                {' '}
                <a href={socialLinks[0].href} target="_blank" rel="noreferrer noopener">
                  {socialLinks[0].label}
                </a>
              </>
            ) : null}
          </p>
        ) : null}

        <div className="site-footer-end">
          <div className="site-footer-legal">
            <p className="site-footer-copyright">
              Copyright © {year} {brandName}. All rights reserved.
            </p>
            {legalLinks.length > 0 && (
              <ul className="site-footer-legal-links">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="site-footer-locale">{localeLabel}</span>
        </div>
      </div>
    </footer>
  );
}
