interface FieldLabelProps {
  step?: string;
  label: string;
  htmlFor: string;
}

export function FieldLabel({ step, label, htmlFor }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="font-label-caps text-[10px] uppercase text-outline">
      {step ? `${step}_${label}` : label}
    </label>
  );
}
