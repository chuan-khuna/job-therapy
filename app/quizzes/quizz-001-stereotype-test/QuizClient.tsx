"use client";

import { useState, useTransition } from "react";
import { saveResult } from "./actions";
import TwoColumnLayout from "@/components/layout/TwoColumnLayout";
import PageHeader from "@/components/layout/PageHeader";
import QuizPanel from "@/components/quiz/QuizPanel";
import TypesPanel from "@/components/quiz/TypesPanel";
import ResultRow from "@/components/quiz/ResultRow";
import SectionLabel from "@/components/shared/SectionLabel";
import Button from "@/components/shared/Button";
import type { QuizResult } from "@/lib/db/results";

type Answers = Record<number, boolean>;

interface QuizType {
  id: string;
  name: string;
  keys: number[];
  match: (a: Answers) => boolean;
  note: ((a: Answers) => string | null) | null;
}

const TYPES: QuizType[] = [
  { id: "A", name: "วิกฤติตัวตน",            keys: [1, 2],     match: (a) => a[1] === true,                                    note: (a) => (a[1] === true && a[2] === true) ? "คุณอาจจะยังไม่พร้อมที่จะออกจากงาน แต่บทนี้จะยังคงเหมาะกับคุณ" : null },
  { id: "B", name: "ใจห่างเหิน",             keys: [1, 3, 4],  match: (a) => a[1] === false && (a[3] === true || a[4] === true), note: null },
  { id: "C", name: "ถูกดึงจนตึงเกิน",        keys: [5, 6, 7],  match: (a) => a[5] === true || a[6] === true || a[7] === true,   note: null },
  { id: "D", name: "ที่สอง",                 keys: [8, 9],     match: (a) => a[8] === true || a[9] === true,                    note: null },
  { id: "E", name: "ดาวเด่นที่ไม่มีใครเห็น", keys: [9, 10, 11], match: (a) => (a[9] === true || a[10] === true) && a[11] === true, note: null },
];

const QUESTIONS = [
  { id: 1,  label: "วิกฤติตัวตน",            text: "คุณคิดจะลาออกไปทำงานที่แตกต่างไปจากงานที่ทำอยู่ตอนนี้หรือไม่", note: null },
  { id: 2,  label: null,                      text: "อาชีพที่ทำในปัจจุบันเป็นส่วนสำคัญของตัวตนของคุณหรือไม่", note: null },
  { id: 3,  label: "ใจห่างเหิน",             text: "คุณเคยรักงานที่ทำแต่ไม่ได้รู้สึกแบบนั้นแล้วหรือเปล่า", note: null },
  { id: 4,  label: null,                      text: "หากตอบว่าใช่ในคำถามที่ 3 คุณอยากหางานที่คล้ายคลึงกับงานเก่าตอนที่คุณยังชอบมันหรือไม่", note: "ตอบเฉพาะเมื่อตอบ 'ใช่' ในข้อ 3" },
  { id: 5,  label: "ถูกดึงจนตึงเกิน",        text: "คุณมีหลายบทบาทในที่ทำงานหรือเปล่า นั่นรวมถึงตำแหน่งงานและบทบาทหรือความรับผิดชอบอื่นๆ เช่น การเป็นสมาชิกในคณะกรรมการหรือในกลุ่มทรัพยากรพนักงาน ถ้าใช่ให้ถือว่ารวมอยู่ด้วย", note: null },
  { id: 6,  label: null,                      text: "คุณถูกขัดจังหวะระหว่างที่พยายามจะทำงานให้เสร็จหรือเปล่า", note: null },
  { id: 7,  label: null,                      text: "คุณเครียดกับปริมาณงานที่ไม่สามารถทำให้เสร็จในตอนท้ายของวันหรือไม่", note: null },
  { id: 8,  label: "ที่สอง",                 text: "ตอนนี้คุณมีงานทำแต่มีปัญหากับการเลื่อนตำแหน่งอยู่ใช่หรือไม่", note: null },
  { id: 9,  label: null,                      text: "คุณรู้สึกว่าพนักงานในระดับเดียวกันกับคุณที่ทำงานให้กับบริษัทอื่นได้รับค่าตอบแทนดีกว่าคุณหรือไม่", note: null },
  { id: 10, label: "ดาวเด่นที่ไม่มีใครเห็น", text: "คุณรู้สึกว่าความทุ่มเทของคุณถูกมองข้ามหรือไม่มีคุณค่าในที่ทำงานหรือเปล่า", note: null },
  { id: 11, label: null,                      text: "ลองนึกถึงทักษะในการทำงานบางอย่างที่คุณมี ลองถามตัวเองว่าแต่ละทักษะเป็นทักษะหายากหรือไม่ มันส่งผลต่อประสิทธิภาพในการทำงานในแง่ดีหรือเปล่า และคุณเชี่ยวชาญในทักษะเหล่านี้มากกว่าคนอื่นหรือไม่ คุณมีทักษะอย่างน้อยหนึ่งอย่างที่ตรงตามเกณฑ์ที่กล่าวมาหรือไม่", note: null },
];

interface Props {
  recentResults: QuizResult[];
  today: string;
}

export default function QuizClient({ recentResults, today }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAnswer(id: number, val: boolean) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
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
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
              {answered} / 11
            </span>
            <Button variant="ghost" onClick={handleReset}>เริ่มใหม่</Button>
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
        <div style={{ padding: "2rem", borderTop: "1px solid var(--color-border)" }}>
          <SectionLabel style={{ marginBottom: "1rem" }}>ผลที่ผ่านมา</SectionLabel>
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
