// Rocket Girl → 阅读模块适配层（零 UI，纯函数）。
//
// 为什么单独一层：`rocketgirl.ts` 的 Story 是「108 集故事 + 词条 + 例句」，
// 而阅读模块需要 `ReadingModule[]`（单元 → 课 → 词表）+ `ReadingPassage`。
// 两者语义不同，这里做**只读适配**，不改 rocketgirl.ts 的导出形状，
// 也不把 RG 例句塞进 READING_PASSAGES（那会污染 readingPassage.test.ts 的零超纲口径）。
//
// Rocket Girl 现在**整个就是阅读模块**：
//   108 集故事按标题里的故事弧分组 → 27 个「单元」，每单元 4 集「课」。
//   标题形如 `Rocket Girl and the Aliens 1: Sloppy Joe Day`，
//   冒号前的共同前缀（去掉结尾的序号）就是弧名。
//
// 三条硬约束：
//   1. RG 没有绘本正文（0/108 有 bookText），只有 2301 条「例句 + 中文」。
//      所以这里产出的是**例句页**，文案一律说「这一集的例句」，绝不标成「绘本原文 / 小故事」。
//   2. 阅读模块的流程是「点一条 → 就地展开一篇」，不是分页器。
//      每集只取前 10 句合成 1 个 ReadingPassage（与 Starlight 短文 8~12 句同口径，
//      也避免「听整篇」合成超长音频被云 TTS 超时）。
//   3. 词条里 777/2797 是多词或带噪声（`sloppy joe`、`drip (`），
//      TappableWords 按单 token 查词表，多词 key 永远不会命中高亮 —— 必须归一化。

import { rocketGirlStories } from './rocketgirl'
import { lookupZh, wordBase } from '@/utils/bookDict'
import { RG_THEME } from './story-themes'
import type { ReadingPassage, ReadingSentence } from './reading/index'
import type { ReadingModule, ReadingSource } from './readingSeries'
import type { Word } from './starlight'
import type { Story } from './story-types'

/** 每篇最多几句。与 Starlight 短文规格（8~12 句）同口径；多出的句子不再分页。 */
export const RG_SENTENCES_PER_PASSAGE = 10

/** 把一条 StoryWord 归一成 Word 能用的单 token 形态；不是单词返回 null */
function toWordToken(en: string): string | null {
  const w = en.toLowerCase().trim()
  // 多词短语 / 带括号的噪声词条：TappableWords 按单 token 查，留着也命中不了
  if (!w || /\s/.test(w) || /[()]/i.test(w) || !/^[a-z]+$/.test(w)) return null
  return w
}

/** 一集的词表（用于阅读器高亮「这一集的词」）。按 token 去重，多词/噪声剔除。
 *  ⚠️ 实测 2797 个词条里有 **458 条 zh 为空**（如 blink / case / frown）——
 *  原文数据就没翻译。这类词先拿 `lookupZh` 兜；仍查不到就**不进词表**：
 *  否则高亮了却弹出空释义，比不高亮更糟。它们仍会被 `lookupRgZh` 的查词链
 *  接住（全局词典 / 自动词表 / 词形回退 / 整句中文兜底）。 */
export function rgReadingVocab(story: Story): Word[] {
  const seen = new Set<string>()
  const out: Word[] = []
  for (const w of story.words) {
    const en = toWordToken(w.en)
    if (!en || seen.has(en)) continue
    const zh = String(w.zh || '').trim() || lookupZh(en) || ''
    if (!zh) continue
    seen.add(en)
    out.push({ en, zh, emoji: w.emoji || '🚀' })
  }
  return out
}

/** 一集的例句（同集内去重、保序、每句带中文）。
 *
 * ⚠️ 去重 key 要额外抹掉**标点前的空格**：原始数据里同一句会同时出现
 * `"...Elementary School."` 与 `"...Elementary School ."` 两种写法，
 * 只按空白折叠会把它们当成两句，孩子读的时候同一句连着念两遍。
 * 显示时也顺手清掉那个空格（句点前留空格读着别扭）。 */
function rgSentences(story: Story): ReadingSentence[] {
  const seen = new Set<string>()
  const lines: ReadingSentence[] = []
  for (const w of story.words) {
    const raw = (w.bookSentence || w.sentence || '').trim()
    if (!raw) continue
    const text = raw.replace(/\s+([.,!?;:])/g, '$1')
    const zh = (w.bookSentenceZh || w.sentenceZh || '').trim()
    const key = text.toLowerCase().replace(/\s+/g, ' ')
    if (seen.has(key)) continue
    seen.add(key)
    lines.push({ en: text, zh: zh || lookupZh(wordBase(text)) || '' })
  }
  return lines
}

/** 一集故事 → 一个阅读页（最多 10 句，不分页）。 */
export function rgPassage(story: Story): ReadingPassage | undefined {
  const lines = rgSentences(story).slice(0, RG_SENTENCES_PER_PASSAGE)
  if (lines.length === 0) return undefined
  return {
    title: story.title,
    // 文案必须诚实：RG 只有词条例句，没有绘本原文。
    titleZh: '这一集的例句',
    paragraphs: [lines],
  }
}

// ---------- 故事弧分组 ----------

export interface RgArc {
  id: number
  /** 弧名（标题冒号前、去掉结尾序号的共同前缀） */
  name: string
  stories: Story[]
  emoji: string
}

/** 标题 → 弧名。`Rocket Girl vs. the Robot 3: ...` → `Rocket Girl vs. the Robot` */
function arcNameOf(title: string): string {
  const beforeColon = title.includes(':') ? title.slice(0, title.indexOf(':')) : title
  return beforeColon.replace(/\s+\d+\s*$/, '').trim()
}

/** 一集在弧内的「第几集」：优先取标题冒号前的序号，否则按数组顺序 */
function partOf(story: Story, fallback: number): number {
  const m = story.title.match(/\s(\d+)\s*:/)
  const n = m ? Number(m[1]) : NaN
  return Number.isFinite(n) && n > 0 ? n : fallback
}

/** 课列表里显示的英文标题：冒号后的副标题；没有副标题（4 集同名 Rocket Girl）就用 Part N */
function lessonTitleOf(story: Story, part: number): string {
  const i = story.title.indexOf(':')
  return i >= 0 ? story.title.slice(i + 1).trim() : `Part ${part}`
}

/** 108 集 → 27 个故事弧（实测每条弧恰好 4 集），保持原顺序。 */
export const rgArcs: RgArc[] = (() => {
  const groups = new Map<string, Story[]>()
  for (const s of rocketGirlStories) {
    const name = arcNameOf(s.title)
    const list = groups.get(name)
    if (list) list.push(s)
    else groups.set(name, [s])
  }
  return [...groups.entries()].map(([name, stories], i) => ({
    id: i + 1,
    name,
    stories,
    emoji: stories[0]?.emoji ?? '🚀',
  }))
})()

export const rgArcCount = rgArcs.length
export const rgStoryCount = rocketGirlStories.length

/** 弧 → 阅读模块的「单元」。unitId = 弧序号，lessonId = 弧内第几集（1 起）。 */
const rgModules: ReadingModule[] = rgArcs.map((arc) => {
  const firstId = arc.stories[0]?.id
  const lastId = arc.stories[arc.stories.length - 1]?.id
  return {
    id: arc.id,
    slug: `rg-arc-${arc.id}`,
    title: arc.name,
    titleZh: firstId && lastId ? `第 ${firstId}—${lastId} 集` : `${arc.stories.length} 集`,
    emoji: arc.emoji,
    color: RG_THEME.color,
    colorSoft: RG_THEME.colorSoft,
    lessons: arc.stories.map((s, i) => {
      const part = partOf(s, i + 1)
      return {
        id: part,
        title: lessonTitleOf(s, part),
        titleZh: `第 ${part} 集`,
        words: rgReadingVocab(s),
      }
    }),
  }
})

/**
 * (弧号, 集号) → 阅读页。集号是标题里的序号（1..4），不是数组下标。
 *
 * ⚠️ **必须返回稳定引用**：ReadingZone 有 `useEffect([passage])`，引用一变就会
 * `cancelSpeech()` 掐断正在播的朗读。ReadingBook 每次渲染都会调 `passageOf`
 * （`readingLessonsOf` 还会为全部 108 课各调一次），若这里每次 `rgPassage()`
 * 新建一个对象，孩子点「慢速 / 记忆 / 中文」或 SRS 一更新，整篇朗读就断了。
 * Starlight 的 `getReadingPassage` 返回静态 map 里的引用，天然稳定；RG 是现算的，
 * 故按 key 缓存一次。旧 StoryPage 时代是用 useMemo 稳住的，并入 ReadingBook 后
 * 那层 useMemo 没了，缓存必须落在这里。
 */
const PASSAGE_CACHE = new Map<string, ReadingPassage | undefined>()

export function rgPassageOf(arcId: number, lessonId: number): ReadingPassage | undefined {
  const key = `${arcId}-${lessonId}`
  if (PASSAGE_CACHE.has(key)) return PASSAGE_CACHE.get(key)
  const arc = rgArcs[arcId - 1]
  const story = arc?.stories.find((s, i) => partOf(s, i + 1) === lessonId)
  const passage = story ? rgPassage(story) : undefined
  PASSAGE_CACHE.set(key, passage)
  return passage
}

/** 首屏宝藏词示例：第一弧里真实可点、有中文的前 5 个单词。 */
export const rgHeroWords: string[] = (() => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const s of rgArcs[0]?.stories ?? []) {
    for (const w of rgReadingVocab(s)) {
      if (seen.has(w.en)) continue
      seen.add(w.en)
      out.push(w.en)
      if (out.length === 5) return out
    }
  }
  return out
})()

/** 喂给 ReadingBook 的完整数据源（自定义书：没有 level、没有系列切换条）。 */
export const RG_READING_SOURCE: ReadingSource = {
  mods: rgModules,
  passageOf: rgPassageOf,
  heroWords: rgHeroWords,
}

// ---------- RG 专属词表（不进 BOOK_WORD_ZH） ----------

/**
 * 从 108 集词条自动生成的 en→zh 表（1067 个单 token）。
 * 作用域只限 Rocket Girl：不合并进全局 BOOK_WORD_ZH，因为后者还被
 * `bookQuiz.ts` 用来挑挖空候选，倒进去会悄悄改变 Fly Guy / Starlight 的出题分布。
 */
const AUTO_GLOSS: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  for (const s of rocketGirlStories) {
    for (const w of s.words) {
      const en = toWordToken(w.en)
      const zh = String(w.zh || '').trim()
      if (en && zh && m[en] === undefined) m[en] = zh
    }
  }
  return m
})()

/** 人工补的高频词形：自动词表 + bookDict 都覆盖不到，但孩子在例句里天天会点到。
 *  按实测频次排序取前 ~120（覆盖剩余词次的约 90%）。
 *  判据沿用 bookDict.ts 的三类：人名标「(人名)」、实义词给中文、语气词给拟声。 */
const MANUAL_GLOSS: Record<string, string> = {
  // 角色 / 专有名词
  roxy: '罗克茜(人名)', roxys: '罗克茜的', terrell: '特雷尔(人名)', terrells: '特雷尔的',
  smith: '史密斯(人名)', smiths: '史密斯的', mara: '玛拉(人名)', mrs: '夫人(Mrs.)',
  mr: '先生(Mr.)', dr: '博士(Dr.)', max: '麦克斯(人名)', rex: '雷克斯(人名)',
  penn: '佩恩(人名)', bart: '巴特(人名)', hank: '汉克(人名)', bessie: '贝茜(人名)',
  bonnie: '邦妮(人名)', freddie: '弗雷迪(人名)', violet: '维奥莱特(人名)', von: '冯(人名)',
  sammy: '萨米(人名)', joes: '乔斯(人名)', ditto: '迪托(人名)', garson: '加森(人名)',
  // 常见实义
  huge: '巨大的', large: '大的', soon: '很快', money: '钱', beams: '光束',
  pulled: '拉(过去)', bounced: '弹起(过去)', appeared: '出现(过去)', along: '沿着',
  reached: '到达(过去)', someone: '某人', wiggles: '扭动', screen: '屏幕',
  figure: '身影；数字', blasted: '炸开(过去)', later: '后来', west: '西边',
  site: '地点', men: '男人们(复数)', robbed: '抢劫(过去)', sweeps: '扫过',
  exploded: '爆炸(过去)', scratched: '抓(过去)', elementary: '小学的', moved: '移动(过去)',
  spotted: '发现(过去)', pressed: '按(过去)', peered: '凝视(过去)', cowboy: '牛仔',
  covered: '盖住(过去)', hope: '希望', taking: '拿(进行)', villains: '坏蛋(复数)',
  jewels: '珠宝(复数)', zombies: '僵尸(复数)', sloppy: '邋遢的', students: '学生(复数)',
  never: '从不', store: '商店', rid: '摆脱', rushed: '冲(过去)', buttons: '纽扣(复数)',
  cleared: '清除了', treads: '履带', problem: '问题', fangs: '尖牙(复数)',
  leaped: '跳(过去)', clones: '克隆体(复数)', lasers: '激光(复数)', twisted: '扭曲(过去)',
  attached: '附上(过去)', aimed: '瞄准(过去)', hypnotized: '被催眠的', glared: '怒视(过去)',
  during: '在…期间', skidded: '打滑(过去)', invading: '入侵', footprints: '脚印(复数)',
  plaza: '广场', charged: '冲上去(过去)', wires: '电线(复数)', gum: '口香糖',
  dollars: '美元(复数)', mountain: '山', motorcycles: '摩托车(复数)', bricks: '砖(复数)',
  base: '基地', digging: '挖', firefighters: '消防员(复数)', beeped: '哔了一声',
  gulped: '大口吞(过去)', delivery: '递送', savings: '存款', boots: '靴子(复数)',
  beard: '胡子', invited: '邀请(过去)', shook: '摇(过去)', pile: '一堆',
  lightning: '闪电', passengers: '乘客(复数)', vans: '货车(复数)', folded: '折叠(过去)',
  officers: '警官(复数)', tracks: '轨道', lake: '湖', blooms: '开花',
  clues: '线索(复数)', university: '大学', real: '真的', antennae: '触角(复数)',
  pickup: '皮卡车', switches: '开关(复数)', smooth: '光滑的', glad: '高兴的',
  silver: '银色的', pinned: '别住(过去)', happened: '发生(过去)', episode: '一集',
  weatherman: '气象员', croaking: '呱呱叫', swooped: '俯冲(过去)', lever: '拉杆',
  office: '办公室', binoculars: '双筒望远镜', arena: '竞技场', handcuffs: '手铐',
  collar: '衣领', court: '法庭', wallets: '钱包(复数)', coffee: '咖啡',
  week: '星期', life: '生活', parlor: '客厅', fangs2: '尖牙',
  // 语气 / OCR 噪声（给个能看懂的兜底，别显示「还没这个词」）
  spinspun: '旋转(spin/spun)', leadled: '带领(lead/led)', stealstolestolen: '偷(steal/stole/stolen)',
  lielay: '躺(lie/lay)', badworse: '坏/更坏', badworseworst: '坏/更坏/最坏',
  'sloppy joe': '牛肉糜面包', ch: '嗤(拟声)', mo: '哞(牛叫)', pe: '呸(拟声)',
  ra: '啦(拟声)', o: '哦', u: '你(U)', er: '呃', s: '的(所有格)',
  t: 't(缩写)', id: '身份证；它', um: '嗯', aww: '啊(感叹)',
}

const SUFFIXES = ['est', 'ing', 'ed', 'es', 'ly', 'er', 's'] as const

/**
 * RG 页级查词：bookDict → 自动/人工词表 → 词形回退。
 * 只由 Rocket Girl 的阅读器调用，不影响其它 TappableWords 消费者。
 */
export function lookupRgZh(base: string): string | undefined {
  const b = wordBase(base)
  if (!b) return undefined
  const direct = lookupZh(b)
  if (direct) return direct
  if (AUTO_GLOSS[b]) return AUTO_GLOSS[b]
  if (MANUAL_GLOSS[b]) return MANUAL_GLOSS[b]

  // 词形回退：pulled→pull、bounced→bounce、cries→cry、running→run
  for (const suf of SUFFIXES) {
    if (!b.endsWith(suf) || b.length - suf.length < 3) continue
    const stem = b.slice(0, -suf.length)
    for (const cand of [
      stem,
      stem + 'e', // bounced → bounce
      stem.endsWith('i') ? stem.slice(0, -1) + 'y' : '', // cried → cry
      stem.length > 2 && stem.at(-1) === stem.at(-2) ? stem.slice(0, -1) : '', // running → run
    ]) {
      if (!cand) continue
      const zh = lookupZh(cand) || AUTO_GLOSS[cand] || MANUAL_GLOSS[cand]
      if (zh) return zh
    }
  }
  return undefined
}

/** 覆盖率诊断用：导出词表大小，供单测防止「有人把 RG 词倒进全局词典」时对照 */
export const RG_GLOSS_SIZE = Object.keys(AUTO_GLOSS).length + Object.keys(MANUAL_GLOSS).length
