interface ProtocolBadgeProps {
  label: string;
}

export function ProtocolBadge({ label }: ProtocolBadgeProps) {
  if (!label) return null;

  return (
    <div className="absolute -left-4 -top-4 border-2 border-heading-ink bg-primary px-3 py-1 font-label-caps text-[10px] text-white">
      {label}
    </div>
  );
}
