import { HTMLAttributes } from "react";

interface SectionLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  ruled?: boolean;
}

export default function SectionLabel({
  ruled = true,
  style,
  children,
  ...props
}: SectionLabelProps) {
  return (
    <p
      style={{
        fontSize: "10px",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--color-text-muted)",
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
