-- CreateTable
CREATE TABLE "quiz_results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quiz_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "matched_types" TEXT NOT NULL,
    "created_at" TEXT NOT NULL DEFAULT (datetime('now'))
);

-- CreateIndex
CREATE INDEX "idx_quiz_results_quiz_date" ON "quiz_results"("quiz_id", "date");
