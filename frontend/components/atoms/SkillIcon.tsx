import Image from 'next/image';
import type { SanityImageAsset } from '@/sanity.types'
import { urlForImage } from '@/sanity/lib/utils';

interface SkillIconProps {
  icon: string | undefined;
  name: string;
  accentColor: string;
}

export function SkillIcon({ icon, name, accentColor }: SkillIconProps) {
  if (icon) {
    return (
      <>{icon}</>
    );
  }

  // No icon uploaded yet in Sanity: fall back to the skill's initial so the
  // grid never shows a broken image while content is still being authored.
  return (
    <span
      aria-hidden="true"
      className="mb-2 flex h-7 w-7 items-center justify-center text-lg font-bold"
      style={{ color: accentColor }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}