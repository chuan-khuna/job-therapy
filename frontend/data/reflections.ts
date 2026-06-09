export interface ReflectionMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  questionCount: number;
  typeCount?: number;
  tags: string[];
}

export const reflections: ReflectionMeta[] = [
  {
    id: "reflection-001-stereotype-test",
    slug: "reflection-001-stereotype-test",
    name: "คุณเป็นคนทำงานประเภทไหน",
    description: "ค้นหา stereotype ของคุณใน 5 ประเภทหลัก จาก 11 คำถาม",
    questionCount: 11,
    typeCount: 5,
    tags: ["Job therapy - Tessa West"],
  },
  {
    id: "reflection-002-daily-stress-test",
    slug: "reflection-002-daily-stress-test",
    name: "บททดสอบความเครียดประจำวัน",
    description:
      "บันทึกความกังวลตอนเช้าและเหตุการณ์เครียดตอนเย็น เพื่อดูแพตเทิร์นในแต่ละวัน",
    questionCount: 9,
    tags: ["Job therapy - Tessa West"],
  },
];
