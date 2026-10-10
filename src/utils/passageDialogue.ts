// 把课本原文（PDF 提取的逐行文本）拆解成课堂对话：👩‍🏫 外教一句、🧒 孩子一句。
//
// 教材原文本身就是「老师问 / 带读 → 学生答 / 跟读」的片段，只是提取后变成了扁平清单，
// 孩子看着一串孤立句子不知道谁说的。这里按文本特征还原对话体例：
//   · 明确的 "T: …" / "S: …" 标记直接采用（同行的 T/S 拆成两句，标记前的字母串残片丢弃）
//   · 先剥掉教材活动标签（"Read and Say …" 这类前缀），再判断说话人
//   · 课堂指令、提问（Say… / Can you…? / What…? 等）归外教
//   · 跟读、回答、拟声词、单词串、chant 歌谣归孩子
//   · 拿不准的归外教（课堂由老师主导，孩子行是「被点名开口」的那些）
//
// 这是启发式分类，不是教材标注；个别行可能分错，但不影响「点词听发音」的主功能。

export type Speaker = 'T' | 'S'

export interface PassageTurn {
  speaker: Speaker
  en: string
}

/** 孩子：回答 / 跟读 / 拟声 / 单词串（句首匹配） */
const S_RESPONSE =
  /^(it'?s|its|this is|these are|those are|they are|they'?re|there is|there are|here is|here are|i see|i like|i want|i'?d like|i can|i have|i'?m|i am|i love|i eat|i drink|my name is|yes|no|okay|he is|she is|he|she|hello|hi|good (morning|afternoon|evening)|thank you|you'?re welcome|happy birthday|well done|may your|the (rabbit|turtle|panda|monkey|elephant|giraffe|zebra|deer|ant|lion|cat|dog)|first|next|a|an|the)\b/i

/** 拟声词 / chant 歌谣：孩子集体的部分 */
const S_SOUND = /^(moo|quack|oink|cluck|ribbit|roar|buzz|woo|vroom|choo|beep|ding|la la|tra la|ha!|ha ha|hickety|bumper cars|i like to ride|running, running|happy birthday to you)/i

/**
 * 教材活动标签前缀：PDF 提取时把「活动名」和「教学内容」并到了一行
 * （如 "Read and Say I see elephants in the zoo."）。
 * 先剥掉标签再分类，孩子行才不会被指令前缀带偏。
 */
const ACTIVITY_PREFIX = new RegExp(
  '^(?:' +
    'www\\.[a-z.]+' + // 提取残留的网址
    '|show time' +
    '|lesson\\s+' +
    '|read after me' +
    '|i say,? you (?:jump|circle|do|choose|act|tick)' +
    '|i point,? you say' +
    '|practice the conversation' +
    '|[a-z][a-z, ]*\\band say' + // Read and Say / Look, Listen and Say / Count and Say …
    '|say .*?\\bwith me' + // Say “Fat” or “Thin” with Me fat
  ')\\s+',
  'i'
)

/** 剥掉行首的教材活动标签（可剥多层，如 "www.landi.com Show Time Hello, everyone!"） */
function stripActivityPrefix(line: string): string {
  let s = line
  for (let i = 0; i < 3; i++) {
    const m = s.match(ACTIVITY_PREFIX)
    if (!m) break
    const rest = s.slice(m[0].length).trim()
    if (!rest) break // 剥空了就停，保留原行（它就是一条指令）
    s = rest
  }
  return s
}

/** 无句子标点的短单词串（2~5 个短词）：孩子跟读的词汇串 */
const isDrillList = (s: string) => {
  if (/[.?!,;:]/.test(s)) return false
  const toks = s.split(/\s+/)
  if (toks.length < 2 || toks.length > 5) return false
  return toks.every((t) => /^[A-Za-z0-9'-]{1,9}$/.test(t))
}

/** 拆出所有 "T:" / "S:" 标记；标记前的残片（字母串等版面残留）丢弃 */
function splitMarkers(line: string): PassageTurn[] | null {
  const re = /\b([TS]):/g
  const marks: { speaker: Speaker; idx: number }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) marks.push({ speaker: m[1] as Speaker, idx: m.index })
  if (marks.length === 0) return null
  const out: PassageTurn[] = []
  marks.forEach((mk, i) => {
    const start = mk.idx + 2 // 跳过 "T:"
    const end = i + 1 < marks.length ? marks[i + 1].idx : line.length
    const en = line.slice(start, end).trim().replace(/^[,;]\s*/, '')
    if (en) out.push({ speaker: mk.speaker, en })
  })
  return out.length ? out : null
}

/** 无标记行按文本特征归类 */
function classify(line: string): Speaker {
  const s = stripActivityPrefix(line.trim())

  // 问句归外教（孩子是被提问方）
  if (/\?$/.test(s)) return 'T'

  // 单词行 / 单词串：孩子跟读
  const toks = s.split(/\s+/)
  if (toks.length === 1 && /^[A-Za-z0-9'-]+$/.test(toks[0])) return 'S'
  if (isDrillList(s)) return 'S'

  // 拟声 / 歌谣归孩子
  if (S_SOUND.test(s)) return 'S'

  // 回答 / 跟读句型归孩子
  if (S_RESPONSE.test(s)) return 'S'

  // 兜底归外教（课堂指令、活动名、残行等）
  return 'T'
}

/**
 * 把课本原文行列表转成对话轮次。
 * - "T: … S: …" 同行拆两句；标记前残片丢弃
 * - 行首的教材活动标签（"Read and Say …"）剥掉后再分类与展示，避免指令前缀污染孩子行
 * - 空行 / 纯编号行（"1." "3."）丢弃——那是版面残留，不是教学内容
 */
export function passageToTurns(lines: string[]): PassageTurn[] {
  const turns: PassageTurn[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (/^\d+\.?$/.test(line)) continue

    const marked = splitMarkers(line)
    if (marked) {
      turns.push(...marked)
      continue
    }

    // 剥掉活动标签后用「干净文本」展示与分类（剥不动时就是原行）
    const en = stripActivityPrefix(line)
    turns.push({ speaker: classify(line), en })
  }
  return turns
}
