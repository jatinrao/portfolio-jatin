import Icon from "@/components/atoms/Icon";
import { ContactInfo } from "@/types";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

export default function ContactInfoRow({ icon, label, value }: ContactInfo) {
  return (
    <div className="flex items-center gap-3 py-[14px] border-b border-[#c9a84c]/30 last:border-0">
      <div className="w-9 h-9 bg-[#2d5a3d] rounded-[4px] flex items-center justify-center flex-shrink-0">
        <Icon name={icon as IconName} size={18} color="#e8c96a" />
      </div>
      <div>
        <div className="text-[12px] text-[#6b6b5e] font-medium tracking-[0.5px]">
          {label}
        </div>
        <div className="text-sm text-[#1a1a1a] font-semibold">{value}</div>
      </div>
    </div>
  );
}