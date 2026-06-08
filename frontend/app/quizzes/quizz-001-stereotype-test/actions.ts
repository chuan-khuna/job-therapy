"use server";

import { saveQuizResult } from "@/lib/db/results";

export async function saveResult(params: {
  answers: Record<number, boolean>;
  matchedTypes: string[];
  date: string;
}) {
  await saveQuizResult({
    quizId: "quizz-001-stereotype-test",
    date: params.date,
    answers: params.answers,
    matchedTypes: params.matchedTypes,
  });
}
