// Starlight 1 · Level 1 · Unit 2「Lola the Doctor / 罗拉医生」课程数据
// 数据来源：src/data/starlight1/raw/unit2.json（教材 PDF 文本，按 lesson 分节）。
// 结构对齐 Unit 1 试点（u1 模板），类型全部取自 ./shared。
// 单元 slug = 'lola-the-doctor'，贯穿每一张句型卡。

import type { Lesson, LessonBook, SentenceFrame, ReadingPassage, Module, ExtTopic } from './shared'
import { w } from './shared'

// ============================================================================
// 1. 每课内容（11 课：Lesson 1~11；id 即 PDF 课号）
// ============================================================================
export const u2_lessons: Record<number, Lesson[]> = {
  2: [
    {
      id: 1,
      title: 'Vocabulary',
      titleZh: '词汇：身体部位（一）',
      words: [
        { en: 'eyes', zh: '眼睛', emoji: '👀', ipa: '/aɪz/' },
        { en: 'ears', zh: '耳朵', emoji: '👂', ipa: '/ɪəz/' },
        { en: 'nose', zh: '鼻子', emoji: '👃', ipa: '/nəʊz/' },
        { en: 'mouth', zh: '嘴', emoji: '👄', ipa: '/maʊθ/' },
        { en: 'teeth', zh: '牙齿', emoji: '🦷', ipa: '/tiːθ/' },
      ],
      sentences: [
        { en: 'Look at my eyes.', zh: '看我的眼睛。', hint: '指着自己的眼睛说' },
        { en: 'Look at my ears.', zh: '看我的耳朵。', hint: '指着自己的耳朵说' },
        { en: 'Look at my nose.', zh: '看我的鼻子。', hint: '指着自己的鼻子说' },
        { en: 'Look at my mouth.', zh: '看我的嘴。', hint: '指着自己的嘴说' },
        { en: 'Look at my teeth.', zh: '看我的牙齿。', hint: '指着自己的牙齿说' },
      ],
    },
    {
      id: 2,
      title: 'Vocabulary and Practice',
      titleZh: '词汇与练习：身体部位（二）',
      words: [
        { en: 'hair', zh: '头发', emoji: '💇', ipa: '/heə/' },
        { en: 'cheeks', zh: '脸颊', emoji: '🟠', ipa: '/tʃiːks/' },
        { en: 'face', zh: '脸', emoji: '😐', ipa: '/feɪs/' },
        { en: 'feet', zh: '脚', emoji: '🦶', ipa: '/fiːt/' },
        { en: 'toes', zh: '脚趾', emoji: '🦶', ipa: '/təʊz/' },
      ],
      sentences: [
        { en: "What's this?", zh: '这是什么？', hint: '单数提问' },
        { en: 'What are these?', zh: '这些是什么？', hint: '复数提问' },
        { en: 'Look at my hair.', zh: '看我的头发。', hint: '指着自己的头发说' },
        { en: 'Look at my face.', zh: '看我的脸。', hint: '指着自己的脸说' },
        { en: 'Look at my toes.', zh: '看我的脚趾。', hint: '指着自己的脚趾说' },
      ],
    },
    {
      id: 3,
      title: 'Reading',
      titleZh: '阅读：可怜的熊先生',
      words: [
        { en: 'doctor', zh: '医生', emoji: '🩺', ipa: '/ˈdɒktə/' },
        { en: 'hospital', zh: '医院', emoji: '🏥', ipa: '/ˈhɒspɪtl/' },
        { en: 'ill', zh: '生病的', emoji: '🤒', ipa: '/ɪl/' },
        { en: 'bear', zh: '熊', emoji: '🐻', ipa: '/beə/' },
        { en: 'bandage', zh: '绷带', emoji: '🩹', ipa: '/ˈbændɪdʒ/' },
      ],
      sentences: [
        { en: 'Mr. Bear is ill.', zh: '熊先生生病了。', hint: 'ill = 生病的' },
        { en: "He's in the hospital.", zh: '他在医院里。', hint: 'He\'s = He is' },
        { en: 'How are you today?', zh: '你今天好吗？', hint: '问候用语' },
        { en: 'This is for you!', zh: '这是给你的！', hint: '递东西时说' },
        { en: 'Look! I have a mouth.', zh: '看！我有一张嘴。', hint: '揭晓身体部位' },
      ],
    },
    {
      id: 4,
      title: 'Reading and Practice',
      titleZh: '阅读与练习：狼先生',
      words: [
        { en: 'wolf', zh: '狼', emoji: '🐺', ipa: '/wʊlf/' },
        { en: 'bed', zh: '床', emoji: '🛏️', ipa: '/bed/' },
        { en: 'ear', zh: '耳朵', emoji: '👂', ipa: '/ɪə/' },
        { en: 'nose', zh: '鼻子', emoji: '👃', ipa: '/nəʊz/' },
        { en: 'mouth', zh: '嘴', emoji: '👄', ipa: '/maʊθ/' },
      ],
      sentences: [
        { en: 'Look! I have a nose and eyes.', zh: '看！我有一个鼻子和两只眼睛。', hint: 'and 连接两个部位' },
        { en: 'Look! I have ears.', zh: '看！我有耳朵。', hint: '复数不加 a' },
        { en: "That isn't Mr. Bear!", zh: '那不是熊先生！', hint: 'isn\'t = is not' },
        { en: "It isn't Mr. Bear. It's Mr. Wolf!", zh: '那不是熊先生，是狼先生！', hint: 'It\'s = It is' },
        { en: 'Mr. Bear is in the other bed.', zh: '熊先生在另一张床上。', hint: 'the other = 另一个' },
      ],
    },
    {
      id: 5,
      title: 'Language Focus',
      titleZh: '语言聚焦：I have...',
      words: [
        { en: 'mouth', zh: '嘴', emoji: '👄', ipa: '/maʊθ/' },
        { en: 'face', zh: '脸', emoji: '😐', ipa: '/feɪs/' },
        { en: 'nose', zh: '鼻子', emoji: '👃', ipa: '/nəʊz/' },
        { en: 'eyes', zh: '眼睛', emoji: '👀', ipa: '/aɪz/' },
        { en: 'hair', zh: '头发', emoji: '💇', ipa: '/heə/' },
      ],
      sentences: [
        { en: 'I have a mouth.', zh: '我有一张嘴。', hint: 'a + 单数名词' },
        { en: 'I have eyes.', zh: '我有眼睛。', hint: '复数不加 a' },
        { en: 'I have teeth.', zh: '我有牙齿。', hint: 'teeth 是复数' },
        { en: 'Look! I have a mouth.', zh: '看！我有一张嘴。', hint: 'Look! 引起注意' },
        { en: "That isn't Mr. Bear.", zh: '那不是熊先生。', hint: 'isn\'t = is not' },
      ],
    },
    {
      id: 6,
      title: 'Language Focus and Practice',
      titleZh: '语言聚焦与练习：This is his/her...',
      words: [
        { en: 'towel', zh: '毛巾', emoji: '🧻', ipa: '/ˈtaʊəl/' },
        { en: 'soap', zh: '肥皂', emoji: '🧼', ipa: '/səʊp/' },
        { en: 'toothbrush', zh: '牙刷', emoji: '🪥', ipa: '/ˈtuːθbrʌʃ/' },
        { en: 'comb', zh: '梳子', emoji: '💇', ipa: '/kəʊm/' },
        { en: 'shampoo', zh: '洗发水', emoji: '🧴', ipa: '/ʃæmˈpuː/' },
      ],
      sentences: [
        { en: 'This is his soap.', zh: '这是他的肥皂。', hint: 'his = 他的' },
        { en: 'This is her towel.', zh: '这是她的毛巾。', hint: 'her = 她的' },
        { en: 'This is his toothbrush, too.', zh: '这也是他的牙刷。', hint: 'too = 也' },
        { en: "He's a clean bear.", zh: '他是一只干净的熊。', hint: 'clean = 干净的' },
        { en: 'Wash! Wash! Wash!', zh: '洗！洗！洗！', hint: '洗漱儿歌' },
      ],
    },
    {
      id: 7,
      title: 'Phonics',
      titleZh: '自然拼读：th 音',
      words: [
        { en: 'three', zh: '三', emoji: '3️⃣', ipa: '/θriː/' },
        { en: 'thirteen', zh: '十三', emoji: '🔢', ipa: '/ˌθɜːˈtiːn/' },
        { en: 'mouth', zh: '嘴', emoji: '👄', ipa: '/maʊθ/' },
        { en: 'teeth', zh: '牙齿', emoji: '🦷', ipa: '/tiːθ/' },
        { en: 'bathroom', zh: '浴室', emoji: '🚿', ipa: '/ˈbɑːθruːm/' },
      ],
      sentences: [
        { en: 'Th says th, th, th.', zh: 'th 发 th 的音。', hint: 'th 的发音口诀' },
        { en: 'Open your mouth.', zh: '张开你的嘴。', hint: 'open = 张开' },
        { en: 'Brush your teeth.', zh: '刷你的牙齿。', hint: 'brush = 刷' },
        { en: 'This is his shampoo.', zh: '这是他的洗发水。', hint: '复习 his' },
        { en: 'This is her comb.', zh: '这是她的梳子。', hint: '复习 her' },
      ],
    },
    {
      id: 8,
      title: 'CLIL',
      titleZh: 'CLIL 科学：牙齿',
      words: [
        { en: 'baby teeth', zh: '乳牙', emoji: '🦷', ipa: '/ˈbeɪbi tiːθ/' },
        { en: 'adult teeth', zh: '恒牙', emoji: '🦷', ipa: '/ˈædʌlt tiːθ/' },
        { en: 'brush', zh: '刷', emoji: '🪥', ipa: '/brʌʃ/' },
        { en: 'twenty', zh: '二十', emoji: '20️⃣', ipa: '/ˈtwenti/' },
        { en: 'day', zh: '天', emoji: '☀️', ipa: '/deɪ/' },
      ],
      sentences: [
        { en: 'You get teeth when you are a baby.', zh: '你还是小宝宝时就会长牙。', hint: 'baby = 婴儿' },
        { en: 'When you are three, you have twenty baby teeth.', zh: '你三岁时，有二十颗乳牙。', hint: 'twenty = 20' },
        { en: 'When you are six, you get adult teeth.', zh: '你六岁时，开始长恒牙。', hint: 'adult teeth = 恒牙' },
        { en: 'Brush your teeth three times a day!', zh: '每天刷三次牙！', hint: 'three times a day = 每天三次' },
        { en: 'Take care of your teeth!', zh: '保护好你的牙齿！', hint: 'take care of = 照顾、爱护' },
      ],
    },
    {
      id: 9,
      title: 'Practice',
      titleZh: '综合练习',
      words: [
        { en: 'comb', zh: '梳子', emoji: '💇', ipa: '/kəʊm/' },
        { en: 'towel', zh: '毛巾', emoji: '🧻', ipa: '/ˈtaʊəl/' },
        { en: 'brush', zh: '刷子', emoji: '🪥', ipa: '/brʌʃ/' },
        { en: 'soap', zh: '肥皂', emoji: '🧼', ipa: '/səʊp/' },
        { en: 'toothbrush', zh: '牙刷', emoji: '🪥', ipa: '/ˈtuːθbrʌʃ/' },
      ],
      sentences: [
        { en: 'I have a mouth.', zh: '我有一张嘴。', hint: '复习 I have a...' },
        { en: 'I have eyes.', zh: '我有眼睛。', hint: '复数不加 a' },
        { en: 'I have feet.', zh: '我有脚。', hint: 'feet 是 foot 的复数' },
        { en: 'This is his toothbrush.', zh: '这是他的牙刷。', hint: 'his = 他的' },
        { en: 'This is his towel.', zh: '这是他的毛巾。', hint: 'his = 他的' },
      ],
    },
    {
      id: 10,
      title: 'Game - The Paint Race',
      titleZh: '游戏：画画比赛',
      words: [
        { en: 'blue', zh: '蓝色', emoji: '🔵', ipa: '/bluː/' },
        { en: 'nose', zh: '鼻子', emoji: '👃', ipa: '/nəʊz/' },
        { en: 'teeth', zh: '牙齿', emoji: '🦷', ipa: '/tiːθ/' },
        { en: 'towel', zh: '毛巾', emoji: '🧻', ipa: '/ˈtaʊəl/' },
        { en: 'pencil', zh: '铅笔', emoji: '✏️', ipa: '/ˈpensl/' },
      ],
      sentences: [
        { en: "It's my pencil.", zh: '它是我的铅笔。', hint: 'my = 我的' },
        { en: "It's your schoolbag.", zh: '它是你的书包。', hint: 'your = 你的' },
        { en: 'I have a mouth.', zh: '我有一张嘴。', hint: '复习身体部位' },
        { en: 'I have ears.', zh: '我有耳朵。', hint: '复习身体部位' },
        { en: 'This is her towel.', zh: '这是她的毛巾。', hint: 'her = 她的' },
      ],
    },
    {
      id: 11,
      title: 'Japan',
      titleZh: '文化：日本',
      words: [
        { en: 'Japan', zh: '日本', emoji: '🇯🇵', ipa: '/dʒəˈpæn/' },
        { en: 'teacher', zh: '老师', emoji: '👩‍🏫', ipa: '/ˈtiːtʃə/' },
        { en: 'lunch', zh: '午餐', emoji: '🍱', ipa: '/lʌntʃ/' },
        { en: 'rice', zh: '米饭', emoji: '🍚', ipa: '/raɪs/' },
        { en: 'chopsticks', zh: '筷子', emoji: '🥢', ipa: '/ˈtʃɒpstɪks/' },
      ],
      sentences: [
        { en: "Hello! I'm Miho. I'm from Japan.", zh: '你好！我是美穗，我来自日本。', hint: 'I\'m from... = 我来自……' },
        { en: "I'm in grade 1. I'm six.", zh: '我上一年级，六岁。', hint: 'grade 1 = 一年级' },
        { en: 'This is my teacher, Mr. Sato.', zh: '这是我的老师，佐藤先生。', hint: '介绍老师' },
        { en: 'I have lunch at school.', zh: '我在学校吃午饭。', hint: 'at school = 在学校' },
        { en: 'I brush my teeth at school.', zh: '我在学校刷牙。', hint: 'brush my teeth = 刷牙' },
      ],
    },
  ],
}

// ============================================================================
// 2. 课本原文（按活动分节，keyed '2-<lesson>')
// ============================================================================
export const u2_book: Record<string, LessonBook> = {
  '2-1': {
    title: 'Vocabulary',
    sections: [
      { chapter: 'Focus on: body parts.', chapterZh: '重点词汇：身体部位。', pages: [
        { text: 'eyes', textZh: '眼睛' },
        { text: 'ears', textZh: '耳朵' },
        { text: 'nose', textZh: '鼻子' },
        { text: 'mouth', textZh: '嘴' },
        { text: 'teeth', textZh: '牙齿' },
      ] },
      { chapter: 'Look and answer the questions.', chapterZh: '看一看，回答问题。', pages: [
        { text: "What's this? / What are these?", textZh: '这是什么？／这些是什么？' },
        { text: 'What color is it?', textZh: '它是什么颜色？' },
        { text: "It's ...", textZh: '它是……' },
      ] },
      { chapter: 'Activity: Listen, point and say.', chapterZh: '活动：听一听，指一指，说一说。', pages: [
        { text: 'Doctor! Doctor!', textZh: '医生！医生！' },
        { text: "I'm ill today!", textZh: '我今天生病了！' },
        { text: 'Look at my face.', textZh: '看我的脸。' },
        { text: 'My mouth and my teeth.', textZh: '我的嘴和我的牙齿。' },
        { text: 'Look at my ears. Look at my feet.', textZh: '看我的耳朵。看我的脚。' },
      ] },
    ],
  },
  '2-2': {
    title: 'Vocabulary and Practice',
    sections: [
      { chapter: 'Review: body parts.', chapterZh: '复习：身体部位。', pages: [
        { text: 'teeth', textZh: '牙齿' },
        { text: 'mouth', textZh: '嘴' },
        { text: 'eyes', textZh: '眼睛' },
        { text: 'ears', textZh: '耳朵' },
        { text: 'nose', textZh: '鼻子' },
      ] },
      { chapter: 'Focus on: more body parts.', chapterZh: '重点词汇：更多身体部位。', pages: [
        { text: 'hair', textZh: '头发' },
        { text: 'cheeks', textZh: '脸颊' },
        { text: 'face', textZh: '脸' },
        { text: 'feet', textZh: '脚' },
        { text: 'toes', textZh: '脚趾' },
      ] },
      { chapter: 'Look and answer the questions.', chapterZh: '看一看，回答问题。', pages: [
        { text: "What's this? / What are these?", textZh: '这是什么？／这些是什么？' },
      ] },
    ],
  },
  '2-3': {
    title: 'Reading',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'Poor Mr. Bear!', textZh: '可怜的熊先生！' },
        { text: 'Who is he? Where is he?', textZh: '他是谁？他在哪里？' },
      ] },
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'Mr. Bear is ill. He is in the hospital.', textZh: '熊先生生病了。他在医院里。' },
        { text: 'How are you today?', textZh: '你今天好吗？' },
        { text: 'This is for you!', textZh: '这是给你的！' },
        { text: 'Here is the doctor.', textZh: '医生来了。' },
        { text: 'The doctor takes off a bandage.', textZh: '医生取下一块绷带。' },
        { text: 'Look! I have a mouth. Hurray!', textZh: '看！我有一张嘴。好耶！' },
      ] },
      { chapter: "Let's practice.", chapterZh: '练一练。', pages: [
        { text: 'I have eyes.', textZh: '我有眼睛。' },
        { text: 'I have a nose.', textZh: '我有一个鼻子。' },
        { text: 'I have ears.', textZh: '我有耳朵。' },
        { text: 'I have a mouth.', textZh: '我有一张嘴。' },
      ] },
    ],
  },
  '2-4': {
    title: 'Reading and Practice',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'Poor Mr. Bear! / Poor Mr. Wolf!', textZh: '可怜的熊先生！／可怜的狼先生！' },
        { text: 'In the hospital. / In the park.', textZh: '在医院里。／在公园里。' },
      ] },
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'Then the doctor takes off another bandage.', textZh: '然后医生又取下一块绷带。' },
        { text: 'Look! I have a nose and eyes. Hurray!', textZh: '看！我有一个鼻子和两只眼睛。好耶！' },
        { text: "Look! I have ears. Oh! That isn't Mr. Bear!", textZh: '看！我有耳朵。哦！那不是熊先生！' },
        { text: "It isn't Mr. Bear. It's Mr. Wolf!", textZh: '那不是熊先生，是狼先生！' },
        { text: 'Mr. Bear is in the other bed.', textZh: '熊先生在另一张床上。' },
        { text: "I'm here! There's Mr. Bear. Oh no!", textZh: '我在这儿！熊先生在那儿。哦不！' },
      ] },
      { chapter: 'Make sentences.', chapterZh: '造句。', pages: [
        { text: 'I have a mouth.', textZh: '我有一张嘴。' },
        { text: 'I have eyes and ears.', textZh: '我有眼睛和耳朵。' },
      ] },
    ],
  },
  '2-5': {
    title: 'Language Focus',
    sections: [
      { chapter: 'Review.', chapterZh: '复习。', pages: [
        { text: 'Look! I have a mouth. Hurray!', textZh: '看！我有一张嘴。好耶！' },
        { text: 'Look! I have eyes.', textZh: '看！我有眼睛。' },
        { text: 'Look! I have teeth.', textZh: '看！我有牙齿。' },
      ] },
      { chapter: 'Grammar: I have a... / I have...', chapterZh: '语法：我有一个……／我有……', pages: [
        { text: 'I have a mouth / a face / a nose.', textZh: '我有一张嘴／一张脸／一个鼻子。' },
        { text: 'I have eyes / cheeks / ears / toes.', textZh: '我有眼睛／脸颊／耳朵／脚趾。' },
        { text: 'I have teeth / feet. I have hair.', textZh: '我有牙齿／脚。我有头发。' },
      ] },
      { chapter: 'Activity: Read and circle.', chapterZh: '活动：读一读，圈一圈。', pages: [
        { text: 'I have a nose. / I have nose.', textZh: '我有一个鼻子。（圈 a nose）' },
        { text: 'I have teeth. / I have a teeth.', textZh: '我有牙齿。（圈 teeth）' },
      ] },
    ],
  },
  '2-6': {
    title: 'Language Focus and Practice',
    sections: [
      { chapter: 'Focus on: household objects.', chapterZh: '重点词汇：家居用品。', pages: [
        { text: 'towel', textZh: '毛巾' },
        { text: 'soap', textZh: '肥皂' },
        { text: 'brush', textZh: '刷子' },
        { text: 'toothbrush', textZh: '牙刷' },
        { text: 'comb', textZh: '梳子' },
        { text: 'shampoo', textZh: '洗发水' },
      ] },
      { chapter: 'Learn a song.', chapterZh: '学唱一首歌。', pages: [
        { text: 'This is his soap.', textZh: '这是他的肥皂。' },
        { text: 'This is his towel.', textZh: '这是他的毛巾。' },
        { text: 'This is his toothbrush, too.', textZh: '这也是他的牙刷。' },
        { text: 'This is his comb. This is his brush.', textZh: '这是他的梳子。这是他的刷子。' },
        { text: 'This is his bear shampoo.', textZh: '这是他的熊用洗发水。' },
        { text: 'Wash! Wash! Wash! He is a clean bear.', textZh: '洗！洗！洗！他是一只干净的熊。' },
      ] },
      { chapter: 'Grammar: This is his / her...', chapterZh: '语法：这是他／她的……', pages: [
        { text: 'This is his shampoo.', textZh: '这是他的洗发水。' },
        { text: 'This is her shampoo.', textZh: '这是她的洗发水。' },
      ] },
    ],
  },
  '2-7': {
    title: 'Phonics',
    sections: [
      { chapter: 'Find the structure.', chapterZh: '找结构。', pages: [
        { text: 'This is his shampoo.', textZh: '这是他的洗发水。' },
        { text: 'This is her shampoo.', textZh: '这是她的洗发水。' },
      ] },
      { chapter: 'Chant Time: the th sound.', chapterZh: 'Chant 时间：th 音。', pages: [
        { text: 'Th says th, th, th.', textZh: 'th 发 th 的音。' },
        { text: 'Open your mouth. Brush your teeth. th th th.', textZh: '张开嘴。刷牙齿。th th th。' },
      ] },
      { chapter: 'Learn and read the words.', chapterZh: '学习并拼读单词。', pages: [
        { text: 'mouth', textZh: '嘴' },
        { text: 'teeth', textZh: '牙齿' },
        { text: 'three', textZh: '三' },
        { text: 'bathroom', textZh: '浴室' },
        { text: 'thirteen', textZh: '十三' },
        { text: 'toothbrush', textZh: '牙刷' },
      ] },
    ],
  },
  '2-8': {
    title: 'CLIL',
    sections: [
      { chapter: 'Focus on: teeth.', chapterZh: '重点词汇：牙齿。', pages: [
        { text: 'baby teeth', textZh: '乳牙' },
        { text: 'adult teeth', textZh: '恒牙' },
        { text: 'brush teeth', textZh: '刷牙' },
      ] },
      { chapter: 'Read the passage.', chapterZh: '读短文。', pages: [
        { text: 'You get teeth when you are a baby.', textZh: '你还是小宝宝时就会长牙。' },
        { text: 'When you are three, you have twenty baby teeth.', textZh: '你三岁时，有二十颗乳牙。' },
        { text: 'When you are six, you get adult teeth.', textZh: '你六岁时，开始长恒牙。' },
        { text: 'When you are fourteen, you have twenty-eight adult teeth.', textZh: '你十四岁时，有二十八颗恒牙。' },
        { text: 'Take care of your teeth! Brush your teeth three times a day!', textZh: '保护好你的牙齿！每天刷三次牙！' },
      ] },
      { chapter: 'Listen and complete.', chapterZh: '听一听，补全句子。', pages: [
        { text: 'I have twenty baby teeth.', textZh: '我有二十颗乳牙。' },
        { text: 'I brush my teeth two times a day.', textZh: '我每天刷两次牙。' },
      ] },
    ],
  },
  '2-9': {
    title: 'Practice',
    sections: [
      { chapter: 'Look, match and say.', chapterZh: '看一看，连一连，说一说。', pages: [
        { text: 'I have a nose.', textZh: '我有一个鼻子。' },
        { text: 'I have eyes.', textZh: '我有眼睛。' },
        { text: 'I have feet.', textZh: '我有脚。' },
        { text: 'I have a face.', textZh: '我有一张脸。' },
      ] },
      { chapter: 'Match the words with the objects.', chapterZh: '把单词和物品连线。', pages: [
        { text: 'comb', textZh: '梳子' },
        { text: 'towel', textZh: '毛巾' },
        { text: 'brush', textZh: '刷子' },
        { text: 'toothbrush', textZh: '牙刷' },
        { text: 'shampoo', textZh: '洗发水' },
        { text: 'soap', textZh: '肥皂' },
      ] },
      { chapter: 'Look and read.', chapterZh: '看一看，读一读。', pages: [
        { text: 'I have a mouth.', textZh: '我有一张嘴。' },
        { text: 'I have a brush.', textZh: '我有一把刷子。' },
        { text: 'This is his toothbrush.', textZh: '这是他的牙刷。' },
        { text: 'This is his soap.', textZh: '这是他的肥皂。' },
        { text: 'This is his towel.', textZh: '这是他的毛巾。' },
      ] },
    ],
  },
  '2-10': {
    title: 'Game - The Paint Race',
    sections: [
      { chapter: 'Warm-up Song.', chapterZh: '热身歌曲。', pages: [
        { text: 'Doctor! Doctor! I am ill today!', textZh: '医生！医生！我今天生病了！' },
        { text: 'Look at my face. My mouth and my teeth.', textZh: '看我的脸。我的嘴和我的牙齿。' },
      ] },
      { chapter: 'Circle the words and read the sentences.', chapterZh: '圈出单词，读句子。', pages: [
        { text: "It's blue.", textZh: '它是蓝色的。' },
        { text: 'I have teeth.', textZh: '我有牙齿。' },
        { text: "It's my nose.", textZh: '它是我的鼻子。' },
        { text: "It's your schoolbag.", textZh: '它是你的书包。' },
        { text: 'This is his pencil.', textZh: '这是他的铅笔。' },
        { text: 'This is her towel.', textZh: '这是她的毛巾。' },
      ] },
      { chapter: 'Play the board game.', chapterZh: '玩棋盘游戏。', pages: [
        { text: "It's purple.", textZh: '它是紫色的。' },
        { text: 'I have a mouth.', textZh: '我有一张嘴。' },
        { text: "It's my pencil case.", textZh: '它是我的铅笔盒。' },
        { text: "This is her comb. I have hair.", textZh: '这是她的梳子。我有头发。' },
      ] },
    ],
  },
  '2-11': {
    title: 'Japan',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: "Let's enjoy a song!", textZh: '一起来听首歌吧！' },
        { text: 'Pacca Alpaca travels to Japan.', textZh: '羊驼 Pacca 旅行到了日本。' },
      ] },
      { chapter: 'Reading: Meet Miho.', chapterZh: '阅读：认识美穗。', pages: [
        { text: "Hello! I'm Miho. I'm from Japan.", textZh: '你好！我是美穗，我来自日本。' },
        { text: "I'm in grade 1. I'm six.", textZh: '我上一年级，六岁。' },
        { text: 'This is my teacher, Mr. Sato.', textZh: '这是我的老师，佐藤先生。' },
      ] },
      { chapter: 'Miho at school.', chapterZh: '美穗在学校。', pages: [
        { text: 'I have lunch at school.', textZh: '我在学校吃午饭。' },
        { text: 'I eat my lunch in my classroom.', textZh: '我在教室里吃午饭。' },
        { text: 'Today I have rice, fish and milk.', textZh: '今天我吃米饭、鱼和牛奶。' },
        { text: 'I use chopsticks!', textZh: '我用筷子！' },
        { text: 'After lunch, I brush my teeth at school.', textZh: '午饭后，我在学校刷牙。' },
      ] },
      { chapter: 'Focus on: new phrases.', chapterZh: '重点短语。', pages: [
        { text: 'have lunch', textZh: '吃午饭' },
        { text: 'brush my teeth', textZh: '刷牙' },
        { text: 'at school', textZh: '在学校' },
      ] },
    ],
  },
}

// ============================================================================
// 3. 句型框架卡（Language Focus 课 5、6 抽取，unitSlug = 'lola-the-doctor'）
// ============================================================================
export const u2_frames: SentenceFrame[] = [
  // L1 / L2 / L3 / L4 补齐：每课 1 张，pattern 逐字取自本课 sentences，挖 1 个空
  {
    id: 'l1-lola-the-doctor-1-look-at-my',
    pattern: 'Look at my ___.',
    blanks: [
      {
        options: ['eyes', 'ears', 'nose', 'mouth', 'teeth'],
        answer: 0,
        zhOptions: ['看我的眼睛。', '看我的耳朵。', '看我的鼻子。', '看我的嘴。', '看我的牙齿。'],
      },
    ],
    zh: '看我的眼睛。',
    hint: 'Look at my... 指认自己的身体部位',
    unitSlug: 'lola-the-doctor',
    lessonId: 1,
  },
  {
    id: 'l1-lola-the-doctor-2-look-at-my-hair',
    pattern: 'Look at ___ hair.',
    blanks: [
      {
        options: ['my', 'your', 'his', 'her'],
        answer: 0,
        zhOptions: ['看我的头发。', '看你的头发。', '看他的头发。', '看她的头发。'],
      },
    ],
    zh: '看我的头发。',
    hint: 'my / your / his / her 表示「谁的」',
    unitSlug: 'lola-the-doctor',
    lessonId: 2,
  },
  {
    id: 'l1-lola-the-doctor-3-look-have-a',
    pattern: 'Look! I have a ___.',
    blanks: [
      {
        options: ['mouth', 'nose', 'face', 'ear'],
        answer: 0,
        zhOptions: ['看！我有一张嘴。', '看！我有一个鼻子。', '看！我有一张脸。', '看！我有一只耳朵。'],
      },
    ],
    zh: '看！我有一张嘴。',
    hint: 'a + 单数身体部位',
    unitSlug: 'lola-the-doctor',
    lessonId: 3,
  },
  {
    id: 'l1-lola-the-doctor-4-nose-and-eyes',
    pattern: 'Look! I have a ___ and eyes.',
    blanks: [
      {
        options: ['nose', 'mouth', 'face', 'ear'],
        answer: 0,
        zhOptions: [
          '看！我有一个鼻子和两只眼睛。',
          '看！我有一张嘴和两只眼睛。',
          '看！我有一张脸和两只眼睛。',
          '看！我有一只耳朵和两只眼睛。',
        ],
      },
    ],
    zh: '看！我有一个鼻子和两只眼睛。',
    hint: 'and 连接两个身体部位',
    unitSlug: 'lola-the-doctor',
    lessonId: 4,
  },
  {
    id: 'l1-lola-the-doctor-5-have',
    pattern: 'I have ___.',
    blanks: [
      {
        options: ['a mouth', 'eyes', 'teeth', 'hair', 'a nose'],
        answer: 0,
        zhOptions: ['我有一张嘴。', '我有眼睛。', '我有牙齿。', '我有头发。', '我有一个鼻子。'],
      },
    ],
    zh: '我有一张嘴。',
    hint: '表达"我有……"（单数加 a，复数不加）',
    unitSlug: 'lola-the-doctor',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-doctor-5-have-a',
    pattern: 'I have a ___.',
    blanks: [
      {
        options: ['mouth', 'face', 'nose'],
        answer: 0,
        zhOptions: ['我有一张嘴。', '我有一张脸。', '我有一个鼻子。'],
      },
    ],
    zh: '我有一张嘴。',
    hint: 'a + 单数名词',
    unitSlug: 'lola-the-doctor',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-doctor-5-look-have',
    pattern: 'Look! I have ___.',
    blanks: [
      {
        options: ['a mouth', 'eyes', 'teeth'],
        answer: 0,
        zhOptions: ['看！我有一张嘴。', '看！我有眼睛。', '看！我有牙齿。'],
      },
    ],
    zh: '看！我有一张嘴。',
    hint: 'Look! 引起注意后说 I have...',
    unitSlug: 'lola-the-doctor',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-doctor-6-his-her-shampoo',
    pattern: 'This is ___ soap.',
    blanks: [
      {
        options: ['his', 'her', 'my', 'your'],
        answer: 0,
        zhOptions: ['这是他的肥皂。', '这是她的肥皂。', '这是我的肥皂。', '这是你的肥皂。'],
      },
    ],
    zh: '这是他的肥皂。',
    hint: 'his = 他的，her = 她的',
    unitSlug: 'lola-the-doctor',
    lessonId: 6,
  },
  {
    id: 'l1-lola-the-doctor-6-his',
    pattern: 'This is his ___.',
    blanks: [
      {
        options: ['soap', 'towel', 'toothbrush', 'comb'],
        answer: 0,
        zhOptions: ['这是他的肥皂。', '这是他的毛巾。', '这是他的牙刷。', '这是他的梳子。'],
      },
    ],
    zh: '这是他的肥皂。',
    hint: 'his = 他的',
    unitSlug: 'lola-the-doctor',
    lessonId: 6,
  },
  {
    id: 'l1-lola-the-doctor-6-her',
    pattern: 'This is her ___.',
    blanks: [
      {
        options: ['towel', 'soap', 'comb', 'shampoo'],
        answer: 0,
        zhOptions: ['这是她的毛巾。', '这是她的肥皂。', '这是她的梳子。', '这是她的洗发水。'],
      },
    ],
    zh: '这是她的毛巾。',
    hint: 'her = 她的',
    unitSlug: 'lola-the-doctor',
    lessonId: 6,
  },
  // L7 / L8 / L9 / L10 / L11 补齐：每课 1 张，pattern 逐字取自本课 sentences，挖 1 个空
  {
    id: 'l1-lola-the-doctor-7-brush-your',
    pattern: 'Brush your ___.',
    blanks: [
      {
        options: ['teeth', 'mouth', 'hair', 'face'],
        answer: 0,
        zhOptions: ['刷你的牙齿。', '刷你的嘴。', '刷你的头发。', '刷你的脸。'],
      },
    ],
    zh: '刷你的牙齿。',
    hint: 'brush = 刷（th 音：teeth / mouth）',
    unitSlug: 'lola-the-doctor',
    lessonId: 7,
  },
  {
    id: 'l1-lola-the-doctor-8-when-you-are',
    pattern: 'When you are ___, you get adult teeth.',
    blanks: [
      {
        options: ['six', 'three', 'thirteen', 'twenty'],
        answer: 0,
        zhOptions: [
          '你六岁时，开始长恒牙。',
          '你三岁时，开始长恒牙。',
          '你十三岁时，开始长恒牙。',
          '你二十岁时，开始长恒牙。',
        ],
      },
    ],
    zh: '你六岁时，开始长恒牙。',
    hint: '数字 + 岁：six / three / thirteen / twenty',
    unitSlug: 'lola-the-doctor',
    lessonId: 8,
  },
  {
    id: 'l1-lola-the-doctor-9-his-object',
    pattern: 'This is his ___.',
    blanks: [
      {
        options: ['toothbrush', 'towel', 'soap', 'comb', 'brush'],
        answer: 0,
        zhOptions: [
          '这是他的牙刷。',
          '这是他的毛巾。',
          '这是他的肥皂。',
          '这是他的梳子。',
          '这是他的刷子。',
        ],
      },
    ],
    zh: '这是他的牙刷。',
    hint: 'his = 他的（洗漱用品）',
    unitSlug: 'lola-the-doctor',
    lessonId: 9,
  },
  {
    id: 'l1-lola-the-doctor-10-my-object',
    pattern: "It's my ___.",
    blanks: [
      {
        options: ['pencil', 'schoolbag', 'towel', 'comb', 'soap'],
        answer: 0,
        zhOptions: [
          '它是我的铅笔。',
          '它是我的书包。',
          '它是我的毛巾。',
          '它是我的梳子。',
          '它是我的肥皂。',
        ],
      },
    ],
    zh: '它是我的铅笔。',
    hint: 'my = 我的',
    unitSlug: 'lola-the-doctor',
    lessonId: 10,
  },
  {
    id: 'l1-lola-the-doctor-11-grade-six',
    pattern: "I'm in grade 1. I'm ___.",
    blanks: [
      {
        options: ['six', 'three', 'thirteen', 'twenty'],
        answer: 0,
        zhOptions: [
          '我上一年级，六岁。',
          '我上一年级，三岁。',
          '我上一年级，十三岁。',
          '我上一年级，二十岁。',
        ],
      },
    ],
    zh: '我上一年级，六岁。',
    hint: 'I am + 数字：说自己几岁',
    unitSlug: 'lola-the-doctor',
    lessonId: 11,
  },
]

export function framesOfLesson2(unitSlug: string, lessonId: number): SentenceFrame[] {
  return u2_frames.filter((f) => f.unitSlug === unitSlug && f.lessonId === lessonId)
}

// ============================================================================
// 4. 阅读短文（连贯小故事，keyed '2-<lesson>'；至少 3、4，另加 11）
// ============================================================================
export const u2_reading: Record<string, ReadingPassage> = {
  '2-1': {
    title: 'Look at My Face!',
    titleZh: '看看我的脸！',
    paragraphs: [
      [
        { en: "\"Doctor! Doctor! I'm ill today!\" says Ben.", zh: '“医生！医生！我今天生病啦！”小本说。' },
        { en: 'Lola comes to the little boy.', zh: '罗拉来到小男孩身边。' },
        { en: 'Ben is sad and very quiet.', zh: '小本蔫蔫的，一句话也不想说。' },
        { en: "\"Look at my eyes!\" says Lola.", zh: '“看我的眼睛！”罗拉说。' },
      ],
      [
        { en: "\"Look at my ears and my nose!\" she says.", zh: '“再看我的耳朵和鼻子！”她说。' },
        { en: 'Ben looks and smiles a little.', zh: '小本看着看着，忍不住笑了一下。' },
        { en: "\"Now look at my mouth and my teeth!\"", zh: '“现在看我的嘴和牙齿！”' },
        { en: "\"What are these?\" asks Lola.", zh: '“这些是什么呀？”罗拉问。' },
        { en: "\"Teeth! Big white teeth!\" says Ben.", zh: '“牙齿！白白的大牙！”小本说。' },
      ],
      [
        { en: 'He points to his eyes, ears and nose.', zh: '他指指自己的眼睛、耳朵和鼻子。' },
        { en: "\"I am not ill now,\" he says.", zh: '“我现在不生病啦。”他说。' },
        { en: "Lola laughs. \"Look at my happy boy!\"", zh: '罗拉笑起来：“瞧这个开心的小家伙！”' },
      ],
    ],
  },
  '2-2': {
    title: 'What Are These?',
    titleZh: '这些是什么呀？',
    paragraphs: [
      [
        { en: 'Mia draws a big picture today.', zh: '米娅今天画了一张大大的画。' },
        { en: 'She draws a face, but it is sad.', zh: '她画了一张脸，可脸是难过的。' },
        { en: "\"What's this?\" asks her friend Ben.", zh: '“这是什么呀？”她的朋友小本问。' },
        { en: "\"It's my face,\" says Mia.", zh: '“这是我的脸。”米娅说。' },
      ],
      [
        { en: "\"But look at my hair!\" says Ben.", zh: '“可要看看我的头发呀！”小本说。' },
        { en: 'Mia draws long hair on the face.', zh: '米娅给脸添上长长的头发。' },
        { en: "\"What are these?\" she asks.", zh: '“这些是什么呀？”她问。' },
        { en: "\"They are my cheeks,\" says Ben.", zh: '“是我的脸颊呀。”小本说。' },
        { en: 'She draws two red cheeks, too.', zh: '她又画上两团红红的脸颊。' },
      ],
      [
        { en: "\"Look at my feet and my toes!\" he says.", zh: '“看我的脚和脚趾！”他说。' },
        { en: 'Mia draws feet with ten little toes.', zh: '米娅画了脚，还有十根小脚趾。' },
        { en: 'Now the face has a big smile!', zh: '现在这张脸笑得大大的啦！' },
      ],
    ],
  },
  '2-3': {
    title: 'Poor Mr. Bear!',
    titleZh: '可怜的熊先生！',
    paragraphs: [
      [
        { en: 'Poor Mr. Bear is ill today.', zh: '可怜的熊先生今天生病了。' },
        { en: 'He is in the hospital, in a small bed.', zh: '他住在医院里，睡在一张小床上。' },
        { en: 'A big bandage is on his face.', zh: '一大块绷带盖在他的脸上。' },
        { en: "\"I can't see my mouth,\" he says.", zh: '“我看不见我的嘴啦。”他说。' },
      ],
      [
        { en: 'Lola the doctor comes in.', zh: '罗拉医生进来了。' },
        { en: "\"How are you today?\" she asks.", zh: '“你今天好吗？”她问。' },
        { en: "\"This is for you!\" says Lola.", zh: '“这是给你的！”罗拉说。' },
        { en: 'She gives him a red apple.', zh: '她递给他一个红苹果。' },
        { en: 'Mr. Bear smiles under the bandage.', zh: '熊先生在绷带底下笑了。' },
      ],
      [
        { en: 'The doctor takes off the bandage.', zh: '医生把绷带轻轻取下来。' },
        { en: "\"Look! I have a mouth. Hurray!\"", zh: '“看！我有一张嘴啦。好耶！”' },
        { en: "\"Hello, my face!\" says Mr. Bear.", zh: '“你好呀，我的脸！”熊先生说。' },
      ],
    ],
  },
  '2-4': {
    title: 'Mr. Wolf!',
    titleZh: '原来是狼先生！',
    paragraphs: [
      [
        { en: 'Lola is in the hospital again today.', zh: '罗拉今天又来到医院。' },
        { en: 'Two bandages sit on two beds.', zh: '两张床上各有一块绷带。' },
        { en: "\"This is for you!\" says the doctor.", zh: '“这是给你的！”医生说。' },
        { en: 'Then she takes off another bandage.', zh: '然后她又取下另一块绷带。' },
      ],
      [
        { en: "\"Look! I have a nose and eyes!\"", zh: '“看！我有鼻子和眼睛啦！”' },
        { en: "\"I have ears too. Hurray!\"", zh: '“我还有耳朵呢。好耶！”' },
        { en: 'Lola looks at the big ear.', zh: '罗拉盯着那只大耳朵看。' },
        { en: "\"Oh! That isn't Mr. Bear,\" she says.", zh: '“哦！这不是熊先生。”她说。' },
        { en: "\"It's Mr. Wolf! It isn't Mr. Bear!\"", zh: '“是狼先生！不是熊先生！”' },
      ],
      [
        { en: 'Mr. Wolf points to the other bed.', zh: '狼先生指指另一张床。' },
        { en: "\"I'm here!\" says Mr. Bear.", zh: '“我在这儿呀！”熊先生说。' },
        { en: "\"Look! I have a mouth too!\" he says.", zh: '“看！我也有嘴呢！”他说。' },
      ],
    ],
  },
  '2-5': {
    title: 'Who Am I?',
    titleZh: '猜猜我是谁？',
    paragraphs: [
      [
        { en: 'Ben has a big hat on his face.', zh: '小本把一顶大帽子扣在脸上。' },
        { en: "\"Who am I?\" he asks his friends.", zh: '“我是谁呀？”他问朋友们。' },
        { en: 'The children look and laugh.', zh: '孩子们看着看着都笑了。' },
        { en: "\"I have a face,\" says Ben.", zh: '“我有一张脸。”小本说。' },
      ],
      [
        { en: "\"I have a nose and a mouth!\"", zh: '“我有一个鼻子和一张嘴！”' },
        { en: "\"I have eyes, too,\" he says.", zh: '“我还有眼睛呢。”他说。' },
        { en: "\"But what is this?\" asks Mia.", zh: '“可这是什么呀？”米娅问。' },
        { en: 'She points to his yellow hair.', zh: '她指着他黄黄的头发。' },
        { en: "\"I have hair!\" says Ben.", zh: '“我有头发！”小本说。' },
      ],
      [
        { en: 'Mia takes off the big hat.', zh: '米娅摘下那顶大帽子。' },
        { en: "\"It's Ben! We know you now!\"", zh: '“是小本！我们认出你啦！”' },
        { en: "\"Hello, Ben!\" say the children.", zh: '“小本，你好呀！”孩子们说。' },
      ],
    ],
  },
  '2-6': {
    title: 'This Is His Soap',
    titleZh: '这是他的肥皂',
    paragraphs: [
      [
        { en: 'Ben and Mia play in the park.', zh: '小本和米娅在公园里玩。' },
        { en: 'Now they are not very clean.', zh: '这下他们可不太干净了。' },
        { en: "\"Wash! Wash! Wash!\" says Mom.", zh: '“洗！洗！洗！”妈妈说。' },
        { en: 'She puts things on the table.', zh: '她把东西一样样摆在桌上。' },
      ],
      [
        { en: "\"Is this my soap?\" asks Ben.", zh: '“这是我的肥皂吗？”小本问。' },
        { en: "\"This is his soap,\" says Mom.", zh: '“这是他的肥皂。”妈妈说。' },
        { en: "\"This is his towel and his comb.\"", zh: '“这是他的毛巾和他的梳子。”' },
        { en: "\"This is his toothbrush, too,\" she says.", zh: '“这也是他的牙刷。”她说。' },
        { en: "\"And this is her shampoo.\"", zh: '“这瓶洗发水是她的。”' },
      ],
      [
        { en: "\"Her towel is blue,\" says Mia.", zh: '“她的毛巾是蓝色的。”米娅说。' },
        { en: 'They wash and wash with the soap.', zh: '他们用肥皂洗呀洗呀。' },
        { en: "\"Good night, my clean little bears!\" says Mom.", zh: '“晚安啦，我干净的小熊们！”妈妈说。' },
      ],
    ],
  },
  '2-7': {
    title: 'Th, Th, Th!',
    titleZh: '嘴巴里的小声音',
    paragraphs: [
      [
        { en: 'It is a new morning in the bathroom.', zh: '浴室里，新的一天开始了。' },
        { en: 'Ben opens his mouth and looks.', zh: '小本张开嘴瞧了瞧。' },
        { en: "\"Open your mouth,\" says Lola.", zh: '“把嘴张开。”罗拉说。' },
        { en: "\"Th says th, th, th!\" she says.", zh: '“th 念 th、th、th！”她说。' },
      ],
      [
        { en: "Ben says, \"Th, th, th!\"", zh: '小本也念：“th、th、th！”' },
        { en: 'He laughs and laughs at the funny noise.', zh: '这声音怪怪的，他笑个不停。' },
        { en: "\"Brush your teeth now,\" says Lola.", zh: '“现在刷牙啦。”罗拉说。' },
        { en: 'He counts three teeth here.', zh: '他在这边数出三颗牙。' },
        { en: 'He counts thirteen teeth there.', zh: '他在那边数出十三颗牙。' },
      ],
      [
        { en: "\"Thirteen! Look at my teeth!\" he says.", zh: '“十三颗！看我的牙！”他说。' },
        { en: 'Now his teeth are clean and white again.', zh: '现在他的牙又白又干净啦。' },
        { en: "\"Th, th, thank you, teeth!\" says Ben.", zh: '“th、th，谢谢你，小牙齿！”小本说。' },
      ],
    ],
  },
  '2-8': {
    title: 'Twenty Baby Teeth',
    titleZh: '二十颗小乳牙',
    paragraphs: [
      [
        { en: 'Lola the doctor looks in his mouth.', zh: '罗拉医生往他嘴里瞧了瞧。' },
        { en: "\"How many teeth?\" asks Ben.", zh: '“有多少颗牙呀？”小本问。' },
        { en: "\"You have twenty baby teeth,\" she says.", zh: '“你有二十颗乳牙呢。”她说。' },
        { en: "\"When you are three, you get teeth.\"", zh: '“你三岁的时候就长牙啦。”' },
      ],
      [
        { en: "\"Baby teeth are small,\" says Lola.", zh: '“乳牙小小的。”罗拉说。' },
        { en: "\"Then you get adult teeth,\" she says.", zh: '“以后还会长恒牙。”她说。' },
        { en: 'Ben thinks about his small teeth.', zh: '小本想着自己小小的牙。' },
        { en: "\"I want big adult teeth!\" he says.", zh: '“我想要大大的恒牙！”他说。' },
      ],
      [
        { en: "\"Take care of your teeth,\" says Lola.", zh: '“要好好照顾你的牙。”罗拉说。' },
        { en: "\"Brush your teeth three times a day!\"", zh: '“每天刷三次牙哦！”' },
        { en: 'Ben opens his mouth and smiles.', zh: '小本张开嘴，笑了。' },
        { en: "\"Thank you, twenty teeth!\" he says.", zh: '“谢谢你，二十颗小牙！”他说。' },
      ],
    ],
  },
  '2-9': {
    title: 'Five Lost Things',
    titleZh: '丢了的五样东西',
    paragraphs: [
      [
        { en: 'Ben looks at his room. Oh no!', zh: '小本看了看自己的房间。哦不！' },
        { en: 'His five things are all lost.', zh: '他的五样东西全都不见了。' },
        { en: "\"Where is my comb?\" he asks.", zh: '“我的梳子在哪儿呀？”他问。' },
        { en: 'The comb is under the bed.', zh: '梳子在床底下呢。' },
      ],
      [
        { en: 'He finds a towel on the chair.', zh: '他在椅子上找到一条毛巾。' },
        { en: "\"This is my towel,\" he says.", zh: '“这是我的毛巾。”他说。' },
        { en: 'His brush is in a red shoe.', zh: '他的刷子藏在一只红鞋里。' },
        { en: 'He finds the soap and the toothbrush.', zh: '他又找到肥皂和牙刷。' },
        { en: "\"This is his toothbrush,\" says Mom.", zh: '“这是他的牙刷。”妈妈说。' },
      ],
      [
        { en: "\"This is his soap, too,\" she says.", zh: '“这也是他的肥皂。”她说。' },
        { en: 'Now Ben has all five things.', zh: '现在小本五样东西都齐了。' },
        { en: "\"Good night, my clean boy!\" says Mom.", zh: '“晚安啦，我的干净小子！”妈妈说。' },
      ],
    ],
  },
  '2-10': {
    title: 'The Blue Nose',
    titleZh: '蓝蓝的鼻子',
    paragraphs: [
      [
        { en: 'It is a game at school today.', zh: '今天学校里有个小游戏。' },
        { en: "\"Let's draw a big face!\" says Mia.", zh: '“我们来画一张大脸吧！”米娅说。' },
        { en: 'Ben has a new blue pencil.', zh: '小本有一支新的蓝铅笔。' },
        { en: "\"It's my pencil,\" he says.", zh: '“这是我的铅笔。”他说。' },
      ],
      [
        { en: 'Mia draws a big blue nose.', zh: '米娅画了一个大大的蓝鼻子。' },
        { en: "\"Look at the blue nose!\" says Ben.", zh: '“快看这个蓝鼻子！”小本说。' },
        { en: 'She draws white teeth, too.', zh: '她还画了白白的牙齿。' },
        { en: "\"I have teeth like that!\" says Ben.", zh: '“我的牙就长这样！”小本说。' },
        { en: 'A towel is on the picture now.', zh: '这会儿画上盖着一条毛巾。' },
      ],
      [
        { en: "\"This is her towel,\" says Mia.", zh: '“这是她的毛巾。”米娅说。' },
        { en: "\"No, it is his towel!\" says Ben.", zh: '“不对，是他的毛巾！”小本说。' },
        { en: 'They take off the towel. The blue nose smiles!', zh: '他们掀开毛巾，蓝鼻子正冲着他们笑呢！' },
      ],
    ],
  },
  '2-11': {
    title: 'Miho from Japan',
    titleZh: '来自日本的美穗',
    paragraphs: [
      [
        { en: "Hello! I'm Miho. I'm from Japan.", zh: '你好！我是美穗，我来自日本。' },
        { en: "I'm six. I'm in grade one.", zh: '我六岁，上一年级啦。' },
        { en: 'This is my teacher, Mr. Sato.', zh: '这是我的老师，佐藤先生。' },
        { en: "\"Good morning, Miho!\" he says.", zh: '“美穗，早上好！”他说。' },
      ],
      [
        { en: 'I have lunch at school today.', zh: '今天我在学校吃午饭。' },
        { en: 'I eat my lunch in my classroom.', zh: '我在教室里吃自己的午饭。' },
        { en: 'Today I have rice, fish and milk.', zh: '今天有米饭、鱼和牛奶。' },
        { en: 'But my chopsticks are not here.', zh: '可是我的筷子不见了。' },
      ],
      [
        { en: "\"I can't eat my rice!\" I say.", zh: '“我吃不到米饭啦！”我着急地说。' },
        { en: 'Mr. Sato brings new chopsticks for me.', zh: '佐藤先生给我拿来新筷子。' },
        { en: 'I use chopsticks and eat my rice.', zh: '我用筷子，把米饭吃光光。' },
        { en: 'Tomorrow, lunch at school again!', zh: '明天，又要在学校吃午饭喽！' },
      ],
    ],
  },
}

export function getReadingPassage2(unitId: number, lessonId: number): ReadingPassage | undefined {
  return u2_reading[`${unitId}-${lessonId}`]
}

// ============================================================================
// 5. 拓展主题（4 个新键：body-parts / doctor / feelings / japan）
// ============================================================================
export const u2_ext: Record<string, ExtTopic> = {
  'body-parts': {
    zh: '身体部位',
    words: [
      w('eyes', '眼睛', '👀'), w('ears', '耳朵', '👂'), w('nose', '鼻子', '👃'),
      w('mouth', '嘴', '👄'), w('teeth', '牙齿', '🦷'), w('hair', '头发', '💇'),
      w('face', '脸', '😐'), w('feet', '脚', '🦶'),
    ],
  },
  doctor: {
    zh: '看医生',
    words: [
      w('doctor', '医生', '🩺'), w('hospital', '医院', '🏥'), w('nurse', '护士', '👩‍⚕️'),
      w('ill', '生病的', '🤒'), w('bandage', '绷带', '🩹'), w('medicine', '药', '💊'),
      w('toothbrush', '牙刷', '🪥'),
    ],
  },
  feelings: {
    zh: '感受与生病',
    words: [
      w('ill', '生病的', '🤒'), w('happy', '开心的', '😀'), w('sad', '伤心的', '😢'),
      w('tired', '累的', '😴'), w('hurt', '受伤的', '🤕'), w('cold', '冷的', '🥶'),
      w('hot', '热的', '🥵'),
    ],
  },
  japan: {
    zh: '日本文化',
    words: [
      w('Japan', '日本', '🇯🇵'), w('teacher', '老师', '👩‍🏫'), w('lunch', '午餐', '🍱'),
      w('rice', '米饭', '🍚'), w('fish', '鱼', '🐟'), w('milk', '牛奶', '🥛'),
      w('chopsticks', '筷子', '🥢'),
    ],
  },
}

// ============================================================================
// 6. 单元模块（预览 + 测验）
// ============================================================================
export const u2_module: Module = {
  id: 2,
  slug: 'lola-the-doctor',
  title: 'Lola the Doctor',
  titleZh: '罗拉医生',
  emoji: '🩺',
  color: '#F5B017',
  colorSoft: '#FFF3C4',
  preview: {
    goals: [
      '认识身体部位（眼睛/耳朵/鼻子/嘴/牙齿/头发/脸/脚/脚趾），并能用 Look at my... 指认',
      '学会用 I have a... / I have... 表达"我有……"（单数加 a，复数不加）',
      '学会用 This is his / her... 表达"这是他/她的……"',
      '听懂并学说自然拼读 th 音（mouth, teeth, three 等）',
      '通过「可怜的熊先生」故事复习身体部位，并了解护牙常识（CLIL 科学）',
      '了解日本文化：美穗的学校生活（在校吃午饭、刷牙）',
    ],
    keyWords: 'eyes, ears, nose, mouth, teeth, hair, face, cheeks, feet, toes, doctor, hospital, ill, towel, soap, toothbrush',
    keySentences: "Look at my eyes. I have a mouth. I have eyes. This is his soap. This is her towel. Brush your teeth.",
    tip: '预习时对着镜子指认身体部位并用英语说出 Look at my...；读「可怜的熊先生」故事时模仿医生与病人的语气；学 th 音时把舌尖轻轻伸到上下齿之间。',
  },
  lessons: u2_lessons[2],
  quiz: [
    { q: '看，我有一张嘴。👄', options: ['I have a mouth.', 'I have mouth.', 'I have mouths.'], answer: 0, explain: '单数可数名词前要加 a，所以是 I have a mouth.' },
    { q: '这是她的毛巾。🧻', options: ["This is his towel.", "This is her towel.", "This is my towel."], answer: 1, explain: 'her = 她的。' },
    { q: '熊先生怎么了？他在哪里？🐻', options: ['He is ill. He is in the hospital.', "He is happy. He is at school.", 'He is six. He is in Japan.'], answer: 0, explain: '故事里熊先生生病了，在医院。' },
    { q: '下面哪个单词含有 th 音？🦷', options: ['teeth', 'nose', 'eyes'], answer: 0, explain: 'teeth 开头是 th 音；nose 和 eyes 不含 th。' },
    { q: '美穗来自哪里？🇯🇵', options: ['Japan', 'China', 'America'], answer: 0, explain: "I'm Miho. I'm from Japan. 美穗来自日本。" },
  ],
}
