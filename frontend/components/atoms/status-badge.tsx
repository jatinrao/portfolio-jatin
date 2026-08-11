export interface StatusBadgeProps {
  status: string;
  emphasized?: boolean;
}

/** Small monospace status readout, e.g. ACTIVE / STABLE / NULL_STATE. */
export function StatusBadge({ status, emphasized = false }: StatusBadgeProps) {
  return (
    <span
      className={[
        "font-label-caps text-[10px] text-secondary",
        emphasized ? "font-bold" : "",
      ].join(" ")}
    >
      {status}
    </span>
  );
}
