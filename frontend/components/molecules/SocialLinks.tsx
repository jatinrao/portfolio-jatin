import Icon from "@/components/atoms/Icon";
import { SocialLink } from "@/types";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface SocialLinksProps {
  links: SocialLink[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="flex gap-3">
      {links.map(({ icon, href, label }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 flex items-center justify-center rounded-[4px]
            bg-[#2d5a3d] border-2 border-[#c9a84c] cursor-pointer
            hover:bg-[#3b7a52] transition-colors duration-200"
        >
          <Icon name={icon as IconName} size={20} color="#e8c96a" />
        </a>
      ))}
    </div>
  );
}