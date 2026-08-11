import { Svg } from "@/sanity.types";

interface SVGIconProps {
  src: Svg | undefined;
  alt?: string;
  width?: number;
  accentColor?: string;
  size?: number;
}

export default function SvgIcon({ src, alt = "Icon", width = 300, accentColor }: SVGIconProps) {
  // 1. Clean the CMS string and convert it into a safe SVG Data URI
  // We use standard utf-8 encoding instead of base64 for SVGs because it produces shorter strings
  if(src === undefined || src === null) {
    return null;
  } 

  const cleanedSvg = typeof src.svg === 'string' ? 
      src.svg.replace(/"/g, "'") // Swap double quotes to single quotes to prevent breaking HTML attributes
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E') :"nf";

  const svgDataUri = `data:image/svg+xml;utf8,${cleanedSvg}`;

  // 2. Render as a native SVG via a standard img source tag
  return (
    <img 
      aria-hidden="true"
      className="flex h-7 w-7 items-center justify-center text-lg font-bold"
      src={svgDataUri} 
      alt={alt} 
      style={{ width: `${width}px`, height: 'auto',color: accentColor }}
      loading="lazy"
    />
  );
}