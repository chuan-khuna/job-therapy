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
      className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start md:min-h-[calc(100vh-120px)] md:grid-cols-[1fr_var(--right-w)]"
      style={{ "--right-w": rightWidth } as React.CSSProperties}
    >
      <div className="md:border-r md:border-[var(--color-border)]">{left}</div>
      <div className="border-t border-[var(--color-border)] md:border-t-0">
        {right}
      </div>
    </div>
  );
}
