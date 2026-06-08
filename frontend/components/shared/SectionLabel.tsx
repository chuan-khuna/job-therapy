import { HTMLAttributes } from "react";

interface SectionLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  ruled?: boolean;
  size?: "sm" | "lg";
}

export default function SectionLabel({
  ruled = true,
  size = "sm",
  style,
  children,
  ...props
}: SectionLabelProps) {
  return (
    <p
      style={{
        fontSize: size === "lg" ? "13px" : "10px",
        fontFamily: "var(--font-mono)",
        fontWeight: size === "lg" ? 500 : undefined,
        letterSpacing: size === "lg" ? "0.1em" : "0.12em",
        textTransform: "uppercase",
        color: size === "lg" ? "var(--color-text)" : "var(--color-text-muted)",
        paddingBottom: ruled ? "0.75rem" : undefined,
        borderBottom: ruled ? "1px solid var(--color-border)" : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
}
