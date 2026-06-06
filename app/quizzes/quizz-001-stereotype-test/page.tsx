import { getRecentResults } from "@/lib/db/results";
import QuizClient from "./QuizClient";

export default function QuizPage() {
  let recentResults: Awaited<ReturnType<typeof getRecentResults>> = [];
  try {
    recentResults = getRecentResults("quizz-001-stereotype-test", 7);
  } catch {
    // DB not yet initialised — first run before migrations
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="flex-1">
      <QuizClient recentResults={recentResults} today={today} />
    </main>
  );
}
