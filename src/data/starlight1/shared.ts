// 共享类型与工具（Level 1 各单元数据文件 uN.ts 统一从这里取类型）。
// 与 level-0 完全一致：Lesson / Word / Sentence 来自 starlight.ts，LessonBook 来自 starlight-book.ts，
// SentenceFrame 来自 sentenceFrame.ts，ReadingPassage 来自 reading/index.ts，Module 来自 starlight.ts。

import type { Lesson, Word, Sentence, Module } from '../starlight'
import type { LessonBook } from '../starlight-book'
import type { SentenceFrame } from '../sentenceFrame'
import type { ReadingPassage } from '../reading/index'

export type { Lesson, Word, Sentence, Module, LessonBook, SentenceFrame, ReadingPassage }
export type { ExtWord } from '../extensionTopics'

/** 拓展词主题（与 level-0 extensionTopics.Topic 结构一致，只存 en/zh/emoji） */
export interface ExtTopic {
  zh: string
  words: Word[]
}

/** 构造一个拓展词（与 level-0 的 w() 同形） */
export const w = (en: string, zh: string, emoji: string): Word => ({ en, zh, emoji })
