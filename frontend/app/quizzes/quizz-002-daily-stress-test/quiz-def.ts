export const QUIZ_ID = "quizz-002-daily-stress-test";

export const QUIZ_NAME = "บททดสอบความเครียดประจำวัน";

export interface StressAnswers {
  morningWorry: string;
  event: string;
  time: string; // "HH:MM"
  location: string;
  companions: string[];
  sameAsMorning: boolean | null;
  frequency: string;
  morningFeeling: string;
  eveningFeeling: string;
}

export const EMPTY_ANSWERS: StressAnswers = {
  morningWorry: "",
  event: "",
  time: "",
  location: "",
  companions: [],
  sameAsMorning: null,
  frequency: "",
  morningFeeling: "",
  eveningFeeling: "",
};

export const LOCATIONS = [
  "บ้าน",
  "ที่ทำงาน",
  "ระหว่างที่พักผ่อน/สนุกสนาน",
  "ทำธุระ",
  "ระหว่างเดินทาง",
  "อื่นๆ",
];

export const COMPANIONS = [
  "คนเดียว",
  "คนแปลกหน้า",
  "เพื่อนร่วมงาน",
  "เพื่อน",
  "ลูกๆ",
  "คนรัก",
  "สมาชิกในครอบครัวคนอื่นๆ",
  "สัตว์เลี้ยง",
];

export const FREQUENCIES = [
  "เกิดขึ้นครั้งแรก",
  "เกิดขึ้นแล้วหนึ่งครั้ง",
  "เกิดขึ้นมาก่อนหน้านี้สองสามครั้ง",
  "เกิดขึ้นเป็นประจำ",
  "เกิดขึ้นตลอดเวลา",
];

// 5-point bipolar Likert: negative → positive
export const FEELINGS = [
  "เป็นลบมาก",
  "ค่อนข้างลบ",
  "กลางๆ",
  "ค่อนข้างบวก",
  "เป็นบวกมาก",
];

export const MORNING_FEELINGS = [...FEELINGS, "มันไม่เกิดขึ้น"];

// Count of answered fields, for progress / save gating
export function answeredCount(a: StressAnswers): number {
  let n = 0;
  if (a.morningWorry.trim()) n++;
  if (a.event.trim()) n++;
  if (a.time) n++;
  if (a.location) n++;
  if (a.companions.length > 0) n++;
  if (a.sameAsMorning !== null) n++;
  if (a.frequency) n++;
  if (a.morningFeeling) n++;
  if (a.eveningFeeling) n++;
  return n;
}

export const FIELD_COUNT = 9;
