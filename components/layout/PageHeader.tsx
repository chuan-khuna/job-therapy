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
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
              marginBottom: subtitle ? "4px" : 0,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              {subtitle}
            </p>
          )}
          {source && (
            <p
              style={{
                marginTop: "4px",
                fontSize: "11px",
                color: "var(--color-text-muted)",
                fontStyle: "italic",
              }}
            >
              {source}
            </p>
          )}
        </div>

        {right && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
              paddingTop: "2px",
            }}
          >
            {right}
          </div>
        )}
      </div>
    </header>
  );
}
