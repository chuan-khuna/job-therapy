"use server";

import { saveQuizResult } from "@/lib/db/results";
import { QUIZ_ID, type StressAnswers } from "./quiz-def";

export async function saveResult(params: {
  answers: StressAnswers;
  date: string;
}) {
  await saveQuizResult({
    quizId: QUIZ_ID,
    date: params.date,
    answers: params.answers,
    matchedTypes: [],
  });
}
