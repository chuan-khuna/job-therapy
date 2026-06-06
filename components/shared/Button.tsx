import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--color-text)", color: "var(--color-bg)", border: "none", fontWeight: 500 },
  ghost:   { background: "transparent", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" },
  danger:  { background: "var(--color-destructive)", color: "var(--color-destructive-fg)", border: "none", fontWeight: 500 },
};

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: "5px 12px", fontSize: "12px" },
  md: { padding: "7px 16px", fontSize: "13px" },
};

export default function Button({ variant = "ghost", size = "md", disabled, style, children, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: "6px", fontFamily: "var(--font-sans)",
        cursor: disabled ? "default" : "pointer",
        transition: "opacity 0.15s, background 0.15s",
        opacity: disabled ? 0.45 : 1,
        ...variants[variant], ...sizes[size], ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
