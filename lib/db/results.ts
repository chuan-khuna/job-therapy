import { getDb } from "./client";

export interface QuizResult {
  id: number;
  quiz_id: string;
  date: string;
  answers: Record<string, boolean>;
  matched_types: string[];
  created_at: string;
}

interface RawRow {
  id: number;
  quiz_id: string;
  date: string;
  answers: string;
  matched_types: string;
  created_at: string;
}

function parseRow(row: RawRow): QuizResult {
  return {
    ...row,
    answers: JSON.parse(row.answers),
    matched_types: JSON.parse(row.matched_types),
  };
}

export function saveQuizResult(params: {
  quizId: string;
  date: string;
  answers: Record<number, boolean>;
  matchedTypes: string[];
}) {
  const db = getDb();
  db.prepare(
    `INSERT INTO quiz_results (quiz_id, date, answers, matched_types)
     VALUES (?, ?, ?, ?)`
  ).run(
    params.quizId,
    params.date,
    JSON.stringify(params.answers),
    JSON.stringify(params.matchedTypes)
  );
}

export function getRecentResults(quizId: string, limit = 7): QuizResult[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM quiz_results
       WHERE quiz_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .all(quizId, limit) as RawRow[];
  return rows.map(parseRow);
}

export function getLastResultDate(quizId: string): string | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT date FROM quiz_results WHERE quiz_id = ? ORDER BY created_at DESC LIMIT 1`
    )
    .get(quizId) as { date: string } | undefined;
  return row?.date ?? null;
}
