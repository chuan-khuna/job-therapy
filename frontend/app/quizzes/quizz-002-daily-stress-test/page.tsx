import { connection } from "next/server";
import { getRecentResults } from "@/lib/db/results";
import { QUIZ_ID } from "./quiz-def";
import QuizClient from "./QuizClient";

export default async function QuizPage() {
  await connection(); // read the DB at request time, not at build

  let recentResults: Awaited<ReturnType<typeof getRecentResults>> = [];
  try {
    recentResults = await getRecentResults(QUIZ_ID, 7);
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
