'use client';

export interface SkillFilterOption {
  value: string;
  label: string;
}

interface SkillFilterBarProps {
  options: SkillFilterOption[];
  active: string;
  onChange: (value: string) => void;
  description?: string;
  className?: string;
}

/** Bordered tab bar with the numbered-label + underline convention from the spec sheet. */
export function SkillFilterBar({ options, active, onChange, description, className }: SkillFilterBarProps) {
  return (
    <div className={['px-3 py-2 md:px-5 md:py-4', className].filter(Boolean).join(' ')}>
      <span
        aria-hidden="true"
        className="absolute -left-[7px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-surface bg-primary"
      />

      <div role="tablist" aria-label="Filter skills by category" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end md:gap-x-8 md:gap-y-3">
        {options.map((option, index) => {
          const isActive = option.value === active;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(option.value)}
              className={[
                'font-label-caps text-[10px] uppercase transition-[color,border-color] duration-300 md:text-label-caps',
                'border-b-2 pb-0.5',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary',
              ].join(' ')}
            >
              {String(index + 1).padStart(2, '0')}_{option.label}
            </button>
          );
        })}
      </div>

      {description && (
        <p className="mt-4 text-right font-body-md text-body-md italic text-muted-body">
          {description}
        </p>
      )}
    </div>
  );
}