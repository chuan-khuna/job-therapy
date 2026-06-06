"use client";

interface ChoiceGroupProps {
  value?: boolean;
  yesLabel?: string;
  noLabel?: string;
  onChange: (val: boolean | null) => void;
}

const compact: React.CSSProperties = {
  padding: "5px 16px",
  fontSize: "13px",
  minWidth: "54px",
  textAlign: "center",
};

export default function ChoiceGroup({
  value,
  yesLabel = "ใช่",
  noLabel = "ไม่",
  onChange,
}: ChoiceGroupProps) {
  // Clicking the already-selected choice clears the answer
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <button
        className={`option-btn ${value === true ? "selected" : ""}`}
        style={compact}
        onClick={() => onChange(value === true ? null : true)}
      >
        {yesLabel}
      </button>
      <button
        className={`option-btn option-destructive ${value === false ? "selected-destructive" : ""}`}
        style={compact}
        onClick={() => onChange(value === false ? null : false)}
      >
        {noLabel}
      </button>
    </div>
  );
}
