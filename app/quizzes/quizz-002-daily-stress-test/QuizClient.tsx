"use client";

import { useState, useTransition } from "react";
import { saveResult } from "./actions";
import TwoColumnLayout from "@/components/layout/TwoColumnLayout";
import PageHeader from "@/components/layout/PageHeader";
import ChipGroup from "@/components/quiz/ChipGroup";
import ChoiceGroup from "@/components/quiz/ChoiceGroup";
import ResultRow from "@/components/quiz/ResultRow";
import SectionLabel from "@/components/shared/SectionLabel";
import Button from "@/components/shared/Button";
import type { QuizResult } from "@/lib/db/results";
import {
  EMPTY_ANSWERS,
  FIELD_COUNT,
  LOCATIONS,
  COMPANIONS,
  FREQUENCIES,
  FEELINGS,
  MORNING_FEELINGS,
  answeredCount,
  type StressAnswers,
} from "./quiz-def";

interface Props {
  recentResults: QuizResult[];
  today: string;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "14px",
        fontWeight: 500,
        color: "var(--color-text)",
        marginBottom: "8px",
      }}
    >
      {children}
    </p>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "0.9rem 0" }}>{children}</div>;
}

export default function QuizClient({ recentResults, today }: Props) {
  const [answers, setAnswers] = useState<StressAnswers>(EMPTY_ANSWERS);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof StressAnswers>(
    key: K,
    value: StressAnswers[K],
  ) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  // Single-select chips: clicking the selected chip unselects
  function toggleSingle(
    key: "location" | "frequency" | "morningFeeling" | "eveningFeeling",
  ) {
    return (option: string) =>
      update(key, answers[key] === option ? "" : option);
  }

  function toggleCompanion(option: string) {
    update(
      "companions",
      answers.companions.includes(option)
        ? answers.companions.filter((c) => c !== option)
        : [...answers.companions, option],
    );
  }

  function handleReset() {
    setAnswers(EMPTY_ANSWERS);
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
        title="บททดสอบความเครียดประจำวัน"
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
          </>
        }
      />

      <TwoColumnLayout
        left={
          <div style={{ padding: "2rem" }}>
            {/* Morning */}
            <SectionLabel style={{ marginBottom: "0.5rem" }}>
              ตอนเช้า · ก่อนเริ่มงาน
            </SectionLabel>
            <Field>
              <FieldLabel>
                เมื่อนึกถึงวันนี้ คุณกังวลเรื่องอะไรมากที่สุด
              </FieldLabel>
              <textarea
                className="input"
                style={{ width: "100%", resize: "vertical", minHeight: "70px" }}
                placeholder="เขียนสั้นๆ ถึงสิ่งที่กังวล…"
                value={answers.morningWorry}
                onChange={(e) => update("morningWorry", e.target.value)}
              />
            </Field>

            {/* Evening */}
            <SectionLabel style={{ margin: "1.5rem 0 0.5rem" }}>
              ตอนเย็น · ก่อนเข้านอน
            </SectionLabel>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                lineHeight: 1.65,
                margin: "0.5rem 0 0.25rem",
              }}
            >
              นึกย้อนทั้งวัน เลือกช่วงเวลาที่เครียด หงุดหงิด เบื่อ
              หรือรับมือไม่ไหวที่สุด แล้วใช้ช่วงเวลานั้นตอบคำถามต่อไปนี้
            </p>

            <Field>
              <FieldLabel>อธิบายเหตุการณ์</FieldLabel>
              <textarea
                className="input"
                style={{ width: "100%", resize: "vertical", minHeight: "90px" }}
                placeholder="เกิดอะไรขึ้น…"
                value={answers.event}
                onChange={(e) => update("event", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>ตอนนั้นเป็นเวลากี่โมง</FieldLabel>
              <input
                className="input"
                type="time"
                style={{ width: "140px" }}
                value={answers.time}
                onChange={(e) => update("time", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>คุณอยู่ที่ไหน</FieldLabel>
              <ChipGroup
                options={LOCATIONS}
                selected={answers.location ? [answers.location] : []}
                onToggle={toggleSingle("location")}
              />
            </Field>

            <Field>
              <FieldLabel>คุณอยู่กับใคร (เลือกได้หลายข้อ)</FieldLabel>
              <ChipGroup
                options={COMPANIONS}
                selected={answers.companions}
                onToggle={toggleCompanion}
              />
            </Field>

            <Field>
              <FieldLabel>
                ใช่สถานการณ์เดียวกับที่กังวลไว้ตอนเช้าหรือไม่
              </FieldLabel>
              <ChoiceGroup
                value={answers.sameAsMorning ?? undefined}
                onChange={(val) => update("sameAsMorning", val)}
              />
            </Field>

            <Field>
              <FieldLabel>สถานการณ์นี้เกิดขึ้นบ่อยแค่ไหน</FieldLabel>
              <ChipGroup
                options={FREQUENCIES}
                selected={answers.frequency ? [answers.frequency] : []}
                onToggle={toggleSingle("frequency")}
              />
            </Field>

            <Field>
              <FieldLabel>
                ตอนเช้า คุณรู้สึกลบหรือบวกแค่ไหนกับเรื่องที่กังวล
              </FieldLabel>
              <ChipGroup
                options={MORNING_FEELINGS}
                selected={
                  answers.morningFeeling ? [answers.morningFeeling] : []
                }
                onToggle={toggleSingle("morningFeeling")}
              />
            </Field>

            <Field>
              <FieldLabel>
                ตอนเย็น คุณรู้สึกลบหรือบวกแค่ไหนกับเหตุการณ์ที่บันทึก
              </FieldLabel>
              <ChipGroup
                options={FEELINGS}
                selected={
                  answers.eveningFeeling ? [answers.eveningFeeling] : []
                }
                onToggle={toggleSingle("eveningFeeling")}
              />
            </Field>
          </div>
        }
        right={
          <div
            style={{
              padding: "2rem 1.5rem",
              position: "sticky",
              top: 0,
              maxHeight: "100vh",
              overflowY: "auto",
            }}
          >
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
