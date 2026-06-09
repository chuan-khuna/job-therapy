// Server-side client for the Job Therapy backend.
//
// The backend (FastAPI) owns the database; the frontend never touches SQLite
// directly. These helpers run on the server — from Server Components and Server
// Actions — and talk to the backend over HTTP. The backend URL is configurable
// via BACKEND_URL (defaults to the local dev server).

const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// Mirrors the backend ResultRead schema. answers / matched_types arrive as
// real JSON (the backend stores them in JSON columns), so no parsing here.
export interface ReflectionResult {
  id: string;
  reflection_id: string;
  date: string;
  answers: Record<string, unknown>;
  matched_types: string[];
  created_at: string;
  updated_at: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Backend ${init?.method ?? "GET"} ${path} failed: ${res.status}`,
    );
  }
  // 204 No Content (e.g. DELETE) has no body to parse.
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

// answers is any JSON-serialisable shape — each reflection defines its own
export async function saveReflectionResult(params: {
  reflectionId: string;
  date: string;
  answers: unknown;
  matchedTypes: string[];
}): Promise<void> {
  await request("/results", {
    method: "POST",
    body: JSON.stringify({
      reflection_id: params.reflectionId,
      date: params.date,
      answers: params.answers,
      matched_types: params.matchedTypes,
    }),
  });
}

export async function getRecentResults(
  reflectionId: string,
  limit = 7,
): Promise<ReflectionResult[]> {
  const query = new URLSearchParams({
    reflection_id: reflectionId,
    limit: String(limit),
  });
  return request<ReflectionResult[]>(`/results?${query}`);
}

export async function getAllResults(
  reflectionId: string,
): Promise<ReflectionResult[]> {
  const query = new URLSearchParams({ reflection_id: reflectionId });
  return request<ReflectionResult[]>(`/results?${query}`);
}

export async function updateResultAnswers(
  id: string,
  answers: unknown,
): Promise<void> {
  await request(`/results/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ answers }),
  });
}

export async function deleteResult(id: string): Promise<void> {
  await request(`/results/${id}`, { method: "DELETE" });
}

export async function getLastResultStamp(
  reflectionId: string,
): Promise<{ date: string; created_at: string } | null> {
  const [row] = await getRecentResults(reflectionId, 1);
  return row ? { date: row.date, created_at: row.created_at } : null;
}
