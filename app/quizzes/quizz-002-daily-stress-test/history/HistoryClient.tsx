"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import Tag from "@/components/shared/Tag";
import Button from "@/components/shared/Button";
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

// Editable detail — remounted per entry via key={result.id}
function EditPanel({ result }: { result: QuizResult }) {
  const [answers, setAnswers] = useState<StressAnswers>(() =>
    answersOf(result),
  );
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
          <Button
            variant="primary"
            size="sm"
            disabled={isPending}
            onClick={handleSave}
          >
            {isPending ? "กำลังบันทึก…" : "บันทึกการแก้ไข"}
          </Button>
        </div>
      </div>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--color-border)",
          marginBottom: "1rem",
        }}
      />
      <StressForm answers={answers} onUpdate={update} />
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
                  {a.location && (
                    <Tag variant={isSelected ? "surface" : "default"}>
                      {a.location}
                    </Tag>
                  )}
                  {a.time && (
                    <Tag variant={isSelected ? "surface" : "default"}>
                      {a.time} น.
                    </Tag>
                  )}
                  {a.eveningFeeling && (
                    <Tag variant={isSelected ? "surface" : "default"}>
                      {a.eveningFeeling}
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
