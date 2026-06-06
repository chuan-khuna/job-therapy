import QuizCard from "@/components/home/QuizCard";
import SectionLabel from "@/components/shared/SectionLabel";
import { QUIZZES } from "@/data/quizzes";
import { getLastResultDate } from "@/lib/db/results";

export default function HomePage() {
  const lastDates = QUIZZES.map((q) => {
    try {
      return getLastResultDate(q.id);
    } catch {
      return null;
    }
  });

  return (
    <main className="flex-1">
      {/* Hero */}
      <section
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "5rem 2rem 4rem",
          }}
        >
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

      {/* Quiz list */}
      <section>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3rem 2rem",
          }}
        >
          <SectionLabel style={{ marginBottom: "1.5rem" }}>
            แบบประเมิน
          </SectionLabel>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "680px",
            }}
          >
            {QUIZZES.map((quiz, i) => (
              <QuizCard
                key={quiz.id}
                href={`/quizzes/${quiz.slug}`}
                name={quiz.name}
                description={quiz.description}
                questionCount={quiz.questionCount}
                typeCount={quiz.typeCount}
                lastDate={lastDates[i]}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
