import Link from "next/link";
import { connection } from "next/server";
import PageHeader from "@/components/layout/PageHeader";
import { getAllResults } from "@/lib/db/results";
import { QUIZ_ID, QUIZ_NAME } from "../quiz-def";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  await connection(); // read the DB at request time, not at build

  let results: Awaited<ReturnType<typeof getAllResults>> = [];
  try {
    results = await getAllResults(QUIZ_ID);
  } catch {
    // DB not yet initialised — first run before migrations
  }

  return (
    <main className="flex-1">
      <PageHeader
        title="ประวัติการทำแบบประเมิน"
        subtitle={QUIZ_NAME}
        right={
          <Link href={`/quizzes/${QUIZ_ID}`} className="btn btn-ghost btn-sm">
            ทำแบบประเมิน
          </Link>
        }
      />
      <HistoryClient results={results} />
    </main>
  );
}
