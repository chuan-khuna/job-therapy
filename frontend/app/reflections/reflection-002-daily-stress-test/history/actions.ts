"use server";

import { revalidatePath } from "next/cache";
import { deleteResult, updateResultAnswers } from "@/lib/api/results";
import { QUIZ_ID, type StressAnswers } from "../quiz-def";

export async function deleteResultAction(id: string) {
  await deleteResult(id);
  revalidatePath(`/reflections/${QUIZ_ID}/history`);
}

export async function updateResultAction(id: string, answers: StressAnswers) {
  await updateResultAnswers(id, answers);
  revalidatePath(`/reflections/${QUIZ_ID}/history`);
}
