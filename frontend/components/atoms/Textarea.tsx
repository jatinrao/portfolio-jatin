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
      className="bg-[#f7f4ee] border border-[#c9a84c] rounded-[4px] px-4 py-3
        text-sm text-[#6b6b5e] placeholder:text-[#6b6b5e] w-full resize-none
        focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/30"
    />
  );
}