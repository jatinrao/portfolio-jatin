interface TextareaProps {
  placeholder?: string;
  name?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({
  placeholder,
  name,
  rows = 5,
  value,
  onChange,
}: TextareaProps) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={onChange}
      className="bg-surface-container border border-outline rounded-[var(--radius-control)] px-4 py-3
        text-sm text-on-surface placeholder:text-muted-body w-full resize-none
        focus:outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}