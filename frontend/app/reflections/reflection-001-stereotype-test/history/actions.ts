"use server";

import { revalidatePath } from "next/cache";
import { deleteResult } from "@/lib/api/results";
import { QUIZ_ID } from "../quiz-def";

export async function deleteResultAction(id: string) {
  await deleteResult(id);
  revalidatePath(`/reflections/${QUIZ_ID}/history`);
}
