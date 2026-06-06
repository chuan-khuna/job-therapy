import Tag from "@/components/shared/Tag";
import StatusDot from "@/components/shared/StatusDot";
import NoteBox from "@/components/shared/NoteBox";

type CardState = "idle" | "partial" | "matched";

interface TypeCardProps {
  name: string;
  keys: number[];
  matchedKeys?: number[];
  state?: CardState;
  note?: string | null;
}

const cardStyle: Record<CardState, React.CSSProperties> = {
  idle:    { border: "1px solid var(--color-border)",       background: "var(--color-bg)",      opacity: 0.38 },
  partial: { border: "1px solid var(--color-border-strong)", background: "var(--color-bg)",     opacity: 0.65 },
  matched: { border: "1px solid var(--color-text)",          background: "var(--color-surface)", opacity: 1 },
};

export default function TypeCard({ name, keys, matchedKeys = [], state = "idle", note }: TypeCardProps) {
  return (
    <div style={{ borderRadius: "8px", padding: "0.9rem 1rem", transition: "opacity 0.2s, border-color 0.2s, background 0.2s", ...cardStyle[state] }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text)", lineHeight: 1.4 }}>
          {name}
        </span>
        <StatusDot state={state === "matched" ? "active" : state === "partial" ? "partial" : "idle"} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "7px" }}>
        {keys.map((k) => (
          <Tag key={k} variant={matchedKeys.includes(k) ? "accent" : "default"}>ข้อ {k}</Tag>
        ))}
      </div>

      {note && (
        <NoteBox variant="accent" style={{ marginTop: "8px", fontSize: "11px" }}>{note}</NoteBox>
      )}
    </div>
  );
}
