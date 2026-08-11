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
      className={`bg-[#f7f4ee] border border-[#c9a84c] rounded-[4px] px-4 py-3
        text-sm text-[#1a1a1a] placeholder:text-[#6b6b5e] w-full
        focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30 ${className}`}
    />
  );
}