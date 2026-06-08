"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const LIGHT = "warm-paper";
const DARK = "night-matcha";

// Toggles data-theme on <html>; persisted in localStorage,
// applied pre-paint by the inline script in app/layout.tsx
export default function ThemeSwitcher() {
  // null until mounted — avoids a hydration mismatch on the icon
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme ?? LIGHT);
  }, []);

  function toggle() {
    const next = theme === DARK ? LIGHT : DARK;
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      aria-label={theme === DARK ? "สลับเป็นธีมสว่าง" : "สลับเป็นธีมมืด"}
      title={theme === DARK ? "ธีมสว่าง" : "ธีมมืด"}
      onClick={toggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px",
        lineHeight: 0,
        color: "var(--color-text-muted)",
        transition: "color 120ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-text)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-text-muted)";
      }}
    >
      {theme === DARK ? (
        <Sun size={16} strokeWidth={2} />
      ) : (
        <Moon size={16} strokeWidth={2} />
      )}
    </button>
  );
}
