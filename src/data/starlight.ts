// Starlight 0 预备级 课程数据
// 依据真实教材 PDF 内容构建，共 12 个单元 + 字母表。
// 教材：Oxford Starlight Starter (预备级)，配合一对一菲教课使用。

export interface Word {
  en: string
  zh: string
  emoji: string
  ipa?: string
}

export interface Sentence {
  en: string
  zh: string
  /** Chinese usage hint for parents */
  hint?: string
}

export interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface ModulePreview {
  goals: string[]
  keyWords: string
  keySentences: string
  tip: string
}

// 一节课的内容:每个单元有 8 课,每课有独立的单词和句型
export interface Lesson {
  id: number
  title: string
  titleZh: string
  words: Word[]
  sentences: Sentence[]
}

export interface Module {
  id: number
  slug: string
  title: string
  titleZh: string
  emoji: string
  color: string
  colorSoft: string
  preview: ModulePreview
  // 按 lesson 细分的学习内容(8 课)
  lessons: Lesson[]
  quiz: QuizQuestion[]
}

// 导入按 lesson 细分的课程数据
import { lessonsByUnit } from './lessons'

// Starlight 模块专属主题色(暖橙 + 柔橙),区别于 Fly Guy 绿与 Rocket Girl 紫罗兰。
// 全模块页面统一由此派生,保证“模块内所有颜色都基于本模块主题色拓展”。
export const STARLIGHT_THEME = {
  color: '#F5B017',
  colorSoft: '#FFF3C4',
} as const

export const modules: Module[] = [
  {
    id: 1,
    slug: 'hello',
    title: 'Hello!',
    titleZh: '打招呼与颜色',
    emoji: '👋',
    color: '#ef4444',
    colorSoft: '#fee2e2',
    preview: {
      goals: [
        '学会用 Hello 打招呼、用 I\'m... / My name is... 自我介绍',
        '认识 6 种颜色并问答 What color is it? It\'s...',
        '学说问候语 Good morning / afternoon / evening'
      ],
      keyWords: 'hello, red, blue, yellow, green, orange, purple',
      keySentences: "Hello! How are you? What's your name? My name is Abby. What color is it? It's red.",
      tip: '预习时和孩子互相打招呼问名字，再找出家里的彩色物品指着说颜色，最后练习颜色混合小游戏。'
    },
    lessons: lessonsByUnit[1],
    quiz: [
      { q: "Hello, what's your name? 应该怎么回答？", options: ["My name is Leo.", "I'm good.", "Goodbye."], answer: 0, explain: '回答名字用 My name is + 名字。' },
      { q: 'What color is it? 🔴', options: ['blue', 'red', 'green'], answer: 1, explain: '红色是 red。' },
      { q: '早上好，应该说？', options: ['Good evening!', 'Good afternoon!', 'Good morning!'], answer: 2, explain: '早上好用 Good morning!' },
      { q: 'Blue and yellow make ___.', options: ['purple', 'green', 'orange'], answer: 1, explain: '蓝色加黄色变成绿色 green。' },
      { q: 'What color is it? 🟡', options: ['yellow', 'red', 'purple'], answer: 0, explain: '黄色是 yellow。' }
    ]
  },
  {
    id: 2,
    slug: 'animals',
    title: 'Animals',
    titleZh: '动物',
    emoji: '🐾',
    color: '#3b82f6',
    colorSoft: '#dbeafe',
    preview: {
      goals: [
        '认识宠物、农场、动物园、海洋和昆虫动物',
        '能问答 What\'s this animal? This is a... / What animal do you see? I see...',
        '能问 What does the cow say? 并模仿动物叫声'
      ],
      keyWords: 'dog, cat, rabbit, cow, pig, bear, monkey, fish',
      keySentences: "What's this animal? This is a cow. What animal do you see? I see a panda. What does the cow say? Moo, moo.",
      tip: '预习时看动物图片或视频，模仿动物叫声和动作，并用英语说出名字，再数一数动物数量。'
    },
    lessons: lessonsByUnit[2],
    quiz: [
      { q: "What's this animal? 🐶", options: ['cat', 'dog', 'rabbit'], answer: 1, explain: '狗是 dog。' },
      { q: 'What does the cow say? 🐮', options: ['Moo, moo.', 'Quack, quack.', 'Oink, oink.'], answer: 0, explain: '奶牛哞哞叫 Moo, moo。' },
      { q: 'What animal do you see? 🐼', options: ['I see a bear.', 'I see a panda.', 'I see a monkey.'], answer: 1, explain: '熊猫是 panda。' },
      { q: 'Which pet do you like? (喜欢猫)', options: ['I like the cat.', 'I like the cow.', 'I like the bear.'], answer: 0, explain: '猫是 cat，属于宠物。' },
      { q: 'How many butterflies do you see? 🦋🦋🦋 (3 只)', options: ['I see 2 butterflies.', 'I see 3 butterflies.', 'I see 4 butterflies.'], answer: 1, explain: '3 只蝴蝶用 I see 3 butterflies。' }
    ]
  },
  {
    id: 3,
    slug: 'food',
    title: 'Food & Drinks',
    titleZh: '食物与饮料',
    emoji: '🍎',
    color: '#10b981',
    colorSoft: '#d1fae5',
    preview: {
      goals: [
        '认识水果、蔬菜、饮料和零食的名称',
        '能用 Do you like...? Yes, I do. / No, I don\'t. 表达喜好',
        '能问答 What do you want? I want... / What would you like to drink?'
      ],
      keyWords: 'apple, banana, watermelon, milk, juice, carrot, tomato, cake',
      keySentences: "What's this? This is milk. Do you like vegetables? Yes, I do. What do you want? I want popcorn.",
      tip: '预习时打开冰箱，让孩子用英语说出水果蔬菜和饮料的名字，并练习表达喜欢和不喜欢。'
    },
    lessons: lessonsByUnit[3],
    quiz: [
      { q: "What's this? 🥛", options: ['juice', 'milk', 'water'], answer: 1, explain: '牛奶是 milk。' },
      { q: 'Do you like carrots? (喜欢)', options: ['Yes, I do.', "No, I don't.", 'I see.'], answer: 0, explain: '喜欢用 Yes, I do.' },
      { q: 'What do you want? 🍿', options: ['I want popcorn.', 'I want milk.', 'I want juice.'], answer: 0, explain: '爆米花是 popcorn。' },
      { q: "I'd like to drink ___. 🧃 (果汁)", options: ['water', 'orange juice', 'milk'], answer: 1, explain: '果汁是 orange juice / juice。' },
      { q: '红色的水果是？ 🍎', options: ['banana', 'apple', 'watermelon'], answer: 1, explain: '苹果是 apple。' }
    ]
  },
  {
    id: 4,
    slug: 'toys',
    title: 'Toys & Fun',
    titleZh: '玩具与乐趣',
    emoji: '🧸',
    color: '#f59e0b',
    colorSoft: '#fef3c7',
    preview: {
      goals: [
        '认识玩具、乐器和角色名称',
        '学会礼貌用语 Please / Thank you / Here you are / I\'m sorry',
        '能问答 Which toy do you want? I want... / Can you play the...?'
      ],
      keyWords: 'doll, car, train, airplane, guitar, piano, violin, flute',
      keySentences: "Which toy do you want? I want a car. Here you are. Thank you. Can you play the piano? Yes, I can.",
      tip: '预习时拿出孩子的玩具和乐器图片，边玩边说英语，并练习礼貌用语和角色扮演。'
    },
    lessons: lessonsByUnit[4],
    quiz: [
      { q: 'Which toy do you want? 🚗', options: ['I want a train.', 'I want a car.', 'I want a doll.'], answer: 1, explain: '小汽车是 car。' },
      { q: '"Here you are." 怎么回答？', options: ['Thank you!', "I'm sorry.", 'Goodbye!'], answer: 0, explain: '收到东西要道谢 Thank you!' },
      { q: 'Can you play the ___? 🎹', options: ['guitar', 'piano', 'violin'], answer: 1, explain: '钢琴是 piano。' },
      { q: '"I\'m sorry." 怎么回答？', options: ["It's okay.", 'Here you are.', 'Thank you.'], answer: 0, explain: '回应道歉用 It\'s okay.' },
      { q: 'What is it? 🎸', options: ['violin', 'flute', 'guitar'], answer: 2, explain: '吉他是 guitar。' }
    ]
  },
  {
    id: 5,
    slug: 'opposites',
    title: 'Opposites',
    titleZh: '反义词',
    emoji: '⚖️',
    color: '#ec4899',
    colorSoft: '#fce7f3',
    preview: {
      goals: [
        '学会 8 个常用反义词（big / small 等）',
        "能用 It's ... 描述事物的大小、声音、感受",
        "能问答 Is it good? Yes, it is. / No, it isn't."
      ],
      keyWords: 'big, small, loud, quiet, fast, slow, good, bad',
      keySentences: "It's big. Is it good? Yes, it is. No, it isn't. I'm happy.",
      tip: '预习时和孩子玩"反义词"游戏：你说 big，孩子说 small；用家里的物品练习 It\'s big / small。'
    },
    lessons: lessonsByUnit[5],
    quiz: [
      { q: '大象是 big，那小蚂蚁是 ___? 🐘🐜', options: ['big', 'small', 'tall'], answer: 1, explain: '小用 small，是 big 的反义词。' },
      { q: '兔子跑得 ___，乌龟跑得 slow。 🐇🐢', options: ['fast', 'loud', 'cold'], answer: 0, explain: '快用 fast，是 slow 的反义词。' },
      { q: '在教室里我们要 ___，不能大声说话。 🤫', options: ['loud', 'quiet', 'hot'], answer: 1, explain: '安静用 quiet。' },
      { q: 'Is it good? — ___, it is. (肯定回答) 👍', options: ['Yes', 'No', 'OK'], answer: 0, explain: '肯定回答用 Yes, it is.' },
      { q: "夏天很 ___，要穿短袖。 ☀️", options: ['hot', 'cold', 'slow'], answer: 0, explain: '热用 hot。' }
    ]
  },
  {
    id: 6,
    slug: 'body',
    title: 'My Body',
    titleZh: '我的身体',
    emoji: '🕺',
    color: '#84cc16',
    colorSoft: '#ecfccb',
    preview: {
      goals: [
        '认识五官和身体部位的英文名称',
        '能用 I have ... 描述自己的身体',
        '能用 I can ... 表达能做的动作'
      ],
      keyWords: 'eyes, nose, mouth, ear, hand, foot, arm, leg',
      keySentences: 'Touch your nose. I have two eyes. What can you do? I can run.',
      tip: '预习时和孩子玩"Simon Says"游戏：用英语下指令摸身体部位，边做边说。'
    },
    lessons: lessonsByUnit[6],
    quiz: [
      { q: 'Touch your ___. 👃', options: ['eyes', 'nose', 'ears'], answer: 1, explain: '鼻子是 nose。' },
      { q: 'I have two ___. 👀👀', options: ['nose', 'eyes', 'mouth'], answer: 1, explain: '眼睛是 eyes（两只，用复数）。' },
      { q: '___ can you do? — I can run. 🏃', options: ['What', 'Where', 'How'], answer: 0, explain: '问能力用 What can you do?' },
      { q: '我会跳，用英语说：I can ___. 🦘', options: ['run', 'walk', 'jump'], answer: 2, explain: '跳是 jump。' },
      { q: 'I have two ___. 🦵🦵', options: ['leg', 'legs', 'foot'], answer: 1, explain: '两条腿，leg 用复数 legs。' }
    ]
  },
  {
    id: 7,
    slug: 'home',
    title: 'My Home',
    titleZh: '我的家',
    emoji: '🏠',
    color: '#06b6d4',
    colorSoft: '#cffafe',
    preview: {
      goals: [
        '认识家中房间的英文名称',
        '能用 There is a ... 描述家里的物品',
        '能问答 Is there a ...? Yes, there is.'
      ],
      keyWords: 'bedroom, living room, bathroom, kitchen, garden, study, bed, desk',
      keySentences: 'There is a bed. Is there a sofa? This is my bedroom.',
      tip: '预习时带孩子在家走一圈，用英语说出每个房间和里面家具的名字。'
    },
    lessons: lessonsByUnit[7],
    quiz: [
      { q: '睡觉的房间是？ 🛏️', options: ['bedroom', 'kitchen', 'bathroom'], answer: 0, explain: '卧室是 bedroom。' },
      { q: '___ is a bed. (有一张床) 🛏️', options: ['There', 'This', 'It'], answer: 0, explain: '表达"有"用 There is a ...' },
      { q: '___ there a sofa? — Yes, there is. 🛋️', options: ['Is', 'Are', 'Do'], answer: 0, explain: '问单个物品用 Is there a ...?' },
      { q: '做饭的房间是？ 🍳', options: ['study', 'kitchen', 'garden'], answer: 1, explain: '厨房是 kitchen。' },
      { q: 'This ___ my bedroom. (这是我的卧室) 🚪', options: ['is', 'are', 'am'], answer: 0, explain: 'this 后用 is。' }
    ]
  },
  {
    id: 8,
    slug: 'food-groups',
    title: 'Food Groups',
    titleZh: '食物分类',
    emoji: '🍽️',
    color: '#8b5cf6',
    colorSoft: '#ede9fe',
    preview: {
      goals: [
        '认识食物的五大分类（水果、蔬菜、海鲜、零食、肉类）',
        "能问答 Do you like ...? Yes, I do. / No, I don't.",
        "能问答 What would you like? I'd like ..."
      ],
      keyWords: 'fruit, vegetables, seafood, meat, snacks, rice, noodles, fish',
      keySentences: "Do you like fruit? Yes, I do. What would you like? I'd like rice.",
      tip: '预习时和孩子一起去超市，把食物按水果、蔬菜、海鲜、肉类分类说英语。'
    },
    lessons: lessonsByUnit[8],
    quiz: [
      { q: '苹果、香蕉、橘子都属于 ___? 🍎🍌🍊', options: ['fruit', 'meat', 'seafood'], answer: 0, explain: '水果类是 fruit。' },
      { q: '___ you like fish? — Yes, I do. 🐟', options: ['Do', 'Are', 'Is'], answer: 0, explain: '问喜欢用 Do you like ...?' },
      { q: 'What ___ you like? — I\'d like rice. 🍚', options: ['do', 'would', 'are'], answer: 1, explain: '礼貌问"想要"用 What would you like?' },
      { q: 'I want ___. 🍪 (饼干)', options: ['cookie', 'milk', 'fish'], answer: 0, explain: '饼干是 cookie。' },
      { q: '牛肉、猪肉、鸡肉都属于 ___? 🥩🍗', options: ['fruit', 'meat', 'vegetables'], answer: 1, explain: '肉类是 meat。' }
    ]
  },
  {
    id: 9,
    slug: 'my-day',
    title: 'My Day',
    titleZh: '我的一天',
    emoji: '⏰',
    color: '#f97316',
    colorSoft: '#ffedd5',
    preview: {
      goals: [
        '学会用英语说出日常洗漱用品和早餐食物',
        '能用 "It is a..." 和 "I like...for breakfast" 描述物品和喜好',
        '学会用 "It\'s time to..." 表达该做什么事'
      ],
      keyWords: 'towel, toothbrush, breakfast, swing, slide, shower, bed',
      keySentences: 'It is a towel. I like bread for breakfast. This is a swing. It\'s time to go to bed.',
      tip: '家长可以带孩子一起做早晨起床、刷牙洗脸的动作，边做边说英语，让孩子在真实情境中学习日常用语。'
    },
    lessons: lessonsByUnit[9],
    quiz: [
      { q: '早上起床后用来擦干的毛巾英语怎么说？', options: ['toothbrush', 'towel', 'breakfast', 'bed'], answer: 1, explain: '毛巾是 towel，toothbrush 是牙刷。' },
      { q: '想说"我早餐喜欢吃鸡蛋"，应该怎么说？', options: ['I like eggs for breakfast.', 'I like eggs for lunch.', 'I see eggs.', 'I am eggs.'], answer: 0, explain: '表达早餐吃什么用 I like...for breakfast。' },
      { q: '在游乐场玩，看到"滑梯"用英语说是？', options: ['swing', 'slide', 'shower', 'bed'], answer: 1, explain: '滑梯是 slide，swing 是秋千。' },
      { q: '妈妈说"该睡觉了"，正确的英语是？', options: ['It\'s time to play.', 'It\'s time to eat.', 'It\'s time to go to bed.', 'It\'s time to go to school.'], answer: 2, explain: '该睡觉了 = It\'s time to go to bed.' },
      { q: '老师问 What\'s in your school bag? 你想回答"有一块橡皮"，应该说？', options: ['There is an eraser.', 'I see a swing.', 'It is a towel.', 'I like bread.'], answer: 0, explain: '回答书包里有什么用 There is a/an...' }
    ]
  },
  {
    id: 10,
    slug: 'birthday',
    title: 'Birthday',
    titleZh: '生日派对',
    emoji: '🎂',
    color: '#e11d48',
    colorSoft: '#ffe4e6',
    preview: {
      goals: [
        '学会生日派对相关的物品和动作词汇',
        '能用 "I need some..." 和 "Here is/are...for you" 表达需求与赠送',
        '学会用 He/She is my friend 介绍朋友'
      ],
      keyWords: 'balloon, ribbon, cake, gift, friend, hug, kiss, scarf',
      keySentences: 'I need some balloons. He is my friend. Here is a gift for you. It\'s time to clean up.',
      tip: '家长可以在孩子生日或家人朋友生日时，和孩子一起准备派对，用英语说出气球、彩带等物品，让学习更有趣。'
    },
    lessons: lessonsByUnit[10],
    quiz: [
      { q: '生日派对上挂的"气球"英语怎么说？', options: ['cake', 'balloon', 'gift', 'friend'], answer: 1, explain: '气球是 balloon，cake 是蛋糕。' },
      { q: '想介绍自己的好朋友（男生），应该说？', options: ['He is my friend.', 'She is my friend.', 'It is my friend.', 'I am my friend.'], answer: 0, explain: '介绍男生朋友用 He is my friend.' },
      { q: '送礼物给朋友时应该说？', options: ['Here is a gift for you.', 'I need a gift.', 'Where is the gift?', 'I see a gift.'], answer: 0, explain: '送礼物给对方用 Here is a gift for you.' },
      { q: '妈妈亲了你一下，用英语描述这个动作是？', options: ['She hugs me.', 'She kisses me.', 'She smiles at me.', 'She cleans up.'], answer: 1, explain: '亲吻是 kiss，She kisses me 表示她亲吻我。' },
      { q: '派对结束，老师提醒大家收拾，应该怎么说？', options: ['It\'s time to play.', 'It\'s time to clean up.', 'It\'s time to eat.', 'It\'s time to sing.'], answer: 1, explain: '该收拾了 = It\'s time to clean up.' }
    ]
  },
  {
    id: 11,
    slug: 'places',
    title: 'Places',
    titleZh: '去哪里玩',
    emoji: '🏖️',
    color: '#0ea5e9',
    colorSoft: '#e0f2fe',
    preview: {
      goals: [
        '学会动物园、海滩、游乐场等场所名称',
        '能用 "Where do you want to go? I want to go to..." 进行问答',
        '学会用 "I see...in/on the..." 描述在不同地方看到的事物'
      ],
      keyWords: 'zoo, beach, swing, slide, sand, starfish, shark, Ferris wheel',
      keySentences: 'Where do you want to go? I want to go to the zoo. I see a shark in the water. I like playing basketball.',
      tip: '家长可以周末带孩子去动物园或公园玩，看到动物或景物时引导孩子用 I see... 的句型描述，让英语学习融入生活。'
    },
    lessons: lessonsByUnit[11],
    quiz: [
      { q: '想问朋友想去哪里玩，应该怎么说？', options: ['What do you see?', 'Where do you want to go?', 'How do you go?', 'Who is your friend?'], answer: 1, explain: '问想去哪里用 Where do you want to go?' },
      { q: '在水族馆看到鲨鱼，应该说？', options: ['I see a shark in the water.', 'I see a shark on the beach.', 'I like the shark.', 'I am a shark.'], answer: 0, explain: '描述在水里看到的事物用 I see...in the water。' },
      { q: '想去动物园，正确的回答是？', options: ['I want to go to the beach.', 'I want to go to the zoo.', 'I see the zoo.', 'I like the zoo.'], answer: 1, explain: '表达想去某地用 I want to go to...' },
      { q: '海滩上能看到的海星英语是？', options: ['shark', 'starfish', 'sand', 'shell'], answer: 1, explain: '海星是 starfish，shark 是鲨鱼。' },
      { q: '想说"我喜欢坐摩天轮"，正确的英语是？', options: ['I like playing basketball.', 'I like to ride the Ferris wheel.', 'I see the Ferris wheel.', 'I want a Ferris wheel.'], answer: 1, explain: '表达喜欢玩某种游乐设施用 I like to ride the...' }
    ]
  },
  {
    id: 12,
    slug: 'transport',
    title: 'Transport',
    titleZh: '交通出行',
    emoji: '🚦',
    color: '#6366f1',
    colorSoft: '#e0e7ff',
    preview: {
      goals: [
        '学会常见的建筑和交通工具名称',
        '能用 "How do you go to school? I go by..." 询问和回答出行方式',
        '认识红绿灯和交通标志，学会 stop, wait, go 的用法'
      ],
      keyWords: 'school, hospital, bus, bike, taxi, subway, stop, wait',
      keySentences: 'How do you go to school? I go to school by bus. The red says stop. Turn left! This is a police car.',
      tip: '家长接送孩子上学路上，可以和孩子一起用英语说出看到的交通工具和交通标志，练习 How do you go...? 句型，让出行变成英语课堂。'
    },
    lessons: lessonsByUnit[12],
    quiz: [
      { q: '想问同学"你怎么去上学"，应该怎么说？', options: ['What do you see?', 'How do you go to school?', 'Where do you go?', 'Who is at school?'], answer: 1, explain: '询问出行方式用 How do you go to school?' },
      { q: '坐公交车去上学，正确的回答是？', options: ['I go to school by bus.', 'I see a bus.', 'I like a bus.', 'I am a bus.'], answer: 0, explain: '回答出行方式用 I go to school by...' },
      { q: '红灯亮了，应该怎么做？', options: ['Go!', 'Wait or stop!', 'Run!', 'Sing!'], answer: 1, explain: '红灯 The red says stop，要停下来。' },
      { q: '警察叔叔的"警车"英语是？', options: ['fire truck', 'police car', 'ambulance', 'taxi'], answer: 1, explain: '警车是 police car，fire truck 是消防车。' },
      { q: '指路时想说"向左转"，正确的英语是？', options: ['Turn right!', 'Turn left!', 'Go straight!', 'Stop!'], answer: 1, explain: '向左转是 Turn left!，向右转是 Turn right!，直走是 Go straight!' }
    ]
  }
]

export interface LetterItem {
  upper: string
  lower: string
  word: string
  emoji: string
  ipa: string
}

export const alphabet: LetterItem[] = [
  { upper: 'A', lower: 'a', word: 'apple', emoji: '🍎', ipa: '/eɪ/' },
  { upper: 'B', lower: 'b', word: 'ball', emoji: '⚽', ipa: '/biː/' },
  { upper: 'C', lower: 'c', word: 'cat', emoji: '🐱', ipa: '/siː/' },
  { upper: 'D', lower: 'd', word: 'dog', emoji: '🐶', ipa: '/diː/' },
  { upper: 'E', lower: 'e', word: 'egg', emoji: '🥚', ipa: '/iː/' },
  { upper: 'F', lower: 'f', word: 'fish', emoji: '🐟', ipa: '/ef/' },
  { upper: 'G', lower: 'g', word: 'green', emoji: '🟢', ipa: '/dʒiː/' },
  { upper: 'H', lower: 'h', word: 'hat', emoji: '🎩', ipa: '/eɪtʃ/' },
  { upper: 'I', lower: 'i', word: 'ice cream', emoji: '🍦', ipa: '/aɪ/' },
  { upper: 'J', lower: 'j', word: 'juice', emoji: '🧃', ipa: '/dʒeɪ/' },
  { upper: 'K', lower: 'k', word: 'kite', emoji: '🪁', ipa: '/keɪ/' },
  { upper: 'L', lower: 'l', word: 'lion', emoji: '🦁', ipa: '/el/' },
  { upper: 'M', lower: 'm', word: 'milk', emoji: '🥛', ipa: '/em/' },
  { upper: 'N', lower: 'n', word: 'nose', emoji: '👃', ipa: '/en/' },
  { upper: 'O', lower: 'o', word: 'orange', emoji: '🟠', ipa: '/əʊ/' },
  { upper: 'P', lower: 'p', word: 'pen', emoji: '🖊️', ipa: '/piː/' },
  { upper: 'Q', lower: 'q', word: 'queen', emoji: '👑', ipa: '/kjuː/' },
  { upper: 'R', lower: 'r', word: 'rabbit', emoji: '🐰', ipa: '/ɑː/' },
  { upper: 'S', lower: 's', word: 'sun', emoji: '☀️', ipa: '/es/' },
  { upper: 'T', lower: 't', word: 'train', emoji: '🚂', ipa: '/tiː/' },
  { upper: 'U', lower: 'u', word: 'umbrella', emoji: '☂️', ipa: '/juː/' },
  { upper: 'V', lower: 'v', word: 'van', emoji: '🚐', ipa: '/viː/' },
  { upper: 'W', lower: 'w', word: 'water', emoji: '💧', ipa: '/ˈdʌbljuː/' },
  { upper: 'X', lower: 'x', word: 'box', emoji: '📦', ipa: '/eks/' },
  { upper: 'Y', lower: 'y', word: 'yellow', emoji: '🟡', ipa: '/waɪ/' },
  { upper: 'Z', lower: 'z', word: 'zebra', emoji: '🦓', ipa: '/zed/' }
]

export function getModule(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug)
}
