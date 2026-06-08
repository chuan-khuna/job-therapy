"use client";

import NoteBox from "@/components/shared/NoteBox";
import ChoiceGroup from "./ChoiceGroup";

interface QuestionRowProps {
  id: number;
  text: string;
  note?: string | null;
  showNote?: boolean;
  value?: boolean;
  isLast?: boolean;
  onChange: (val: boolean | null) => void;
}

export default function QuestionRow({
  id,
  text,
  note,
  showNote,
  value,
  isLast,
  onChange,
}: QuestionRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "0.7rem 0",
        borderBottom: isLast ? "none" : "1px solid var(--color-border)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--color-text-muted)",
          minWidth: "20px",
          paddingTop: "2px",
        }}
      >
        {String(id).padStart(2, "0")}
      </span>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.65,
            color: "var(--color-text)",
            marginBottom: "8px",
          }}
        >
          {text}
        </p>
        {note && showNote && (
          <NoteBox variant="hint" style={{ marginBottom: "8px" }}>
            {note}
          </NoteBox>
        )}
        <ChoiceGroup value={value} onChange={onChange} />
      </div>
    </div>
  );
}
