import { createClient } from "@/lib/supabase/server";

export interface QuizResult {
  id: number;
  quiz_id: string;
  date: string;
  answers: Record<string, unknown>;
  matched_types: string[];
  created_at: string;
}

const COLUMNS = "id, quiz_id, date, answers, matched_types, created_at";

// Ownership is enforced two ways: RLS scopes every row to the logged-in user,
// and inserts stamp user_id from the session. We never accept a user_id from
// the caller. answers/matched_types are jsonb — pass/return plain objects, no
// JSON.parse/stringify needed.

export async function saveQuizResult(params: {
  quizId: string;
  date: string;
  answers: unknown;
  matchedTypes: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("quiz_results").insert({
    user_id: user.id,
    quiz_id: params.quizId,
    date: params.date,
    answers: params.answers,
    matched_types: params.matchedTypes,
  });
  if (error) throw error;
}

export async function getRecentResults(
  quizId: string,
  limit = 7,
): Promise<QuizResult[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quiz_results")
    .select(COLUMNS)
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as QuizResult[];
}

export async function getAllResults(quizId: string): Promise<QuizResult[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quiz_results")
    .select(COLUMNS)
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as QuizResult[];
}

export async function updateResultAnswers(
  quizId: string,
  id: number,
  answers: unknown,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quiz_results")
    .update({ answers })
    .eq("quiz_id", quizId)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteResult(quizId: string, id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quiz_results")
    .delete()
    .eq("quiz_id", quizId)
    .eq("id", id);
  if (error) throw error;
}

export async function getLastResultStamp(
  quizId: string,
): Promise<{ date: string; created_at: string } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quiz_results")
    .select("date, created_at")
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
