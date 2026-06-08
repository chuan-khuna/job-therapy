"use server";

import { revalidatePath } from "next/cache";
import { deleteResult, updateResultAnswers } from "@/lib/db/results";
import { QUIZ_ID, type StressAnswers } from "../quiz-def";

export async function deleteResultAction(id: number) {
  await deleteResult(QUIZ_ID, id);
  revalidatePath(`/quizzes/${QUIZ_ID}/history`);
}

export async function updateResultAction(id: number, answers: StressAnswers) {
  await updateResultAnswers(QUIZ_ID, id, answers);
  revalidatePath(`/quizzes/${QUIZ_ID}/history`);
}
