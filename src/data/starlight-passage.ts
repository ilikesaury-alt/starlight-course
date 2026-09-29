// Starlight 课文点读数据（生成文件，请勿手改）
// 由 scripts/extract-passage.mjs 从 src/data/starlight0_extracted.json 提取。
// 重新生成：node scripts/extract-passage.mjs 1-1 4-1

export interface Passage {
  title: string
  lines: string[]
}

/** key 形如 '1-1'（单元号-课号） */
export const STARLIGHT_PASSAGE: Record<string, Passage> = {
  '1-1': {
    title: "Say Hello",
    lines: [
      "Hello, monster!",
      "Hello, how are you?",
      "I’m good.",
      "I’m great.",
      "Hello!",
      "How are you?",
      "I’m good / great.",
      "Hello, what’s your name?",
      "My name is Abby.",
      "I’m Leo.",
      "My name is Grace.",
      "I’m Sam.",
      "Speak louder!",
      "I’m …",
      "Hello! How are you?",
      "Let’s make some new friends.",
      "My name is …",
      "Let’s sing a song!",
      "How are you, my friend?",
      "How are you today?",
      "Will you please come in?",
      "Tra la la la la la la.",
    ],
  },
  '4-1': {
    title: "My Toys",
    lines: [
      "Toys!",
      "What’s missing?",
      "I have Play-Doh.",
      "I have a puzzle.",
      "I have blocks.",
      "I have play dough.",
      "I have a doll.",
      "Let’s make a sentence.",
      "Let’s sing a song.",
    ],
  },
}

export function getPassage(unit: number | string, lesson: number | string): Passage | undefined {
  return STARLIGHT_PASSAGE[`${unit}-${lesson}`]
}
