"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import Tag from "@/components/shared/Tag";
import TypeCard from "@/components/quiz/TypeCard";
import type { QuizResult } from "@/lib/db/results";
import { QUESTIONS, TYPES, QUIZ_ID, type Answers } from "../quiz-def";
import { deleteResultAction } from "./actions";

interface Props {
  results: QuizResult[];
}

// JSON keys come back as strings — normalise to numeric ids
function answersOf(result: QuizResult): Answers {
  return Object.fromEntries(
    Object.entries(result.answers).map(([k, v]) => [Number(k), v === true]),
  ) as Answers;
}

// created_at is sqlite datetime('now') — UTC "YYYY-MM-DD HH:MM:SS"
function timeOf(createdAt: string): string {
  const d = new Date(createdAt.replace(" ", "T") + "Z");
  return d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AnswerChip({ value }: { value: boolean | undefined }) {
  if (value === undefined) {
    return (
      <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
        ไม่ได้ตอบ
      </span>
    );
  }
  return (
    <span
      className={`option-btn ${value ? "selected" : "selected-destructive"}`}
      style={{
        padding: "2px 12px",
        fontSize: "12px",
        cursor: "default",
        display: "inline-block",
      }}
    >
      {value ? "ใช่" : "ไม่"}
    </span>
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
  const answers = answersOf(selected);

  const typeMeta = TYPES.map((t) => ({ id: t.id, name: t.name }));

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
                  {r.matched_types.length === 0 ? (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      ไม่มีประเภทที่ตรง
                    </span>
                  ) : (
                    r.matched_types.map((typeId) => (
                      <Tag
                        key={typeId}
                        variant={isSelected ? "surface" : "default"}
                      >
                        {typeId} ·{" "}
                        {typeMeta.find((t) => t.id === typeId)?.name ?? typeId}
                      </Tag>
                    ))
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right — quiz answers + result for the selected entry */}
      <div style={{ padding: "2rem" }}>
        <SectionLabel style={{ marginBottom: "1rem" }} suppressHydrationWarning>
          ผลการประเมิน · {selected.date} · {timeOf(selected.created_at)}
        </SectionLabel>

        {/* Matched stereotypes as tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "1.25rem",
          }}
        >
          {selected.matched_types.length === 0 ? (
            <span
              style={{ fontSize: "12px", color: "var(--color-text-muted)" }}
            >
              ไม่มีประเภทที่ตรง
            </span>
          ) : (
            selected.matched_types.map((typeId) => (
              <Tag
                key={typeId}
                variant="accent"
                style={{ fontSize: "12px", padding: "4px 12px" }}
              >
                {typeId} ·{" "}
                {typeMeta.find((t) => t.id === typeId)?.name ?? typeId}
              </Tag>
            ))
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "8px",
            marginBottom: "2rem",
          }}
        >
          {TYPES.map((t) => {
            const matched = selected.matched_types.includes(t.id);
            const matchedKeys = t.keys.filter((k) => answers[k] === true);
            return (
              <TypeCard
                key={t.id}
                name={t.name}
                keys={t.keys}
                matchedKeys={matchedKeys}
                state={
                  matched
                    ? "matched"
                    : matchedKeys.length > 0
                      ? "partial"
                      : "idle"
                }
                note={typeof t.note === "function" ? t.note(answers) : null}
              />
            );
          })}
        </div>

        <SectionLabel style={{ marginBottom: "0.5rem" }}>คำตอบ</SectionLabel>

        {QUESTIONS.map((q, idx) => (
          <div key={q.id}>
            {q.label && (
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  padding: idx === 0 ? "0 0 0.5rem" : "1rem 0 0.5rem",
                  borderTop:
                    idx === 0 ? "none" : "1px solid var(--color-border)",
                  marginTop: "0.25rem",
                  letterSpacing: "0.01em",
                }}
              >
                {q.label}
              </p>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "0.7rem 0",
                borderBottom:
                  idx === QUESTIONS.length - 1 || QUESTIONS[idx + 1]?.label
                    ? "none"
                    : "1px solid var(--color-border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  minWidth: "20px",
                  paddingTop: "2px",
                }}
              >
                {String(q.id).padStart(2, "0")}
              </span>
              <p
                style={{
                  flex: 1,
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: "var(--color-text)",
                }}
              >
                {q.text}
              </p>
              <AnswerChip value={answers[q.id]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
