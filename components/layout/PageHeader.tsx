import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  source?: string;
  right?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, source, right }: PageHeaderProps) {
  return (
    <header
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        padding: "1.5rem 2rem",
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: "2rem",
      }}
    >
      <div>
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              fontSize: "20px", fontWeight: 500,
              letterSpacing: "-0.01em", color: "var(--color-text)", marginBottom: "3px",
            }}
          >
            {title}
          </h1>
        </Link>
        {subtitle && (
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
        {source && (
          <p style={{ marginTop: "5px", fontSize: "11px", color: "var(--color-text-muted)", fontStyle: "italic" }}>
            {source}
          </p>
        )}
      </div>

      {right && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, paddingTop: "2px" }}>
          {right}
        </div>
      )}
    </header>
  );
}
