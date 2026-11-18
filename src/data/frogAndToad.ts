// 青蛙与蟾蜍（Frog and Toad）阅读数据 —— 《Frog and Toad Storybook Favorites》
// 内容来源：Arnold Lobel 正版绘本合集（HarperCollins，用户自有 PDF，266 页）。
// 原书 4 本子书 × 5 故事 = 20 个故事，本次全部收录（逐句 en/zh，中文人工翻译）。
//
// ⚠️ 版权口径：与 Fly Guy / Winnie 一致 —— 用户自有实体书，仅作合理使用展示，
//   这里只放文字（逐句 en/zh），不内置扫描图片；原 PDF 不进 git。
//
// 层级：4 本子书 = 4 个「单元」，故事 = 课，每本 5 课。
// 提取方式：PDF 有文本层（Internet Archive 扫描），get_text() 提取后按故事校对
//   （T→I、弯引号、诗歌断行、插画页乱序、页脚页码），逐句中文翻译。

import { spring } from './frog-stories/spring'
import { theStory } from './frog-stories/the-story'
import { aLostButton } from './frog-stories/a-lost-button'
import { aSwim } from './frog-stories/a-swim'
import { theLetter } from './frog-stories/the-letter'
import { aList } from './frog-stories/a-list'
import { theGarden } from './frog-stories/the-garden'
import { cookies } from './frog-stories/cookies'
import { dragonsAndGiants } from './frog-stories/dragons-and-giants'
import { theDream } from './frog-stories/the-dream'
import { downTheHill } from './frog-stories/down-the-hill'
import { theCorner } from './frog-stories/the-corner'
import { iceCream } from './frog-stories/ice-cream'
import { theSurprise } from './frog-stories/the-surprise'
import { christmasEve } from './frog-stories/christmas-eve'
import { tomorrow } from './frog-stories/tomorrow'
import { theKite } from './frog-stories/the-kite'
import { shivers } from './frog-stories/shivers'
import { theHat } from './frog-stories/the-hat'
import { alone } from './frog-stories/alone'
import type { ReadingSentence } from './reading/index'
import type { Word } from './starlight'

/** 一个故事的阅读数据（与 frog-stories/*.ts 导出的 FrogStory 同构） */
export interface FrogStoryData {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

/** 一本子书（阅读模块的「单元」） */
export interface FrogBook {
  id: number
  slug: string
  title: string
  titleZh: string
  emoji: string
  stories: FrogStoryData[]
}

/** 4 本子书，每本 5 个故事 */
export const FROG_BOOKS: FrogBook[] = [
  {
    id: 1,
    slug: 'are-friends',
    title: 'Frog and Toad Are Friends',
    titleZh: '青蛙与蟾蜍是朋友',
    emoji: '🐸',
    stories: [spring, theStory, aLostButton, aSwim, theLetter],
  },
  {
    id: 2,
    slug: 'together',
    title: 'Frog and Toad Together',
    titleZh: '青蛙与蟾蜍在一起',
    emoji: '🌱',
    stories: [aList, theGarden, cookies, dragonsAndGiants, theDream],
  },
  {
    id: 3,
    slug: 'all-year',
    title: 'Frog and Toad All Year',
    titleZh: '青蛙与蟾蜍一整年',
    emoji: '🍂',
    stories: [downTheHill, theCorner, iceCream, theSurprise, christmasEve],
  },
  {
    id: 4,
    slug: 'days',
    title: 'Days with Frog and Toad',
    titleZh: '和青蛙蟾蜍在一起的日子',
    emoji: '☀️',
    stories: [tomorrow, theKite, shivers, theHat, alone],
  },
]

/** 全书词汇表（去重），供首屏宝藏词示例 */
export const FROG_VOCAB: Word[] = (() => {
  const seen = new Set<string>()
  const out: Word[] = []
  for (const book of FROG_BOOKS) {
    for (const story of book.stories) {
      for (const w of story.words) {
        if (seen.has(w.en)) continue
        seen.add(w.en)
        out.push(w)
      }
    }
  }
  return out
})()

/** 静态规模数字 */
export const frogStats = {
  books: FROG_BOOKS.length,
  booksReady: FROG_BOOKS.filter((b) => b.stories.length > 0).length,
  stories: FROG_BOOKS.reduce((a, b) => a + b.stories.length, 0),
  sentences: FROG_BOOKS.reduce(
    (a, b) => a + b.stories.reduce((s, x) => s + x.sentences.length, 0),
    0,
  ),
  words: FROG_VOCAB.length,
}
