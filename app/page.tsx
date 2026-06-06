import PageHeader from "@/components/layout/PageHeader";
import QuizCard from "@/components/home/QuizCard";
import SectionLabel from "@/components/shared/SectionLabel";
import { getLastResultDate } from "@/lib/db/results";

const QUIZZES = [
  {
    id: "quizz-001-stereotype-test",
    slug: "quizz-001-stereotype-test",
    name: "คุณเป็นคนทำงานประเภทไหน",
    description: "ค้นหา stereotype ของคุณใน 5 ประเภทหลัก จาก 11 คำถาม",
    questionCount: 11,
    typeCount: 5,
  },
];

export default function HomePage() {
  const lastDates = QUIZZES.map((q) => {
    try { return getLastResultDate(q.id); }
    catch { return null; }
  });

  return (
    <main className="flex-1">
      <PageHeader
        title="Job Therapy"
        subtitle="แบบประเมินตนเองเพื่อค้นพบสัญญาณความไม่สอดคล้องในการทำงาน"
        source="อิงจาก Job Therapy โดย Tessa West"
      />

      <div style={{ padding: "2rem", maxWidth: "640px" }}>
        <SectionLabel style={{ marginBottom: "1.25rem" }}>แบบประเมิน</SectionLabel>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
    </main>
  );
}
