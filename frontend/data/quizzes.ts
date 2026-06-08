export interface QuizMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  questionCount: number;
  typeCount?: number;
}

export const quizzes: QuizMeta[] = [
  {
    id: "quiz-001-stereotype-test",
    slug: "quiz-001-stereotype-test",
    name: "คุณเป็นคนทำงานประเภทไหน",
    description: "ค้นหา stereotype ของคุณใน 5 ประเภทหลัก จาก 11 คำถาม",
    questionCount: 11,
    typeCount: 5,
  },
  {
    id: "quiz-002-daily-stress-test",
    slug: "quiz-002-daily-stress-test",
    name: "บททดสอบความเครียดประจำวัน",
    description:
      "บันทึกความกังวลตอนเช้าและเหตุการณ์เครียดตอนเย็น เพื่อดูแพตเทิร์นในแต่ละวัน",
    questionCount: 9,
  },
];
