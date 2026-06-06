import { HTMLAttributes } from "react";

type TagVariant = "default" | "accent" | "ink" | "surface";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

const variantClass: Record<TagVariant, string> = {
  default: "",
  accent: "badge-accent",
  ink: "badge-ink",
  surface: "badge-surface",
};

export default function Tag({
  variant = "default",
  className,
  style,
  children,
  ...props
}: TagProps) {
  const classes = ["badge", variantClass[variant], className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <span
      className={classes}
      style={{
        fontSize: "10px",
        padding: "2px 8px",
        lineHeight: 1.5,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
