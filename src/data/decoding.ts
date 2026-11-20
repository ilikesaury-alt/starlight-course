// ============================================================
//  解码练习词库（形 → 音）—— 读词训练 Tab 1 的数据源
//  ------------------------------------------------------------
//  和 src/data/alphablocks.ts 的关系：
//    alphablocks 练的是「音 → 形」（听发音，把积木搭出来）；
//    这里练的是反方向「形 → 音」（看词形，自己拼读出来）。
//    后者才是阅读的引擎 —— 看到没学过的词也能读，不用等老师教。
//
//  选词原则（重要，改词库时务必守住）：
//    1. **规则新词**：符合 phonemeSegments 的某条规则，但没在 alphablocks
//       词库里出现过 —— 孩子不能靠"这个词的发音我背过"蒙对；
//    2. 每组必须真的体现该组教学点（team 组要拆出 team、magic 组要拆出
//       magic-e…），由 decoding.test.ts 机器校验，退化成逐字母的词会被抓；
//    3. 有中文 + emoji，但**练习时都不给** —— 给了等于报答案，
//       只在"看拆解"揭晓后展示。
//
//  为什么不用假词（fip / moke）做默认：
//    假词是检验"真会拼读"的好工具，但 TTS 常把它读成别的真词，
//    孩子会被误导；且没有语义，8 岁孩子觉得莫名其妙。
//    这里全部用真词，靠"没见过但符合规则"保证是真解码。
// ============================================================
import { phonemeSegments } from './phonics'
import type { SegmentKind } from './phonics'

export type DecodeGroup = 'short' | 'team' | 'blend' | 'magic' | 'double'

export interface DecodeWord {
  en: string
  zh: string
  emoji: string
}

export interface DecodeGroupMeta {
  key: DecodeGroup
  zh: string
  en: string
  /** 这一组教什么（给孩子看的一句话） */
  teach: string
  /** 和 alphablocks 共用的概念名 */
  concept: string
  color: string
  colorSoft: string
}

export const DECODE_GROUPS: DecodeGroupMeta[] = [
  {
    key: 'short',
    zh: '短音词',
    en: 'Short vowels',
    teach: '一个字母一个音，拼起来就能读',
    concept: '单字母',
    color: '#ef4444',
    colorSoft: '#fee2e2',
  },
  {
    key: 'team',
    zh: '字母小队',
    en: 'Letter teams',
    teach: '几个字母合体，只发一个音',
    concept: '字母小队',
    color: '#eab308',
    colorSoft: '#fef9c3',
  },
  {
    key: 'blend',
    zh: '手拉手',
    en: 'Blends',
    teach: '两个辅音手拉手，各发各的音',
    concept: '手拉手',
    color: '#22c55e',
    colorSoft: '#dcfce7',
  },
  {
    key: 'magic',
    zh: '魔法E',
    en: 'Magic E',
    teach: '末尾的 e 不发声，却让元音变长',
    concept: '魔法E',
    color: '#3b82f6',
    colorSoft: '#dbeafe',
  },
  {
    key: 'double',
    zh: '双写',
    en: 'Double letters',
    teach: '两个一样的字母，只发一个音',
    concept: '双写',
    color: '#f97316',
    colorSoft: '#ffedd5',
  },
]

const w = (en: string, zh: string, emoji: string): DecodeWord => ({ en, zh, emoji })

export const DECODE_WORDS: Record<DecodeGroup, DecodeWord[]> = {
  // CVC：三块各发各的音。都是短元音，不会掉进魔法E 的坑。
  short: [
    w('fan', '扇子', '🪭'), w('ram', '公羊', '🐏'), w('tan', '晒黑', '🌞'),
    w('den', '兽穴', '🕳️'), w('wet', '湿的', '💧'), w('tug', '用力拖', '🚜'),
    w('cop', '警察', '👮'), w('hut', '小屋', '🛖'), w('sad', '难过', '😢'),
    w('fog', '雾', '🌫️'), w('log', '木头', '🪵'), w('fin', '鱼鳍', '🐟'),
  ],

  // 含 team：ee / oa / ea / ai / ch / sh / ou 等，至少拆出一个 team
  team: [
    w('seed', '种子', '🌱'), w('moan', '呻吟', '😮'), w('heat', '热', '🔥'),
    w('coat', '外套', '🧥'), w('main', '主要的', '⭐'), w('rail', '栏杆', '🚧'),
    w('cheek', '脸颊', '😊'), w('shout', '大声喊', '📢'), w('cloud', '云', '☁️'),
    w('beach', '沙滩', '🏖️'),
  ],

  // 含 blend：fr / pl / cr / sw / fl / cl / dr / tr / lt / ft 等
  blend: [
    w('frog', '青蛙', '🐸'), w('plant', '植物', '🌿'), w('crab', '螃蟹', '🦀'),
    w('swim', '游泳', '🏊'), w('flap', '拍翅膀', '🐦'), w('clap', '拍手', '👏'),
    w('drum', '鼓', '🥁'), w('track', '轨道', '🛤️'), w('belt', '腰带', '🩳'),
    w('gift', '礼物', '🎁'),
  ],

  // 魔法E：末尾 e 单独成格（sounds=0），前面元音变长音
  magic: [
    w('hope', '希望', '🌈'), w('bite', '咬', '🦷'), w('rode', '骑（过去）', '🐎'),
    w('made', '做（过去）', '🔨'), w('five', '五', '5️⃣'), w('rose', '玫瑰', '🌹'),
    w('stone', '石头', '🪨'), w('stove', '炉子', '🍳'), w('whale', '鲸鱼', '🐋'),
    w('slope', '斜坡', '⛰️'),
  ],

  // 双写：ll / ss / ff 合成一个音
  double: [
    w('moss', '苔藓', '🌿'), w('puff', '吹一口气', '💨'), w('tall', '高的', '📏'),
    w('wall', '墙', '🧱'), w('cross', '穿过', '✖️'), w('fuss', '大惊小怪', '😤'),
    w('hiss', '嘶嘶声', '🐍'), w('bless', '祝福', '🙏'), w('glass', '玻璃杯', '🥛'),
    w('chess', '国际象棋', '♟️'),
  ],
}

/** 某组必须出现的教学点 kind（decoding.test.ts 用同一份，避免两处口径打架） */
export const GROUP_REQUIRED_KIND: Record<DecodeGroup, SegmentKind> = {
  short: 'letter',
  team: 'team',
  blend: 'blend',
  magic: 'magic-e',
  double: 'double',
}

export function decodeWordsOf(group: DecodeGroup): DecodeWord[] {
  return DECODE_WORDS[group] ?? []
}

/** 取这个词的音素拆解（供页面揭晓时高亮展示） */
export function decodeSegments(word: string) {
  return phonemeSegments(word)
}

export function decodeGroupMeta(group: DecodeGroup): DecodeGroupMeta {
  return DECODE_GROUPS.find((g) => g.key === group) ?? DECODE_GROUPS[0]
}
