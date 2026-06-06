import { HTMLAttributes } from "react";

type TagVariant = "default" | "accent" | "muted";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

const variants: Record<TagVariant, React.CSSProperties> = {
  default: { background: "var(--color-border)", color: "var(--color-text-muted)" },
  accent:  { background: "var(--color-accent-subtle)", color: "var(--color-accent)" },
  muted:   { background: "var(--color-surface)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" },
};

export default function Tag({ variant = "default", style, children, ...props }: TagProps) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        fontSize: "10px", fontFamily: "var(--font-mono)",
        padding: "2px 6px", borderRadius: "3px", lineHeight: 1.4,
        ...variants[variant], ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
