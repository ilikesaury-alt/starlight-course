// ============================================================
//  《字母积木》(Alphablocks) 练习词库 —— 按动画的教学分级手维护
//  ------------------------------------------------------------
//  为什么单独建库，而不是复用 eng3a 的课程词：
//    孩子看的是动画，**要练的必须是动画里出现的词**，这样积木拼出来的那一刻
//    他能和画面里听到的词对上号 —— 这才是"看完动画练稳固"的意义。
//    （课程词另有一套：听写练习 /dictation 继续用 eng3a，两者互不干扰。）
//
//  词从哪来：
//    逐集取官方 Alphablocks 官网的 focus words（blocksuniverse.tv 每集页面
//    都会写明 "This episode introduces ... and the words ..."），
//    合并去重后按动画的教学点重新编排。
//
//  为什么手维护（仿 src/data/extensionTopics.ts 的先例）：
//    Alphablocks 属 Alphablocks Ltd / BBC CBeebies 版权，没有开放词表可抄；
//    现有开放词表（ECDICT / Oxford 3000 等）只有"单词池"，
//    既没有"动画每集教什么"的分组，也没有中英对照 + emoji。
//
//  ⚠️ 维护约定（改词库时务必遵守）：
//    1. 每个词必须能用 phonemeSegments() 拆出**有教学价值**的结构
//       （字母小队 / 手拉手 / 双写 / 魔法E），别塞一堆纯逐字母的词。
//    2. 词表按动画的**教学点**分组，不是按字母表顺序 —— 因为
//       动画的推进逻辑是"先单字母 → 再字母小队 → 再手拉手 → 再魔法E"。
//    3. zh 必须是一眼能懂的日常说法，不要生僻词（这是给 6-9 岁孩子看的）。
//    4. emoji 一眼能对上词。
// ============================================================

/** 动画的教学级别（= 官方五级配色） */
export type BlockLevel = 'red' | 'orange' | 'yellow' | 'green' | 'blue'

export interface BlockWord {
  en: string
  zh: string
  emoji: string
}

/** 级别元信息：动画里的官方叫法 + 颜色 + 这一级教什么 */
export interface BlockLevelMeta {
  key: BlockLevel
  /** 官方级别名 */
  en: string
  /** 中文名（给家长看） */
  zh: string
  /** 主题色 */
  color: string
  colorSoft: string
  /** 这一级教什么（给孩子看的一句话） */
  teach: string
  /** 动画里的概念名（孩子有印象，直接用） */
  concept: string
}

export const BLOCK_LEVELS: BlockLevelMeta[] = [
  {
    key: 'red',
    en: 'Level 1 · Red',
    zh: '第一级 · 红',
    color: '#ef4444',
    colorSoft: '#fee2e2',
    teach: '每个字母自己一个声音',
    concept: '单字母',
  },
  {
    key: 'orange',
    en: 'Level 2 · Orange',
    zh: '第二级 · 橙',
    color: '#f97316',
    colorSoft: '#ffedd5',
    teach: '把 26 个字母都认全、读准',
    concept: '单字母',
  },
  {
    key: 'yellow',
    en: 'Level 3 · Yellow',
    zh: '第三级 · 黄',
    color: '#eab308',
    colorSoft: '#fef9c3',
    teach: '两个或三个字母手拉手，合体发一个音',
    concept: '字母小队',
  },
  {
    key: 'green',
    en: 'Level 4 · Green',
    zh: '第四级 · 绿',
    color: '#22c55e',
    colorSoft: '#dcfce7',
    teach: '两个辅音手拉手，各发各的音',
    concept: '手拉手',
  },
  {
    key: 'blue',
    en: 'Level 5 · Blue',
    zh: '第五级 · 蓝',
    color: '#3b82f6',
    colorSoft: '#dbeafe',
    teach: '魔法E 出场，让元音发长音',
    concept: '魔法E',
  },
]

const w = (en: string, zh: string, emoji: string): BlockWord => ({ en, zh, emoji })

/**
 * 词库：按级别分组，每组内部按「教学点」再分批。
 * level 里同一批次的词共享一个教学点（见 words 里的分组注释）。
 */
export const BLOCK_WORDS: Record<BlockLevel, BlockWord[]> = {
  // ============ L1 红：单字母，一个字母一个音 ============
  red: [
    // 教学点：cat / dog / pig —— 三个字母各发各的
    w('cat', '猫', '🐱'), w('dog', '狗', '🐶'), w('pig', '猪', '🐷'),
    w('hen', '母鸡', '🐔'), w('fox', '狐狸', '🦊'), w('bug', '小虫', '🐛'),
    // 教学点：短元音 a —— cap / map / hat
    w('cap', '帽子', '🧢'), w('hat', '帽子', '👒'), w('map', '地图', '🗺️'),
    // 教学点：短元音 i —— pin / sit / win
    w('pin', '别针', '📌'), w('sit', '坐', '🪑'), w('win', '赢', '🏆'),
    // 教学点：短元音 o —— top / hop / pot
    w('top', '顶部', '🔝'), w('hop', '跳', '🐸'), w('pot', '锅', '🍲'),
    // 教学点：短元音 u —— sun / bus / cup
    w('sun', '太阳', '☀️'), w('bus', '公交车', '🚌'), w('cup', '杯子', '☕'),
    // 教学点：短元音 e —— bed / hen / net
    w('bed', '床', '🛏️'), w('net', '网', '🥅'), w('red', '红色', '🔴'),
    // 教学点：c / k 两种写法 —— cat / kit
    w('kit', '工具包', '🧰'), w('rug', '地毯', '🧶'), w('mud', '泥', '🟤'),
  ],

  // ============ L2 橙：字母认全 + 常见组合 ============
  orange: [
    // 教学点：j / v / w / x / y / z 这些"后学的字母"
    w('jam', '果酱', '🍓'), w('van', '货车', '🚐'), w('web', '蜘蛛网', '🕸️'),
    w('yak', '牦牛', '🐂'), w('zip', '拉链', '🤐'),
    // 教学点：qu —— queen / quack / quiz
    w('queen', '女王', '👑'), w('quack', '嘎嘎叫', '🦆'), w('quiz', '小测验', '❓'),
    // 教学点：th —— thin / this
    w('thin', '瘦的', '🪶'), w('this', '这个', '👇'),
    // 教学点：sh —— ship / shop
    w('ship', '轮船', '🚢'), w('shop', '商店', '🏪'),
    // 教学点：ch —— chip / chin
    w('chip', '薯片', '🍟'), w('chin', '下巴', '😀'),
    // 教学点：ng —— king / sing
    w('king', '国王', '👑'), w('sing', '唱歌', '🎤'),
    // 教学点：ck / c —— back / cat
    w('back', '回去', '⬅️'), w('duck', '鸭子', '🦆'),
  ],

  // ============ L3 黄：字母小队（两三个字母合成一个音） ============
  yellow: [
    // 教学点：oo —— moon / book / cook
    w('moon', '月亮', '🌕'), w('book', '书', '📖'), w('cook', '做饭', '👨‍🍳'),
    w('boot', '靴子', '🥾'), w('food', '食物', '🍎'),
    // 教学点：ee —— sleep / sheep / tree
    w('sleep', '睡觉', '😴'), w('sheep', '绵羊', '🐑'), w('tree', '树', '🌳'),
    w('green', '绿色', '🟢'), w('meet', '见面', '🤝'),
    // 教学点：ai / ay —— rain / day / play
    w('rain', '雨', '🌧️'), w('day', '白天', '🌤️'), w('play', '玩', '🎮'),
    w('snail', '蜗牛', '🐌'),
    // 教学点：igh（三个字母的小队）—— night / light / high
    w('night', '夜晚', '🌙'), w('light', '灯', '💡'), w('right', '对的', '✔️'),
    w('tight', '紧的', '🔗'),
    // 教学点：air / are —— chair / fair
    w('chair', '椅子', '🪑'), w('fair', '公平的', '⚖️'),
    // 教学点：or / ow —— fork / cow
    w('fork', '叉子', '🍴'), w('cow', '奶牛', '🐄'), w('brown', '棕色', '🟤'),
  ],

  // ============ L4 绿：手拉手（辅音簇，各发各的音） ============
  green: [
    // 教学点：st- 开头 —— star / stop / stick
    w('star', '星星', '⭐'), w('stop', '停', '🛑'), w('stick', '棍子', '🥢'),
    // 教学点：tr- / thr- 开头 —— train / three
    w('train', '火车', '🚆'), w('three', '三', '3️⃣'), w('trap', '陷阱', '🪤'),
    // 教学点：bl- / br- 开头 —— blue / bread
    w('blue', '蓝色', '🔵'), w('bread', '面包', '🍞'), w('branch', '树枝', '🌿'),
    // 教学点：-nd 结尾 —— hand / sand
    w('hand', '手', '✋'), w('sand', '沙子', '🏖️'), w('band', '乐队', '🎸'),
    // 教学点：-st 结尾 —— best / first
    w('best', '最好的', '🥇'), w('first', '第一', '1️⃣'), w('last', '最后', '🔚'),
    // 教学点：-mp / -nt 结尾 —— jump / tent
    w('jump', '跳', '🦘'), w('tent', '帐篷', '⛺'), w('mistle', '薄雾', '🌫️'),
  ],

  // ============ L5 蓝：魔法E（e 自己不发声，让前面元音发长音） ============
  blue: [
    // 教学点：a_e —— cake / name / game
    w('cake', '蛋糕', '🍰'), w('name', '名字', '🏷️'), w('game', '游戏', '🎮'),
    w('snake', '蛇', '🐍'), w('tail', '尾巴', '🐕'),
    // 教学点：i_e —— nine / kite / bike
    w('nine', '九', '9️⃣'), w('kite', '风筝', '🪁'), w('bike', '自行车', '🚲'),
    // 教学点：o_e —— home / nose / rope
    w('home', '家', '🏠'), w('nose', '鼻子', '👃'), w('rope', '绳子', '🪢'),
    w('hole', '洞', '🕳️'),
    // 教学点：oa 也是一个小队 —— goat / boat
    w('goat', '山羊', '🐐'), w('boat', '小船', '⛵'),
    // 教学点：u_e —— tube / cute / mule
    w('tube', '管子', '🧪'), w('cute', '可爱的', '🥰'), w('mule', '骡子', '🫏'),
    // 教学点：-e_e —— keep / deep
    w('keep', '保留', '🔒'), w('deep', '深的', '🌊'),
  ],
}

/**
 * 特别篇：动画 S1E17「Hill」等集专门教的**双写**（两个一样的字母合成一个音）。
 * 官方就叫 "double letters"（FF / LL / SS），这是动画里独立于五级的一课。
 */
export const BLOCK_DOUBLE_WORDS: BlockWord[] = [
  w('hill', '小山', '⛰️'), w('doll', '洋娃娃', '🪆'), w('bell', '铃铛', '🔔'),
  w('mess', '乱', '🧹'), w('miss', '想念', '💭'), w('kiss', '亲亲', '😘'),
  w('off', '关掉', '⏺️'), w('egg', '蛋', '🥚'),
]

/** 某个级别的全部词（正课 + 特别篇按需） */
export function blockWordsOf(level: BlockLevel, withDoubles = false): BlockWord[] {
  const base = BLOCK_WORDS[level] ?? []
  return withDoubles ? [...base, ...BLOCK_DOUBLE_WORDS] : base
}

/** 全部级别 */
export const BLOCK_LEVEL_KEYS: BlockLevel[] = BLOCK_LEVELS.map((l) => l.key)

/** 按级别取元信息 */
export function blockLevelMeta(level: BlockLevel): BlockLevelMeta {
  return BLOCK_LEVELS.find((l) => l.key === level) ?? BLOCK_LEVELS[0]
}
