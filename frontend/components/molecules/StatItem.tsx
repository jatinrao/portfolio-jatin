import { HeroStat } from "@/types";

export default function StatItem({ number, label }: HeroStat) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[28px] font-extrabold text-[#2d5a3d] leading-none">
        {number}
      </span>
      <span className="text-[12px] text-[#6b6b5e] font-medium tracking-[0.5px]">
        {label}
      </span>
    </div>
  );
}