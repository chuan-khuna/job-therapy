"use client";

interface ChoiceGroupProps {
  value?: boolean;
  yesLabel?: string;
  noLabel?: string;
  onChange: (val: boolean) => void;
}

function btn(selected: boolean): React.CSSProperties {
  return {
    padding: "5px 16px", borderRadius: "5px",
    border: `1px solid ${selected ? "var(--color-text)" : "var(--color-border-strong)"}`,
    background: selected ? "var(--color-text)" : "var(--color-surface)",
    color: selected ? "var(--color-bg)" : "var(--color-text)",
    fontFamily: "var(--font-sans)", fontSize: "13px",
    fontWeight: selected ? 500 : 400,
    cursor: "pointer", minWidth: "54px", textAlign: "center",
    transition: "all 0.1s",
  };
}

export default function ChoiceGroup({ value, yesLabel = "ใช่", noLabel = "ไม่", onChange }: ChoiceGroupProps) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <button style={btn(value === true)} onClick={() => onChange(true)}>{yesLabel}</button>
      <button style={btn(value === false)} onClick={() => onChange(false)}>{noLabel}</button>
    </div>
  );
}
