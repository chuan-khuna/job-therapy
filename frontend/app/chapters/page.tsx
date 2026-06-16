import Link from "next/link";
import SectionLabel from "@/components/shared/SectionLabel";
import { getChapters } from "@/lib/chapters";

export default async function ChaptersPage() {
  const chapters = await getChapters();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-12">
        <p
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            ← หน้าแรก
          </Link>
        </p>

        <SectionLabel style={{ marginBottom: "1.5rem" }}>บท</SectionLabel>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.length === 0 && (
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
              ยังไม่มีบท
            </p>
          )}
          {chapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/chapters/${chapter.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div className="card card-link" style={{ padding: "1rem 1.25rem" }}>
                <p
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.04em",
                    marginBottom: "4px",
                  }}
                >
                  บทที่ {chapter.order}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                  }}
                >
                  {chapter.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
