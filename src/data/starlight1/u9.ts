// Starlight 1 · Level 1 · Unit 9「Monty the Diver」课程数据
// 数据来源：scripts/extract_starlight1.py 从教材 PDF 提取的 raw/unit9.json
// 结构对齐 level-0 与 Unit 1 试点：每单元一课一个 Lesson，单词与句型围绕该技能抽取。
// 本单元共 11 课（含 2 节 Story Reading 故事课）。类型全部取自 ./shared，不直连 ../starlight。

import type { Lesson, LessonBook, SentenceFrame, ReadingPassage, Module, ExtTopic } from './shared'
import { w } from './shared'

// ============ Lessons（11 课） ============
export const u9_lessons: Record<number, Lesson[]> = {
  9: [
    {
      id: 1,
      title: 'At the Beach',
      titleZh: '海滩景物',
      words: [
        { en: 'beach', zh: '海滩', emoji: '🏖️', ipa: '/biːtʃ/' },
        { en: 'sun', zh: '太阳', emoji: '☀️', ipa: '/sʌn/' },
        { en: 'sky', zh: '天空', emoji: '🌤️', ipa: '/skaɪ/' },
        { en: 'sea', zh: '大海', emoji: '🌊', ipa: '/siː/' },
        { en: 'sand', zh: '沙子', emoji: '🟫', ipa: '/sænd/' },
      ],
      sentences: [
        { en: "What's the weather like?", zh: '天气怎么样？', hint: '热身：问天气' },
        { en: 'What can you do at the beach?', zh: '你在海滩能做什么？', hint: '问海滩活动' },
        { en: 'I can see the sun.', zh: '我看见太阳。', hint: '描述看到的景物' },
        { en: 'I can see the beach.', zh: '我看见海滩。', hint: '描述看到的景物' },
        { en: 'I can see the sea.', zh: '我看见大海。', hint: '描述看到的景物' },
      ],
    },
    {
      id: 2,
      title: 'Sea Things',
      titleZh: '海边事物',
      words: [
        { en: 'shell', zh: '贝壳', emoji: '🐚', ipa: '/ʃel/' },
        { en: 'fish', zh: '鱼', emoji: '🐟', ipa: '/fɪʃ/' },
        { en: 'tree', zh: '树', emoji: '🌳', ipa: '/triː/' },
        { en: 'turtle', zh: '海龟', emoji: '🐢', ipa: '/ˈtɜːtl/' },
        { en: 'rock', zh: '岩石', emoji: '🪨', ipa: '/rɒk/' },
      ],
      sentences: [
        { en: 'What can you see?', zh: '你看到了什么？', hint: '看图提问' },
        { en: 'I can see the sky.', zh: '我看见天空。', hint: '描述看到的景物' },
        { en: 'I can see the sea. It’s blue.', zh: '我看见大海。它是蓝色的。', hint: '描述大海颜色' },
        { en: 'Can you circle the shell at the beach?', zh: '你能在海滩上圈出贝壳吗？', hint: '指着贝壳提问' },
        { en: 'Swim, swim! Swim with me.', zh: '游啊游！和我一起游。', hint: '唱游歌曲' },
      ],
    },
    {
      id: 3,
      title: 'The Mermaid and the Crab',
      titleZh: '美人鱼和螃蟹',
      words: [
        { en: 'mermaid', zh: '美人鱼', emoji: '🧜', ipa: '/ˈmeəmeɪd/' },
        { en: 'crab', zh: '螃蟹', emoji: '🦀', ipa: '/kræb/' },
        { en: 'turtle', zh: '海龟', emoji: '🐢', ipa: '/ˈtɜːtl/' },
        { en: 'fish', zh: '鱼', emoji: '🐟', ipa: '/fɪʃ/' },
        { en: 'shell', zh: '贝壳', emoji: '🐚', ipa: '/ʃel/' },
      ],
      sentences: [
        { en: 'One day a mermaid sees a crab.', zh: '一天，美人鱼看见一只螃蟹。', hint: '故事开头' },
        { en: "I can't find my friend.", zh: '我找不到我的朋友。', hint: '表达找不到' },
        { en: "Don't worry! Let's look!", zh: '别担心！我们找找看！', hint: '安慰并提议' },
        { en: 'Is it a turtle?', zh: '它是海龟吗？', hint: '猜一猜' },
        { en: "No, it isn't. It's a shell.", zh: '不，它不是。它是一个贝壳。', hint: '否定回答' },
      ],
    },
    {
      id: 4,
      title: 'The Treasure Chest',
      titleZh: '宝藏宝箱',
      words: [
        { en: 'chest', zh: '宝箱', emoji: '🧰', ipa: '/tʃest/' },
        { en: 'treasure', zh: '宝藏', emoji: '💎', ipa: '/ˈtreʒə/' },
        { en: 'friend', zh: '朋友', emoji: '🤝', ipa: '/frend/' },
        { en: 'happy', zh: '开心的', emoji: '😊', ipa: '/ˈhæpi/' },
        { en: 'turtle', zh: '海龟', emoji: '🐢', ipa: '/ˈtɜːtl/' },
      ],
      sentences: [
        { en: 'The mermaid and the crab can’t find the turtle.', zh: '美人鱼和螃蟹找不到海龟。', hint: '故事回顾' },
        { en: "What's that noise?", zh: '那是什么声音？', hint: '听到声音提问' },
        { en: 'The mermaid opens the chest.', zh: '美人鱼打开了宝箱。', hint: '故事发展' },
        { en: 'Yes, it is. Phew! Thank you.', zh: '是的，它是。呼！谢谢你。', hint: '找到朋友' },
        { en: 'Here’s the turtle and look at the treasure!', zh: '海龟在这里，看那宝藏！', hint: '故事结局' },
      ],
    },
    {
      id: 5,
      title: 'What Is It?',
      titleZh: '它是什么？',
      words: [
        { en: 'sun', zh: '太阳', emoji: '☀️', ipa: '/sʌn/' },
        { en: 'shell', zh: '贝壳', emoji: '🐚', ipa: '/ʃel/' },
        { en: 'fish', zh: '鱼', emoji: '🐟', ipa: '/fɪʃ/' },
        { en: 'turtle', zh: '海龟', emoji: '🐢', ipa: '/ˈtɜːtl/' },
        { en: 'rock', zh: '岩石', emoji: '🪨', ipa: '/rɒk/' },
      ],
      sentences: [
        { en: 'What color is it?', zh: '它是什么颜色？', hint: '问颜色' },
        { en: 'Is it a turtle?', zh: '它是海龟吗？', hint: '一般疑问句' },
        { en: 'Yes, it is.', zh: '是的，它是。', hint: '肯定回答' },
        { en: "No, it isn't.", zh: '不，它不是。', hint: '否定回答' },
        { en: 'Is it the sky?', zh: '它是天空吗？', hint: '用 the 指特定事物' },
      ],
    },
    {
      id: 6,
      title: 'They Are Animals',
      titleZh: '它们是动物',
      words: [
        { en: 'penguins', zh: '企鹅', emoji: '🐧', ipa: '/ˈpeŋɡwɪnz/' },
        { en: 'crabs', zh: '螃蟹', emoji: '🦀', ipa: '/kræbz/' },
        { en: 'seals', zh: '海豹', emoji: '🦭', ipa: '/siːlz/' },
        { en: 'dolphins', zh: '海豚', emoji: '🐬', ipa: '/ˈdɒlfɪnz/' },
        { en: 'seagulls', zh: '海鸥', emoji: '🐦', ipa: '/ˈsiːɡʌlz/' },
      ],
      sentences: [
        { en: 'What are they?', zh: '它们是什么？', hint: '问复数事物' },
        { en: "They're dolphins.", zh: '它们是海豚。', hint: '用 they’re 介绍' },
        { en: "They're penguins.", zh: '它们是企鹅。', hint: '用 they’re 介绍' },
        { en: 'They can fly. What are they?', zh: '它们会飞。它们是什么？', hint: '结合特征提问' },
        { en: 'How many animals are in the picture?', zh: '图里有多少只动物？', hint: '问数量' },
      ],
    },
    {
      id: 7,
      title: 'Phonics: /s/',
      titleZh: '自然拼读：s 音',
      words: [
        { en: 'sun', zh: '太阳', emoji: '☀️', ipa: '/sʌn/' },
        { en: 'sand', zh: '沙子', emoji: '🟫', ipa: '/sænd/' },
        { en: 'seals', zh: '海豹', emoji: '🦭', ipa: '/siːlz/' },
        { en: 'seven', zh: '七', emoji: '7️⃣', ipa: '/ˈsevn/' },
        { en: 'sisters', zh: '姐妹', emoji: '👯', ipa: '/ˈsɪstəz/' },
      ],
      sentences: [
        { en: 'Seven snails in the sun.', zh: '七只蜗牛在阳光下。', hint: 'chant 歌词' },
        { en: 'Six seals in the sea.', zh: '六只海豹在海里。', hint: 'chant 歌词' },
        { en: 'Seven sisters on the sand.', zh: '七位姐妹在沙滩上。', hint: 'chant 歌词' },
        { en: 'Six seagulls in the tree.', zh: '六只海鸥在树上。', hint: 'chant 歌词' },
        { en: 'Can you think of words with the s sound?', zh: '你能想出带 s 音的单词吗？', hint: '拼读提示' },
      ],
    },
    {
      id: 8,
      title: 'Water Music',
      titleZh: '水的音乐',
      words: [
        { en: 'flute', zh: '长笛', emoji: '🎶', ipa: '/fluːt/' },
        { en: 'drum', zh: '鼓', emoji: '🥁', ipa: '/drʌm/' },
        { en: 'fast', zh: '快的', emoji: '⚡', ipa: '/fɑːst/' },
        { en: 'slow', zh: '慢的', emoji: '🐢', ipa: '/sləʊ/' },
        { en: 'quiet', zh: '轻的', emoji: '🤫', ipa: '/ˈkwaɪət/' },
        { en: 'loud', zh: '响的', emoji: '🔊', ipa: '/laʊd/' },
      ],
      sentences: [
        { en: 'Music can be fast.', zh: '音乐可以很快。', hint: '描述音乐快慢' },
        { en: 'Music can be slow.', zh: '音乐可以很慢。', hint: '描述音乐快慢' },
        { en: 'Music can be quiet.', zh: '音乐可以很轻。', hint: '描述音乐轻重' },
        { en: 'Music can be loud.', zh: '音乐可以很响。', hint: '描述音乐轻重' },
        { en: 'This is music about the sea. It’s fast and loud.', zh: '这是关于大海的音乐，又快又响。', hint: '结合故事' },
      ],
    },
    {
      id: 9,
      title: 'Practice',
      titleZh: '综合练习',
      words: [
        { en: 'sun', zh: '太阳', emoji: '☀️', ipa: '/sʌn/' },
        { en: 'sand', zh: '沙子', emoji: '🟫', ipa: '/sænd/' },
        { en: 'seals', zh: '海豹', emoji: '🦭', ipa: '/siːlz/' },
        { en: 'snails', zh: '蜗牛', emoji: '🐌', ipa: '/sneɪlz/' },
        { en: 'seagulls', zh: '海鸥', emoji: '🐦', ipa: '/ˈsiːɡʌlz/' },
      ],
      sentences: [
        { en: 'Seven snails in the sun.', zh: '七只蜗牛在阳光下。', hint: '复习 chant' },
        { en: 'Six seals in the sea.', zh: '六只海豹在海里。', hint: '复习 chant' },
        { en: 'Is it a crab?', zh: '它是螃蟹吗？', hint: '一般疑问句' },
        { en: 'Yes, it is.', zh: '是的，它是。', hint: '肯定回答' },
        { en: "They're penguins.", zh: '它们是企鹅。', hint: '复数介绍' },
      ],
    },
    {
      id: 10,
      title: 'Monty Plays Soccer',
      titleZh: '蒙蒂踢足球',
      words: [
        { en: 'soccer', zh: '足球', emoji: '⚽', ipa: '/ˈsɒkə/' },
        { en: 'play', zh: '玩／踢', emoji: '🎮', ipa: '/pleɪ/' },
        { en: 'can', zh: '能', emoji: '💪', ipa: '/kæn/' },
        { en: 'run', zh: '跑', emoji: '🏃', ipa: '/rʌn/' },
        { en: 'jump', zh: '跳', emoji: '🤸', ipa: '/dʒʌmp/' },
      ],
      sentences: [
        { en: 'Monty and Lola are in the classroom at school.', zh: '蒙蒂和罗拉在学校教室里。', hint: '故事场景' },
        { en: 'Wow! It’s the World Cup! We’re soccer players!', zh: '哇！是世界杯！我们是足球运动员！', hint: '故事发展' },
        { en: 'He’s the referee. He has a whistle.', zh: '他是裁判。他有哨子。', hint: '介绍角色' },
        { en: 'Fantastic! I can play soccer.', zh: '太棒了！我会踢足球。', hint: '用 I can 表达能力' },
        { en: 'I’m small ... but I’m fast!', zh: '我很小……但我很快！', hint: '描述自己' },
      ],
    },
    {
      id: 11,
      title: 'The Red Team Wins',
      titleZh: '红队获胜',
      words: [
        { en: 'kick', zh: '踢', emoji: '🦵', ipa: '/kɪk/' },
        { en: 'score', zh: '比分', emoji: '🔢', ipa: '/skɔː/' },
        { en: 'winner', zh: '获胜者', emoji: '🥇', ipa: '/ˈwɪnə/' },
        { en: 'prize', zh: '奖品', emoji: '🏆', ipa: '/praɪz/' },
        { en: 'goal', zh: '进球', emoji: '🥅', ipa: '/ɡəʊl/' },
      ],
      sentences: [
        { en: 'Look at Monty! I can run and I can kick the ball!', zh: '看蒙蒂！我会跑也会踢球！', hint: '用 I can 表达' },
        { en: 'Now the score is 2-2.', zh: '现在比分是 2 比 2。', hint: '说比分' },
        { en: "Lola can't kick the ball.", zh: '罗拉不会踢球。', hint: '用 I can’t 表达' },
        { en: 'The red team is the winner!', zh: '红队是获胜者！', hint: '宣布结果' },
        { en: 'Well done, Monty and Lola!', zh: '干得好，蒙蒂和罗拉！', hint: '夸奖' },
      ],
    },
  ],
}

// ============ LessonBook（9-1 … 9-11，按活动分 chapter） ============
export const u9_book: Record<string, LessonBook> = {
  '9-1': {
    title: 'At the Beach',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: "What's the weather like?", textZh: '天气怎么样？' },
        { text: 'What can you do at the beach?', textZh: '你在海滩能做什么？' },
      ] },
      { chapter: 'Learn to Read.', chapterZh: '学习单词。', pages: [
        { text: 'beach', textZh: '海滩' },
        { text: 'sun', textZh: '太阳' },
        { text: 'sky', textZh: '天空' },
        { text: 'sea', textZh: '大海' },
        { text: 'sand', textZh: '沙子' },
      ] },
      { chapter: 'Look and say.', chapterZh: '看一看，说一说。', pages: [
        { text: 'I can see the sun.', textZh: '我看见太阳。' },
        { text: 'I can see the beach.', textZh: '我看见海滩。' },
        { text: 'I can see the sea.', textZh: '我看见大海。' },
      ] },
    ],
  },
  '9-2': {
    title: 'Sea Things',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'What can you see?', textZh: '你看到了什么？' },
        { text: 'I can see the sky.', textZh: '我看见天空。' },
        { text: 'I can see the sea.', textZh: '我看见大海。' },
      ] },
      { chapter: 'Learn to Read.', chapterZh: '学习单词。', pages: [
        { text: 'shell', textZh: '贝壳' },
        { text: 'fish', textZh: '鱼' },
        { text: 'tree', textZh: '树' },
        { text: 'turtle', textZh: '海龟' },
        { text: 'rock', textZh: '岩石' },
      ] },
      { chapter: 'Listen and circle.', chapterZh: '听一听，圈一圈。', pages: [
        { text: 'I can see the sea. It’s blue.', textZh: '我看见大海。它是蓝色的。' },
        { text: 'Splish! Splash! Under the sea.', textZh: '哗啦！哗啦！在海里。' },
        { text: 'Swim, swim! Swim with me.', textZh: '游啊游！和我一起游。' },
      ] },
    ],
  },
  '9-3': {
    title: 'The Mermaid and the Crab',
    sections: [
      { chapter: 'Guess and say.', chapterZh: '猜一猜，说一说。', pages: [
        { text: 'It’s a fish.', textZh: '它是一条鱼。' },
        { text: 'It’s a turtle.', textZh: '它是一只海龟。' },
        { text: 'It’s a crab.', textZh: '它是一只螃蟹。' },
      ] },
      { chapter: 'Listen and read.', chapterZh: '听一听，读一读。', pages: [
        { text: 'One day a mermaid sees a crab.', textZh: '一天，美人鱼看见一只螃蟹。' },
        { text: "I can't find my friend. He’s a turtle.", textZh: '我找不到我的朋友。他是一只海龟。' },
        { text: "Don't worry! Let's look!", textZh: '别担心！我们找找看！' },
      ] },
      { chapter: 'Look and answer.', chapterZh: '看一看，答一答。', pages: [
        { text: 'Is it a mermaid?', textZh: '它是美人鱼吗？' },
        { text: 'Yes, it is.', textZh: '是的，它是。' },
        { text: "No, it isn't.", textZh: '不，它不是。' },
      ] },
    ],
  },
  '9-4': {
    title: 'The Treasure Chest',
    sections: [
      { chapter: 'Read and match.', chapterZh: '读一读，连一连。', pages: [
        { text: 'Is it a turtle?', textZh: '它是海龟吗？' },
        { text: "No, it isn't. It's a shell.", textZh: '不，它不是。它是一个贝壳。' },
        { text: 'The crab can’t find the turtle. He is sad.', textZh: '螃蟹找不到海龟。他很伤心。' },
      ] },
      { chapter: 'Listen and answer.', chapterZh: '听一听，答一答。', pages: [
        { text: "What's that noise?", textZh: '那是什么声音？' },
        { text: 'The mermaid opens the chest.', textZh: '美人鱼打开了宝箱。' },
        { text: 'Yes, it is. Phew! Thank you.', textZh: '是的，它是。呼！谢谢你。' },
      ] },
      { chapter: 'Choose and say.', chapterZh: '选一选，说一说。', pages: [
        { text: 'The mermaid and the crab can’t find the turtle.', textZh: '美人鱼和螃蟹找不到海龟。' },
        { text: 'Here’s the turtle and look at the treasure!', textZh: '海龟在这里，看那宝藏！' },
      ] },
    ],
  },
  '9-5': {
    title: 'What Is It?',
    sections: [
      { chapter: 'What can you see at the beach?', chapterZh: '海滩上你能看到什么？', pages: [
        { text: 'I can see the sun.', textZh: '我看见太阳。' },
        { text: 'I can see a shell.', textZh: '我看见一个贝壳。' },
        { text: 'I can see a turtle.', textZh: '我看见一只海龟。' },
      ] },
      { chapter: 'Grammar.', chapterZh: '语法。', pages: [
        { text: 'What color is it?', textZh: '它是什么颜色？' },
        { text: 'Is it a turtle?', textZh: '它是海龟吗？' },
        { text: 'Yes, it is. / No, it isn’t.', textZh: '是的，它是。／不，它不是。' },
      ] },
      { chapter: 'Look and guess.', chapterZh: '看一看，猜一猜。', pages: [
        { text: 'Is it the sun?', textZh: '是太阳吗？' },
        { text: 'Is it a shell?', textZh: '是一个贝壳吗？' },
      ] },
    ],
  },
  '9-6': {
    title: 'They Are Animals',
    sections: [
      { chapter: 'Guess and match.', chapterZh: '猜一猜，连一连。', pages: [
        { text: 'penguins', textZh: '企鹅' },
        { text: 'crabs', textZh: '螃蟹' },
        { text: 'snails', textZh: '蜗牛' },
        { text: 'seagulls', textZh: '海鸥' },
        { text: 'seals', textZh: '海豹' },
        { text: 'dolphins', textZh: '海豚' },
      ] },
      { chapter: 'Grammar.', chapterZh: '语法。', pages: [
        { text: 'What are they?', textZh: '它们是什么？' },
        { text: "They're snails.", textZh: '它们是蜗牛。' },
        { text: "They're dolphins.", textZh: '它们是海豚。' },
      ] },
      { chapter: 'Song time.', chapterZh: '唱歌时间。', pages: [
        { text: 'They’re dolphins in the sea.', textZh: '它们是海里的海豚。' },
        { text: 'They’re seals on the shore.', textZh: '它们是岸上的海豹。' },
      ] },
    ],
  },
  '9-7': {
    title: 'Phonics: /s/',
    sections: [
      { chapter: 'Listen and sing.', chapterZh: '听一听，唱一唱。', pages: [
        { text: 'They’re dolphins in the sea.', textZh: '它们是海里的海豚。' },
        { text: 'They’re seagulls in the sky.', textZh: '它们是天上的海鸥。' },
      ] },
      { chapter: 'Count and say.', chapterZh: '数一数，说一说。', pages: [
        { text: 'We can see seven sisters.', textZh: '我们能看见七位姐妹。' },
        { text: 'We can see six seagulls.', textZh: '我们能看见六只海鸥。' },
      ] },
      { chapter: 'Listen and chant.', chapterZh: '听一听，念一念。', pages: [
        { text: 'Seven snails in the sun.', textZh: '七只蜗牛在阳光下。' },
        { text: 'Six seals in the sea.', textZh: '六只海豹在海里。' },
        { text: 'Seven sisters on the sand.', textZh: '七位姐妹在沙滩上。' },
        { text: 'Six seagulls in the tree.', textZh: '六只海鸥在树上。' },
      ] },
    ],
  },
  '9-8': {
    title: 'Water Music',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'flute', textZh: '长笛' },
        { text: 'drum', textZh: '鼓' },
        { text: 'bird', textZh: '鸟' },
        { text: 'heavy rain', textZh: '大雨' },
      ] },
      { chapter: 'Read and answer.', chapterZh: '读一读，答一答。', pages: [
        { text: 'Music can be fast.', textZh: '音乐可以很快。' },
        { text: 'Music can be slow.', textZh: '音乐可以很慢。' },
        { text: 'Music can be quiet.', textZh: '音乐可以很轻。' },
        { text: 'Music can be loud.', textZh: '音乐可以很响。' },
      ] },
      { chapter: 'Water Music.', chapterZh: '水的音乐。', pages: [
        { text: 'This is music about the sea. It’s fast and loud.', textZh: '这是关于大海的音乐，又快又响。' },
        { text: 'This is music about rain. It’s quiet and slow.', textZh: '这是关于雨的音乐，又轻又慢。' },
      ] },
    ],
  },
  '9-9': {
    title: 'Practice',
    sections: [
      { chapter: 'Listen to a chant.', chapterZh: '听一听 chant。', pages: [
        { text: 'Seven snails in the sun.', textZh: '七只蜗牛在阳光下。' },
        { text: 'Six seals in the sea.', textZh: '六只海豹在海里。' },
        { text: 'Seven sisters on the sand.', textZh: '七位姐妹在沙滩上。' },
        { text: 'Six seagulls in the tree.', textZh: '六只海鸥在树上。' },
      ] },
      { chapter: 'Read and choose.', chapterZh: '读一读，选一选。', pages: [
        { text: 'Is it a crab?', textZh: '它是螃蟹吗？' },
        { text: 'Yes, it is. / No, it isn’t.', textZh: '是的，它是。／不，它不是。' },
        { text: 'Is it a shell?', textZh: '它是一个贝壳吗？' },
      ] },
      { chapter: 'Read and draw lines.', chapterZh: '读一读，连一连。', pages: [
        { text: "They're penguins.", textZh: '它们是企鹅。' },
        { text: "They're snails.", textZh: '它们是蜗牛。' },
        { text: "They're crabs.", textZh: '它们是螃蟹。' },
        { text: "They're seagulls.", textZh: '它们是海鸥。' },
      ] },
    ],
  },
  '9-10': {
    title: 'Monty Plays Soccer',
    sections: [
      { chapter: 'Warm up: Actions.', chapterZh: '热身：动作。', pages: [
        { text: 'jump', textZh: '跳' },
        { text: 'swing', textZh: '荡秋千' },
        { text: 'walk', textZh: '走' },
        { text: 'swim', textZh: '游泳' },
        { text: 'run', textZh: '跑' },
        { text: 'fly', textZh: '飞' },
      ] },
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'Monty and Lola are in the classroom at school.', textZh: '蒙蒂和罗拉在学校教室里。' },
        { text: 'Can you play soccer?', textZh: '你会踢足球吗？' },
      ] },
      { chapter: 'Listen and read.', chapterZh: '听一听，读一读。', pages: [
        { text: 'Now Monty and Lola are in a big soccer stadium.', textZh: '现在蒙蒂和罗拉在一个大足球场。' },
        { text: 'Wow! It’s the World Cup! We’re soccer players!', textZh: '哇！是世界杯！我们是足球运动员！' },
        { text: 'He’s the referee. He has a whistle.', textZh: '他是裁判。他有哨子。' },
        { text: 'Fantastic! I can play soccer.', textZh: '太棒了！我会踢足球。' },
        { text: 'I’m small ... but I’m fast!', textZh: '我很小……但我很快！' },
      ] },
    ],
  },
  '9-11': {
    title: 'The Red Team Wins',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'Monty and Lola are on the red team.', textZh: '蒙蒂和罗拉在红队。' },
        { text: 'Look at the score. Do you think they will win?', textZh: '看比分。你觉得他们会赢吗？' },
      ] },
      { chapter: 'Listen and read.', chapterZh: '听一听，读一读。', pages: [
        { text: 'Look at Monty! I can run and I can kick the ball!', textZh: '看蒙蒂！我会跑也会踢球！' },
        { text: 'Now the score is 2-2.', textZh: '现在比分是 2 比 2。' },
        { text: "Lola can't kick the ball.", textZh: '罗拉不会踢球。' },
        { text: "Lola can't kick the ball, but she can jump.", textZh: '罗拉不会踢球，但她会跳。' },
      ] },
      { chapter: 'Choose and say.', chapterZh: '选一选，说一说。', pages: [
        { text: 'The red team is the winner!', textZh: '红队是获胜者！' },
        { text: 'Well done, Monty and Lola!', textZh: '干得好，蒙蒂和罗拉！' },
        { text: 'I want the prize!', textZh: '我想要奖品！' },
      ] },
    ],
  },
}

// ============ SentenceFrames（来自 Language Focus L5 / L6） ============
export const u9_frames: SentenceFrame[] = [
  {
    id: 'l1-monty-the-diver-5-color-q',
    pattern: 'What color is ___?',
    blanks: [
      {
        options: ['it', 'the sun', 'the sea'],
        answer: 0,
        zhOptions: ['它是什么颜色？', '太阳是什么颜色？', '大海是什么颜色？'],
      },
    ],
    zh: '它是什么颜色？',
    hint: '问物品的颜色',
    unitSlug: 'monty-the-diver',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-diver-5-is-it',
    pattern: 'Is it a ___?',
    blanks: [
      {
        options: ['turtle', 'shell', 'fish'],
        answer: 0,
        zhOptions: ['它是海龟吗？', '它是一个贝壳吗？', '它是一条鱼吗？'],
      },
    ],
    zh: '它是海龟吗？',
    hint: '用一般疑问句确认物品',
    unitSlug: 'monty-the-diver',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-diver-5-answer',
    pattern: '___ it is.',
    blanks: [
      {
        options: ['Yes,', 'No,', 'Well,'],
        answer: 0,
        zhOptions: ['是的，它是。', '不，它是。', '嗯，它是。'],
      },
    ],
    zh: '是的，它是。',
    hint: '回答一般疑问句',
    unitSlug: 'monty-the-diver',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-diver-6-what',
    pattern: 'What are ___?',
    blanks: [
      {
        options: ['they', 'these animals', 'the turtles'],
        answer: 0,
        zhOptions: ['它们是什么？', '这些动物是什么？', '那些海龟是什么？'],
      },
    ],
    zh: '它们是什么？',
    hint: '询问复数事物',
    unitSlug: 'monty-the-diver',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-diver-6-they',
    pattern: "They're ___.",
    blanks: [
      {
        options: ['dolphins', 'penguins', 'seals'],
        answer: 0,
        zhOptions: ['它们是海豚。', '它们是企鹅。', '它们是海豹。'],
      },
    ],
    zh: '它们是海豚。',
    hint: '用 they’re 介绍动物',
    unitSlug: 'monty-the-diver',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-diver-6-sea',
    pattern: 'How many animals are in the ___?',
    blanks: [
      {
        options: ['picture', 'sea', 'sky'],
        answer: 0,
        zhOptions: ['图里有多少只动物？', '海里有多少只动物？', '天上有多少只动物？'],
      },
    ],
    zh: '图里有多少只动物？',
    hint: '用 How many 问数量',
    unitSlug: 'monty-the-diver',
    lessonId: 6,
  },

  // ---- 补齐缺卡课：句型逐字取自本课 sentences，___ 处即被挖掉的那一段 ----
  {
    id: 'l1-monty-the-diver-1-see',
    pattern: 'I can see the ___.',
    blanks: [
      {
        options: ['sea', 'sun', 'beach'],
        answer: 0,
        zhOptions: ['我看见大海。', '我看见太阳。', '我看见海滩。'],
      },
    ],
    zh: '我看见大海。',
    hint: '说在海滩看见的东西',
    unitSlug: 'monty-the-diver',
    lessonId: 1,
  },
  {
    id: 'l1-monty-the-diver-2-can',
    pattern: 'What can you ___?',
    blanks: [
      {
        options: ['see', 'do', 'find'],
        answer: 0,
        zhOptions: ['你看到了什么？', '你能做什么？', '你能找到什么？'],
      },
    ],
    zh: '你看到了什么？',
    hint: '问对方看见了什么',
    unitSlug: 'monty-the-diver',
    lessonId: 2,
  },
  {
    id: 'l1-monty-the-diver-3-find',
    pattern: "I can't find my ___.",
    blanks: [
      {
        options: ['friend', 'crab', 'shell'],
        answer: 0,
        zhOptions: ['我找不到我的朋友。', '我找不到我的螃蟹。', '我找不到我的贝壳。'],
      },
    ],
    zh: '我找不到我的朋友。',
    hint: '说找不到谁',
    unitSlug: 'monty-the-diver',
    lessonId: 3,
  },
  {
    id: 'l1-monty-the-diver-4-noise',
    pattern: "What's that ___?",
    blanks: [
      {
        options: ['noise', 'turtle', 'chest'],
        answer: 0,
        zhOptions: ['那是什么声音？', '那是什么海龟？', '那是什么宝箱？'],
      },
    ],
    zh: '那是什么声音？',
    hint: '听到动静时问一句',
    unitSlug: 'monty-the-diver',
    lessonId: 4,
  },
  {
    id: 'l1-monty-the-diver-7-seals',
    pattern: 'Six ___ in the sea.',
    blanks: [
      {
        options: ['seals', 'snails', 'seagulls'],
        answer: 0,
        zhOptions: ['六只海豹在海里。', '六只蜗牛在海里。', '六只海鸥在海里。'],
      },
    ],
    zh: '六只海豹在海里。',
    hint: '练 /s/ 音：Six seals',
    unitSlug: 'monty-the-diver',
    lessonId: 7,
  },
  {
    id: 'l1-monty-the-diver-8-music',
    pattern: 'Music can be ___.',
    blanks: [
      {
        options: ['slow', 'fast', 'quiet'],
        answer: 0,
        zhOptions: ['音乐可以很慢。', '音乐可以很快。', '音乐可以很轻。'],
      },
    ],
    zh: '音乐可以很慢。',
    hint: '描述音乐的快慢轻重',
    unitSlug: 'monty-the-diver',
    lessonId: 8,
  },
  {
    id: 'l1-monty-the-diver-9-crab',
    pattern: 'Is it a ___?',
    blanks: [
      {
        options: ['crab', 'turtle', 'shell'],
        answer: 0,
        zhOptions: ['它是螃蟹吗？', '它是海龟吗？', '它是贝壳吗？'],
      },
    ],
    zh: '它是螃蟹吗？',
    hint: '确认是什么动物',
    unitSlug: 'monty-the-diver',
    lessonId: 9,
  },
  {
    id: 'l1-monty-the-diver-10-soccer',
    pattern: 'Fantastic! I can play ___.',
    blanks: [
      {
        options: ['soccer', 'music', 'games'],
        answer: 0,
        zhOptions: ['太棒了！我会踢足球。', '太棒了！我会玩音乐。', '太棒了！我会玩游戏。'],
      },
    ],
    zh: '太棒了！我会踢足球。',
    hint: '说自己会做什么',
    unitSlug: 'monty-the-diver',
    lessonId: 10,
  },
  {
    id: 'l1-monty-the-diver-11-winner',
    pattern: 'The red team is the ___!',
    blanks: [
      {
        options: ['winner', 'referee', 'player'],
        answer: 0,
        zhOptions: ['红队是获胜者！', '红队是裁判！', '红队是队员！'],
      },
    ],
    zh: '红队是获胜者！',
    hint: '宣布比赛结果',
    unitSlug: 'monty-the-diver',
    lessonId: 11,
  },
]

// ============ ReadingPassages（阅读 / 故事课：3, 4, 10, 11） ============
export const u9_reading: Record<string, ReadingPassage> = {
  '9-3': {
    title: 'The Sad Crab',
    titleZh: '伤心的螃蟹',
    paragraphs: [
      [
        { en: 'One day a mermaid sees a crab.', zh: '一天，美人鱼看见一只螃蟹。' },
        { en: 'The crab is sad. He cannot find his friend.', zh: '螃蟹很伤心。他找不到他的朋友。' },
        { en: "I can't find my friend. He's a turtle.", zh: '我找不到我的朋友。他是一只海龟。' },
      ],
      [
        { en: "Don't worry! Let's look!", zh: '别担心！我们找找看！' },
        { en: 'The mermaid and the crab swim in the sea.', zh: '美人鱼和螃蟹在海里游泳。' },
        { en: 'Is it a turtle?', zh: '它是海龟吗？' },
      ],
      [
        { en: 'No, it is not. It is a shell.', zh: '不，它不是。它是一个贝壳。' },
        { en: 'No, it is not. It is a rock.', zh: '不，它不是。它是一块岩石。' },
        { en: 'Then they see a big fish. Eek!', zh: '然后他们看见一条大鱼。哎呀！' },
      ],
    ],
  },
  '9-4': {
    title: 'The Treasure Chest',
    titleZh: '宝藏宝箱',
    paragraphs: [
      [
        { en: 'The mermaid and the crab cannot find the turtle.', zh: '美人鱼和螃蟹找不到海龟。' },
        { en: 'But suddenly they hear a noise.', zh: '但突然他们听到一个声音。' },
        { en: "What's that noise?", zh: '那是什么声音？' },
      ],
      [
        { en: 'The mermaid and the crab find a chest.', zh: '美人鱼和螃蟹找到一个宝箱。' },
        { en: 'The mermaid opens the chest.', zh: '美人鱼打开宝箱。' },
        { en: 'Yes, it is! It is my friend!', zh: '是的，它是！它是我的朋友！' },
      ],
      [
        { en: 'Here is the turtle, and look at the treasure!', zh: '海龟在这里，看那宝藏！' },
        { en: 'The mermaid, the crab and the turtle are very happy.', zh: '美人鱼、螃蟹和海龟非常开心。' },
        { en: 'Hurray!', zh: '好哇！' },
      ],
    ],
  },
  '9-10': {
    title: 'Monty and Lola Play Soccer',
    titleZh: '蒙蒂和罗拉踢足球',
    paragraphs: [
      [
        { en: 'Monty and Lola are in the classroom at school.', zh: '蒙蒂和罗拉在学校教室里。' },
        { en: 'The P.E. teacher says, "Please bring the books."', zh: '体育老师说："请把书拿来。"' },
        { en: 'OK! Come on, Lola!', zh: '好的！快点，罗拉！' },
      ],
      [
        { en: 'Now Monty and Lola are in a big soccer stadium.', zh: '现在蒙蒂和罗拉在一个大足球场。' },
        { en: "Wow! It's the World Cup! We're soccer players!", zh: '哇！是世界杯！我们是足球运动员！' },
        { en: "He's the referee. He has a whistle.", zh: '他是裁判。他有哨子。' },
      ],
      [
        { en: 'Fantastic! I can play soccer.', zh: '太棒了！我会踢足球。' },
        { en: 'I’m small ... but I’m fast!', zh: '我很小……但我很快！' },
      ],
    ],
  },
  '9-11': {
    title: 'The Red Team Wins',
    titleZh: '红队获胜',
    paragraphs: [
      [
        { en: 'Monty and Lola are on the red team.', zh: '蒙蒂和罗拉在红队。' },
        { en: 'Look at Monty! I can run and I can kick the ball!', zh: '看蒙蒂！我会跑也会踢球！' },
        { en: 'Now the score is 2-2.', zh: '现在比分是 2 比 2。' },
      ],
      [
        { en: "Lola can't kick the ball, but she can jump.", zh: '罗拉不会踢球，但她会跳。' },
        { en: 'With your head, Lola!', zh: '用你的头，罗拉！' },
        { en: 'Oh no!', zh: '哦不！' },
      ],
      [
        { en: 'The red team is the winner!', zh: '红队是获胜者！' },
        { en: 'Monty and Lola have the prize.', zh: '蒙蒂和罗拉拿到了奖品。' },
        { en: 'Well done, Monty and Lola! Hurray!', zh: '干得好，蒙蒂和罗拉！好哇！' },
      ],
    ],
  },
}

// ============ Extension Topics（全新主题，不复用 Unit 1） ============
export const u9_ext: Record<string, ExtTopic> = {
  'sea-ocean': {
    zh: '海洋与沙滩',
    words: [
      w('ocean', '海洋', '🌊'), w('wave', '海浪', '🌊'), w('beach', '海滩', '🏖️'),
      w('island', '岛屿', '🏝️'), w('boat', '小船', '⛵'), w('starfish', '海星', '⭐'),
      w('coral', '珊瑚', '🪸'),
    ],
  },
  diving: {
    zh: '潜水',
    words: [
      w('diver', '潜水员', '🤿'), w('mask', '面镜', '🥽'), w('fins', '脚蹼', '🦶'),
      w('snorkel', '呼吸管', '🤿'), w('deep', '深的', '⬇️'), w('bubbles', '气泡', '🫧'),
      w('underwater', '水下的', '🌊'),
    ],
  },
  music: {
    zh: '音乐',
    words: [
      w('flute', '长笛', '🎶'), w('drum', '鼓', '🥁'), w('song', '歌曲', '🎵'),
      w('piano', '钢琴', '🎹'), w('guitar', '吉他', '🎸'), w('loud', '响亮的', '🔊'),
      w('quiet', '安静的', '🤫'),
    ],
  },
  soccer: {
    zh: '足球与比赛',
    words: [
      w('soccer', '足球', '⚽'), w('goal', '进球', '🥅'), w('team', '队伍', '👥'),
      w('referee', '裁判', '🦓'), w('prize', '奖品', '🏆'), w('win', '赢', '🏅'),
      w('player', '运动员', '🏃'),
    ],
  },
}

// ============ Module（单元总览） ============
export const u9_module: Module = {
  id: 9,
  slug: 'monty-the-diver',
  title: 'Monty the Diver',
  titleZh: '蒙蒂潜水员',
  emoji: '🤿',
  color: '#F5B017',
  colorSoft: '#FFF3C4',
  preview: {
    goals: [
      '认识海滩与海洋景物（beach, sun, sky, sea, sand, shell, fish, turtle, rock）',
      '学会用 Is it a...? / What color is it? 进行确认与问答',
      '学会用 They’re... 介绍复数动物（dolphins, penguins, seals, seagulls）',
      '学说自然拼读 /s/ 音（sun, sand, seals, seven, sisters, seagulls）',
      '了解音乐的快慢轻重，读懂蒙蒂踢足球「进球」故事，用 I can / I can’t 表达能力',
    ],
    keyWords: 'beach, sun, sky, sea, sand, shell, fish, turtle, crab, mermaid, rock, dolphins, seagulls, seals, soccer, run, jump, kick',
    keySentences: "What color is it? Is it a turtle? Yes, it is. What are they? They're dolphins. I can play soccer. I can't kick the ball.",
    tip: '预习时想象去海滩度假，用英语说出看到的景物；读「美人鱼寻友」和「蒙蒂踢球」故事时模仿角色语气，并用 I can / I can’t 说说自己会什么运动。',
  },
  lessons: u9_lessons[9],
  quiz: [
    { q: '海滩用英语怎么说？🏖️', options: ['beach', 'sea', 'sky'], answer: 0, explain: 'beach 是海滩。' },
    { q: 'Is it a turtle? 的否定回答是？🐢', options: ['Yes, it is.', "No, it isn't.", 'It is a turtle.'], answer: 1, explain: '否定回答用 No, it isn’t.（不，它不是。）' },
    { q: '下面哪句是复数「它们是海豚」？🐬', options: ["They're dolphins.", "It's a dolphin.", 'What are they?'], answer: 0, explain: 'They’re dolphins. 表示「它们是海豚」。' },
    { q: '蒙蒂和罗拉在故事里参加什么运动？⚽', options: ['soccer', 'swim', 'music'], answer: 0, explain: '他们参加的是足球 soccer（世界杯）。' },
    { q: '字母 s 在 sun 里发什么音？☀️', options: ['/s/', '/z/', '/ʃ/'], answer: 0, explain: 'sun 里的 s 发 /s/ 音。' },
  ],
}
