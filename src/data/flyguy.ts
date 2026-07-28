// Fly Guy 主题课程数据层
// 内容来源:基于 Tedd Arnold 的《Fly Guy》系列童书(早期分级读物,适读年龄 4-7 岁,
// 共约 22 本,2005–2020)。课程按真实书目主题拆分 22 个故事关卡,
// 每关 8 个适龄高频词汇(英文 + 中文释义 + 例句),书单为真实书目清单。
// 绘本 PDF 受版权保护,不内置;课程仅用文本词汇数据。

export interface FGWord {
  en: string
  zh: string
  sentence?: string
  sentenceZh?: string
  emoji?: string
}

export interface FGStory {
  id: number
  slug: string
  title: string
  emoji: string
  words: FGWord[]
}

export interface FGBook {
  title: string
}

// Fly Guy 专属主题色(鲜绿 + 柔绿),区别于 Starlight 天蓝与 Rocket Girl 紫罗兰
export const FG_THEME = {
  color: '#16a34a',
  colorSoft: '#dcfce7',
} as const

// ---- 故事 emoji:按标题关键词匹配,否则按索引轮询活泼图标 ----
// 每个故事用唯一关键词匹配专属图标;通用 /fly/ 兜底已移除,否则所有标题都会被兜底成 🐝
const STORY_EMOJI_RULES: [RegExp, string][] = [
  [/hi! fly guy/i, '🐝'],                 // #1 Hi! Fly Guy
  [/super fly/i, '💥'],                   // #2 Super Fly Guy
  [/shoo/i, '🍔'],                       // #3 Shoo, Fly Guy!
  [/fly high/i, '🌤️'],                   // #4 Fly High, Fly Guy!
  [/hooray/i, '🎉'],                     // #5 Hooray for Fly Guy!
  [/i spy/i, '🫣'],                      // #6 I Spy Fly Guy!
  [/fly girl|meets/i, '🤝'],             // #7 Fly Guy Meets Fly Girl
  [/buzz boy/i, '🦸'],                   // #8 Buzz Boy and Fly Guy
  [/flyswatter|swatter/i, '🪤'],         // #9 Fly Guy vs. the Flyswatter!
  [/ride/i, '🚗'],                       // #10 Ride, Fly Guy, Ride!
  [/in my soup|soup/i, '🍲'],            // #11 There's a Fly Guy in My Soup
  [/franken/i, '👹'],                    // #12 Fly Guy and the Frankenfly
  [/pet for fly guy|pet for/i, '🐾'],    // #13 A Pet for Fly Guy
  [/prince fly guy|prince/i, '👑'],      // #14 Prince Fly Guy
  [/old lady|swallowed/i, '👵'],         // #15 There Was an Old Lady Who Swallowed Fly Guy
  [/amazing tricks|tricks/i, '🎩'],      // #16 Fly Guy's Amazing Tricks
  [/ninja|christmas/i, '🥷'],            // #17 Fly Guy's Ninja Christmas
  [/big family|family/i, '👪'],          // #18 Fly Guy's Big Family
  [/alien/i, '👽'],                      // #19 Fly Guy and the Alienzz
  [/50-foot|attack/i, '🗼'],             // #20 Attack of the 50-Foot Fly Guy!
  [/sharks/i, '🦈'],                     // #21 Fly Guy Presents: Sharks
  [/dinosaurs|dino/i, '🦕'],             // #22 Fly Guy Presents: Dinosaurs
]
const STORY_EMOJI_FALLBACK = ['🐝', '🟢', '✨', '🌟', '🍀', '💚', '🪁', '🐝']

function pickStoryEmoji(title: string, idx: number): string {
  for (const [re, emoji] of STORY_EMOJI_RULES) {
    if (re.test(title)) return emoji
  }
  return STORY_EMOJI_FALLBACK[idx % STORY_EMOJI_FALLBACK.length]
}

// ---- 单词 emoji:按英文/中文关键词匹配,否则用故事主题 emoji 兜底 ----
const WORD_EMOJI_RULES: [RegExp, string][] = [
  [/food|eat|lunch|dinner|breakfast|pizza|burger|cake|apple|banana|egg|rice|bread|soup|meat|milk|water|juice|snack|cookie|cheese|fruit|vegetable|drink|meal|bowl|spoon|cook|yum|food|吃|食物|蛋糕|汤|碗|勺子|做饭|好吃/i, '🍔'],
  [/cat|dog|pet|animal|lion|tiger|bear|rabbit|bird|duck|pig|cow|sheep|horse|monkey|elephant|mouse|frog|bee|bug|fish|whale|shark|hamster|tail|狗|猫|动物|熊|兔|鸟|鱼|虫|仓鼠|尾巴|宠物/i, '🐾'],
  [/red|blue|yellow|green|orange|purple|color|colour|pink|black|white|brown|颜色|绿色|红色|蓝色|黄色/i, '🌈'],
  [/happy|sad|angry|scared|afraid|tired|excited|love|friend|smile|sweet|cute|like|sweet|高兴|害怕|生气|朋友|喜欢|可爱|爱|微笑/i, '😊'],
  [/run|jump|fly|walk|swim|climb|dance|play|ride|drive|hide|seek|find|look|escape|feed|catch|stop|go|up|down|跑|跳|飞|走|玩|骑|躲|找|逃|喂|抓|停|上|下/i, '🏃'],
  [/book|read|story|school|class|teacher|student|learn|write|pen|pencil|spy|书|读|学|写|老师|学校|寻找|看/i, '📚'],
  [/sun|moon|star|sky|space|rocket|planet|night|day|cloud|wind|wind|太阳|月亮|星星|天空|夜|云|风|白天/i, '🌟'],
  [/house|home|door|window|room|bed|tree|garden|park|city|street|table|castle|throne|房子|家|门|窗|树|公园|城市|街道|桌子|城堡|王座/i, '🏠'],
  [/king|queen|prince|princess|castle|magic|wizard|witch|dragon|robot|alien|monster|ghost|franken|royal|rule|魔法|龙|机器|外星|怪物|皇家|统治/i, '🪄'],
  [/big|small|little|tall|short|long|fast|slow|high|hot|cold|new|old|strong|brave|safe|quick|scary|spooky|big|大|小|高|矮|长|快|慢|新|旧|热|冷|强大|勇敢|安全|可怕/i, '📏'],
  [/car|bus|train|boat|ship|plane|bike|truck|wheel|road|cape|mask|car|巴士|火车|船|飞机|自行车|轮子|路|披风|面具/i, '🚗'],
  [/sing|cheer|gift|party|hooray|dance|fun|surprise|sing|唱|欢呼|礼物|派对|好玩|惊讶/i, '🎉'],
  [/nose|eye|face|hand|body|鼻子|眼睛|脸|手|身体/i, '👃'],
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
  words: { en: string; zh: string; sentence?: string; sentenceZh?: string }[]
}

const rawStories: RawStory[] = [
  {
    title: 'Hi! Fly Guy · 你好，小蝇怪',
    words: [
      { en: 'fly', zh: '苍蝇', sentence: 'The fly can say my name.', sentenceZh: '这只苍蝇会叫我的名字。' },
      { en: 'boy', zh: '男孩', sentence: 'The boy is Buzz.', sentenceZh: '这个男孩叫巴斯。' },
      { en: 'friend', zh: '朋友', sentence: 'Fly Guy is my friend.', sentenceZh: '小蝇怪是我的朋友。' },
      { en: 'name', zh: '名字', sentence: 'What is your name?', sentenceZh: '你叫什么名字？' },
      { en: 'pet', zh: '宠物', sentence: 'He is a pet fly.', sentenceZh: '他是一只宠物苍蝇。' },
      { en: 'hi', zh: '你好', sentence: 'Hi! Fly Guy!', sentenceZh: '你好！小蝇怪！' },
      { en: 'catch', zh: '抓住', sentence: 'Buzz can catch a fly.', sentenceZh: '巴斯能抓住一只苍蝇。' },
      { en: 'happy', zh: '高兴的', sentence: 'Buzz is happy.', sentenceZh: '巴斯很高兴。' },
    ],
  },
  {
    title: 'Super Fly Guy · 超级小蝇怪',
    words: [
      { en: 'super', zh: '超级', sentence: 'Fly Guy is super!', sentenceZh: '小蝇怪超级棒！' },
      { en: 'hero', zh: '英雄', sentence: 'He is a hero.', sentenceZh: '他是英雄。' },
      { en: 'fly', zh: '飞', sentence: 'I can fly high.', sentenceZh: '我能飞得高。' },
      { en: 'save', zh: '拯救', sentence: 'The hero can save a friend.', sentenceZh: '英雄能救朋友。' },
      { en: 'help', zh: '帮助', sentence: 'Fly Guy can help Buzz.', sentenceZh: '小蝇怪能帮助巴斯。' },
      { en: 'strong', zh: '强壮的', sentence: 'Super Fly Guy is strong.', sentenceZh: '超级小蝇怪很强壮。' },
      { en: 'brave', zh: '勇敢的', sentence: 'Be brave!', sentenceZh: '要勇敢！' },
      { en: 'fast', zh: '快的', sentence: 'He is fast.', sentenceZh: '他跑得很快。' },
    ],
  },
  {
    title: 'Shoo, Fly Guy! · 嘘，走开',
    words: [
      { en: 'shoo', zh: '嘘走', sentence: 'Shoo, Fly Guy!', sentenceZh: '嘘，小蝇怪走开！' },
      { en: 'food', zh: '食物', sentence: 'The fly likes food.', sentenceZh: '苍蝇喜欢食物。' },
      { en: 'eat', zh: '吃', sentence: "Don't eat that!", sentenceZh: '别吃那个！' },
      { en: 'bug', zh: '虫子', sentence: 'A bug is small.', sentenceZh: '虫子很小。' },
      { en: 'nose', zh: '鼻子', sentence: 'The fly is on my nose.', sentenceZh: '苍蝇落在我的鼻子上。' },
      { en: 'go', zh: '走', sentence: 'Go away, fly!', sentenceZh: '走开，苍蝇！' },
      { en: 'yuck', zh: '呸/讨厌', sentence: 'Yuck! A fly!', sentenceZh: '呸！一只苍蝇！' },
      { en: 'clean', zh: '干净的', sentence: 'Keep it clean.', sentenceZh: '保持干净。' },
    ],
  },
  {
    title: 'Fly High, Fly Guy! · 飞高点',
    words: [
      { en: 'high', zh: '高的', sentence: 'Fly high, Fly Guy!', sentenceZh: '飞高点，小蝇怪！' },
      { en: 'sky', zh: '天空', sentence: 'The sky is blue.', sentenceZh: '天空是蓝色的。' },
      { en: 'up', zh: '向上', sentence: 'Up, up, up!', sentenceZh: '向上，向上，向上！' },
      { en: 'cloud', zh: '云', sentence: 'A cloud is white.', sentenceZh: '云是白色的。' },
      { en: 'bird', zh: '鸟', sentence: 'A bird can fly.', sentenceZh: '鸟会飞。' },
      { en: 'wind', zh: '风', sentence: 'The wind is strong.', sentenceZh: '风很大。' },
      { en: 'sun', zh: '太阳', sentence: 'The sun is hot.', sentenceZh: '太阳很热。' },
      { en: 'down', zh: '向下', sentence: 'Come down, Fly Guy!', sentenceZh: '下来，小蝇怪！' },
    ],
  },
  {
    title: 'Hooray for Fly Guy! · 好耶派对',
    words: [
      { en: 'hooray', zh: '好耶', sentence: 'Hooray for Fly Guy!', sentenceZh: '好耶，小蝇怪！' },
      { en: 'party', zh: '派对', sentence: 'It is a party.', sentenceZh: '这是个派对。' },
      { en: 'cake', zh: '蛋糕', sentence: 'We eat cake.', sentenceZh: '我们吃蛋糕。' },
      { en: 'sing', zh: '唱歌', sentence: 'We sing a song.', sentenceZh: '我们唱一首歌。' },
      { en: 'dance', zh: '跳舞', sentence: "Let's dance!", sentenceZh: '我们跳舞吧！' },
      { en: 'fun', zh: '有趣的', sentence: 'This is fun!', sentenceZh: '这真好玩！' },
      { en: 'cheer', zh: '欢呼', sentence: 'We cheer for Fly Guy.', sentenceZh: '我们为小蝇怪欢呼。' },
      { en: 'gift', zh: '礼物', sentence: 'A gift for you.', sentenceZh: '给你的礼物。' },
    ],
  },
  {
    title: 'I Spy Fly Guy! · 捉迷藏',
    words: [
      { en: 'spy', zh: '发现', sentence: 'I spy Fly Guy!', sentenceZh: '我看见小蝇怪了！' },
      { en: 'hide', zh: '躲藏', sentence: 'Hide, Fly Guy!', sentenceZh: '躲起来，小蝇怪！' },
      { en: 'seek', zh: '寻找', sentence: 'We seek the fly.', sentenceZh: '我们找苍蝇。' },
      { en: 'find', zh: '找到', sentence: 'I find my friend.', sentenceZh: '我找到了我的朋友。' },
      { en: 'look', zh: '看', sentence: 'Look at the fly!', sentenceZh: '看那只苍蝇！' },
      { en: 'behind', zh: '在…后面', sentence: 'He is behind the box.', sentenceZh: '他在盒子后面。' },
      { en: 'tree', zh: '树', sentence: 'The fly is in the tree.', sentenceZh: '苍蝇在树上。' },
      { en: 'game', zh: '游戏', sentence: 'This is a fun game.', sentenceZh: '这是个好玩的游戏。' },
    ],
  },
  {
    title: 'Fly Guy Meets Fly Girl · 新朋友',
    words: [
      { en: 'meet', zh: '遇见', sentence: 'Fly Guy meets Fly Girl.', sentenceZh: '小蝇怪遇见小蝇女。' },
      { en: 'girl', zh: '女孩', sentence: 'Fly Girl is a girl fly.', sentenceZh: '小蝇女是一只女苍蝇。' },
      { en: 'new', zh: '新的', sentence: 'A new friend!', sentenceZh: '一个新朋友！' },
      { en: 'hug', zh: '拥抱', sentence: 'They give a hug.', sentenceZh: '她们拥抱了一下。' },
      { en: 'like', zh: '喜欢', sentence: 'I like you.', sentenceZh: '我喜欢你。' },
      { en: 'smile', zh: '微笑', sentence: 'She has a smile.', sentenceZh: '她面带微笑。' },
      { en: 'play', zh: '玩', sentence: "Let's play together.", sentenceZh: '我们一起玩吧。' },
      { en: 'sweet', zh: '可爱的', sentence: 'Fly Girl is sweet.', sentenceZh: '小蝇女真可爱。' },
    ],
  },
  {
    title: 'Buzz Boy and Fly Guy · 巴斯小子',
    words: [
      { en: 'buzz', zh: '巴斯', sentence: 'Buzz is Buzz Boy!', sentenceZh: '巴斯就是巴斯小子！' },
      { en: 'cape', zh: '披风', sentence: 'Buzz Boy has a red cape.', sentenceZh: '巴斯小子有一条红披风。' },
      { en: 'mask', zh: '面具', sentence: 'He wears a mask.', sentenceZh: '他戴着面具。' },
      { en: 'power', zh: '力量', sentence: 'Buzz Boy has power.', sentenceZh: '巴斯小子有力量。' },
      { en: 'run', zh: '跑', sentence: 'Buzz Boy can run fast.', sentenceZh: '巴斯小子跑得快。' },
      { en: 'jump', zh: '跳', sentence: 'Jump up high!', sentenceZh: '高高跳起！' },
      { en: 'team', zh: '团队', sentence: 'We are a team.', sentenceZh: '我们是一个团队。' },
      { en: 'star', zh: '星星', sentence: 'A star in the sky.', sentenceZh: '天空中的一颗星。' },
    ],
  },
  {
    title: 'Fly Guy vs. the Flyswatter! · 躲避苍蝇拍',
    words: [
      { en: 'swatter', zh: '苍蝇拍', sentence: 'The flyswatter is big!', sentenceZh: '苍蝇拍好大！' },
      { en: 'danger', zh: '危险', sentence: 'Look out for danger!', sentenceZh: '小心危险！' },
      { en: 'escape', zh: '逃跑', sentence: 'Fly Guy can escape!', sentenceZh: '小蝇怪能逃走！' },
      { en: 'big', zh: '大的', sentence: 'The swatter is big.', sentenceZh: '苍蝇拍很大。' },
      { en: 'small', zh: '小的', sentence: 'Fly Guy is small.', sentenceZh: '小蝇怪很小。' },
      { en: 'safe', zh: '安全的', sentence: 'Fly Guy is safe.', sentenceZh: '小蝇怪安全了。' },
      { en: 'quick', zh: '迅速的', sentence: 'Be quick!', sentenceZh: '快点！' },
      { en: 'scary', zh: '可怕的', sentence: 'That is scary!', sentenceZh: '那真吓人！' },
    ],
  },
  {
    title: 'Ride, Fly Guy, Ride! · 出发去兜风',
    words: [
      { en: 'ride', zh: '乘坐', sentence: 'Ride, Fly Guy, ride!', sentenceZh: '坐好，小蝇怪，出发！' },
      { en: 'car', zh: '汽车', sentence: 'A red car.', sentenceZh: '一辆红色汽车。' },
      { en: 'bus', zh: '公交车', sentence: 'The bus is yellow.', sentenceZh: '公交车是黄色的。' },
      { en: 'bike', zh: '自行车', sentence: 'I ride a bike.', sentenceZh: '我骑自行车。' },
      { en: 'train', zh: '火车', sentence: 'The train is long.', sentenceZh: '火车很长。' },
      { en: 'wheel', zh: '轮子', sentence: 'A wheel goes round.', sentenceZh: '轮子转啊转。' },
      { en: 'road', zh: '路', sentence: 'The road is long.', sentenceZh: '路很长。' },
      { en: 'stop', zh: '停', sentence: 'Stop the car!', sentenceZh: '停车！' },
    ],
  },
  {
    title: "There's a Fly Guy in My Soup · 汤里的苍蝇",
    words: [
      { en: 'soup', zh: '汤', sentence: 'There is a fly in my soup!', sentenceZh: '我的汤里有一只苍蝇！' },
      { en: 'bowl', zh: '碗', sentence: 'A bowl of soup.', sentenceZh: '一碗汤。' },
      { en: 'hot', zh: '热的', sentence: 'The soup is hot.', sentenceZh: '汤很烫。' },
      { en: 'spoon', zh: '勺子', sentence: 'Use a spoon.', sentenceZh: '用勺子。' },
      { en: 'yum', zh: '好吃', sentence: 'Yum, yum!', sentenceZh: '真好吃！' },
      { en: 'cook', zh: '做饭', sentence: 'Mom can cook.', sentenceZh: '妈妈会做饭。' },
      { en: 'table', zh: '桌子', sentence: 'The soup is on the table.', sentenceZh: '汤在桌子上。' },
      { en: 'surprise', zh: '惊讶', sentence: 'What a surprise!', sentenceZh: '真让人惊讶！' },
    ],
  },
  {
    title: 'Fly Guy and the Frankenfly · 弗兰蝇怪物',
    words: [
      { en: 'monster', zh: '怪物', sentence: 'The Frankenfly is a monster!', sentenceZh: '弗兰蝇是个怪物！' },
      { en: 'frankenfly', zh: '弗兰蝇', sentence: 'The Frankenfly is green.', sentenceZh: '弗兰蝇是绿色的。' },
      { en: 'green', zh: '绿色', sentence: 'Green is a color.', sentenceZh: '绿色是一种颜色。' },
      { en: 'bolt', zh: '闪电', sentence: 'A bolt of light.', sentenceZh: '一道光。' },
      { en: 'night', zh: '夜晚', sentence: 'It is night.', sentenceZh: '现在是夜晚。' },
      { en: 'eye', zh: '眼睛', sentence: 'The monster has one eye.', sentenceZh: '怪物有一只眼睛。' },
      { en: 'laugh', zh: '笑', sentence: 'We laugh at the monster.', sentenceZh: '我们对着怪物笑。' },
      { en: 'spooky', zh: '诡异的', sentence: 'A spooky night.', sentenceZh: '一个诡异的夜晚。' },
    ],
  },
  {
    title: 'A Pet for Fly Guy · 养只宠物',
    words: [
      { en: 'dog', zh: '狗', sentence: 'A dog is a pet.', sentenceZh: '狗是宠物。' },
      { en: 'cat', zh: '猫', sentence: 'The cat is soft.', sentenceZh: '猫软软的。' },
      { en: 'fish', zh: '鱼', sentence: 'A fish can swim.', sentenceZh: '鱼会游泳。' },
      { en: 'hamster', zh: '仓鼠', sentence: 'A small hamster.', sentenceZh: '一只小仓鼠。' },
      { en: 'tail', zh: '尾巴', sentence: 'The dog has a tail.', sentenceZh: '狗有尾巴。' },
      { en: 'cute', zh: '可爱的', sentence: 'The pet is cute.', sentenceZh: '宠物真可爱。' },
      { en: 'feed', zh: '喂', sentence: 'Feed the pet.', sentenceZh: '喂宠物。' },
      { en: 'love', zh: '爱', sentence: 'I love my pet.', sentenceZh: '我爱我的宠物。' },
    ],
  },
  {
    title: 'Prince Fly Guy · 苍蝇王子',
    words: [
      { en: 'prince', zh: '王子', sentence: 'Fly Guy is a prince!', sentenceZh: '小蝇怪是王子！' },
      { en: 'crown', zh: '王冠', sentence: 'A gold crown.', sentenceZh: '一顶金王冠。' },
      { en: 'king', zh: '国王', sentence: 'The king is happy.', sentenceZh: '国王很高兴。' },
      { en: 'castle', zh: '城堡', sentence: 'A big castle.', sentenceZh: '一座大城堡。' },
      { en: 'royal', zh: '皇家的', sentence: 'A royal fly.', sentenceZh: '一只皇家苍蝇。' },
      { en: 'throne', zh: '王座', sentence: 'Sit on the throne.', sentenceZh: '坐在王座上。' },
      { en: 'queen', zh: '女王', sentence: 'The queen smiles.', sentenceZh: '女王笑了。' },
      { en: 'rule', zh: '统治', sentence: 'The prince will rule.', sentenceZh: '王子将统治。' },
    ],
  },
  {
    title: 'There Was an Old Lady Who Swallowed Fly Guy · 吞下小蝇怪的老太太',
    words: [
      { en: 'lady', zh: '女士', sentence: 'The old lady is funny.', sentenceZh: '这位老太太真有趣。' },
      { en: 'swallow', zh: '吞', sentence: 'She can swallow a fly!', sentenceZh: '她能吞下一只苍蝇！' },
      { en: 'spider', zh: '蜘蛛', sentence: 'A spider is small.', sentenceZh: '蜘蛛很小。' },
      { en: 'bird', zh: '鸟', sentence: 'The bird can sing.', sentenceZh: '鸟会唱歌。' },
      { en: 'cat', zh: '猫', sentence: 'The cat is soft.', sentenceZh: '猫软软的。' },
      { en: 'cow', zh: '牛', sentence: 'A cow says moo.', sentenceZh: '牛哞哞叫。' },
      { en: 'horse', zh: '马', sentence: 'The horse is big.', sentenceZh: '马很大。' },
      { en: 'silly', zh: '傻乎乎的', sentence: 'What a silly lady!', sentenceZh: '多傻的老太太！' },
    ],
  },
  {
    title: "Fly Guy's Amazing Tricks · 神奇小戏法",
    words: [
      { en: 'trick', zh: '戏法', sentence: 'Fly Guy does a trick!', sentenceZh: '小蝇怪变戏法！' },
      { en: 'magic', zh: '魔法', sentence: 'It is magic!', sentenceZh: '这是魔法！' },
      { en: 'hat', zh: '帽子', sentence: 'A hat for the trick.', sentenceZh: '变戏法用的帽子。' },
      { en: 'disappear', zh: '消失', sentence: 'Fly Guy disappears!', sentenceZh: '小蝇怪消失了！' },
      { en: 'bounce', zh: '弹跳', sentence: 'The ball can bounce.', sentenceZh: '球能弹起来。' },
      { en: 'spin', zh: '旋转', sentence: 'Fly Guy can spin.', sentenceZh: '小蝇怪能转圈。' },
      { en: 'wow', zh: '哇', sentence: 'Wow! A trick!', sentenceZh: '哇！一个戏法！' },
      { en: 'amazing', zh: '令人惊叹的', sentence: 'That is amazing!', sentenceZh: '太令人惊叹了！' },
    ],
  },
  {
    title: "Fly Guy's Ninja Christmas · 忍者圣诞节",
    words: [
      { en: 'ninja', zh: '忍者', sentence: 'Fly Guy is a ninja!', sentenceZh: '小蝇怪是个忍者！' },
      { en: 'christmas', zh: '圣诞节', sentence: 'It is Christmas!', sentenceZh: '今天是圣诞节！' },
      { en: 'present', zh: '礼物', sentence: 'A present for you.', sentenceZh: '给你的礼物。' },
      { en: 'sneak', zh: '潜行', sentence: 'Ninja can sneak.', sentenceZh: '忍者能悄悄潜行。' },
      { en: 'quiet', zh: '安静的', sentence: 'Be quiet, ninja.', sentenceZh: '忍者要安静。' },
      { en: 'tree', zh: '圣诞树', sentence: 'A tree with lights.', sentenceZh: '一棵挂彩灯的树。' },
      { en: 'bell', zh: '铃铛', sentence: 'A bell goes ding.', sentenceZh: '铃铛叮当响。' },
      { en: 'bow', zh: '鞠躬', sentence: 'Bow to your friend.', sentenceZh: '向朋友鞠个躬。' },
    ],
  },
  {
    title: "Fly Guy's Big Family · 大家庭",
    words: [
      { en: 'family', zh: '家庭', sentence: 'We are a big family.', sentenceZh: '我们是个大家庭。' },
      { en: 'mom', zh: '妈妈', sentence: 'Mom is nice.', sentenceZh: '妈妈真好。' },
      { en: 'dad', zh: '爸爸', sentence: 'Dad is strong.', sentenceZh: '爸爸很强壮。' },
      { en: 'brother', zh: '兄弟', sentence: 'My brother is funny.', sentenceZh: '我的兄弟真有趣。' },
      { en: 'sister', zh: '姐妹', sentence: 'My sister is small.', sentenceZh: '我的姐妹很小。' },
      { en: 'grandma', zh: '奶奶', sentence: 'Grandma hugs me.', sentenceZh: '奶奶拥抱我。' },
      { en: 'grandpa', zh: '爷爷', sentence: 'Grandpa is old.', sentenceZh: '爷爷年纪大了。' },
      { en: 'baby', zh: '宝宝', sentence: 'The baby is cute.', sentenceZh: '宝宝真可爱。' },
    ],
  },
  {
    title: 'Fly Guy and the Alienzz · 外星人小蝇怪',
    words: [
      { en: 'alien', zh: '外星人', sentence: 'The alien is green.', sentenceZh: '外星人是绿色的。' },
      { en: 'spaceship', zh: '宇宙飞船', sentence: 'A big spaceship!', sentenceZh: '一艘大宇宙飞船！' },
      { en: 'planet', zh: '行星', sentence: 'We land on a planet.', sentenceZh: '我们降落在一颗行星上。' },
      { en: 'galaxy', zh: '星系', sentence: 'Stars in the galaxy.', sentenceZh: '星系里的星星。' },
      { en: 'zoom', zh: '飞驰', sentence: 'Zoom to the sky!', sentenceZh: '嗖地飞向天空！' },
      { en: 'strange', zh: '奇怪的', sentence: 'That is strange!', sentenceZh: '那真奇怪！' },
      { en: 'space', zh: '太空', sentence: 'Space is so big.', sentenceZh: '太空真大。' },
      { en: 'hello', zh: '你好', sentence: 'Hello, alien!', sentenceZh: '你好，外星人！' },
    ],
  },
  {
    title: 'Attack of the 50-Foot Fly Guy! · 巨型小蝇怪来袭',
    words: [
      { en: 'giant', zh: '巨大的', sentence: 'Fly Guy is a giant!', sentenceZh: '小蝇怪变成巨人！' },
      { en: 'big', zh: '大的', sentence: 'He is very big.', sentenceZh: '他非常大。' },
      { en: 'small', zh: '小的', sentence: 'The city is small.', sentenceZh: '城市显得很小。' },
      { en: 'tall', zh: '高的', sentence: 'Tall like a tower.', sentenceZh: '像塔一样高。' },
      { en: 'city', zh: '城市', sentence: 'Look at the city!', sentenceZh: '看这座城市！' },
      { en: 'building', zh: '大楼', sentence: 'A tall building.', sentenceZh: '一栋高大的楼。' },
      { en: 'scared', zh: '害怕的', sentence: 'People are scared.', sentenceZh: '人们很害怕。' },
      { en: 'tiny', zh: '微小的', sentence: 'Tiny cars below.', sentenceZh: '下面微小的汽车。' },
    ],
  },
  {
    title: 'Fly Guy Presents: Sharks · 鲨鱼科普',
    words: [
      { en: 'shark', zh: '鲨鱼', sentence: 'The shark is big.', sentenceZh: '鲨鱼很大。' },
      { en: 'ocean', zh: '海洋', sentence: 'Sharks live in the ocean.', sentenceZh: '鲨鱼生活在海洋里。' },
      { en: 'tooth', zh: '牙齿', sentence: 'A shark has sharp teeth.', sentenceZh: '鲨鱼有尖牙。' },
      { en: 'fin', zh: '鳍', sentence: 'A fin on the back.', sentenceZh: '背上的鳍。' },
      { en: 'swim', zh: '游泳', sentence: 'Sharks can swim fast.', sentenceZh: '鲨鱼游得很快。' },
      { en: 'fish', zh: '鱼', sentence: 'A small fish.', sentenceZh: '一条小鱼。' },
      { en: 'water', zh: '水', sentence: 'Blue water.', sentenceZh: '蓝色的水。' },
      { en: 'big', zh: '大的', sentence: 'A big blue shark.', sentenceZh: '一条蓝色的大鲨鱼。' },
    ],
  },
  {
    title: 'Fly Guy Presents: Dinosaurs · 恐龙科普',
    words: [
      { en: 'dinosaur', zh: '恐龙', sentence: 'The dinosaur is big.', sentenceZh: '恐龙很大。' },
      { en: 'bone', zh: '骨头', sentence: 'A big bone.', sentenceZh: '一根大骨头。' },
      { en: 'fossil', zh: '化石', sentence: 'A fossil in rock.', sentenceZh: '石头里的化石。' },
      { en: 'long', zh: '长的', sentence: 'A long neck.', sentenceZh: '长长的脖子。' },
      { en: 'neck', zh: '脖子', sentence: 'The dino has a long neck.', sentenceZh: '恐龙有长脖子。' },
      { en: 'egg', zh: '蛋', sentence: 'A dinosaur egg.', sentenceZh: '一颗恐龙蛋。' },
      { en: 'roar', zh: '吼叫', sentence: 'The dino can roar!', sentenceZh: '恐龙会吼叫！' },
      { en: 'old', zh: '古老的', sentence: 'Dinosaurs are old.', sentenceZh: '恐龙很古老。' },
    ],
  },
]

export const flyGuyStories: FGStory[] = rawStories.map((s, i) => {
  const storyEmoji = pickStoryEmoji(s.title, i)
  return {
    id: i + 1,
    slug: `fg-${i + 1}`,
    title: s.title,
    emoji: storyEmoji,
    words: s.words.map((w) => ({
      en: w.en,
      zh: w.zh,
      sentence: w.sentence,
      sentenceZh: w.sentenceZh,
      emoji: pickWordEmoji(w.en, w.zh, storyEmoji),
    })),
  }
})

// 真实《Fly Guy》书目清单(来自网络资料,共约 22 本),作为课程参考书单
export const flyGuyBooks: FGBook[] = [
  { title: 'Hi! Fly Guy' },
  { title: 'Super Fly Guy' },
  { title: 'Shoo, Fly Guy!' },
  { title: 'There Was an Old Lady Who Swallowed Fly Guy' },
  { title: 'Fly High, Fly Guy!' },
  { title: 'Hooray for Fly Guy!' },
  { title: 'I Spy Fly Guy!' },
  { title: 'Fly Guy Meets Fly Girl' },
  { title: 'Buzz Boy and Fly Guy' },
  { title: 'Fly Guy vs. the Flyswatter!' },
  { title: 'Ride, Fly Guy, Ride!' },
  { title: "There's a Fly Guy in My Soup" },
  { title: 'Fly Guy and the Frankenfly' },
  { title: "Fly Guy's Amazing Tricks" },
  { title: 'A Pet for Fly Guy' },
  { title: 'Prince Fly Guy' },
  { title: "Fly Guy's Ninja Christmas" },
  { title: "Fly Guy's Big Family" },
  { title: 'Fly Guy and the Alienzz' },
  { title: 'Attack of the 50-Foot Fly Guy!' },
  { title: 'Fly Guy Presents: Sharks' },
  { title: 'Fly Guy Presents: Dinosaurs' },
]

export const flyGuyStoryCount = flyGuyStories.length
export const flyGuyWordCount = flyGuyStories.reduce((a, s) => a + s.words.length, 0)

export function getStory(slug: string): FGStory | undefined {
  return flyGuyStories.find((s) => s.slug === slug)
}
