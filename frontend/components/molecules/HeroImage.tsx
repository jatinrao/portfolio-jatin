import Image from "next/image";

interface HeroImageProps {
  src: string;
  alt: string;
  badgeLabel?: string;
  badgeHighlight?: string;
}

export default function HeroImage({
  src,
  alt,
  badgeLabel = "Open to Work",
  badgeHighlight = "✓",
}: HeroImageProps) {
  return (
    <div className="flex-shrink-0 relative flex items-center justify-center">
      {/* Offset frame */}
      <div className="absolute w-[400px] h-[400px] border-2 border-[#c9a84c] rounded-[8px] top-4 left-4 z-[1]" />

      <Image
        src={src}
        alt={alt}
        width={400}
        height={400}
        className="w-[400px] h-[400px] rounded-[8px] object-cover border-[3px] border-[#2d5a3d] relative z-[2]"
      />

      {/* Badge */}
      <div className="absolute -bottom-4 -right-4 bg-[#2d5a3d] border-[3px] border-[#c9a84c] text-white px-5 py-3 rounded-[4px] text-[13px] font-bold z-[3] text-center leading-[1.4]">
        <span className="block text-[22px] font-black text-[#e8c96a]">
          {badgeHighlight}
        </span>
        {badgeLabel}
      </div>
    </div>
  );
}