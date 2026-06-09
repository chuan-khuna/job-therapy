import Link from "next/link";
import ReflectionCard from "@/components/home/ReflectionCard";
import SectionLabel from "@/components/shared/SectionLabel";
import { reflections } from "@/data/reflections";
import { site } from "@/data/site";
import { getArticles } from "@/lib/articles";
import { getLastResultStamp } from "@/lib/api/results";

// created_at is an ISO 8601 UTC timestamp from the backend
function formatStamp(stamp: { date: string; created_at: string }): string {
  const d = new Date(stamp.created_at);
  const time = d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${stamp.date} · ${time}`;
}

export default async function HomePage() {
  const lastDates = await Promise.all(
    reflections.map(async (q) => {
      try {
        const stamp = await getLastResultStamp(q.id);
        return stamp ? formatStamp(stamp) : null;
      } catch {
        return null;
      }
    }),
  );

  const articles = await getArticles();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <div className="mx-auto max-w-[1200px] px-5 pt-12 pb-10 sm:px-8 sm:pt-20 sm:pb-16">
          <p
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            {site.hero.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              maxWidth: "680px",
              marginBottom: "1.25rem",
            }}
          >
            {site.hero.headline.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              maxWidth: "480px",
            }}
          >
            {site.hero.subhead}
          </p>
        </div>
      </section>

      {/* Reflections */}
      <section>
        <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-12">
          <SectionLabel style={{ marginBottom: "1.5rem" }}>
            แบบประเมิน
          </SectionLabel>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reflections.map((reflection, i) => (
              <ReflectionCard
                key={reflection.id}
                href={`/reflections/${reflection.slug}`}
                historyHref={`/reflections/${reflection.slug}/history`}
                name={reflection.name}
                description={reflection.description}
                questionCount={reflection.questionCount}
                typeCount={reflection.typeCount}
                tags={reflection.tags}
                lastDate={lastDates[i]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section>
        <div className="mx-auto max-w-[1200px] px-5 pb-8 sm:px-8 sm:pb-12">
          <SectionLabel style={{ marginBottom: "1.5rem" }}>บทความ</SectionLabel>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.length === 0 && (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-muted)",
                }}
              >
                ยังไม่มีบทความ
              </p>
            )}
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card card-link"
                  style={{ padding: "1rem 1.25rem" }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      marginBottom: "4px",
                    }}
                  >
                    {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                        lineHeight: 1.5,
                        marginBottom: a.date ? "6px" : 0,
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                  {a.date && (
                    <p
                      style={{
                        fontSize: "10px",
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-text-muted)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {a.date}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
