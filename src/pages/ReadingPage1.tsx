// 📚 阅读模块（/reading1）—— 第一册（Oxford Starlight 1）。
//
// 与 /reading 共用 ReadingBook，只换数据源。第一册目前只有 27 课写了短文
// （阅读课 / 故事课），ReadingBook 的 readingLessonsOf 会自动只列这些课，
// 不摆「读一读」的死链。第一册数据只进 /reading1 这个懒加载 chunk。

import ReadingBook from '@/components/ReadingBook'
import type { ReadingSource } from '@/data/readingSeries'
import { modules1, getReadingPassage1 } from '@/data/starlight1'

const SOURCE: ReadingSource = {
  level: 'starlight1',
  mods: modules1,
  passageOf: getReadingPassage1,
}

export default function ReadingPage1() {
  return <ReadingBook source={SOURCE} />
}
