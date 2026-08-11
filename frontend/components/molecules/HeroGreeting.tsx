import Icon from "@/components/atoms/Icon";

interface HeroGreetingProps {
  text: string;
}

export default function HeroGreeting({ text }: HeroGreetingProps) {
  return (
    <div className="inline-flex items-center gap-[10px] bg-white border border-[#c9a84c] border-l-4 border-l-[#2d5a3d] px-4 py-2 rounded-[4px] text-sm font-semibold text-[#2d5a3d] tracking-[0.5px] w-fit">
      <Icon name="HandMetal" size={14} color="#2d5a3d" />
      {text}
    </div>
  );
}