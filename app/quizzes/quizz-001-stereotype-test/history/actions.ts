"use server";

import { revalidatePath } from "next/cache";
import { deleteResult } from "@/lib/db/results";
import { QUIZ_ID } from "../quiz-def";

export async function deleteResultAction(id: number) {
  deleteResult(QUIZ_ID, id);
  revalidatePath(`/quizzes/${QUIZ_ID}/history`);
}
