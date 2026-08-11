import { ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2d5a3d] text-white border-2 border-[#2d5a3d] hover:bg-[#3b7a52] hover:border-[#3b7a52]",
  outline:
    "bg-transparent text-[#2d5a3d] border-2 border-[#2d5a3d] hover:bg-[#2d5a3d] hover:text-white",
  ghost:
    "bg-transparent text-[#2d5a3d] border border-[#c9a84c] px-3 py-2 hover:bg-[#c9a84c]/10",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[4px]
        font-medium text-sm cursor-pointer whitespace-nowrap transition-colors duration-200
        ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}