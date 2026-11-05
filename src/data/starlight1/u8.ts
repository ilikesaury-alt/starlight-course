// Starlight 1 · Level 1 · Unit 8「Lola the Athlete」课程数据
// 模板：src/data/starlight1 的 Unit 1（monty-the-artist）各文件结构。
// 数据来源：src/data/starlight1/raw/unit8.json（教材 PDF 提取文本，仅使用本文件）。
// 结构对齐 Unit 1：每个单元 11 课，单词与句型围绕本课技能抽取。

import type { Lesson, LessonBook, SentenceFrame, ReadingPassage, Module, ExtTopic } from './shared'
import { w } from './shared'

// ============================================================================
// 1. 课程数据（每课一个 Lesson，id = PDF 课号）
// ============================================================================

export const u8_lessons: Record<number, Lesson[]> = {
  8: [
    // ---- Lesson 1: Vocabulary（动作词 walk/climb/swing/swim/fly）----
    {
      id: 1,
      title: 'Lola the Athlete Vocabulary',
      titleZh: '罗拉运动员·词汇',
      words: [
        { en: 'walk', zh: '走路', emoji: '🚶', ipa: '/wɔːk/' },
        { en: 'climb', zh: '爬', emoji: '🧗', ipa: '/klaɪm/' },
        { en: 'swing', zh: '荡秋千', emoji: '🎡', ipa: '/swɪŋ/' },
        { en: 'swim', zh: '游泳', emoji: '🏊', ipa: '/swɪm/' },
        { en: 'fly', zh: '飞', emoji: '🕊️', ipa: '/flaɪ/' },
      ],
      sentences: [
        { en: 'The boy can walk.', zh: '男孩会走路。', hint: 'can + 动词 = 会做某事' },
        { en: 'Can you walk?', zh: '你会走路吗？', hint: 'can 的一般疑问句' },
        { en: 'The boy can climb.', zh: '男孩会爬。', hint: 'climb = 爬' },
        { en: 'The girl can swing.', zh: '女孩会荡秋千。', hint: 'swing = 荡秋千' },
        { en: 'The bird can fly.', zh: '小鸟会飞。', hint: 'fly = 飞' },
      ],
    },
    // ---- Lesson 2: Vocabulary and Practice（run/jump/skip/hop/skate）----
    {
      id: 2,
      title: 'Lola the Athlete Vocabulary and Practice',
      titleZh: '罗拉运动员·词汇与练习',
      words: [
        { en: 'run', zh: '跑', emoji: '🏃', ipa: '/rʌn/' },
        { en: 'jump', zh: '跳', emoji: '🦘', ipa: '/dʒʌmp/' },
        { en: 'skip', zh: '跳绳', emoji: '🪢', ipa: '/skɪp/' },
        { en: 'hop', zh: '单脚跳', emoji: '🐰', ipa: '/hɒp/' },
        { en: 'skate', zh: '滑冰', emoji: '⛸️', ipa: '/skeɪt/' },
      ],
      sentences: [
        { en: 'She can run.', zh: '她会跑。', hint: 'run = 跑' },
        { en: 'Can you run?', zh: '你会跑吗？', hint: '用 can 提问' },
        { en: 'The boy can jump.', zh: '男孩会跳。', hint: 'jump = 跳' },
        { en: 'The girl can skip.', zh: '女孩会跳绳。', hint: 'skip = 跳绳' },
        { en: 'The girl can skate.', zh: '女孩会滑冰。', hint: 'skate = 滑冰' },
      ],
    },
    // ---- Lesson 3: Reading（姜饼人故事）----
    {
      id: 3,
      title: 'Lola the Athlete Reading',
      titleZh: '罗拉运动员·阅读',
      words: [
        { en: 'run', zh: '跑', emoji: '🏃', ipa: '/rʌn/' },
        { en: 'jump', zh: '跳', emoji: '🦘', ipa: '/dʒʌmp/' },
        { en: 'skate', zh: '滑冰', emoji: '⛸️', ipa: '/skeɪt/' },
        { en: 'catch', zh: '抓住', emoji: '🤚', ipa: '/kætʃ/' },
        { en: 'gingerbread man', zh: '姜饼人', emoji: '🍪', ipa: '/ˈdʒɪndʒəbred mæn/' },
      ],
      sentences: [
        { en: 'I can jump! Yes, I can!', zh: '我会跳！是的，我会！', hint: '肯定回答 can' },
        { en: "You can't catch me!", zh: '你抓不到我！', hint: 'can’t = 不能' },
        { en: "I'm the Gingerbread Man.", zh: '我是姜饼人。', hint: 'I’m = I am' },
        { en: 'Stop, Gingerbread Man! Stop!', zh: '站住，姜饼人！站住！', hint: 'stop = 停下' },
        { en: 'I can run! Yes, I can!', zh: '我会跑！是的，我会！', hint: 'run = 跑' },
      ],
    },
    // ---- Lesson 4: Reading and Practice（climb/fly/tree/bird/help）----
    {
      id: 4,
      title: 'Lola the Athlete Reading and Practice',
      titleZh: '罗拉运动员·阅读练习',
      words: [
        { en: 'climb', zh: '爬', emoji: '🧗', ipa: '/klaɪm/' },
        { en: 'fly', zh: '飞', emoji: '🕊️', ipa: '/flaɪ/' },
        { en: 'tree', zh: '树', emoji: '🌳', ipa: '/triː/' },
        { en: 'bird', zh: '小鸟', emoji: '🐦', ipa: '/bɜːd/' },
        { en: 'help', zh: '帮助', emoji: '🆘', ipa: '/help/' },
      ],
      sentences: [
        { en: 'I can climb! Yes, I can!', zh: '我会爬！是的，我会！', hint: 'climb = 爬' },
        { en: "You can't catch me!", zh: '你抓不到我！', hint: '重复故事金句' },
        { en: "I'm the Gingerbread Man.", zh: '我是姜饼人。', hint: '自我介绍角色' },
        { en: 'Oh no! I can’t fly!', zh: '哦不！我不会飞！', hint: 'fly = 飞' },
        { en: 'I can fly! Jump on my back!', zh: '我会飞！跳到我的背上来！', hint: 'bird 说的话' },
      ],
    },
    // ---- Lesson 5: Language Focus（I can / I can't）----
    {
      id: 5,
      title: 'Lola the Athlete Language Focus',
      titleZh: '罗拉运动员·语言聚焦',
      words: [
        { en: 'skip', zh: '跳绳', emoji: '🪢', ipa: '/skɪp/' },
        { en: 'skate', zh: '滑冰', emoji: '⛸️', ipa: '/skeɪt/' },
        { en: 'hop', zh: '单脚跳', emoji: '🐰', ipa: '/hɒp/' },
        { en: 'swing', zh: '荡秋千', emoji: '🎡', ipa: '/swɪŋ/' },
        { en: 'swim', zh: '游泳', emoji: '🏊', ipa: '/swɪm/' },
      ],
      sentences: [
        { en: 'I can swing.', zh: '我会荡秋千。', hint: 'I can + 动词' },
        { en: "I can't skip.", zh: '我不会跳绳。', hint: 'can’t = 不能' },
        { en: 'I can run.', zh: '我会跑。', hint: '肯定句' },
        { en: "I can't swim.", zh: '我不会游泳。', hint: '否定句' },
        { en: 'Can you walk?', zh: '你会走路吗？', hint: '一般疑问句' },
      ],
    },
    // ---- Lesson 6: Language Focus and Practice（Can you...? / Let's...）----
    {
      id: 6,
      title: 'Lola the Athlete Language Focus and Practice',
      titleZh: '罗拉运动员·语言聚焦与练习',
      words: [
        { en: 'drive a car', zh: '开车', emoji: '🚗', ipa: '/draɪv ə kɑː/' },
        { en: 'ride a bike', zh: '骑自行车', emoji: '🚲', ipa: '/raɪd ə baɪk/' },
        { en: 'kick a ball', zh: '踢球', emoji: '⚽', ipa: '/kɪk ə bɔːl/' },
        { en: 'hit a ball', zh: '击球', emoji: '🏏', ipa: '/hɪt ə bɔːl/' },
        { en: 'play a game', zh: '玩游戏', emoji: '🎮', ipa: '/pleɪ ə ɡeɪm/' },
      ],
      sentences: [
        { en: 'Can you drive a car?', zh: '你会开车吗？', hint: 'Can you + 短语' },
        { en: 'Can you ride a bike?', zh: '你会骑自行车吗？', hint: 'ride a bike = 骑自行车' },
        { en: 'Can you kick a ball?', zh: '你会踢球吗？', hint: 'kick = 踢' },
        { en: "Let's play a game!", zh: '我们玩游戏吧！', hint: 'Let’s = 让我们' },
        { en: "Let's rollerblade!", zh: '我们轮滑吧！', hint: 'rollerblade = 轮滑' },
      ],
    },
    // ---- Lesson 7: Phonics（ar 发音）----
    {
      id: 7,
      title: 'Lola the Athlete Phonics',
      titleZh: '罗拉运动员·自然拼读',
      words: [
        { en: 'car', zh: '汽车', emoji: '🚗', ipa: '/kɑː/' },
        { en: 'guitar', zh: '吉他', emoji: '🎸', ipa: '/ɡɪˈtɑː/' },
        { en: 'farm', zh: '农场', emoji: '🚜', ipa: '/fɑːm/' },
        { en: 'park', zh: '公园', emoji: '🏞️', ipa: '/pɑːk/' },
        { en: 'dark', zh: '黑暗', emoji: '🌑', ipa: '/dɑːk/' },
      ],
      sentences: [
        { en: "Charlie the cow can't play the guitar.", zh: '奶牛 Charlie 不会弹吉他。', hint: '含 ar 的 chant' },
        { en: 'He doesn’t have arms, but he can drive a car.', zh: '他没有手臂，但会开车。', hint: 'but = 但是' },
        { en: 'He can drive in the garden.', zh: '他能在花园里开。', hint: 'garden 含 ar' },
        { en: 'He can drive in the park.', zh: '他能在公园里开。', hint: 'park 含 ar' },
        { en: 'He can drive at the farm.', zh: '他能在农场开。', hint: 'farm 含 ar' },
      ],
    },
    // ---- Lesson 8: CLIL-P.E.（距离 / 米 / 厘米）----
    {
      id: 8,
      title: 'CLIL-P.E.',
      titleZh: '跨学科·体育课',
      words: [
        { en: 'distance', zh: '距离', emoji: '📏', ipa: '/ˈdɪstəns/' },
        { en: 'centimeter', zh: '厘米', emoji: '📐', ipa: '/ˈsentɪmiːtə/' },
        { en: 'meter', zh: '米', emoji: '📏', ipa: '/ˈmiːtə/' },
        { en: 'throw a ball', zh: '扔球', emoji: '🤾', ipa: '/θrəʊ ə bɔːl/' },
        { en: 'kick a ball', zh: '踢球', emoji: '⚽', ipa: '/kɪk ə bɔːl/' },
      ],
      sentences: [
        { en: "It's P.E. class.", zh: '现在是体育课。', hint: 'P.E. = 体育' },
        { en: 'I want to throw a ball!', zh: '我想扔一个球！', hint: 'want = 想要' },
        { en: "Let's throw a ball!", zh: '我们扔球吧！', hint: 'Let’s 提议' },
        { en: 'We can measure distances in meters and centimeters.', zh: '我们用米和厘米测量距离。', hint: 'measure = 测量' },
        { en: 'Dan can kick a ball 6 meters.', zh: 'Dan 能把球踢出 6 米。', hint: 'meter = 米' },
      ],
    },
    // ---- Lesson 9: Practice（综合复习）----
    {
      id: 9,
      title: 'Practice',
      titleZh: '综合练习',
      words: [
        { en: 'swing', zh: '荡秋千', emoji: '🎡', ipa: '/swɪŋ/' },
        { en: 'fly', zh: '飞', emoji: '🕊️', ipa: '/flaɪ/' },
        { en: 'walk', zh: '走路', emoji: '🚶', ipa: '/wɔːk/' },
        { en: 'climb', zh: '爬', emoji: '🧗', ipa: '/klaɪm/' },
        { en: 'skip', zh: '跳绳', emoji: '🪢', ipa: '/skɪp/' },
      ],
      sentences: [
        { en: "Let's swim.", zh: '我们游泳吧。', hint: '复习 Let’s' },
        { en: "Let's climb.", zh: '我们爬吧。', hint: 'climb = 爬' },
        { en: "Charlie the cow can't play the guitar.", zh: '奶牛 Charlie 不会弹吉他。', hint: '复习 ar chant' },
        { en: 'I can swing.', zh: '我会荡秋千。', hint: 'I can + 动词' },
        { en: "I can't fly.", zh: '我不会飞。', hint: 'can’t 否定' },
      ],
    },
    // ---- Lesson 10: Maze Run（游戏复习）----
    {
      id: 10,
      title: 'Maze Run',
      titleZh: '迷宫闯关（游戏）',
      words: [
        { en: 'swing', zh: '荡秋千', emoji: '🎡', ipa: '/swɪŋ/' },
        { en: 'jump', zh: '跳', emoji: '🦘', ipa: '/dʒʌmp/' },
        { en: 'play a game', zh: '玩游戏', emoji: '🎮', ipa: '/pleɪ ə ɡeɪm/' },
        { en: 'doll', zh: '玩偶', emoji: '🪆', ipa: '/dɒl/' },
        { en: 'plane', zh: '飞机', emoji: '✈️', ipa: '/pleɪn/' },
      ],
      sentences: [
        { en: 'Spell the words.', zh: '拼出单词。', hint: '游戏拼写环节' },
        { en: 'It has a head, but it doesn’t have arms.', zh: '它有头，但没有手臂。', hint: '描述身体部位' },
        { en: 'It has a tail. It has four legs. It can run.', zh: '它有尾巴，四条腿，会跑。', hint: '猜动物' },
        { en: 'I want a doll.', zh: '我想要一个玩偶。', hint: 'want = 想要' },
        { en: "Let's play a game!", zh: '我们玩游戏吧！', hint: '游戏口号' },
      ],
    },
    // ---- Lesson 11: United States of America（文化）----
    {
      id: 11,
      title: 'United States of America',
      titleZh: '美国（文化）',
      words: [
        { en: 'basketball', zh: '篮球', emoji: '🏀', ipa: '/ˈbɑːskɪtbɔːl/' },
        { en: 'hoop', zh: '篮筐', emoji: '🥅', ipa: '/huːp/' },
        { en: 'baseball', zh: '棒球', emoji: '⚾', ipa: '/ˈbeɪsbɔːl/' },
        { en: 'hockey', zh: '曲棍球', emoji: '🏑', ipa: '/ˈhɒki/' },
        { en: 'puck', zh: '冰球', emoji: '🥅', ipa: '/pʌk/' },
      ],
      sentences: [
        { en: "What's your favorite sport?", zh: '你最喜欢的运动是什么？', hint: 'favorite = 最喜欢的' },
        { en: 'What sport can you do?', zh: '你会做哪项运动？', hint: 'sport = 运动' },
        { en: 'In the USA, boys and girls play lots of sports.', zh: '在美国，男孩女孩们做很多运动。', hint: 'USA = 美国' },
        { en: 'My favorite sport is hockey.', zh: '我最喜欢的运动是曲棍球。', hint: '表达最爱运动' },
        { en: 'I can skate!', zh: '我会滑冰！', hint: 'skate = 滑冰' },
      ],
    },
  ],
}

// ============================================================================
// 2. 课本原文（按活动分章节，一句一活动，供点读/挖空）
// ============================================================================

export const u8_book: Record<string, LessonBook> = {
  '8-1': {
    title: 'Lola the Athlete Vocabulary',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: "Look, today Lola is an athlete.", textZh: '看，今天 Lola 是一名运动员。' },
        { text: 'She is playing with her friends.', textZh: '她在和朋友们一起玩。' },
        { text: 'Can you guess where they are?', textZh: '你能猜到他们在哪里吗？' },
      ] },
      { chapter: 'Read and spell.', chapterZh: '读一读，拼一拼。', pages: [
        { text: 'walk', textZh: '走路' },
        { text: 'The boy can walk. Can you walk?', textZh: '男孩会走路。你会走路吗？' },
        { text: 'climb', textZh: '爬' },
        { text: 'The boy can climb. Can you climb?', textZh: '男孩会爬。你会爬吗？' },
        { text: 'swing', textZh: '荡秋千' },
        { text: 'The girl can swing. Can you swing?', textZh: '女孩会荡秋千。你会吗？' },
        { text: 'swim', textZh: '游泳' },
        { text: 'The boy can swim. Can you swim?', textZh: '男孩会游泳。你会游泳吗？' },
        { text: 'fly', textZh: '飞' },
        { text: 'The bird can fly. Can you fly?', textZh: '小鸟会飞。你会飞吗？' },
      ] },
      { chapter: 'Say and do.', chapterZh: '说一说，做一做。', pages: [
        { text: 'walk', textZh: '走路' },
        { text: 'climb', textZh: '爬' },
        { text: 'swim', textZh: '游泳' },
        { text: 'swing', textZh: '荡秋千' },
        { text: 'fly', textZh: '飞' },
      ] },
    ],
  },
  '8-2': {
    title: 'Lola the Athlete Vocabulary and Practice',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'Look! Lola is coming!', textZh: '看！Lola 来了！' },
        { text: 'What can she do?', textZh: '她会做什么？' },
      ] },
      { chapter: 'Read and spell.', chapterZh: '读一读，拼一拼。', pages: [
        { text: 'run', textZh: '跑' },
        { text: 'She can run. Can you run?', textZh: '她会跑。你会跑吗？' },
        { text: 'jump', textZh: '跳' },
        { text: 'The boy can jump. Can you jump?', textZh: '男孩会跳。你会跳吗？' },
        { text: 'skip', textZh: '跳绳' },
        { text: 'The girl can skip. Can you skip?', textZh: '女孩会跳绳。你会吗？' },
        { text: 'hop', textZh: '单脚跳' },
        { text: 'The girl can hop. Can you hop?', textZh: '女孩会单脚跳。你会吗？' },
        { text: 'skate', textZh: '滑冰' },
        { text: 'The girl can skate. Can you skate?', textZh: '女孩会滑冰。你会吗？' },
      ] },
      { chapter: 'Listen and circle.', chapterZh: '听一听，圈一圈。', pages: [
        { text: 'Now hop to the right!', textZh: '现在向右单脚跳！' },
        { text: 'Walk one, two, three!', textZh: '走一、二、三！' },
        { text: 'Skate to the left and jump with me!', textZh: '向左滑并和我一起跳！' },
        { text: 'Keep fit! Keep fit!', textZh: '保持健康！保持健康！' },
      ] },
    ],
  },
  '8-3': {
    title: 'Lola the Athlete Reading',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'Look! A Gingerbread Man!', textZh: '看！一个姜饼人！' },
        { text: 'He can run! Let’s follow him!', textZh: '他会跑！我们跟着他！' },
      ] },
      { chapter: 'Read together.', chapterZh: '一起读。', pages: [
        { text: 'One day, an old man and an old woman make gingerbread.', textZh: '一天，老爷爷和老奶奶做姜饼。' },
        { text: 'I can jump! Yes, I can!', textZh: '我会跳！是的，我会！' },
        { text: "You can't catch me! I'm the Gingerbread Man!", textZh: '你抓不到我！我是姜饼人！' },
        { text: 'Oh no!', textZh: '哦不！' },
      ] },
      { chapter: 'The Gingerbread Man runs.', chapterZh: '姜饼人跑起来。', pages: [
        { text: 'Stop, Gingerbread Man! Stop!', textZh: '站住，姜饼人！站住！' },
        { text: 'The Gingerbread Man, the old man and the old woman run to the river.', textZh: '姜饼人、老爷爷和老奶奶跑到河边。' },
        { text: 'I can run! Yes, I can!', textZh: '我会跑！是的，我会！' },
      ] },
      { chapter: 'They skate to the tree.', chapterZh: '他们滑到树下。', pages: [
        { text: 'Then the Gingerbread Man, the old man and the old woman skate to the tree.', textZh: '然后姜饼人、老爷爷和老奶奶滑到树下。' },
        { text: 'I can skate! Yes, I can!', textZh: '我会滑冰！是的，我会！' },
        { text: "You can't catch me! I'm the Gingerbread Man.", textZh: '你抓不到我！我是姜饼人。' },
      ] },
    ],
  },
  '8-4': {
    title: 'Lola the Athlete Reading and Practice',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'What can the Gingerbread Man do?', textZh: '姜饼人会做什么？' },
        { text: 'The Gingerbread Man jumps off the table.', textZh: '姜饼人跳下了桌子。' },
      ] },
      { chapter: 'Read together.', chapterZh: '一起读。', pages: [
        { text: 'Then the Gingerbread Man, the old man and the old woman climb the tree.', textZh: '然后姜饼人、老爷爷和老奶奶爬上树。' },
        { text: 'I can climb! Yes, I can!', textZh: '我会爬！是的，我会！' },
        { text: "You can't catch me! I'm the Gingerbread Man.", textZh: '你抓不到我！我是姜饼人。' },
      ] },
      { chapter: 'The bird in the tree.', chapterZh: '树上的小鸟。', pages: [
        { text: 'Oh no! I can’t fly!', textZh: '哦不！我不会飞！' },
        { text: 'I can fly! Jump on my back!', textZh: '我会飞！跳到我的背上来！' },
        { text: 'But the bird wants to eat the Gingerbread Man.', textZh: '但是小鸟想吃掉姜饼人。' },
      ] },
      { chapter: 'Help!', chapterZh: '救命！', pages: [
        { text: 'I can jump! Yes, I can!', textZh: '我会跳！是的，我会！' },
        { text: "You CAN catch me! I'm the Gingerbread Man!", textZh: '你抓得到我了！我是姜饼人！' },
        { text: 'Come on! Let’s go home!', textZh: '来吧！我们回家吧！' },
      ] },
    ],
  },
  '8-5': {
    title: 'Lola the Athlete Language Focus',
    sections: [
      { chapter: 'Remember, circle, and say.', chapterZh: '记一记，圈一圈，说一说。', pages: [
        { text: 'skip', textZh: '跳绳' },
        { text: 'skate', textZh: '滑冰' },
        { text: 'hop', textZh: '单脚跳' },
        { text: 'walk', textZh: '走路' },
      ] },
      { chapter: 'Yes / No.', chapterZh: '会 / 不会。', pages: [
        { text: 'Yes, I can ...', textZh: '是的，我会……' },
        { text: "No, I can't ...", textZh: '不，我不会……' },
        { text: 'Can you ...?', textZh: '你会……吗？' },
      ] },
      { chapter: 'Grammar.', chapterZh: '语法。', pages: [
        { text: 'I can ( )', textZh: '我会（ ）' },
        { text: "I can't ( )", textZh: '我不会（ ）' },
        { text: 'hop. swing. skip. swim.', textZh: '单脚跳。荡秋千。跳绳。游泳。' },
      ] },
      { chapter: 'Look and say.', chapterZh: '看一看，说一说。', pages: [
        { text: 'I can run.', textZh: '我会跑。' },
        { text: 'I can hop.', textZh: '我会单脚跳。' },
        { text: "I can't skip.", textZh: '我不会跳绳。' },
        { text: 'The duck can swim.', textZh: '鸭子会游泳。' },
        { text: "My mom can't skate.", textZh: '妈妈不会滑冰。' },
        { text: 'The bird can fly.', textZh: '小鸟会飞。' },
      ] },
    ],
  },
  '8-6': {
    title: 'Lola the Athlete Language Focus and Practice',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'There are some photos from the Gingerbread Man.', textZh: '这里有一些姜饼人度假的照片。' },
        { text: 'Let’s see what he did on the vacation.', textZh: '我们看看他假期做了什么。' },
      ] },
      { chapter: 'Read and do.', chapterZh: '读一读，做一做。', pages: [
        { text: 'drive a car. Can you drive a car?', textZh: '开车。你会开车吗？' },
        { text: 'ride a bike. Can you ride a bike?', textZh: '骑自行车。你会骑自行车吗？' },
        { text: 'kick a ball. Can you kick a ball?', textZh: '踢球。你会踢球吗？' },
        { text: 'hit a ball. Can you hit a ball?', textZh: '击球。你会击球吗？' },
        { text: 'play a game. Can you play a game?', textZh: '玩游戏。你会玩游戏吗？' },
        { text: 'rollerblade. Can you rollerblade?', textZh: '轮滑。你会轮滑吗？' },
      ] },
      { chapter: 'Listen and circle.', chapterZh: '听一听，圈一圈。', pages: [
        { text: "Let's hit a ball!", textZh: '我们击球吧！' },
        { text: "Let's kick a ball!", textZh: '我们踢球吧！' },
        { text: "Let's play a game! Let's rollerblade!", textZh: '我们玩游戏吧！我们轮滑吧！' },
        { text: "Let's drive a car! Let's ride a bike!", textZh: '我们开车吧！我们骑自行车吧！' },
      ] },
      { chapter: 'Grammar.', chapterZh: '语法。', pages: [
        { text: "Let's", textZh: '让我们……' },
        { text: 'play a game.', textZh: '玩游戏。' },
        { text: 'kick a ball.', textZh: '踢球。' },
        { text: 'drive a car.', textZh: '开车。' },
      ] },
    ],
  },
  '8-7': {
    title: 'Lola the Athlete Phonics',
    sections: [
      { chapter: 'Say the sentences.', chapterZh: '说说这些句子。', pages: [
        { text: "Let's drive a car!", textZh: '我们开车吧！' },
        { text: "Let's ride a bike!", textZh: '我们骑自行车吧！' },
        { text: "Let's kick a ball!", textZh: '我们踢球吧！' },
        { text: "Let's hit a ball!", textZh: '我们击球吧！' },
        { text: "Let's play a game!", textZh: '我们玩游戏吧！' },
        { text: "Let's rollerblade!", textZh: '我们轮滑吧！' },
      ] },
      { chapter: 'Phonics: ar.', chapterZh: '拼读：ar。', pages: [
        { text: 'car', textZh: '汽车' },
        { text: 'guitar', textZh: '吉他' },
        { text: 'farm', textZh: '农场' },
      ] },
      { chapter: 'Chant Time.', chapterZh: 'Chant 时间。', pages: [
        { text: "Charlie the cow can't play the guitar.", textZh: '奶牛 Charlie 不会弹吉他。' },
        { text: 'He doesn’t have arms, but he can drive a car.', textZh: '他没有手臂，但会开车。' },
        { text: 'He can drive in the garden.', textZh: '他能在花园里开。' },
        { text: 'He can drive in the park.', textZh: '他能在公园里开。' },
        { text: 'He can drive at the farm.', textZh: '他能在农场开。' },
        { text: 'He can drive in the dark.', textZh: '他能在黑暗里开。' },
      ] },
      { chapter: 'Look and Read.', chapterZh: '看一看，读一读。', pages: [
        { text: 'car', textZh: '汽车' },
        { text: 'dark', textZh: '黑暗' },
        { text: 'guitar', textZh: '吉他' },
        { text: 'farm', textZh: '农场' },
        { text: 'garden', textZh: '花园' },
        { text: 'park', textZh: '公园' },
      ] },
      { chapter: 'More words.', chapterZh: '更多单词。', pages: [
        { text: 'card', textZh: '卡片' },
        { text: 'shark', textZh: '鲨鱼' },
        { text: 'star', textZh: '星星' },
        { text: 'jar', textZh: '罐子' },
        { text: 'scarf', textZh: '围巾' },
        { text: 'bark', textZh: '吠叫' },
      ] },
    ],
  },
  '8-8': {
    title: 'CLIL-P.E.',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: "It's P.E. class.", textZh: '现在是体育课。' },
        { text: 'I want to throw a ball!', textZh: '我想扔一个球！' },
        { text: "Let's throw a ball!", textZh: '我们扔球吧！' },
      ] },
      { chapter: 'Learn and read.', chapterZh: '学习并阅读。', pages: [
        { text: 'distance', textZh: '距离' },
        { text: 'centimeter = cm', textZh: '厘米 = cm' },
        { text: 'meter = m', textZh: '米 = m' },
        { text: '100 cm = 1 m', textZh: '100 厘米 = 1 米' },
      ] },
      { chapter: 'Read and answer.', chapterZh: '读一读，答一答。', pages: [
        { text: 'We measure distances in P.E. to show what we can do.', textZh: '体育课上我们测量距离，展示能做的事。' },
        { text: 'We can measure distances in meters (m) and centimeters (cm).', textZh: '我们用米（m）和厘米（cm）测量距离。' },
        { text: 'Dan can kick a ball 6 meters.', textZh: 'Dan 能把球踢出 6 米。' },
        { text: 'Sam can swim 10 meters.', textZh: 'Sam 能游 10 米。' },
        { text: 'Ben can jump 1 meter and 15 centimeters.', textZh: 'Ben 能跳 1 米 15 厘米。' },
      ] },
      { chapter: 'Look and say.', chapterZh: '看一看，说一说。', pages: [
        { text: 'This is my sister. She can kick a ball six meters.', textZh: '这是我的姐姐，她能把球踢出六米。' },
        { text: 'This is my brother. He can throw a ball seven meters.', textZh: '这是我的哥哥，他能扔出七米。' },
        { text: 'This is a rabbit. It can hop eighty centimeters.', textZh: '这是一只兔子，它能跳八十厘米。' },
      ] },
    ],
  },
  '8-9': {
    title: 'Practice',
    sections: [
      { chapter: 'Listen and read.', chapterZh: '听一听，读一读。', pages: [
        { text: "Charlie the cow can't play the guitar.", textZh: '奶牛 Charlie 不会弹吉他。' },
        { text: 'He doesn’t have arms, but he can drive a car.', textZh: '他没有手臂，但会开车。' },
        { text: 'He can drive in the garden.', textZh: '他能在花园里开。' },
        { text: 'He can drive in the park.', textZh: '他能在公园里开。' },
        { text: 'He can drive at the farm.', textZh: '他能在农场开。' },
        { text: 'He can drive in the dark.', textZh: '他能在黑暗里开。' },
      ] },
      { chapter: 'Match and say.', chapterZh: '连一连，说一说。', pages: [
        { text: 'garden', textZh: '花园' },
        { text: 'dark', textZh: '黑暗' },
        { text: 'park', textZh: '公园' },
        { text: 'farm', textZh: '农场' },
      ] },
      { chapter: 'Read, match and talk.', chapterZh: '读一读，连一连，说一说。', pages: [
        { text: "Let's swim.", textZh: '我们游泳吧。' },
        { text: "Let's climb.", textZh: '我们爬吧。' },
        { text: "Let's swing.", textZh: '我们荡秋千吧。' },
        { text: "Let's hop.", textZh: '我们单脚跳吧。' },
        { text: "Let's skate.", textZh: '我们滑冰吧。' },
        { text: "Let's skip.", textZh: '我们跳绳吧。' },
      ] },
      { chapter: 'Look and say.', chapterZh: '看一看，说一说。', pages: [
        { text: 'I can swing.', textZh: '我会荡秋千。' },
        { text: "I can't fly.", textZh: '我不会飞。' },
        { text: 'I can walk.', textZh: '我会走路。' },
        { text: "I can't swing.", textZh: '我不会荡秋千。' },
      ] },
    ],
  },
  '8-10': {
    title: 'Maze Run',
    sections: [
      { chapter: 'Match.', chapterZh: '配对。', pages: [
        { text: 'Nick', textZh: 'Nick' },
        { text: 'Alice', textZh: 'Alice' },
        { text: 'Ann', textZh: 'Ann' },
        { text: 'Tom', textZh: 'Tom' },
        { text: 'Ben', textZh: 'Ben' },
        { text: 'Eva', textZh: 'Eva' },
      ] },
      { chapter: 'Spell the Words.', chapterZh: '拼出单词。', pages: [
        { text: 'swing', textZh: '荡秋千' },
        { text: 'climb', textZh: '爬' },
        { text: 'piano', textZh: '钢琴' },
        { text: 'guitar', textZh: '吉他' },
        { text: 'computer', textZh: '电脑' },
      ] },
      { chapter: 'Read and Choose.', chapterZh: '读一读，选一选。', pages: [
        { text: 'It has a head, but it doesn’t have arms.', textZh: '它有头，但没有手臂。' },
        { text: 'It has a tail. It has four legs. It can run.', textZh: '它有尾巴，四条腿，会跑。' },
        { text: 'It doesn’t have arms or hands. It has two legs.', textZh: '它没有手臂和手，有两条腿。' },
        { text: 'It can fly. It doesn’t have legs or feet.', textZh: '它会飞，没有腿和脚。' },
      ] },
      { chapter: 'Brainstorming.', chapterZh: '头脑风暴。', pages: [
        { text: 'I want a ...', textZh: '我想要一个……' },
        { text: 'It has ...', textZh: '它有……' },
        { text: "It doesn't have ...", textZh: '它没有……' },
        { text: 'I / It can ...', textZh: '我／它会……' },
        { text: "I / It can't ...", textZh: '我／它不会……' },
        { text: "Let's ...", textZh: '我们……吧！' },
      ] },
    ],
  },
  '8-11': {
    title: 'United States of America',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: "What's your favorite sport?", textZh: '你最喜欢的运动是什么？' },
        { text: 'What sport can you do?', textZh: '你会做哪项运动？' },
      ] },
      { chapter: 'Learn the sports.', chapterZh: '认识运动。', pages: [
        { text: 'basketball / hoop', textZh: '篮球 / 篮筐' },
        { text: 'baseball / uniform', textZh: '棒球 / 队服' },
        { text: 'hockey / puck', textZh: '曲棍球 / 冰球' },
      ] },
      { chapter: 'Read and learn.', chapterZh: '读一读，学一学。', pages: [
        { text: 'In the USA, boys and girls play lots of sports.', textZh: '在美国，男孩女孩们做很多运动。' },
        { text: 'USA = United States of America', textZh: 'USA = 美利坚合众国' },
        { text: 'My favorite sport is hockey. I can skate!', textZh: '我最喜欢的运动是曲棍球。我会滑冰！' },
      ] },
    ],
  },
}

// ============================================================================
// 3. 句型框架卡（来自 Language Focus 课 5、6）
// ============================================================================

export const u8_frames: SentenceFrame[] = [
  {
    id: 'l1-lola-the-athlete-5-can',
    pattern: 'I can ___.',
    blanks: [
      {
        options: ['swing', 'skate', 'hop', 'skip', 'swim'],
        answer: 0,
        zhOptions: ['我会荡秋千。', '我会滑冰。', '我会单脚跳。', '我会跳绳。', '我会游泳。'],
      },
    ],
    zh: '我会荡秋千。',
    hint: 'I can + 动词 = 我会……',
    unitSlug: 'lola-the-athlete',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-athlete-5-cant',
    pattern: "I can't ___.",
    blanks: [
      {
        options: ['skip', 'swim', 'hop', 'skate'],
        answer: 0,
        zhOptions: ['我不会跳绳。', '我不会游泳。', '我不会单脚跳。', '我不会滑冰。'],
      },
    ],
    zh: '我不会跳绳。',
    hint: 'can’t = 不能 / 不会',
    unitSlug: 'lola-the-athlete',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-athlete-5-can-you',
    pattern: 'Can you ___?',
    blanks: [
      {
        options: ['walk', 'swim', 'climb'],
        answer: 0,
        zhOptions: ['你会走路吗？', '你会游泳吗？', '你会爬吗？'],
      },
    ],
    zh: '你会走路吗？',
    hint: 'Can you + 动词 = 你会……吗？',
    unitSlug: 'lola-the-athlete',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-athlete-6-can-you',
    pattern: 'Can you ___?',
    blanks: [
      {
        options: ['drive a car', 'ride a bike', 'kick a ball', 'hit a ball', 'play a game'],
        answer: 0,
        zhOptions: ['你会开车吗？', '你会骑自行车吗？', '你会踢球吗？', '你会击球吗？', '你会玩游戏吗？'],
      },
    ],
    zh: '你会开车吗？',
    hint: 'Can you + 动宾短语',
    unitSlug: 'lola-the-athlete',
    lessonId: 6,
  },
  {
    id: 'l1-lola-the-athlete-6-lets',
    pattern: "Let's ___!",
    blanks: [
      {
        options: ['play a game', 'rollerblade', 'drive a car', 'kick a ball', 'ride a bike'],
        answer: 0,
        zhOptions: ['我们玩游戏吧！', '我们轮滑吧！', '我们开车吧！', '我们踢球吧！', '我们骑自行车吧！'],
      },
    ],
    zh: '我们玩游戏吧！',
    hint: 'Let’s = 让我们……吧',
    unitSlug: 'lola-the-athlete',
    lessonId: 6,
  },
]

// ============================================================================
// 4. 阅读短文（连贯小故事，供自主阅读）
// ============================================================================

export const u8_reading: Record<string, ReadingPassage> = {
  '8-3': {
    title: 'The Gingerbread Man',
    titleZh: '姜饼人',
    paragraphs: [
      [
        { en: 'One day, an old man and an old woman make gingerbread.', zh: '一天，一位老爷爷和一位老奶奶做了姜饼。' },
        { en: 'Now the Gingerbread Man is ready. He can run!', zh: '现在姜饼人做好了，他会跑！' },
        { en: 'He can jump off the table. You can’t catch me!', zh: '他能跳下桌子。你抓不到我！' },
      ],
      [
        { en: 'I can run! Yes, I can! I am the Gingerbread Man.', zh: '我会跑！是的，我会！我是姜饼人。' },
        { en: 'The old man and the old woman run to the river.', zh: '老爷爷和老奶奶跑到河边。' },
        { en: 'Stop, Gingerbread Man! Stop!', zh: '站住，姜饼人！站住！' },
      ],
      [
        { en: 'Then they skate to the tree. I can skate! Yes, I can!', zh: '然后他们滑到树下。我会滑冰！是的，我会！' },
        { en: "You can't catch me! I am the Gingerbread Man.", zh: '你抓不到我！我是姜饼人。' },
      ],
    ],
  },
  '8-4': {
    title: 'The Gingerbread Man and the Bird',
    titleZh: '姜饼人和小鸟',
    paragraphs: [
      [
        { en: 'Then the Gingerbread Man climbs the tree.', zh: '然后姜饼人爬上了树。' },
        { en: 'A bird is in the tree, too. I can fly! says the bird.', zh: '一只小鸟也在树上。小鸟说：我会飞！' },
      ],
      [
        { en: 'Oh no! I can’t fly! says the Gingerbread Man.', zh: '哦不！我不会飞！姜饼人说。' },
        { en: 'Jump on my back! says the bird.', zh: '跳到我的背上来！小鸟说。' },
      ],
      [
        { en: 'But the bird wants to eat the Gingerbread Man.', zh: '但是小鸟想吃掉姜饼人。' },
        { en: 'Help! The Gingerbread Man jumps. I can jump!', zh: '救命！姜饼人跳了起来。我会跳！' },
      ],
    ],
  },
  '8-11': {
    title: 'Sports in the USA',
    titleZh: '美国的运动',
    paragraphs: [
      [
        { en: 'In the USA, boys and girls play lots of sports.', zh: '在美国，男孩女孩们做很多运动。' },
        { en: 'My favorite sport is basketball. I can shoot a hoop!', zh: '我最喜欢的运动是篮球。我能投进篮筐！' },
      ],
      [
        { en: 'Tom likes baseball. He has a uniform.', zh: 'Tom 喜欢棒球，他有一套队服。' },
        { en: 'Ann likes hockey. She can hit a puck!', zh: 'Ann 喜欢曲棍球，她能击冰球！' },
      ],
    ],
  },
}

// ============================================================================
// 5. 拓展词主题（NEW 主题：sports / p-e / usa / athletics）
// ============================================================================

export const u8_ext: Record<string, ExtTopic> = {
  sports: {
    zh: '运动项目',
    words: [
      w('basketball', '篮球', '🏀'), w('football', '足球', '⚽'), w('baseball', '棒球', '⚾'),
      w('hockey', '曲棍球', '🏑'), w('tennis', '网球', '🎾'), w('volleyball', '排球', '🏐'),
      w('swimming', '游泳', '🏊'),
    ],
  },
  'p-e': {
    zh: '体育锻炼',
    words: [
      w('run', '跑', '🏃'), w('jump', '跳', '🦘'), w('skip', '跳绳', '🪢'),
      w('hop', '单脚跳', '🐰'), w('climb', '爬', '🧗'), w('skate', '滑冰', '⛸️'),
      w('swing', '荡秋千', '🎡'),
    ],
  },
  usa: {
    zh: '美国文化',
    words: [
      w('USA', '美国', '🇺🇸'), w('flag', '国旗', '🚩'), w('basketball', '篮球', '🏀'),
      w('baseball', '棒球', '⚾'), w('hockey', '曲棍球', '🏑'), w('football', '橄榄球', '🏈'),
      w('uniform', '队服', '👕'),
    ],
  },
  athletics: {
    zh: '田径运动',
    words: [
      w('race', '赛跑', '🏁'), w('throw', '投掷', '🤾'), w('jump', '跳', '🦘'),
      w('medal', '奖牌', '🏅'), w('run', '跑', '🏃'), w('coach', '教练', '🧑‍🏫'),
      w('stadium', '体育场', '🏟️'),
    ],
  },
}

// ============================================================================
// 6. 单元模块（预览 + 测验）
// ============================================================================

export const u8_module: Module = {
  id: 8,
  slug: 'lola-the-athlete',
  title: 'Lola the Athlete',
  titleZh: '罗拉运动员',
  emoji: '🏃',
  color: '#F5B017',
  colorSoft: '#FFF3C4',
  preview: {
    goals: [
      '学会用 can / can’t 表达能或不能与动作动词（跑、跳、爬、游泳、飞等）搭配',
      '认识并拼写本单元动作词：walk, run, jump, climb, swim, fly, skate, skip, hop, swing',
      '读懂「姜饼人」英文小故事，体会 I can... / You can’t catch me!',
      '学习 Phonics ar 发音：car, guitar, farm, park, dark',
      '了解美国常见运动（basketball, baseball, hockey）并说 My favorite sport is...',
    ],
    keyWords: 'walk, run, jump, climb, swim, fly, skate, skip, hop, swing, drive a car, ride a bike, kick a ball',
    keySentences: "I can run. I can't fly. Can you swim? Let's play a game! What's your favorite sport?",
    tip: '预习时边做动作边说英语（run / jump / climb…）；读「姜饼人」故事时模仿 "You can’t catch me!" 的语气；学 ar 发音时找出家里含 ar 的单词。',
  },
  lessons: u8_lessons[8],
  quiz: [
    { q: '姜饼人常说哪句话？🍪', options: ["You can't catch me!", "I can't run.", "I'm a bird."], answer: 0, explain: '姜饼人自信地喊 "You can’t catch me!"（你抓不到我！）。' },
    { q: '哪个词表示「游泳」？🏊', options: ['swim', 'run', 'climb'], answer: 0, explain: 'swim 是游泳。' },
    { q: '想问对方「你会滑冰吗？」，应该说？⛸️', options: ['Can you skate?', "I can skate.", "Let's skate."], answer: 0, explain: '用 Can you + 动词 提问，skate 是滑冰。' },
    { q: 'Phonics 单元里，含 ar 发音的单词是？🚗', options: ['car', 'cat', 'pen'], answer: 0, explain: 'car（汽车）含 ar 发音 /ɑː/；cat、pen 没有。' },
    { q: '在美国，孩子们喜欢的运动中哪个是 basketball？🏀', options: ['basketball', 'baseball', 'hockey'], answer: 0, explain: 'basketball 是篮球；baseball 棒球；hockey 曲棍球。' },
  ],
}
