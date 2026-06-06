import { HTMLAttributes } from "react";

type DotState = "idle" | "partial" | "active";

interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  state?: DotState;
}

const colors: Record<DotState, string> = {
  idle:    "var(--color-border)",
  partial: "var(--color-border-strong)",
  active:  "var(--color-accent)",
};

export default function StatusDot({ state = "idle", style, ...props }: StatusDotProps) {
  return (
    <span
      style={{
        display: "inline-block", width: "7px", height: "7px",
        borderRadius: "50%", flexShrink: 0,
        background: colors[state], transition: "background 0.2s",
        ...style,
      }}
      {...props}
    />
  );
}
