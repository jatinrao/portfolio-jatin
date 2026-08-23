import { Svg } from "@/sanity.types";

interface SVGIconProps {
  src: Svg | undefined;
  alt?: string;
  width?: number;
  accentColor?: string;
  size?: number;
}

function tintSvgMarkup(svg: string, color: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+=(["']).*?\1/gi, "")
    .replace(/fill=(["'])(?!none|url\()[^"']*\1/gi, `fill=$1${color}$1`)
    .replace(/stroke=(["'])(?!none|url\()[^"']*\1/gi, `stroke=$1${color}$1`)
    .replace(/fill:\s*(?!none|url\()[^;}]+/gi, `fill:${color}`)
    .replace(/stroke:\s*(?!none|url\()[^;}]+/gi, `stroke:${color}`);
}

/**
 * Strips whatever `width`/`height` the source SVG was authored with and
 * pins `width` to the requested size (height left to scale off the
 * viewBox). Without this, the raw markup's own intrinsic dimensions win
 * over the wrapping <span>'s CSS width — normally papered over on the
 * main site by `.skill-poster-icon svg { width: clamp(...) }` in
 * skill-river.css, but the resume PDF pipeline (resume-renderer.tsx)
 * renders standalone HTML with no stylesheet at all, so nothing there
 * corrects an oversized/undersized icon.
 */
function sizeSvgMarkup(svg: string, size: number): string {
  return svg.replace(/<svg([^>]*)>/i, (_match, attrs) => {
    const stripped = attrs.replace(/\s(width|height)=(["']).*?\2/gi, "");
    return `<svg${stripped} width="${size}">`;
  });
}

export default function SvgIcon({ src, alt = "Icon", width = 300, accentColor }: SVGIconProps) {
  if (src === undefined || src === null) {
    return null;
  }

  const raw = typeof src.svg === "string" ? src.svg : "";
  if (!raw) {
    return null;
  }

  const paint = accentColor ?? "currentColor";
  const markup = sizeSvgMarkup(tintSvgMarkup(raw, paint), width);

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${width}px`,
        height: "auto",
        color: paint,
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
