"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import Tag from "@/components/shared/Tag";
import Button from "@/components/shared/Button";
import MarkdownEditor from "@/components/shared/MarkdownEditor";
import type { QuizResult } from "@/lib/db/results";
import { EMPTY_ANSWERS, QUIZ_ID, type StressAnswers } from "../quiz-def";
import StressForm from "../StressForm";
import { deleteResultAction, updateResultAction } from "./actions";

interface Props {
  results: QuizResult[];
}

function answersOf(result: QuizResult): StressAnswers {
  return { ...EMPTY_ANSWERS, ...(result.answers as Partial<StressAnswers>) };
}

// created_at is sqlite datetime('now') — UTC "YYYY-MM-DD HH:MM:SS"
function timeOf(createdAt: string): string {
  const d = new Date(createdAt.replace(" ", "T") + "Z");
  return d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
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

// Single answer rendered as a badge; muted dash when unanswered
function Value({ children }: { children?: string }) {
  if (!children) {
    return (
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>—</p>
    );
  }
  return <Tag>{children}</Tag>;
}

// Read-only rendering of a submitted entry
function ResultView({ answers }: { answers: StressAnswers }) {
  return (
    <>
      <SectionLabel size="lg" style={{ marginBottom: "0.5rem" }}>
        ตอนเช้า · ก่อนเริ่มงาน
      </SectionLabel>
      <Field>
        <FieldLabel>เมื่อนึกถึงวันนี้ คุณกังวลเรื่องอะไรมากที่สุด</FieldLabel>
        {answers.morningWorry.trim() ? (
          <MarkdownEditor value={answers.morningWorry} readOnly />
        ) : (
          <Value>{""}</Value>
        )}
      </Field>

      <SectionLabel size="lg" style={{ margin: "1.5rem 0 0.5rem" }}>
        ตอนเย็น · ก่อนเข้านอน
      </SectionLabel>
      <Field>
        <FieldLabel>อธิบายเหตุการณ์</FieldLabel>
        {answers.event.trim() ? (
          <MarkdownEditor value={answers.event} readOnly />
        ) : (
          <Value>{""}</Value>
        )}
      </Field>

      <Field>
        <FieldLabel>ตอนนั้นเป็นเวลากี่โมง</FieldLabel>
        <Value>{answers.time ? `${answers.time} น.` : ""}</Value>
      </Field>

      <Field>
        <FieldLabel>คุณอยู่ที่ไหน</FieldLabel>
        <Value>{answers.location}</Value>
      </Field>

      <Field>
        <FieldLabel>คุณอยู่กับใคร</FieldLabel>
        {answers.companions.length > 0 ? (
          <span style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {answers.companions.map((c) => (
              <Tag key={c}>{c}</Tag>
            ))}
          </span>
        ) : (
          <Value>{""}</Value>
        )}
      </Field>

      <Field>
        <FieldLabel>ใช่สถานการณ์เดียวกับที่กังวลไว้ตอนเช้าหรือไม่</FieldLabel>
        <Value>
          {answers.sameAsMorning === null
            ? ""
            : answers.sameAsMorning
              ? "ใช่"
              : "ไม่"}
        </Value>
      </Field>

      <Field>
        <FieldLabel>สถานการณ์นี้เกิดขึ้นบ่อยแค่ไหน</FieldLabel>
        <Value>{answers.frequency}</Value>
      </Field>

      <Field>
        <FieldLabel>
          ตอนเช้า คุณรู้สึกลบหรือบวกแค่ไหนกับเรื่องที่กังวล
        </FieldLabel>
        <Value>{answers.morningFeeling}</Value>
      </Field>

      <Field>
        <FieldLabel>
          ตอนเย็น คุณรู้สึกลบหรือบวกแค่ไหนกับเหตุการณ์ที่บันทึก
        </FieldLabel>
        <Value>{answers.eveningFeeling}</Value>
      </Field>
    </>
  );
}

// Detail panel — read-only by default, edit mode via top-right button.
// Remounted per entry via key={result.id}
function EditPanel({ result }: { result: QuizResult }) {
  const [answers, setAnswers] = useState<StressAnswers>(() =>
    answersOf(result),
  );
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof StressAnswers>(
    key: K,
    value: StressAnswers[K],
  ) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await updateResultAction(result.id, answers);
      setSaved(true);
      setEditing(false);
    });
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <SectionLabel
          ruled={false}
          style={{ paddingBottom: 0 }}
          suppressHydrationWarning
        >
          บันทึก · {result.date} · {timeOf(result.created_at)}
        </SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {saved && (
            <span style={{ fontSize: "12px", color: "var(--color-accent)" }}>
              บันทึกแล้ว
            </span>
          )}
          {editing ? (
            <Button
              variant="primary"
              size="sm"
              disabled={isPending}
              onClick={handleSave}
            >
              {isPending ? "กำลังบันทึก…" : "บันทึก"}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSaved(false);
                setEditing(true);
              }}
            >
              แก้ไข
            </Button>
          )}
        </div>
      </div>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--color-border)",
          marginBottom: "1rem",
        }}
      />
      {editing ? (
        <StressForm answers={answers} onUpdate={update} />
      ) : (
        <ResultView answers={answers} />
      )}
    </div>
  );
}

export default function HistoryClient({ results }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(
    results[0]?.id ?? null,
  );
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // Inline confirm reverts to the bin icon if not acted on
  useEffect(() => {
    if (confirmingId === null) return;
    const t = setTimeout(() => setConfirmingId(null), 4000);
    return () => clearTimeout(t);
  }, [confirmingId]);

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteResultAction(id);
      setConfirmingId(null);
    });
  }

  if (results.length === 0) {
    return (
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-muted)",
            marginBottom: "1rem",
          }}
        >
          ยังไม่มีประวัติการส่งผล
        </p>
        <Link href={`/quizzes/${QUIZ_ID}`} className="btn btn-primary">
          เริ่มทำแบบประเมิน
        </Link>
      </div>
    );
  }

  const selected = results.find((r) => r.id === selectedId) ?? results[0];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        minHeight: "calc(100vh - 120px)",
        alignItems: "start",
      }}
    >
      {/* Left — submitted entries */}
      <div
        style={{
          borderRight: "1px solid var(--color-border)",
          padding: "2rem 1.5rem",
          position: "sticky",
          top: 0,
          maxHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <SectionLabel style={{ marginBottom: "1rem" }}>
          ประวัติ · {results.length} ครั้ง
        </SectionLabel>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {results.map((r) => {
            const isSelected = r.id === selected.id;
            const a = answersOf(r);
            return (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                className={`option-btn ${isSelected ? "selected" : ""}`}
                style={{
                  padding: "0.7rem 1rem",
                  textAlign: "left",
                  width: "100%",
                  opacity: isPending ? 0.6 : 1,
                }}
                onClick={() => {
                  setSelectedId(r.id);
                  setConfirmingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedId(r.id);
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}
                    suppressHydrationWarning
                  >
                    {r.date} · {timeOf(r.created_at)}
                  </span>
                  {confirmingId === r.id ? (
                    <button
                      className="btn btn-destructive"
                      disabled={isPending}
                      style={{
                        fontSize: "11px",
                        padding: "2px 10px",
                        flexShrink: 0,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(r.id);
                      }}
                    >
                      {isPending ? "กำลังลบ…" : "ยืนยันลบ"}
                    </button>
                  ) : (
                    <button
                      aria-label="ลบรายการนี้"
                      title="ลบรายการนี้"
                      disabled={isPending}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        lineHeight: 1,
                        padding: "2px 4px",
                        color: "var(--color-text-muted)",
                        transition: "color 120ms",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmingId(r.id);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          "var(--color-destructive)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--color-text-muted)";
                      }}
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  )}
                </span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {a.morningFeeling && (
                    <Tag variant={isSelected ? "surface" : "default"}>
                      เช้า · {a.morningFeeling}
                    </Tag>
                  )}
                  {a.eveningFeeling && (
                    <Tag variant={isSelected ? "surface" : "default"}>
                      เย็น · {a.eveningFeeling}
                    </Tag>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right — editable quiz form for the selected entry */}
      <EditPanel key={selected.id} result={selected} />
    </div>
  );
}
