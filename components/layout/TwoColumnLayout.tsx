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
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        display: "grid",
        gridTemplateColumns: `1fr ${rightWidth}`,
        minHeight: "calc(100vh - 120px)",
        alignItems: "start",
      }}
    >
      <div style={{ borderRight: "1px solid var(--color-border)" }}>{left}</div>
      <div>{right}</div>
    </div>
  );
}
