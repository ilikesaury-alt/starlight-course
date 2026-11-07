// Starlight 1 · Level 1 · Unit 4「Lola the Pilot」课程数据
// 数据来源：src/data/starlight1/raw/unit4.json（教材 PDF 提取的文本）
// 结构对齐 Unit 1 试点（lessons.ts / book.ts / sentenceFrames.ts / reading.ts / extensions.ts / index.ts）。
// 仅从 ./shared 取类型与 w()；不引入 ../starlight 等主目录。

import type { Lesson, LessonBook, SentenceFrame, ReadingPassage, Module, ExtTopic } from './shared'
import { w } from './shared'

// ============================================================================
// 1) 课程数据：11 课（id = PDF 课号）
// ============================================================================
export const u4_lessons: Record<number, Lesson[]> = {
  4: [
    {
      id: 1,
      title: 'Lola the Pilot Vocabulary',
      titleZh: '罗拉飞行员·衣物词汇',
      words: [
        { en: 'hat', zh: '帽子', emoji: '🎩', ipa: '/hæt/' },
        { en: 'jacket', zh: '夹克', emoji: '🧥', ipa: '/ˈdʒækɪt/' },
        { en: 'shirt', zh: '衬衫', emoji: '👔', ipa: '/ʃɜːt/' },
        { en: 'sweater', zh: '毛衣', emoji: '🧶', ipa: '/ˈswetə/' },
        { en: 'T-shirt', zh: 'T恤', emoji: '👕', ipa: '/ˈtiː ʃɜːt/' },
      ],
      sentences: [
        { en: 'Pack your hat.', zh: '把你的帽子装进包里。', hint: '整理行李时说' },
        { en: 'Pack your jacket.', zh: '把你的夹克装进包里。' },
        { en: 'What color is the hat?', zh: '帽子是什么颜色的？', hint: '问颜色' },
        { en: "Let's fly away today!", zh: '我们今天就飞走吧！', hint: '歌曲里的句子' },
        { en: 'Pack your clothes.', zh: '把你的衣服装进包里。', hint: 'clothes = 衣服' },
      ],
    },
    {
      id: 2,
      title: 'Lola the Pilot Vocabulary and Practice',
      titleZh: '衣物词汇与练习',
      words: [
        { en: 'skirt', zh: '短裙', emoji: '👗', ipa: '/skɜːt/' },
        { en: 'dress', zh: '连衣裙', emoji: '👚', ipa: '/dres/' },
        { en: 'socks', zh: '袜子', emoji: '🧦', ipa: '/sɒks/' },
        { en: 'shoes', zh: '鞋', emoji: '👟', ipa: '/ʃuːz/' },
        { en: 'pants', zh: '裤子', emoji: '👖', ipa: '/pænts/' },
      ],
      sentences: [
        { en: 'Pack your skirt.', zh: '把你的短裙装进包里。' },
        { en: 'Pack your dress.', zh: '把你的连衣裙装进包里。' },
        { en: 'Pack your socks.', zh: '把你的袜子装进包里。' },
        { en: 'Pack your shoes.', zh: '把你的鞋装进包里。' },
        { en: 'Pack your pants.', zh: '把你的裤子装进包里。' },
      ],
    },
    {
      id: 3,
      title: 'Lola the Pilot Reading',
      titleZh: '罗拉飞行员·阅读（去度假）',
      words: [
        { en: 'suitcase', zh: '行李箱', emoji: '🧳', ipa: '/ˈsuːtkeɪs/' },
        { en: 'airport', zh: '机场', emoji: '🛫', ipa: '/ˈeəpɔːt/' },
        { en: 'Arctic', zh: '北极', emoji: '🐻‍❄️', ipa: '/ˈɑːktɪk/' },
        { en: 'cold', zh: '冷的', emoji: '🥶', ipa: '/kəʊld/' },
        { en: 'vacation', zh: '假期', emoji: '🏖️', ipa: '/vəˈkeɪʃn/' },
      ],
      sentences: [
        { en: 'This is Pippa the polar bear. She has her suitcase.', zh: '这是皮帕北极熊，她有她的行李箱。' },
        { en: 'Pippa is at the airport. Mickey is at the airport, too.', zh: '皮帕在机场，米奇也在机场。' },
        { en: 'Now Pippa is on vacation. She is in the Arctic.', zh: '现在皮帕在度假，她在北极。' },
        { en: 'It is very cold.', zh: '天气非常冷。' },
        { en: 'I have my sweater and my socks.', zh: '我有我的毛衣和我的袜子。' },
      ],
    },
    {
      id: 4,
      title: 'Lola the Pilot Reading and Practice',
      titleZh: '阅读与练习（热带丛林）',
      words: [
        { en: 'jungle', zh: '丛林', emoji: '🌴', ipa: '/ˈdʒʌŋɡl/' },
        { en: 'hot', zh: '热的', emoji: '🔥', ipa: '/hɒt/' },
        { en: 'sweater', zh: '毛衣', emoji: '🧶', ipa: '/ˈswetə/' },
        { en: 'socks', zh: '袜子', emoji: '🧦', ipa: '/sɒks/' },
        { en: 'shoes', zh: '鞋', emoji: '👟', ipa: '/ʃuːz/' },
      ],
      sentences: [
        { en: 'Hello, Pippa. I am in the jungle. It is very hot.', zh: '你好皮帕，我在丛林里，天气很热。' },
        { en: "I'm wearing a sweater and socks! Phew!", zh: '我穿着一件毛衣和袜子！好热！' },
        { en: "I'm in the Arctic. It's very cold. I'm wearing shoes, a T-shirt and a hat! Brr!", zh: '我在北极，很冷，我穿着鞋子、T恤和帽子！好冷！' },
        { en: "Mickey sends Pippa's suitcase.", zh: '米奇寄回了皮帕的行李箱。' },
        { en: 'Hurray!', zh: '好耶！' },
      ],
    },
    {
      id: 5,
      title: 'Lola the Pilot Language Focus',
      titleZh: '语言重点（穿着表达）',
      words: [
        { en: 'jacket', zh: '夹克', emoji: '🧥', ipa: '/ˈdʒækɪt/' },
        { en: 'dress', zh: '连衣裙', emoji: '👚', ipa: '/dres/' },
        { en: 'skirt', zh: '短裙', emoji: '👗', ipa: '/skɜːt/' },
        { en: 'pants', zh: '裤子', emoji: '👖', ipa: '/pænts/' },
        { en: 'socks', zh: '袜子', emoji: '🧦', ipa: '/sɒks/' },
      ],
      sentences: [
        { en: "I'm wearing a jacket.", zh: '我穿着一件夹克。', hint: 'a + 单数衣物' },
        { en: "I'm wearing a dress.", zh: '我穿着一条连衣裙。' },
        { en: "I'm wearing pants.", zh: '我穿着裤子。', hint: 'pants / socks / shoes 用复数' },
        { en: "I'm wearing socks.", zh: '我穿着袜子。' },
        { en: "I'm wearing shoes, a T-shirt and a hat!", zh: '我穿着鞋子、T恤和一顶帽子！' },
      ],
    },
    {
      id: 6,
      title: 'Lola the Pilot Language Focus and Practice',
      titleZh: '语言重点与练习（天气）',
      words: [
        { en: 'hot', zh: '热的', emoji: '🔥', ipa: '/hɒt/' },
        { en: 'cold', zh: '冷的', emoji: '🥶', ipa: '/kəʊld/' },
        { en: 'sunny', zh: '晴朗的', emoji: '☀️', ipa: '/ˈsʌni/' },
        { en: 'raining', zh: '下雨', emoji: '🌧️', ipa: '/ˈreɪnɪŋ/' },
        { en: 'windy', zh: '有风的', emoji: '💨', ipa: '/ˈwɪndi/' },
        { en: 'snowing', zh: '下雪', emoji: '❄️', ipa: '/ˈsnəʊɪŋ/' },
      ],
      sentences: [
        { en: "What's the weather like?", zh: '天气怎么样？', hint: '问天气' },
        { en: "It's cold.", zh: '天气很冷。' },
        { en: "It's hot.", zh: '天气很热。' },
        { en: "It's sunny and it's hot.", zh: '阳光明媚，天气很热。' },
        { en: "It's windy and it's cold.", zh: '有风，天气很冷。' },
      ],
    },
    {
      id: 7,
      title: 'Lola the Pilot Phonics',
      titleZh: '自然拼读（短音 u）',
      words: [
        { en: 'jump', zh: '跳', emoji: '🦘', ipa: '/dʒʌmp/' },
        { en: 'jungle', zh: '丛林', emoji: '🌴', ipa: '/ˈdʒʌŋɡl/' },
        { en: 'sunny', zh: '晴朗的', emoji: '☀️', ipa: '/ˈsʌni/' },
        { en: 'fun', zh: '有趣的', emoji: '🎉', ipa: '/fʌn/' },
        { en: 'uncle', zh: '叔叔', emoji: '👨', ipa: '/ˈʌŋkl/' },
        { en: 'brush', zh: '刷子', emoji: '🪥', ipa: '/brʌʃ/' },
      ],
      sentences: [
        { en: 'U says u, u, u.', zh: '字母 U 发 u 的音。', hint: '短音 u' },
        { en: 'Uncle, uncle, uncle.', zh: '叔叔，叔叔，叔叔。' },
        { en: 'Jungle, jungle, jungle.', zh: '丛林，丛林，丛林。' },
        { en: 'Sunny, sunny, sunny.', zh: '晴朗，晴朗，晴朗。' },
        { en: 'In the jungle, I jump and swing.', zh: '在丛林里，我跳啊荡啊。' },
      ],
    },
    {
      id: 8,
      title: 'Lola the Pilot CLIL-Geography',
      titleZh: '跨学科·地理（气候与动物）',
      words: [
        { en: 'desert', zh: '沙漠', emoji: '🏜️', ipa: '/ˈdezət/' },
        { en: 'jungle', zh: '丛林', emoji: '🌴', ipa: '/ˈdʒʌŋɡl/' },
        { en: 'Arctic', zh: '北极', emoji: '🐻‍❄️', ipa: '/ˈɑːktɪk/' },
        { en: 'monkey', zh: '猴子', emoji: '🐒', ipa: '/ˈmʌŋki/' },
        { en: 'lizard', zh: '蜥蜴', emoji: '🦎', ipa: '/ˈlɪzəd/' },
        { en: 'polar bear', zh: '北极熊', emoji: '🐻‍❄️', ipa: '/ˈpəʊlə beə/' },
      ],
      sentences: [
        { en: 'Climate is the normal weather in a place.', zh: '气候是一个地方平常的天气。' },
        { en: 'The jungle is hot and rainy. Monkeys live in the jungle.', zh: '丛林又热又多雨，猴子住在丛林里。' },
        { en: 'The desert is hot and sunny. Lizards live in the desert.', zh: '沙漠又热又晴朗，蜥蜴住在沙漠里。' },
        { en: 'The Arctic is cold and windy. Polar bears live in the Arctic.', zh: '北极又冷又有风，北极熊住在北极。' },
        { en: 'I am in the Arctic / desert / jungle.', zh: '我在北极／沙漠／丛林。' },
      ],
    },
    {
      id: 9,
      title: 'Lola the Pilot Practice',
      titleZh: '综合练习（天气与穿着）',
      words: [
        { en: 'snowing', zh: '下雪', emoji: '❄️', ipa: '/ˈsnəʊɪŋ/' },
        { en: 'raining', zh: '下雨', emoji: '🌧️', ipa: '/ˈreɪnɪŋ/' },
        { en: 'sunny', zh: '晴朗的', emoji: '☀️', ipa: '/ˈsʌni/' },
        { en: 'windy', zh: '有风的', emoji: '💨', ipa: '/ˈwɪndi/' },
        { en: 'sweater', zh: '毛衣', emoji: '🧶', ipa: '/ˈswetə/' },
      ],
      sentences: [
        { en: "What's the weather like? It's windy.", zh: '天气怎么样？有风。' },
        { en: "It's snowy and cold in New York today.", zh: '今天纽约下雪又冷。' },
        { en: "It's sunny and hot in Sydney today.", zh: '今天悉尼晴朗又热。' },
        { en: "It's windy in Tokyo today.", zh: '今天东京有风。' },
        { en: 'You can wear a hat and a sweater.', zh: '你可以戴帽子、穿毛衣。' },
      ],
    },
    {
      id: 10,
      title: 'Game - Four in a Row',
      titleZh: '游戏·四子连珠',
      words: [
        { en: 'sister', zh: '姐姐／妹妹', emoji: '👧', ipa: '/ˈsɪstə/' },
        { en: 'brother', zh: '兄弟', emoji: '👦', ipa: '/ˈbrʌðə/' },
        { en: 'grandma', zh: '奶奶／外婆', emoji: '👵', ipa: '/ˈɡrænmɑː/' },
        { en: 'sweater', zh: '毛衣', emoji: '🧶', ipa: '/ˈswetə/' },
        { en: 'snowing', zh: '下雪', emoji: '❄️', ipa: '/ˈsnəʊɪŋ/' },
      ],
      sentences: [
        { en: 'This is my sister.', zh: '这是我的姐姐。', hint: '游戏里复习家人' },
        { en: 'This is my grandma.', zh: '这是我的奶奶。' },
        { en: 'These are my brothers.', zh: '这些是我的兄弟们。' },
        { en: "I'm wearing a sweater.", zh: '我穿着一件毛衣。' },
        { en: "It's snowing.", zh: '在下雪。' },
      ],
    },
    {
      id: 11,
      title: 'Culture - India',
      titleZh: '文化·印度',
      words: [
        { en: 'India', zh: '印度', emoji: '🇮🇳', ipa: '/ˈɪndiə/' },
        { en: 'Diwali', zh: '排灯节', emoji: '🪔', ipa: '/ˈdiːwɑːli/' },
        { en: 'sari', zh: '沙丽', emoji: '👗', ipa: '/ˈsɑːri/' },
        { en: 'sherwani', zh: '男式长外套', emoji: '🧥', ipa: '/ʃɜːˈwɑːni/' },
        { en: 'festival', zh: '节日', emoji: '🎉', ipa: '/ˈfestɪvl/' },
      ],
      sentences: [
        { en: "Hello! I'm Pia. I'm from India.", zh: '你好！我是皮亚，我来自印度。' },
        { en: 'It is Diwali. Diwali is an Indian festival.', zh: '今天是排灯节，排灯节是印度的节日。' },
        { en: "We wear special clothes. I'm wearing a new dress.", zh: '我们穿特别的衣服，我穿着一条新裙子。' },
        { en: 'My aunt has a red sari.', zh: '我的阿姨有一条红色的沙丽。' },
        { en: 'My uncle has a long jacket called a sherwani.', zh: '我的叔叔有一件叫 sherwani 的长外套。' },
      ],
    },
  ],
}

// ============================================================================
// 2) 课本原文：按活动分章节，只保留教学相关的真实英文 + 中文
// ============================================================================
export const u4_book: Record<string, LessonBook> = {
  '4-1': {
    title: 'Lola the Pilot Vocabulary',
    sections: [
      { chapter: 'Warm up: pack the clothes.', chapterZh: '热身：整理行李。', pages: [
        { text: 'Look and say.', textZh: '看一看，说一说。' },
        { text: 'This little girl will go on a vacation with her family.', textZh: '这个小姑娘要和她的家人去度假。' },
        { text: "Let's help her pack the clothes!", textZh: '我们帮她把衣服装进包里吧！' },
      ] },
      { chapter: 'Focus on: clothes.', chapterZh: '重点词汇：衣物。', pages: [
        { text: 'hat', textZh: '帽子' },
        { text: 'jacket', textZh: '夹克' },
        { text: 'shirt', textZh: '衬衫' },
        { text: 'sweater', textZh: '毛衣' },
        { text: 'T-shirt', textZh: 'T恤' },
      ] },
      { chapter: 'Pack your clothes!', chapterZh: '把衣服装进包里！', pages: [
        { text: 'Pack your hat.', textZh: '把你的帽子装进包里。' },
        { text: 'Pack your jacket.', textZh: '把你的夹克装进包里。' },
        { text: 'Pack your shirt.', textZh: '把你的衬衫装进包里。' },
        { text: 'Pack your sweater.', textZh: '把你的毛衣装进包里。' },
        { text: 'Pack your T-shirt.', textZh: '把你的T恤装进包里。' },
      ] },
      { chapter: 'Listen and sing along.', chapterZh: '听一听，一起唱。', pages: [
        { text: "Let's fly! Let's fly away today!", textZh: '我们飞吧！我们今天就飞走吧！' },
        { text: 'Pack your hat. Let’s fly!', textZh: '把你的帽子装好，我们飞吧！' },
        { text: 'Pack your shirt. Let’s fly!', textZh: '把你的衬衫装好，我们飞吧！' },
        { text: 'Pack your jacket. Let’s fly!', textZh: '把你的夹克装好，我们飞吧！' },
        { text: 'That’s right!', textZh: '没错！' },
      ] },
    ],
  },
  '4-2': {
    title: 'Lola the Pilot Vocabulary and Practice',
    sections: [
      { chapter: 'Focus on: more clothes.', chapterZh: '重点词汇：更多衣物。', pages: [
        { text: 'skirt', textZh: '短裙' },
        { text: 'dress', textZh: '连衣裙' },
        { text: 'socks', textZh: '袜子' },
        { text: 'shoes', textZh: '鞋' },
        { text: 'pants', textZh: '裤子' },
      ] },
      { chapter: 'Pack your clothes!', chapterZh: '把衣服装进包里！', pages: [
        { text: 'Pack your skirt.', textZh: '把你的短裙装进包里。' },
        { text: 'Pack your dress.', textZh: '把你的连衣裙装进包里。' },
        { text: 'Pack your socks.', textZh: '把你的袜子装进包里。' },
        { text: 'Pack your shoes.', textZh: '把你的鞋装进包里。' },
        { text: 'Pack your pants.', textZh: '把你的裤子装进包里。' },
      ] },
      { chapter: 'Listen and sing along.', chapterZh: '听一听，一起唱。', pages: [
        { text: 'Pack your sweater. Let’s fly tonight!', textZh: '把你的毛衣装好，我们今晚就飞！' },
        { text: 'Pack your dress. Let’s fly!', textZh: '把你的连衣裙装好，我们飞吧！' },
        { text: 'Pack your skirt. Let’s fly!', textZh: '把你的短裙装好，我们飞吧！' },
        { text: 'Pack your T-shirt. Let’s fly!', textZh: '把你的T恤装好，我们飞吧！' },
      ] },
    ],
  },
  '4-3': {
    title: 'Lola the Pilot Reading',
    sections: [
      { chapter: 'Lead in: On Vacation.', chapterZh: '导入：去度假。', pages: [
        { text: 'On Vacation', textZh: '去度假' },
        { text: 'What are these animals?', textZh: '这些是什么动物？' },
      ] },
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'This is Pippa the polar bear. She has her suitcase.', textZh: '这是皮帕北极熊，她有她的行李箱。' },
        { text: 'This is Mickey the monkey. He has his suitcase, too.', textZh: '这是米奇猴子，他也有他的行李箱。' },
        { text: 'Pippa is at the airport. Mickey is at the airport, too.', textZh: '皮帕在机场，米奇也在机场。' },
        { text: 'Now Pippa is on vacation. She is in the Arctic. It is very cold.', textZh: '现在皮帕在度假，她在北极，天气非常冷。' },
        { text: 'I have my sweater and my socks. I have my jacket.', textZh: '我有我的毛衣和袜子，我有我的夹克。' },
        { text: 'I have my T-shirt and my hat. I have my shoes.', textZh: '我有我的T恤和帽子，我有我的鞋子。' },
      ] },
      { chapter: 'Oh no!', chapterZh: '哦不！', pages: [
        { text: 'Oh no! A T-shirt, a hat and shoes!', textZh: '哦不！是一件T恤、一顶帽子和鞋子！' },
        { text: 'Oh no! A dress, a sweater and socks!', textZh: '哦不！是一条连衣裙、一件毛衣和袜子！' },
      ] },
    ],
  },
  '4-4': {
    title: 'Lola the Pilot Reading and Practice',
    sections: [
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'Now Mickey is on vacation, too. He is in the jungle. It is very hot.', textZh: '现在米奇也在度假，他在丛林里，天气很热。' },
        { text: "Hello, Mickey. I'm in the Arctic. It's very cold. I'm wearing shoes, a T-shirt and a hat! Brr!", textZh: '你好米奇，我在北极，很冷，我穿着鞋子、T恤和帽子！好冷！' },
        { text: "Hello, Pippa. I'm in the jungle. It's very hot. I'm wearing a sweater and socks! Phew!", textZh: '你好皮帕，我在丛林，很热，我穿着一件毛衣和袜子！好热！' },
      ] },
      { chapter: 'Send the suitcases.', chapterZh: '寄回行李箱。', pages: [
        { text: "Mickey sends Pippa's suitcase.", textZh: '米奇寄回了皮帕的行李箱。' },
        { text: "Pippa sends Mickey's suitcase.", textZh: '皮帕寄回了米奇的行李箱。' },
        { text: 'Hurray!', textZh: '好耶！' },
      ] },
      { chapter: 'Show Time.', chapterZh: '展示时间。', pages: [
        { text: "Hello, everyone! I'm Mary.", textZh: '大家好！我是玛丽。' },
        { text: "I'm wearing a hat and a skirt.", textZh: '我戴着一顶帽子，穿着一条短裙。' },
      ] },
    ],
  },
  '4-5': {
    title: 'Lola the Pilot Language Focus',
    sections: [
      { chapter: 'Role play: where are they?', chapterZh: '角色扮演：他们在哪？', pages: [
        { text: "Hello, Mickey. I'm in the Arctic. It's very cold. I'm wearing shoes, a T-shirt and a hat! Brr!", textZh: '你好米奇，我在北极，很冷，我穿着鞋子、T恤和帽子！好冷！' },
        { text: "Hello, Pippa. I'm in the jungle. It's very hot. I'm wearing a sweater and socks! Phew!", textZh: '你好皮帕，我在丛林，很热，我穿着毛衣和袜子！好热！' },
      ] },
      { chapter: "Grammar: I'm wearing...", chapterZh: '语法：我穿着……', pages: [
        { text: "I'm wearing a hat / sweater / T-shirt / jacket / shirt / dress / skirt.", textZh: '我穿着帽子／毛衣／T恤／夹克／衬衫／连衣裙／短裙。' },
        { text: "I'm wearing pants / socks / shoes.", textZh: '我穿着裤子／袜子／鞋。' },
      ] },
    ],
  },
  '4-6': {
    title: 'Lola the Pilot Language Focus and Practice',
    sections: [
      { chapter: 'Focus on: weather words.', chapterZh: '重点词汇：天气。', pages: [
        { text: 'hot', textZh: '热的' },
        { text: 'cold', textZh: '冷的' },
        { text: 'sunny', textZh: '晴朗的' },
        { text: 'raining', textZh: '下雨' },
        { text: 'windy', textZh: '有风的' },
        { text: 'snowing', textZh: '下雪' },
      ] },
      { chapter: 'Listen and sing along.', chapterZh: '听一听，一起唱。', pages: [
        { text: "It's snowing. It's snowing. It's windy and it's cold in the Arctic!", textZh: '下雪了，下雪了，北极有风又寒冷！' },
        { text: "It's raining. It's raining. It's sunny and it's hot in the jungle!", textZh: '下雨了，下雨了，丛林晴朗又炎热！' },
      ] },
      { chapter: "Grammar: What's the weather like?", chapterZh: '语法：天气怎么样？', pages: [
        { text: "What's the weather like?", textZh: '天气怎么样？' },
        { text: "It's hot. It's cold. It's sunny. It's raining. It's windy. It's snowing.", textZh: '很热。很冷。晴朗。下雨。有风。下雪。' },
      ] },
    ],
  },
  '4-7': {
    title: 'Lola the Pilot Phonics',
    sections: [
      { chapter: 'Chant Time.', chapterZh: 'Chant 时间。', pages: [
        { text: 'U says u, u u u,', textZh: '字母 U 发 u 的音，u u u，' },
        { text: 'Uncle, uncle, uncle,', textZh: '叔叔，叔叔，叔叔，' },
        { text: 'Jungle, jungle, jungle,', textZh: '丛林，丛林，丛林，' },
        { text: 'Sunny, sunny, sunny.', textZh: '晴朗，晴朗，晴朗。' },
      ] },
      { chapter: 'Learn and read the /u/ words.', chapterZh: '学习并拼读 /u/ 单词。', pages: [
        { text: 'jump', textZh: '跳' },
        { text: 'jungle', textZh: '丛林' },
        { text: 'sunny', textZh: '晴朗的' },
        { text: 'fun', textZh: '有趣的' },
        { text: 'uncle', textZh: '叔叔' },
        { text: 'brush', textZh: '刷子' },
      ] },
      { chapter: 'Read these sentences.', chapterZh: '读一读这些句子。', pages: [
        { text: 'In the jungle, I jump and swing.', textZh: '在丛林里，我跳啊荡啊。' },
        { text: "It's sunny and it's hot.", textZh: '阳光明媚，天气很热。' },
        { text: "I'm in the jungle with Mum and uncle.", textZh: '我和妈妈、叔叔在丛林里。' },
        { text: "It's sunny and it's fun.", textZh: '阳光明媚，真好玩。' },
      ] },
    ],
  },
  '4-8': {
    title: 'Lola the Pilot CLIL-Geography',
    sections: [
      { chapter: 'Focus on: places.', chapterZh: '重点词汇：地貌。', pages: [
        { text: 'desert', textZh: '沙漠' },
        { text: 'Arctic', textZh: '北极' },
        { text: 'jungle', textZh: '丛林' },
      ] },
      { chapter: 'Climates.', chapterZh: '气候。', pages: [
        { text: 'Climate is the normal weather in a place.', textZh: '气候是一个地方平常的天气。' },
        { text: 'Different animals and plants live in different climates.', textZh: '不同的动物和植物生活在不同的气候里。' },
      ] },
      { chapter: 'Where do they live?', chapterZh: '它们住在哪里？', pages: [
        { text: 'The jungle is hot and rainy. Monkeys live in the jungle.', textZh: '丛林又热又多雨，猴子住在丛林里。' },
        { text: 'The desert is hot and sunny. Lizards live in the desert.', textZh: '沙漠又热又晴朗，蜥蜴住在沙漠里。' },
        { text: 'The Arctic is cold and windy. Polar bears live in the Arctic.', textZh: '北极又冷又有风，北极熊住在北极。' },
      ] },
    ],
  },
  '4-9': {
    title: 'Lola the Pilot Practice',
    sections: [
      { chapter: 'Match the weather words.', chapterZh: '天气词配对。', pages: [
        { text: 'snowing', textZh: '下雪' },
        { text: 'raining', textZh: '下雨' },
        { text: 'sunny', textZh: '晴朗的' },
        { text: 'windy', textZh: '有风的' },
      ] },
      { chapter: 'Match and say: I’m wearing...', chapterZh: '连一连，说一说：我穿着……', pages: [
        { text: 'I’m wearing a hat, a T-shirt, and shoes.', textZh: '我戴着帽子、穿着T恤和鞋子。' },
        { text: 'I’m wearing a dress, socks, and shoes.', textZh: '我穿着连衣裙、袜子和鞋子。' },
        { text: 'I’m wearing a shirt and pants.', textZh: '我穿着衬衫和裤子。' },
      ] },
      { chapter: "What's the weather like?", chapterZh: '天气怎么样？', pages: [
        { text: "It's windy.", textZh: '有风。' },
        { text: 'It’s snowy and cold.', textZh: '下雪又冷。' },
        { text: 'It’s sunny and hot.', textZh: '晴朗又热。' },
      ] },
      { chapter: 'Complete the weather forecast.', chapterZh: '完成天气预报。', pages: [
        { text: 'Hello, everyone. It’s snowy and cold in New York today.', textZh: '大家好，今天纽约下雪又冷。' },
        { text: 'It’s sunny and hot in Sydney today.', textZh: '今天悉尼晴朗又热。' },
        { text: 'It’s windy in Tokyo today.', textZh: '今天东京有风。' },
      ] },
    ],
  },
  '4-10': {
    title: 'Game - Four in a Row',
    sections: [
      { chapter: "Warm up: let's pack up.", chapterZh: '热身：我们来收拾行李。', pages: [
        { text: "Let's pack up.", textZh: '我们把行李收拾好。' },
      ] },
      { chapter: 'Say the sentences and find the words.', chapterZh: '说句子，找出单词。', pages: [
        { text: 'This is my ____________.', textZh: '这是我的________。' },
        { text: 'These are my __________.', textZh: '这些是我的______。' },
        { text: 'She has _______ hair.', textZh: '她有______头发。' },
        { text: 'He has ________ eyes.', textZh: '他有______眼睛。' },
      ] },
      { chapter: 'Play the board game.', chapterZh: '玩棋盘游戏。', pages: [
        { text: 'She has long hair.', textZh: '她有长头发。' },
        { text: 'I’m wearing a sweater.', textZh: '我穿着一件毛衣。' },
        { text: 'It’s rainy.', textZh: '在下雨。' },
        { text: 'It’s snowing.', textZh: '在下雪。' },
        { text: 'This is my grandma.', textZh: '这是我的奶奶。' },
        { text: 'These are my brothers.', textZh: '这些是我的兄弟们。' },
      ] },
    ],
  },
  '4-11': {
    title: 'Culture - India',
    sections: [
      { chapter: 'Warm up: guess the country.', chapterZh: '热身：猜猜是哪个国家。', pages: [
        { text: 'Do you know which country it is?', textZh: '你知道这是哪个国家吗？' },
        { text: 'It’s India.', textZh: '是印度。' },
      ] },
      { chapter: 'Learn about India.', chapterZh: '了解印度。', pages: [
        { text: 'It’s an Indian festival.', textZh: '这是一个印度的节日。' },
        { text: 'Diwali', textZh: '排灯节（印度最隆重的节日）' },
        { text: 'sari', textZh: '沙丽（印度女性传统服装）' },
        { text: 'sherwani', textZh: '男式长外套（印度男性服饰）' },
      ] },
      { chapter: 'Reading: meet Pia.', chapterZh: '阅读：认识皮亚。', pages: [
        { text: "Hello! I'm Pia. I'm from India.", textZh: '你好！我是皮亚，我来自印度。' },
        { text: 'This is my family. Today is a special day.', textZh: '这是我的家人，今天是个特别的日子。' },
        { text: 'It’s Diwali. Diwali is an Indian festival.', textZh: '今天是排灯节，排灯节是印度的节日。' },
        { text: "We wear special clothes. I'm wearing a new dress.", textZh: '我们穿特别的衣服，我穿着一条新裙子。' },
        { text: 'My aunt has a red sari.', textZh: '我的阿姨有一条红色的沙丽。' },
        { text: 'My uncles and my cousin have long jackets called sherwanis.', textZh: '我的叔叔们和表弟有长长的外套，叫 sherwani。' },
      ] },
    ],
  },
}

// ============================================================================
// 3) 句型框架卡：来自 Language Focus 课（L5 穿着 / L6 天气）
// ============================================================================
export const u4_frames: SentenceFrame[] = [
  // L1 · 'Pack your hat.'
  {
    id: 'l1-lola-the-pilot-1-pack-your',
    pattern: 'Pack your ___.',
    blanks: [
      {
        options: ['hat', 'jacket', 'shirt', 'sweater', 'T-shirt'],
        answer: 0,
        zhOptions: ['把你的帽子装进包里。', '把你的夹克装进包里。', '把你的衬衫装进包里。', '把你的毛衣装进包里。', '把你的T恤装进包里。'],
      },
    ],
    zh: '把你的帽子装进包里。',
    hint: '整理行李时说 Pack your ___',
    unitSlug: 'lola-the-pilot',
    lessonId: 1,
  },
  // L2 · 'Pack your shoes.'
  {
    id: 'l1-lola-the-pilot-2-pack-your',
    pattern: 'Pack your ___.',
    blanks: [
      {
        options: ['shoes', 'socks', 'pants', 'skirt', 'dress'],
        answer: 0,
        zhOptions: ['把你的鞋装进包里。', '把你的袜子装进包里。', '把你的裤子装进包里。', '把你的短裙装进包里。', '把你的连衣裙装进包里。'],
      },
    ],
    zh: '把你的鞋装进包里。',
    hint: '这一课新学的五件衣物都能放进 Pack your ___',
    unitSlug: 'lola-the-pilot',
    lessonId: 2,
  },
  // L3 · 'I have my sweater and my socks.'
  {
    id: 'l1-lola-the-pilot-3-have-my',
    pattern: 'I have my ___ and my socks.',
    blanks: [
      {
        options: ['sweater', 'jacket', 'T-shirt', 'hat', 'shoes'],
        answer: 0,
        zhOptions: ['我有我的毛衣和我的袜子。', '我有我的夹克和我的袜子。', '我有我的T恤和我的袜子。', '我有我的帽子和我的袜子。', '我有我的鞋和我的袜子。'],
      },
    ],
    zh: '我有我的毛衣和我的袜子。',
    hint: '故事里皮帕数自己的衣服',
    unitSlug: 'lola-the-pilot',
    lessonId: 3,
  },
  // L4 · "Mickey sends Pippa's suitcase."
  {
    id: 'l1-lola-the-pilot-4-sends-suitcase',
    pattern: "Mickey sends Pippa's ___.",
    blanks: [
      {
        options: ['suitcase', 'jacket', 'sweater', 'hat', 'socks'],
        answer: 0,
        zhOptions: ['米奇寄回了皮帕的行李箱。', '米奇寄回了皮帕的夹克。', '米奇寄回了皮帕的毛衣。', '米奇寄回了皮帕的帽子。', '米奇寄回了皮帕的袜子。'],
      },
    ],
    zh: '米奇寄回了皮帕的行李箱。',
    hint: '故事结尾，是谁把行李箱寄回来了？',
    unitSlug: 'lola-the-pilot',
    lessonId: 4,
  },
  {
    id: 'l1-lola-the-pilot-5-wearing-a',
    pattern: "I'm wearing a ___.",
    blanks: [
      {
        options: ['jacket', 'T-shirt', 'shirt', 'dress', 'skirt'],
        answer: 0,
        zhOptions: ['我穿着一件夹克。', '我穿着一件T恤。', '我穿着一件衬衫。', '我穿着一条连衣裙。', '我穿着一条短裙。'],
      },
    ],
    zh: '我穿着一件夹克。',
    hint: "用 I'm wearing 说说你穿了什么",
    unitSlug: 'lola-the-pilot',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-pilot-5-wearing-plural',
    pattern: "I'm wearing ___.",
    blanks: [
      {
        options: ['pants', 'socks', 'shoes'],
        answer: 0,
        zhOptions: ['我穿着裤子。', '我穿着袜子。', '我穿着鞋子。'],
      },
    ],
    zh: '我穿着裤子。',
    hint: 'pants / socks / shoes 没有 a，直接用复数',
    unitSlug: 'lola-the-pilot',
    lessonId: 5,
  },
  // id 保留历史命名（SRS 卡键 = frame:<id>），内容改挂 L5 真实句 "I'm wearing shoes, a T-shirt and a hat!"
  {
    id: 'l1-lola-the-pilot-5-have-my',
    pattern: "I'm wearing shoes, a T-shirt and ___!",
    blanks: [
      {
        options: ['a hat', 'a jacket', 'a sweater', 'socks'],
        answer: 0,
        zhOptions: ['我穿着鞋子、T恤和一顶帽子！', '我穿着鞋子、T恤和一件夹克！', '我穿着鞋子、T恤和一件毛衣！', '我穿着鞋子、T恤和袜子！'],
      },
    ],
    zh: '我穿着鞋子、T恤和一顶帽子！',
    hint: '故事里皮帕在北极穿了什么？',
    unitSlug: 'lola-the-pilot',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-pilot-6-its-weather',
    pattern: "It's ___.",
    blanks: [
      {
        options: ['cold', 'hot', 'sunny', 'windy', 'snowing'],
        answer: 0,
        zhOptions: ['很冷。', '很热。', '晴朗。', '有风。', '在下雪。'],
      },
    ],
    zh: '很冷。',
    hint: '回答天气怎么样',
    unitSlug: 'lola-the-pilot',
    lessonId: 6,
  },
  {
    id: 'l1-lola-the-pilot-6-weather-like',
    pattern: "What's the ___ like?",
    blanks: [
      {
        options: ['weather', 'climate', 'jungle', 'Arctic'],
        answer: 0,
        zhOptions: ['天气怎么样？', '气候怎么样？', '丛林是什么样的？', '北极是什么样的？'],
      },
    ],
    zh: '天气怎么样？',
    hint: '问天气怎么说',
    unitSlug: 'lola-the-pilot',
    lessonId: 6,
  },
  // L7 · 'In the jungle, I jump and swing.'
  {
    id: 'l1-lola-the-pilot-7-jungle-jump',
    pattern: 'In the ___, I jump and swing.',
    blanks: [
      {
        options: ['jungle', 'Arctic', 'desert', 'airport'],
        answer: 0,
        zhOptions: ['在丛林里，我跳啊荡啊。', '在北极，我跳啊荡啊。', '在沙漠里，我跳啊荡啊。', '在机场，我跳啊荡啊。'],
      },
    ],
    zh: '在丛林里，我跳啊荡啊。',
    hint: '短音 u 的 chant：jungle / jump',
    unitSlug: 'lola-the-pilot',
    lessonId: 7,
  },
  // L8 · 'The jungle is hot and rainy. Monkeys live in the jungle.'
  {
    id: 'l1-lola-the-pilot-8-climate-place',
    pattern: 'The ___ is hot and rainy. Monkeys live in the jungle.',
    blanks: [
      {
        options: ['jungle', 'desert', 'Arctic', 'airport'],
        answer: 0,
        zhOptions: ['丛林又热又多雨，猴子住在丛林里。', '沙漠又热又多雨，猴子住在丛林里。', '北极又热又多雨，猴子住在丛林里。', '机场又热又多雨，猴子住在丛林里。'],
      },
    ],
    zh: '丛林又热又多雨，猴子住在丛林里。',
    hint: '想想哪种地方又热又多雨',
    unitSlug: 'lola-the-pilot',
    lessonId: 8,
  },
  // L9 · "It's windy in Tokyo today."
  {
    id: 'l1-lola-the-pilot-9-weather-city',
    pattern: "It's ___ in Tokyo today.",
    blanks: [
      {
        options: ['windy', 'sunny', 'snowing', 'raining'],
        answer: 0,
        zhOptions: ['今天东京有风。', '今天东京晴朗。', '今天东京下雪。', '今天东京下雨。'],
      },
    ],
    zh: '今天东京有风。',
    hint: '看天气预报，说说某个城市今天的天气',
    unitSlug: 'lola-the-pilot',
    lessonId: 9,
  },
  // L10 · 'This is my sister.'
  {
    id: 'l1-lola-the-pilot-10-this-is-my',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['sister', 'grandma', 'brother', 'sweater'],
        answer: 0,
        zhOptions: ['这是我的姐姐。', '这是我的奶奶。', '这是我的兄弟。', '这是我的毛衣。'],
      },
    ],
    zh: '这是我的姐姐。',
    hint: '游戏里介绍自己的家人',
    unitSlug: 'lola-the-pilot',
    lessonId: 10,
  },
  // L11 · 'My aunt has a red sari.'
  {
    id: 'l1-lola-the-pilot-11-red-sari',
    pattern: 'My aunt has a red ___.',
    blanks: [
      {
        options: ['sari', 'sherwani', 'dress', 'jacket'],
        answer: 0,
        zhOptions: ['我的阿姨有一条红色的沙丽。', '我的阿姨有一件红色的男式长外套。', '我的阿姨有一条红色的连衣裙。', '我的阿姨有一件红色的夹克。'],
      },
    ],
    zh: '我的阿姨有一条红色的沙丽。',
    hint: '印度排灯节里，阿姨穿什么？',
    unitSlug: 'lola-the-pilot',
    lessonId: 11,
  },
]

// ============================================================================
// 4) 阅读短文：用学过的词把故事讲完（L3 / L4 主故事，L11 印度文化）
// ============================================================================
export const u4_reading: Record<string, ReadingPassage> = {
  '4-1': {
    title: 'Pack Your Clothes',
    titleZh: '收拾行李啦',
    paragraphs: [
      [
        { en: 'Lola will go on a vacation today.', zh: '罗拉今天要去度假啦。' },
        { en: 'Her family is at home with a big bag.', zh: '一家人都在家，面前摆着一个大包。' },
        { en: '"Pack your clothes, Lola!" says Mom.', zh: '“把衣服装进包里吧，罗拉！”妈妈说。' },
        { en: 'Lola puts a hat and a T-shirt in the bag.', zh: '罗拉把一顶帽子和一件T恤放进包里。' },
      ],
      [
        { en: 'She packs a shirt, a jacket and a sweater.', zh: '她又装进一件衬衫、一件夹克和一件毛衣。' },
        { en: '"What color is the hat?" asks Lola.', zh: '“帽子是什么颜色的呀？”罗拉问。' },
        { en: '"It is red, and it is on your head!" says Mom.', zh: '“是红色的呀，而且就在你头上呢！”妈妈说。' },
        { en: 'The hat is not in the bag at all.', zh: '原来帽子根本没在包里。' },
      ],
      [
        { en: 'Lola laughs and puts the red hat in the bag.', zh: '罗拉笑了起来，把红帽子也放进了包里。' },
        { en: 'Now the bag is ready, and the family smiles.', zh: '这下包收拾好了，一家人都笑了。' },
        { en: '"Let\'s fly away today!" says Lola.', zh: '“我们今天就飞走吧！”罗拉说。' },
      ],
    ],
  },
  '4-2': {
    title: 'Where Are My Shoes?',
    titleZh: '我的鞋在哪儿？',
    paragraphs: [
      [
        { en: 'It is evening, and the family will fly tonight.', zh: '傍晚到啦，一家人今晚就要飞走喽。' },
        { en: 'Lola opens a new bag for her clothes.', zh: '罗拉打开一个新包，准备装衣服。' },
        { en: '"Pack your skirt and your dress," says Mom.', zh: '“把短裙和连衣裙装进去吧。”妈妈说。' },
        { en: 'Lola puts the skirt and the dress in the bag.', zh: '罗拉把短裙和连衣裙放进了包里。' },
      ],
      [
        { en: 'She has socks and pants, but no shoes.', zh: '袜子、裤子都有了，可鞋子不见了。' },
        { en: '"Where are my shoes?" asks Lola.', zh: '“我的鞋在哪儿呀？”罗拉问。' },
        { en: '"Look under the bed!" says her little sister.', zh: '“往床底下看看！”她的小妹妹说。' },
        { en: 'One shoe is under the bed, and one is on the chair.', zh: '一只鞋在床底下，另一只在椅子上。' },
      ],
      [
        { en: 'Lola laughs and puts the shoes with the socks.', zh: '罗拉笑了，把鞋和袜子放在了一起。' },
        { en: 'Now the pants, the socks and the shoes are in the bag.', zh: '现在裤子、袜子和鞋子都进包啦。' },
        { en: '"Let\'s fly tonight!" says Lola.', zh: '“我们今晚就飞吧！”罗拉说。' },
      ],
    ],
  },
  '4-3': {
    title: 'On Vacation',
    titleZh: '去度假',
    paragraphs: [
      [
        { en: 'This is Pippa the polar bear. She has her suitcase.', zh: '这是皮帕北极熊，她有她的行李箱。' },
        { en: 'This is Mickey the monkey. He has his suitcase, too.', zh: '这是米奇猴子，他也有他的行李箱。' },
        { en: 'Pippa is at the airport. Mickey is at the airport, too.', zh: '皮帕在机场，米奇也在机场。' },
      ],
      [
        { en: 'Now Pippa is on vacation. She is in the Arctic. It is very cold.', zh: '现在皮帕在度假，她在北极，天气非常冷。' },
        { en: 'Pippa has her sweater, her socks and her jacket.', zh: '皮帕有她的毛衣、袜子和夹克。' },
        { en: 'Oh no! A T-shirt, a hat and shoes!', zh: '哦不！是一件T恤、一顶帽子和鞋子！' },
      ],
      [
        { en: 'Mickey is on vacation, too. He is in the jungle. It is very hot.', zh: '米奇也在度假，他在丛林里，天气非常热。' },
        { en: 'Mickey has his T-shirt and his hat. He has his shoes.', zh: '米奇有他的T恤和帽子，他有他的鞋子。' },
        { en: 'Oh no! A sweater, a jacket and socks!', zh: '哦不！是一件毛衣、一件夹克和袜子！' },
      ],
    ],
  },
  '4-4': {
    title: 'The Wrong Suitcases',
    titleZh: '搞错的行李箱',
    paragraphs: [
      [
        { en: 'Mickey is in the jungle, and it is very hot.', zh: '米奇在丛林里，那儿热极了。' },
        { en: 'He opens the suitcase and looks at the clothes.', zh: '他打开行李箱，看着里面的衣服。' },
        { en: '"A sweater and socks! Phew!" says Mickey.', zh: '“毛衣和袜子！好热呀！”米奇说。' },
        { en: '"These are not my clothes!" he says.', zh: '“这些才不是我的衣服呢！”他说。' },
      ],
      [
        { en: 'Pippa is in the Arctic, and it is very cold.', zh: '皮帕在北极，那儿冷极了。' },
        { en: '"I have shoes, a T-shirt and a hat! Brr!" she says.', zh: '“我只有鞋子、T恤和帽子！好冷呀！”她说。' },
        { en: '"My sweater is not here!" says Pippa.', zh: '“我的毛衣不在这儿呀！”皮帕说。' },
        { en: 'The two friends are not happy at all.', zh: '两个好朋友一点也不开心。' },
      ],
      [
        { en: 'Mickey sends the suitcase to Pippa.', zh: '米奇把行李箱寄给皮帕。' },
        { en: 'Pippa sends the suitcase to Mickey.', zh: '皮帕把行李箱寄给米奇。' },
        { en: '"Hurray! Now we have the right clothes!" they say.', zh: '“好耶！现在我们拿到对的衣服啦！”他们说。' },
      ],
    ],
  },
  '4-5': {
    title: 'The Clothes Show',
    titleZh: '穿衣小表演',
    paragraphs: [
      [
        { en: 'It is morning, and the family is at home.', zh: '早上啦，一家人都在家。' },
        { en: '"Hello, everyone! Look at my new dress," says Lola.', zh: '“大家好！快看我的新裙子。”罗拉说。' },
        { en: 'Her sister has a red skirt and a jacket.', zh: '姐姐穿着一条红短裙和一件夹克。' },
      ],
      [
        { en: '"I am wearing socks, but where are my pants?" asks Ben.', zh: '“我穿着袜子呢，可我的裤子在哪儿？”本问。' },
        { en: 'Ben looks in the bag and in the box.', zh: '本在包里找，又在盒子里找。' },
        { en: '"I cannot find my pants!" he says.', zh: '“我找不到我的裤子啦！”他说。' },
        { en: 'Lola looks under the bed and laughs.', zh: '罗拉往床底下一看，笑了起来。' },
      ],
      [
        { en: '"Here are your pants, Ben!" she says.', zh: '“你的裤子在这儿呢，本！”她说。' },
        { en: 'Ben puts on the pants and the socks.', zh: '本穿上裤子和袜子。' },
        { en: '"Now I\'m wearing pants and socks!" says Ben.', zh: '“现在我穿着裤子和袜子啦！”本说。' },
        { en: 'The family smiles, and the little show starts.', zh: '一家人都笑了，小小的表演开始喽。' },
      ],
    ],
  },
  '4-6': {
    title: 'What\'s the Weather Like?',
    titleZh: '今天天气怎么样？',
    paragraphs: [
      [
        { en: 'Lola and Pippa are on vacation in the Arctic.', zh: '罗拉和皮帕在北极度假。' },
        { en: '"What\'s the weather like?" asks Lola.', zh: '“今天天气怎么样呀？”罗拉问。' },
        { en: '"It is cold and it is snowing," says Pippa.', zh: '“天很冷，还下着雪呢。”皮帕说。' },
        { en: 'The sky is white, and the wind is loud.', zh: '天空白茫茫的，风呼呼地吹。' },
        { en: '"It is windy, too!" says Lola.', zh: '“风还挺大的呢！”罗拉说。' },
      ],
      [
        { en: 'Then they fly to the jungle to see Mickey.', zh: '接着她们飞到丛林里去看米奇。' },
        { en: '"What\'s the weather like here?" asks Lola.', zh: '“这儿的天气怎么样呀？”罗拉问。' },
        { en: '"It is hot and it is sunny!" says Mickey.', zh: '“又热又晴呢！”米奇说。' },
        { en: 'Suddenly it is raining, and the three friends run.', zh: '忽然下起雨来，三个好朋友赶紧跑起来。' },
      ],
      [
        { en: '"We are wet, but this is fun!" says Mickey.', zh: '“我们都湿啦，可真好玩！”米奇说。' },
        { en: '"What\'s the weather like? It is a happy day!" says Lola.', zh: '“天气怎么样？是快快乐乐的一天呀！”罗拉说。' },
      ],
    ],
  },
  '4-7': {
    title: 'Jump in the Jungle',
    titleZh: '丛林里跳一跳',
    paragraphs: [
      [
        { en: 'It is a sunny day in the jungle.', zh: '丛林里是个阳光灿烂的好天气。' },
        { en: 'Mickey is here with Mum and Uncle.', zh: '米奇和妈妈、叔叔一起在这儿。' },
        { en: '"U says u, u, u!" sings Mickey.', zh: '“U 念 u、u、u！”米奇唱着。' },
        { en: 'He can jump and swing in the trees.', zh: '他能在树间跳来跳去、荡来荡去。' },
      ],
      [
        { en: 'Suddenly Mickey stops and looks at his shoes.', zh: '忽然米奇停住了，低头看自己的鞋。' },
        { en: '"Oh no! This is not fun," he says.', zh: '“哎呀！这可不好玩了。”他说。' },
        { en: 'Uncle has a little brush in his bag.', zh: '叔叔的包里有一把小刷子。' },
        { en: '"Use this brush, Mickey," says Uncle.', zh: '“用这把刷子吧，米奇。”叔叔说。' },
      ],
      [
        { en: 'Mickey takes the brush and cleans his shoes.', zh: '米奇接过刷子，把鞋刷得干干净净。' },
        { en: '"Now I can jump again!" he says.', zh: '“现在我又能跳啦！”他说。' },
        { en: 'The three friends jump in the sun.', zh: '三个好朋友在太阳底下跳呀跳。' },
      ],
    ],
  },
  '4-8': {
    title: 'A Monkey in the Arctic',
    titleZh: '北极里的小猴子',
    paragraphs: [
      [
        { en: 'Lola has a little plane and three friends.', zh: '罗拉有一架小飞机和三个好朋友。' },
        { en: 'Today they will visit three places.', zh: '今天他们要去三个地方看看。' },
        { en: '"Climate is the normal weather in a place," says Lola.', zh: '“气候就是一个地方平常的天气呀。”罗拉说。' },
      ],
      [
        { en: 'In the desert, a lizard sits in the sun.', zh: '沙漠里，一只蜥蜴趴在太阳底下。' },
        { en: 'The jungle is rainy, and a monkey swings in the trees.', zh: '丛林里下着雨，一只猴子在树间荡来荡去。' },
        { en: 'In the cold Arctic, a polar bear smiles.', zh: '寒冷的北极里，一只北极熊笑眯眯的。' },
        { en: 'Suddenly Lola sees a monkey in the Arctic.', zh: '忽然，罗拉在北极看见了一只小猴子。' },
      ],
      [
        { en: '"Brr! I am cold here," says the monkey.', zh: '“好冷呀！我在这儿冻坏了。”小猴子说。' },
        { en: 'Lola takes the monkey back to the jungle.', zh: '罗拉把小猴子送回了丛林。' },
        { en: 'The lizard, the monkey and the polar bear are home.', zh: '蜥蜴、猴子和北极熊都回到了自己的家。' },
        { en: '"Different climates, different friends!" says Lola.', zh: '“不一样的气候，不一样的好朋友呀！”罗拉说。' },
      ],
    ],
  },
  '4-9': {
    title: 'A Sweater for New York',
    titleZh: '寄往纽约的毛衣',
    paragraphs: [
      [
        { en: 'It is morning, and Lola is at home.', zh: '早上啦，罗拉在家。' },
        { en: '"What\'s the weather like?" asks Mom.', zh: '“今天天气怎么样呀？”妈妈问。' },
        { en: '"It is windy today," says Lola.', zh: '“今天有风呢。”罗拉说。' },
        { en: 'She looks out of the window at the trees.', zh: '她望着窗外的树。' },
      ],
      [
        { en: 'In New York it is snowing and cold.', zh: '纽约正下着雪，冷得很。' },
        { en: 'In Sydney it is sunny and hot.', zh: '悉尼阳光灿烂，热乎乎的。' },
        { en: 'In Tokyo it is raining, and the sky is gray.', zh: '东京下着雨，天空灰蒙蒙的。' },
        { en: '"My friend has no sweater in New York!" says Lola.', zh: '“我在纽约的朋友没有毛衣穿呀！”罗拉说。' },
      ],
      [
        { en: 'Lola puts a warm sweater in a bag.', zh: '罗拉把一件暖和的毛衣放进包里。' },
        { en: '"This sweater will go to New York," she says.', zh: '“这件毛衣要寄到纽约去。”她说。' },
        { en: 'Now the sunny day feels warm, too.', zh: '连这个晴天，也变得暖洋洋的了。' },
      ],
    ],
  },
  '4-10': {
    title: 'Grandma and the Sweater',
    titleZh: '奶奶和那件毛衣',
    paragraphs: [
      [
        { en: 'It is snowing, and the family is at home.', zh: '外面下着雪，一家人都在家。' },
        { en: 'My sister and my brother sit near the window.', zh: '姐姐和哥哥坐在窗边。' },
        { en: '"Look at the snow!" says my sister.', zh: '“快看雪呀！”姐姐说。' },
        { en: 'Grandma is here with a little game.', zh: '奶奶带着一个小游戏来了。' },
      ],
      [
        { en: '"I am cold! I want my sweater," says my brother.', zh: '“我好冷！我要我的毛衣。”哥哥说。' },
        { en: 'He looks in the bag, but it is not there.', zh: '他翻了翻包，可毛衣不在里面。' },
        { en: '"Where is my red sweater?" he asks.', zh: '“我的红毛衣在哪儿呀？”他问。' },
        { en: 'Grandma has it in her hands and smiles.', zh: '奶奶笑眯眯地把它拿在手里。' },
      ],
      [
        { en: '"Here is your sweater," says Grandma.', zh: '“你的毛衣在这儿呢。”奶奶说。' },
        { en: 'My brother puts it on and feels warm.', zh: '哥哥穿上毛衣，一下子暖和了。' },
        { en: 'Now the four of us are warm at home.', zh: '这下我们四个，在家里都暖暖的。' },
      ],
    ],
  },
  '4-11': {
    title: 'A Light for Diwali',
    titleZh: '排灯节的一盏灯',
    paragraphs: [
      [
        { en: '"Hello! I am Pia. I am from India," says Pia.', zh: '“你好！我是皮亚，我来自印度。”皮亚说。' },
        { en: 'Today is a special day for my family.', zh: '今天对我们家来说是个特别的日子。' },
        { en: '"It is Diwali, an Indian festival!" says Mom.', zh: '“今天是排灯节，印度的节日呀！”妈妈说。' },
      ],
      [
        { en: 'We wear special clothes on this day.', zh: '这一天我们要穿上特别的衣服。' },
        { en: 'My aunt has a red sari and a big smile.', zh: '阿姨穿着红红的沙丽，笑得可开心了。' },
        { en: '"This is my sherwani," says my uncle.', zh: '“这就是我的 sherwani 长外套。”叔叔说。' },
        { en: 'I am wearing a new dress, but I am sad.', zh: '我穿着新裙子，可心里有点不高兴。' },
        { en: '"Where is the little light for Diwali?" I ask.', zh: '“排灯节的小灯在哪儿呀？”我问。' },
      ],
      [
        { en: 'My grandma has it in her hands.', zh: '原来小灯在奶奶手里呢。' },
        { en: '"Here is the light, Pia!" she says.', zh: '“灯在这儿呢，皮亚！”她说。' },
        { en: 'Now the house is warm, and we all sing.', zh: '屋子里一下子暖了，我们一起唱起歌来。' },
        { en: '"Happy Diwali, everyone!" says Pia.', zh: '“大家排灯节快乐呀！”皮亚说。' },
      ],
    ],
  },
}

// ============================================================================
// 5) 拓展词主题库：4 个新键（不与 Unit 1 的 classroom/school-things/shapes/art 重复）
// ============================================================================
export const u4_ext: Record<string, ExtTopic> = {
  transport: {
    zh: '交通与旅行',
    words: [
      w('plane', '飞机', '✈️'), w('train', '火车', '🚆'), w('bus', '公交车', '🚌'),
      w('car', '小汽车', '🚗'), w('ship', '轮船', '🚢'), w('bike', '自行车', '🚲'),
      w('suitcase', '行李箱', '🧳'), w('airport', '机场', '🛫'),
    ],
  },
  geography: {
    zh: '地理地貌',
    words: [
      w('desert', '沙漠', '🏜️'), w('jungle', '丛林', '🌴'), w('mountain', '山', '⛰️'),
      w('river', '河', '🏞️'), w('island', '岛', '🏝️'), w('beach', '海滩', '🏖️'),
      w('forest', '森林', '🌲'), w('Arctic', '北极', '🐻‍❄️'),
    ],
  },
  india: {
    zh: '印度文化',
    words: [
      w('India', '印度', '🇮🇳'), w('Diwali', '排灯节', '🪔'), w('sari', '沙丽', '👗'),
      w('sherwani', '男式长外套', '🧥'), w('festival', '节日', '🎉'), w('elephant', '大象', '🐘'),
      w('Taj Mahal', '泰姬陵', '🕌'),
    ],
  },
  weather: {
    zh: '天气',
    words: [
      w('sunny', '晴朗的', '☀️'), w('rainy', '下雨的', '🌧️'), w('cloudy', '多云的', '☁️'),
      w('windy', '有风的', '💨'), w('snowy', '下雪的', '❄️'), w('hot', '热的', '🔥'),
      w('cold', '冷的', '🥶'), w('storm', '暴风雨', '⛈️'),
    ],
  },
}

// ============================================================================
// 6) 单元模块（聚合本单元全部内容）
// ============================================================================
export const u4_module: Module = {
  id: 4,
  slug: 'lola-the-pilot',
  title: 'Lola the Pilot',
  titleZh: '罗拉飞行员',
  emoji: '✈️',
  color: '#F5B017',
  colorSoft: '#FFF3C4',
  preview: {
    goals: [
      '认识 11 种衣物词汇（hat, jacket, shirt, sweater, T-shirt, skirt, dress, socks, shoes, pants），能用 Pack your ___ / I\'m wearing ___ 表达整理与穿着',
      '读懂「罗拉飞行员」度假故事（Pippa 北极熊 & Mickey 猴子），理解 airport / Arctic / jungle / cold / hot',
      '学会天气问答 What\'s the weather like? It\'s cold / hot / sunny / raining / windy / snowing',
      '学说自然拼读短音 /u/（jump, jungle, sunny, fun, uncle, brush）',
      '了解地理气候（desert / Arctic / jungle）与动物分布，认识印度文化（Diwali / sari / sherwani）',
    ],
    keyWords: 'hat, jacket, shirt, sweater, T-shirt, skirt, dress, socks, shoes, pants, airport, Arctic, jungle, cold, hot, sunny, raining, windy, snowing',
    keySentences: "Pack your hat. I'm wearing a jacket. What's the weather like? It's cold. I have my sweater and my socks.",
    tip: '预习时找出家人的衣物用英语说 Pack your ___ / I\'m wearing ___；看天气时练习 What\'s the weather like? It\'s ___；读故事时模仿 Pippa 和 Mickey 的语气。',
  },
  lessons: u4_lessons[4],
  quiz: [
    { q: '整理行李时，妈妈说 Pack your ___，下面哪个是帽子？🎩', options: ['hat', 'shirt', 'sock'], answer: 0, explain: '帽子是 hat。' },
    { q: 'I\'m wearing a ___ . 我穿着一件夹克。🧥', options: ['jacket', 'shoes', 'jungle'], answer: 0, explain: '夹克是 jacket。' },
    { q: '故事里 Pippa 在北极，北极很 ___。🐻‍❄️', options: ['cold', 'hot', 'sunny'], answer: 0, explain: '北极很冷，cold。' },
    { q: '问天气怎么样，应该说？🌤️', options: ["What's the weather like?", "I'm wearing a hat.", 'It is a book.'], answer: 0, explain: '问天气用 What\'s the weather like?' },
    { q: 'Mickey 在丛林 jungle，丛林很 ___。🌴', options: ['hot', 'cold', 'snowing'], answer: 0, explain: '丛林很热，hot。' },
  ],
}
