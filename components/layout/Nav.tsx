import Link from "next/link";
import AuthButton from "./AuthButton";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Nav() {
  return (
    <nav
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--color-ink)",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Job Therapy
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted)",
              textDecoration: "none",
              transition: "color 120ms",
            }}
          >
            แบบประเมิน
          </Link>
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
