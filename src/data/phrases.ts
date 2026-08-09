// 菲教（菲律宾外教）一对一线上课 · 高频课堂用语
// 面向 8 岁初学者，家长可提前带孩子熟悉，上课听得懂、不紧张。
// 每句附中文；tip 为菲教表达习惯提示（可选）。
// 页面用 SpeakButton 复用现有发音引擎，点英文即听老师怎么读。

export interface PhraseItem {
  en: string
  zh: string
  tip?: string
}

export interface PhraseCat {
  id: string
  emoji: string
  title: string
  zh: string
  /** Tab 网格里显示的短名称（1-4 字） */
  shortZh: string
  items: PhraseItem[]
}

export const phraseCategories: PhraseCat[] = [
  {
    id: 'open',
    emoji: '🎬',
    title: 'Opening & Greetings',
    zh: '课堂开场与问候',
    shortZh: '开场问候',
    items: [
      { en: 'Good morning! / Good afternoon!', zh: '早上好！/ 下午好！', tip: '最常用开场' },
      { en: 'Hello! How are you today?', zh: '你好！你今天好吗？', tip: '带名字更自然：How are you, Lynn?' },
      { en: 'How is your day?', zh: '你今天过得怎么样？' },
      { en: 'Are you ready for our class?', zh: '准备好上课了吗？' },
      { en: "Let's start! / Let's begin.", zh: '我们开始吧！' },
      { en: 'Time for English!', zh: '英语时间到啦！' },
      { en: 'Nice to see you again!', zh: '很高兴又见到你！' },
      { en: 'Give me a high five!', zh: '来击个掌！' },
      { en: "I'm good, thank you! And you?", zh: '我很好，谢谢！你呢？（老师示范回答）' },
    ],
  },
  {
    id: 'instruct',
    emoji: '📣',
    title: 'Simple Instructions',
    zh: '简单指令（开书·跟读·重复）',
    shortZh: '简单指令',
    items: [
      { en: 'Open your book, please.', zh: '请打开书。', tip: '也可说 Open your book.' },
      { en: 'Turn to page 5.', zh: '翻到第 5 页。' },
      { en: 'Look at the picture.', zh: '看这张图。' },
      { en: 'Look at the screen.', zh: '看屏幕。' },
      { en: 'Listen carefully.', zh: '仔细听。' },
      { en: 'Listen and repeat.', zh: '听，然后跟读。' },
      { en: 'Repeat after me.', zh: '跟我读。' },
      { en: 'Read after me.', zh: '跟我念。' },
      { en: 'Say it again.', zh: '再说一遍。' },
      { en: 'One more time.', zh: '再来一次。' },
      { en: 'Louder, please.', zh: '请大声一点。' },
      { en: 'Follow me.', zh: '跟着我。' },
      { en: 'Point to the dog.', zh: '指出小狗（指向某物）。' },
      { en: 'Show me your finger.', zh: '伸出你的手指。' },
      { en: 'Trace the word.', zh: '描这个单词。' },
      { en: 'Write it down.', zh: '写下来。' },
      { en: 'Circle the answer.', zh: '圈出答案。' },
      { en: 'Match the picture.', zh: '把图和词连起来。' },
      { en: 'Sit up straight.', zh: '坐直。' },
      { en: 'Close your book.', zh: '合上书。' },
    ],
  },
  {
    id: 'praise',
    emoji: '🎉',
    title: 'Encouragement & Praise',
    zh: '鼓励与表扬',
    shortZh: '鼓励表扬',
    items: [
      { en: 'Very good!', zh: '很好！' },
      { en: 'Good job!', zh: '做得好！', tip: '菲教最爱' },
      { en: 'Excellent!', zh: '太棒了！' },
      { en: 'Well done!', zh: '干得好！' },
      { en: 'Perfect!', zh: '完美！' },
      { en: 'Amazing! / Super! / Great!', zh: '了不起！/ 超级棒！/ 好极了！' },
      { en: 'Nice! / Nice one!', zh: '不错！' },
      { en: "You did it!", zh: '你做到了！' },
      { en: "I'm so proud of you!", zh: '我真为你骄傲！' },
      { en: 'Keep going!', zh: '继续加油！' },
      { en: "You're getting better!", zh: '你越来越棒了！' },
      { en: 'Almost! Try again.', zh: '快对了！再试一次。' },
      { en: "Don't worry, you can do it.", zh: '别担心，你能行。' },
      { en: "It's okay to make mistakes.", zh: '犯错没关系。' },
    ],
  },
  {
    id: 'check',
    emoji: '❓',
    title: 'Checking Comprehension',
    zh: '确认孩子是否听懂',
    shortZh: '确认听懂',
    items: [
      { en: 'Okay?', zh: '懂了吗？可以吗？', tip: '菲教最高频确认词' },
      { en: 'Do you understand?', zh: '你听懂了吗？' },
      { en: 'Is it clear?', zh: '清楚了吗？' },
      { en: 'Do you get it?', zh: '你明白了吗？' },
      { en: 'Are you with me?', zh: '你跟上我了吗？' },
      { en: 'Are you following?', zh: '你跟上了吗？' },
      { en: 'Any questions?', zh: '有问题吗？' },
      { en: 'Do you know this word?', zh: '你认识这个单词吗？' },
      { en: 'What does this mean?', zh: '这个是什么意思？' },
      { en: 'Can you say it in Chinese?', zh: '你能用中文说说吗？' },
      { en: 'Tell me in your own words.', zh: '用你自己的话说说看。' },
    ],
  },
  {
    id: 'correct',
    emoji: '🔤',
    title: 'Correction & Demo',
    zh: '纠音与示范',
    shortZh: '纠音示范',
    items: [
      { en: 'Listen to me.', zh: '听我说 / 听我读。' },
      { en: 'Watch my mouth.', zh: '看我的嘴型。' },
      { en: 'Look at my lips.', zh: '看我的嘴唇。' },
      { en: 'Follow my mouth.', zh: '跟着我的嘴型。' },
      { en: 'Like this.', zh: '像这样。', tip: '示范时必说' },
      { en: 'Say it slowly.', zh: '慢慢说。' },
      { en: 'Again, please.', zh: '请再来一次。' },
      { en: 'Not like that. Like this.', zh: '不是那样，是这样。' },
      { en: 'Let me hear you.', zh: '让我听听你读。' },
      { en: 'Good try! Now listen...', zh: '试得不错！现在听……' },
      { en: 'Open your mouth wide.', zh: '把嘴张大。' },
    ],
  },
  {
    id: 'break',
    emoji: '⏸️',
    title: 'Break & Move',
    zh: '课间动一动',
    shortZh: '课间互动',
    items: [
      { en: "Let's take a break.", zh: '我们休息一下。' },
      { en: 'Time for a break.', zh: '休息时间到。' },
      { en: 'Five minutes break.', zh: '休息五分钟。' },
      { en: 'Stretch your arms.', zh: '伸伸胳膊。' },
      { en: "Let's move! / Let's dance!", zh: '动一动吧！/ 跳一跳！' },
      { en: 'Do you want water?', zh: '要喝水吗？' },
      { en: 'Are you tired?', zh: '累了吗？' },
      { en: 'Come back, please.', zh: '请回来（继续上课）。' },
      { en: 'Ready to continue?', zh: '准备好继续了吗？' },
    ],
  },
  {
    id: 'bye',
    emoji: '👋',
    title: 'Farewell',
    zh: '下课告别',
    shortZh: '下课告别',
    items: [
      { en: 'Our class is finished.', zh: '我们下课啦。' },
      { en: 'Time to say goodbye.', zh: '要说再见咯。' },
      { en: 'Good job today!', zh: '今天表现真棒！' },
      { en: 'See you next time!', zh: '下次见！' },
      { en: 'See you tomorrow!', zh: '明天见！' },
      { en: 'Bye-bye! Take care!', zh: '拜拜！保重！' },
      { en: 'Have a nice day!', zh: '祝你今天愉快！' },
      { en: 'Give me a hug!', zh: '给我一个拥抱！（线上课）' },
      { en: "Don't forget to practice!", zh: '别忘了练习哦！' },
      { en: "I'll miss you!", zh: '我会想你的！' },
    ],
  },
]
