import Tag from "@/components/shared/Tag";

interface TypeMeta {
  id: string;
  name: string;
}

interface ResultRowProps {
  date: string;
  matchedTypes: string[];
  typeMeta: TypeMeta[];
  isLast?: boolean;
}

export default function ResultRow({
  date,
  matchedTypes,
  typeMeta,
  isLast,
}: ResultRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "0.6rem 0",
        borderBottom: isLast ? "none" : "1px solid var(--color-border)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--color-text-muted)",
          minWidth: "90px",
        }}
      >
        {date}
      </span>

      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {matchedTypes.length === 0 ? (
          <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            ไม่มีประเภทที่ตรง
          </span>
        ) : (
          matchedTypes.map((typeId) => {
            const meta = typeMeta.find((t) => t.id === typeId);
            return (
              <Tag key={typeId} variant="accent">
                {typeId} · {meta?.name ?? typeId}
              </Tag>
            );
          })
        )}
      </div>
    </div>
  );
}
