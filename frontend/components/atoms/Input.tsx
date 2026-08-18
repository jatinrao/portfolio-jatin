interface InputProps {
  placeholder?: string;
  type?: string;
  name?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  placeholder,
  type = "text",
  name,
  className = "",
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`bg-surface-container border border-outline rounded-[var(--radius-control)] px-4 py-3
        text-sm text-on-surface placeholder:text-muted-body w-full
        focus:outline-none focus:ring-2 focus:ring-primary/30 ${className}`}
    />
  );
}