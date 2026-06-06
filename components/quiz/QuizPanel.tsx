"use client";

import SectionLabel from "@/components/shared/SectionLabel";
import QuestionRow from "./QuestionRow";

interface Question {
  id: number;
  label: string | null;
  text: string;
  note?: string | null;
}

interface QuizPanelProps {
  questions: Question[];
  answers: Record<number, boolean>;
  showNoteFor?: number | null;
  onAnswer: (id: number, val: boolean) => void;
}

export default function QuizPanel({ questions, answers, showNoteFor, onAnswer }: QuizPanelProps) {
  return (
    <div style={{ padding: "2rem" }}>
      <SectionLabel style={{ marginBottom: "1.25rem" }}>คำถาม</SectionLabel>

      {questions.map((q, idx) => (
        <div key={q.id}>
          {q.label && (
            <p
              style={{
                fontSize: "11px", fontWeight: 500, color: "var(--color-text-muted)",
                padding: idx === 0 ? "0 0 0.5rem" : "1rem 0 0.5rem",
                borderTop: idx === 0 ? "none" : "1px solid var(--color-border)",
                marginTop: "0.25rem", letterSpacing: "0.01em",
              }}
            >
              {q.label}
            </p>
          )}
          <QuestionRow
            id={q.id}
            text={q.text}
            note={q.note}
            showNote={showNoteFor === q.id}
            value={answers[q.id]}
            isLast={idx === questions.length - 1}
            onChange={(val) => onAnswer(q.id, val)}
          />
        </div>
      ))}
    </div>
  );
}
