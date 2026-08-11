import type { TextareaHTMLAttributes } from 'react';

type TextAreaFieldInputProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaFieldInput(props: TextAreaFieldInputProps) {
  return (
    <textarea
      {...props}
      className="form-input-custom h-24 w-full resize-none border border-[#7e7665] bg-transparent px-3 py-2
                 font-mono text-xs focus:border-[#755b00] focus:shadow-[4px_4px_0px_0px_#c9a84c] focus:outline-none"
    />
  );
}
