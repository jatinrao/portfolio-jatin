interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2
      className={`text-[36px] font-extrabold tracking-[-0.5px] text-[#1a1a1a]
        border-l-4 border-[#c9a84c] pl-4 mb-12 ${className}`}
    >
      {children}
    </h2>
  );
}