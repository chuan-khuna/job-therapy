"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResult } from "./actions";
import TwoColumnLayout from "@/components/layout/TwoColumnLayout";
import PageHeader from "@/components/layout/PageHeader";
import ResultRow from "@/components/quiz/ResultRow";
import SectionLabel from "@/components/shared/SectionLabel";
import Button from "@/components/shared/Button";
import StressForm from "./StressForm";
import type { QuizResult } from "@/lib/api/results";
import {
  EMPTY_ANSWERS,
  FIELD_COUNT,
  QUIZ_ID,
  QUIZ_NAME,
  answeredCount,
  type StressAnswers,
} from "./quiz-def";

interface Props {
  recentResults: QuizResult[];
  today: string;
}

export default function QuizClient({ recentResults, today }: Props) {
  const [answers, setAnswers] = useState<StressAnswers>(EMPTY_ANSWERS);
  const [formKey, setFormKey] = useState(0); // bump to remount markdown editors
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof StressAnswers>(
    key: K,
    value: StressAnswers[K],
  ) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleReset() {
    setAnswers(EMPTY_ANSWERS);
    setFormKey((k) => k + 1);
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await saveResult({ answers, date: today });
      setSaved(true);
    });
  }

  const answered = answeredCount(answers);

  return (
    <>
      <PageHeader
        title={QUIZ_NAME}
        subtitle="ตอบช่วงเช้าหนึ่งข้อ และตอบที่เหลือก่อนเข้านอน"
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
              {answered} / {FIELD_COUNT}
            </span>
            <Button variant="ghost" onClick={handleReset}>
              เริ่มใหม่
            </Button>
            <Link
              href={`/quizzes/${QUIZ_ID}/history`}
              className="btn btn-ghost"
            >
              ประวัติ
            </Link>
          </>
        }
      />

      <TwoColumnLayout
        left={
          <div style={{ padding: "2rem" }}>
            <StressForm key={formKey} answers={answers} onUpdate={update} />
          </div>
        }
        right={
          <div className="px-6 py-8 md:sticky md:top-0 md:max-h-screen md:overflow-y-auto">
            <SectionLabel style={{ marginBottom: "1rem" }}>
              บันทึกวันนี้
            </SectionLabel>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "12px",
                color: "var(--color-text-muted)",
                marginBottom: "1rem",
              }}
            >
              <span suppressHydrationWarning>วันที่ {today}</span>
              {answers.time && <span>เวลาเหตุการณ์ {answers.time} น.</span>}
              {answers.location && <span>สถานที่ {answers.location}</span>}
              {answers.companions.length > 0 && (
                <span>อยู่กับ {answers.companions.join(", ")}</span>
              )}
              {answers.frequency && <span>{answers.frequency}</span>}
            </div>

            <div
              style={{
                paddingTop: "1rem",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              <Button
                variant="primary"
                disabled={answered === 0 || isPending}
                onClick={handleSave}
                style={{ width: "100%" }}
              >
                {isPending ? "กำลังบันทึก…" : "บันทึกผล"}
              </Button>
              {saved && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "var(--color-accent)",
                    textAlign: "center",
                  }}
                >
                  บันทึกแล้ว {today}
                </p>
              )}
            </div>
          </div>
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
              typeMeta={[]}
              isLast={i === recentResults.length - 1}
            />
          ))}
        </div>
      )}
    </>
  );
}
