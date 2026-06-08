"use server";

import { saveQuizResult } from "@/lib/api/results";

export async function saveResult(params: {
  answers: Record<number, boolean>;
  matchedTypes: string[];
  date: string;
}) {
  await saveQuizResult({
    quizId: "quiz-001-stereotype-test",
    date: params.date,
    answers: params.answers,
    matchedTypes: params.matchedTypes,
  });
}
