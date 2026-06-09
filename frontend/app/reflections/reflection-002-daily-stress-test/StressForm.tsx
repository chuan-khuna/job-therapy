import ChipGroup from "@/components/quiz/ChipGroup";
import ChoiceGroup from "@/components/quiz/ChoiceGroup";
import SectionLabel from "@/components/shared/SectionLabel";
import MarkdownEditor from "@/components/shared/MarkdownEditor";
import TimePicker from "@/components/ui/TimePicker";
import {
  LOCATIONS,
  COMPANIONS,
  FREQUENCIES,
  FEELINGS,
  MORNING_FEELINGS,
  type StressAnswers,
} from "./quiz-def";

interface StressFormProps {
  answers: StressAnswers;
  onUpdate: <K extends keyof StressAnswers>(
    key: K,
    value: StressAnswers[K],
  ) => void;
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

export default function StressForm({ answers, onUpdate }: StressFormProps) {
  // Single-select chips: clicking the selected chip unselects
  function toggleSingle(
    key: "location" | "frequency" | "morningFeeling" | "eveningFeeling",
  ) {
    return (option: string) =>
      onUpdate(key, answers[key] === option ? "" : option);
  }

  function toggleCompanion(option: string) {
    onUpdate(
      "companions",
      answers.companions.includes(option)
        ? answers.companions.filter((c) => c !== option)
        : [...answers.companions, option],
    );
  }

  return (
    <>
      {/* Morning */}
      <SectionLabel size="lg" style={{ marginBottom: "0.5rem" }}>
        ตอนเช้า · ก่อนเริ่มงาน
      </SectionLabel>
      <Field>
        <FieldLabel>เมื่อนึกถึงวันนี้ คุณกังวลเรื่องอะไรมากที่สุด</FieldLabel>
        <MarkdownEditor
          value={answers.morningWorry}
          onChange={(md) => onUpdate("morningWorry", md)}
          placeholder="เขียนสั้นๆ ถึงสิ่งที่กังวล…"
        />
      </Field>

      {/* Evening */}
      <SectionLabel size="lg" style={{ margin: "1.5rem 0 0.5rem" }}>
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
        ลองนึกถึงวันทั้งวันและลืมเรื่องเลวร้ายที่เกิดขึ้นทั้งหมดไปก่อน
        — ช่วงวันที่คุณมีความสุข เครียด โกรธ เบื่อ หงุดหงิด รับไม่ไหว
        หรือแค่พยายามทำงานให้เสร็จ ลองคิดถึงช่วงเวลานั้นสักสองสามนาที
        แล้วตอบคำถามต่อไปนี้
      </p>

      <Field>
        <FieldLabel>อธิบายเหตุการณ์</FieldLabel>
        <MarkdownEditor
          value={answers.event}
          onChange={(md) => onUpdate("event", md)}
          placeholder="เกิดอะไรขึ้น…"
        />
      </Field>

      <Field>
        <FieldLabel>ตอนนั้นเป็นเวลากี่โมง</FieldLabel>
        <TimePicker
          value={answers.time}
          onChange={(v) => onUpdate("time", v)}
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
        <FieldLabel>ใช่สถานการณ์เดียวกับที่กังวลไว้ตอนเช้าหรือไม่</FieldLabel>
        <ChoiceGroup
          value={answers.sameAsMorning ?? undefined}
          onChange={(val) => onUpdate("sameAsMorning", val)}
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
          selected={answers.morningFeeling ? [answers.morningFeeling] : []}
          onToggle={toggleSingle("morningFeeling")}
        />
      </Field>

      <Field>
        <FieldLabel>
          ตอนเย็น คุณรู้สึกลบหรือบวกแค่ไหนกับเหตุการณ์ที่บันทึก
        </FieldLabel>
        <ChipGroup
          options={FEELINGS}
          selected={answers.eveningFeeling ? [answers.eveningFeeling] : []}
          onToggle={toggleSingle("eveningFeeling")}
        />
      </Field>
    </>
  );
}
