import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "ink" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  ink: "btn-ink",
  danger: "btn-destructive",
};

export default function Button({ variant = "ghost", size = "md", className, children, ...props }: ButtonProps) {
  const classes = ["btn", variantClass[variant], size === "sm" ? "btn-sm" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
