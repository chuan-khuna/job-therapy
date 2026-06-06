import Link from "next/link";
import Tag from "@/components/shared/Tag";

interface QuizCardProps {
  href: string;
  name: string;
  description: string;
  questionCount: number;
  typeCount: number;
  lastDate?: string | null;
}

export default function QuizCard({
  href,
  name,
  description,
  questionCount,
  typeCount,
  lastDate,
}: QuizCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <div className="card card-link" style={{ padding: "1.25rem 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
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
          </div>

          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <p
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              {questionCount} คำถาม · {typeCount} ประเภท
            </p>
            {lastDate && (
              <Tag variant="accent" style={{ marginTop: "6px" }}>
                ล่าสุด {lastDate}
              </Tag>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
