CREATE TABLE IF NOT EXISTS quiz_results (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id      TEXT    NOT NULL,
  date         TEXT    NOT NULL,  -- YYYY-MM-DD
  answers      TEXT    NOT NULL,  -- JSON: {"1": true, "2": false, ...}
  matched_types TEXT   NOT NULL,  -- JSON: ["A", "C"]
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_date
  ON quiz_results (quiz_id, date);
