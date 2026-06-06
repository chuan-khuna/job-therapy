import Link from "next/link";
import QuizCard from "@/components/home/QuizCard";
import SectionLabel from "@/components/shared/SectionLabel";
import { QUIZZES } from "@/data/quizzes";
import { getArticles } from "@/lib/articles";
import { getLastResultStamp } from "@/lib/db/results";

// created_at is sqlite datetime('now') — UTC "YYYY-MM-DD HH:MM:SS"
function formatStamp(stamp: { date: string; created_at: string }): string {
  const d = new Date(stamp.created_at.replace(" ", "T") + "Z");
  const time = d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${stamp.date} · ${time}`;
}

export default async function HomePage() {
  const lastDates = QUIZZES.map((q) => {
    try {
      const stamp = getLastResultStamp(q.id);
      return stamp ? formatStamp(stamp) : null;
    } catch {
      return null;
    }
  });

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
            อิงจาก Job Therapy · Tessa West
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
            ค้นพบสัญญาณ
            <br />
            ความไม่สอดคล้องในการทำงาน
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              maxWidth: "480px",
            }}
          >
            แบบประเมินตนเองที่ช่วยให้คุณรู้จักตัวเองในมิติของการทำงาน
            ก่อนที่ปัญหาจะใหญ่เกินแก้
          </p>
        </div>
      </section>

      {/* Quizzes (60) + Articles (40) */}
      <section>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div>
            <SectionLabel style={{ marginBottom: "1.5rem" }}>
              แบบประเมิน
            </SectionLabel>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {QUIZZES.map((quiz, i) => (
                <QuizCard
                  key={quiz.id}
                  href={`/quizzes/${quiz.slug}`}
                  historyHref={`/quizzes/${quiz.slug}/history`}
                  name={quiz.name}
                  description={quiz.description}
                  questionCount={quiz.questionCount}
                  typeCount={quiz.typeCount}
                  lastDate={lastDates[i]}
                />
              ))}
            </div>
          </div>

          <div>
            <SectionLabel style={{ marginBottom: "1.5rem" }}>
              บทความ
            </SectionLabel>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
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
        </div>
      </section>
    </main>
  );
}
