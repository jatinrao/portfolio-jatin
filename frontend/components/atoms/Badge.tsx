interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}
 
export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-[14px] py-[6px] rounded-[4px] text-[13px] font-medium
        bg-white text-[#2d5a3d] border border-[#c9a84c] whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}