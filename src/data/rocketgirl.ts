// Rocket Girl 主题课程数据层
// 数据来源:src/data/rocketgirl/words/01.Rocket Girl-words.pdf (108 个故事 / 2797 个词汇)
// 解析脚本已提取为 rocketgirl-words.json;128 本绘本清单为 rocketgirl-books.json。
// 绘本 PDF 体积约 435MB,已通过 .gitignore 排除,不纳入版本控制;课程仅读取文本数据。

import wordsData from './rocketgirl-words.json'
import booksData from './rocketgirl-books.json'

export interface RGWord {
  en: string
  zh: string
  sentence?: string
  emoji?: string
}

export interface RGStory {
  id: number
  slug: string
  title: string
  emoji: string
  words: RGWord[]
}

export interface RGBook {
  file: string
  title: string
}

// Rocket Girl 专属主题色(紫罗兰 + 柔紫),区别于 Starlight 的天蓝
export const RG_THEME = {
  color: '#7c3aed',
  colorSoft: '#ede9fe',
} as const

// ---- 故事 emoji:按标题关键词匹配,否则按索引轮询活泼图标 ----
const STORY_EMOJI_RULES: [RegExp, string][] = [
  [/alien/i, '👽'],
  [/freeze|ice|snow|cold/i, '❄️'],
  [/robot|cyborg/i, '🤖'],
  [/dragon/i, '🐉'],
  [/pirate|treasure/i, '🏴‍☠️'],
  [/monster|ghost|zombie|vampire/i, '👾'],
  [/magic|witch|wizard|fairy/i, '🪄'],
  [/super/i, '🦸'],
  [/cat|dog|pet|animal|lion|tiger|bear|rabbit/i, '🐾'],
  [/water|sea|ocean|fish|shark|whale/i, '🌊'],
  [/fire/i, '🔥'],
  [/king|queen|princess|prince|castle|knight/i, '🏰'],
  [/school|class|teacher|student/i, '🏫'],
  [/space|star|moon|planet|sky|rocket/i, '🚀'],
]
const STORY_EMOJI_FALLBACK = ['🚀', '🌟', '⚡', '🌈', '🪐', '💫', '🛸', '✨', '🌟', '🎇']

function pickStoryEmoji(title: string, idx: number): string {
  for (const [re, emoji] of STORY_EMOJI_RULES) {
    if (re.test(title)) return emoji
  }
  return STORY_EMOJI_FALLBACK[idx % STORY_EMOJI_FALLBACK.length]
}

// ---- 单词 emoji:按英文/中文关键词匹配,否则用故事主题 emoji 兜底 ----
const WORD_EMOJI_RULES: [RegExp, string][] = [
  [/food|eat|lunch|dinner|breakfast|pizza|burger|cake|apple|banana|egg|rice|bread|soup|meat|milk|water|juice|snack|cookie|cheese|fruit|vegetable|drink|meal|三明治|面包|牛肉|午餐|晚餐|早餐|水果|牛奶|喝|吃/i, '🍔'],
  [/cat|dog|pet|animal|lion|tiger|bear|rabbit|bird|duck|pig|cow|sheep|horse|monkey|elephant|mouse|frog|bee|bug|fish|whale|shark|狗|猫|动物|熊|兔|鸟/i, '🐾'],
  [/red|blue|yellow|green|orange|purple|color|colour|pink|black|white|brown|颜色|红色|蓝色|黄色|绿色/i, '🌈'],
  [/happy|sad|angry|scared|afraid|tired|excited|love|friend|高兴|害怕|生气|朋友|爱/i, '😊'],
  [/run|jump|fly|walk|swim|climb|dance|play|ride|drive|跑|跳|飞|走|玩|游/i, '🏃'],
  [/book|read|story|school|class|teacher|student|learn|write|pen|pencil|书|读|学|写|老师|学校/i, '📚'],
  [/sun|moon|star|sky|space|rocket|planet|night|day|太阳|月亮|星星|天空|夜|白天/i, '🌟'],
  [/house|home|door|window|room|bed|tree|garden|park|city|street|房子|家|门|窗|树|公园|城市|街道/i, '🏠'],
  [/king|queen|prince|princess|castle|magic|wizard|witch|dragon|robot|alien|monster|ghost|魔法|龙|机器|外星|怪物|幽灵/i, '🪄'],
  [/big|small|little|tall|short|long|fast|slow|hot|cold|new|old|大|小|高|矮|长|快|慢|新|旧|热|冷/i, '📏'],
  [/car|bus|train|boat|ship|plane|bike|truck|车|巴士|火车|船|飞机|自行车/i, '🚗'],
  [/fire|ice|snow|wind|rain|storm|火|冰|雪|风|雨|暴/i, '🔥'],
]

function pickWordEmoji(en: string, zh: string, fallback: string): string {
  const text = `${en} ${zh}`
  for (const [re, emoji] of WORD_EMOJI_RULES) {
    if (re.test(text)) return emoji
  }
  return fallback
}

interface RawStory {
  title: string
  words: { en: string; zh: string; sentence?: string }[]
}

const rawStories = (wordsData as { stories: RawStory[] }).stories

export const rocketGirlStories: RGStory[] = rawStories.map((s, i) => {
  const storyEmoji = pickStoryEmoji(s.title, i)
  return {
    id: i + 1,
    slug: `rg-${i + 1}`,
    title: s.title,
    emoji: storyEmoji,
    words: s.words.map((w) => ({
      en: w.en,
      zh: w.zh,
      sentence: w.sentence,
      emoji: pickWordEmoji(w.en, w.zh, storyEmoji),
    })),
  }
})

export const rocketGirlBooks: RGBook[] = (booksData as { books: RGBook[] }).books

export const rocketGirlStoryCount = rocketGirlStories.length
export const rocketGirlWordCount = rocketGirlStories.reduce((a, s) => a + s.words.length, 0)

export function getStory(slug: string): RGStory | undefined {
  return rocketGirlStories.find((s) => s.slug === slug)
}
