import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  brandName?: string;
  tagline?: string;
  year?: number;
  legalLinks?: FooterLink[];
  socialLinks?: FooterLink[];
}

const DEFAULT_LEGAL_LINKS: FooterLink[] = [
  // { label: 'PRIVACY.MD', href: '/privacy' },
  // { label: 'TERMS.SH', href: '/terms' },
];

export function Footer({
  brandName = 'JATIN KUMAR',
  tagline = 'FULL STACK ENGINEER',
  year = new Date().getFullYear(),
  legalLinks = DEFAULT_LEGAL_LINKS,
  socialLinks = [],
}: FooterProps) {
  return (
    <footer className="relative w-full border-t-4 border-heading-ink bg-[#fcf9f3] bg-[radial-gradient(#d0c5b2_1px,transparent_1px)] bg-[length:24px_24px] px-margin-mobile py-10 md:px-margin-desktop">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-headline-lg text-lg uppercase tight-heading">{brandName}</p>
          <p className="mt-1 font-label-caps text-[10px] text-muted-body">{tagline}</p>
        </div>

        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="font-label-caps text-[11px] text-heading-ink underline underline-offset-4 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 md:items-end">
          <p className="font-label-caps text-[10px] text-muted-body">
            © {year} {brandName.toUpperCase()}
          </p>
          {/* <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label-caps text-[11px] text-heading-ink underline underline-offset-4 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}