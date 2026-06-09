import Link from "next/link";
import Tag from "@/components/shared/Tag";

interface ReflectionCardProps {
  href: string;
  historyHref?: string;
  name: string;
  description: string;
  questionCount: number;
  typeCount?: number;
  tags?: string[];
  lastDate?: string | null;
}

export default function ReflectionCard({
  href,
  historyHref,
  name,
  description,
  questionCount,
  typeCount,
  tags,
  lastDate,
}: ReflectionCardProps) {
  return (
    <div
      className="card card-link"
      style={{
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Link
        href={href}
        style={{ textDecoration: "none", display: "block", flex: 1 }}
      >
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
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {questionCount} คำถาม
          {typeCount ? ` · ${typeCount} ประเภท` : ""}
        </p>

        {((tags && tags.length > 0) || lastDate) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {tags?.map((tag) => (
              <Tag key={tag} variant="surface">
                {tag}
              </Tag>
            ))}
            {lastDate && <Tag variant="accent">ล่าสุด {lastDate}</Tag>}
          </div>
        )}

        {historyHref && (
          <Link
            href={historyHref}
            className="btn btn-ghost btn-sm"
            style={{ alignSelf: "flex-start" }}
          >
            ประวัติ
          </Link>
        )}
      </div>
    </div>
  );
}
