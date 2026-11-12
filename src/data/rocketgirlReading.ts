// Rocket Girl → 阅读器适配层（零 UI，纯函数）。
//
// 为什么单独一层：`rocketgirl.ts` 的 Story 是「108 个闯关关卡 + 词条 + 例句」，
// 而阅读模块的 ReadingZone 需要 `ReadingPassage`（连贯段落）+ `Word[]`。
// 两者语义不同，这里做**只读适配**，不改 rocketgirl.ts 的导出形状，
// 也不把 RG 例句塞进 READING_PASSAGES（那会污染 readingPassage.test.ts 的零超纲口径）。
//
// 三条硬约束：
//   1. RG 没有绘本正文（0/108 有 bookText），只有 2301 条「例句 + 中文」。
//      所以这里产出的是**例句页**，文案一律说「这一关的例句」，绝不标成「绘本原文 / 小故事」。
//   2. 例句互不相关（每关 12~31 句），串成「听整篇」的长音频没意义，
//      而且会踩云 TTS 超时。故按 SENTENCES_PER_PAGE 切成 2~3 页。
//   3. 词条里 777/2797 是多词或带噪声（`sloppy joe`、`drip (`），
//      TappableWords 按单 token 查词表，多词 key 永远不会命中高亮 —— 必须归一化。

import { rocketGirlStories } from './rocketgirl'
import { lookupZh, wordBase } from '@/utils/bookDict'
import type { ReadingPassage, ReadingSentence } from './reading/index'
import type { Word } from './starlight'
import type { Story } from './story-types'

/** 每页最多几句。Starlight 短文规格是 8~12 句；RG 例句按同口径切，避免长音频超时 */
export const SENTENCES_PER_PAGE = 10

/** 把一条 StoryWord 归一成 Word 能用的单 token 形态；不是单词返回 null */
function toWordToken(en: string): string | null {
  const w = en.toLowerCase().trim()
  // 多词短语 / 带括号的噪声词条：TappableWords 按单 token 查，留着也命中不了
  if (!w || /\s/.test(w) || /[()]/i.test(w) || !/^[a-z]+$/.test(w)) return null
  return w
}

/** 一关的词表（用于阅读器高亮「这一关的词」）。按 token 去重，多词/噪声剔除。
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

/** 一关的例句 → 若干「例句页」。同关内完全重复的句子去重（实测 164 条）。 */
export function rgStoryPages(story: Story): ReadingPassage[] {
  const seen = new Set<string>()
  const lines: ReadingSentence[] = []
  for (const w of story.words) {
    const text = (w.bookSentence || w.sentence || '').trim()
    const zh = (w.bookSentenceZh || w.sentenceZh || '').trim()
    if (!text) continue
    const key = text.toLowerCase().replace(/\s+/g, ' ')
    if (seen.has(key)) continue
    seen.add(key)
    lines.push({ en: text, zh: zh || lookupZh(wordBase(text)) || '' })
  }
  if (lines.length === 0) return []

  const pages: ReadingPassage[] = []
  for (let i = 0; i < lines.length; i += SENTENCES_PER_PAGE) {
    const part = lines.slice(i, i + SENTENCES_PER_PAGE)
    const pageNo = Math.floor(i / SENTENCES_PER_PAGE) + 1
    const total = Math.ceil(lines.length / SENTENCES_PER_PAGE)
    pages.push({
      title: `Part ${pageNo} · ${story.title}`,
      titleZh: total > 1 ? `第 ${pageNo}/${total} 页 · 这一关的例句` : '这一关的例句',
      paragraphs: [part],
    })
  }
  return pages
}

// ---------- RG 专属词表（不进 BOOK_WORD_ZH） ----------

/**
 * 从 108 关词条自动生成的 en→zh 表（1067 个单 token）。
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
 * 只由 Rocket Girl 的阅读器调用，不影响其它 5 个 TappableWords 消费者。
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
