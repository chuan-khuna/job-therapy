import { prisma } from "./client";

export interface QuizResult {
  id: number;
  quiz_id: string;
  date: string;
  answers: Record<string, unknown>;
  matched_types: string[];
  created_at: string;
}

// Prisma row shape (camelCase) → the snake_case QuizResult the UI consumes.
// answers / matched_types are stored as JSON-in-TEXT, parsed at this boundary.
interface PrismaRow {
  id: number;
  quizId: string;
  date: string;
  answers: string;
  matchedTypes: string;
  createdAt: string;
}

function toResult(row: PrismaRow): QuizResult {
  return {
    id: row.id,
    quiz_id: row.quizId,
    date: row.date,
    answers: JSON.parse(row.answers),
    matched_types: JSON.parse(row.matchedTypes),
    created_at: row.createdAt,
  };
}

// answers is any JSON-serialisable shape — each quiz defines its own
export async function saveQuizResult(params: {
  quizId: string;
  date: string;
  answers: unknown;
  matchedTypes: string[];
}) {
  await prisma.quizResult.create({
    data: {
      quizId: params.quizId,
      date: params.date,
      answers: JSON.stringify(params.answers),
      matchedTypes: JSON.stringify(params.matchedTypes),
    },
  });
}

export async function getRecentResults(
  quizId: string,
  limit = 7,
): Promise<QuizResult[]> {
  const rows = await prisma.quizResult.findMany({
    where: { quizId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toResult);
}

export async function getAllResults(quizId: string): Promise<QuizResult[]> {
  const rows = await prisma.quizResult.findMany({
    where: { quizId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toResult);
}

export async function updateResultAnswers(
  quizId: string,
  id: number,
  answers: unknown,
) {
  await prisma.quizResult.updateMany({
    where: { quizId, id },
    data: { answers: JSON.stringify(answers) },
  });
}

export async function deleteResult(quizId: string, id: number) {
  await prisma.quizResult.deleteMany({ where: { quizId, id } });
}

export async function getLastResultStamp(
  quizId: string,
): Promise<{ date: string; created_at: string } | null> {
  const row = await prisma.quizResult.findFirst({
    where: { quizId },
    orderBy: { createdAt: "desc" },
    select: { date: true, createdAt: true },
  });
  return row ? { date: row.date, created_at: row.createdAt } : null;
}
