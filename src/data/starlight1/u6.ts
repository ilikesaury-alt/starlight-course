// Starlight 1 · Level 1 · Unit 6「Lola the Pirate」课程数据
// 数据来源：raw/unit6.json（教材 PDF 文本）。
// 结构对齐 Unit 1（lessons.ts / book.ts / sentenceFrames.ts / reading.ts / extensions.ts / index.ts），
// 全部只从 ./shared 取类型与 w()。

import type { Lesson, LessonBook, SentenceFrame, ReadingPassage, Module, ExtTopic } from './shared'
import { w } from './shared'

// ============================ 1. 课程（13 课） ============================
export const u6_lessons: Record<number, Lesson[]> = {
  6: [
    // --- L1 Vocabulary ---
    {
      id: 1,
      title: 'Lola the Pirate Vocabulary',
      titleZh: '罗拉海盗·词汇',
      words: [
        { en: 'apple', zh: '苹果', emoji: '🍎', ipa: '/ˈæpl/' },
        { en: 'pineapple', zh: '菠萝', emoji: '🍍', ipa: '/ˈpaɪnæpl/' },
        { en: 'grape', zh: '葡萄', emoji: '🍇', ipa: '/ɡreɪp/' },
        { en: 'orange', zh: '橙子', emoji: '🍊', ipa: '/ˈɒrɪndʒ/' },
        { en: 'coconut', zh: '椰子', emoji: '🥥', ipa: '/ˈkəʊkənʌt/' },
      ],
      sentences: [
        { en: "I'm Lola.", zh: '我是罗拉。', hint: '角色自我介绍' },
        { en: 'Where are my fruits?', zh: '我的水果在哪里？', hint: '寻找水果' },
        { en: 'Could you help me find them?', zh: '你能帮我找到它们吗？', hint: '请求帮助' },
        { en: "What's your favorite fruit?", zh: '你最喜欢什么水果？', hint: '问最爱的水果' },
        { en: 'Grapes are my favorite fruit.', zh: '葡萄是我最喜欢的水果。', hint: '表达最爱的水果' },
      ],
    },
    // --- L2 Vocabulary and Practice ---
    {
      id: 2,
      title: 'Lola the Pirate Vocabulary and Practice',
      titleZh: '罗拉海盗·词汇与练习',
      words: [
        { en: 'pear', zh: '梨', emoji: '🍐', ipa: '/peə/' },
        { en: 'lemon', zh: '柠檬', emoji: '🍋', ipa: '/ˈlemən/' },
        { en: 'lime', zh: '青柠', emoji: '🟢', ipa: '/laɪm/' },
        { en: 'mango', zh: '芒果', emoji: '🥭', ipa: '/ˈmæŋɡəʊ/' },
        { en: 'banana', zh: '香蕉', emoji: '🍌', ipa: '/bəˈnɑːnə/' },
      ],
      sentences: [
        { en: 'Which fruit do you like?', zh: '你喜欢哪种水果？', hint: '问喜欢的水果' },
        { en: 'I like coconuts.', zh: '我喜欢椰子。', hint: '喜欢（复数加 s）' },
        { en: "I don't like bananas.", zh: '我不喜欢香蕉。', hint: '表达不喜欢' },
        { en: "I'm a pirate on a pirate ship.", zh: '我是海盗船上的海盗。', hint: '故事里的海盗' },
        { en: 'A mango, a pear and a coconut, too.', zh: '一个芒果、一个梨和一颗椰子。', hint: '歌词里的水果' },
      ],
    },
    // --- L3 Reading ---
    {
      id: 3,
      title: 'Lola the Pirate Reading',
      titleZh: '罗拉海盗·阅读',
      words: [
        { en: 'pirate', zh: '海盗', emoji: '🏴‍☠️', ipa: '/ˈpaɪrət/' },
        { en: 'ship', zh: '船', emoji: '⛵', ipa: '/ʃɪp/' },
        { en: 'mango', zh: '芒果', emoji: '🥭', ipa: '/ˈmæŋɡəʊ/' },
        { en: 'pineapple', zh: '菠萝', emoji: '🍍', ipa: '/ˈpaɪnæpl/' },
        { en: 'monkey', zh: '猴子', emoji: '🐒', ipa: '/ˈmʌŋki/' },
      ],
      sentences: [
        { en: "Here's a pirate ship.", zh: '这是一艘海盗船。', hint: '介绍海盗船' },
        { en: 'Here are the pirates.', zh: '这些是海盗们。', hint: 'here are 接复数' },
        { en: "Let's pick the mangoes!", zh: '我们摘芒果吧！', hint: '一起摘水果' },
        { en: 'Who can help?', zh: '谁能帮忙？', hint: '寻求帮助' },
        { en: "I don't like monkeys.", zh: '我不喜欢猴子。', hint: '说不喜欢的原因' },
        { en: 'But I like mangoes.', zh: '但我喜欢芒果。', hint: '转折表达喜欢' },
      ],
    },
    // --- L4 Reading and Practice ---
    {
      id: 4,
      title: 'Lola the Pirate Reading and Practice',
      titleZh: '罗拉海盗·阅读与练习',
      words: [
        { en: 'banana', zh: '香蕉', emoji: '🍌', ipa: '/bəˈnɑːnə/' },
        { en: 'tree', zh: '树', emoji: '🌳', ipa: '/triː/' },
        { en: 'fruit salad', zh: '水果沙拉', emoji: '🥗', ipa: '/fruːt ˈsæləd/' },
        { en: 'hungry', zh: '饿的', emoji: '🤤', ipa: '/ˈhʌŋɡri/' },
        { en: 'eat', zh: '吃', emoji: '😋', ipa: '/iːt/' },
      ],
      sentences: [
        { en: "I don't like big trees.", zh: '我不喜欢大树。', hint: '不帮忙的理由' },
        { en: 'My fruit salad is ready to eat!', zh: '我的水果沙拉准备好吃了！', hint: '做好沙拉' },
        { en: "I'm hungry.", zh: '我饿了。', hint: '想吃的理由' },
        { en: "It's my fruit salad!", zh: '这是我的水果沙拉！', hint: '独占沙拉' },
        { en: 'Pirate Pete eats the fruit salad alone.', zh: '海盗皮特独自吃掉了水果沙拉。', hint: '故事结局' },
      ],
    },
    // --- L5 Language Focus ---
    {
      id: 5,
      title: 'Lola the Pirate Language Focus',
      titleZh: '罗拉海盗·语言聚焦',
      words: [
        { en: 'apple', zh: '苹果', emoji: '🍎', ipa: '/ˈæpl/' },
        { en: 'banana', zh: '香蕉', emoji: '🍌', ipa: '/bəˈnɑːnə/' },
        { en: 'lemon', zh: '柠檬', emoji: '🍋', ipa: '/ˈlemən/' },
        { en: 'grape', zh: '葡萄', emoji: '🍇', ipa: '/ɡreɪp/' },
        { en: 'coconut', zh: '椰子', emoji: '🥥', ipa: '/ˈkəʊkənʌt/' },
      ],
      sentences: [
        { en: 'What fruit do you like?', zh: '你喜欢什么水果？', hint: '问喜欢的水果' },
        { en: 'I like apples.', zh: '我喜欢苹果。', hint: '表达喜欢（复数）' },
        { en: "I don't like lemons.", zh: '我不喜欢柠檬。', hint: '表达不喜欢' },
        { en: 'What color is it?', zh: '它是什么颜色？', hint: '复习颜色问答' },
        { en: 'Alex likes bananas.', zh: 'Alex 喜欢香蕉。', hint: '第三人称表达' },
      ],
    },
    // --- L6 Language Focus and Practice ---
    {
      id: 6,
      title: 'Lola the Pirate Language Focus and Practice',
      titleZh: '罗拉海盗·语言聚焦与练习',
      words: [
        { en: 'lemonade', zh: '柠檬水', emoji: '🍹', ipa: '/ˌleməˈneɪd/' },
        { en: 'smoothie', zh: '冰沙', emoji: '🥤', ipa: '/ˈsmuːði/' },
        { en: 'fruit salad', zh: '水果沙拉', emoji: '🥗', ipa: '/fruːt ˈsæləd/' },
        { en: 'juice', zh: '果汁', emoji: '🧃', ipa: '/dʒuːs/' },
        { en: 'yogurt', zh: '酸奶', emoji: '🥛', ipa: '/ˈjɒɡət/' },
      ],
      sentences: [
        { en: 'Do you like juice?', zh: '你喜欢果汁吗？', hint: '问饮品喜好' },
        { en: 'Yes, I do.', zh: '是的，我喜欢。', hint: '肯定回答' },
        { en: "No, I don't.", zh: '不，我不喜欢。', hint: '否定回答' },
        { en: 'Do you like yogurt?', zh: '你喜欢酸奶吗？', hint: '问另一种饮品' },
        { en: "I don't like yogurt.", zh: '我不喜欢酸奶。', hint: '否定表达' },
      ],
    },
    // --- L7 Phonics ---
    {
      id: 7,
      title: 'Lola the Pirate Phonics',
      titleZh: '罗拉海盗·自然拼读',
      words: [
        { en: 'orange', zh: '橙子', emoji: '🍊', ipa: '/ˈɒrɪndʒ/' },
        { en: 'octopus', zh: '章鱼', emoji: '🐙', ipa: '/ˈɒktəpəs/' },
        { en: 'chocolate', zh: '巧克力', emoji: '🍫', ipa: '/ˈtʃɒklət/' },
        { en: 'doctor', zh: '医生', emoji: '👩‍⚕️', ipa: '/ˈdɒktə/' },
        { en: 'frog', zh: '青蛙', emoji: '🐸', ipa: '/frɒɡ/' },
      ],
      sentences: [
        { en: "Let's get the letter O!", zh: '我们来找字母 O！', hint: 'phonics 主题字母' },
        { en: 'A dog eats a hot dog.', zh: '一只狗吃热狗。', hint: '含 o 的句子' },
        { en: "It's an orange frog.", zh: '它是一只橙色的青蛙。', hint: '含 o 的句子' },
        { en: 'The doctor is drinking hot chocolate.', zh: '医生在喝热巧克力。', hint: '含 o 的句子' },
        { en: 'Mom is a doctor. See her socks.', zh: '妈妈是医生，看她的袜子。', hint: 'chant 句子' },
      ],
    },
    // --- L8 CLIL ---
    {
      id: 8,
      title: 'Lola the Pirate CLIL-Science',
      titleZh: '罗拉海盗·跨学科（科学）',
      words: [
        { en: 'seed', zh: '种子', emoji: '🌱', ipa: '/siːd/' },
        { en: 'plant', zh: '植物', emoji: '🪴', ipa: '/plɑːnt/' },
        { en: 'blossom', zh: '花（开花）', emoji: '🌸', ipa: '/ˈblɒsəm/' },
        { en: 'fruit', zh: '水果', emoji: '🍎', ipa: '/fruːt/' },
        { en: 'sunlight', zh: '阳光', emoji: '☀️', ipa: '/ˈsʌnlaɪt/' },
      ],
      sentences: [
        { en: 'Fruit is from plants or trees.', zh: '水果来自植物或树木。', hint: '科学知识' },
        { en: 'This is a seed.', zh: '这是一颗种子。', hint: '认识种子' },
        { en: 'It needs sunlight and water to grow.', zh: '它需要阳光和水才能生长。', hint: '植物生长条件' },
        { en: 'Look! It has blossoms.', zh: '看！它开花了。', hint: '开花' },
        { en: 'The oranges have seeds inside them.', zh: '橙子里面有种子。', hint: '种子在果实里' },
      ],
    },
    // --- L9 Practice ---
    {
      id: 9,
      title: 'Lola the Pirate Practice',
      titleZh: '罗拉海盗·综合练习',
      words: [
        { en: 'mango', zh: '芒果', emoji: '🥭', ipa: '/ˈmæŋɡəʊ/' },
        { en: 'apple', zh: '苹果', emoji: '🍎', ipa: '/ˈæpl/' },
        { en: 'banana', zh: '香蕉', emoji: '🍌', ipa: '/bəˈnɑːnə/' },
        { en: 'lime', zh: '青柠', emoji: '🟢', ipa: '/laɪm/' },
        { en: 'pineapple', zh: '菠萝', emoji: '🍍', ipa: '/ˈpaɪnæpl/' },
      ],
      sentences: [
        { en: "Let's make fruit salad together.", zh: '我们一起做水果沙拉吧。', hint: '提议做沙拉' },
        { en: 'What fruit do you like?', zh: '你喜欢什么水果？', hint: '问喜好' },
        { en: 'I like mangoes.', zh: '我喜欢芒果。', hint: '表达喜欢（复数）' },
        { en: "I don't like limes.", zh: '我不喜欢青柠。', hint: '表达不喜欢' },
        { en: 'A seed grows into a plant.', zh: '种子长成植物。', hint: '水果的生长' },
      ],
    },
    // --- L10 Game - The Island Game ---
    {
      id: 10,
      title: 'Game - The Island Game',
      titleZh: '游戏·海岛游戏',
      words: [
        { en: 'cow', zh: '奶牛', emoji: '🐄', ipa: '/kaʊ/' },
        { en: 'bull', zh: '公牛', emoji: '🐂', ipa: '/bʊl/' },
        { en: 'lamb', zh: '小羊', emoji: '🐑', ipa: '/læm/' },
        { en: 'coconut', zh: '椰子', emoji: '🥥', ipa: '/ˈkəʊkənʌt/' },
        { en: 'pineapple', zh: '菠萝', emoji: '🍍', ipa: '/ˈpaɪnæpl/' },
      ],
      sentences: [
        { en: 'Which one is different?', zh: '哪个不一样？', hint: '分类游戏' },
        { en: "It isn't a cow. It's a bull.", zh: '它不是奶牛，它是公牛。', hint: '区分动物' },
        { en: "Where's my lamb?", zh: '我的小羊在哪里？', hint: '问位置' },
        { en: 'Do you like pineapples?', zh: '你喜欢菠萝吗？', hint: '游戏问答' },
        { en: 'These are coconuts.', zh: '这些是椰子。', hint: '复数表达' },
      ],
    },
    // --- L11 Culture - Madagascar ---
    {
      id: 11,
      title: 'Culture - Madagascar',
      titleZh: '文化·马达加斯加',
      words: [
        { en: 'Madagascar', zh: '马达加斯加', emoji: '🗺️', ipa: '/ˌmædəˈɡæskə/' },
        { en: 'island', zh: '岛', emoji: '🏝️', ipa: '/ˈaɪlənd/' },
        { en: 'lemur', zh: '狐猴', emoji: '🐒', ipa: '/ˈliːmə/' },
        { en: 'fossa', zh: '马岛狸', emoji: '🐆', ipa: '/ˈfɒsə/' },
        { en: 'baobab', zh: '猴面包树', emoji: '🌳', ipa: '/ˈbeɪəʊbæb/' },
      ],
      sentences: [
        { en: "I'm from Madagascar.", zh: '我来自马达加斯加。', hint: '介绍来自哪里' },
        { en: 'Madagascar is an island near Africa.', zh: '马达加斯加是非洲附近的一个岛。', hint: '地理位置' },
        { en: "It isn't a monkey. It's a lemur.", zh: '它不是猴子，它是狐猴。', hint: '认识狐猴' },
        { en: "It isn't a cat. It's a fossa.", zh: '它不是猫，它是马岛狸。', hint: '认识马岛狸' },
        { en: "It's a baobab tree.", zh: '这是一棵猴面包树。', hint: '马达加斯加的树' },
      ],
    },
    // --- L12 Story Reading - The History Project ---
    {
      id: 12,
      title: 'Story Reading - The History Project',
      titleZh: '故事阅读·历史作业',
      words: [
        { en: 'Egypt', zh: '埃及', emoji: '🇪🇬', ipa: '/ˈiːdʒɪpt/' },
        { en: 'pyramid', zh: '金字塔', emoji: '🔺', ipa: '/ˈpɪrəmɪd/' },
        { en: 'desert', zh: '沙漠', emoji: '🏜️', ipa: '/ˈdezət/' },
        { en: 'sunny', zh: '晴朗的', emoji: '☀️', ipa: '/ˈsʌni/' },
        { en: 'dress', zh: '连衣裙', emoji: '👗', ipa: '/dres/' },
      ],
      sentences: [
        { en: 'There is the pyramid and the Sphinx.', zh: '那里有金字塔和狮身人面像。', hint: '埃及地标' },
        { en: 'I want to go to Egypt.', zh: '我想去埃及。', hint: '表达想去的地方' },
        { en: "This is the desert. It's hot and sunny.", zh: '这是沙漠。天气又热又晴。', hint: '沙漠天气' },
        { en: "I'm wearing a dress!", zh: '我穿着一条连衣裙！', hint: '描述穿着' },
        { en: 'Egyptians like cats.', zh: '埃及人喜欢猫。', hint: '故事细节' },
      ],
    },
    // --- L13 Story Reading and Practice - The History Project ---
    {
      id: 13,
      title: 'Story Reading and Practice - The History Project',
      titleZh: '故事阅读与练习·历史作业',
      words: [
        { en: 'farmer', zh: '农夫', emoji: '👨‍🌾', ipa: '/ˈfɑːmə/' },
        { en: 'goat', zh: '山羊', emoji: '🐐', ipa: '/ɡəʊt/' },
        { en: 'duck', zh: '鸭子', emoji: '🦆', ipa: '/dʌk/' },
        { en: 'fig', zh: '无花果', emoji: '🍈', ipa: '/fɪɡ/' },
        { en: 'river', zh: '河', emoji: '🌊', ipa: '/ˈrɪvə/' },
      ],
      sentences: [
        { en: "Here's a farmer.", zh: '这是一位农夫。', hint: '介绍农夫' },
        { en: 'He has goats and ducks.', zh: '他有山羊和鸭子。', hint: '他有什么动物' },
        { en: "It isn't a bull. It's a cow.", zh: '它不是公牛，它是奶牛。', hint: '区分牛' },
        { en: 'Do you like figs?', zh: '你喜欢无花果吗？', hint: '问水果喜好' },
        { en: "No, I don't, but I like grapes.", zh: '不，我不喜欢，但我喜欢葡萄。', hint: '转折喜好' },
      ],
    },
  ],
}

// ============================ 2. 课本原文（13 课） ============================
export const u6_book: Record<string, LessonBook> = {
  '6-1': {
    title: 'Lola the Pirate Vocabulary',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: "I'm Lola.", textZh: '我是罗拉。' },
        { text: 'Where are my fruits?', textZh: '我的水果在哪里？' },
        { text: 'Could you help me find them?', textZh: '你能帮我找到它们吗？' },
      ] },
      { chapter: 'Focus on: fruits.', chapterZh: '重点词汇：水果。', pages: [
        { text: 'apple', textZh: '苹果' },
        { text: 'pineapple', textZh: '菠萝' },
        { text: 'grape', textZh: '葡萄' },
        { text: 'orange', textZh: '橙子' },
        { text: 'coconut', textZh: '椰子' },
        { text: 'What color is it?', textZh: '它是什么颜色？' },
        { text: "What's this?", textZh: '这是什么？' },
      ] },
      { chapter: 'Show Time.', chapterZh: '展示时间。', pages: [
        { text: "What's your favorite fruit?", textZh: '你最喜欢什么水果？' },
        { text: 'Grapes are my favorite fruit.', textZh: '葡萄是我最喜欢的水果。' },
        { text: 'They are round and purple.', textZh: '它们圆圆的、紫紫的。' },
      ] },
    ],
  },
  '6-2': {
    title: 'Lola the Pirate Vocabulary and Practice',
    sections: [
      { chapter: 'Read and match.', chapterZh: '读一读，连一连。', pages: [
        { text: 'Oh! I forget the names of these fruit.', textZh: '哦！我忘了这些水果的名字。' },
        { text: 'Could you help me name them?', textZh: '你能帮我叫出它们的名字吗？' },
        { text: 'grape / apple / coconut / pineapple / orange', textZh: '葡萄／苹果／椰子／菠萝／橙子' },
      ] },
      { chapter: 'More fruits.', chapterZh: '更多水果。', pages: [
        { text: 'pear', textZh: '梨' },
        { text: 'lemon', textZh: '柠檬' },
        { text: 'lime', textZh: '青柠' },
        { text: 'mango', textZh: '芒果' },
        { text: 'banana', textZh: '香蕉' },
      ] },
      { chapter: 'Listen and clap.', chapterZh: '听一听，拍手打节奏。', pages: [
        { text: 'A mango! A mango!', textZh: '一个芒果！一个芒果！' },
        { text: 'An orange, a pear and a coconut, too.', textZh: '一个橙子、一个梨和一颗椰子。' },
        { text: "I'm a pirate on a pirate ship.", textZh: '我是海盗船上的海盗。' },
      ] },
      { chapter: "Let's talk.", chapterZh: '聊一聊。', pages: [
        { text: 'Which fruit do you like?', textZh: '你喜欢哪种水果？' },
        { text: 'I like coconuts.', textZh: '我喜欢椰子。' },
        { text: "I don't like bananas.", textZh: '我不喜欢香蕉。' },
      ] },
    ],
  },
  '6-3': {
    title: 'Lola the Pirate Reading',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'Who are they?', textZh: '他们是谁？' },
        { text: "What's the weather like?", textZh: '天气怎么样？' },
        { text: 'What are they going to do?', textZh: '他们打算去做什么？' },
      ] },
      { chapter: 'Enjoy the story.', chapterZh: '欣赏故事。', pages: [
        { text: "Here's a pirate ship.", textZh: '这是一艘海盗船。' },
        { text: 'Here are the pirates.', textZh: '这些是海盗们。' },
        { text: 'Pirate Pete sees mangoes.', textZh: '海盗皮特看见了芒果。' },
      ] },
      { chapter: 'Pick the mangoes.', chapterZh: '摘芒果。', pages: [
        { text: "Let's pick the mangoes!", textZh: '我们摘芒果吧！' },
        { text: 'Who can help? Not me! Not me! Not me!', textZh: '谁能帮忙？不是我！不是我！不是我！' },
        { text: "I don't like monkeys.", textZh: '我不喜欢猴子。' },
      ] },
      { chapter: 'Pirate Pete picks them.', chapterZh: '皮特自己摘。', pages: [
        { text: 'So Pirate Pete picks the mangoes.', textZh: '于是海盗皮特自己摘芒果。' },
        { text: "Phew! It's hot!", textZh: '哎哟！好热！' },
        { text: 'But I like mangoes.', textZh: '但我喜欢芒果。' },
      ] },
      { chapter: 'Pick the pineapples.', chapterZh: '摘菠萝。', pages: [
        { text: 'Then Pirate Pete sees pineapples.', textZh: '后来海盗皮特看见了菠萝。' },
        { text: "I don't like frogs.", textZh: '我不喜欢青蛙。' },
        { text: 'But I like pineapples.', textZh: '但我喜欢菠萝。' },
      ] },
    ],
  },
  '6-4': {
    title: 'Lola the Pirate Reading and Practice',
    sections: [
      { chapter: 'Lead-in.', chapterZh: '导入。', pages: [
        { text: 'This time, Pirate Pete wants to pick the bananas!', textZh: '这一次，海盗皮特想摘香蕉！' },
        { text: 'Will anyone help him?', textZh: '会有人帮他吗？' },
      ] },
      { chapter: 'Pick the bananas.', chapterZh: '摘香蕉。', pages: [
        { text: 'Then Pirate Pete sees bananas.', textZh: '后来海盗皮特看见了香蕉。' },
        { text: "I don't like big trees.", textZh: '我不喜欢大树。' },
        { text: 'So Pirate Pete picks bananas.', textZh: '于是皮特自己摘香蕉。' },
        { text: 'But I like bananas.', textZh: '但他喜欢香蕉。' },
      ] },
      { chapter: 'A fruit salad.', chapterZh: '一份水果沙拉。', pages: [
        { text: 'Now Pirate Pete has a fruit salad.', textZh: '现在海盗皮特有了一份水果沙拉。' },
        { text: 'My fruit salad is ready to eat!', textZh: '我的水果沙拉准备好吃了！' },
        { text: "I'm hungry.", textZh: '我饿了。' },
      ] },
      { chapter: 'But it is his!', chapterZh: '但那是他一个人的！', pages: [
        { text: 'But Pirate Pete eats the fruit salad.', textZh: '可是海盗皮特吃掉了水果沙拉。' },
        { text: "Sorry, pirates! It's my fruit salad!", textZh: '抱歉，海盗们！这是我的水果沙拉！' },
        { text: 'Aww!', textZh: '哎呀！' },
      ] },
    ],
  },
  '6-5': {
    title: 'Lola the Pirate Language Focus',
    sections: [
      { chapter: 'Say the words.', chapterZh: '读单词。', pages: [
        { text: 'apple / banana / orange / pear / lime', textZh: '苹果／香蕉／橙子／梨／青柠' },
        { text: 'lemon / mango / grape / coconut / pineapple', textZh: '柠檬／芒果／葡萄／椰子／菠萝' },
      ] },
      { chapter: "Let's read.", chapterZh: '读一读。', pages: [
        { text: 'What fruit do you like?', textZh: '你喜欢什么水果？' },
        { text: 'I like apples.', textZh: '我喜欢苹果。' },
        { text: "I don't like lemons.", textZh: '我不喜欢柠檬。' },
        { text: "What fruit don't you like?", textZh: '你不喜欢什么水果？' },
      ] },
      { chapter: 'Grammar.', chapterZh: '语法。', pages: [
        { text: 'What color is it?', textZh: '它是什么颜色？' },
        { text: 'I like bananas.', textZh: '我喜欢香蕉。' },
        { text: "I don't like apples.", textZh: '我不喜欢苹果。' },
      ] },
      { chapter: 'Complete and read.', chapterZh: '补全并朗读。', pages: [
        { text: 'Alex: I like bananas.', textZh: 'Alex：我喜欢香蕉。' },
        { text: "Alex: I don't like grapes.", textZh: 'Alex：我不喜欢葡萄。' },
        { text: 'Lucy: I like coconuts.', textZh: 'Lucy：我喜欢椰子。' },
      ] },
    ],
  },
  '6-6': {
    title: 'Lola the Pirate Language Focus and Practice',
    sections: [
      { chapter: 'Food and Drinks.', chapterZh: '食物与饮料。', pages: [
        { text: 'lemonade', textZh: '柠檬水' },
        { text: 'smoothie', textZh: '冰沙' },
        { text: 'fruit salad', textZh: '水果沙拉' },
        { text: 'juice', textZh: '果汁' },
        { text: 'Jell-O / yogurt', textZh: '果冻／酸奶' },
      ] },
      { chapter: 'Song Time.', chapterZh: '唱歌时间。', pages: [
        { text: 'Do you like smoothies?', textZh: '你喜欢冰沙吗？' },
        { text: 'Yes, I do! I like smoothies.', textZh: '是的，我喜欢！我喜欢冰沙。' },
        { text: 'Fruit salad, Jell-O!', textZh: '水果沙拉、果冻！' },
        { text: 'I like juice. Lemonade, too.', textZh: '我喜欢果汁。还有柠檬水。' },
      ] },
      { chapter: 'Grammar.', chapterZh: '语法。', pages: [
        { text: 'Do you like juice?', textZh: '你喜欢果汁吗？' },
        { text: 'Yes, I do.', textZh: '是的，我喜欢。' },
        { text: "No, I don't.", textZh: '不，我不喜欢。' },
      ] },
      { chapter: 'Interview.', chapterZh: '小采访。', pages: [
        { text: 'Do you like Jell-O?', textZh: '你喜欢果冻吗？' },
        { text: 'Do you like fruit salad?', textZh: '你喜欢水果沙拉吗？' },
        { text: 'Do you like yogurt?', textZh: '你喜欢酸奶吗？' },
        { text: 'Do you like lemonade?', textZh: '你喜欢柠檬水吗？' },
      ] },
    ],
  },
  '6-7': {
    title: 'Lola the Pirate Phonics',
    sections: [
      { chapter: 'Read and find.', chapterZh: '读一读，找一找。', pages: [
        { text: 'orange', textZh: '橙子' },
        { text: 'octopus', textZh: '章鱼' },
      ] },
      { chapter: "Let's learn.", chapterZh: '学一学。', pages: [
        { text: 'chocolate', textZh: '巧克力' },
        { text: 'doctor', textZh: '医生' },
        { text: 'frog', textZh: '青蛙' },
        { text: 'hot', textZh: '热的' },
        { text: 'socks', textZh: '袜子' },
        { text: 'dog', textZh: '狗' },
      ] },
      { chapter: "Let's learn the sentences.", chapterZh: '学句子。', pages: [
        { text: 'A dog eats a hot dog.', textZh: '一只狗吃热狗。' },
        { text: "It's an orange frog.", textZh: '它是一只橙色的青蛙。' },
        { text: 'The doctor is drinking hot chocolate.', textZh: '医生在喝热巧克力。' },
      ] },
      { chapter: 'Chant.', chapterZh: ' chant 说唱。', pages: [
        { text: 'Mom is a doctor. Look at her socks.', textZh: '妈妈是医生，看她的袜子。' },
        { text: 'She likes hot cocoa and chocolates in a box.', textZh: '她喜欢热可可和盒子里的巧克力。' },
        { text: 'Her friend is a frog.', textZh: '她的朋友是一只青蛙。' },
        { text: 'He likes oranges, apples and eggs.', textZh: '他喜欢橙子、苹果和鸡蛋。' },
      ] },
    ],
  },
  '6-8': {
    title: 'Lola the Pirate CLIL-Science',
    sections: [
      { chapter: 'Learn the word.', chapterZh: '学单词。', pages: [
        { text: 'seed', textZh: '种子' },
        { text: 'The mango has seeds.', textZh: '芒果有种子。' },
      ] },
      { chapter: 'Learn and read.', chapterZh: '学一学，读一读。', pages: [
        { text: 'plant', textZh: '植物' },
        { text: 'blossom', textZh: '开花' },
        { text: 'fruit', textZh: '水果' },
        { text: 'water', textZh: '水' },
        { text: 'sunlight', textZh: '阳光' },
      ] },
      { chapter: 'Read and answer.', chapterZh: '读一读，答一答。', pages: [
        { text: 'Fruit is from plants or trees.', textZh: '水果来自植物或树木。' },
        { text: 'This is a seed. It is in the ground.', textZh: '这是一颗种子，它在土里。' },
        { text: 'It needs sunlight and water to grow.', textZh: '它需要阳光和水才能生长。' },
        { text: 'Look! It has blossoms.', textZh: '看！它开花了。' },
        { text: 'Now the tree has fruit.', textZh: '现在这棵树有了果实。' },
        { text: 'The oranges have seeds inside them.', textZh: '橙子里面有种子。' },
      ] },
    ],
  },
  '6-9': {
    title: 'Lola the Pirate Practice',
    sections: [
      { chapter: 'Look and say.', chapterZh: '看一看，说一说。', pages: [
        { text: 'orange / grapes / pear / pineapple', textZh: '橙子／葡萄／梨／菠萝' },
        { text: 'mango / apple / coconut / lemon / banana / lime', textZh: '芒果／苹果／椰子／柠檬／香蕉／青柠' },
      ] },
      { chapter: 'Tree life cycle.', chapterZh: '树的生长周期。', pages: [
        { text: 'seed', textZh: '种子' },
        { text: 'plant', textZh: '植物' },
        { text: 'blossoms', textZh: '开花' },
        { text: 'fruit', textZh: '果实' },
        { text: 'seeds', textZh: '种子' },
      ] },
      { chapter: 'Make fruit salad.', chapterZh: '做水果沙拉。', pages: [
        { text: "Let's make fruit salad together.", textZh: '我们一起做水果沙拉吧。' },
        { text: 'What fruit do you like?', textZh: '你喜欢什么水果？' },
        { text: 'I like mangoes.', textZh: '我喜欢芒果。' },
        { text: "I don't like limes.", textZh: '我不喜欢青柠。' },
      ] },
    ],
  },
  '6-10': {
    title: 'Game - The Island Game',
    sections: [
      { chapter: 'Brainstorming: Farm Animals.', chapterZh: '头脑风暴：农场动物。', pages: [
        { text: 'cow / bull / chicken / bird', textZh: '奶牛／公牛／鸡／鸟' },
        { text: 'rabbit / horse / sheep / frog / duck / goat', textZh: '兔子／马／羊／青蛙／鸭／山羊' },
        { text: 'lamb / calf / kid', textZh: '小羊／小牛／小山羊' },
      ] },
      { chapter: 'Brainstorming: Fruit.', chapterZh: '头脑风暴：水果。', pages: [
        { text: 'apple / lemon / grapes / coconut', textZh: '苹果／柠檬／葡萄／椰子' },
        { text: 'banana / lime / mango / orange / pear / pineapple', textZh: '香蕉／青柠／芒果／橙子／梨／菠萝' },
      ] },
      { chapter: 'Which one is different?', chapterZh: '哪个不一样？', pages: [
        { text: 'coconut / lime / lemon / horse', textZh: '椰子／青柠／柠檬／马' },
        { text: 'mango / orange / pear / bull', textZh: '芒果／橙子／梨／公牛' },
        { text: 'bird / duck / chicken / grapes', textZh: '鸟／鸭／鸡／葡萄' },
        { text: 'sheep / frog / goat / banana', textZh: '羊／青蛙／山羊／香蕉' },
      ] },
      { chapter: 'Read and Choose.', chapterZh: '读一读，选一选。', pages: [
        { text: "I don't like apples.", textZh: '我不喜欢苹果。' },
        { text: "It isn't a cow. It's a bull.", textZh: '它不是奶牛，它是公牛。' },
        { text: "Where's my lamb?", textZh: '我的小羊在哪里？' },
        { text: 'Do you like pineapples?', textZh: '你喜欢菠萝吗？' },
      ] },
      { chapter: 'Game.', chapterZh: '游戏。', pages: [
        { text: "It isn't a bird. It's a frog.", textZh: '它不是鸟，它是青蛙。' },
        { text: "Where's the calf?", textZh: '小牛在哪里？' },
        { text: 'These are coconuts.', textZh: '这些是椰子。' },
        { text: "It's an orange. It's a pineapple.", textZh: '这是一个橙子。这是一个菠萝。' },
      ] },
    ],
  },
  '6-11': {
    title: 'Culture - Madagascar',
    sections: [
      { chapter: 'Learn the word.', chapterZh: '学单词。', pages: [
        { text: 'lemur', textZh: '狐猴' },
        { text: 'fossa', textZh: '马岛狸' },
      ] },
      { chapter: 'Read the text.', chapterZh: '读短文。', pages: [
        { text: "Hello! I'm Jenny. I'm seven.", textZh: '你好！我是 Jenny，我七岁。' },
        { text: "I'm from Madagascar.", textZh: '我来自马达加斯加。' },
        { text: 'Madagascar is an island near Africa.', textZh: '马达加斯加是非洲附近的一个岛。' },
      ] },
      { chapter: 'Animals and plants.', chapterZh: '动物与植物。', pages: [
        { text: "It isn't a monkey. It's a lemur.", textZh: '它不是猴子，它是狐猴。' },
        { text: "It isn't a cat or a wolf. It's a fossa.", textZh: '它不是猫也不是狼，它是马岛狸。' },
        { text: "It's a baobab tree.", textZh: '这是一棵猴面包树。' },
      ] },
      { chapter: 'Summary.', chapterZh: '小结。', pages: [
        { text: 'In Madagascar, you can find bananas, pineapples and mangoes!', textZh: '在马达加斯加，你能找到香蕉、菠萝和芒果！' },
        { text: 'animals / plants / fruits in the country', textZh: '这个国家的动物／植物／水果' },
      ] },
    ],
  },
  '6-12': {
    title: 'Story Reading - The History Project',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'Look. There is the pyramid and the Sphinx.', textZh: '看。那里有金字塔和狮身人面像。' },
        { text: 'Wow! Amazing!', textZh: '哇！太神奇了！' },
        { text: 'I want to go to Egypt to see them.', textZh: '我想去埃及看它们。' },
      ] },
      { chapter: 'At school.', chapterZh: '在学校。', pages: [
        { text: 'Monty and Lola are in the classroom at school.', textZh: '蒙蒂和罗拉在学校教室里。' },
        { text: 'This is the history teacher.', textZh: '这是历史老师。' },
        { text: 'Now write about Egypt for homework.', textZh: '现在要写关于埃及的作业。' },
      ] },
      { chapter: 'In Ancient Egypt.', chapterZh: '在古代埃及。', pages: [
        { text: "Hello! My name's Ra.", textZh: '你好！我叫拉。' },
        { text: "This is the desert. It's hot and sunny.", textZh: '这是沙漠。天气又热又晴。' },
        { text: "I'm wearing a dress!", textZh: '我穿着一条连衣裙！' },
      ] },
      { chapter: 'Egyptian numbers.', chapterZh: '埃及数字。', pages: [
        { text: 'Monty, Lola and Ra are in a pyramid.', textZh: '蒙蒂、罗拉和拉在金字塔里。' },
        { text: 'These are Egyptian numbers.', textZh: '这些是埃及数字。' },
        { text: 'One, two, three, four, five … ten.', textZh: '一、二、三、四、五……十。' },
      ] },
      { chapter: 'Cats in Egypt.', chapterZh: '埃及的猫。', pages: [
        { text: 'I like cats, too.', textZh: '我也喜欢猫。' },
        { text: "I don't like cats.", textZh: '我不喜欢猫。' },
        { text: 'Look! Birds and a cat! Egyptians like cats.', textZh: '看！鸟和一只猫！埃及人喜欢猫。' },
      ] },
    ],
  },
  '6-13': {
    title: 'Story Reading and Practice - The History Project',
    sections: [
      { chapter: 'Listen and say.', chapterZh: '听一听，说一说。', pages: [
        { text: 'What are they going to do?', textZh: '他们打算去做什么？' },
        { text: 'Monty, Lola, Egypt.', textZh: '蒙蒂、罗拉、埃及。' },
        { text: 'desert, hot and sunny, dress.', textZh: '沙漠、又热又晴、连衣裙。' },
      ] },
      { chapter: 'A farm.', chapterZh: '一个农场。', pages: [
        { text: 'Then Monty, Lola and Ra see a farm.', textZh: '后来蒙蒂、罗拉和拉看到一个农场。' },
        { text: "Here's a farmer.", textZh: '这是一位农夫。' },
        { text: 'He has goats and ducks.', textZh: '他有山羊和鸭子。' },
        { text: "It isn't a bull. It's a cow.", textZh: '它不是公牛，它是奶牛。' },
      ] },
      { chapter: 'Hungry!', chapterZh: '饿了！', pages: [
        { text: 'Monty, Lola and Ra are hungry.', textZh: '蒙蒂、罗拉和拉饿了。' },
        { text: 'Egyptians grow fruit. These are figs.', textZh: '埃及人种植水果。这些是无花果。' },
        { text: 'Do you like figs?', textZh: '你们喜欢无花果吗？' },
        { text: "No, I don't, but I like grapes.", textZh: '不，我不喜欢，但我喜欢葡萄。' },
      ] },
      { chapter: 'The River Nile.', chapterZh: '尼罗河。', pages: [
        { text: 'Is the River Nile very long?', textZh: '尼罗河很长吗？' },
        { text: 'This is the River Nile. It is very long.', textZh: '这是尼罗河。它非常长。' },
      ] },
      { chapter: 'Homework done!', chapterZh: '作业完成！', pages: [
        { text: 'Here is your homework about Egypt. It is excellent!', textZh: '这是你关于埃及的作业。太棒了！' },
        { text: 'Well done, Monty and Lola.', textZh: '做得好，蒙蒂和罗拉。' },
      ] },
    ],
  },
}

// ============================ 3. 句型框架卡（L5 + L6） ============================
export const u6_frames: SentenceFrame[] = [
  // --- Lesson 5: Language Focus（水果喜好 / 颜色 + 水果） ---
  {
    id: 'l1-lola-the-pirate-5-like',
    pattern: 'I like ___.',
    blanks: [
      {
        options: ['apples', 'bananas', 'lemons', 'grapes'],
        answer: 0,
        zhOptions: ['我喜欢苹果。', '我喜欢香蕉。', '我喜欢柠檬。', '我喜欢葡萄。'],
      },
    ],
    zh: '我喜欢苹果。',
    hint: '说说你喜欢的水果（复数加 s）',
    unitSlug: 'lola-the-pirate',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-pirate-5-dont-like',
    pattern: "I don't like ___.",
    blanks: [
      {
        options: ['lemons', 'bananas', 'grapes', 'coconuts'],
        answer: 0,
        zhOptions: ['我不喜欢柠檬。', '我不喜欢香蕉。', '我不喜欢葡萄。', '我不喜欢椰子。'],
      },
    ],
    zh: '我不喜欢柠檬。',
    hint: '说说你不喜欢的水果',
    unitSlug: 'lola-the-pirate',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-pirate-5-what-fruit',
    pattern: 'What fruit do you ___?',
    blanks: [
      {
        options: ['like', 'eat', 'see'],
        answer: 0,
        zhOptions: ['你喜欢什么水果？', '你吃什么水果？', '你看到什么水果？'],
      },
    ],
    zh: '你喜欢什么水果？',
    hint: '问别人的水果喜好',
    unitSlug: 'lola-the-pirate',
    lessonId: 5,
  },
  {
    id: 'l1-lola-the-pirate-5-a-color',
    pattern: "It's a ___ ___.",
    blanks: [
      {
        options: ['red', 'yellow', 'purple'],
        answer: 0,
        zhOptions: ['红色的', '黄色的', '紫色的'],
      },
      {
        options: ['apple', 'banana', 'grape'],
        answer: 0,
        zhOptions: ['苹果', '香蕉', '葡萄'],
      },
    ],
    zh: '它是一个红色的苹果。',
    hint: 'a / an + 颜色 + 水果（两个空）',
    unitSlug: 'lola-the-pirate',
    lessonId: 5,
  },
  // --- Lesson 6: Language Focus and Practice（饮品喜好问答） ---
  {
    id: 'l1-lola-the-pirate-6-do-you-like',
    pattern: 'Do you like ___?',
    blanks: [
      {
        options: ['juice', 'yogurt', 'fruit salad', 'smoothies'],
        answer: 0,
        zhOptions: ['你喜欢果汁吗？', '你喜欢酸奶吗？', '你喜欢水果沙拉吗？', '你喜欢冰沙吗？'],
      },
    ],
    zh: '你喜欢果汁吗？',
    hint: '问对方是否喜欢某种饮品',
    unitSlug: 'lola-the-pirate',
    lessonId: 6,
  },
  {
    id: 'l1-lola-the-pirate-6-no',
    pattern: 'No, ___.',
    blanks: [
      {
        options: ['I don’t', 'I do'],
        answer: 0,
        zhOptions: ['不，我不喜欢。', '不，我喜欢。'],
      },
    ],
    zh: '不，我不喜欢。',
    hint: 'Do you like...? 的否定回答',
    unitSlug: 'lola-the-pirate',
    lessonId: 6,
  },
]

// ============================ 4. 阅读短文 ============================
export const u6_reading: Record<string, ReadingPassage> = {
  '6-3': {
    title: 'Pirate Pete and the Mangoes',
    titleZh: '海盗皮特和芒果',
    paragraphs: [
      [
        { en: "Here is a pirate ship.", zh: '这是一艘海盗船。' },
        { en: 'Here are the pirates.', zh: '这些是海盗们。' },
        { en: 'Pirate Pete sees mangoes.', zh: '海盗皮特看见了芒果。' },
      ],
      [
        { en: "Let's pick the mangoes!", zh: '我们摘芒果吧！' },
        { en: 'Who can help?', zh: '谁能帮忙？' },
        { en: 'Not me! Not me! Not me!', zh: '不是我！不是我！不是我！' },
        { en: "I don't like monkeys.", zh: '我不喜欢猴子。' },
      ],
      [
        { en: 'So Pirate Pete picks the mangoes.', zh: '于是海盗皮特自己摘芒果。' },
        { en: "Phew! It's hot!", zh: '哎哟！好热！' },
        { en: 'But I like mangoes.', zh: '但我喜欢芒果。' },
      ],
    ],
  },
  '6-4': {
    title: "Pirate Pete's Fruit Salad",
    titleZh: '海盗皮特的水果沙拉',
    paragraphs: [
      [
        { en: 'Then Pirate Pete sees bananas.', zh: '后来海盗皮特看见了香蕉。' },
        { en: "Let's pick the bananas!", zh: '我们摘香蕉吧！' },
        { en: "I don't like big trees.", zh: '我不喜欢大树。' },
      ],
      [
        { en: 'So Pirate Pete picks bananas.', zh: '于是皮特自己摘香蕉。' },
        { en: 'But I like bananas.', zh: '但他喜欢香蕉。' },
      ],
      [
        { en: 'Now Pirate Pete has a fruit salad.', zh: '现在海盗皮特有了一份水果沙拉。' },
        { en: 'My fruit salad is ready to eat!', zh: '我的水果沙拉准备好吃了！' },
        { en: "I'm hungry.", zh: '我饿了。' },
      ],
      [
        { en: 'But Pirate Pete eats the fruit salad alone.', zh: '可是海盗皮特独自吃掉了水果沙拉。' },
        { en: "It's my fruit salad!", zh: '这是我的水果沙拉！' },
      ],
    ],
  },
  '6-12': {
    title: 'The History Project',
    titleZh: '历史作业',
    paragraphs: [
      [
        { en: 'Look! There is the pyramid and the Sphinx.', zh: '看！那里有金字塔和狮身人面像。' },
        { en: 'Wow! Amazing!', zh: '哇！太神奇了！' },
        { en: 'I want to go to Egypt to see them.', zh: '我想去埃及看它们。' },
      ],
      [
        { en: 'Monty and Lola are in the classroom at school.', zh: '蒙蒂和罗拉在学校教室里。' },
        { en: 'This is the history teacher.', zh: '这是历史老师。' },
        { en: 'Now write about Egypt for homework.', zh: '现在要写关于埃及的作业。' },
      ],
      [
        { en: "Hello! My name's Ra.", zh: '你好！我叫拉。' },
        { en: 'This is the desert.', zh: '这是沙漠。' },
        { en: "It's hot and sunny.", zh: '天气又热又晴朗。' },
        { en: "I'm wearing a dress!", zh: '我穿着一条连衣裙！' },
      ],
      [
        { en: 'These are Egyptian numbers.', zh: '这些是埃及数字。' },
        { en: 'One, two, three, four, five.', zh: '一、二、三、四、五。' },
        { en: 'Egyptians like cats.', zh: '埃及人喜欢猫。' },
      ],
    ],
  },
  '6-13': {
    title: 'The Farm and the River Nile',
    titleZh: '农场与尼罗河',
    paragraphs: [
      [
        { en: 'Then Monty, Lola and Ra see a farm.', zh: '后来蒙蒂、罗拉和拉看到了一个农场。' },
        { en: "Here's a farmer.", zh: '这是一位农夫。' },
        { en: 'He has goats and ducks.', zh: '他有山羊和鸭子。' },
      ],
      [
        { en: 'He has a bull, too.', zh: '他还有一头公牛。' },
        { en: "It isn't a bull. It's a cow.", zh: '它不是公牛，它是奶牛。' },
      ],
      [
        { en: 'Monty, Lola and Ra are hungry.', zh: '蒙蒂、罗拉和拉饿了。' },
        { en: 'These are figs.', zh: '这些是无花果。' },
        { en: 'Do you like figs?', zh: '你们喜欢无花果吗？' },
        { en: "No, I don't, but I like grapes.", zh: '不，我不喜欢，但我喜欢葡萄。' },
      ],
      [
        { en: 'This is the River Nile.', zh: '这是尼罗河。' },
        { en: "It's very long.", zh: '它非常长。' },
      ],
    ],
  },
}

// ============================ 5. 拓展词主题（4 个新主题） ============================
export const u6_ext: Record<string, ExtTopic> = {
  'pirate-sea': {
    zh: '海盗与海洋',
    words: [
      w('pirate', '海盗', '🏴‍☠️'), w('ship', '船', '⛵'), w('island', '岛', '🏝️'),
      w('ocean', '海洋', '🌊'), w('map', '地图', '🗺️'), w('flag', '旗帜', '🚩'),
      w('treasure', '宝藏', '💎'),
    ],
  },
  treasure: {
    zh: '宝藏',
    words: [
      w('treasure', '宝藏', '💎'), w('chest', '箱子', '🧰'), w('key', '钥匙', '🔑'),
      w('gold', '黄金', '🥇'), w('gem', '宝石', '💠'), w('coin', '硬币', '🪙'),
      w('dig', '挖', '⛏️'),
    ],
  },
  madagascar: {
    zh: '马达加斯加',
    words: [
      w('Madagascar', '马达加斯加', '🗺️'), w('island', '岛', '🏝️'), w('lemur', '狐猴', '🐒'),
      w('fossa', '马岛狸', '🐆'), w('baobab', '猴面包树', '🌳'), w('Africa', '非洲', '🌍'),
      w('beach', '海滩', '🏖️'),
    ],
  },
  history: {
    zh: '历史与古埃及',
    words: [
      w('Egypt', '埃及', '🇪🇬'), w('pyramid', '金字塔', '🔺'), w('desert', '沙漠', '🏜️'),
      w('Sphinx', '狮身人面像', '🗿'), w('museum', '博物馆', '🏛️'), w('king', '国王', '👑'),
      w('number', '数字', '🔢'),
    ],
  },
}

// ============================ 6. 单元模块 ============================
export const u6_module: Module = {
  id: 6,
  slug: 'lola-the-pirate',
  title: 'Lola the Pirate',
  titleZh: '罗拉海盗',
  emoji: '🏴‍☠️',
  color: '#F5B017',
  colorSoft: '#FFF3C4',
  preview: {
    goals: [
      '认识 10 多种水果名称，能用 I like / I don\'t like 表达喜欢与不喜欢',
      '学会用 Do you like...? Yes, I do. / No, I don\'t. 问答饮料与食物喜好',
      '读懂「海盗皮特摘水果」和「历史作业（埃及）」两则小故事',
      '学习字母 o 的自然拼读，学说含 o 的单词与 chant',
      '了解水果的生长（种子→植物→开花→果实）与马达加斯加文化',
    ],
    keyWords: 'apple, pineapple, grape, orange, coconut, pear, lemon, lime, mango, banana, pirate, ship, fruit salad, juice, yogurt',
    keySentences: "What fruit do you like? I like apples. I don't like lemons. Do you like juice? Yes, I do. No, I don't.",
    tip: '预习时找出家里的各种水果，用英语说出名字并练习 I like / I don\'t like；读海盗故事时模仿角色语气，再和家人用 Do you like...? 问答饮品喜好。',
  },
  lessons: u6_lessons[6],
  quiz: [
    { q: '罗拉最喜欢的水果是什么？🍇', options: ['Grapes are her favorite fruit.', 'Apples are her favorite fruit.', 'Pineapples are her favorite fruit.'], answer: 0, explain: '课文里罗拉说 Grapes are my favorite fruit.' },
    { q: '你喜欢果汁吗？正确的肯定回答是？🥤', options: ['Yes, I do.', "No, I don't.", 'I like juice.'], answer: 0, explain: 'Do you like...? 的肯定回答是 Yes, I do.' },
    { q: '下面哪个是菠萝？🍍', options: ['pineapple', 'coconut', 'lemon'], answer: 0, explain: '菠萝是 pineapple。' },
    { q: '字母 o 在 hot 里发什么音？☀️', options: ['/ɒ/', '/i/', '/e/'], answer: 0, explain: 'hot 里的 o 发短音 /ɒ/。' },
    { q: '马达加斯加（Madagascar）是非洲附近的什么？🏝️', options: ['an island', 'a desert', 'a river'], answer: 0, explain: '课文说 Madagascar is an island near Africa.' },
  ],
}
