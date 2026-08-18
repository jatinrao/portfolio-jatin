"use client";

import type { ReactNode } from "react";
import { GlassButton } from "@/components/atoms/GlassButton";

export interface NavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  label: string;
}

/** Circular HIG button — GlassButton with a 44pt hit target. */
export function NavButton({ onClick, disabled, children, label }: NavButtonProps) {
  return (
    <GlassButton
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={["hig-circle-button", disabled ? "is-disabled" : ""].join(" ")}
    >
      {children}
    </GlassButton>
  );
}
