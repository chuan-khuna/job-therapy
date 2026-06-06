import SectionLabel from "@/components/shared/SectionLabel";
import Button from "@/components/shared/Button";
import TypeCard from "./TypeCard";

interface QuizType {
  id: string;
  name: string;
  keys: number[];
  matched: boolean;
  partial: boolean;
  matchedKeys: number[];
  note?: string | null;
}

interface TypesPanelProps {
  types: QuizType[];
  answeredCount: number;
  onSave: () => void;
  saving?: boolean;
  saved?: boolean;
  savedDate?: string;
}

export default function TypesPanel({
  types,
  answeredCount,
  onSave,
  saving,
  saved,
  savedDate,
}: TypesPanelProps) {
  return (
    <div
      style={{
        padding: "2rem 1.5rem",
        position: "sticky",
        top: 0,
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <SectionLabel style={{ marginBottom: "1rem" }}>
        ประเภทคนทำงาน
      </SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {types.map((t) => (
          <TypeCard
            key={t.id}
            name={t.name}
            keys={t.keys}
            matchedKeys={t.matchedKeys}
            state={t.matched ? "matched" : t.partial ? "partial" : "idle"}
            note={t.note}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Button
          variant="primary"
          disabled={answeredCount === 0 || saving}
          onClick={onSave}
          style={{ width: "100%" }}
        >
          {saving ? "กำลังบันทึก…" : "บันทึกผล"}
        </Button>
        {saved && savedDate && (
          <p
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "var(--color-accent)",
              textAlign: "center",
            }}
          >
            บันทึกแล้ว {savedDate}
          </p>
        )}
      </div>
    </div>
  );
}
