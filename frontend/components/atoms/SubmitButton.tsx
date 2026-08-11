interface SubmitButtonProps {
  label: string;
  icon?: string | null;
  pending?: boolean;
}

export function SubmitButton({ label, icon, pending }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 border-2 border-heading-ink bg-secondary px-8 py-3 font-label-caps
                 text-label-caps text-white shadow-[4px_4px_0px_0px_#1a1a1a] transition-all
                 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a1a]
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'TRANSMITTING…' : label}
      {icon && !pending && <span className="material-symbols-outlined text-sm">{icon}</span>}
    </button>
  );
}
