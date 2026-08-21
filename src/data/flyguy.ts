// Fly Guy 主题课程数据层
// 内容来源:基于 Tedd Arnold 的《Fly Guy》系列童书(早期分级读物,适读年龄 4-7 岁,
// 共约 22 本,2005–2020)。课程按真实书目主题拆分 22 个故事关卡,
// 每关 8 个适龄高频词汇(英文 + 中文释义 + 例句),书单为真实书目清单。
//
// 例句 / 绘本原文模块:
//   1) sentence / sentenceZh  —— 适合小朋友的「学法句型」(短、清楚、直接用到该词)。
//   2) bookSentence / bookSentenceZh —— 每词对应的「绘本原句」短句摘录。
//   3) bookText —— 用户提供的实体书【整段原文】(按章节 / 页码组织,见 .txt 文件)。
//      存在时「例句」tab 改为「📖 绘本原文」视图,按章节顺序整段展示真实书文、
//      不再按单词列句;无 bookText 的故事则回退显示学法句型。
//   以上原文均仅作合理使用展示,不内置整本受版权保护的书。

import type { BookTextChapter, Story, StoryWord } from './story-types'
import { makeEmojiPicker, type EmojiRule } from '@/utils/storyEmoji'

// FGWord/FGStory 与共享的 StoryWord/Story 结构完全一致;保留类型别名以兼容既有引用
export type FGWord = StoryWord

export type FGStory = Story

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
const STORY_EMOJI_RULES: EmojiRule[] = [
  { test: /hi! fly guy/i, emoji: '🐝' },                 // #1 Hi! Fly Guy
  { test: /super fly/i, emoji: '💥' },                   // #2 Super Fly Guy
  { test: /shoo/i, emoji: '🍔' },                       // #3 Shoo, Fly Guy!
  { test: /fly high/i, emoji: '🌤️' },                   // #4 Fly High, Fly Guy!
  { test: /hooray/i, emoji: '🎉' },                     // #5 Hooray for Fly Guy!
  { test: /i spy/i, emoji: '🫣' },                      // #6 I Spy Fly Guy!
  { test: /fly girl|meets/i, emoji: '🤝' },             // #7 Fly Guy Meets Fly Girl
  { test: /buzz boy/i, emoji: '🦸' },                   // #8 Buzz Boy and Fly Guy
  { test: /flyswatter|swatter/i, emoji: '🪤' },         // #9 Fly Guy vs. the Flyswatter!
  { test: /ride/i, emoji: '🚗' },                       // #10 Ride, Fly Guy, Ride!
  { test: /in my soup|soup/i, emoji: '🍲' },            // #11 There's a Fly Guy in My Soup
  { test: /franken/i, emoji: '👹' },                    // #12 Fly Guy and the Frankenfly
  { test: /pet for fly guy|pet for/i, emoji: '🐾' },    // #13 A Pet for Fly Guy
  { test: /prince fly guy|prince/i, emoji: '👑' },      // #14 Prince Fly Guy
  { test: /old lady|swallowed/i, emoji: '👵' },         // #15 There Was an Old Lady Who Swallowed Fly Guy
  { test: /amazing tricks|tricks/i, emoji: '🎩' },      // #16 Fly Guy's Amazing Tricks
  { test: /ninja|christmas/i, emoji: '🥷' },            // #17 Fly Guy's Ninja Christmas
  { test: /big family|family/i, emoji: '👪' },          // #18 Fly Guy's Big Family
  { test: /alien/i, emoji: '👽' },                      // #19 Fly Guy and the Alienzz
  { test: /50-foot|attack/i, emoji: '🗼' },             // #20 Attack of the 50-Foot Fly Guy!
  { test: /sharks/i, emoji: '🦈' },                     // #21 Fly Guy Presents: Sharks
  { test: /dinosaurs|dino/i, emoji: '🦕' },             // #22 Fly Guy Presents: Dinosaurs
]
const STORY_EMOJI_FALLBACK = ['🐝', '🟢', '✨', '🌟', '🍀', '💚', '🪁', '🐝']

const matchStoryEmoji = makeEmojiPicker(STORY_EMOJI_RULES, STORY_EMOJI_FALLBACK)

function pickStoryEmoji(title: string, idx: number): string {
  return matchStoryEmoji(title, idx)
}

// ---- 单词 emoji:按英文/中文关键词匹配,否则用故事主题 emoji 兜底 ----
const WORD_EMOJI_RULES: EmojiRule[] = [
  { test: /food|eat|lunch|dinner|breakfast|pizza|burger|cake|apple|banana|egg|rice|bread|soup|meat|milk|water|juice|snack|cookie|cheese|fruit|vegetable|drink|meal|bowl|spoon|cook|yum|food|吃|食物|蛋糕|汤|碗|勺子|做饭|好吃/i, emoji: '🍔' },
  { test: /cat|dog|pet|animal|lion|tiger|bear|rabbit|bird|duck|pig|cow|sheep|horse|monkey|elephant|mouse|frog|bee|bug|fish|whale|shark|hamster|tail|狗|猫|动物|熊|兔|鸟|鱼|虫|仓鼠|尾巴|宠物/i, emoji: '🐾' },
  { test: /red|blue|yellow|green|orange|purple|color|colour|pink|black|white|brown|颜色|绿色|红色|蓝色|黄色/i, emoji: '🌈' },
  { test: /happy|sad|angry|scared|afraid|tired|excited|love|friend|smile|sweet|cute|like|sweet|高兴|害怕|生气|朋友|喜欢|可爱|爱|微笑/i, emoji: '😊' },
  { test: /run|jump|fly|walk|swim|climb|dance|play|ride|drive|hide|seek|find|look|escape|feed|catch|stop|go|up|down|跑|跳|飞|走|玩|骑|躲|找|逃|喂|抓|停|上|下/i, emoji: '🏃' },
  { test: /book|read|story|school|class|teacher|student|learn|write|pen|pencil|spy|书|读|学|写|老师|学校|寻找|看/i, emoji: '📚' },
  { test: /sun|moon|star|sky|space|rocket|planet|night|day|cloud|wind|wind|太阳|月亮|星星|天空|夜|云|风|白天/i, emoji: '🌟' },
  { test: /house|home|door|window|room|bed|tree|garden|park|city|street|table|castle|throne|房子|家|门|窗|树|公园|城市|街道|桌子|城堡|王座/i, emoji: '🏠' },
  { test: /king|queen|prince|princess|castle|magic|wizard|witch|dragon|robot|alien|monster|ghost|franken|royal|rule|魔法|龙|机器|外星|怪物|皇家|统治/i, emoji: '🪄' },
  { test: /big|small|little|tall|short|long|fast|slow|high|hot|cold|new|old|strong|brave|safe|quick|scary|spooky|big|大|小|高|矮|长|快|慢|新|旧|热|冷|强大|勇敢|安全|可怕/i, emoji: '📏' },
  { test: /car|bus|train|boat|ship|plane|bike|truck|wheel|road|cape|mask|car|巴士|火车|船|飞机|自行车|轮子|路|披风|面具/i, emoji: '🚗' },
  { test: /sing|cheer|gift|party|hooray|dance|fun|surprise|sing|唱|欢呼|礼物|派对|好玩|惊讶/i, emoji: '🎉' },
  { test: /nose|eye|face|hand|body|鼻子|眼睛|脸|手|身体/i, emoji: '👃' },
]

const matchWordEmoji = makeEmojiPicker(WORD_EMOJI_RULES, '')

function pickWordEmoji(en: string, zh: string, fallback: string): string {
  return matchWordEmoji(`${en} ${zh}`) || fallback
}

interface RawStory {
  title: string
  words: {
    en: string
    zh: string
    sentence?: string
    sentenceZh?: string
    bookSentence?: string
    bookSentenceZh?: string
  }[]
  // 绘本原文(整段、按章节顺序);来自用户提供的 .txt
  bookText?: BookTextChapter[]
}

const rawStories: RawStory[] = [
  {
    title: 'Hi! Fly Guy · 你好，小蝇怪',
    words: [
      { en: 'fly', zh: '苍蝇', sentence: 'The fly can say my name.', sentenceZh: '这只苍蝇会叫我的名字。', bookSentence: 'A fly was flying.', bookSentenceZh: '一只苍蝇在飞。' },
      { en: 'boy', zh: '男孩', sentence: 'The boy is Buzz.', sentenceZh: '这个男孩叫巴斯。', bookSentence: 'A boy went walking.', bookSentenceZh: '一个男孩在走路。' },
      { en: 'friend', zh: '朋友', sentence: 'Fly Guy is my friend.', sentenceZh: '小蝇怪是我的朋友。', bookSentence: 'And so began a beautiful friendship.', bookSentenceZh: '一段美好的友谊就这样开始了。' },
      { en: 'name', zh: '名字', sentence: 'What is your name?', sentenceZh: '你叫什么名字？', bookSentence: 'You know my name!', bookSentenceZh: '你知道我的名字！' },
      { en: 'pet', zh: '宠物', sentence: 'He is a pet fly.', sentenceZh: '他是一只宠物苍蝇。', bookSentence: 'This is my pet.', bookSentenceZh: '这是我的宠物。' },
      { en: 'hi', zh: '你好', sentence: 'Hi! Fly Guy!', sentenceZh: '你好！小蝇怪！', bookSentence: 'Hi! Fly Guy!', bookSentenceZh: '你好！小蝇怪！' },
      { en: 'catch', zh: '抓住', sentence: 'Buzz can catch a fly.', sentenceZh: '巴斯能抓住一只苍蝇。', bookSentence: 'The boy caught the fly in a jar.', bookSentenceZh: '男孩把苍蝇抓进了罐子里。' },
      { en: 'happy', zh: '高兴的', sentence: 'Buzz is happy.', sentenceZh: '巴斯很高兴。', bookSentence: 'Fly Guy was happy.', bookSentenceZh: '小蝇怪很高兴。' },
    ],
    // 绘本原文:来自用户提供的 01.Hi!.Fly.Guy-vx-mmdacha.txt(实体书真实正文,按章节 / 页码)
    bookText: [
      {
        chapter: 'Chapter 1',
        pages: [
          { page: 5, text: `A fly went flying.`, textZh: `一只苍蝇飞走了。` },
          { page: 6, text: `He was looking for something to eat— something tasty, something slimy.`, textZh: `他在找东西吃——好吃的、黏糊糊的东西。` },
          { page: 7, text: `A boy went walking.`, textZh: `一个男孩走来了。` },
          { page: 8, text: `He was looking for something to catch— something smart, something for The Amazing Pet Show.`, textZh: `他在找东西抓——聪明的、能参加「神奇宠物秀」的。` },
          { page: 10, text: `They met. BOINK-`, textZh: `他们相遇了。哐——` },
          { page: 11, text: `The boy caught the fly in a jar. "A pet!" he said.`, textZh: `男孩把苍蝇抓进了罐子里。「宠物！」他说。` },
          { page: 12, text: `The fly was mad. He wanted to be free. He stomped his foot and said— BUZZ!`, textZh: `苍蝇很生气。他想获得自由。他跺着脚喊——嗡！` },
          { page: 13, text: `The boy was surprised. He said, "You know my name! You are the smartest pet in the world!"`, textZh: `男孩很惊讶。他说：「你知道我的名字！你是世界上最聪明的宠物！」` },
        ],
      },
      {
        chapter: 'Chapter 2',
        pages: [
          { page: 14, text: `Buzz took the fly home. "This is my pet," Buzz said to Mom and Dad.`, textZh: `巴斯把苍蝇带回家。「这是我的宠物，」巴斯对爸爸妈妈说。` },
          { page: 15, text: `"He is smart. He can say my name. Listen!" Buzz opened the jar. The fly flew out.`, textZh: `「他很聪明。他会说我的名字。听！」巴斯打开罐子。苍蝇飞了出来。` },
          { page: 16, text: `"Flies can't be pets!" said Dad. "They are pests!" He got the fly swatter. The fly cried— BUZZ!`, textZh: `「苍蝇不能当宠物！」爸爸说。「它们是害虫！」他拿起苍蝇拍。苍蝇哭着——嗡！` },
          { page: 17, text: `And Buzz came to the rescue. "You are right," said Dad. "This fly is smart!"`, textZh: `巴斯赶来救场。「你说得对，」爸爸说。「这只苍蝇真聪明！」` },
          { page: 18, text: `"He needs a name," said Mom. Buzz thought for a minute. "Fly Guy," said Buzz. And Fly Guy said— BUZZ!`, textZh: `「他需要取个名字，」妈妈说。巴斯想了一会儿。「小蝇怪，」巴斯说。小蝇怪也叫了——嗡！` },
          { page: 19, text: `It was time for lunch. Buzz gave Fly Guy something to eat.`, textZh: `到吃午饭的时间了。巴斯给了小蝇怪一点吃的。` },
          { page: 20, text: `Fly Guy was happy. Burp -`, textZh: `小蝇怪很高兴。打嗝——` },
        ],
      },
      {
        chapter: 'Chapter 3',
        pages: [
          { page: 21, text: `THE AMAZING PET SHOW Buzz took Fly Guy to The Amazing Pet Show.`, textZh: `神奇宠物秀 巴斯带小蝇怪去参加神奇宠物秀。` },
          { page: 22, text: `The judges laughed. "Flies can't be pets," they said. "Flies are pests!"`, textZh: `评委们笑了。「苍蝇不能当宠物，」他们说。「苍蝇是害虫！」` },
          { page: 24, text: `Buzz was sad. He opened the jar. "Shoo, Fly Guy," he said. "Flies can't be pets."`, textZh: `巴斯很伤心。他打开罐子。「走开吧，小蝇怪，」他说。「苍蝇不能当宠物。」` },
          { page: 25, text: `But Fly Guy liked Buzz. He had an idea. He did some fancy flying.`, textZh: `可是小蝇怪喜欢巴斯。他有了个主意。他耍了几个花式飞行动作。` },
          { page: 26, text: `The judges were amazed. "The fly can do tricks," they said. "But flies can't be pets."`, textZh: `评委们惊呆了。「这只苍蝇会耍把戏，」他们说。「但苍蝇不能当宠物。」` },
          { page: 27, text: `Then Fly Guy said— BUZZ!`, textZh: `这时小蝇怪叫了——嗡！` },
          { page: 28, text: `The judges were more amazed. "The fly knows the boy's name," they said. "But flies can't be pets."`, textZh: `评委们更惊讶了。「这只苍蝇知道男孩的名字，」他们说。「但苍蝇不能当宠物。」` },
          { page: 29, text: `Fly Guy flew high, high, high into the sky!`, textZh: `小蝇怪飞得高、高、高，直冲云霄！` },
          { page: 30, text: `Then he dived down, down, down into the jar.`, textZh: `然后他俯冲，俯冲，俯冲进罐子里。` },
          { page: 31, text: `"The fly knows his jar!" the judges said. "This fly is a pet!" So they let Fly Guy in the show.`, textZh: `「这只苍蝇认得自己的罐子！」评委们说。「这只苍蝇是宠物！」于是他们让小蝇怪参加了秀。` },
          { page: 32, text: `TALLEST PET / PET WITH MOST LEGS / CUTEST PET`, textZh: `最高宠物 / 腿最多宠物 / 最可爱宠物` },
          { page: 33, text: `SMARTEST PET / HEAVIEST PET He even won an award.`, textZh: `最聪明宠物 / 最重宠物 他甚至还拿了个奖。` },
          { page: 34, text: `SAME PET And so began a beautiful friendship.`, textZh: `同样的宠物 一段美好的友谊就这样开始了。` },
        ],
      },
    ],
  },
  {
    title: 'Super Fly Guy · 超级小蝇怪',
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly." , textZh: "有个小男孩养了一只宠物苍蝇。" },
          { text: "The fly was named Fly Guy." , textZh: "这只苍蝇名叫小蝇怪。" },
          { text: "Fly Guy could say the boy's name—BUZZ!" , textZh: "小蝇怪会叫出小男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "One day Fly Guy went to school with Buzz." , textZh: "有一天，小蝇怪跟着巴斯一起上学去了。" },
          { text: "Fly Guy learned about reading and phonics." , textZh: "小蝇怪学会了读书和自然拼读。" },
          { text: "He learned about art." , textZh: "他还学了美术。" },
          { text: "Then it was lunchtime." , textZh: "接着就到了吃午饭的时间。" },
          { text: "Fly Guy loved the lunchroom." , textZh: "小蝇怪可喜欢学校的午餐食堂了。" },
          { text: "He loved the dirty dishes." , textZh: "他喜欢那些脏兮兮的盘子，" },
          { text: "He loved the smelly mop." , textZh: "喜欢臭烘烘的拖把，" },
          { text: "He loved the garbage cans." , textZh: "还喜欢那些垃圾桶。" },
          { text: "Fly Guy met the lunch lady." , textZh: "小蝇怪认识了食堂的阿姨。" },
          { text: "Her name was Roz." , textZh: "她叫罗兹。" },
          { text: "\"No flies in the lunchroom!\" Roz said." , textZh: "「食堂里可不能有别苍蝇！」罗兹说。" },
          { text: "Fly Guy said—ROZZZ!" , textZh: "小蝇怪叫了一声——「罗——兹！」" },
          { text: "\"This fly is smart,\" said Roz. \"He knows my name!\"" , textZh: "「这只苍蝇真聪明，」罗兹说，「他知道我的名字！」" },
          { text: "She fed Fly Guy chicken bones and fish heads in sour milk." , textZh: "她喂小蝇怪吃酸奶里的鸡骨头和鱼头。" },
          { text: "Fly Guy was happy." , textZh: "小蝇怪可开心了。" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "Roz's boss was not happy." , textZh: "罗兹的老板可就不高兴了。" },
          { text: "\"The children cannot eat in a room full of flies!\" he said. \"You are fired!\"" , textZh: "「孩子们可不能在满是苍蝇的屋子里吃饭！」他说，「你被解雇了！」" },
          { text: "Roz was sad. Fly Guy was sad." , textZh: "罗兹很难过。小蝇怪也很难过。" },
          { text: "Buzz and the children were sad because Roz was a good cook." , textZh: "巴斯和孩子们也都难过，因为罗兹做饭可好吃了。" },
          { text: "The next day, Roz was gone." , textZh: "第二天，罗兹就不见了。" },
          { text: "Miss Muzzle was the new lunch lady." , textZh: "新来的食堂阿姨是马泽小姐。" },
          { text: "She made burnt peas and turnips." , textZh: "她做的全是烧焦的豌豆和萝卜。" },
          { text: "No one in school ate lunch—not even Fly Guy, who ate almost anything." , textZh: "学校里没人吃午饭——连几乎什么都吃的小蝇怪也没动一口。" },
          { text: "Everyone missed Roz." , textZh: "大家都想念罗兹。" },
          { text: "Even the boss missed Roz." , textZh: "连老板都想念罗兹了。" },
          { text: "That night, Buzz made a plan." , textZh: "那天晚上，巴斯想出了一个计划。" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "The next day, Fly Guy went to school again." , textZh: "第二天，小蝇怪又来到了学校。" },
          { text: "In the lunchroom Fly Guy said—MIZZ MUZZZ!" , textZh: "在食堂里，小蝇怪喊了一声——「马——泽！」" },
          { text: "Miss Muzzle looked up." , textZh: "马泽小姐抬起头来。" },
          { text: "Fly Guy boinked her on the nose. BOINK" , textZh: "小蝇怪「哐」地一下撞到她的鼻子上。" },
          { text: "Miss Muzzle cried, \"No flies in my lunchroom!\"" , textZh: "马泽小姐叫道：「我的食堂里不许有苍蝇！」" },
          { text: "She grabbed her swatter and swung. She missed." , textZh: "她抓起苍蝇拍打出去。没打着。" },
          { text: "She missed again. She missed again." , textZh: "接着又没打着。还是没打着。" },
          { text: "She missed again. She missed again." , textZh: "接着又没打着。还是没打着。" },
          { text: "The boss was not happy." , textZh: "老板可不高兴了。" },
          { text: "\"The children cannot eat in this mess,\" he said. \"You are fired!\"" , textZh: "「孩子们可不能在这乱糟糟的地方吃饭，」他说，「你被解雇了！」" },
          { text: "The next day, Roz was back." , textZh: "第二天，罗兹回来了。" },
          { text: "\"You are a super Fly Guy!\"" , textZh: "「你真是个超级小蝇怪！」" },
          { text: "Roz made a special garbage soup for Super Fly Guy." , textZh: "罗兹给超级小蝇怪做了一锅特别的垃圾汤。" },
          { text: "Fly Guy was happy." , textZh: "小蝇怪可开心了。" },
          { text: "Everyone was happy." , textZh: "大家都开开心心的。" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Chapter 1",
        pages: [
          { text: "A boy had a pet fly." , textZh: "有个小男孩养了一只宠物苍蝇。" },
          { text: "The boy called his pet Fly Guy." , textZh: "小男孩给他的宠物起名叫小蝇怪。" },
          { text: "Fly Guy could say the boy's name—BUZZ!" , textZh: "小蝇怪会叫出小男孩的名字——「嗡！」" },
          { text: "Buzz played with Fly Guy." , textZh: "巴斯陪小蝇怪一起玩。" },
          { text: "Buzz made him a glass house." , textZh: "巴斯给它做了一个玻璃小屋。" },
          { text: "Best of all, Buzz fed him." , textZh: "最棒的是，巴斯会喂它吃东西。" },
          { text: "Fly Guy's favorite food was brown, oozy, lumpy, and smelly." , textZh: "小蝇怪最爱的食物是棕色的、黏糊糊、疙疙瘩瘩、还臭烘烘的。" },
          { text: "One day Fly Guy went flying by himself." , textZh: "有一天，小蝇怪自己飞出去玩了。" },
          { text: "When he came home, Buzz was gone." , textZh: "等它回到家，巴斯却不见了。" },
          { text: "He found a note: 'Dear Fly Guy, Where are you? We are going on a picnic. We will be back soon. Love, Buzz'" , textZh: "它发现一张纸条：「亲爱的小蝇怪，你在哪儿？我们要去野餐啦。很快就会回来。爱你的，巴斯」" },
          { text: "Fly Guy was hungry. So off he flew." , textZh: "小蝇怪肚子饿了。于是它扑棱着翅膀飞走了。" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "Fly Guy flew until he saw something to eat." , textZh: "小蝇怪一直飞，直到看见有东西可以吃。" },
          { text: "It wasn't oozy, lumpy, or smelly. But it was brown. Close enough!" , textZh: "那东西不黏糊、不疙疙瘩瘩、也不臭。但它是棕色的。差不多啦！" },
          { text: "A boy shouted, 'That is my hamburger!'" , textZh: "一个男孩大喊：「那是我的汉堡！」" },
          { text: "'Shoo, fly!'" , textZh: "「嘘，苍蝇！快走开！」" },
          { text: "Fly Guy flew on until he saw something else." , textZh: "小蝇怪继续飞，直到看见别的东西。" },
          { text: "It wasn't brown, lumpy, or smelly. But it was oozy. Close enough!" , textZh: "那东西不是棕色的、不疙疙瘩瘩、也不臭。但它是黏糊糊的。差不多啦！" },
          { text: "A girl yelled, 'That is my pizza!'" , textZh: "一个女孩嚷道：「那是我的披萨！」" },
          { text: "'Shoo, fly!'" , textZh: "「嘘，苍蝇！快走开！」" },
          { text: "Fly Guy flew on until he saw something else." , textZh: "小蝇怪继续飞，直到看见别的东西。" },
          { text: "It wasn't brown, oozy, or smelly. But it was lumpy. Close enough!" , textZh: "那东西不是棕色的、不黏糊、也不臭。但它是疙疙瘩瘩的。差不多啦！" },
          { text: "A dog growled, 'Those are my bones.'" , textZh: "一只狗低吼着说：「那些是我的骨头。」" },
          { text: "'Shoo, fly!'" , textZh: "「嘘，苍蝇！快走开！」" },
          { text: "Fly Guy flew on until he saw something else." , textZh: "小蝇怪继续飞，直到看见别的东西。" },
          { text: "It wasn't brown, oozy, or lumpy. But it was smelly. Close enough!" , textZh: "那东西不是棕色的、不黏糊、也不疙疙瘩瘩。但它是臭烘烘的。差不多啦！" },
          { text: "A bird squawked, 'That is my roadkill.'" , textZh: "一只鸟尖叫着说：「那是我的路边死动物。」" },
          { text: "'Shoo, fly!'" , textZh: "「嘘，苍蝇！快走开！」" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "Fly Guy was very hungry. And he was very tired." , textZh: "小蝇怪饿坏了。它也累坏了。" },
          { text: "He looked around. Fly Guy was very lost." , textZh: "它四下张望。小蝇怪彻底迷路了。" },
          { text: "He flew on and on and on and on and on until..." , textZh: "它飞呀飞呀飞呀飞呀，一直飞到……" },
          { text: "Fly Guy saw something. Could it be? Yes!" , textZh: "小蝇怪看到了一个东西。会是吗？没错！" },
          { text: "It was brown, oozy, lumpy, and smelly." , textZh: "它是棕色的、黏糊糊、疙疙瘩瘩、还臭烘烘的。" },
          { text: "'You found our picnic!' cried Buzz." , textZh: "「你找到我们的野餐啦！」巴斯喊道。" },
          { text: "'And here is your favorite—Shoo Fly Pie!'" , textZh: "「这是你最爱的——嘘蝇派！」" },
          { text: "Fly Guy was very happy!" , textZh: "小蝇怪可开心啦！" },
        ],
      },
    ],

    words: [
      { en: 'shoo', zh: '嘘走', sentence: 'Shoo, Fly Guy!', sentenceZh: '嘘，小蝇怪走开！', bookSentence: 'Shoo, fly!', bookSentenceZh: '嘘，苍蝇走开！' },
      { en: 'food', zh: '食物', sentence: 'The fly likes food.', sentenceZh: '苍蝇喜欢食物。', bookSentence: "Fly Guy's favorite food was brown, oozy, lumpy, and smelly.", bookSentenceZh: '小蝇怪最爱的食物又棕、又黏、又疙疙瘩瘩，还臭烘烘的。' },
      { en: 'eat', zh: '吃', sentence: "Don't eat that!", sentenceZh: '别吃那个！', bookSentence: 'Fly Guy flew until he saw something to eat.', bookSentenceZh: '小蝇怪一直飞，直到看见能吃的东西。' },
      { en: 'bug', zh: '虫子', sentence: 'A bug is small.', sentenceZh: '虫子很小。' },
      { en: 'nose', zh: '鼻子', sentence: 'The fly is on my nose.', sentenceZh: '苍蝇落在我的鼻子上。' },
      { en: 'go', zh: '走', sentence: 'Go away, fly!', sentenceZh: '走开，苍蝇！', bookSentence: 'One day Fly Guy went flying by himself.', bookSentenceZh: '有一天，小蝇怪自己飞出去了。' },
      { en: 'yuck', zh: '呸/讨厌', sentence: 'Yuck! A fly!', sentenceZh: '呸！一只苍蝇！', bookSentence: 'Yuck!', bookSentenceZh: '呸！' },
      { en: 'clean', zh: '干净的', sentence: 'Keep it clean.', sentenceZh: '保持干净。', bookSentence: 'We are on a clean picnic.', bookSentenceZh: '我们在干净的野餐布上。（据 Buzz 的留言整理）' },
    ],
  },
  {
    title: 'Fly High, Fly Guy! · 飞高点',
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个小男孩养了一只宠物小苍蝇，给它起名叫小蝇怪。" },
          { text: "Fly Guy could say the boy's name—BUZZ!" , textZh: "小蝇怪能喊出小男孩的名字——嗡！" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "One day Buzz said, 'It's time to take a road trip.'" , textZh: "有一天，巴斯说：“该去公路旅行啦。”" },
          { text: "Fly Guy wanted to go, too." , textZh: "小蝇怪也想去。" },
          { text: "'He's too little,' said Mom. 'He might get lost.'" , textZh: "“他还太小了，”妈妈说，“万一走丢了怎么办。”" },
          { text: "'Sorry,' said Dad. 'Fly Guy stays home.'" , textZh: "“真遗憾，”爸爸说，“小蝇怪得留在家里。”" },
          { text: "He shut the trunk. 'Okay, let's hit the road!'" , textZh: "他关上汽车后备箱。“好啦，咱们上路吧！”" },
          { text: "The family drove and drove." , textZh: "一家人开车开呀开。" },
          { text: "They stopped for a picnic. Mom opened the trunk. Fly Guy flew out." , textZh: "他们停下吃野餐。妈妈打开后备箱，小蝇怪一下子飞了出来。" },
          { text: "Dad said, 'How did he get in there?'" , textZh: "爸爸说：“他怎么跑进去的？”" },
          { text: "'Just don't lose him,' said Mom and Dad. 'Now, let's eat!'" , textZh: "“只要别把他弄丢就行，”爸爸妈妈说，“现在，开吃吧！”" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "They drove to the beach." , textZh: "他们开车去了海滩。" },
          { text: "Then it was time to go. Mom and Dad said, 'Is Fly Guy lost?'" , textZh: "要回家的时候，爸爸妈妈问：“小蝇怪走丢了吗？”" },
          { text: "'No,' said Buzz. 'Here he is!'" , textZh: "“没有，”巴斯说，“他在这儿呢！”" },
          { text: "They drove to the art museum." , textZh: "他们开车去了艺术博物馆。" },
          { text: "Then it was time to go. Mom and Dad said, 'Is Fly Guy lost?'" , textZh: "要回家的时候，爸爸妈妈问：“小蝇怪走丢了吗？”" },
          { text: "'No,' said Buzz. 'Here he is!'" , textZh: "“没有，”巴斯说，“他在这儿呢！”" },
          { text: "They drove to the fun park." , textZh: "他们开车去了游乐园。" },
          { text: "Then it was time to go. Mom and Dad said, 'Is Fly Guy lost?'" , textZh: "要回家的时候，爸爸妈妈问：“小蝇怪走丢了吗？”" },
          { text: "'No,' said Buzz. 'Here he is!'" , textZh: "“没有，”巴斯说，“他在这儿呢！”" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "'It's time to go home,' said Mom. 'Let's hit the road,' said Dad." , textZh: "“该回家啦，”妈妈说。“咱们上路吧，”爸爸说。" },
          { text: "They drove and drove and drove and drove..." , textZh: "他们开呀开呀开呀开……" },
          { text: "But they did not get home. 'We're lost,' said Mom and Dad." , textZh: "可他们没能回到家。“我们迷路了，”爸爸妈妈说。" },
          { text: "Buzz and Fly Guy had an idea. Buzz said, 'Fly high, Fly Guy!'" , textZh: "巴斯和小蝇怪想出了个主意。巴斯说：“飞高点，小蝇怪！”" },
          { text: "Fly Guy flew high into the sky. He used his super fly eyes to spy their house." , textZh: "小蝇怪高高飞上天空，用他超级苍蝇眼找到了自己的家。" },
          { text: "Fly Guy led the way home." , textZh: "小蝇怪在前头带路，领着大家回了家。" },
          { text: "'Thank you, Fly Guy,' said Mom and Dad. 'You saved the day! Yay, Fly Guy!'" , textZh: "“谢谢你，小蝇怪，”爸爸妈妈说，“你真是救了大家！哇，小蝇怪！”" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个小男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "Fly Guy could say the boy's name—BUZZ!" , textZh: "小蝇怪会叫小男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "Fly Guy went with Buzz to play football." , textZh: "小蝇怪跟着巴斯一起去打橄榄球。" },
          { text: "Coach said, 'We need one more player for the big game.'" , textZh: "教练说：“我们还差一名球员，才能参加这场大赛。”" },
          { text: "Buzz said, 'Fly Guy can play.'" , textZh: "巴斯说：“小蝇怪能上场。”" },
          { text: "Coach laughed. 'Flies can't play football.'" , textZh: "教练大笑起来：“苍蝇可不会打橄榄球。”" },
          { text: "Buzz said, 'Fly Guy, show him what you can do.'" , textZh: "巴斯说：“小蝇怪，让他瞧瞧你的本事。”" },
          { text: "Fly Guy kicked the ball." , textZh: "小蝇怪踢了一脚球。" },
          { text: "Fly Guy went out for a pass." , textZh: "小蝇怪跑出去接传球。" },
          { text: "Fly Guy tried to tackle Buzz." , textZh: "小蝇怪想扑倒巴斯。" },
          { text: "'I was right,' said Coach. 'Flies can't play football. But he can come to the game.'" , textZh: "“我说的没错吧，”教练说，“苍蝇就是不会打橄榄球。不过他可以来看比赛。”" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "It was the day before the big game. Buzz made a helmet for Fly Guy." , textZh: "大赛前一天，巴斯给小蝇怪做了一顶头盔。" },
          { text: "They played football. They did jumping jacks." , textZh: "他们练了橄榄球，还做了开合跳。" },
          { text: "They planned a secret play." , textZh: "他们想好了一个秘密战术。" },
          { text: "They made up a touchdown dance." , textZh: "他们还编了一支达阵庆祝舞。" },
          { text: "They went to the big game." , textZh: "他们去参加大赛了。" },
          { text: "Coach said, 'A new player joined our team.'" , textZh: "教练说：“我们队来了一名新球员。”" },
          { text: "Fly Guy sat on the bench." , textZh: "小蝇怪坐在板凳上。" },
          { text: "The game started. His team scored. Fly Guy cheered." , textZh: "比赛开始了。他的队得了分。小蝇怪欢呼起来。" },
          { text: "The other team scored. Fly Guy worried. The other team scored a lot!" , textZh: "对方球队得分了。小蝇怪开始担心。对方球队得了好多分！" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "Finally, there was one second left in the game." , textZh: "终于，比赛只剩最后一秒了。" },
          { text: "The other team was ahead. They were about to score again." , textZh: "对方球队领先了。他们眼看又要得分。" },
          { text: "And the new player was hurt." , textZh: "而且新球员受伤了。" },
          { text: "Coach said, 'Okay, Fly Guy. You can play now. The game is lost anyway.'" , textZh: "教练说：“好吧，小蝇怪。你现在可以上场了。反正比赛也输定了。”" },
          { text: "Buzz said, 'It's time for our secret play.'" , textZh: "巴斯说：“该用我们的秘密战术了。”" },
          { text: "Fly Guy went to the line." , textZh: "小蝇怪飞到了争球线上。" },
          { text: "The other team snapped the ball to their quarterback." , textZh: "对方球队把球传给了他们的四分卫。" },
          { text: "Fly Guy flew fast and straight." , textZh: "小蝇怪又快又直地飞了过去。" },
          { text: "He flew right up the quarterback's nose!" , textZh: "他直接飞进了四分卫的鼻子里！" },
          { text: "The boy dropped the ball." , textZh: "那个男孩把球掉在了地上。" },
          { text: "Buzz picked it up and ran." , textZh: "巴斯捡起球就跑。" },
          { text: "He scored!" , textZh: "他得分了！" },
          { text: "Fly Guy and Buzz did their touchdown dance." , textZh: "小蝇怪和巴斯跳起了他们的达阵庆祝舞。" },
          { text: "The team cheered. 'We won! Hooray for Fly Guy!'" , textZh: "全队欢呼起来：“我们赢了！小蝇怪真棒！”" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个小男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "Fly Guy could say the boy's name—BUZZ!" , textZh: "小蝇怪会叫小男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "One day, Buzz and Fly Guy went outside." , textZh: "有一天，巴斯和小蝇怪到外面去玩。" },
          { text: "\"Let's play hide-and-seek,\" said Buzz." , textZh: "“我们玩捉迷藏吧，”巴斯说。" },
          { text: "Fly Guy hid in the garbage can. He always hid in the garbage can." , textZh: "小蝇怪藏进了垃圾桶里。他总是藏进垃圾桶里。" },
          { text: "He liked to eat while Buzz looked for him." , textZh: "他喜欢趁巴斯找他的时候吃东西。" },
          { text: "\"I spy Fly Guy!\" said Buzz. \"It's my turn to hide.\"" , textZh: "“我找到小蝇怪啦！”巴斯说。“轮到我躲了。”" },
          { text: "Buzz hid in the garden shed and shut the door." , textZh: "巴斯躲进花园的小棚子里，关上了门。" },
          { text: "Fly Guy found a way in. \"BUZZ!\"" , textZh: "小蝇怪找到了进去的办法。“嗡！”" },
          { text: "\"You are GOOD!\" said Buzz. \"It's your turn to hide again.\"" , textZh: "“你真厉害！”巴斯说。“又轮到你躲了。”" },
          { text: "Fly Guy hid in the garbage can again." , textZh: "小蝇怪又藏进了垃圾桶里。" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "Just then, the garbageman came." , textZh: "就在这时，收垃圾的人来了。" },
          { text: "He dumped the garbage into the truck and drove away." , textZh: "他把垃圾倒进卡车，开车走了。" },
          { text: "Buzz's dad was going to work." , textZh: "巴斯的爸爸正要去上班。" },
          { text: "\"Follow that truck!\" cried Buzz." , textZh: "“跟着那辆卡车！”巴斯喊道。" },
          { text: "The truck drove and drove and drove, all the way to the town dump." , textZh: "卡车开啊开啊开，一直开到了镇上的垃圾场。" },
          { text: "Buzz ran into the dump. \"Fly Guy, where are you?\"" , textZh: "巴斯跑进垃圾场。“小蝇怪，你在哪儿？”" },
          { text: "\"Fly Guy,\" he cried. \"Answer me!\"" , textZh: "“小蝇怪，”他喊道。“快回答我！”" },
          { text: "A zillion flies all answered, \"BUZZZZZZZZ!\"" , textZh: "无数只苍蝇一起回答：“嗡嗡嗡嗡嗡嗡嗡嗡！”" },
          { text: "\"Oh, no!\" cried Buzz. \"They all can say my name! How will I find Fly Guy?\"" , textZh: "“哦，不！”巴斯喊道。“它们都会叫我的名字！我怎么才能找到小蝇怪？”" },
          { text: "Buzz spied a fly hiding. \"Do I spy Fly Guy?\" The fly flew away." , textZh: "巴斯瞄见一只苍蝇在躲藏。“我找到小蝇怪了吗？”那只苍蝇飞走了。" },
          { text: "Buzz spied a fly eating. \"Do I spy Fly Guy?\" The fly boinked him on the nose and flew away." , textZh: "巴斯瞄见一只苍蝇在吃东西。“我找到小蝇怪了吗？”那只苍蝇「哐！」地撞了一下他的鼻子，飞走了。" },
          { text: "Buzz spied a fly landing on his hand. \"Do I spy Fly Guy?\" The fly bit him and flew away." , textZh: "巴斯瞄见一只苍蝇落在他手上。“我找到小蝇怪了吗？”那只苍蝇叮了他一下，飞走了。" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "Buzz was sad. Was Fly Guy gone forever?" , textZh: "巴斯很难过。小蝇怪是不是永远不见了？" },
          { text: "He kicked a can. He kicked a jar." , textZh: "他踢翻了一个罐头。又踢翻了一个罐子。" },
          { text: "Then Buzz remembered. They were still playing a game." , textZh: "这时巴斯想起来了。他们还在玩游戏呢。" },
          { text: "\"Okay, Fly Guy,\" yelled Buzz, \"I give up. You win.\"" , textZh: "“好吧，小蝇怪，”巴斯大喊，“我认输了。你赢了。”" },
          { text: "He heard a voice from above." , textZh: "他听到头顶传来一个声音。" },
          { text: "\"I SPY FLY GUY!\" cried Buzz." , textZh: "“我找到小蝇怪啦！”巴斯喊道。" },
          { text: "And Fly Guy said, \"BUZZZ LOOZZZ!\"" , textZh: "小蝇怪说：“嗡——你输啦！”" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个小男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "Fly Guy could say the boy's name—BUZZ!" , textZh: "小蝇怪能说出小男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "One day, Buzz and Fly Guy were bored. Fly Guy said, 'FUNZZIE?'" , textZh: "有一天，巴斯和小蝇怪觉得好无聊。小蝇怪说：「玩点啥？」" },
          { text: "'Yeah,' said Buzz. 'Let's do something fun.'" , textZh: "「好啊，」巴斯说。「咱们找点好玩的事做吧。」" },
          { text: "Buzz and Fly Guy went for a walk." , textZh: "巴斯和小蝇怪出去散步了。" },
          { text: "They played chase. They cooled off in the fountain." , textZh: "他们玩起了追逐游戏，还在喷泉里凉快了一下。" },
          { text: "A girl was running. A fly was chasing her." , textZh: "有个小女孩在跑步，一只苍蝇正追着她。" },
          { text: "'Don't worry,' said Buzz. 'Flies aren't pests. They are pets.'" , textZh: "「别担心，」巴斯说。「苍蝇不是害虫，它们是宠物。」" },
          { text: "'I know,' said the girl. 'This is my pet. Her name is Fly Girl.'" , textZh: "「我知道，」小女孩说。「这是我的宠物，她叫小蝇妹。」" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "Buzz said, 'This is Fly Guy. He can do tricks.'" , textZh: "巴斯说：「这是小蝇怪，他会耍把戏。」" },
          { text: "'Fly Girl can do tricks, too!' said the girl." , textZh: "「小蝇妹也会耍把戏！」小女孩说。" },
          { text: "'Fly Guy eats gross stuff,' said Buzz." , textZh: "「小蝇怪吃很恶心的东西，」巴斯说。" },
          { text: "'Fly Girl eats grosser stuff!' said the girl." , textZh: "「小蝇妹吃的东西更恶心！」小女孩说。" },
          { text: "'Fly Guy can say my name,' said Buzz. 'BUZZ!'" , textZh: "「小蝇怪能说出我的名字，」巴斯说。「嗡！」" },
          { text: "'Fly Girl can say my name, too!' said the girl. 'LIZZZ!'" , textZh: "「小蝇妹也能说出我的名字！」小女孩说。「莉！」" },
          { text: "'Do you want to play on the swings?' said Buzz. 'Sure,' said Liz." , textZh: "「你想去荡秋千吗？」巴斯说。「当然想，」莉兹说。" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "Fly Guy and Fly Girl sat side by side." , textZh: "小蝇怪和小蝇妹并排坐着。" },
          { text: "Fly Guy said, 'WUZZLE WUZZLE'. That is fly talk for 'You are nice.'" , textZh: "小蝇怪说：「呜吱 呜吱」。那是苍蝇语，意思是「你真好」。" },
          { text: "Fly Girl said, 'WUZZEE WUZZIE'. That is fly talk for 'You are nice, too.'" , textZh: "小蝇妹说：「呜吱 呜吱」。那是苍蝇语，意思是「你也真好」。" },
          { text: "Fly Guy and Fly Girl talked and talked. They imagined kissing, getting married, and living together in a dog food can." , textZh: "小蝇怪和小蝇妹聊啊聊。他们想象着亲亲嘴、结婚，还一起住在狗粮罐里。" },
          { text: "Then Fly Guy thought of Buzz and got sad. 'BUZZZ?'" , textZh: "后来小蝇怪想起了巴斯，有点伤心。「嗡？」" },
          { text: "And Fly Girl thought of Liz and got sad. 'LIZZZ?'" , textZh: "小蝇妹想起了莉兹，也有点伤心。「莉？」" },
          { text: "Fly Guy and Fly Girl both said, 'WUZZLE WUZZZUP!' That is fly talk for 'Let's be friends.'" , textZh: "小蝇怪和小蝇妹一起说：「呜吱 呜吱噗！」那是苍蝇语，意思是「我们做朋友吧」。" },
          { text: "'See you soon,' said Buzz and Liz." , textZh: "「回头见，」巴斯和莉兹说。" },
          { text: "'Yeah,' said Buzz. 'That was fun!' 'FUNZZIE!'" , textZh: "「是啊，」巴斯说。「真好玩！」「玩点啥！」" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly named Fly Guy." , textZh: "有个小男孩养了一只叫小蝇怪的宠物苍蝇。" },
          { text: "Fly Guy could say the boy's name—BUZZ!" , textZh: "小蝇怪能说出小男孩的名字——「嗡！」" },
          { text: "One night Buzz said, 'I made a book. We are the superheroes.'" , textZh: "一天晚上，巴斯说：「我做了一本书。咱们是超级英雄。」" },
          { text: "Fly Guy said, 'HEROZZZZ?'" , textZh: "小蝇怪说：「英雄？」" },
          { text: "'Yes,' said Buzz. 'I'll read it to you.'" , textZh: "「对啊，」巴斯说。「我读给你听。」" },
          { text: "The title of the book was: THE AMAZING ADVENTURES OF BUZZ BOY AND FLY GUY BY ME (BUZZ)." , textZh: "书的名字是：《巴斯小子和小蝇怪的神奇大冒险》，作者：我（巴斯）。" },
        ],
      },
      {
        chapter: "Chapter 1 (In Buzz's Book)",
        pages: [
          { text: "One day Buzz Boy woke up." , textZh: "有一天，巴斯小子醒来了。" },
          { text: "He was the same size as Fly Guy!" , textZh: "他和小蝇怪一样大啦！" },
          { text: "Fly Guy said, 'I HAVE BAD NEWS! Fly Guy can talk!'" , textZh: "小蝇怪说：「我有坏消息！小蝇怪会说话啦！」" },
          { text: "Buzz Boy said, 'WHAT?'" , textZh: "巴斯小子说：「什么？」" },
          { text: "Fly Guy said, 'PIRATES CAME LAST NIGHT. THEY TOOK OUR HOUSE TO A DRAGON CAVE... ON AN ISLAND FAR AWAY.'" , textZh: "小蝇怪说：「海盗昨晚来了。他们把我们的房子搬到了火龙洞……在一个很远很远的海岛上。」" },
          { text: "Buzz Boy looked out the window. He saw a sleeping dragon." , textZh: "巴斯小子往窗外望去，他看到一条正在睡觉的火龙。" },
        ],
      },
      {
        chapter: "Chapter 2 (In Buzz's Book)",
        pages: [
          { text: "Buzz Boy said, 'You're right, Fly Guy! Good thing we are superheroes! Time to take care of BUZZ-NESS!'" , textZh: "巴斯小子说：「你说得对，小蝇怪！幸好我们是超级英雄！该去办正事啦！」" },
          { text: "The dragon was still asleep." , textZh: "火龙还在呼呼大睡。" },
          { text: "With his superstrength Buzz Boy turned the dragon around." , textZh: "巴斯小子用他的超级力气，把火龙翻了个身。" },
          { text: "Fly Guy used his superloudness. 'BUZZZZZZ!'" , textZh: "小蝇怪用他的超级大嗓门。「嗡嗡嗡嗡嗡！」" },
          { text: "The dragon woke up and shot fire outside." , textZh: "火龙醒了，朝外面喷了一团火。" },
          { text: "The pirate guards ran away." , textZh: "海盗守卫们吓得跑掉了。" },
          { text: "Buzz Boy and Fly Guy ran to the beach. 'OOPS! MORE PIRATES!'" , textZh: "巴斯小子和小蝇怪跑到了海滩上。「哎呀！又有海盗！」" },
        ],
      },
      {
        chapter: "Chapter 3 (In Buzz's Book & Real Life)",
        pages: [
          { text: "Buzz Boy and Fly Guy were put in jail on the pirate ship. 'NOW WHAT?'" , textZh: "巴斯小子和小蝇怪被关进了海盗船上的牢房里。「这下怎么办？」" },
          { text: "Fly Guy said, 'I ALWAYS... CARRY MY... SUPER SKELETON KEY!'" , textZh: "小蝇怪说：「我……一直……随身带着……超级万能钥匙！」" },
          { text: "Fly Guy unlocked the door. 'YIKES! WE ARE AT THE TOP OF THE PIRATE SHIP!'" , textZh: "小蝇怪打开了牢门。「哎呀！我们居然在海盗船顶上！」" },
          { text: "Buzz Boy said, 'GOOD THING WE CAN BOTH FLY!!!'" , textZh: "巴斯小子说：「幸好我们俩都会飞！！！」" },
          { text: "Buzz Boy and Fly Guy flew back to the island." , textZh: "巴斯小子和小蝇怪飞回了海岛。" },
          { text: "They made friends with the dragon." , textZh: "他们和火龙成了好朋友。" },
          { text: "The dragon took their house back home." , textZh: "火龙把他们的房子搬回了家。" },
          { text: "Buzz Boy and Fly Guy let the dragon join their team. 'DRAGON DUDE!'" , textZh: "巴斯小子和小蝇怪让火龙加入了他们的队伍。「火龙老兄！」" },
          { text: "'The end,' said Buzz. Fly Guy said, 'HEROZZZ!'" , textZh: "「完啦，」巴斯说。小蝇怪说：「英雄！」" },
          { text: "'Superheroes,' said Buzz. 'Want to read it again?' Fly Guy said, 'YEZZZ!'" , textZh: "「超级英雄，」巴斯说。「想再读一遍吗？」小蝇怪说：「要！」" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个小男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "And Fly Guy could say the boy’s name—BUZZ!" , textZh: "而且小蝇怪还会叫小男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "One day, Fly Guy was eating breakfast in Buzz’s backpack." , textZh: "有一天，小蝇怪正在巴斯的背包里吃早饭。" },
          { text: "Buzz grabbed his backpack and went to school." , textZh: "巴斯抓起背包，上学去了。" },
          { text: "At school, Fly Guy flew out. 'SURPRIZZE!'" , textZh: "到了学校，小蝇怪飞了出来。「惊喜！」" },
          { text: "Then the teacher said, 'We are going on a field trip to tour a factory.'" , textZh: "接着老师说：「我们要去一家工厂实地参观啦。」" },
          { text: "Buzz said, 'Fly Guy, you can ride in my pocket.'" , textZh: "巴斯说：「小蝇怪，你待在我的口袋里吧。」" },
          { text: "The class rode the bus to the factory." , textZh: "全班坐着大巴去了工厂。" },
          { text: "They arrived at 'THE FANTASTIC FLYSWATTER FACTORY'." , textZh: "他们到了「超级苍蝇拍工厂」。" },
          { text: "Fly Guy looked out the bus window and thought: 'BAD NEWZZ!!'" , textZh: "小蝇怪从车窗往外一看，心想：「坏消息！！」" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "Buzz said, 'Fly Guy, stay down in my pocket!'" , textZh: "巴斯说：「小蝇怪，乖乖待在我口袋里！」" },
          { text: "A tour guide led the class inside." , textZh: "一位导游带着全班走进了工厂。" },
          { text: "The tour guide said, 'Here is our flyswatter museum.'" , textZh: "导游说：「这是我们苍蝇拍博物馆。」" },
          { text: "They walked past a display showing the First Flyswatter, Caveman Flyswatter, Royal Flyswatter, Fly Ball Swatter, and Digital I-Swatter." , textZh: "他们走过一排展品，上面有第一把苍蝇拍、原始人苍蝇拍、皇家苍蝇拍、苍蝇球拍，还有数码 I 拍。" },
          { text: "'Here is where we make the flyswatters,' she said. 'You may each have one.'" , textZh: "「这里就是我们做苍蝇拍的地方，」她说，「你们每人可以拿一把。」" },
          { text: "'Now,' said the guide, 'here is Fred the Fly to tell you more!'" , textZh: "「现在，」导游说，「有请苍蝇弗雷德给大家讲讲！」" },
          { text: "Fly Guy peeked out." , textZh: "小蝇怪偷偷探出头来。" },
          { text: "'Boys and girls,' said Fred (a giant fly mascot). 'We know flies play in slime.' Fly Guy nodded." , textZh: "「小朋友们，」苍蝇弗雷德（一只巨大的苍蝇吉祥物）说，「我们都知道苍蝇喜欢在黏液里玩。」小蝇怪点了点头。" },
          { text: "'Flies eat garbage!' Fly Guy smiled." , textZh: "「苍蝇吃垃圾！」小蝇怪笑了。" },
          { text: "'Flies are nasty!' Fly Guy got mad." , textZh: "「苍蝇很恶心！」小蝇怪生气了。" },
          { text: "'That’s why, boys and girls,' Fred the Fly shouted, 'we need the flyswatter of the future—the Super Swatter 6000!'" , textZh: "「所以，小朋友们，」苍蝇弗雷德大声喊道，「我们需要未来的苍蝇拍——超级拍 6000！」" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "'Now let’s see what the Super Swatter can do!' said Fred. 'Bring out the fly!'" , textZh: "「现在让我们见识见识超级拍的厉害！」弗雷德说，「把苍蝇放出来！」" },
          { text: "The tour guide brought out a tiny fly in a jar." , textZh: "导游拿出一个装在罐子里的小苍蝇。" },
          { text: "'Release the fly!' yelled Fred." , textZh: "「放苍蝇出来！」弗雷德大喊。" },
          { text: "The Super Swatter started swatting. 'WHAP WHAP WHAP!'" , textZh: "超级拍开始拍起来。「啪啪啪！」" },
          { text: "Fly Guy cried, 'BUZZ!'" , textZh: "小蝇怪叫道：「嗡！」" },
          { text: "Fly Guy flew out of the pocket to help the little fly." , textZh: "小蝇怪从口袋里飞出来，去救那只小苍蝇。" },
          { text: "The Super Swatter kept swatting." , textZh: "超级拍还在不停地拍。" },
          { text: "Fly Guy took the fly to an open window and let it escape." , textZh: "小蝇怪带着小苍蝇飞到开着的窗前，让它逃走了。" },
          { text: "The Super Swatter kept swatting and went completely out of control." , textZh: "超级拍拍个不停，彻底失控了。" },
          { text: "Fly Guy flew past Fred the Fly and the flyswatter machines, leading the rampaging robot behind him." , textZh: "小蝇怪飞过苍蝇弗雷德和苍蝇拍机器，把那台发狂的机器人引在自己身后。" },
          { text: "The Super Swatter smashed through everything in the factory." , textZh: "超级拍把工厂里的一切都砸了个稀巴烂。" },
          { text: "'Stop! Stop!' yelled Fred. 'Everyone out! No more factory tours, ever!'" , textZh: "「停下！停下！」弗雷德大喊，「大家快出去！以后再也不办工厂参观了！」" },
          { text: "Back at school, the class made an art project out of the flyswatters." , textZh: "回到学校，全班用苍蝇拍做了一件手工作品。" },
          { text: "Everyone agreed—'BEST FIELD TRIP EVER!'" , textZh: "大家都一致同意——「最棒的实地考察！」" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个小男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "And Fly Guy could say the boy’s name—BUZZ!" , textZh: "而且小蝇怪还会叫小男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "One day, Dad said, 'Who wants to go for a ride?'" , textZh: "有一天，爸爸说：「谁想去兜兜风？」" },
          { text: "'We do!' said Buzz and Fly Guy." , textZh: "「我们去！」巴斯和小蝇怪说。" },
          { text: "'Everyone buckle up!' Dad said. Then they hit the road with the windows down." , textZh: "「大家系好安全带！」爸爸说。然后他们摇下车窗，上路了。" },
          { text: "Buzz said, 'Oops, Fly Guy, you need some air!'" , textZh: "巴斯说：「哎呀，小蝇怪，你需要透透气！」" },
          { text: "Buzz stuck his hand out the window and pretended it was an airplane." , textZh: "巴斯把手伸出窗外，假装那是一架飞机。" },
          { text: "Suddenly, wind blew in the car and carried Fly Guy out of the window..." , textZh: "突然，一阵风刮进车里，把小蝇怪从窗口吹了出去……" },
          { text: "...and into a passing truck." , textZh: "……吹进了一辆路过的卡车里。" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "Meanwhile, in the truck, Fly Guy tumbled into the truck driver’s mouth. 'GLUK'" , textZh: "与此同时，在卡车里，小蝇怪一头栽进了卡车司机的嘴里。「咕噜」" },
          { text: "'Follow that truck!' cried Buzz." , textZh: "「跟上那辆卡车！」巴斯喊道。" },
          { text: "The truck driver spit Fly Guy out the window..." , textZh: "卡车司机把小蝇怪从窗口吐了出去……" },
          { text: "...and into a passing motorboat." , textZh: "……吐进了一艘路过的汽艇里。" },
          { text: "Meanwhile, on the boat, Fly Guy saw a man put a bug on a big hook." , textZh: "与此同时，在汽艇上，小蝇怪看见一个人把一只小虫挂在大鱼钩上。" },
          { text: "'Follow that boat!' cried Buzz." , textZh: "「跟上那艘汽艇！」巴斯喊道。" },
          { text: "Fly Guy jumped overboard..." , textZh: "小蝇怪跳下船……" },
          { text: "...and onto a passing circus train." , textZh: "……落到了一列路过的马戏团火车上。" },
          { text: "'Follow that train!' cried Buzz." , textZh: "「跟上那列火车！」巴斯喊道。" },
          { text: "Meanwhile, on the train, Fly Guy surprised a sleepy elephant." , textZh: "与此同时，在火车上，小蝇怪吓醒了—只打瞌睡的大象。" },
          { text: "The elephant blew him off the train..." , textZh: "大象把他吹下了火车……" },
          { text: "...and onto an airplane." , textZh: "……落到了一架飞机上。" },
          { text: "Meanwhile, on the airplane, the pilot saw Fly Guy and turned on the wipers." , textZh: "与此同时，在飞机上，飞行员看见了小蝇怪，打开了雨刷。" },
          { text: "'Follow that airplane!' cried Buzz." , textZh: "「跟上那架飞机！」巴斯喊道。" },
          { text: "'Follow that... I mean, follow Fly Guy!' cried Buzz." , textZh: "「跟上那架……我是说，跟上小蝇怪！」巴斯喊道。" },
          { text: "Just then, a rocket roared up from the ground." , textZh: "就在这时，一枚火箭从地面呼啸升空。" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "'Follow that rocket!' cried Buzz." , textZh: "「跟上那枚火箭！」巴斯喊道。" },
          { text: "Buzz and Dad landed in parachutes. The rocket raced into space." , textZh: "巴斯和爸爸乘着降落伞着陆。火箭则冲进了太空。" },
          { text: "'Will Fly Guy survive?' asked Buzz." , textZh: "「小蝇怪能活下来吗？」巴斯问。" },
          { text: "But Fly Guy was safe on the ground. 'YEZZZZ'" , textZh: "可是小蝇怪平平安安在地面上。「耶——」" },
          { text: "'Fly Guy, you’re here!' cried Buzz. 'The rocket didn’t take you to space!'" , textZh: "「小蝇怪，你在这儿！」巴斯喊道，「火箭没把你带到太空去！」" },
          { text: "Dad said, 'Let's ride home.'" , textZh: "爸爸说：「咱们开车回家吧。」" },
          { text: "And Fly Guy said—'MORE RIDEZZZ!'" , textZh: "小蝇怪却说——「还要兜风！」" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个小男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "And Fly Guy could say the boy’s name—BUZZ!" , textZh: "而且小蝇怪还会叫小男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "One day, Fly Guy went with Buzz, Mom, and Dad on a long trip." , textZh: "有一天，小蝇怪和巴斯、妈妈、爸爸一起去了一趟长途旅行。" },
          { text: "They drove until dinnertime and stopped at a hotel." , textZh: "他们一直开到吃晚饭的时候，在一家旅馆停了下来。" },
          { text: "\"Yay!\" said Buzz. \"I love hotels!\"" , textZh: "“耶！”巴斯说。“我最喜欢旅馆啦！”" },
          { text: "\"Cool room,\" said Buzz. \"Time for dinner,\" said Dad." , textZh: "“房间真酷，”巴斯说。“该吃晚饭了，”爸爸说。" },
          { text: "\"There is a nice restaurant downstairs,\" said Mom, \"but Fly Guy can’t go there.\"" , textZh: "“楼下有一家很棒的餐厅，”妈妈说，“可是小蝇怪不能进去。”" },
          { text: "\"Fly Guy can eat outside,\" said Buzz. \"Right, Fly Guy?\" 'YEZZZ!'" , textZh: "“小蝇怪可以在外面吃，”巴斯说。“对吧，小蝇怪？” “是——吱！”" },
          { text: "Fly Guy flew outside." , textZh: "小蝇怪飞到了外面。" },
          { text: "He found a trash can. He found a puddle. He found a sticky spot." , textZh: "他找到了一个垃圾桶。他找到了一个小水坑。他还发现了一块黏糊糊的地方。" },
          { text: "He found the biggest, slimiest garbage can ever (Hotel Trash)." , textZh: "他找到了有史以来最大、最黏糊的垃圾桶（旅馆专用垃圾）。" },
          { text: "But he didn’t find anything that he wanted to eat." , textZh: "可是他没找到任何想吃的东西。" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "Then Fly Guy smelled something wonderful." , textZh: "这时，小蝇怪闻到一股好闻的味道。" },
          { text: "Fly Guy followed the smell into the restaurant kitchen." , textZh: "小蝇怪顺着香味，飞进了餐厅的厨房。" },
          { text: "At last, he found where he wanted to eat!" , textZh: "终于，他找到了想吃的地方！" },
          { text: "Fly Guy needed to wash before dinner. 'OOPZ! MEZZY!'" , textZh: "小蝇怪在吃饭前得先洗一洗。“喔吱！脏吱！”" },
          { text: "He spied a small round bathtub with warm brown water. Perfect!" , textZh: "他发现了一个圆圆的小澡盆，里面是温热的棕色水。太棒了！" },
          { text: "Fly Guy jumped in. He washed his face and hands." , textZh: "小蝇怪跳了进去。他洗了洗脸和手。" },
          { text: "He washed his armpits. He washed between his toes." , textZh: "他洗了洗胳肢窝。他还洗了洗脚趾缝。" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "Fly Guy’s bathtub was picked up and carried to another room." , textZh: "小蝇怪的澡盆被端了起来，搬到了另一个房间。" },
          { text: "It was set down on a table in front of a lady." , textZh: "澡盆被放在了一位女士面前的桌子上。" },
          { text: "The lady screamed, \"Waiter! There’s a fly in my soup!\"" , textZh: "那位女士尖叫起来：“服务员！我的汤里有只苍蝇！”" },
          { text: "The lady jumped up. Her soup and Fly Guy went flying..." , textZh: "女士跳了起来。她的汤和小蝇怪一起飞了出去……" },
          { text: "...into another lady’s soup." , textZh: "……飞进了另一位女士的汤里。" },
          { text: "That lady jumped up. Her soup and the first lady’s soup and Fly Guy went flying..." , textZh: "那位女士也跳了起来。她的汤、第一位女士的汤，还有小蝇怪，一起飞了出去……" },
          { text: "...onto a gentleman’s head." , textZh: "……飞到了一位先生的头上。" },
          { text: "The gentleman jumped up. The soup and Fly Guy and the gentleman’s hair (toupee) went flying...." , textZh: "先生跳了起来。汤、小蝇怪，还有先生的假发，一起飞了出去……" },
          { text: "Everyone jumped up. Everyone’s soup and Fly Guy and the gentleman’s hair went flying." , textZh: "大家都跳了起来。每个人的汤、小蝇怪，还有先生的假发，全都飞了出去。" },
          { text: "Fly Guy still needed a bath. Buzz, Mom, and Dad needed a bath." , textZh: "小蝇怪还得洗澡。巴斯、妈妈和爸爸也需要洗澡。" },
          { text: "Everyone needed a bath." , textZh: "大家都得洗个澡。" },
          { text: "\"Last one in the pool is a rotten egg!\" yelled Buzz." , textZh: "“最后一个跳进泳池的是臭鸡蛋！”巴斯大喊。" },
          { text: "They all jumped into the hotel pool. Fly Guy flew above and said, 'HOTELZZ FUNZZIE!'" , textZh: "他们全都跳进了旅馆的泳池。小蝇怪在上方飞着，喊道：“旅馆吱 好玩吱！”" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个小男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "And Fly Guy could say the boy’s name—BUZZ!" , textZh: "而且小蝇怪还会叫小男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "It was a dark and stormy night. Buzz and Fly Guy were playing." , textZh: "那是一个漆黑又刮着暴风的夜晚。巴斯和小蝇怪正在玩耍。" },
          { text: "Buzz made puzzles for both of them." , textZh: "巴斯给他们俩做了拼图。" },
          { text: "Buzz made costumes for both of them." , textZh: "巴斯给他们俩做了戏服。" },
          { text: "Buzz made a drawing for both of them (FLY GUY IS MY BEST FRIEND!)." , textZh: "巴斯给他们俩画了一幅画（小蝇怪是我最好的朋友！）。" },
          { text: "Finally, Buzz said, 'Time for bed, Fly Guy.'" , textZh: "终于，巴斯说：“该睡觉了，小蝇怪。”" },
          { text: "Fly Guy said, 'BIZZY!' and stayed up at the desk." , textZh: "小蝇怪说：“忙吱！”然后留在书桌前没睡。" },
          { text: "As Buzz fell asleep, he wondered, 'What is Fly Guy making?'" , textZh: "巴斯睡着的时候，心里还在想：“小蝇怪到底在做什么呢？”" },
        ],
      },
      {
        chapter: "Chapter 2 (Buzz's Dream)",
        pages: [
          { text: "Late that night a strange light woke up Buzz." , textZh: "深夜，一道奇怪的光把巴斯照醒了。" },
          { text: "Fly Guy was making something in his laboratory." , textZh: "小蝇怪正在他的实验室里做着什么。" },
          { text: "He was making a monster!" , textZh: "他正在造一个怪物！" },
          { text: "Fly Guy turned on the power. The monster sat up." , textZh: "小蝇怪接通了电源。怪物坐了起来。" },
          { text: "Buzz cried, 'It’s Frankenfly!'" , textZh: "巴斯喊道：“那是弗兰蝇！”" },
          { text: "Frankenfly heard Buzz. He stood up." , textZh: "弗兰蝇听见了巴斯的声音。他站了起来。" },
          { text: "He walked to the bed and picked up Buzz." , textZh: "他走到床边，把巴斯举了起来。" },
          { text: "Fly Guy yelled, 'BUZZ!' and shut off the power." , textZh: "小蝇怪大喊一声：“嗡！”然后关掉了电源。" },
          { text: "Frankenfly dropped Buzz and fell onto the bed." , textZh: "弗兰蝇松开巴斯，倒在了床上。" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "Buzz fell out of bed and woke up (CRASH!). It was morning." , textZh: "巴斯从床上摔了下来，醒了过来（哐当！）。天已经亮了。" },
          { text: "'Wow!' said Buzz. 'That was a bad dream.'" , textZh: "“哇！”巴斯说。“刚才做了个噩梦。”" },
          { text: "Fly Guy was not in his bed. He was asleep on the desk." , textZh: "小蝇怪不在自己的小床上。他在书桌上睡着了。" },
          { text: "'Fly Guy,' said Buzz, 'did you make something last night?'" , textZh: "“小蝇怪，”巴斯说，“你昨晚做了什么东西吗？”" },
          { text: "'You made me?' asked Buzz. Fly Guy said, 'YEZZZ!'" , textZh: "“你画的是我？”巴斯问。小蝇怪说：“是——吱！”" },
          { text: "He pointed to a piece of paper. 'It’s me!' said Buzz." , textZh: "他指了指一张纸。“这是我！”巴斯说。" },
          { text: "'It’s a painting of you and me!' said Buzz (BUZZ IZ BEZT FRIENZ)." , textZh: "“这是你和我一起的画！”巴斯说（嗡 最吱 朋吱）。" },
          { text: "'How did you paint this? My brushes are too big for you.'" , textZh: "“你是怎么画的？我的画笔对你来说太大了。”" },
          { text: "Fly Guy pointed to a spilled box of grape juice and said, 'EAZZY!' (He used grape juice and his tongue as a brush)." , textZh: "小蝇怪指了指打翻的一盒葡萄汁，说：“易吱！”（他用葡萄汁当颜料，用自己的舌头当画笔）。" },
          { text: "Buzz said, 'We are the BEST best friends ever!'" , textZh: "巴斯说：“我们永远是最最最好的朋友！”" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "And Fly Guy could say the boy’s name — BUZZ!" , textZh: "而且小蝇怪还会喊男孩的名字 ——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1 (Buzz's Homework)",
        pages: [
          { text: "One night, Buzz said, 'I have homework to do. I have to write a fairy tale. Can you help me, Fly Guy?' Fly Guy said, 'YEZZ!'" , textZh: "一天晚上，巴斯说：“我有作业要做。我要写一个童话故事。小蝇怪，你能帮帮我吗？”小蝇怪说：“嗡——是！”" },
          { text: "Buzz started, 'Once upon a time...'" , textZh: "巴斯开头说：“从前……”" },
          { text: "'Once upon a time, there was an ugly troll.' Fly Guy didn't like being imagined as an ugly troll." , textZh: "“从前，有一个丑陋的巨魔。”小蝇怪不喜欢被想象成一个丑陋的巨魔。" },
          { text: "'Well, what about a smelly pig herder?' Fly Guy didn't like that either." , textZh: "“那，要不换个臭烘烘的养猪倌？”小蝇怪也不喜欢这个。" },
          { text: "'No? What about a handsome prince?' Fly Guy proudly said, 'YEZZ!'" , textZh: "“不要？那要一个帅气的王子怎么样？”小蝇怪骄傲地说：“嗡——是！”" },
          { text: "'Okay,' said Buzz. 'The handsome prince walked to the dark castle.'" , textZh: "“好吧，”巴斯说。“帅气的王子走向黑暗城堡。”" },
          { text: "'Maybe instead of walking,' said Buzz, 'what if he rode to the dark castle?' Fly Guy imagined riding a horse, but it looked too difficult." , textZh: "“也许不走路，”巴斯说，“要是他骑着马去黑暗城堡呢？”小蝇怪想象着自己骑着马，可是看起来太难了。" },
          { text: "'No! I’ve got it! He flew to the dark castle.' Fly Guy happily agreed, 'YEZZ!'" , textZh: "“不对！我有了！他飞去了黑暗城堡。”小蝇怪开心地同意：“嗡——是！”" },
        ],
      },
      {
        chapter: "Chapter 2 (In the Fairy Tale)",
        pages: [
          { text: "'At the dark castle,' said Buzz, 'the handsome prince ate cold porridge.' Fly Guy thought, 'YUCKZZ!'" , textZh: "“在黑暗城堡里，”巴斯说，“帅气的王子吃着凉粥。”小蝇怪心想：“呕——嗡！”" },
          { text: "'What if he kissed a frog?' Fly Guy thought, 'GROZZ!'" , textZh: "“要是他亲了一只青蛙呢？”小蝇怪心想：“恶——嗡！”" },
          { text: "'I’ve got it! He rescued a beautiful princess.' Fly Guy approved, 'YEZZ!'" , textZh: "“我有了！他救了一位美丽的公主。”小蝇怪赞成：“嗡——是！”" },
          { text: "'But a giant lived in the dark castle.' Fly Guy gasped, 'YIKEZZ!'" , textZh: "“可是黑暗城堡里住着一个巨人。”小蝇怪倒吸一口气：“哎呀——嗡！”" },
        ],
      },
      {
        chapter: "Chapter 3 (The Battle & Real Life)",
        pages: [
          { text: "'The giant chased the handsome prince and the beautiful princess.'" , textZh: "“巨人追着帅气的王子和美丽的公主。”" },
          { text: "'He knocked them down to the ground.' (The giant swung a flyswatter)." , textZh: "“他把他们打倒在地。”（巨人挥舞着苍蝇拍。）" },
          { text: "'The princess threw her crown.'" , textZh: "“公主把她的王冠扔了出去。”" },
          { text: "'It hit the giant on the nose.' (BOINK!). Fly Guy cheered, 'YEZZ!'" , textZh: "“它正中巨人的鼻子。”（哐！）小蝇怪欢呼：“嗡——是！”" },
          { text: "'The giant fell down.' Fly Guy said, 'OH YEZZ!'" , textZh: "“巨人倒下了。”小蝇怪说：“哦，嗡——是！”" },
          { text: "'He ran away.' (The giant ran away crying OUCH! OUCH!)." , textZh: "“他跑掉了。”（巨人哭着“哎哟！哎哟！”跑掉了。）" },
          { text: "'The prince and the princess flew home.'" , textZh: "“王子和公主飞回了家。”" },
          { text: "'They made matching crowns.' Fly Guy thought, 'NIZZE.'" , textZh: "“他们做了配套的王冠。”小蝇怪心想：“赞——嗡。”" },
          { text: "'And they lived happily ever after.' Fly Guy thought, 'Awww...'" , textZh: "“从此他们幸福地生活在一起。”小蝇怪心想：“啊……”" },
          { text: "'The end,' said Buzz." , textZh: "“故事讲完啦，”巴斯说。" },
          { text: "'I like my fairy tale,' said Buzz. 'Hey, want to write another one?' Fly Guy said, 'YEZZ!'" , textZh: "“我喜欢我的童话故事，”巴斯说。“嘿，想再写一个吗？”小蝇怪说：“嗡——是！”" },
          { text: "'Okay. Once there was a hairy dwarf . . .'" , textZh: "“好吧。从前有一个毛茸茸的小矮人……”" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A young boy named Buzz had a pet fly." , textZh: "有个叫巴斯的小男孩，养了一只宠物小苍蝇。" },
          { text: "No one knows why he had a pet fly." , textZh: "谁也说不清，他为什么要养一只小苍蝇。" },
          { text: "Buzz named him Fly Guy." , textZh: "巴斯给它起名叫小蝇怪。" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "One day Buzz went to visit his grandma. Fly Guy went, too." , textZh: "有一天，巴斯去看望奶奶。小蝇怪也跟着一起去。" },
          { text: "Grandma was happy to see Buzz. She ran to hug him." , textZh: "奶奶见到巴斯高兴极了，跑过去一把抱住他。" },
          { text: "\"Hi, Grandma!\" said Buzz. \"I want you to meet my pet . . .\"" , textZh: "“嗨，奶奶！”巴斯说，“我想让你见见我的宠物……”" },
          { text: "Grandma said—GLURK! and she swallowed Fly Guy." , textZh: "奶奶叫了一声——咕噜！把小蝇怪吞进了肚子里。" },
          { text: "Buzz didn’t know why she swallowed Fly Guy." , textZh: "巴斯不明白，她为什么要吞掉小蝇怪。" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "Fly Guy went down a deep dark hole." , textZh: "小蝇怪顺着又深又黑的山洞一直往下滑。" },
          { text: "At the bottom of the hole, he came to a wet place." , textZh: "滑到洞底，他来到了一个湿漉漉的地方。" },
          { text: "He looked around for a while. Then he wanted to leave." , textZh: "他四处张望了一会儿，接着就想赶紧离开。" },
          { text: "He started up the hole." , textZh: "他顺着山洞往回爬。" },
          { text: "Just then, Grandma swallowed a spider to catch Fly Guy." , textZh: "就在这时，奶奶吞下了一只蜘蛛，想抓住小蝇怪。" },
          { text: "She swallowed a bird to catch the spider." , textZh: "她又吞下一只小鸟，想抓住那只蜘蛛。" },
          { text: "She swallowed a cat to catch the bird." , textZh: "她又吞下一只小猫，想抓住那只小鸟。" },
          { text: "She swallowed a dog to catch the cat." , textZh: "她又吞下一条小狗，想抓住那只小猫。" },
          { text: "She swallowed a goat to catch the dog." , textZh: "她又吞下一只山羊，想抓住那条小狗。" },
          { text: "She swallowed a cow to catch the goat." , textZh: "她又吞下一头奶牛，想抓住那只山羊。" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "Grandma was about to swallow a horse to catch the cow." , textZh: "奶奶正要吞下一匹马，去抓住那头奶牛。" },
          { text: "Fly Guy cried, \"BUZZ!\"" , textZh: "小蝇怪大喊一声：“嗡！”" },
          { text: "\"I’m up here!\" yelled Buzz." , textZh: "“我在这儿呢！”巴斯大声喊道。" },
          { text: "Out came Fly Guy." , textZh: "小蝇怪被吐了出来。" },
          { text: "Out came the spider, the bird, the cat, the dog, the goat, and the cow." , textZh: "蜘蛛、小鸟、小猫、小狗、山羊和奶牛，全都跟着被吐了出来。" },
          { text: "And everyone lived happily ever after, of course!" , textZh: "当然啦，从此以后，大家都过上了幸福快乐的生活！" },
        ],
      },
    ],

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
    bookText: [
      {
        chapter: "Introduction",
        pages: [
          { text: "A boy had a pet fly. He named him Fly Guy." , textZh: "有个男孩养了一只宠物苍蝇。他给它起名叫小蝇怪。" },
          { text: "And Fly Guy could say the boy’s name—BUZZ!" , textZh: "而且小蝇怪还会喊男孩的名字——「嗡！」" },
        ],
      },
      {
        chapter: "Chapter 1",
        pages: [
          { text: "Buzz’s friends came to see The Amazing Fly Guy Circus." , textZh: "巴斯的朋友们来看“神奇小蝇怪马戏团”。" },
          { text: "Buzz said, 'Get ready for Fly Guy’s amazing new tricks!'" , textZh: "巴斯说：“准备好看小蝇怪的新奇特技吧！”" },
          { text: "'Now,' said Buzz, 'The Backstroke!' Fly Guy did the backstroke in a birdbath." , textZh: "“现在，”巴斯说，“仰泳！”小蝇怪在鸟澡盆里游起了仰泳。" },
          { text: "'Now,' said Buzz, 'The Dizzy Doozie!' Fly Guy flew in dizzy loops around a girl's head." , textZh: "“现在，”巴斯说，“晕头转转！”小蝇怪绕着一个小女孩的脑袋晕乎乎地转圈飞。" },
          { text: "'And now,' said Buzz, 'The Big Booger!' Fly Guy landed upside down right on Buzz's nose." , textZh: "“还有现在，”巴斯说，“大鼻屎！”小蝇怪四脚朝天，正好落在巴斯的鼻子上。" },
          { text: "'Time for supper,' said Mom. Buzz’s friends all went home." , textZh: "“该吃晚饭啦，”妈妈说。巴斯的朋友们都回家了。" },
        ],
      },
      {
        chapter: "Chapter 2",
        pages: [
          { text: "At the dinner table, Buzz said, 'Fly Guy learned new tricks.'" , textZh: "在餐桌旁，巴斯说：“小蝇怪学会了新特技。”" },
          { text: "Fly Guy did The Backstroke in Mom’s milk. It splashed everywhere!" , textZh: "小蝇怪在妈妈的牛奶里游起了仰泳。牛奶溅得到处都是！" },
          { text: "Buzz cried, 'Stop, Fly Guy!' But Fly Guy didn’t hear him." , textZh: "巴斯大喊：“停下，小蝇怪！”可是小蝇怪没听见他。" },
          { text: "Fly Guy did The Dizzy Doozie around Dad’s head. Dad got so dizzy he crashed to the floor!" , textZh: "小蝇怪绕着爸爸的脑袋晕头转转。爸爸被转得头晕眼花，啪地摔倒在地板上！" },
          { text: "Buzz cried, 'Stop, Fly Guy!' But Fly Guy didn’t hear him." , textZh: "巴斯大喊：“停下，小蝇怪！”可是小蝇怪没听见他。" },
          { text: "Fly Guy did The Big Booger on Buzz's nose. Buzz caught him in a glass." , textZh: "小蝇怪在巴斯的鼻子上来了个大鼻屎。巴斯把他扣在玻璃杯里。" },
          { text: "'Stop, Fly Guy!' he said. 'Let’s clean up this mess.'" , textZh: "“停下，小蝇怪！”他说。“咱们把这堆乱子收拾干净吧。”" },
        ],
      },
      {
        chapter: "Chapter 3",
        pages: [
          { text: "Outside, Buzz said to Fly Guy, 'I have an idea. Do your tricks only when you hear the word NOW.' Fly Guy said, 'YEZZ.'" , textZh: "在外面，巴斯对小蝇怪说：“我有个主意。只有听到‘现在’这个词，你才表演特技。”小蝇怪说：“嗡——是。”" },
          { text: "A big kid walked by and laughed. 'Are you talking to a bug?' Buzz didn’t answer." , textZh: "一个大孩子走过，笑着说：“你在跟一只虫子说话吗？”巴斯没有回答。" },
          { text: "The kid said, 'Do you have bug brains?' Buzz didn’t answer." , textZh: "那孩子说：“你脑子里装的是虫子吗？”巴斯没有回答。" },
          { text: "The kid said, 'Bug got your tongue?' Buzz didn’t answer." , textZh: "那孩子说：“虫子把你的舌头叼走了吗？”巴斯没有回答。" },
          { text: "'Answer me!' yelled the kid. 'NOW!'" , textZh: "“回答我！”那孩子喊道。“现在！”" },
          { text: "Fly Guy heard the word 'NOW!' and went into action." , textZh: "小蝇怪听到“现在！”这个词，立刻行动起来。" },
          { text: "Fly Guy did The Backstroke right inside the big kid's chocolate drink, splashing it everywhere." , textZh: "小蝇怪在大小孩的巧克力饮料里游起了仰泳，溅得到处都是。" },
          { text: "Then Fly Guy did The Dizzy Doozie around the kid's head, making him completely lose his balance." , textZh: "接着小蝇怪绕着那孩子的脑袋晕头转转，把他转得彻底失去平衡。" },
          { text: "And then Fly Guy did The Big Booger, landing right on the kid's nose." , textZh: "然后小蝇怪来了个大鼻屎，正好落在那孩子的鼻子上。" },
          { text: "The kid yelled, 'Get out of my face!' and stepped backward, bumping into a garbage can." , textZh: "那孩子大喊：“从我脸上滚开！”然后往后退，撞到了一个垃圾桶。" },
          { text: "The garbage can tipped over, and a zillion angry flies flew out and chased the big kid away." , textZh: "垃圾桶翻倒了，无数只生气的苍蝇飞出来，把大小孩追跑了。" },
          { text: "Buzz smiled and said, 'Fly Guy, here’s a new trick for you.'" , textZh: "巴斯笑着说：“小蝇怪，这儿有个新特技给你。”" },
          { text: "'High Fivezzz!' Fly Guy tapped Buzz's finger. 'YEZZ?'" , textZh: "“击掌嗡——！”小蝇怪拍了拍巴斯的手指。“嗡——是？”" },
        ],
      },
    ],

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
      bookSentence: w.bookSentence,
      bookSentenceZh: w.bookSentenceZh,
      emoji: pickWordEmoji(w.en, w.zh, storyEmoji),
    })),
    bookText: s.bookText,
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
