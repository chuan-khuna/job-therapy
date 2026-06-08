import { getDb } from "./client";

export interface QuizResult {
  id: number;
  quiz_id: string;
  date: string;
  answers: Record<string, unknown>;
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

// answers is any JSON-serialisable shape — each quiz defines its own
export function saveQuizResult(params: {
  quizId: string;
  date: string;
  answers: unknown;
  matchedTypes: string[];
}) {
  const db = getDb();
  db.prepare(
    `INSERT INTO quiz_results (quiz_id, date, answers, matched_types)
     VALUES (?, ?, ?, ?)`,
  ).run(
    params.quizId,
    params.date,
    JSON.stringify(params.answers),
    JSON.stringify(params.matchedTypes),
  );
}

export function getRecentResults(quizId: string, limit = 7): QuizResult[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM quiz_results
       WHERE quiz_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .all(quizId, limit) as RawRow[];
  return rows.map(parseRow);
}

export function getAllResults(quizId: string): QuizResult[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM quiz_results
       WHERE quiz_id = ?
       ORDER BY created_at DESC`,
    )
    .all(quizId) as RawRow[];
  return rows.map(parseRow);
}

export function updateResultAnswers(
  quizId: string,
  id: number,
  answers: unknown,
) {
  const db = getDb();
  db.prepare(
    `UPDATE quiz_results SET answers = ? WHERE quiz_id = ? AND id = ?`,
  ).run(JSON.stringify(answers), quizId, id);
}

export function deleteResult(quizId: string, id: number) {
  const db = getDb();
  db.prepare(`DELETE FROM quiz_results WHERE quiz_id = ? AND id = ?`).run(
    quizId,
    id,
  );
}

export function getLastResultStamp(
  quizId: string,
): { date: string; created_at: string } | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT date, created_at FROM quiz_results WHERE quiz_id = ? ORDER BY created_at DESC LIMIT 1`,
    )
    .get(quizId) as { date: string; created_at: string } | undefined;
  return row ?? null;
}
