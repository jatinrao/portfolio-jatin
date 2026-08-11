import type { InputHTMLAttributes } from 'react';

type TextFieldInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextFieldInput(props: TextFieldInputProps) {
  return (
    <input
      {...props}
      className="form-input-custom w-full border border-[#7e7665] bg-transparent px-3 py-2 font-mono text-xs
                 focus:border-[#755b00] focus:shadow-[4px_4px_0px_0px_#c9a84c] focus:outline-none"
    />
  );
}
