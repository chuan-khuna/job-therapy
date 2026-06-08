import Link from "next/link";
import Tag from "@/components/shared/Tag";

interface QuizCardProps {
  href: string;
  historyHref?: string;
  name: string;
  description: string;
  questionCount: number;
  typeCount?: number;
  lastDate?: string | null;
}

export default function QuizCard({
  href,
  historyHref,
  name,
  description,
  questionCount,
  typeCount,
  lastDate,
}: QuizCardProps) {
  return (
    <div className="card card-link" style={{ padding: "1.25rem 1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Link href={href} style={{ textDecoration: "none", flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "4px",
            }}
          >
            {name}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted)",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </Link>

        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "6px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-muted)",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            {questionCount} คำถาม
            {typeCount ? ` · ${typeCount} ประเภท` : ""}
          </p>
          {lastDate && <Tag variant="accent">ล่าสุด {lastDate}</Tag>}
          {historyHref && (
            <Link href={historyHref} className="btn btn-ghost btn-sm">
              ประวัติ
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
