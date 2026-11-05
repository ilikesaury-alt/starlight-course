// Starlight 1 · Level 1 · Unit 5「Monty the Farmer」课程数据
// 数据来源：src/data/starlight1/raw/unit5.json（教材 PDF 提取文本）
// 结构对齐 Unit 1 试点（u1 系列）：lessons / book / sentenceFrames / reading / extensions / index。
// 农场动物 + 「丑小鸟找妈妈」故事 + It's / It isn't 语法 + 宝宝动物 + /ch/ 拼读 + CLIL 音乐（彼得与狼）。

import type { Lesson, LessonBook, SentenceFrame, ReadingPassage, Module, ExtTopic } from './shared'
import { w } from './shared'

// ============================================================
// 1. Lessons —— 每课独立的单词 + 句型（9 课，id = PDF 课号）
// ============================================================

export const u5_lessons: Record<number, Lesson[]> = {
  5: [
    {
      id: 1,
      title: 'Farm Animals',
      titleZh: '农场动物（词汇）',
      words: [
        { en: 'bird', zh: '鸟', emoji: '🐦', ipa: '/bɜːd/' },
        { en: 'frog', zh: '青蛙', emoji: '🐸', ipa: '/frɒɡ/' },
        { en: 'duck', zh: '鸭子', emoji: '🦆', ipa: '/dʌk/' },
        { en: 'chicken', zh: '鸡', emoji: '🐔', ipa: '/ˈtʃɪkɪn/' },
        { en: 'horse', zh: '马', emoji: '🐴', ipa: '/hɔːs/' },
      ],
      sentences: [
        { en: "I'm Monty, a farmer.", zh: '我是蒙蒂，一个农场主。', hint: '自我介绍身份' },
        { en: 'Where are the animals on my farm?', zh: '我农场里的动物都在哪儿？', hint: '询问农场动物的位置' },
        { en: "What's this animal?", zh: '这是什么动物？', hint: '指着动物提问' },
        { en: "Here's a horse.", zh: '这是一匹马。', hint: 'Here\'s = Here is（这是）' },
        { en: "They're all on the farm.", zh: '它们都在农场上。', hint: 'They\'re = They are' },
      ],
    },
    {
      id: 2,
      title: 'More Farm Animals',
      titleZh: '更多农场动物（词汇与练习）',
      words: [
        { en: 'bull', zh: '公牛', emoji: '🐂', ipa: '/bʊl/' },
        { en: 'cow', zh: '奶牛', emoji: '🐄', ipa: '/kaʊ/' },
        { en: 'goat', zh: '山羊', emoji: '🐐', ipa: '/ɡəʊt/' },
        { en: 'sheep', zh: '绵羊', emoji: '🐑', ipa: '/ʃiːp/' },
        { en: 'rabbit', zh: '兔子', emoji: '🐰', ipa: '/ˈræbɪt/' },
      ],
      sentences: [
        { en: 'I have five animals now.', zh: '我现在有五个动物了。', hint: '说自己拥有的动物' },
        { en: 'What are they? Let’s see!', zh: '它们是什么？我们来看看！', hint: '引出新词' },
        { en: "Here's a sheep.", zh: '这是一只绵羊。', hint: '唱歌里的句子' },
        { en: "Here's a goat.", zh: '这是一只山羊。', hint: '唱歌里的句子' },
        { en: 'What other animals do you know?', zh: '你还知道什么别的动物？', hint: '拓展提问' },
      ],
    },
    {
      id: 3,
      title: 'Ugly Bird',
      titleZh: '丑小鸟（阅读）',
      words: [
        { en: 'ugly', zh: '丑陋的', emoji: '😕', ipa: '/ˈʌɡli/' },
        { en: 'farm', zh: '农场', emoji: '🚜', ipa: '/fɑːm/' },
        { en: 'bird', zh: '鸟', emoji: '🐦', ipa: '/bɜːd/' },
        { en: 'mom', zh: '妈妈', emoji: '👩', ipa: '/mɒm/' },
        { en: 'gray', zh: '灰色的', emoji: '🌫️', ipa: '/ɡreɪ/' },
      ],
      sentences: [
        { en: 'An ugly bird is on a farm.', zh: '一只丑小鸟在农场上。', hint: '故事开场' },
        { en: 'Are you my mom?', zh: '你是我的妈妈吗？', hint: '丑小鸟的追问' },
        { en: "No! I'm not your mom.", zh: '不！我不是你的妈妈。', hint: '拒绝回答' },
        { en: "Where's my mom?", zh: '我的妈妈在哪里？', hint: 'Where\'s = Where is' },
        { en: "It isn't a chicken!", zh: '它不是一只鸡！', hint: 'It isn\'t = It is not' },
      ],
    },
    {
      id: 4,
      title: 'The Swan Mom',
      titleZh: '天鹅妈妈（阅读与练习）',
      words: [
        { en: 'swan', zh: '天鹅', emoji: '🦢', ipa: '/swɒn/' },
        { en: 'beautiful', zh: '美丽的', emoji: '🌟', ipa: '/ˈbjuːtɪfl/' },
        { en: 'frog', zh: '青蛙', emoji: '🐸', ipa: '/frɒɡ/' },
        { en: 'gray', zh: '灰色的', emoji: '🌫️', ipa: '/ɡreɪ/' },
        { en: 'mom', zh: '妈妈', emoji: '👩', ipa: '/mɒm/' },
      ],
      sentences: [
        { en: 'Then the ugly bird sees a frog.', zh: '然后丑小鸟看见一只青蛙。', hint: '故事继续' },
        { en: "It isn't a frog! It's gray and ugly!", zh: '它不是青蛙！它是灰色又丑的！', hint: '否定 + 描述' },
        { en: "It's a swan! Look at that bird! It's beautiful!", zh: '是一只天鹅！看那只鸟！它真美！', hint: '惊喜发现' },
        { en: "Yes! I'm your mom!", zh: '是的！我是你的妈妈！', hint: '找到妈妈' },
        { en: "It isn't an ugly bird! It's a swan!", zh: '它不是丑小鸟了！它是一只天鹅！', hint: '结局' },
      ],
    },
    {
      id: 5,
      title: 'What Is It?',
      titleZh: '它是什么？（语言焦点）',
      words: [
        { en: 'rabbit', zh: '兔子', emoji: '🐰', ipa: '/ˈræbɪt/' },
        { en: 'frog', zh: '青蛙', emoji: '🐸', ipa: '/frɒɡ/' },
        { en: 'bull', zh: '公牛', emoji: '🐂', ipa: '/bʊl/' },
        { en: 'duck', zh: '鸭子', emoji: '🦆', ipa: '/dʌk/' },
        { en: 'goat', zh: '山羊', emoji: '🐐', ipa: '/ɡəʊt/' },
      ],
      sentences: [
        { en: "What's this animal?", zh: '这是什么动物？', hint: '猜动物' },
        { en: 'Is it a cow? Is it a chicken?', zh: '它是一头牛吗？是一只鸡吗？', hint: '一般疑问句猜测' },
        { en: "It's a rabbit.", zh: '它是一只兔子。', hint: '肯定回答' },
        { en: "It isn't a duck.", zh: '它不是一只鸭子。', hint: '否定判断' },
        { en: "It isn't a cow. It's a sheep.", zh: '它不是奶牛，是绵羊。', hint: 'It isn\'t = It is not' },
      ],
    },
    {
      id: 6,
      title: 'Baby Animals',
      titleZh: '动物宝宝（语言焦点与练习）',
      words: [
        { en: 'chick', zh: '小鸡', emoji: '🐥', ipa: '/tʃɪk/' },
        { en: 'lamb', zh: '小羊', emoji: '🐑', ipa: '/læm/' },
        { en: 'kid', zh: '小山羊', emoji: '🐐', ipa: '/kɪd/' },
        { en: 'calf', zh: '小牛', emoji: '🐮', ipa: '/kɑːf/' },
        { en: 'foal', zh: '小马', emoji: '🐴', ipa: '/fəʊl/' },
      ],
      sentences: [
        { en: "Where's my chick?", zh: '我的小鸡在哪里？', hint: '着急地寻找' },
        { en: "It's here! Here's my chick!", zh: '在这里！这是我的小鸡！', hint: '找到啦' },
        { en: "Where's the chick? It's here.", zh: '小鸡在哪里？在这里。', hint: '问答位置' },
        { en: "Here's a calf and here's a kid.", zh: '这是一头小牛，这是一只小山羊。', hint: '介绍动物宝宝' },
        { en: "Oh dear! Where's my chick?", zh: '哎呀！我的小鸡在哪里？', hint: '歌词里的感叹' },
      ],
    },
    {
      id: 7,
      title: 'Phonics: /ch/',
      titleZh: '自然拼读：/ch/ 音',
      words: [
        { en: 'chick', zh: '小鸡', emoji: '🐥', ipa: '/tʃɪk/' },
        { en: 'chicken', zh: '鸡', emoji: '🐔', ipa: '/ˈtʃɪkɪn/' },
        { en: 'chair', zh: '椅子', emoji: '🪑', ipa: '/tʃeə/' },
        { en: 'teacher', zh: '老师', emoji: '👩‍🏫', ipa: '/ˈtiːtʃə/' },
        { en: 'chocolates', zh: '巧克力（复数）', emoji: '🍫', ipa: '/ˈtʃɒkləts/' },
      ],
      sentences: [
        { en: 'What sound does ch make?', zh: 'ch 发什么音？', hint: '引出拼读规律' },
        { en: 'Here’s a chick and a chicken, too.', zh: '这里有一只小鸡，还有一只母鸡。', hint: '含 /ch/ 的歌谣' },
        { en: "Here's a teacher. She's on a chair.", zh: '这里有一位老师，她坐在椅子上。', hint: 'chair / teacher 对比' },
        { en: 'She has pink cheeks and long, black hair.', zh: '她有粉色的脸颊和长长的黑发。', hint: 'cheeks 脸颊' },
        { en: "Where's the chicken?", zh: '鸡在哪里？', hint: '听音辨词' },
      ],
    },
    {
      id: 8,
      title: 'CLIL: Peter and the Wolf',
      titleZh: 'CLIL 音乐：彼得与狼',
      words: [
        { en: 'clarinet', zh: '单簧管', emoji: '🎶', ipa: '/ˌklærəˈnet/' },
        { en: 'flute', zh: '长笛', emoji: '🎼', ipa: '/fluːt/' },
        { en: 'French horn', zh: '法国号', emoji: '📯', ipa: '/frentʃ hɔːn/' },
        { en: 'oboe', zh: '双簧管', emoji: '🎵', ipa: '/ˈəʊbəʊ/' },
        { en: 'instrument', zh: '乐器', emoji: '🎺', ipa: '/ˈɪnstrəmənt/' },
      ],
      sentences: [
        { en: 'What’s your favorite musical instrument?', zh: '你最喜欢的乐器是什么？', hint: '音乐话题开场' },
        { en: 'Peter and the Wolf is a famous story.', zh: '《彼得与狼》是一个著名的故事。', hint: '介绍作品' },
        { en: 'Each animal is a different instrument.', zh: '每个动物对应一种不同的乐器。', hint: '动物与乐器配对' },
        { en: 'The music helps us imagine the animals.', zh: '音乐帮助我们想象那些动物。', hint: '音乐的作用' },
        { en: 'Can you imagine the cat when you hear this music?', zh: '听到这段音乐你能想象出猫吗？', hint: '听音联想' },
      ],
    },
    {
      id: 9,
      title: 'Practice',
      titleZh: '综合练习',
      words: [
        { en: 'chick', zh: '小鸡', emoji: '🐥', ipa: '/tʃɪk/' },
        { en: 'chicken', zh: '鸡', emoji: '🐔', ipa: '/ˈtʃɪkɪn/' },
        { en: 'foal', zh: '小马', emoji: '🐴', ipa: '/fəʊl/' },
        { en: 'calf', zh: '小牛', emoji: '🐮', ipa: '/kɑːf/' },
        { en: 'lamb', zh: '小羊', emoji: '🐑', ipa: '/læm/' },
      ],
      sentences: [
        { en: "It isn't a duck. It's a bird.", zh: '它不是鸭子，是鸟。', hint: '否定 + 肯定' },
        { en: "It isn't a chicken. It's a chick.", zh: '它不是母鸡，是小鸡。', hint: '成鸡 vs 鸡宝宝' },
        { en: "It isn't a horse. It's a bull.", zh: '它不是马，是公牛。', hint: '马 vs 公牛' },
        { en: "Where's the chick? It's here!", zh: '小鸡在哪里？在这里！', hint: '问答位置' },
        { en: 'The two girls are on a farm.', zh: '两个女孩在农场上。', hint: '练习场景' },
      ],
    },
  ],
}

// ============================================================
// 2. LessonBook —— 课本原文（按活动分节，只留教学相关句）
// ============================================================

export const u5_book: Record<string, LessonBook> = {
  '5-1': {
    title: 'Farm Animals',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: "I'm Monty, a farmer. Oh no!", textZh: '我是蒙蒂，一个农场主。哦不！' },
        { text: 'Where are the animals on my farm?', textZh: '我农场里的动物都在哪儿？' },
        { text: 'Could you help me find them?', textZh: '你能帮我找到它们吗？' },
      ] },
      { chapter: 'Focus on: farm animals.', chapterZh: '重点词汇：农场动物。', pages: [
        { text: 'bird', textZh: '鸟' },
        { text: 'frog', textZh: '青蛙' },
        { text: 'duck', textZh: '鸭子' },
        { text: 'chicken', textZh: '鸡' },
        { text: 'horse', textZh: '马' },
      ] },
      { chapter: 'Listen and sing along.', chapterZh: '听一听，一起唱。', pages: [
        { text: "Here's a horse.", textZh: '这是一匹马。' },
        { text: "Here's a sheep.", textZh: '这是一只绵羊。' },
        { text: "Here's a bird, Tweet, tweet, tweet!", textZh: '这是一只鸟，啾、啾、啾！' },
        { text: "Here's a bull.", textZh: '这是一头公牛。' },
        { text: "Here's a goat.", textZh: '这是一只山羊。' },
        { text: "Here's a frog, Croak, croak, croak!", textZh: '这是一只青蛙，呱、呱、呱！' },
      ] },
    ],
  },
  '5-2': {
    title: 'More Farm Animals',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'Wow, I have five animals now.', textZh: '哇，我现在有五个动物了。' },
        { text: 'What are they? Let’s see!', textZh: '它们是什么？我们来看看！' },
      ] },
      { chapter: 'Focus on: more farm animals.', chapterZh: '重点词汇：更多农场动物。', pages: [
        { text: 'bull', textZh: '公牛' },
        { text: 'cow', textZh: '奶牛' },
        { text: 'goat', textZh: '山羊' },
        { text: 'sheep', textZh: '绵羊' },
        { text: 'rabbit', textZh: '兔子' },
      ] },
      { chapter: 'Listen and sing along.', chapterZh: '听一听，一起唱。', pages: [
        { text: "Here's a horse. Here's a sheep.", textZh: '这是一匹马。这是一只绵羊。' },
        { text: "Here's a bird, Tweet, tweet, tweet!", textZh: '这是一只鸟，啾、啾、啾！' },
        { text: "Here's a bull. Here's a goat.", textZh: '这是一头公牛。这是一只山羊。' },
        { text: "Here's a frog, Croak, croak, croak!", textZh: '这是一只青蛙，呱、呱、呱！' },
      ] },
      { chapter: 'Summary.', chapterZh: '小结。', pages: [
        { text: 'What other animals do you know?', textZh: '你还知道什么别的动物？' },
      ] },
    ],
  },
  '5-3': {
    title: 'Ugly Bird',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'Ugly Bird', textZh: '丑小鸟' },
        { text: 'What animals do you see?', textZh: '你看到了什么动物？' },
      ] },
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'An ugly bird is on a farm.', textZh: '一只丑小鸟在农场上。' },
        { text: 'The ugly bird sees a chicken.', textZh: '丑小鸟看见一只鸡。' },
        { text: 'Are you my mom?', textZh: '你是我的妈妈吗？' },
        { text: "No! I'm not your mom.", textZh: '不！我不是你的妈妈。' },
        { text: "Where's my mom?", textZh: '我的妈妈在哪里？' },
        { text: "It isn't a chicken! It's gray and ugly!", textZh: '它不是鸡！它是灰色又丑的！' },
      ] },
      { chapter: 'Show Time.', chapterZh: '展示时间。', pages: [
        { text: 'Hello, everyone! I’m ...', textZh: '大家好！我是……' },
        { text: 'I can see a cow, ... on the farm.', textZh: '我在农场上能看到一头奶牛……' },
        { text: 'The cow is ...', textZh: '这头奶牛是……' },
      ] },
    ],
  },
  '5-4': {
    title: 'The Swan Mom',
    sections: [
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'Then the ugly bird sees a frog.', textZh: '然后丑小鸟看见一只青蛙。' },
        { text: "It isn't a frog! It isn't green! It's gray and ugly!", textZh: '它不是青蛙！它不是绿色的！它是灰色又丑的！' },
        { text: 'Suddenly, the animals see a big, white bird.', textZh: '突然，动物们看见一只大大的白色鸟。' },
        { text: "It's a swan! Look at that bird! It's beautiful!", textZh: '是一只天鹅！看那只鸟！它真美！' },
        { text: 'Then the ugly bird sees the swan.', textZh: '然后丑小鸟看见了天鹅。' },
        { text: "Are you my mom? Yes! I'm your mom!", textZh: '你是我的妈妈吗？是的！我是你的妈妈！' },
        { text: "Wow! My baby! My mom! It isn't an ugly bird! It's a swan!", textZh: '哇！我的宝宝！我的妈妈！它不是丑小鸟了！它是一只天鹅！' },
      ] },
      { chapter: 'Role-play.', chapterZh: '角色扮演。', pages: [
        { text: 'Are you my mom?', textZh: '你是我的妈妈吗？' },
        { text: "No! I'm not your mom.", textZh: '不！我不是你的妈妈。' },
        { text: "Yes! I'm your mom.", textZh: '是的！我是你的妈妈。' },
      ] },
      { chapter: 'Make a sentence.', chapterZh: '造句。', pages: [
        { text: 'The cow is black and white.', textZh: '这头奶牛是黑白的。' },
        { text: 'The swan is not gray and ugly.', textZh: '天鹅不是灰色又丑的。' },
      ] },
    ],
  },
  '5-5': {
    title: 'What Is It?',
    sections: [
      { chapter: 'Imitate and say.', chapterZh: '模仿说一说。', pages: [
        { text: "What's this animal?", textZh: '这是什么动物？' },
        { text: 'Is it a cow? Is it a chicken?', textZh: '它是一头牛吗？是一只鸡吗？' },
      ] },
      { chapter: 'Discover the rule.', chapterZh: '发现规律。', pages: [
        { text: "It's a rabbit. It isn't a cow.", textZh: '它是一只兔子，不是奶牛。' },
        { text: "It isn't = It is not", textZh: 'It isn’t = It is not（它不是）' },
        { text: "It's = It is", textZh: 'It’s = It is（它是）' },
      ] },
      { chapter: 'Read and number.', chapterZh: '读一读，标序号。', pages: [
        { text: "It isn't a duck. It's a rabbit.", textZh: '它不是鸭子，是兔子。' },
        { text: "It isn't a horse. It's a bird.", textZh: '它不是马，是鸟。' },
        { text: "It isn't a bull. It's a goat.", textZh: '它不是公牛，是山羊。' },
        { text: "It isn't a cow. It's a sheep.", textZh: '它不是奶牛，是绵羊。' },
      ] },
      { chapter: 'Make sentences.', chapterZh: '造句。', pages: [
        { text: "It isn't a rabbit. It's a frog.", textZh: '它不是兔子，是青蛙。' },
        { text: "It isn't a bull. It's a horse.", textZh: '它不是公牛，是马。' },
        { text: "It isn't a duck. It's a bird.", textZh: '它不是鸭子，是鸟。' },
        { text: "It isn't a frog. It's a rabbit.", textZh: '它不是青蛙，是兔子。' },
        { text: "It isn't a goat. It's a chicken.", textZh: '它不是山羊，是鸡。' },
      ] },
    ],
  },
  '5-6': {
    title: 'Baby Animals',
    sections: [
      { chapter: 'Focus on: baby animals.', chapterZh: '重点词汇：动物宝宝。', pages: [
        { text: 'chick', textZh: '小鸡' },
        { text: 'lamb', textZh: '小羊' },
        { text: 'kid', textZh: '小山羊' },
        { text: 'calf', textZh: '小牛' },
        { text: 'foal', textZh: '小马' },
      ] },
      { chapter: 'Song Time.', chapterZh: '歌唱时间。', pages: [
        { text: "Oh dear! Where's my chick? Quick, quick, quick!", textZh: '哎呀！我的小鸡在哪里？快、快、快！' },
        { text: "Here's a calf and here's a kid.", textZh: '这是一头小牛，这是一只小山羊。' },
        { text: "Here's a lamb and here's a foal.", textZh: '这是一只小羊，这是一匹小马。' },
        { text: "It's here! Here's my chick! Chick, chick, chick!", textZh: '在这里！这是我的小鸡！小鸡、小鸡、小鸡！' },
      ] },
      { chapter: 'Grammar.', chapterZh: '语法。', pages: [
        { text: "Where's the chick? It's here.", textZh: '小鸡在哪里？在这里。' },
      ] },
      { chapter: 'Summary.', chapterZh: '小结。', pages: [
        { text: 'Farm Animals / Baby Farm Animals', textZh: '农场动物／农场动物宝宝' },
      ] },
    ],
  },
  '5-7': {
    title: 'Phonics: /ch/',
    sections: [
      { chapter: 'Phonics.', chapterZh: '自然拼读。', pages: [
        { text: 'chicken, chick, chair', textZh: 'chicken、chick、chair' },
        { text: 'What sound does ch make?', textZh: 'ch 发什么音？' },
        { text: 'chair, chick, chicken', textZh: 'chair、chick、chicken' },
        { text: 'chocolates, teacher, cheeks', textZh: 'chocolates、teacher、cheeks' },
      ] },
      { chapter: 'Listen and underline.', chapterZh: '听一听，划出 /ch/ 词。', pages: [
        { text: 'Here’s a chick and a chicken, too.', textZh: '这里有一只小鸡，还有一只母鸡。' },
        { text: 'Here are chocolates for me and you.', textZh: '这里有一些巧克力，给你也给我。' },
        { text: "Here's a teacher. She's on a chair.", textZh: '这里有一位老师，她坐在椅子上。' },
        { text: 'She has pink cheeks and long, black hair.', textZh: '她有粉色的脸颊和长长的黑发。' },
      ] },
      { chapter: 'Summary.', chapterZh: '小结。', pages: [
        { text: 'ch: chair, teacher, cheeks, chick, chocolates, chicken', textZh: 'ch：chair、teacher、cheeks、chick、chocolates、chicken' },
      ] },
    ],
  },
  '5-8': {
    title: 'CLIL: Peter and the Wolf',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'What’s your favorite musical instrument?', textZh: '你最喜欢的乐器是什么？' },
        { text: 'Can you imagine some animals when you hear the music?', textZh: '听到这段音乐你能想象出一些动物吗？' },
      ] },
      { chapter: 'Focus on: instruments.', chapterZh: '重点词汇：乐器。', pages: [
        { text: 'clarinet', textZh: '单簧管' },
        { text: 'flute', textZh: '长笛' },
        { text: 'French horn', textZh: '法国号' },
        { text: 'oboe', textZh: '双簧管' },
        { text: 'Can you imagine the cat / bird / wolf / duck when you hear this music?', textZh: '听到这段音乐，你能想象出猫／鸟／狼／鸭子吗？' },
      ] },
      { chapter: 'Read the text.', chapterZh: '读短文。', pages: [
        { text: 'Peter and the Wolf is a famous story about a boy and four animals.', textZh: '《彼得与狼》是一个关于一个男孩和四种动物的著名故事。' },
        { text: "It isn't a story with words and pictures. It's a story with words and music.", textZh: '它不是用文字和图画讲的故事，而是用文字和音乐讲的故事。' },
        { text: 'There’s a bird, a duck, a cat and a wolf.', textZh: '有一只鸟、一只鸭子、一只猫和一只狼。' },
        { text: 'Each animal is a different instrument.', textZh: '每个动物对应一种不同的乐器。' },
        { text: 'There’s a clarinet, a flute, a French horn and an oboe.', textZh: '有单簧管、长笛、法国号和双簧管。' },
        { text: 'The music helps us imagine the animals.', textZh: '音乐帮助我们想象那些动物。' },
      ] },
    ],
  },
  '5-9': {
    title: 'Practice',
    sections: [
      { chapter: 'Listen and read.', chapterZh: '听一听，读一读。', pages: [
        { text: 'Here’s a chick and a chicken, too.', textZh: '这里有一只小鸡，还有一只母鸡。' },
        { text: 'Here are chocolates for me and you.', textZh: '这里有一些巧克力，给你也给我。' },
        { text: "Here's a teacher. She's on a chair.", textZh: '这里有一位老师，她坐在椅子上。' },
        { text: 'She has pink cheeks and long, black hair.', textZh: '她有粉色的脸颊和长长的黑发。' },
      ] },
      { chapter: 'Listen, circle and read.', chapterZh: '听一听，圈一圈，读一读。', pages: [
        { text: "It isn't a duck. It's a bird.", textZh: '它不是鸭子，是鸟。' },
        { text: "It isn't a chicken. It's a chick.", textZh: '它不是母鸡，是小鸡。' },
        { text: "It isn't a horse. It's a bull.", textZh: '它不是马，是公牛。' },
        { text: "It isn't a goat. It's a frog.", textZh: '它不是山羊，是青蛙。' },
      ] },
      { chapter: 'Look, read and circle.', chapterZh: '看一看，读一读，圈一圈。', pages: [
        { text: 'The two girls are on a farm. Let’s help them find some baby animals.', textZh: '两个女孩在农场上，我们帮她们找一些动物宝宝吧。' },
        { text: "Where's the chick? It's here!", textZh: '小鸡在哪里？在这里！' },
        { text: "Where's the foal? It's here!", textZh: '小马在哪里？在这里！' },
        { text: "Where's the calf? It's here!", textZh: '小牛在哪里？在这里！' },
        { text: "Where's the lamb? It's here!", textZh: '小羊在哪里？在这里！' },
        { text: "Where's the kid? It's here!", textZh: '小山羊在哪里？在这里！' },
      ] },
    ],
  },
}

// ============================================================
// 3. SentenceFrames —— 句型框架卡（来自 Language Focus 课 5、6）
// ============================================================

export const u5_frames: SentenceFrame[] = [
  {
    id: 'l1-monty-the-farmer-5-is-it',
    pattern: 'Is it a ___?',
    blanks: [
      {
        options: ['cow', 'chicken', 'rabbit', 'duck'],
        answer: 0,
        zhOptions: ['它是一头牛吗？', '它是一只鸡吗？', '它是一只兔子吗？', '它是一只鸭子吗？'],
      },
    ],
    zh: '它是一头牛吗？',
    hint: '用 Is it a...? 猜动物',
    unitSlug: 'monty-the-farmer',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-farmer-5-its-a',
    pattern: "It's a ___.",
    blanks: [
      {
        options: ['rabbit', 'frog', 'bird', 'sheep'],
        answer: 0,
        zhOptions: ['它是一只兔子。', '它是一只青蛙。', '它是一只鸟。', '它是一只绵羊。'],
      },
    ],
    zh: '它是一只兔子。',
    hint: '肯定回答（It\'s = It is）',
    unitSlug: 'monty-the-farmer',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-farmer-5-isnt-a',
    pattern: "It isn't a ___.",
    blanks: [
      {
        options: ['duck', 'horse', 'bull', 'cow'],
        answer: 0,
        zhOptions: ['它不是一只鸭子。', '它不是一匹马。', '它不是一头公牛。', '它不是一头奶牛。'],
      },
    ],
    zh: '它不是一只鸭子。',
    hint: '否定判断（It isn\'t = It is not）',
    unitSlug: 'monty-the-farmer',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-farmer-6-wheres',
    pattern: "Where's the ___?",
    blanks: [
      {
        options: ['chick', 'foal', 'calf', 'lamb', 'kid'],
        answer: 0,
        zhOptions: ['小鸡在哪里？', '小马在哪里？', '小牛在哪里？', '小羊在哪里？', '小山羊在哪里？'],
      },
    ],
    zh: '小鸡在哪里？',
    hint: 'Where\'s = Where is，问动物宝宝在哪',
    unitSlug: 'monty-the-farmer',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-farmer-6-its',
    pattern: "It's ___.",
    blanks: [
      {
        options: ['here', 'there'],
        answer: 0,
        zhOptions: ['在这里。', '在那里。'],
      },
    ],
    zh: '在这里。',
    hint: '回答位置',
    unitSlug: 'monty-the-farmer',
    lessonId: 6,
  },
]

// ============================================================
// 4. ReadingPassages —— 连贯小故事（用本课词另写，供自主阅读）
// ============================================================

export const u5_reading: Record<string, ReadingPassage> = {
  '5-3': {
    title: 'The Ugly Bird',
    titleZh: '丑小鸟',
    paragraphs: [
      [
        { en: 'An ugly bird is on a farm.', zh: '一只丑小鸟在农场上。' },
        { en: 'The ugly bird sees a chicken.', zh: '丑小鸟看见一只鸡。' },
        { en: 'Are you my mom? he asks.', zh: '你是我的妈妈吗？他问。' },
        { en: "No! I'm not your mom, says the chicken.", zh: '不！我不是你的妈妈，鸡说。' },
      ],
      [
        { en: "It isn't a chicken! The chickens laugh.", zh: '它不是鸡！鸡们笑了。' },
        { en: "It's gray and ugly!", zh: '它是灰色又丑的！' },
        { en: "Where's my mom? the ugly bird asks.", zh: '我的妈妈在哪里？丑小鸟问。' },
      ],
      [
        { en: 'Then the ugly bird sees a cow.', zh: '然后丑小鸟看见一头奶牛。' },
        { en: 'Are you my mom?', zh: '你是我的妈妈吗？' },
        { en: "No! I'm not your mom, says the cow.", zh: '不！我不是你的妈妈，奶牛说。' },
        { en: "It isn't a cow! It's gray and ugly!", zh: '它不是奶牛！它是灰色又丑的！' },
      ],
    ],
  },
  '5-4': {
    title: 'The Swan Mom',
    titleZh: '天鹅妈妈',
    paragraphs: [
      [
        { en: 'Then the ugly bird sees a frog.', zh: '然后丑小鸟看见一只青蛙。' },
        { en: "It isn't a frog! It isn't green!", zh: '它不是青蛙！它不是绿色的！' },
        { en: "It's gray and ugly!", zh: '它是灰色又丑的！' },
      ],
      [
        { en: 'Suddenly, the animals see a big, white bird.', zh: '突然，动物们看见一只大大的白色鸟。' },
        { en: "It's a swan! Look at that bird! It's beautiful!", zh: '是一只天鹅！看那只鸟！它真美！' },
      ],
      [
        { en: 'Then the ugly bird sees the swan.', zh: '然后丑小鸟看见了天鹅。' },
        { en: 'Are you my mom? Yes! I’m your mom!', zh: '你是我的妈妈吗？是的！我是你的妈妈！' },
        { en: 'Wow! My baby! My mom!', zh: '哇！我的宝宝！我的妈妈！' },
        { en: "It isn't an ugly bird! It's a swan!", zh: '它不再是丑小鸟了！它是一只天鹅！' },
      ],
    ],
  },
}

// ============================================================
// 5. ExtTopics —— 拓展词主题库（新主题，不与 Unit 1 重复）
// ============================================================

export const u5_ext: Record<string, ExtTopic> = {
  'farm': {
    zh: '农场与农活',
    words: [
      w('farm', '农场', '🚜'), w('farmer', '农场主', '👨‍🌾'), w('field', '田地', '🌾'),
      w('barn', '谷仓', '🛖'), w('tractor', '拖拉机', '🚜'), w('fence', '栅栏', '🚧'),
      w('pond', '池塘', '💧'), w('tree', '树', '🌳'),
    ],
  },
  'farm-animals': {
    zh: '农场动物',
    words: [
      w('pig', '猪', '🐷'), w('sheep', '绵羊', '🐑'), w('goat', '山羊', '🐐'),
      w('horse', '马', '🐴'), w('cow', '奶牛', '🐄'), w('duck', '鸭子', '🦆'),
      w('chicken', '鸡', '🐔'), w('rabbit', '兔子', '🐰'),
    ],
  },
  'crops-food': {
    zh: '农作物与食物',
    words: [
      w('apple', '苹果', '🍎'), w('corn', '玉米', '🌽'), w('wheat', '小麦', '🌾'),
      w('carrot', '胡萝卜', '🥕'), w('tomato', '番茄', '🍅'), w('egg', '鸡蛋', '🥚'),
      w('milk', '牛奶', '🥛'), w('bread', '面包', '🍞'),
    ],
  },
  'nature': {
    zh: '自然',
    words: [
      w('sun', '太阳', '☀️'), w('moon', '月亮', '🌙'), w('star', '星星', '⭐'),
      w('flower', '花', '🌸'), w('tree', '树', '🌳'), w('river', '河流', '🌊'),
      w('cloud', '云', '☁️'), w('rain', '雨', '🌧️'),
    ],
  },
}

// ============================================================
// 6. Module —— 单元总览（预览 + 测验）
// ============================================================

export const u5_module: Module = {
  id: 5,
  slug: 'monty-the-farmer',
  title: 'Monty the Farmer',
  titleZh: '蒙蒂农场主',
  emoji: '🚜',
  color: '#F5B017',
  colorSoft: '#FFF3C4',
  preview: {
    goals: [
      '认识农场动物（鸟、青蛙、鸭子、鸡、马、公牛、奶牛、山羊、绵羊、兔子）并能说出名称',
      '听懂并续编「丑小鸟找妈妈」的故事，学说 Are you my mom? / No! I\'m not your mom.',
      '用 It\'s... / It isn\'t... 描述动物，问答 What\'s this animal? Is it a...?',
      '认识动物宝宝（小鸡、小羊、小山羊、小牛、小马）并问答 Where\'s the...? It\'s here.',
      '学习 /ch/ 自然拼读（chick, chair, teacher, chocolates），了解《彼得与狼》四种乐器',
    ],
    keyWords: 'bird, frog, duck, chicken, horse, bull, cow, goat, sheep, rabbit, chick, lamb, kid, calf, foal, swan, ugly, gray, beautiful, farm, farmer',
    keySentences: "What's this animal? Is it a cow? It's a rabbit. It isn't a duck. Are you my mom? No! I'm not your mom. Where's the chick? It's here.",
    tip: '预习时找出农场动物图片或玩具，用英语边指边说；读「丑小鸟找妈妈」故事时模仿角色语气，区分 It\'s 和 It isn\'t；拼读 /ch/ 时多听 chick、chair、teacher 等词。',
  },
  lessons: u5_lessons[5],
  quiz: [
    { q: '农场里「马」用英语怎么说？🐴', options: ['horse', 'house', 'mouse'], answer: 0, explain: '马是 horse。' },
    { q: 'If it isn\'t a cow, you say: 如果它不是奶牛，应该说：', options: ["It's a cow.", "It isn't a cow.", 'Is it a cow?'], answer: 1, explain: 'It isn\'t = It is not，表示「它不是」。' },
    { q: '丑小鸟找妈妈时问了哪句话？🐤', options: ['Are you my mom?', "Where's the chick?", "It's a swan."], answer: 0, explain: '丑小鸟问 Are you my mom?（你是我的妈妈吗？）' },
    { q: '下面哪个是「小鸡」的宝宝说法？🐥', options: ['chick', 'chicken', 'calf'], answer: 0, explain: 'chick 是小鸡（宝宝），chicken 是鸡（成鸡）。' },
    { q: '字母组合 ch 在 chick 里发什么音？🐤', options: ['/ch/', '/sh/', '/th/'], answer: 0, explain: 'chick 里的 ch 发 /ch/ 音。' },
  ],
}
