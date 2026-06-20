import { type ReactNode } from "react";

/**
 * Brand wordmark for "Weld Yard". Applies the Rakkas display font and brand color.
 * Use anywhere the literal brand name is rendered. Do NOT use for custom tenant branding names.
 */
export function Wordmark({ className = "", children = "Weld Yard" }: { className?: string; children?: ReactNode }) {
  return <span className={`brand-wordmark ${className}`}>{children}</span>;
}
