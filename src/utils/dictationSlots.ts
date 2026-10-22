// ============================================================
//  听写「一字一盒」纯逻辑
//  ------------------------------------------------------------
//  从 DictationPlayer 里抽出来的规则层（组件只负责渲染与交互）：
//    - spellingLetters / normalizeSpelling：比对口径（去空白、小写、只留字母）
//    - isSpellingCorrect：答案比对（let's 与 lets 等价 —— 撇号由固定格显示，
//      不需要孩子额外打出来）
//    - buildDictationSlots：把「答案 + 当前输入 + 判定状态」铺成字母盒
//    - firstMistakeIndex：第一个写错/漏写的位置（1 基），用于「第 n 个字母不对」
//
//  为什么值得单独成文件：
//    · 这套规则决定「判对判错 / 哪个格子变红 / 还差几个字母」，是最容易静默改坏、
//      又最不容易被 UI 一眼看出来的部分 —— 必须有单测钉住（见 dictationSlots.test.ts）。
//    · 留在组件里只能靠导出函数才能测，会触发 react-refresh 告警（组件文件只应导出组件）。
//
//  格子布局跟着**答案自身**的字符走：字母=可写格，撇号等符号=固定装饰格。
//  这样 let's 只铺 4 个字母格 + 1 个撇号格，孩子只打 lets 就能判对。
// ============================================================

/** 字母盒一格的视觉状态 */
export type SlotState = 'empty' | 'filled' | 'ok' | 'bad' | 'missing' | 'punct'

/** 一轮的判定状态（与 DictationPlayer 的 status 同构） */
export type SlotStatus = 'idle' | 'correct' | 'wrong' | 'revealed'

export interface DictationSlot {
  ch: string
  state: SlotState
  /** 是否是「下一个要写」的光标格 */
  caret?: boolean
}

/** 归一化：去空白 + 小写。 */
export function normalizeSpelling(s: string): string {
  return s.trim().toLowerCase()
}

/** 只留小写字母：撇号等符号不算「孩子要写的字母」（let's 只写 lets）。 */
export function spellingLetters(s: string): string {
  return normalizeSpelling(s).replace(/[^a-z]/g, '')
}

/** 答案比对：按字母序列比较，忽略空白/大小写/撇号。 */
export function isSpellingCorrect(answer: string, input: string): boolean {
  const a = spellingLetters(answer)
  return a.length > 0 && a === spellingLetters(input)
}

/** 答案的逐字符布局：字母=可写格，撇号等非字母=固定装饰格。 */
function answerLayout(answer: string): { ch: string; letter: boolean }[] {
  return answer.split('').map((ch) => ({ ch, letter: /[a-zA-Z]/.test(ch) }))
}

/**
 * 铺字母盒（一字一盒）。
 *
 *   · idle：按已打内容铺格，下一个空位带光标；
 *   · correct：格子全部判对（绿）；
 *   · wrong：逐格对答案判色（对的绿、错的红），漏写的补虚线空格 —— 让孩子一眼看见
 *     「第几个字母错了 / 还差几个」，而不是只收到一个「错了」；
 *   · revealed：直接铺出正确答案，孩子照着记，而不是继续盯着自己写错的那串。
 */
export function buildDictationSlots(
  answer: string,
  input: string,
  status: SlotStatus,
): DictationSlot[] {
  const layout = answerLayout(answer)
  const answerLetters = spellingLetters(answer).split('')
  const typedChars = spellingLetters(input).split('')

  if (status === 'revealed') {
    return layout.map((s) => ({
      ch: s.ch,
      state: (s.letter ? 'ok' : 'punct') as SlotState,
    }))
  }

  const wrong = status === 'wrong'
  const out: DictationSlot[] = []
  let li = 0 // 已消费到第几个「孩子打的字母」
  let caretPlaced = false
  // 铺开的格子数 = 答案自身的字符布局；多打的字母补在后面。
  // 只有 idle 才留尾部空光标格 —— wrong 时留空会把「漏写的字母」挤成普通空格，
  // 虚线提示（missing）就永远出不来，孩子看不出到底还差几个；
  // correct 时答案已判对，再挂一个空格只是视觉噪音。
  const total =
    status === 'idle'
      ? Math.max(layout.length, typedChars.length + 1)
      : Math.max(layout.length, typedChars.length)

  for (let i = 0; i < total; i++) {
    const target = layout[i]
    if (target && !target.letter) {
      // 撇号格：一直显示，不占孩子输入位
      out.push({ ch: target.ch, state: 'punct' })
      continue
    }
    const ch = typedChars[li] ?? ''
    if (!ch) {
      if (wrong) {
        // 第一次错：没写到的字母补虚线格，一眼看见还差几个
        out.push({ ch: '', state: 'missing' })
      } else if (!caretPlaced) {
        out.push({ ch: '', state: 'empty', caret: true })
        caretPlaced = true
      } else {
        out.push({ ch: '', state: 'empty' })
      }
      li++
      continue
    }
    let state: SlotState = 'filled'
    if (status === 'correct') state = 'ok'
    else if (wrong) state = answerLetters[li] === ch ? 'ok' : 'bad'
    out.push({ ch, state })
    li++
  }

  return out
}

/**
 * 第一个写错/漏写的位置（1 基，用于「第 n 个字母」的人话提示）；-1 表示无需提示。
 * 只关心「孩子已打的部分」：先找第一个与答案不一致的位置，全都对但没打完则返回下一格。
 */
export function firstMistakeIndex(answer: string, input: string): number {
  const answerLetters = spellingLetters(answer).split('')
  const typedChars = spellingLetters(input).split('')
  for (let i = 0; i < typedChars.length; i++) {
    if (answerLetters[i] !== typedChars[i]) return i + 1
  }
  if (typedChars.length < answerLetters.length) return typedChars.length + 1
  return -1
}
