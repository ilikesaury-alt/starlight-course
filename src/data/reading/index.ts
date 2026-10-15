// 阅读短文库：Starlight 96 课，每课一段连贯短文（70~100 词 / 8~12 句）。
//
// 与课本原文（starlight-passage）的分工：
//   starlight-passage = 教材 PDF 提取的**真实课文**，一句一活动，供点读/挖空；
//   本目录 reading      = 按本课词表**另写的短文**，用学过的词把一件事讲完，供自主阅读。
//
// 内容口径纪律：
//   - 用词必须落在 allowedWordsFor(unit, lesson)（见 baseVocab.ts），零超纲；
//   - 本课每个词都要在短文里出现，测试会硬卡；
//   - 数据按 unit 拆 12 个文件，与 src/data/dialogue/unit1..12 同一先例，方便分批并行生成；
//   - 改本课词汇请先改 src/data/lessons.ts，再回来同步这里的短文。

import { unit1 } from './unit1'
import { unit2 } from './unit2'
import { unit3 } from './unit3'
import { unit4 } from './unit4'
import { unit5 } from './unit5'
import { unit6 } from './unit6'
import { unit7 } from './unit7'
import { unit8 } from './unit8'
import { unit9 } from './unit9'
import { unit10 } from './unit10'
import { unit11 } from './unit11'
import { unit12 } from './unit12'

/** 短文里的一句话：英文必填，中文是家长/孩子的对照 */
export interface ReadingSentence {
  en: string
  zh: string
}

/** 短文里的一句话数组（一段） */
export type ReadingParagraph = ReadingSentence[]

export interface ReadingPassage {
  title: string
  titleZh: string
  /** 1~3 段；段落结构只服务阅读排版的段距，不承载逻辑 */
  paragraphs: ReadingParagraph[]
}

/** 全部 96 课短文，key 形如 '1-1'（单元号-课号） */
export const READING_PASSAGES: Record<string, ReadingPassage> = {
  ...unit1,
  ...unit2,
  ...unit3,
  ...unit4,
  ...unit5,
  ...unit6,
  ...unit7,
  ...unit8,
  ...unit9,
  ...unit10,
  ...unit11,
  ...unit12,
}

/** 取某课短文；没有时返 undefined，由调用方决定回落展示 */
export function getReadingPassage(unitId: number, lessonId: number): ReadingPassage | undefined {
  return READING_PASSAGES[`${unitId}-${lessonId}`]
}

/** 按阅读顺序摊平全部句子（渲染、朗读、测试都用这一个口径） */
export function passageSentences(p: ReadingPassage): ReadingSentence[] {
  return p.paragraphs.flat()
}