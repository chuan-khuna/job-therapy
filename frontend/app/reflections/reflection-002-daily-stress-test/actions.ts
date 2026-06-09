"use server";

import { saveReflectionResult } from "@/lib/api/results";
import { QUIZ_ID, type StressAnswers } from "./quiz-def";

export async function saveResult(params: {
  answers: StressAnswers;
  date: string;
}) {
  await saveReflectionResult({
    reflectionId: QUIZ_ID,
    date: params.date,
    answers: params.answers,
    matchedTypes: [],
  });
}
