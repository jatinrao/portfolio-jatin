interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-[10px] text-[12px] font-semibold tracking-[3px] uppercase text-[#2d5a3d] mb-4">
      <span className="block w-8 h-[2px] bg-[#c9a84c]" />
      {children}
    </div>
  );
}