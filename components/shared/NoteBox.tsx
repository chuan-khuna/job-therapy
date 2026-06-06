import { HTMLAttributes } from "react";

type NoteVariant = "hint" | "accent";

interface NoteBoxProps extends HTMLAttributes<HTMLDivElement> {
  variant?: NoteVariant;
}

const variants: Record<NoteVariant, React.CSSProperties> = {
  hint:   { background: "var(--color-surface)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" },
  accent: { background: "var(--color-accent-subtle)", color: "var(--color-accent)" },
};

export default function NoteBox({ variant = "hint", style, children, ...props }: NoteBoxProps) {
  return (
    <div
      style={{
        fontSize: "12px", lineHeight: 1.55,
        borderRadius: "4px", padding: "5px 9px",
        ...variants[variant], ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
