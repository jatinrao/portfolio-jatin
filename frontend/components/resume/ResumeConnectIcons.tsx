import { Icon } from '@web-portfolio/icons';
import { LangId, localize } from '@/lib/locale';

export const PORTFOLIO_URL = 'https://jatin.getresume.dev/';
export const GITHUB_URL = 'https://github.com/jatinrao';

const ICON_SIZE = 13;

/*
 * Verbatim source markup (Apple Native CoreSVG export), with two changes
 * from the original export: the XML prolog/doctype stripped (not valid
 * inside an HTML document; the SVG renders identically without them),
 * and each icon's own <linearGradient> fill replaced with flat
 * `currentColor`. That gradient only ever ramped between two opacities
 * of the same colour (0.85 → 1) — invisible at a 13pt icon size — but a
 * Chrome DevTools trace on an actual exported PDF (scrolled in
 * Chromium's built-in PDF viewer, not the browser preview) showed
 * sustained near-100% CPU during scroll, and every one of these
 * near-imperceptible gradients is a real PDF shading pattern the viewer
 * has to re-rasterize on every page it redraws. Same reasoning as the
 * flattened chip fills in print.styles.ts — cut the gradients that were
 * never visually earning their cost.
 */
const PORTFOLIO_ICON_SVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 19.9197 19.9218">
<g>
<path d="M19.9197 9.95469C19.9197 15.4553 15.4553 19.9094 9.95469 19.9094C4.46443 19.9094 4.44089e-16 15.4553 4.44089e-16 9.95469C4.44089e-16 4.45408 4.46443 0 9.95469 0C15.4553 0 19.9197 4.45408 19.9197 9.95469ZM9.46815 0.594711C8.79292 0.711167 8.15902 1.08147 7.59327 1.6585C6.27781 2.03054 5.09087 2.70807 4.11572 3.61238C4.03265 3.56543 3.96085 3.51169 3.89134 3.45661C3.60112 3.23271 3.23633 3.20799 2.98349 3.45259C2.73488 3.69719 2.71839 4.09513 2.9858 4.34586C3.06469 4.41682 3.14848 4.48645 3.23747 4.55449C2.1694 5.87376 1.48801 7.51772 1.3594 9.31425L1.17083 9.31425C0.818509 9.31425 0.530398 9.60025 0.530398 9.95469C0.530398 10.3091 0.818509 10.5951 1.17083 10.5951L1.35938 10.5951C1.48904 12.4057 2.1801 14.0613 3.26294 15.3855C3.16436 15.4596 3.07214 15.5357 2.9858 15.6134C2.71839 15.8641 2.73488 16.262 2.98349 16.5066C3.23633 16.7512 3.60112 16.7265 3.89134 16.5026C3.9707 16.4397 4.05304 16.3786 4.1475 16.3248C5.11407 17.214 6.28713 17.8803 7.58564 18.2489C8.13722 18.8147 8.75362 19.1836 9.40869 19.315C9.52227 19.5013 9.72813 19.6253 9.95469 19.6253C10.188 19.6253 10.3932 19.4998 10.5046 19.3117C11.159 19.182 11.775 18.8133 12.3267 18.2484C13.626 17.8794 14.8005 17.2127 15.7684 16.3232C15.864 16.3775 15.9477 16.4392 16.0284 16.5026C16.3083 16.7265 16.6834 16.7512 16.9341 16.5066C17.1848 16.262 17.2013 15.8641 16.9339 15.6134C16.8468 15.535 16.7538 15.4583 16.6542 15.3837C17.7381 14.0598 18.4303 12.4048 18.5603 10.5951L18.9434 10.5951C19.2979 10.5951 19.5839 10.3091 19.5839 9.95469C19.5839 9.60025 19.2979 9.31425 18.9434 9.31425L18.5603 9.31425C18.4314 7.51864 17.7489 5.87544 16.6798 4.5565C16.7696 4.48779 16.8543 4.4175 16.9339 4.34586C17.2013 4.09513 17.1848 3.69719 16.9341 3.45259C16.6834 3.20799 16.3083 3.23271 16.0284 3.45661C15.9576 3.51228 15.8845 3.56659 15.8003 3.61405C14.8237 2.70937 13.6353 2.03144 12.319 1.65904C11.7529 1.08257 11.119 0.712331 10.4444 0.595253C10.3269 0.455453 10.1507 0.366897 9.95469 0.366897C9.76348 0.366897 9.58701 0.455216 9.46815 0.594711Z" fill="currentColor"/>
<path d="M9.31425 18.0285L9.31425 18.9848C9.31425 19.1046 9.34809 19.2166 9.40678 19.3119C7.9724 19.0245 6.72282 17.6014 5.93338 15.4667C6.32259 15.3332 6.74862 15.2264 7.20233 15.1423C7.7429 16.5991 8.4918 17.6624 9.31425 18.0285ZM13.9827 15.4672C13.191 17.6006 11.9389 19.0232 10.5048 19.3113C10.5624 19.2161 10.5951 19.1044 10.5951 18.9848L10.5951 18.0296C11.4223 17.6651 12.1741 16.6013 12.7161 15.1432C13.1691 15.2272 13.5942 15.3338 13.9827 15.4672ZM6.82739 13.9336C6.38002 14.0247 5.95432 14.1355 5.55695 14.2646C5.26354 13.1688 5.08402 11.9309 5.04731 10.5951L6.3523 10.5951C6.39289 11.7834 6.56242 12.9204 6.82739 13.9336ZM14.3607 14.2643C13.9639 14.1356 13.5388 14.025 13.0919 13.934C13.3572 12.9207 13.5268 11.7836 13.5674 10.5951L14.8723 10.5951C14.8355 11.9307 14.6552 13.1685 14.3607 14.2643ZM6.81505 6.02331C6.56018 7.02015 6.39583 8.13821 6.35323 9.31425L5.04842 9.31425C5.08764 7.99677 5.2637 6.77539 5.55009 5.69246C5.94585 5.82125 6.36975 5.93195 6.81505 6.02331ZM14.8712 9.31425L13.5665 9.31425C13.5239 8.13805 13.3594 7.01984 13.1042 6.0229C13.549 5.93168 13.9724 5.82124 14.3676 5.69278C14.655 6.77563 14.8318 7.99689 14.8712 9.31425ZM9.31425 1.00733L9.31425 1.8879C8.48287 2.25473 7.72662 3.32916 7.1848 4.81297C6.73267 4.72906 6.30873 4.62219 5.92124 4.48874C6.72085 2.29913 7.99951 0.851413 9.47114 0.591457C9.37393 0.702996 9.31425 0.848273 9.31425 1.00733ZM13.9949 4.48828C13.6081 4.62153 13.1851 4.72828 12.7338 4.81206C12.1904 3.32689 11.4313 2.25198 10.5951 1.88675L10.5951 1.00733C10.5951 0.848402 10.5372 0.703231 10.4412 0.591721C11.9122 0.853251 13.193 2.30032 13.9949 4.48828Z" fill="currentColor"/>
<path d="M9.95469 19.6253C10.307 19.6253 10.5951 19.3393 10.5951 18.9848L10.5951 1.00733C10.5951 0.652897 10.307 0.366897 9.95469 0.366897C9.6106 0.366897 9.31425 0.652897 9.31425 1.00733L9.31425 18.9848C9.31425 19.3393 9.6106 19.6253 9.95469 19.6253ZM3.89134 16.5026C5.19401 15.4705 7.298 14.9076 9.95469 14.9076C12.6217 14.9076 14.7154 15.4705 16.0284 16.5026C16.3083 16.7265 16.6834 16.7512 16.9341 16.5066C17.1848 16.262 17.2013 15.8641 16.9339 15.6134C15.6253 14.4363 12.9677 13.6246 9.95469 13.6246C6.952 13.6246 4.2944 14.4363 2.9858 15.6134C2.71839 15.8641 2.73488 16.262 2.98349 16.5066C3.23633 16.7512 3.60112 16.7265 3.89134 16.5026ZM1.17083 10.5951L18.9434 10.5951C19.2979 10.5951 19.5839 10.3091 19.5839 9.95469C19.5839 9.60025 19.2979 9.31425 18.9434 9.31425L1.17083 9.31425C0.818509 9.31425 0.530398 9.60025 0.530398 9.95469C0.530398 10.3091 0.818509 10.5951 1.17083 10.5951ZM9.95469 6.33459C12.9677 6.33459 15.6253 5.52292 16.9339 4.34586C17.2013 4.09513 17.1848 3.69719 16.9341 3.45259C16.6834 3.20799 16.3083 3.23271 16.0284 3.45661C14.7154 4.48876 12.6217 5.05161 9.95469 5.05161C7.298 5.05161 5.19401 4.48876 3.89134 3.45661C3.60112 3.23271 3.23633 3.20799 2.98349 3.45259C2.73488 3.69719 2.71839 4.09513 2.9858 4.34586C4.2944 5.52292 6.952 6.33459 9.95469 6.33459Z" fill="currentColor"/>
</g>
</svg>`;

const MAIL_ICON_SVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 23.5583 16.8273">
<g>
<path d="M11.774 9.50559C12.0961 9.50559 12.4097 9.37676 12.7132 9.1003L22.4649 0.513009C21.9316 0.164102 21.3252 0.00824052 20.4947 0.00824052L3.06359 0.00824052C2.23313 0.00824052 1.62676 0.164102 1.0831 0.513009L10.8451 9.1003C11.1486 9.37676 11.4623 9.50559 11.774 9.50559ZM0.25404 15.2451L7.47374 8.03168L0.229118 1.65892C0.120589 1.8589 0 2.3514 0 3.03043L0 13.8051C0 14.4284 0.0977776 14.8856 0.25404 15.2451ZM2.77377 16.8273L20.7824 16.8273C21.5056 16.8273 22.0537 16.659 22.4233 16.4034L14.9904 8.97882L13.5714 10.242C13.0005 10.7423 12.3905 10.9935 11.774 10.9935C11.1678 10.9935 10.5578 10.7423 9.98694 10.242L8.55755 8.97882L1.1247 16.4034C1.49431 16.659 2.05274 16.8273 2.77377 16.8273ZM23.3022 15.2451C23.4502 14.8856 23.5583 14.4284 23.5583 13.8051L23.5583 3.03043C23.5583 2.3514 23.4377 1.8589 23.3271 1.65892L16.0846 8.03168Z" fill="currentColor"/>
</g>
</svg>`;

/**
 * Overrides the source markup's own width/height so sizing doesn't depend
 * on an ancestor stylesheet — the resume PDF pipeline renders standalone
 * HTML with no stylesheet at all (see SvgIcon.tsx's sizeSvgMarkup for the
 * same fix applied to Sanity-sourced icons).
 */
function sizedIconMarkup(svg: string, size: number): string {
  return svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
}

/**
 * A plain <span dangerouslySetInnerHTML> defaults to `display: inline`,
 * which lays its content out in a normal inline formatting context — one
 * with line-height-driven ascent/descent space around it, sized off
 * whatever font-size this span inherits, not off the 13px icon inside it.
 * `.resume-icon-chip`'s flexbox does center that span correctly, but the
 * span itself is taller than the icon it contains, so the *visible* glyph
 * sits high within it — measured at roughly a 9-10px offset against
 * LinkedIn/GitHub, which render as a bare `<svg>` with no such wrapper
 * (a flex item that's an SVG directly needs no inline formatting context
 * to size, so it has no extra space to offset it). `inline-flex` gives
 * this span its own flex formatting context instead, so it sizes to
 * exactly its content (the icon) and centers cleanly like its siblings.
 */
const ICON_WRAPPER_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function findChannelUrl(channels: any[] | undefined, locale: LangId, label: string): string | undefined {
  return channels?.find((channel) => localize(channel.label, locale)?.toLowerCase() === label.toLowerCase())?.url;
}

/**
 * Plain email address for display as visible text — a `mailto:` href
 * alone (as on the Mail icon below) isn't part of a PDF's extractable
 * text layer, so a plain-text ATS parser sees no email address anywhere
 * in the document without this.
 */
export function getEmailAddress(channels: any[] | undefined, locale: LangId): string | undefined {
  const mailUrl = findChannelUrl(channels, locale, 'Mail');
  return mailUrl?.replace(/^mailto:/, '');
}

interface ConnectIconProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function ConnectIcon({ href, label, children }: ConnectIconProps) {
  return (
    <a href={href} aria-label={label} className="resume-icon-chip">
      {children}
    </a>
  );
}

interface ResumeConnectIconsProps {
  channels: any[] | undefined;
  locale: LangId;
}

/**
 * Fixed four-icon row (Portfolio, Mail, LinkedIn, GitHub) placed under the
 * headshot. Portfolio/GitHub have no corresponding entry in Sanity's
 * `channels` array, so they're hardcoded; Mail/LinkedIn already exist as
 * channels there, so their href stays CMS-driven — a channel missing from
 * Studio just means that one icon doesn't render, rather than falling back
 * to a stale hardcoded contact detail.
 */
export function ResumeConnectIcons({ channels, locale }: ResumeConnectIconsProps) {
  const mailUrl = findChannelUrl(channels, locale, 'Mail');
  const linkedinUrl = findChannelUrl(channels, locale, 'LinkedIn');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5.25pt' }}>
      <ConnectIcon href={PORTFOLIO_URL} label="Portfolio">
        <span style={ICON_WRAPPER_STYLE} dangerouslySetInnerHTML={{ __html: sizedIconMarkup(PORTFOLIO_ICON_SVG, ICON_SIZE) }} />
      </ConnectIcon>
      {mailUrl && (
        <ConnectIcon href={mailUrl} label="Mail">
          <span style={ICON_WRAPPER_STYLE} dangerouslySetInnerHTML={{ __html: sizedIconMarkup(MAIL_ICON_SVG, ICON_SIZE) }} />
        </ConnectIcon>
      )}
      {linkedinUrl && (
        <ConnectIcon href={linkedinUrl} label="LinkedIn">
          <Icon name="linkedin" size={ICON_SIZE} color="currentColor" />
        </ConnectIcon>
      )}
      <ConnectIcon href={GITHUB_URL} label="GitHub">
        <Icon name="github" size={ICON_SIZE} color="currentColor" />
      </ConnectIcon>
    </div>
  );
}
