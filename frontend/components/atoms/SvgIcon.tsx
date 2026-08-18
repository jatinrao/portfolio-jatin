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

export default function SvgIcon({ src, alt = "Icon", width = 300, accentColor }: SVGIconProps) {
  if (src === undefined || src === null) {
    return null;
  }

  const raw = typeof src.svg === "string" ? src.svg : "";
  if (!raw) {
    return null;
  }

  const paint = accentColor ?? "currentColor";
  const markup = tintSvgMarkup(raw, paint);

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center"
      style={{ width: `${width}px`, height: "auto", color: paint }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
