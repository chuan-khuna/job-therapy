interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  rightWidth?: string;
}

export default function TwoColumnLayout({
  left,
  right,
  rightWidth = "300px",
}: TwoColumnLayoutProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `1fr ${rightWidth}`,
        minHeight: "calc(100vh - 96px)",
        alignItems: "start",
      }}
    >
      <div style={{ borderRight: "1px solid var(--color-border)" }}>{left}</div>
      <div>{right}</div>
    </div>
  );
}
