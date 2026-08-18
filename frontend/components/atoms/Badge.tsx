interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-[14px] py-[6px] rounded-[var(--radius-control)] text-[13px] font-medium
        bg-surface text-primary border border-outline whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}
