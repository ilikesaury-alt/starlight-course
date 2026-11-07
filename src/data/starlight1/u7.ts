// Starlight 1 · Level 1 · Unit 7「Monty the Magician」课程数据
// 数据来源：src/data/starlight1/raw/unit7.json（教材 PDF 文本）
// 结构对齐 Unit 1 试点（lessons.ts / book.ts / sentenceFrames.ts / reading.ts / extensions.ts / index.ts）。
// 仅从 raw/unit7.json 抽取，未引入其它单元内容；扩展主题用了全新键（magic / performance / costume / math）。

import type { Lesson, LessonBook, SentenceFrame, ReadingPassage, Module, ExtTopic } from './shared'
import { w } from './shared'

export const u7_lessons: Record<number, Lesson[]> = {
  // === Unit 7: Monty the Magician（9 课） ===
  7: [
    {
      id: 1,
      title: 'Monty the Magician Vocabulary',
      titleZh: '蒙蒂魔术师·词汇',
      words: [
        { en: 'ball', zh: '球', emoji: '⚽', ipa: '/bɔːl/' },
        { en: 'doll', zh: '洋娃娃', emoji: '🪆', ipa: '/dɒl/' },
        { en: 'plane', zh: '飞机', emoji: '✈️', ipa: '/pleɪn/' },
        { en: 'kite', zh: '风筝', emoji: '🪁', ipa: '/kaɪt/' },
        { en: 'basketball', zh: '篮球', emoji: '🏀', ipa: '/ˈbɑːskɪtbɔːl/' },
      ],
      sentences: [
        { en: 'Where can you see a plane?', zh: '你在哪里能看到飞机？', hint: '问飞机出现在哪里' },
        { en: 'The plane can fly.', zh: '飞机能飞。', hint: '描述飞机的能力' },
        { en: 'The kite can fly.', zh: '风筝能飞。', hint: '描述风筝的能力' },
        { en: 'What else can fly?', zh: '还有什么能飞？', hint: '发散思考会飞的东西' },
        { en: "Let's watch a video.", zh: '我们看一段视频吧。', hint: '课堂热身用语' },
      ],
    },
    {
      id: 2,
      title: 'Vocabulary and Practice',
      titleZh: '词汇与练习',
      words: [
        { en: 'robot', zh: '机器人', emoji: '🤖', ipa: '/ˈrəʊbɒt/' },
        { en: 'puppet', zh: '木偶', emoji: '🎎', ipa: '/ˈpʌpɪt/' },
        { en: 'guitar', zh: '吉他', emoji: '🎸', ipa: '/ɡɪˈtɑː/' },
        { en: 'piano', zh: '钢琴', emoji: '🎹', ipa: '/piˈænəʊ/' },
        { en: 'dinosaur', zh: '恐龙', emoji: '🦕', ipa: '/ˈdaɪnəsɔː/' },
      ],
      sentences: [
        { en: 'This is a robot.', zh: '这是一个机器人。', hint: '介绍机器人' },
        { en: 'Dance like a robot.', zh: '像机器人一样跳舞。', hint: '模仿机器人做动作' },
        { en: 'T-Rex is a dinosaur.', zh: '霸王龙是一种恐龙。', hint: '认识恐龙种类' },
        { en: 'Triceratops is a dinosaur.', zh: '三角龙是一种恐龙。', hint: '认识恐龙种类' },
        { en: 'Listen, say and do.', zh: '听一听，说一说，做一做。', hint: '课堂活动用语' },
      ],
    },
    {
      id: 3,
      title: 'Reading',
      titleZh: '阅读',
      words: [
        { en: 'magic', zh: '魔法', emoji: '✨', ipa: '/ˈmædʒɪk/' },
        { en: 'magician', zh: '魔术师', emoji: '🎩', ipa: '/məˈdʒɪʃn/' },
        { en: 'hat', zh: '帽子', emoji: '🎩', ipa: '/hæt/' },
        { en: 'wand', zh: '魔法棒', emoji: '🪄', ipa: '/wɒnd/' },
        { en: 'frog', zh: '青蛙', emoji: '🐸', ipa: '/frɒɡ/' },
      ],
      sentences: [
        { en: 'Abracadabra!', zh: '变！（魔法咒语）', hint: '魔术师念的咒语' },
        { en: 'What do you want, Paul?', zh: '保罗，你想要什么？', hint: '魔术师问小朋友想要什么' },
        { en: 'I want a ball, please.', zh: '我想要一个球，谢谢。', hint: '礼貌地表达愿望' },
        { en: "She's a magician.", zh: '她是一位魔术师。', hint: '介绍人物身份' },
        { en: 'I have a ball in my hat!', zh: '我的帽子里有一个球！', hint: '变出的神奇物品' },
        { en: 'Oh! Thank you very much!', zh: '哦！非常感谢你！', hint: '收到礼物道谢' },
      ],
    },
    {
      id: 4,
      title: 'Reading and Practice',
      titleZh: '阅读与练习',
      words: [
        { en: 'broken', zh: '坏的', emoji: '💔', ipa: '/ˈbrəʊkən/' },
        { en: 'glue', zh: '胶水', emoji: '🧴', ipa: '/ɡluː/' },
        { en: 'dinosaur', zh: '恐龙', emoji: '🦕', ipa: '/ˈdaɪnəsɔː/' },
        { en: 'fix', zh: '修理', emoji: '🔧', ipa: '/fɪks/' },
        { en: 'plane', zh: '飞机', emoji: '✈️', ipa: '/pleɪn/' },
      ],
      sentences: [
        { en: 'My plane is broken.', zh: '我的飞机坏了。', hint: '说物品坏了' },
        { en: 'I use glue to fix my plane.', zh: '我用胶水来修我的飞机。', hint: '用胶水修理' },
        { en: 'Put your dinosaur in my hat!', zh: '把你的恐龙放进我的帽子里！', hint: '魔法师让物品进帽子' },
        { en: 'My dinosaur is broken.', zh: '我的恐龙坏了。', hint: '说恐龙坏了' },
        { en: "That's magic!", zh: '真是魔法！', hint: '惊叹魔法' },
        { en: 'Thank you, Magic Mo!', zh: '谢谢你，魔法莫！', hint: '向魔术师道谢' },
      ],
    },
    {
      id: 5,
      title: 'Language Focus',
      titleZh: '语言焦点',
      words: [
        { en: 'ball', zh: '球', emoji: '⚽', ipa: '/bɔːl/' },
        { en: 'doll', zh: '洋娃娃', emoji: '🪆', ipa: '/dɒl/' },
        { en: 'plane', zh: '飞机', emoji: '✈️', ipa: '/pleɪn/' },
        { en: 'robot', zh: '机器人', emoji: '🤖', ipa: '/ˈrəʊbɒt/' },
        { en: 'dinosaur', zh: '恐龙', emoji: '🦕', ipa: '/ˈdaɪnəsɔː/' },
      ],
      sentences: [
        { en: 'I want a ball.', zh: '我想要一个球。', hint: '表达想要某物' },
        { en: 'I want a doll.', zh: '我想要一个洋娃娃。', hint: '表达想要某物' },
        { en: 'I want a plane.', zh: '我想要一架飞机。', hint: '表达想要某物' },
        { en: 'I want a robot.', zh: '我想要一个机器人。', hint: '表达想要某物' },
        { en: 'I want a big dinosaur.', zh: '我想要一只大恐龙。', hint: '加上形容词描述' },
        { en: 'I want grapes.', zh: '我想要葡萄。', hint: '表达想要食物' },
      ],
    },
    {
      id: 6,
      title: 'Language Focus and Practice',
      titleZh: '语言焦点与练习',
      words: [
        { en: 'head', zh: '头', emoji: '🤕', ipa: '/hed/' },
        { en: 'body', zh: '身体', emoji: '🧍', ipa: '/ˈbɒdi/' },
        { en: 'arms', zh: '胳膊', emoji: '💪', ipa: '/ɑːmz/' },
        { en: 'legs', zh: '腿', emoji: '🦵', ipa: '/leɡz/' },
        { en: 'tail', zh: '尾巴', emoji: '🦎', ipa: '/teɪl/' },
      ],
      sentences: [
        { en: 'It has a head.', zh: '它有一个头。', hint: '描述身体部位' },
        { en: 'It has two arms.', zh: '它有两条胳膊。', hint: '用复数描述' },
        { en: 'It has a tail.', zh: '它有一条尾巴。', hint: '描述尾巴' },
        { en: "It doesn't have a tail.", zh: '它没有尾巴。', hint: '否定句：没有某部位' },
        { en: 'Does it have a head?', zh: '它有头吗？', hint: '询问是否有某部位' },
        { en: 'It has a long body.', zh: '它有一个长长的身体。', hint: '加形容词描述' },
      ],
    },
    {
      id: 7,
      title: 'Phonics',
      titleZh: '自然拼读',
      words: [
        { en: 'doll', zh: '洋娃娃', emoji: '🪆', ipa: '/dɒl/' },
        { en: 'hand', zh: '手', emoji: '✋', ipa: '/hænd/' },
        { en: 'head', zh: '头', emoji: '🤕', ipa: '/hed/' },
        { en: 'red', zh: '红色', emoji: '🔴', ipa: '/red/' },
        { en: 'dinosaur', zh: '恐龙', emoji: '🦕', ipa: '/ˈdaɪnəsɔː/' },
      ],
      sentences: [
        { en: 'Do you know how to say it?', zh: '你知道怎么读它吗？', hint: '自然拼读提问' },
        { en: 'Can you think of any words with the d sound?', zh: '你能想到含有 d 发音的单词吗？', hint: '联想 d 音单词' },
        { en: 'This is my head.', zh: '这是我的头。', hint: 'chant 里的句子' },
        { en: 'My legs are red.', zh: '我的腿是红色的。', hint: 'chant 里的句子' },
        { en: "I'm a dinosaur.", zh: '我是一只恐龙。', hint: 'chant 里的句子' },
        { en: 'Circle the words with the d sound.', zh: '圈出含有 d 发音的单词。', hint: '拼读活动指令' },
      ],
    },
    {
      id: 8,
      title: 'CLIL-Math',
      titleZh: '学科融合·数学',
      words: [
        { en: 'symmetrical', zh: '对称的', emoji: '🔁', ipa: '/sɪˈmetrɪkl/' },
        { en: 'line of symmetry', zh: '对称轴', emoji: '➖', ipa: '/laɪn əv ˈsɪmətri/' },
        { en: 'robot', zh: '机器人', emoji: '🤖', ipa: '/ˈrəʊbɒt/' },
        { en: 'plane', zh: '飞机', emoji: '✈️', ipa: '/pleɪn/' },
        { en: 'ball', zh: '球', emoji: '⚽', ipa: '/bɔːl/' },
      ],
      sentences: [
        { en: "Yes, it's a robot.", zh: '是的，它是一个机器人。', hint: '揭晓猜出的物品' },
        { en: 'Are part one and part two the same?', zh: '第一部分和第二部分一样吗？', hint: '问是否对称' },
        { en: 'It is symmetrical.', zh: '它是对称的。', hint: '对称的说法' },
        { en: 'It has a line of symmetry.', zh: '它有一条对称轴。', hint: '描述对称轴' },
        { en: 'It is not symmetrical.', zh: '它不是对称的。', hint: '不对称的说法' },
      ],
    },
    {
      id: 9,
      title: 'Practice',
      titleZh: '综合练习',
      words: [
        { en: 'dinosaur', zh: '恐龙', emoji: '🦕', ipa: '/ˈdaɪnəsɔː/' },
        { en: 'head', zh: '头', emoji: '🤕', ipa: '/hed/' },
        { en: 'arms', zh: '胳膊', emoji: '💪', ipa: '/ɑːmz/' },
        { en: 'legs', zh: '腿', emoji: '🦵', ipa: '/leɡz/' },
        { en: 'tail', zh: '尾巴', emoji: '🦎', ipa: '/teɪl/' },
      ],
      sentences: [
        { en: 'I want the doll.', zh: '我想要那个洋娃娃。', hint: '复习 I want 句型' },
        { en: 'It has long hair.', zh: '它有长长的头发。', hint: '复习 It has 句型' },
        { en: "It doesn't have a tail.", zh: '它没有尾巴。', hint: '复习否定句' },
        { en: 'It is not symmetrical.', zh: '它不是对称的。', hint: '复习对称' },
        { en: 'It has two big eyes.', zh: '它有两只大眼睛。', hint: '复习身体描述' },
        { en: 'This is my head.', zh: '这是我的头。', hint: '复习身体部位' },
      ],
    },
  ],
}

export const u7_book: Record<string, LessonBook> = {
  '7-1': {
    title: 'Monty the Magician Vocabulary',
    sections: [
      { chapter: 'Focus on: toys that can fly.', chapterZh: '重点词汇：玩具与会飞的东西。', pages: [
        { text: 'ball', textZh: '球' },
        { text: 'doll', textZh: '洋娃娃' },
        { text: 'plane', textZh: '飞机' },
        { text: 'kite', textZh: '风筝' },
        { text: 'basketball', textZh: '篮球' },
        { text: 'football', textZh: '足球' },
      ] },
      { chapter: 'Where can you see a plane?', chapterZh: '你在哪里能看到飞机？', pages: [
        { text: 'in the sky', textZh: '在天上' },
        { text: 'at the airport', textZh: '在机场' },
      ] },
      { chapter: 'Things that can fly.', chapterZh: '会飞的东西。', pages: [
        { text: 'The plane can fly.', textZh: '飞机能飞。' },
        { text: 'The kite can fly.', textZh: '风筝能飞。' },
        { text: 'What else can fly?', textZh: '还有什么能飞？' },
      ] },
    ],
  },
  '7-2': {
    title: 'Vocabulary and Practice',
    sections: [
      { chapter: 'Focus on: toys and instruments.', chapterZh: '重点词汇：玩具与乐器。', pages: [
        { text: 'robot', textZh: '机器人' },
        { text: 'puppet', textZh: '木偶' },
        { text: 'guitar', textZh: '吉他' },
        { text: 'piano', textZh: '钢琴' },
        { text: 'dinosaur', textZh: '恐龙' },
      ] },
      { chapter: 'Dance like a robot.', chapterZh: '像机器人一样跳舞。', pages: [
        { text: 'Dance like a robot.', textZh: '像机器人一样跳舞。' },
        { text: 'Listen, say and do.', textZh: '听一听，说一说，做一做。' },
      ] },
      { chapter: 'Learn about dinosaurs.', chapterZh: '认识恐龙。', pages: [
        { text: 'T-Rex', textZh: '霸王龙' },
        { text: 'triceratops', textZh: '三角龙' },
        { text: 'pterosaur', textZh: '翼龙' },
      ] },
    ],
  },
  '7-3': {
    title: 'Reading',
    sections: [
      { chapter: 'Story Time: Magic Mo.', chapterZh: '故事时间：魔法莫。', pages: [
        { text: 'Abracadabra!', textZh: '变！（魔法咒语）' },
        { text: "This is Magic Mo. She's a magician.", textZh: '这是魔法莫。她是一位魔术师。' },
        { text: 'What do you want, Paul?', textZh: '保罗，你想要什么？' },
        { text: 'I want a ball, please.', textZh: '我想要一个球，谢谢。' },
      ] },
      { chapter: 'Magic Mo makes magic.', chapterZh: '魔法莫变魔术。', pages: [
        { text: 'Green frog! Black bat!', textZh: '绿色的青蛙！黑色的蝙蝠！' },
        { text: 'I have a ball in my hat!', textZh: '我的帽子里有一个球！' },
        { text: 'Oh! Thank you very much!', textZh: '哦！非常感谢你！' },
      ] },
      { chapter: 'The twins, Sol and Jane.', chapterZh: '双胞胎索尔和简。', pages: [
        { text: 'I want a plane, please.', textZh: '我想要一架飞机，谢谢。' },
        { text: 'I want a doll, please.', textZh: '我想要一个洋娃娃，谢谢。' },
      ] },
    ],
  },
  '7-4': {
    title: 'Reading and Practice',
    sections: [
      { chapter: 'New words.', chapterZh: '新词汇。', pages: [
        { text: 'broken', textZh: '坏的' },
        { text: 'glue', textZh: '胶水' },
        { text: 'put in', textZh: '放进去' },
        { text: 'take out', textZh: '拿出来' },
      ] },
      { chapter: "Story Time: Lou's dinosaur.", chapterZh: '故事时间：卢的恐龙。', pages: [
        { text: 'My dinosaur is broken.', textZh: '我的恐龙坏了。' },
        { text: 'I want glue, please.', textZh: '我想要胶水，谢谢。' },
        { text: 'Put your dinosaur in my hat!', textZh: '把你的恐龙放进我的帽子里！' },
        { text: "That's magic!", textZh: '真是魔法！' },
      ] },
    ],
  },
  '7-5': {
    title: 'Language Focus',
    sections: [
      { chapter: 'Grammar: I want...', chapterZh: '语法：我想要……', pages: [
        { text: 'I want a ball.', textZh: '我想要一个球。' },
        { text: 'I want a doll.', textZh: '我想要一个洋娃娃。' },
        { text: 'I want a plane.', textZh: '我想要一架飞机。' },
        { text: 'I want a kite.', textZh: '我想要一个风筝。' },
        { text: 'I want a guitar.', textZh: '我想要一把吉他。' },
        { text: 'I want a piano.', textZh: '我想要一架钢琴。' },
        { text: 'I want a robot.', textZh: '我想要一个机器人。' },
      ] },
    ],
  },
  '7-6': {
    title: 'Language Focus and Practice',
    sections: [
      { chapter: 'Focus on: body parts.', chapterZh: '重点词汇：身体部位。', pages: [
        { text: 'head', textZh: '头' },
        { text: 'body', textZh: '身体' },
        { text: 'arms', textZh: '胳膊' },
        { text: 'hands', textZh: '手' },
        { text: 'legs', textZh: '腿' },
        { text: 'tail', textZh: '尾巴' },
      ] },
      { chapter: "Grammar: It has / doesn't have...", chapterZh: '语法：它有／没有……', pages: [
        { text: 'It has a head.', textZh: '它有一个头。' },
        { text: 'It has arms.', textZh: '它有胳膊。' },
        { text: "It doesn't have a tail.", textZh: '它没有尾巴。' },
        { text: 'Does it have a head?', textZh: '它有头吗？' },
      ] },
    ],
  },
  '7-7': {
    title: 'Phonics',
    sections: [
      { chapter: 'Phonics: the d sound.', chapterZh: '自然拼读：d 的发音。', pages: [
        { text: 'doll', textZh: '洋娃娃' },
        { text: 'hand', textZh: '手' },
        { text: 'head', textZh: '头' },
        { text: 'red', textZh: '红色' },
        { text: 'sand', textZh: '沙子' },
        { text: 'bird', textZh: '鸟' },
      ] },
      { chapter: 'Words with the d sound.', chapterZh: '含有 d 发音的单词。', pages: [
        { text: 'dinosaur', textZh: '恐龙' },
        { text: 'puppet', textZh: '木偶' },
        { text: 'rabbit', textZh: '兔子' },
        { text: 'read', textZh: '读' },
      ] },
    ],
  },
  '7-8': {
    title: 'CLIL-Math',
    sections: [
      { chapter: 'Focus on: symmetry.', chapterZh: '重点词汇：对称。', pages: [
        { text: 'symmetrical', textZh: '对称的' },
        { text: 'line of symmetry', textZh: '对称轴' },
        { text: 'not symmetrical', textZh: '不对称的' },
      ] },
      { chapter: 'Look at the shapes.', chapterZh: '观察形状。', pages: [
        { text: 'Are part one and part two the same?', textZh: '第一部分和第二部分一样吗？' },
        { text: 'It is symmetrical.', textZh: '它是对称的。' },
        { text: 'It has a line of symmetry.', textZh: '它有一条对称轴。' },
        { text: 'It is not symmetrical.', textZh: '它不是对称的。' },
      ] },
    ],
  },
  '7-9': {
    title: 'Practice',
    sections: [
      { chapter: 'Review: the d sound chant.', chapterZh: '复习：d 发音 chant。', pages: [
        { text: "I'm a dinosaur. This is my head.", textZh: '我是一只恐龙。这是我的头。' },
        { text: 'My body is green. My legs are red.', textZh: '我的身体是绿色的。我的腿是红色的。' },
      ] },
      { chapter: 'Describe the monster.', chapterZh: '描述小怪物。', pages: [
        { text: 'It has two big eyes.', textZh: '它有两只大眼睛。' },
        { text: "It doesn't have a tail.", textZh: '它没有尾巴。' },
        { text: 'It is not symmetrical.', textZh: '它不是对称的。' },
      ] },
    ],
  },
}

export const u7_frames: SentenceFrame[] = [
  {
    id: 'l1-monty-the-magician-1-can-fly',
    pattern: 'The ___ can fly.',
    blanks: [
      {
        options: ['plane', 'kite', 'ball', 'doll'],
        answer: 0,
        zhOptions: ['飞机能飞。', '风筝能飞。', '球能飞。', '洋娃娃能飞。'],
      },
    ],
    zh: '飞机能飞。',
    hint: '说说哪样东西会飞',
    unitSlug: 'monty-the-magician',
    lessonId: 1,
  },
  {
    id: 'l1-monty-the-magician-2-this',
    pattern: 'This is a ___.',
    blanks: [
      {
        options: ['robot', 'puppet', 'guitar', 'piano', 'dinosaur'],
        answer: 0,
        zhOptions: ['这是一个机器人。', '这是一个木偶。', '这是一把吉他。', '这是一架钢琴。', '这是一只恐龙。'],
      },
    ],
    zh: '这是一个机器人。',
    hint: '介绍一个新玩具或乐器',
    unitSlug: 'monty-the-magician',
    lessonId: 2,
  },
  {
    id: 'l1-monty-the-magician-3-want-please',
    pattern: 'I want a ___, please.',
    blanks: [
      {
        options: ['ball', 'doll', 'plane', 'robot'],
        answer: 0,
        zhOptions: ['我想要一个球，谢谢。', '我想要一个洋娃娃，谢谢。', '我想要一架飞机，谢谢。', '我想要一个机器人，谢谢。'],
      },
    ],
    zh: '我想要一个球，谢谢。',
    hint: '礼貌地说出想要的玩具（故事里 Paul 这样说）',
    unitSlug: 'monty-the-magician',
    lessonId: 3,
  },
  {
    id: 'l1-monty-the-magician-4-broken',
    pattern: 'My ___ is broken.',
    blanks: [
      {
        options: ['plane', 'dinosaur', 'ball', 'kite'],
        answer: 0,
        zhOptions: ['我的飞机坏了。', '我的恐龙坏了。', '我的球坏了。', '我的风筝坏了。'],
      },
    ],
    zh: '我的飞机坏了。',
    hint: '说说哪个玩具坏了',
    unitSlug: 'monty-the-magician',
    lessonId: 4,
  },
  {
    id: 'l1-monty-the-magician-5-want',
    pattern: 'I want a ___.',
    blanks: [
      {
        options: ['ball', 'doll', 'plane', 'robot', 'dinosaur'],
        answer: 0,
        zhOptions: ['我想要一个球。', '我想要一个洋娃娃。', '我想要一架飞机。', '我想要一个机器人。', '我想要一只恐龙。'],
      },
    ],
    zh: '我想要一个球。',
    hint: '表达想要某样东西',
    unitSlug: 'monty-the-magician',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-magician-5-please',
    pattern: 'I want a ___ dinosaur.',
    blanks: [
      {
        options: ['big', 'red', 'broken'],
        answer: 0,
        zhOptions: ['我想要一只大恐龙。', '我想要一只红色的恐龙。', '我想要一只坏掉的恐龙。'],
      },
    ],
    zh: '我想要一只大恐龙。',
    hint: '加个形容词，说说想要什么样的恐龙',
    unitSlug: 'monty-the-magician',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-magician-6-has',
    pattern: 'It has a ___.',
    blanks: [
      {
        options: ['head', 'body', 'tail', 'nose'],
        answer: 0,
        zhOptions: ['它有一个头。', '它有一个身体。', '它有一条尾巴。', '它有一个鼻子。'],
      },
    ],
    zh: '它有一个头。',
    hint: '描述身体部位（肯定句）',
    unitSlug: 'monty-the-magician',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-magician-6-has-two',
    pattern: 'It has two ___.',
    blanks: [
      {
        options: ['arms', 'legs', 'eyes', 'hands'],
        answer: 0,
        zhOptions: ['它有两条胳膊。', '它有两条腿。', '它有两只眼睛。', '它有两只手。'],
      },
    ],
    zh: '它有两条胳膊。',
    hint: '用复数描述身体部位',
    unitSlug: 'monty-the-magician',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-magician-6-no-have',
    pattern: "It doesn't have a ___.",
    blanks: [
      {
        options: ['tail', 'head', 'body', 'nose'],
        answer: 0,
        zhOptions: ['它没有尾巴。', '它没有头。', '它没有身体。', '它没有鼻子。'],
      },
    ],
    zh: '它没有尾巴。',
    hint: '否定句：没有某部位',
    unitSlug: 'monty-the-magician',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-magician-7-my-head',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['head', 'hand', 'doll', 'dinosaur'],
        answer: 0,
        zhOptions: ['这是我的头。', '这是我的手。', '这是我的洋娃娃。', '这是我的恐龙。'],
      },
    ],
    zh: '这是我的头。',
    hint: 'chant 里介绍自己的身体部位',
    unitSlug: 'monty-the-magician',
    lessonId: 7,
  },
  {
    id: 'l1-monty-the-magician-8-symmetrical',
    pattern: 'It is ___.',
    blanks: [
      {
        options: ['symmetrical', 'broken', 'red', 'big'],
        answer: 0,
        zhOptions: ['它是对称的。', '它坏了。', '它是红色的。', '它很大。'],
      },
    ],
    zh: '它是对称的。',
    hint: '判断图形是不是对称的',
    unitSlug: 'monty-the-magician',
    lessonId: 8,
  },
  {
    id: 'l1-monty-the-magician-9-want-the',
    pattern: 'I want the ___.',
    blanks: [
      {
        options: ['doll', 'ball', 'plane', 'robot'],
        answer: 0,
        zhOptions: ['我想要那个洋娃娃。', '我想要那个球。', '我想要那架飞机。', '我想要那个机器人。'],
      },
    ],
    zh: '我想要那个洋娃娃。',
    hint: '复习 I want 句型，说出想要的玩具',
    unitSlug: 'monty-the-magician',
    lessonId: 9,
  },
]

export const u7_reading: Record<string, ReadingPassage> = {
  '7-1': {
    title: 'What Can Fly?',
    titleZh: '什么能飞？',
    paragraphs: [
      [
        { en: 'Monty has a ball, a doll and a basketball today.', zh: '蒙蒂今天有一个球、一个洋娃娃和一个篮球。' },
        { en: '"Look at my plane and my kite!" he says.', zh: '他说：「看我的飞机和风筝！」' },
        { en: '"Where can you see a plane?" asks Lola.', zh: '罗拉问：「你在哪里能看见飞机？」' },
      ],
      [
        { en: '"The plane can fly at the airport," says Monty.', zh: '蒙蒂说：「飞机能在机场飞。」' },
        { en: '"The kite can fly in the sky, too!"', zh: '「风筝也能在天上飞！」' },
        { en: '"What else can fly?" asks Lola.', zh: '罗拉问：「还有什么能飞呢？」' },
        { en: 'A little bird goes up, up, up.', zh: '一只小鸟飞呀，飞呀，飞高了。' },
      ],
      [
        { en: '"My ball can not fly, but it can jump!"', zh: '「我的球不会飞，可它会跳！」' },
        { en: '"Let\'s look at the big sky," says Lola.', zh: '罗拉说：「我们看看大大的天空吧。」' },
        { en: '"Hurray! We can fly like a kite!" they laugh.', zh: '「太好啦！我们能像风筝一样飞！」他们笑起来。' },
      ],
    ],
  },
  '7-2': {
    title: 'The Robot Show',
    titleZh: '机器人表演',
    paragraphs: [
      [
        { en: '"This is a robot," says Monty.', zh: '「这是一个机器人。」蒙蒂说。' },
        { en: '"Dance like a robot!" he says to Lola.', zh: '他对罗拉说：「像机器人一样跳舞！」' },
        { en: 'Lola has a puppet and a guitar, too.', zh: '罗拉还有一个木偶和一把吉他。' },
      ],
      [
        { en: '"Listen, say and do," says the teacher.', zh: '老师说：「听一听，说一说，做一做。」' },
        { en: 'Monty plays the piano for the robot.', zh: '蒙蒂为机器人弹钢琴。' },
        { en: '"T-Rex is a dinosaur, not a robot!" says Lola.', zh: '罗拉说：「霸王龙是恐龙，不是机器人！」' },
        { en: '"Triceratops is a dinosaur, too."', zh: '「三角龙也是恐龙。」' },
      ],
      [
        { en: '"Can a dinosaur dance like a robot?" asks Monty.', zh: '蒙蒂问：「恐龙能像机器人一样跳舞吗？」' },
        { en: '"Yes! Watch my puppet go!" says Lola.', zh: '「能！看我的木偶跳起来！」罗拉说。' },
        { en: '"Hurray for the robot show!" they laugh.', zh: '「机器人表演太棒啦！」他们笑起来。' },
      ],
    ],
  },
  '7-3': {
    title: 'Magic Mo the Magician',
    titleZh: '魔术师魔法莫',
    paragraphs: [
      [
        { en: 'This is Magic Mo. She is a magician.', zh: '这是魔法莫。她是一位魔术师。' },
        { en: 'She has a magic hat and a magic wand.', zh: '她有一顶魔法帽和一根魔法棒。' },
        { en: '"Abracadabra!" she says. "I make magic!"', zh: '她说：「变！我会变魔法！」' },
      ],
      [
        { en: 'Here is Paul. "What do you want, Paul?"', zh: '这是保罗。「保罗，你想要什么？」' },
        { en: '"I want a ball, please," says Paul.', zh: '保罗说：「我想要一个球，谢谢。」' },
        { en: '"I have a ball in my hat!" says Magic Mo.', zh: '魔法莫说：「我的帽子里有一个球！」' },
        { en: '"Oh! Thank you very much!" says Paul.', zh: '保罗说：「哦！非常感谢你！」' },
      ],
      [
        { en: '"I want a green frog, please," says Jane.', zh: '简说：「我想要一只绿色的青蛙，谢谢。」' },
        { en: 'Magic Mo waves her wand at the hat.', zh: '魔法莫对着帽子挥了挥魔法棒。' },
        { en: '"Look! A frog is in my hat now!"', zh: '「看！现在我帽子里有一只青蛙！」' },
        { en: '"Hurray for magic!" the children laugh.', zh: '「魔法真棒！」孩子们笑起来。' },
      ],
    ],
  },
  '7-4': {
    title: 'The Broken Dinosaur',
    titleZh: '坏掉的恐龙',
    paragraphs: [
      [
        { en: 'Here is Lou. "What do you want, Lou?"', zh: '这是卢。「卢，你想要什么？」' },
        { en: '"My plane is broken," says Lou.', zh: '卢说：「我的飞机坏了。」' },
        { en: '"My dinosaur is broken, too."', zh: '「我的恐龙也坏了。」' },
      ],
      [
        { en: '"I want glue, please," he says.', zh: '他说：「我想要胶水，谢谢。」' },
        { en: '"Put your dinosaur in my hat!" says Magic Mo.', zh: '魔法莫说：「把你的恐龙放进我的帽子里！」' },
        { en: '"Abracadabra! I can fix it now!"', zh: '「变！现在我就能把它修好！」' },
        { en: 'Lou takes the dinosaur out of the hat.', zh: '卢把恐龙从帽子里拿了出来。' },
      ],
      [
        { en: '"Look! My dinosaur is not broken!"', zh: '「看！我的恐龙不坏了！」' },
        { en: '"That\'s magic! Thank you very much, Magic Mo!"', zh: '「真是魔法！太谢谢你了，魔法莫！」' },
        { en: '"Hurray! My plane can fly again!" says Lou.', zh: '「太好啦！我的飞机又能飞啦！」卢说。' },
      ],
    ],
  },
  '7-5': {
    title: 'What Do You Want?',
    titleZh: '你想要什么？',
    paragraphs: [
      [
        { en: '"I want a ball," says Monty.', zh: '「我想要一个球。」蒙蒂说。' },
        { en: '"I want a doll," says Lola.', zh: '「我想要一个洋娃娃。」罗拉说。' },
        { en: '"I want a plane, please," says Paul.', zh: '「我想要一架飞机，谢谢。」保罗说。' },
      ],
      [
        { en: 'Magic Mo opens her big magic hat.', zh: '魔法莫打开她那顶大大的魔法帽。' },
        { en: '"I want a robot and a big dinosaur, too!"', zh: '「我还想要一个机器人和一只大恐龙！」' },
        { en: '"Abracadabra!" she says with her wand.', zh: '她挥着魔法棒说：「变！」' },
        { en: 'A ball, a doll and a plane come out.', zh: '一个球、一个洋娃娃和一架飞机出来了。' },
      ],
      [
        { en: '"I want a red ball now," says Monty.', zh: '蒙蒂说：「现在我想要一个红色的球。」' },
        { en: '"A ball is in the hat, too!" laughs Lola.', zh: '罗拉笑着说：「球也在帽子里呢！」' },
        { en: '"Hurray for the magic hat!" they say.', zh: '他们说：「魔法帽太棒啦！」' },
      ],
    ],
  },
  '7-6': {
    title: 'Does It Have a Tail?',
    titleZh: '它有尾巴吗？',
    paragraphs: [
      [
        { en: 'Monty draws a big green dinosaur today.', zh: '蒙蒂今天画了一只绿色的大恐龙。' },
        { en: '"It has a head," he says to Lola.', zh: '他对罗拉说：「它有一个头。」' },
        { en: '"It has two arms and a long body, too."', zh: '「它还有两条胳膊和长长的身体。」' },
      ],
      [
        { en: '"Does it have legs?" asks Lola.', zh: '罗拉问：「它有腿吗？」' },
        { en: '"Yes, it has two big legs," says Monty.', zh: '蒙蒂说：「有，它有两条大腿。」' },
        { en: '"Does it have a tail?" she asks.', zh: '她又问：「它有尾巴吗？」' },
        { en: '"It doesn\'t have a tail. Look!"', zh: '「它没有尾巴。你看！」' },
      ],
      [
        { en: '"A dinosaur needs a tail!" says Lola.', zh: '罗拉说：「恐龙得有尾巴呀！」' },
        { en: 'Monty draws a long tail on the body.', zh: '蒙蒂给身体添上一条长尾巴。' },
        { en: '"Hurray! Now it looks like a dinosaur!"', zh: '「太好啦！现在它看上去像恐龙啦！」' },
      ],
    ],
  },
  '7-7': {
    title: 'The D Sound',
    titleZh: 'd 的发音',
    paragraphs: [
      [
        { en: '"Look at this letter," says the teacher.', zh: '「看看这个字母。」老师说。' },
        { en: '"Can you say it?" she asks.', zh: '她问：「你会读它吗？」' },
        { en: 'Lola has a doll in her hand.', zh: '罗拉手里拿着一个洋娃娃。' },
      ],
      [
        { en: '"Doll, hand, head and red!" says Lola.', zh: '罗拉说：「洋娃娃、手、头、红色！」' },
        { en: '"And dinosaur, too!" says Monty.', zh: '蒙蒂说：「还有恐龙！」' },
        { en: '"This is my head and this is my hand," he says.', zh: '他说：「这是我的头，这是我的手。」' },
        { en: '"My dinosaur is red and big!"', zh: '「我的恐龙又红又大！」' },
      ],
      [
        { en: '"Can you read the little name?" asks the teacher.', zh: '老师问：「你会读这个小小的名字吗？」' },
        { en: 'Lola draws a big red dinosaur in a picture.', zh: '罗拉在画里画了一只红色大恐龙。' },
        { en: '"Hurray! We can read it now!" they laugh.', zh: '「太好啦！现在我们会读啦！」他们笑起来。' },
      ],
    ],
  },
  '7-8': {
    title: 'A Line of Symmetry',
    titleZh: '一条对称轴',
    paragraphs: [
      [
        { en: '"Yes, it\'s a robot!" says Lola.', zh: '「对，这是一个机器人！」罗拉说。' },
        { en: '"Are part one and part two the same?" asks the teacher.', zh: '老师问：「第一部分和第二部分一样吗？」' },
        { en: '"They are the same. It is symmetrical!"', zh: '「它们一样。它是对称的！」' },
      ],
      [
        { en: '"It has a line of symmetry," says Monty.', zh: '蒙蒂说：「它有一条对称轴。」' },
        { en: 'He draws a line on the robot and a plane.', zh: '他在机器人和飞机上各画了一条线。' },
        { en: '"Look at my ball. It is symmetrical, too!"', zh: '「看我的球，它也是对称的！」' },
        { en: '"But my kite is not symmetrical," says Lola.', zh: '罗拉说：「可我的风筝不对称。」' },
      ],
      [
        { en: '"Try again with a new line," says the teacher.', zh: '老师说：「换一条线再试试。」' },
        { en: 'Lola draws a line and claps her hands.', zh: '罗拉画了一条线，拍起手来。' },
        { en: '"Hurray! Now my kite has a line, too!"', zh: '「太好啦！现在我的风筝也有一条线啦！」' },
      ],
    ],
  },
  '7-9': {
    title: 'My Green Dinosaur',
    titleZh: '我的绿色恐龙',
    paragraphs: [
      [
        { en: '"I\'m a dinosaur!" says Monty.', zh: '「我是一只恐龙！」蒙蒂说。' },
        { en: '"This is my head and my body is green."', zh: '「这是我的头，我的身体是绿色的。」' },
        { en: '"My legs are red," he says to Lola.', zh: '他对罗拉说：「我的腿是红色的。」' },
      ],
      [
        { en: '"It has two big eyes and two arms," says Lola.', zh: '罗拉说：「它有两只大眼睛和两条胳膊。」' },
        { en: '"Does it have a tail?" she asks.', zh: '她问：「它有尾巴吗？」' },
        { en: '"It doesn\'t have a tail," says Monty.', zh: '蒙蒂说：「它没有尾巴。」' },
        { en: '"It is not symmetrical, but I like it!"', zh: '「它不对称，可我喜欢它！」' },
      ],
      [
        { en: '"I want the doll now," says Lola.', zh: '罗拉说：「现在我想要那个洋娃娃。」' },
        { en: '"It has long hair and no tail, too!"', zh: '「它也有长头发，也没有尾巴！」' },
        { en: '"Hurray for my green dinosaur!" they laugh.', zh: '「我的绿色恐龙太棒啦！」他们笑起来。' },
      ],
    ],
  },
}

export const u7_ext: Record<string, ExtTopic> = {
  magic: {
    zh: '魔法与魔术',
    words: [
      w('magic', '魔法', '✨'), w('magician', '魔术师', '🎩'), w('wand', '魔法棒', '🪄'),
      w('hat', '帽子', '🎩'), w('rabbit', '兔子', '🐰'), w('trick', '戏法', '🃏'),
      w('spell', '咒语', '🔮'),
    ],
  },
  performance: {
    zh: '表演与演出',
    words: [
      w('show', '表演', '🎭'), w('stage', '舞台', '🎬'), w('song', '歌曲', '🎵'),
      w('dance', '跳舞', '💃'), w('clap', '鼓掌', '👏'), w('sing', '唱歌', '🎤'),
      w('perform', '表演', '🎪'),
    ],
  },
  costume: {
    zh: '服装与打扮',
    words: [
      w('costume', '戏服', '🦸'), w('cape', '披风', '🦸'), w('mask', '面具', '🎭'),
      w('crown', '王冠', '👑'), w('glasses', '眼镜', '👓'), w('shoes', '鞋子', '👞'),
      w('pants', '裤子', '👖'),
    ],
  },
  math: {
    zh: '数学与对称',
    words: [
      w('number', '数字', '🔢'), w('symmetry', '对称', '🔁'), w('same', '相同', '👯'),
      w('different', '不同', '🔀'), w('count', '数数', '🔢'), w('side', '边', '📐'),
      w('line', '线', '➖'),
    ],
  },
}

export const u7_module: Module = {
  id: 7,
  slug: 'monty-the-magician',
  title: 'Monty the Magician',
  titleZh: '蒙蒂魔术师',
  emoji: '🎩',
  color: '#F5B017',
  colorSoft: '#FFF3C4',
  preview: {
    goals: [
      '认识玩具、乐器与恐龙等词汇（ball, doll, plane, robot, dinosaur 等）',
      '读懂「魔术师魔法莫」的故事，学说 Abracadabra 和 I want a...',
      '掌握 I want a... 与 It has / doesn’t have... 两个句型',
      '学说自然拼读 d 的发音，辨认含有 d 的单词',
      '了解对称（symmetry）的概念，能判断物体是否对称',
    ],
    keyWords: 'ball, doll, plane, kite, robot, puppet, guitar, piano, dinosaur, magic, magician, glue, broken, head, body, arms, legs, tail, symmetrical',
    keySentences: "What do you want? I want a ball. It has a head. It doesn't have a tail. Abracadabra!",
    tip: '预习时找出家里的球、洋娃娃、恐龙玩具，用英语边指边说；读「魔法莫」故事时模仿咒语和角色语气，再用 I want a... 表达想要的东西。',
  },
  lessons: u7_lessons[7],
  quiz: [
    { q: '魔术师变魔术时念的咒语是？🎩', options: ['Abracadabra!', 'Hello!', 'Goodbye!'], answer: 0, explain: '魔术师变魔术时念 Abracadabra!' },
    { q: '保罗对魔术师说「我想要一个球」，应该怎么说？⚽', options: ['I want a ball, please.', 'I want a robot.', 'I have a ball.'], answer: 0, explain: 'I want a ball, please. 礼貌地表达想要一个球。' },
    { q: '下面哪个是 head？🙆', options: ['头', '腿', '尾巴'], answer: 0, explain: 'head 是头。' },
    { q: 'It ___ a tail. 它有一条尾巴。空格填？🦎', options: ['has', "doesn't have", 'wants'], answer: 0, explain: '肯定「有」用 has。' },
    { q: '下列哪个单词含有 d 的发音？🦕', options: ['dinosaur', 'cat', 'sun'], answer: 0, explain: 'dinosaur 以 d 开头，含 d 音；cat 和 sun 没有。' },
  ],
}
