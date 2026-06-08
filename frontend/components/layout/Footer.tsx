import Link from "next/link";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 2rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--color-ink)",
            letterSpacing: "-0.02em",
          }}
        >
          {site.name}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {site.footer.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 120ms",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <span
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {site.footer.note}
        </span>
      </div>
    </footer>
  );
}
