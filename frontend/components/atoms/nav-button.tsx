"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface NavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  label: string;
}

/**
 * Shared visual language with the rest of the spec sheet: hard 2px ink
 * border, offset drop shadow, and a press that collapses the shadow so
 * the button reads as physically depressed rather than just dimmed.
 */
export function NavButton({ direction, onClick, disabled, children, label }: NavButtonProps) {
  const isNext = direction === "next";

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { x: 2, y: 2 }}
      whileTap={disabled ? undefined : { x: 4, y: 4, boxShadow: "0px 0px 0px 0px #1a1a1a" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={[
        "flex h-12 w-12 z-20 items-center justify-center border-2 border-heading-ink transition-colors",
        isNext ? "bg-primary text-white" : "bg-white text-heading-ink",
        disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer",
      ].join(" ")}
      style={{ boxShadow: disabled ? "none" : "4px 4px 0px 0px #1a1a1a" }}
    >
      {children}
    </motion.button>
  );
}
