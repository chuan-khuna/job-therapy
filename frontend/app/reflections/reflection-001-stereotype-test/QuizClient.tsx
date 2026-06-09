"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResult } from "./actions";
import TwoColumnLayout from "@/components/layout/TwoColumnLayout";
import PageHeader from "@/components/layout/PageHeader";
import QuizPanel from "@/components/quiz/QuizPanel";
import TypesPanel from "@/components/quiz/TypesPanel";
import ResultRow from "@/components/quiz/ResultRow";
import SectionLabel from "@/components/shared/SectionLabel";
import Button from "@/components/shared/Button";
import type { ReflectionResult } from "@/lib/api/results";
import { QUESTIONS, TYPES, type Answers } from "./quiz-def";

interface Props {
  recentResults: ReflectionResult[];
  today: string;
}

export default function QuizClient({ recentResults, today }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAnswer(id: number, val: boolean | null) {
    setAnswers((prev) => {
      if (val === null) {
        const rest = { ...prev };
        delete rest[id];
        return rest;
      }
      return { ...prev, [id]: val };
    });
    setSaved(false);
  }

  function handleReset() {
    setAnswers({});
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await saveResult({ answers, matchedTypes, date: today });
      setSaved(true);
    });
  }

  const matchedTypes = TYPES.filter((t) => t.match(answers)).map((t) => t.id);
  const answered = Object.keys(answers).length;

  const typesPanelData = TYPES.map((t) => ({
    id: t.id,
    name: t.name,
    keys: t.keys,
    matched: t.match(answers),
    partial: t.keys.some((k) => answers[k] === true),
    matchedKeys: t.keys.filter((k) => answers[k] === true),
    note: typeof t.note === "function" ? t.note(answers) : null,
  }));

  const typeMeta = TYPES.map((t) => ({ id: t.id, name: t.name }));

  return (
    <>
      <PageHeader
        title="คุณเป็นคนทำงานประเภทไหน"
        subtitle="ตอบคำถามแต่ละข้อ — คุณสามารถมีได้มากกว่าหนึ่งประเภท"
        source="ที่มา: ทฤษฎีบำบัดงาน — Job Therapy โดย Tessa West"
        right={
          <>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              {answered} / 11
            </span>
            <Button variant="ghost" onClick={handleReset}>
              เริ่มใหม่
            </Button>
            <Link
              href="/reflections/reflection-001-stereotype-test/history"
              className="btn btn-ghost"
            >
              ประวัติ
            </Link>
          </>
        }
      />

      <TwoColumnLayout
        left={
          <QuizPanel
            questions={QUESTIONS}
            answers={answers}
            showNoteFor={answers[3] === true ? 4 : null}
            onAnswer={handleAnswer}
          />
        }
        right={
          <TypesPanel
            types={typesPanelData}
            answeredCount={answered}
            onSave={handleSave}
            saving={isPending}
            saved={saved}
            savedDate={today}
          />
        }
      />

      {recentResults.length > 0 && (
        <div
          style={{
            padding: "2rem",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <SectionLabel style={{ marginBottom: "1rem" }}>
            ผลที่ผ่านมา
          </SectionLabel>
          {recentResults.map((r, i) => (
            <ResultRow
              key={r.id}
              date={r.date}
              matchedTypes={r.matched_types}
              typeMeta={typeMeta}
              isLast={i === recentResults.length - 1}
            />
          ))}
        </div>
      )}
    </>
  );
}
