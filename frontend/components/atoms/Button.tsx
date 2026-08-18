'use client'

import { ReactNode } from "react";
import Link from "next/link";
import { GlassButton } from "@/components/atoms/GlassButton";

/** HIG: prominent (glassProminent) vs glass vs quieter styles. Destructive is never primary. */
type ButtonVariant = "primary" | "glass" | "outline" | "ghost" | "destructive";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  href?: string;
  "aria-label"?: string;
}

const base = "bg-[#0071e3] hover:bg-[#0076df] active:bg-[#006edb] px-[11px] py-1 min-w-[45px] mx-2.5 my-2.5 text-[12px] leading-[1.3333733333] transition-colors duration-(--transition-fast) ease-standard font-normal tracking-[-0.01em] font-apple -translate-y-1";

const variantStyles: Record<Exclude<ButtonVariant, "glass">, string> = {
  primary: "bg-primary text-on-primary border border-transparent rounded-[940px]",
  outline: "bg-transparent text-heading-ink border border-outline hover:bg-surface-container",
  ghost: "bg-transparent text-heading-ink border border-transparent hover:bg-surface-container",
  destructive: "bg-error text-on-error border border-transparent",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  href,
  "aria-label": ariaLabel,
}: ButtonProps) {
  if (variant === "glass") {
    return (
      <GlassButton type={type} onClick={onClick} className={className} aria-label={ariaLabel}>
        {children}
      </GlassButton>
    );
  }

  const classes = `${base} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </button>
  );
}
