import { HTMLAttributes } from "react";

type TagVariant = "default" | "accent" | "ink" | "surface" | "neutral";

// shadcn badge — base + variant classes, themed via CSS variables
const base =
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 " +
  "whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium";

const variantClass: Record<TagVariant, string> = {
  default:
    "border-transparent bg-[oklch(90%_0.02_142)] text-[var(--color-text-muted)]",
  accent:
    "border-transparent bg-[var(--color-accent-subtle)] text-[var(--color-accent-hover)]",
  ink: "border-transparent bg-[var(--color-ink)] text-[var(--color-surface-raised)]",
  surface:
    "border-[oklch(80%_0.038_148_/_0.5)] bg-[var(--color-surface-raised)] text-[var(--color-accent-hover)]",
  /* answer values — no accent tint */
  neutral:
    "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text)]",
};

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

export default function Tag({
  variant = "default",
  className,
  children,
  ...props
}: TagProps) {
  const classes = [base, variantClass[variant], className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
