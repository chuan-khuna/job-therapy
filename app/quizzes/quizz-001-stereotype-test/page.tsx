import { connection } from "next/server";
import { getRecentResults } from "@/lib/db/results";
import QuizClient from "./QuizClient";

export default async function QuizPage() {
  await connection(); // read the DB at request time, not at build

  let recentResults: Awaited<ReturnType<typeof getRecentResults>> = [];
  try {
    recentResults = await getRecentResults("quizz-001-stereotype-test", 7);
  } catch {
    // Not signed in or Supabase unavailable — render with no history
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="flex-1">
      <QuizClient recentResults={recentResults} today={today} />
    </main>
  );
}
