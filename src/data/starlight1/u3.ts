// Starlight 1 · Level 1 · Unit 3「Monty the Clown」课程数据
// 数据来源：src/data/starlight1/raw/unit3.json（教材 PDF 文本）。
// 结构对齐 Unit 1 试点（lessons.ts / book.ts / sentenceFrames.ts / reading.ts / extensions.ts / index.ts）。
// 本单元 11 课：家庭成员词汇 → 阅读救猫故事 → 单复数 / 外貌描写语法 → /er/ 自然拼读 →
// 双胞胎科学(CLIL) → 综合练习 → Secret Agent 10 故事。

import type { Lesson, LessonBook, SentenceFrame, ReadingPassage, Module, ExtTopic } from './shared'
import { w } from './shared'

// ===================== Lessons（11 课） =====================
export const u3_lessons: Record<number, Lesson[]> = {
  3: [
    // ---- Lesson 1: Vocabulary（家庭成员 + 马戏团） ----
    {
      id: 1,
      title: 'Family at the Circus',
      titleZh: '马戏团里的家人',
      words: [
        { en: 'mom', zh: '妈妈', emoji: '👩', ipa: '/mɒm/' },
        { en: 'dad', zh: '爸爸', emoji: '👨', ipa: '/dæd/' },
        { en: 'grandma', zh: '奶奶／外婆', emoji: '👵', ipa: '/ˈɡrænmɑː/' },
        { en: 'grandpa', zh: '爷爷／外公', emoji: '👴', ipa: '/ˈɡrænpɑː/' },
        { en: 'circus', zh: '马戏团', emoji: '🎪', ipa: '/ˈsɜːkəs/' },
      ],
      sentences: [
        { en: 'Come to the circus!', zh: '来马戏团吧！', hint: '马戏团歌曲里的句子' },
        { en: 'Who is this?', zh: '这是谁？', hint: '指着家人问' },
        { en: 'This is my dad.', zh: '这是我的爸爸。', hint: '介绍家人' },
        { en: 'This is my grandma.', zh: '这是我的奶奶。', hint: '介绍家人' },
        { en: 'How many people are there at the circus?', zh: '马戏团里有多少人？', hint: '询问数量' },
      ],
    },
    // ---- Lesson 2: Vocabulary and Practice ----
    {
      id: 2,
      title: 'More Family',
      titleZh: '更多家庭成员',
      words: [
        { en: 'aunt', zh: '阿姨／姑妈', emoji: '👩', ipa: '/ɑːnt/' },
        { en: 'uncle', zh: '叔叔／舅舅', emoji: '👨', ipa: '/ˈʌŋkl/' },
        { en: 'brother', zh: '兄弟', emoji: '👦', ipa: '/ˈbrʌðə/' },
        { en: 'sister', zh: '姐妹', emoji: '👧', ipa: '/ˈsɪstə/' },
        { en: 'cousins', zh: '表／堂兄弟姐妹', emoji: '👫', ipa: '/ˈkʌznz/' },
      ],
      sentences: [
        { en: 'This is my uncle.', zh: '这是我的叔叔。', hint: '介绍长辈' },
        { en: 'This is my aunt.', zh: '这是我的阿姨。', hint: '介绍长辈' },
        { en: 'This is my brother.', zh: '这是我的兄弟。', hint: '介绍同辈' },
        { en: 'This is my sister.', zh: '这是我的姐妹。', hint: '介绍同辈' },
        { en: 'These are my cousins.', zh: '这些是我的表兄弟姐妹。', hint: 'cousins 是复数' },
      ],
    },
    // ---- Lesson 3: Reading（Ruby 救猫） ----
    {
      id: 3,
      title: 'Bam Bam in the Tree',
      titleZh: '树上的 Bam Bam',
      words: [
        { en: 'cat', zh: '猫', emoji: '🐱', ipa: '/kæt/' },
        { en: 'tree', zh: '树', emoji: '🌳', ipa: '/triː/' },
        { en: 'jump', zh: '跳', emoji: '🦘', ipa: '/dʒʌmp/' },
        { en: 'high', zh: '高的', emoji: '🔝', ipa: '/haɪ/' },
        { en: 'big', zh: '大的', emoji: '🐘', ipa: '/bɪɡ/' },
      ],
      sentences: [
        { en: 'This is Bam Bam. He is a cat.', zh: '这是 Bam Bam，他是一只猫。', hint: '故事里的猫' },
        { en: 'Bam Bam is in the tree.', zh: 'Bam Bam 在树上。', hint: '猫上树了' },
        { en: 'Grandpa jumps.', zh: '爷爷跳。', hint: '救猫的动作' },
        { en: 'Dad jumps onto Grandpa.', zh: '爸爸跳到爷爷身上。', hint: '叠罗汉' },
        { en: 'Bam Bam is very high up.', zh: 'Bam Bam 在高高的树上。', hint: '猫还在高处' },
      ],
    },
    // ---- Lesson 4: Reading and Practice ----
    {
      id: 4,
      title: 'We Get Bam Bam!',
      titleZh: '我们救下 Bam Bam 啦',
      words: [
        { en: 'grandma', zh: '奶奶／外婆', emoji: '👵', ipa: '/ˈɡrænmɑː/' },
        { en: 'idea', zh: '主意', emoji: '💡', ipa: '/aɪˈdɪə/' },
        { en: 'happy', zh: '开心的', emoji: '😊', ipa: '/ˈhæpi/' },
        { en: 'thank you', zh: '谢谢', emoji: '🙏', ipa: '/ˈθæŋk juː/' },
        { en: 'cat', zh: '猫', emoji: '🐱', ipa: '/kæt/' },
      ],
      sentences: [
        { en: 'Grandma jumps onto the cousins.', zh: '奶奶跳到表兄弟姐妹身上。', hint: '救猫的动作' },
        { en: 'Jump, Ruby, jump!', zh: '跳，Ruby，跳！', hint: '大家一起帮忙' },
        { en: 'The family get Bam Bam.', zh: '一家人救下了 Bam Bam。', hint: '故事的结局' },
        { en: 'Now Bam Bam is happy.', zh: '现在 Bam Bam 开心了。', hint: '猫得救了' },
        { en: 'Thank you, everyone!', zh: '谢谢大家！', hint: '表达感谢' },
      ],
    },
    // ---- Lesson 5: Language Focus（This is / These are） ----
    {
      id: 5,
      title: 'This Is / These Are',
      titleZh: '单数还是复数',
      words: [
        { en: 'cousin', zh: '表／堂兄弟姐妹', emoji: '👦', ipa: '/ˈkʌzn/' },
        { en: 'cousins', zh: '表／堂兄弟姐妹（复数）', emoji: '👫', ipa: '/ˈkʌznz/' },
        { en: 'grandma', zh: '奶奶／外婆', emoji: '👵', ipa: '/ˈɡrænmɑː/' },
        { en: 'grandpa', zh: '爷爷／外公', emoji: '👴', ipa: '/ˈɡrænpɑː/' },
        { en: 'dad', zh: '爸爸', emoji: '👨', ipa: '/dæd/' },
      ],
      sentences: [
        { en: 'This is my cousin.', zh: '这是我的表兄弟姐妹（一个）。', hint: '单数用 this is' },
        { en: 'These are my cousins.', zh: '这些是我的表兄弟姐妹。', hint: '复数用 these are' },
        { en: 'This is my grandma.', zh: '这是我的奶奶。', hint: '介绍一位长辈' },
        { en: 'This is my grandpa.', zh: '这是我的爷爷。', hint: '介绍一位长辈' },
        { en: 'This is my dad.', zh: '这是我的爸爸。', hint: '介绍家人' },
      ],
    },
    // ---- Lesson 6: Language Focus and Practice（He has / She has） ----
    {
      id: 6,
      title: 'He Has / She Has',
      titleZh: '描述外貌',
      words: [
        { en: 'long hair', zh: '长发', emoji: '💇', ipa: '/lɒŋ heə/' },
        { en: 'short hair', zh: '短发', emoji: '✂️', ipa: '/ʃɔːt heə/' },
        { en: 'big eyes', zh: '大眼睛', emoji: '👀', ipa: '/bɪɡ aɪz/' },
        { en: 'small eyes', zh: '小眼睛', emoji: '👁️', ipa: '/smɔːl aɪz/' },
        { en: 'blond hair', zh: '金发', emoji: '💛', ipa: '/blɒnd heə/' },
      ],
      sentences: [
        { en: 'She has blond hair.', zh: '她有一头金发。', hint: '描述女生外貌' },
        { en: 'He has small eyes.', zh: '他有一双小眼睛。', hint: '描述男生外貌' },
        { en: 'He has gray hair.', zh: '他有灰白头发。', hint: '描述头发颜色' },
        { en: 'She has long hair.', zh: '她有一头长发。', hint: '描述头发长短' },
        { en: 'She has big eyes.', zh: '她有一双大眼睛。', hint: '描述眼睛大小' },
      ],
    },
    // ---- Lesson 7: Phonics（/er/ 音） ----
    {
      id: 7,
      title: 'Phonics: /er/',
      titleZh: '自然拼读：/er/ 音',
      words: [
        { en: 'brother', zh: '兄弟', emoji: '👦', ipa: '/ˈbrʌðə/' },
        { en: 'sister', zh: '姐妹', emoji: '👧', ipa: '/ˈsɪstə/' },
        { en: 'teacher', zh: '老师', emoji: '👩‍🏫', ipa: '/ˈtiːtʃə/' },
        { en: 'eraser', zh: '橡皮', emoji: '🧽', ipa: '/ɪˈreɪzə/' },
        { en: 'spider', zh: '蜘蛛', emoji: '🕷️', ipa: '/ˈspaɪdə/' },
        { en: 'flower', zh: '花', emoji: '🌸', ipa: '/ˈflaʊə/' },
      ],
      sentences: [
        { en: 'Er says er, er, er.', zh: 'er 发 er 的音。', hint: '/er/ 发音口诀' },
        { en: 'This is my brother.', zh: '这是我的兄弟。', hint: '含 /er/ 的词' },
        { en: 'This is my sister.', zh: '这是我的姐妹。', hint: '含 /er/ 的词' },
        { en: 'This is my teacher.', zh: '这是我的老师。', hint: '含 /er/ 的词' },
        { en: 'This is a spider.', zh: '这是一只蜘蛛。', hint: '含 /er/ 的词' },
      ],
    },
    // ---- Lesson 8: CLIL（科学：一样／相似／一模一样） ----
    {
      id: 8,
      title: 'CLIL: Twins',
      titleZh: '科学：双胞胎',
      words: [
        { en: 'different', zh: '不一样的', emoji: '🔀', ipa: '/ˈdɪfrənt/' },
        { en: 'similar', zh: '很像的', emoji: '🔁', ipa: '/ˈsɪmələ/' },
        { en: 'identical', zh: '一模一样的', emoji: '👯', ipa: '/aɪˈdentɪkl/' },
        { en: 'twins', zh: '双胞胎', emoji: '👯', ipa: '/twɪnz/' },
        { en: 'sister', zh: '姐妹', emoji: '👧', ipa: '/ˈsɪstə/' },
      ],
      sentences: [
        { en: 'They are different.', zh: '他们不一样。', hint: '描述差异' },
        { en: 'They are similar.', zh: '他们很像。', hint: '描述相似' },
        { en: 'They are identical.', zh: '他们一模一样。', hint: '双胞胎用语' },
        { en: 'They are twins.', zh: '他们是双胞胎。', hint: '介绍双胞胎' },
        { en: 'I look like my mom.', zh: '我长得像妈妈。', hint: '像谁' },
      ],
    },
    // ---- Lesson 9: Practice（综合练习） ----
    {
      id: 9,
      title: 'Practice',
      titleZh: '综合练习',
      words: [
        { en: 'clown', zh: '小丑', emoji: '🤡', ipa: '/klaʊn/' },
        { en: 'flower', zh: '花', emoji: '🌸', ipa: '/ˈflaʊə/' },
        { en: 'balloon', zh: '气球', emoji: '🎈', ipa: '/bəˈluːn/' },
        { en: 'spider', zh: '蜘蛛', emoji: '🕷️', ipa: '/ˈspaɪdə/' },
        { en: 'teacher', zh: '老师', emoji: '👩‍🏫', ipa: '/ˈtiːtʃə/' },
      ],
      sentences: [
        { en: 'This is my brother, my sister and me.', zh: '这是我的兄弟、姐妹和我。', hint: '介绍一家人' },
        { en: 'This is my teacher and her family.', zh: '这是我的老师和她的家人。', hint: '介绍老师一家' },
        { en: 'The clown has a flower.', zh: '小丑有一朵花。', hint: '练习歌曲里的句子' },
        { en: 'He has a balloon and a spider.', zh: '他有一个气球和一只蜘蛛。', hint: '继续练 has' },
        { en: 'They are twins.', zh: '他们是双胞胎。', hint: '复习 CLIL 词汇' },
      ],
    },
    // ---- Lesson 10: Story Reading（Secret Agent 10） ----
    {
      id: 10,
      title: 'Secret Agent 10',
      titleZh: '10 号特工（故事）',
      words: [
        { en: 'blond hair', zh: '金发', emoji: '💛', ipa: '/blɒnd heə/' },
        { en: 'brown eyes', zh: '棕色眼睛', emoji: '🤎', ipa: '/braʊn aɪz/' },
        { en: 'blue eyes', zh: '蓝色眼睛', emoji: '🔵', ipa: '/bluː aɪz/' },
        { en: 'black hair', zh: '黑头发', emoji: '⚫', ipa: '/blæk heə/' },
        { en: 'white hat', zh: '白帽子', emoji: '🎩', ipa: '/waɪt hæt/' },
        { en: 'big feet', zh: '大脚', emoji: '👣', ipa: '/bɪɡ fiːt/' },
      ],
      sentences: [
        { en: 'What does he look like?', zh: '他长什么样？', hint: '问外貌' },
        { en: 'He has brown hair and blue eyes.', zh: '他有棕色头发和蓝色眼睛。', hint: '描述男生' },
        { en: 'She has blond hair and green eyes.', zh: '她有金发和绿色眼睛。', hint: '描述女生' },
        { en: 'He has black hair and a white hat.', zh: '他有黑头发和一顶白帽子。', hint: '描述穿着' },
        { en: 'Where are Monty and Lola?', zh: 'Monty 和 Lola 在哪里？', hint: '故事开头' },
      ],
    },
    // ---- Lesson 11: Story Reading and Practice ----
    {
      id: 11,
      title: 'Who Is Agent 10?',
      titleZh: '10 号特工是谁？',
      words: [
        { en: 'brown hair', zh: '棕色头发', emoji: '🤎', ipa: '/braʊn heə/' },
        { en: 'green eyes', zh: '绿色眼睛', emoji: '🟢', ipa: '/ɡriːn aɪz/' },
        { en: 'black hair', zh: '黑头发', emoji: '⚫', ipa: '/blæk heə/' },
        { en: 'blond hair', zh: '金发', emoji: '💛', ipa: '/blɒnd heə/' },
        { en: 'big feet', zh: '大脚', emoji: '👣', ipa: '/bɪɡ fiːt/' },
      ],
      sentences: [
        { en: 'He has brown hair and blue eyes.', zh: '他有棕色头发和蓝色眼睛。', hint: '描述男生' },
        { en: 'She has black hair and blue eyes.', zh: '她有黑头发和蓝色眼睛。', hint: '描述女生' },
        { en: 'Mr. Sonic is Secret Agent 10.', zh: 'Sonic 老师是 10 号特工。', hint: '故事结尾揭晓' },
        { en: 'This message is from Mr. Sonic.', zh: '这条消息来自 Sonic 老师。', hint: '谁留下的' },
        { en: 'He has big feet.', zh: '他有一双大脚。', hint: '特工的特征' },
      ],
    },
  ],
}

// ===================== Book（课本原文，按活动分组） =====================
export const u3_book: Record<string, LessonBook> = {
  '3-1': {
    title: 'Family at the Circus',
    sections: [
      { chapter: 'Warm up: a song.', chapterZh: '热身：唱首歌。', pages: [
        { text: "Let's enjoy a song!", textZh: '我们来唱首歌吧！' },
        { text: 'Mommy shark, doo doo doo, doo doo doo, doo doo doo.', textZh: '鲨鱼妈妈～（跟着哼唱）' },
      ] },
      { chapter: 'Focus on: family words.', chapterZh: '重点词汇：家庭成员。', pages: [
        { text: 'mom', textZh: '妈妈' },
        { text: 'dad', textZh: '爸爸' },
        { text: 'grandma', textZh: '奶奶／外婆' },
        { text: 'grandpa', textZh: '爷爷／外公' },
      ] },
      { chapter: 'Look and say.', chapterZh: '看一看，说一说。', pages: [
        { text: 'How many people are there at the circus?', textZh: '马戏团里有多少人？' },
        { text: 'Who are they?', textZh: '他们是谁？' },
        { text: 'This is my ...', textZh: '这是我的……' },
      ] },
      { chapter: 'Do a role-play.', chapterZh: '来玩角色扮演。', pages: [
        { text: 'Who is this?', textZh: '这是谁？' },
        { text: 'This is my dad.', textZh: '这是我的爸爸。' },
        { text: 'This is my grandma.', textZh: '这是我的奶奶。' },
        { text: 'This is my grandpa.', textZh: '这是我的爷爷。' },
        { text: 'This is my mom.', textZh: '这是我的妈妈。' },
      ] },
      { chapter: 'Listen and sing along.', chapterZh: '听一听，一起唱。', pages: [
        { text: 'Come, come, come to the circus, you and you and you!', textZh: '来，来，来马戏团，你、你、还有你！' },
        { text: 'Mom and Dad, Brother, Sister, come to the circus, too!', textZh: '爸爸妈妈、哥哥姐姐，也来马戏团吧！' },
        { text: 'Aunt and Uncle and my cousins, come to the circus, too!', textZh: '叔叔阿姨和我的表亲，也来马戏团吧！' },
        { text: 'Grandpa, Grandma, yes, you too, come to the circus, too!', textZh: '爷爷奶奶，对，还有你们，也来马戏团吧！' },
      ] },
    ],
  },
  '3-2': {
    title: 'More Family',
    sections: [
      { chapter: 'Review.', chapterZh: '复习。', pages: [
        { text: 'grandma', textZh: '奶奶' },
        { text: 'grandpa', textZh: '爷爷' },
        { text: 'dad', textZh: '爸爸' },
        { text: 'mom', textZh: '妈妈' },
      ] },
      { chapter: 'Focus on: more family words.', chapterZh: '重点词汇：更多家庭成员。', pages: [
        { text: 'aunt', textZh: '阿姨／姑妈' },
        { text: 'uncle', textZh: '叔叔／舅舅' },
        { text: 'brother', textZh: '兄弟' },
        { text: 'sister', textZh: '姐妹' },
        { text: 'cousins', textZh: '表／堂兄弟姐妹' },
      ] },
      { chapter: 'Learn the key sentence.', chapterZh: '重点句型。', pages: [
        { text: 'This is my uncle.', textZh: '这是我的叔叔。' },
        { text: 'This is my aunt.', textZh: '这是我的阿姨。' },
        { text: 'This is my brother.', textZh: '这是我的兄弟。' },
        { text: 'This is my sister.', textZh: '这是我的姐妹。' },
        { text: 'This is my cousin.', textZh: '这是我的表兄弟姐妹。' },
      ] },
      { chapter: 'Do a role-play.', chapterZh: '来玩角色扮演。', pages: [
        { text: 'Who is this?', textZh: '这是谁？' },
        { text: 'This is my aunt.', textZh: '这是我的阿姨。' },
        { text: 'This is my sister.', textZh: '这是我的姐妹。' },
        { text: 'This is my uncle.', textZh: '这是我的叔叔。' },
        { text: 'This is my brother.', textZh: '这是我的兄弟。' },
        { text: 'This is my cousin.', textZh: '这是我的表兄弟姐妹。' },
      ] },
      { chapter: 'Listen and sing along.', chapterZh: '听一听，一起唱。', pages: [
        { text: 'Come, come, come to the circus, you and you and you!', textZh: '来，来，来马戏团，你、你、还有你！' },
        { text: 'Aunt and Uncle and my cousins, come to the circus, too!', textZh: '叔叔阿姨和我的表亲，也来马戏团吧！' },
        { text: 'Grandpa, Grandma, yes, you too, come to the circus, too!', textZh: '爷爷奶奶，对，还有你们，也来马戏团吧！' },
      ] },
    ],
  },
  '3-3': {
    title: 'Bam Bam in the Tree',
    sections: [
      { chapter: 'Review.', chapterZh: '复习。', pages: [
        { text: 'grandpa', textZh: '爷爷' },
        { text: 'brother', textZh: '兄弟' },
        { text: 'grandma', textZh: '奶奶' },
        { text: 'sister', textZh: '姐妹' },
      ] },
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'What do you see?', textZh: '你看到了什么？' },
        { text: 'Jump! Jump! Jump!', textZh: '跳！跳！跳！' },
      ] },
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'This is Ruby. This is Bam Bam.', textZh: '这是 Ruby。这是 Bam Bam。' },
        { text: 'Bam Bam is in the tree. The tree is very big.', textZh: 'Bam Bam 在树上。树很大。' },
        { text: 'This is my cat, Bam Bam.', textZh: '这是我的猫，Bam Bam。' },
        { text: 'This is Grandpa. Grandpa jumps.', textZh: '这是爷爷。爷爷跳。' },
        { text: 'This is Dad. Dad jumps.', textZh: '这是爸爸。爸爸跳。' },
        { text: 'These are Ruby’s cousins. The cousins jump.', textZh: '这些是 Ruby 的表亲。表亲们跳。' },
      ] },
      { chapter: 'Activity 1: fill in the blank.', chapterZh: '活动一：填空。', pages: [
        { text: 'This is my grandpa.', textZh: '这是我的爷爷。' },
        { text: 'This is my dad. He jumps onto Grandpa.', textZh: '这是我的爸爸。他跳到爷爷身上。' },
        { text: 'These are my cousins. They jump onto Dad.', textZh: '这些是我的表亲。他们跳到爸爸身上。' },
      ] },
      { chapter: 'Show Time.', chapterZh: '展示时间。', pages: [
        { text: 'Hello, everyone! I’m ...', textZh: '大家好！我是……' },
        { text: 'This is my ... (These are my ...)', textZh: '这是我的……（这些是我的……）' },
      ] },
    ],
  },
  '3-4': {
    title: 'We Get Bam Bam!',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'How many people do you see?', textZh: '你看到几个人？' },
      ] },
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'This is Grandma. Grandma jumps. She jumps onto Ruby’s cousins.', textZh: '这是奶奶。奶奶跳。她跳到 Ruby 的表亲身上。' },
        { text: 'Grandma, the cousins, Dad and Grandpa have an idea.', textZh: '奶奶、表亲、爸爸和爷爷有了主意。' },
        { text: 'Jump, Ruby!', textZh: '跳，Ruby！' },
        { text: 'Jump, Jump, Jump! Hello, Bam Bam!', textZh: '跳、跳、跳！你好，Bam Bam！' },
        { text: 'Here’s Bam Bam the cat. Now Bam Bam is happy.', textZh: 'Bam Bam 猫回来了。现在 Bam Bam 开心了。' },
        { text: 'Thank you, everyone!', textZh: '谢谢大家！' },
      ] },
      { chapter: 'Activity 1: read and match.', chapterZh: '活动一：读一读，连一连。', pages: [
        { text: 'This is my dad.', textZh: '这是我的爸爸。' },
        { text: 'This is my grandma.', textZh: '这是我的奶奶。' },
        { text: 'This is my grandpa.', textZh: '这是我的爷爷。' },
        { text: 'These are my cousins.', textZh: '这些是我的表亲。' },
      ] },
      { chapter: 'Activity 2: true or false.', chapterZh: '活动二：判断对错。', pages: [
        { text: 'Grandma jumps onto Ruby’s cousins.', textZh: '奶奶跳到 Ruby 的表亲身上。' },
        { text: 'Ruby jumps onto grandma.', textZh: 'Ruby 跳到奶奶身上。' },
        { text: 'The family can get the cat.', textZh: '一家人救下了猫。' },
        { text: 'The cat is happy.', textZh: '猫很开心。' },
      ] },
      { chapter: 'Show Time.', chapterZh: '展示时间。', pages: [
        { text: 'Hello, everyone! I’m ...', textZh: '大家好！我是……' },
        { text: 'Look! This is my family.', textZh: '看！这是我的家人。' },
        { text: 'This is my ... I love my family.', textZh: '这是我的……我爱我的家人。' },
      ] },
    ],
  },
  '3-5': {
    title: 'This Is / These Are',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'Say the family members as fast as you can.', textZh: '尽快说出家庭成员。' },
        { text: 'dad, grandma, cousins, grandpa', textZh: '爸爸、奶奶、表亲、爷爷' },
      ] },
      { chapter: 'Grammar: singular and plural.', chapterZh: '语法：单数与复数。', pages: [
        { text: 'This is my cousin.', textZh: '这是我的表兄弟姐妹（一个）。' },
        { text: 'These are my cousins.', textZh: '这些是我的表兄弟姐妹。' },
        { text: 'What are the differences?', textZh: '它们有什么不同？' },
      ] },
      { chapter: 'Grammar practice.', chapterZh: '语法练习。', pages: [
        { text: 'These are my cousins.', textZh: '这些是我的表亲。' },
        { text: 'This is my cousin.', textZh: '这是我的表亲。' },
        { text: 'These are my cats.', textZh: '这些是我的猫。' },
        { text: 'This is my cat.', textZh: '这是我的猫。' },
      ] },
      { chapter: 'Activity 1: match.', chapterZh: '活动一：连线。', pages: [
        { text: 'This is my grandma.', textZh: '这是我的奶奶。' },
        { text: 'This is my grandpa.', textZh: '这是我的爷爷。' },
        { text: 'These are my cousins.', textZh: '这些是我的表亲。' },
        { text: 'This is my dad.', textZh: '这是我的爸爸。' },
      ] },
      { chapter: 'Activity 2: choose fast.', chapterZh: '活动二：快速选择。', pages: [
        { text: 'This is my grandma. / These are my grandma.', textZh: '这是我的奶奶。／这些是我的奶奶。' },
        { text: 'This is my dad. / These are my dad.', textZh: '这是我的爸爸。／这些是我的爸爸。' },
        { text: 'This is my sisters. / These are my sisters.', textZh: '这是我的姐妹。／这些是我的姐妹。' },
        { text: 'This is my mom. / These are my mom.', textZh: '这是我的妈妈。／这些是我的妈妈。' },
      ] },
    ],
  },
  '3-6': {
    title: 'He Has / She Has',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'What do you have?', textZh: '你有什么？' },
        { text: 'Look, she has big eyes and long hair.', textZh: '看，她有一双大眼睛和一头长发。' },
        { text: 'Look, he has small eyes.', textZh: '看，他有一双小眼睛。' },
      ] },
      { chapter: 'Focus on: descriptive words.', chapterZh: '重点词汇：外貌描写。', pages: [
        { text: 'long hair', textZh: '长发' },
        { text: 'short hair', textZh: '短发' },
        { text: 'big eyes', textZh: '大眼睛' },
        { text: 'small eyes', textZh: '小眼睛' },
        { text: 'gray hair', textZh: '灰白头发' },
        { text: 'blond hair', textZh: '金发' },
      ] },
      { chapter: 'Activity 2: complete the table.', chapterZh: '活动二：填表。', pages: [
        { text: 'Grandpa has ...', textZh: '爷爷有……' },
        { text: 'Grandma has ...', textZh: '奶奶有……' },
        { text: 'blue eyes, green eyes, gray hair, blond hair, big eyes, small eyes, short hair, long hair', textZh: '蓝眼睛、绿眼睛、灰发、金发、大眼睛、小眼睛、短发、长发' },
      ] },
      { chapter: 'Grammar: he / she has.', chapterZh: '语法：他／她有。', pages: [
        { text: 'She has blond hair.', textZh: '她有一头金发。' },
        { text: 'He has small eyes.', textZh: '他有一双小眼睛。' },
        { text: 'She has big eyes. / He has big eyes.', textZh: '她有一双大眼睛。／他有一双大眼睛。' },
      ] },
      { chapter: 'Activity 3 & Show Time.', chapterZh: '活动三与展示时间。', pages: [
        { text: '1. She has long hair. 2. He has big eyes.', textZh: '1. 她有一头长发。2. 他有一双大眼睛。' },
        { text: 'My teacher is ... She / He has ...', textZh: '我的老师是……她／他有……' },
      ] },
    ],
  },
  '3-7': {
    title: 'Phonics: /er/',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: 'What does grandpa / grandma look like?', textZh: '爷爷／奶奶长什么样？' },
        { text: 'Grandpa has ... Grandma has ...', textZh: '爷爷有……奶奶有……' },
      ] },
      { chapter: 'Chant Time.', chapterZh: 'chant 时间。', pages: [
        { text: 'Er says er, er, er, er.', textZh: 'er 发 er 的音。' },
        { text: 'This is my brother, this is my sister, er, er, er.', textZh: '这是我的兄弟，这是我的姐妹，er，er，er。' },
      ] },
      { chapter: 'Learn and read the words.', chapterZh: '学习并拼读单词。', pages: [
        { text: 'brother', textZh: '兄弟' },
        { text: 'sister', textZh: '姐妹' },
        { text: 'teacher', textZh: '老师' },
        { text: 'eraser', textZh: '橡皮' },
        { text: 'spider', textZh: '蜘蛛' },
        { text: 'flower', textZh: '花' },
      ] },
      { chapter: 'Activity 1: circle the /er/ sound.', chapterZh: '活动一：圈出 /er/ 音。', pages: [
        { text: 'teacher, sister, artist, eraser, spider, flower, brother', textZh: '老师、姐妹、艺术家、橡皮、蜘蛛、花、兄弟' },
      ] },
      { chapter: 'Summary.', chapterZh: '小结。', pages: [
        { text: 'flower, sister, teacher, eraser, spider, brother', textZh: '花、姐妹、老师、橡皮、蜘蛛、兄弟' },
      ] },
    ],
  },
  '3-8': {
    title: 'CLIL: Twins',
    sections: [
      { chapter: 'Lead in.', chapterZh: '导入。', pages: [
        { text: 'How many babies do you see? What color are their eyes?', textZh: '你看到几个宝宝？他们的眼睛是什么颜色？' },
      ] },
      { chapter: 'Focus on: same or different.', chapterZh: '重点：一样还是不一样。', pages: [
        { text: 'They are different.', textZh: '他们不一样。' },
        { text: 'They are similar.', textZh: '他们很像。' },
        { text: 'They are identical.', textZh: '他们一模一样。' },
        { text: 'They are twins.', textZh: '他们是双胞胎。' },
      ] },
      { chapter: 'Read the passage.', chapterZh: '读短文。', pages: [
        { text: 'I’m Alice. This is my family.', textZh: '我是 Alice。这是我的家人。' },
        { text: 'My mom has brown eyes. My dad has blue eyes. They’re different.', textZh: '我妈妈有棕色眼睛。我爸爸有蓝色眼睛。他们不一样。' },
        { text: 'I have brown hair and brown eyes. I look like my mom. We’re similar!', textZh: '我有棕色头发和棕色眼睛。我像妈妈。我们很像！' },
        { text: 'I have two sisters. Lily has blond hair. Anna has blond hair, too! They’re identical! They’re twins!', textZh: '我有两个姐妹。Lily 有金发。Anna 也有金发！她们一模一样！她们是双胞胎！' },
      ] },
      { chapter: 'Label the picture.', chapterZh: '给图片贴标签。', pages: [
        { text: 'Alice, twins, mom, dad', textZh: 'Alice、双胞胎、妈妈、爸爸' },
      ] },
      { chapter: 'Activity 1: say fast.', chapterZh: '活动一：快速说。', pages: [
        { text: 'different / similar / identical', textZh: '不一样／很像／一模一样' },
      ] },
    ],
  },
  '3-9': {
    title: 'Practice',
    sections: [
      { chapter: 'Listen and read.', chapterZh: '听一听，读一读。', pages: [
        { text: 'This is my brother, my sister and me.', textZh: '这是我的兄弟、姐妹和我。' },
        { text: 'This is my teacher and her family.', textZh: '这是我的老师和她的家人。' },
        { text: 'The clown has a flower. It’s yellow and blue.', textZh: '小丑有一朵花。它是黄色和蓝色的。' },
        { text: 'He has a balloon and a spider, too!', textZh: '他还有一个气球和一只蜘蛛！' },
      ] },
      { chapter: 'Choose and say.', chapterZh: '选一选，说一说。', pages: [
        { text: 'This is my dad. These are my uncles.', textZh: '这是我的爸爸。这些是我的叔叔们。' },
        { text: 'This is my mom. These are my aunts.', textZh: '这是我的妈妈。这些是我的阿姨们。' },
        { text: 'This is my sister. These are my aunts.', textZh: '这是我的姐妹。这些是我的阿姨们。' },
        { text: 'This is my brother. These are my cousins.', textZh: '这是我的兄弟。这些是我的表亲。' },
      ] },
      { chapter: 'Say the sentences.', chapterZh: '说出这些句子。', pages: [
        { text: 'These are my cousins.', textZh: '这些是我的表亲。' },
        { text: 'She has big eyes. She has black eyes.', textZh: '她有一双大眼睛。她有一双黑眼睛。' },
        { text: 'He has blond hair. He has short hair.', textZh: '他有一头金发。他有一头短发。' },
        { text: 'They are twins. They are identical.', textZh: '他们是双胞胎。他们一模一样。' },
        { text: 'This is my friend and me. We are different.', textZh: '这是我的朋友和我。我们不一样。' },
      ] },
      { chapter: 'Show time.', chapterZh: '展示时间。', pages: [
        { text: 'Describe your mom. My mother is ... She has ...', textZh: '描述你的妈妈。我的妈妈是……她有……' },
      ] },
    ],
  },
  '3-10': {
    title: 'Secret Agent 10',
    sections: [
      { chapter: 'Task: describe him.', chapterZh: '任务：描述他。', pages: [
        { text: 'Who’s this?', textZh: '这是谁？' },
        { text: 'What does he look like?', textZh: '他长什么样？' },
        { text: 'He has ...', textZh: '他有……' },
      ] },
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'Where are Monty and Lola?', textZh: 'Monty 和 Lola 在哪里？' },
        { text: 'Who is Secret Agent 8? Who is Secret Agent 9?', textZh: '8 号特工是谁？9 号特工是谁？' },
        { text: 'What does Secret Agent 10 look like?', textZh: '10 号特工长什么样？' },
        { text: 'What do Monty and Lola see?', textZh: 'Monty 和 Lola 看见了什么？' },
      ] },
      { chapter: 'Activity 1: circle the words.', chapterZh: '活动一：圈出描写词。', pages: [
        { text: 'blond hair, brown eyes, blue eyes, a black hat, big feet, a white hat, black hair', textZh: '金发、棕眼睛、蓝眼睛、黑帽子、大脚、白帽子、黑头发' },
      ] },
      { chapter: 'Activity 2: fill in the blanks.', chapterZh: '活动二：填空。', pages: [
        { text: 'Monty and Lola are in the classroom at school.', textZh: 'Monty 和 Lola 在学校教室里。' },
        { text: 'I’m Secret Agent 8. You’re Secret Agent 9.', textZh: '我是 8 号特工。你是 9 号特工。' },
        { text: 'He has brown hair and blue eyes.', textZh: '他有棕色头发和蓝色眼睛。' },
      ] },
      { chapter: 'Activity 3 & Show Time.', chapterZh: '活动三与展示时间。', pages: [
        { text: 'Monty and Lola are in the classroom at school.', textZh: 'Monty 和 Lola 在学校教室里。' },
        { text: 'Monty and Lola see a white cat.', textZh: 'Monty 和 Lola 看见一只白猫。' },
        { text: 'Now Monty and Lola are in a city.', textZh: '现在 Monty 和 Lola 来到一座城市。' },
        { text: 'Lola opens the book. Monty and Lola read.', textZh: 'Lola 打开书。Monty 和 Lola 读起来。' },
        { text: 'Hello, everyone! I’m ... This is Grandpa. He has ... This is Grandma. She has ...', textZh: '大家好！我是……这是爷爷。他有……这是奶奶。她有……' },
      ] },
    ],
  },
  '3-11': {
    title: 'Who Is Agent 10?',
    sections: [
      { chapter: 'Task.', chapterZh: '任务。', pages: [
        { text: 'Who is Secret Agent 10?', textZh: '10 号特工是谁？' },
        { text: 'What does Secret Agent 10 look like?', textZh: '10 号特工长什么样？' },
      ] },
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'Who do Monty and Lola see?', textZh: 'Monty 和 Lola 看见了谁？' },
        { text: 'Who left the message?', textZh: '是谁留下的消息？' },
        { text: 'Who is Secret Agent 10?', textZh: '谁是 10 号特工？' },
      ] },
      { chapter: 'Activity 1: read and match.', chapterZh: '活动一：读一读，连一连。', pages: [
        { text: 'He has brown hair and blue eyes.', textZh: '他有棕色头发和蓝色眼睛。' },
        { text: 'She has blond hair and green eyes.', textZh: '她有金发和绿眼睛。' },
        { text: 'He has black hair and a white hat.', textZh: '他有黑头发和一顶白帽子。' },
      ] },
      { chapter: 'Activity 2: true or false.', chapterZh: '活动二：判断对错。', pages: [
        { text: 'They see small feet.', textZh: '他们看到一双小脚。' },
        { text: 'She has black hair and blue eyes.', textZh: '她有黑头发和蓝眼睛。' },
        { text: 'Mr. Sonic is Secret Agent 10.', textZh: 'Sonic 老师是 10 号特工。' },
        { text: 'This message is from Mr. Sonic.', textZh: '这条消息来自 Sonic 老师。' },
      ] },
      { chapter: 'Show Time.', chapterZh: '展示时间。', pages: [
        { text: 'Draw and give a description of Secret Agent 11.', textZh: '画一画并描述 11 号特工。' },
        { text: 'Hello, everyone! I’m ... Look! This is Secret Agent 11. He / She has ...', textZh: '大家好！我是……看！这是 11 号特工。他／她有……' },
      ] },
    ],
  },
}

// ===================== Sentence Frames（句型框架卡） =====================
// 从 Language Focus 课（L5 单复数、L6 外貌描写）抽取；unitSlug = 'monty-the-clown'。
export const u3_frames: SentenceFrame[] = [
  // ---- Lesson 1: Family at the Circus（从本课真实句子 'This is my grandma.' 挖空） ----
  {
    id: 'l1-monty-the-clown-1-this-grandma',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['grandma', 'dad', 'grandpa', 'mom'],
        answer: 0,
        zhOptions: ['这是我的奶奶。', '这是我的爸爸。', '这是我的爷爷。', '这是我的妈妈。'],
      },
    ],
    zh: '这是我的奶奶。',
    hint: '指着家人介绍：This is my ...',
    unitSlug: 'monty-the-clown',
    lessonId: 1,
  },
  // ---- Lesson 2: More Family（'This is my uncle.'） ----
  {
    id: 'l1-monty-the-clown-2-this-uncle',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['uncle', 'aunt', 'brother', 'sister'],
        answer: 0,
        zhOptions: ['这是我的叔叔。', '这是我的阿姨。', '这是我的兄弟。', '这是我的姐妹。'],
      },
    ],
    zh: '这是我的叔叔。',
    hint: '介绍更多家庭成员',
    unitSlug: 'monty-the-clown',
    lessonId: 2,
  },
  // ---- Lesson 3: Bam Bam in the Tree（'Grandpa jumps.'） ----
  {
    id: 'l1-monty-the-clown-3-who-jumps',
    pattern: '___ jumps.',
    blanks: [
      {
        options: ['Grandpa', 'Dad', 'Grandma', 'Bam Bam'],
        answer: 0,
        zhOptions: ['爷爷跳。', '爸爸跳。', '奶奶跳。', 'Bam Bam 跳。'],
      },
    ],
    zh: '爷爷跳。',
    hint: '救猫时谁先跳起来？',
    unitSlug: 'monty-the-clown',
    lessonId: 3,
  },
  // ---- Lesson 4: We Get Bam Bam!（'Now Bam Bam is happy.'） ----
  {
    id: 'l1-monty-the-clown-4-bam-bam-happy',
    pattern: 'Now Bam Bam is ___.',
    blanks: [
      {
        options: ['happy', 'sad', 'high', 'big'],
        answer: 0,
        zhOptions: ['现在 Bam Bam 开心了。', '现在 Bam Bam 难过了。', '现在 Bam Bam 很高。', '现在 Bam Bam 很大。'],
      },
    ],
    zh: '现在 Bam Bam 开心了。',
    hint: '故事结局：Bam Bam 得救了，心情怎样？',
    unitSlug: 'monty-the-clown',
    lessonId: 4,
  },
  // ---- Lesson 5: This is / These are ----
  {
    id: 'l1-monty-the-clown-5-this-cousin',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['cousin', 'grandma', 'dad', 'brother'],
        answer: 0,
        zhOptions: ['这是我的表兄弟姐妹。', '这是我的奶奶。', '这是我的爸爸。', '这是我的兄弟。'],
      },
    ],
    zh: '这是我的表兄弟姐妹。',
    hint: '单数：介绍一个家人（this is）',
    unitSlug: 'monty-the-clown',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-clown-5-these-cousins',
    pattern: 'These are my ___.',
    blanks: [
      {
        options: ['cousins', 'grandma', 'dad', 'sister'],
        answer: 0,
        zhOptions: ['这些是我的表兄弟姐妹。', '这是我的奶奶。', '这是我的爸爸。', '这是我的姐妹。'],
      },
    ],
    zh: '这些是我的表兄弟姐妹。',
    hint: '复数：介绍多个家人（these are）',
    unitSlug: 'monty-the-clown',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-clown-5-this-grandma',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['grandma', 'grandpa', 'aunt', 'uncle'],
        answer: 0,
        zhOptions: ['这是我的奶奶。', '这是我的爷爷。', '这是我的阿姨。', '这是我的叔叔。'],
      },
    ],
    zh: '这是我的奶奶。',
    hint: '介绍一位长辈',
    unitSlug: 'monty-the-clown',
    lessonId: 5,
  },
  {
    id: 'l1-monty-the-clown-5-this-grandpa',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['grandpa', 'grandma', 'dad', 'uncle'],
        answer: 0,
        zhOptions: ['这是我的爷爷。', '这是我的奶奶。', '这是我的爸爸。', '这是我的叔叔。'],
      },
    ],
    zh: '这是我的爷爷。',
    hint: '介绍一位长辈',
    unitSlug: 'monty-the-clown',
    lessonId: 5,
  },
  {
    // 原卡拼出 "This is my brother."（L5 无此句）。保留 id 不改，内容改为从 L5 真实句 'This is my dad.' 挖空。
    id: 'l1-monty-the-clown-5-this-brother',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['dad', 'grandma', 'grandpa', 'cousin'],
        answer: 0,
        zhOptions: ['这是我的爸爸。', '这是我的奶奶。', '这是我的爷爷。', '这是我的表兄弟姐妹。'],
      },
    ],
    zh: '这是我的爸爸。',
    hint: '单数：介绍一位家人（this is）',
    unitSlug: 'monty-the-clown',
    lessonId: 5,
  },
  // ---- Lesson 6: He has / She has ----
  {
    // 原卡拼出 "He has big eyes."（L6 无此句）。保留 id 不改，内容改为从 L6 真实句 'He has small eyes.' 挖空。
    id: 'l1-monty-the-clown-6-he-big-eyes',
    pattern: 'He has ___.',
    blanks: [
      {
        options: ['small eyes', 'big eyes', 'long hair', 'gray hair'],
        answer: 0,
        zhOptions: ['他有一双小眼睛。', '他有一双大眼睛。', '他有一头长发。', '他有一头灰白头发。'],
      },
    ],
    zh: '他有一双小眼睛。',
    hint: '描述男生外貌（he has）',
    unitSlug: 'monty-the-clown',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-clown-6-she-long-hair',
    pattern: 'She has ___.',
    blanks: [
      {
        options: ['long hair', 'short hair', 'big eyes', 'blond hair'],
        answer: 0,
        zhOptions: ['她有一头长发。', '她有一头短发。', '她有一双大眼睛。', '她有一头金发。'],
      },
    ],
    zh: '她有一头长发。',
    hint: '描述女生外貌（she has）',
    unitSlug: 'monty-the-clown',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-clown-6-he-gray-hair',
    pattern: 'He has ___.',
    blanks: [
      {
        options: ['gray hair', 'blond hair', 'big eyes', 'small eyes'],
        answer: 0,
        zhOptions: ['他有一头灰白头发。', '他有一头金发。', '他有一双大眼睛。', '他有一双小眼睛。'],
      },
    ],
    zh: '他有一头灰白头发。',
    hint: '描述头发颜色（he has）',
    unitSlug: 'monty-the-clown',
    lessonId: 6,
  },
  {
    id: 'l1-monty-the-clown-6-she-blond-hair',
    pattern: 'She has ___.',
    blanks: [
      {
        options: ['blond hair', 'black hair', 'small eyes', 'long hair'],
        answer: 0,
        zhOptions: ['她有一头金发。', '她有一头黑发。', '她有一双小眼睛。', '她有一头长发。'],
      },
    ],
    zh: '她有一头金发。',
    hint: '描述头发颜色（she has）',
    unitSlug: 'monty-the-clown',
    lessonId: 6,
  },
  // ---- Lesson 7: Phonics /er/（'This is my teacher.'） ----
  {
    id: 'l1-monty-the-clown-7-this-teacher',
    pattern: 'This is my ___.',
    blanks: [
      {
        options: ['teacher', 'brother', 'sister', 'eraser'],
        answer: 0,
        zhOptions: ['这是我的老师。', '这是我的兄弟。', '这是我的姐妹。', '这是我的橡皮。'],
      },
    ],
    zh: '这是我的老师。',
    hint: '四个选项都含 /er/ 音，读一读',
    unitSlug: 'monty-the-clown',
    lessonId: 7,
  },
  // ---- Lesson 8: CLIL Twins（'They are identical.'） ----
  {
    id: 'l1-monty-the-clown-8-they-identical',
    pattern: 'They are ___.',
    blanks: [
      {
        options: ['identical', 'different', 'similar', 'twins'],
        answer: 0,
        zhOptions: ['他们一模一样。', '他们不一样。', '他们很像。', '他们是双胞胎。'],
      },
    ],
    zh: '他们一模一样。',
    hint: '双胞胎科学：不一样／很像／一模一样',
    unitSlug: 'monty-the-clown',
    lessonId: 8,
  },
  // ---- Lesson 9: Practice（'He has a balloon and a spider.'） ----
  {
    id: 'l1-monty-the-clown-9-balloon-spider',
    pattern: 'He has a balloon and a ___.',
    blanks: [
      {
        options: ['spider', 'flower', 'clown', 'teacher'],
        answer: 0,
        zhOptions: ['他有一个气球和一只蜘蛛。', '他有一个气球和一朵花。', '他有一个气球和一个小丑。', '他有一个气球和一位老师。'],
      },
    ],
    zh: '他有一个气球和一只蜘蛛。',
    hint: '练习 has：他还有什么？',
    unitSlug: 'monty-the-clown',
    lessonId: 9,
  },
  // ---- Lesson 10: Secret Agent 10（'He has brown hair and blue eyes.'） ----
  {
    id: 'l1-monty-the-clown-10-brown-blue-eyes',
    pattern: 'He has brown hair and ___.',
    blanks: [
      {
        options: ['blue eyes', 'brown eyes', 'green eyes', 'black eyes'],
        answer: 0,
        zhOptions: ['他有棕色头发和蓝色眼睛。', '他有棕色头发和棕色眼睛。', '他有棕色头发和绿色眼睛。', '他有棕色头发和黑眼睛。'],
      },
    ],
    zh: '他有棕色头发和蓝色眼睛。',
    hint: '描述特工：头发颜色 + 眼睛颜色',
    unitSlug: 'monty-the-clown',
    lessonId: 10,
  },
  // ---- Lesson 11: Who Is Agent 10?（'He has big feet.'） ----
  {
    id: 'l1-monty-the-clown-11-big-feet',
    pattern: 'He has ___.',
    blanks: [
      {
        options: ['big feet', 'brown hair', 'black hair', 'blond hair'],
        answer: 0,
        zhOptions: ['他有一双大脚。', '他有棕色头发。', '他有黑头发。', '他有金发。'],
      },
    ],
    zh: '他有一双大脚。',
    hint: '10 号特工最明显的特征',
    unitSlug: 'monty-the-clown',
    lessonId: 11,
  },
]

// ===================== Reading Passages（连贯小故事） =====================
export const u3_reading: Record<string, ReadingPassage> = {
  '3-1': {
    title: 'Family at the Circus',
    titleZh: '马戏团里的家人',
    paragraphs: [
      [
        { en: `Today my big family goes to the circus.`, zh: '今天，我们全家去马戏团。' },
        { en: `Mom has a red balloon for me.`, zh: '妈妈给我拿来一只红气球。' },
        { en: `Dad has a big yellow bag, too.`, zh: '爸爸拎着一个黄色的大包。' },
        { en: `"Come to the circus!" says Grandma.`, zh: '“来马戏团吧！”奶奶喊道。' },
      ],
      [
        { en: `We look at the people.`, zh: '我们数一数在场的人。' },
        { en: `"How many people are there at the circus?" I ask.`, zh: '“马戏团里有多少人呀？”我问。' },
        { en: `Mom, Dad and Grandma are here.`, zh: '妈妈、爸爸和奶奶都在这儿。' },
        { en: `But where is Grandpa?`, zh: '可是爷爷去哪儿了？' },
        { en: `"Who is this?" I say.`, zh: '“这是谁呀？”我说。' },
      ],
      [
        { en: `A tall clown waves at us.`, zh: '一个高个子小丑朝我们挥手。' },
        { en: `"It's Grandpa!" we all laugh.`, zh: '“是爷爷！”我们都笑了。' },
        { en: `Now the circus feels like home.`, zh: '这会儿，马戏团也有了家的味道。' },
      ],
    ],
  },
  '3-2': {
    title: 'More Family at the Circus',
    titleZh: '马戏团里来了更多家人',
    paragraphs: [
      [
        { en: `We wait at the circus with Mom and Dad.`, zh: '我们和爸爸妈妈在马戏团里等。' },
        { en: `Aunt waves from a red bus.`, zh: '阿姨从一辆红色巴士上朝我们挥手。' },
        { en: `Uncle carries a big cake.`, zh: '叔叔抱着一个大蛋糕。' },
        { en: `"This is my aunt!" I tell Ruby.`, zh: '“这是我的阿姨！”我告诉 Ruby。' },
        { en: `"This is my uncle!" she says.`, zh: '“这是我的叔叔！”她说。' },
      ],
      [
        { en: `My brother and sister run to them.`, zh: '哥哥姐姐朝他们跑过去。' },
        { en: `But I cannot see my cousins.`, zh: '可我还没看见表兄妹们。' },
        { en: `"Where are my cousins?" I ask.`, zh: '“我的表兄妹们在哪儿呀？”我问。' },
        { en: `Suddenly a big box opens.`, zh: '忽然，一只大箱子打开了。' },
        { en: `My cousins jump out with balloons.`, zh: '表兄妹们抱着气球跳了出来。' },
      ],
      [
        { en: `"These are my cousins!" I laugh.`, zh: '“这些就是我的表兄妹！”我笑起来。' },
        { en: `Now all my family goes in together.`, zh: '现在，全家人一起走进去啦。' },
      ],
    ],
  },
  '3-3': {
    title: 'Bam Bam in the Big Tree',
    titleZh: '大树上的 Bam Bam',
    paragraphs: [
      [
        { en: `Ruby has a little cat, Bam Bam.`, zh: 'Ruby 有一只小猫，叫 Bam Bam。' },
        { en: `The cat runs up a big tree.`, zh: '小猫爬上了一棵大树。' },
        { en: `Now Bam Bam is very high.`, zh: '这下 Bam Bam 在好高好高的地方。' },
        { en: `"Come down, little cat!" says Ruby.`, zh: '“下来吧，小猫咪！”Ruby 喊。' },
      ],
      [
        { en: `Grandpa and Dad jump.`, zh: '爷爷和爸爸一起跳。' },
        { en: `The cousins jump onto Dad.`, zh: '表兄妹们跳到爸爸身上。' },
        { en: `Bam Bam looks down at us.`, zh: 'Bam Bam 低头看看我们。' },
        { en: `"Jump, Bam Bam, jump!" they say.`, zh: '“跳呀，Bam Bam，跳呀！”他们说。' },
      ],
      [
        { en: `The cat jumps into the hands of Dad.`, zh: '小猫跳进爸爸的手里。' },
        { en: `Ruby holds Bam Bam and smiles.`, zh: 'Ruby 抱着 Bam Bam，笑了。' },
        { en: `"The tree is big, but we are a team," I say.`, zh: '“树好大，可我们是一队呀。”我说。' },
        { en: `Bam Bam is home again.`, zh: 'Bam Bam 又回家啦。' },
      ],
    ],
  },
  '3-4': {
    title: 'We Get Bam Bam!',
    titleZh: '我们救下 Bam Bam 啦！',
    paragraphs: [
      [
        { en: `Bam Bam is a small cat.`, zh: 'Bam Bam 是只小猫咪。' },
        { en: `The cat sits on a tall chair.`, zh: '小猫蹲在一把高椅子上。' },
        { en: `Ruby cannot get the cat.`, zh: 'Ruby 够不着小猫。' },
        { en: `"I have an idea," says Grandma.`, zh: '“我有个主意。”奶奶说。' },
      ],
      [
        { en: `Grandma puts a red ball near the chair.`, zh: '奶奶把一颗红球放到椅子旁。' },
        { en: `The cat looks at the ball.`, zh: '小猫盯着球看。' },
        { en: `"Jump, Bam Bam, jump!" we say.`, zh: '“跳呀，Bam Bam，跳呀！”我们喊。' },
        { en: `The cat jumps into the hands of Ruby.`, zh: '小猫跳进 Ruby 的手里。' },
      ],
      [
        { en: `Now Bam Bam is happy.`, zh: '这下 Bam Bam 开心了。' },
        { en: `Ruby holds the little cat.`, zh: 'Ruby 抱着小猫。' },
        { en: `"Thank you, Grandma! Thank you, everyone!" we all say.`, zh: '“谢谢奶奶！谢谢大家！”我们一齐说。' },
        { en: `Grandma smiles at her happy idea.`, zh: '奶奶望着这个让人开心的主意，笑了。' },
      ],
    ],
  },
  '3-5': {
    title: 'The Family Picture',
    titleZh: '一张全家福',
    paragraphs: [
      [
        { en: `Ruby draws a big family picture.`, zh: 'Ruby 画了一张大大的全家福。' },
        { en: `One cousin wears a red hat.`, zh: '一个表亲戴着红帽子。' },
        { en: `"This is my cousin," she tells Grandpa.`, zh: '“这是我的表亲。”她告诉爷爷。' },
        { en: `Grandpa smiles at the picture.`, zh: '爷爷对着画笑了。' },
      ],
      [
        { en: `But three cousins are behind the door.`, zh: '可还有三个表亲躲在门后。' },
        { en: `Grandma opens the door.`, zh: '奶奶把门打开。' },
        { en: `"These are my cousins!" Ruby says.`, zh: '“这些是我的表兄妹们！”Ruby 说。' },
        { en: `Dad brings three more chairs.`, zh: '爸爸又搬来三把椅子。' },
      ],
      [
        { en: `Now the cousins sit in the picture.`, zh: '现在，表兄妹们都坐进画里啦。' },
        { en: `"This is one. These are four cousins," says Dad.`, zh: '“这是一个，这些是四个表亲。”爸爸说。' },
        { en: `Grandma, Grandpa and Dad all laugh.`, zh: '奶奶、爷爷和爸爸都笑了。' },
        { en: `The big picture has every smile.`, zh: '这张大大的画里，装着每一张笑脸。' },
      ],
    ],
  },
  '3-6': {
    title: 'The Secret Picture',
    titleZh: '画像里的秘密朋友',
    paragraphs: [
      [
        { en: `Our teacher has a new game.`, zh: '老师带我们玩了一个新游戏。' },
        { en: `We draw a friend from a secret message.`, zh: '我们要照着秘密纸条画一位朋友。' },
        { en: `My message says, "She has long hair."`, zh: '我的纸条上写着：“她有长头发。”' },
        { en: `I draw big eyes, too.`, zh: '我还画了一双大眼睛。' },
      ],
      [
        { en: `"He has short hair and small eyes," says Ben.`, zh: '“他有短头发和小眼睛。”Ben 说。' },
        { en: `"She has blond hair," says Lily.`, zh: '“她有金发。”Lily 说。' },
        { en: `My picture has two faces now.`, zh: '这下，我的画里有了两张脸。' },
        { en: `But the secret friend is not here.`, zh: '可那位秘密朋友不在这儿。' },
        { en: `Who can it be?`, zh: '会是谁呢？' },
      ],
      [
        { en: `Our teacher comes to my desk.`, zh: '老师走到我的桌边。' },
        { en: `She has long hair, big eyes and blond hair, too.`, zh: '她有长头发、大眼睛，还有一头金发呢。' },
        { en: `"The secret friend is my teacher!" I say, and we smile.`, zh: '“秘密朋友就是老师呀！”我说完，我们都笑了。' },
      ],
    ],
  },
  '3-7': {
    title: 'Er, Er, Er!',
    titleZh: 'er、er、er！',
    paragraphs: [
      [
        { en: `My brother and sister are at school.`, zh: '我的哥哥和姐姐在学校里。' },
        { en: `Our teacher brings a red flower.`, zh: '老师带来一朵红花。' },
        { en: `A little spider sits on the flower.`, zh: '一只小蜘蛛停在花上。' },
        { en: `"Er says er, er, er!" we sing.`, zh: '“er 读 er、er、er！”我们唱起来。' },
      ],
      [
        { en: `I draw the flower and the spider.`, zh: '我把花和蜘蛛都画下来。' },
        { en: `But my eraser is not here.`, zh: '可我的橡皮不在这儿了。' },
        { en: `"Where is my eraser?" I ask.`, zh: '“我的橡皮在哪儿呀？”我问。' },
        { en: `My sister looks under the desk.`, zh: '姐姐往桌子底下瞧。' },
        { en: `My brother looks near the window.`, zh: '哥哥在窗边找。' },
      ],
      [
        { en: `Our teacher points at the red flower.`, zh: '老师指了指那朵红花。' },
        { en: `"Here's the eraser!" she says.`, zh: '“橡皮在这儿呢！”她说。' },
        { en: `We laugh. Er, er, er, what a day!`, zh: '我们都笑了。er、er、er，这一天真有意思！' },
      ],
    ],
  },
  '3-8': {
    title: 'My Twin Sisters',
    titleZh: '我的双胞胎姐姐',
    paragraphs: [
      [
        { en: `I make a family picture at school.`, zh: '我在学校画了一张全家福。' },
        { en: `My mom has brown eyes.`, zh: '妈妈有一双棕色眼睛。' },
        { en: `I have brown eyes, too.`, zh: '我也有一双棕色眼睛。' },
        { en: `"We're similar!" I say.`, zh: '“我们好像呀！”我说。' },
      ],
      [
        { en: `My sister Lily has a red flower.`, zh: '我的姐姐 Lily 拿着一朵红花。' },
        { en: `My sister Anna has a blue balloon.`, zh: '我的姐姐 Anna 拿着一只蓝气球。' },
        { en: `They have blond hair and blue eyes.`, zh: '她们都有金发和蓝眼睛。' },
        { en: `"They're identical!" says Dad.`, zh: '“她们一模一样！”爸爸说。' },
        { en: `"They are twins," he says.`, zh: '“她们是双胞胎。”他说。' },
      ],
      [
        { en: `But the twins are different, too.`, zh: '不过这对双胞胎也有不一样的地方。' },
        { en: `I draw the flower and the balloon.`, zh: '我把花和气球都画上去。' },
        { en: `"Now I can see my family," I say.`, zh: '“这下我看清我的一家人啦。”我说。' },
      ],
    ],
  },
  '3-9': {
    title: 'The Clown at School',
    titleZh: '学校里的小丑',
    paragraphs: [
      [
        { en: `Our teacher brings a clown to school.`, zh: '老师把一位小丑带到学校。' },
        { en: `The clown has a yellow flower.`, zh: '小丑拿着一朵黄花。' },
        { en: `He has a blue balloon, too.`, zh: '他还拿着一只蓝气球。' },
        { en: `A little spider sits on the balloon.`, zh: '一只小蜘蛛停在气球上。' },
      ],
      [
        { en: `Suddenly the spider is not there.`, zh: '忽然，小蜘蛛不见了。' },
        { en: `"Where is the spider?" I ask.`, zh: '“小蜘蛛去哪儿了？”我问。' },
        { en: `My brother looks in a red hat.`, zh: '哥哥往红帽子里瞧。' },
        { en: `My sister looks under the chair.`, zh: '姐姐在椅子下面找。' },
        { en: `The clown smiles at us.`, zh: '小丑朝我们笑。' },
      ],
      [
        { en: `Our teacher points at the yellow flower.`, zh: '老师指了指那朵黄花。' },
        { en: `"Here's the spider!" she says.`, zh: '“小蜘蛛在这儿呢！”她说。' },
        { en: `We all laugh with the clown.`, zh: '我们和小丑一起笑起来。' },
      ],
    ],
  },
  '3-10': {
    title: 'Secret Agent 10',
    titleZh: '10 号特工',
    paragraphs: [
      [
        { en: `Monty and Lola are in the classroom at school.`, zh: 'Monty 和 Lola 在学校教室里。' },
        { en: `They see a secret message.`, zh: '他们看到一封秘密留言。' },
        { en: `"Who is Secret Agent 10?" asks Lola.`, zh: '“谁是 10 号特工呀？”Lola 问。' },
        { en: `"What does he look like?" says Monty.`, zh: '“他长什么样呢？”Monty 说。' },
      ],
      [
        { en: `A girl has blond hair and brown eyes.`, zh: '一个女孩有金发和棕色眼睛。' },
        { en: `A boy has black hair and blue eyes.`, zh: '一个男孩有黑头发和蓝色眼睛。' },
        { en: `Lola opens the book and reads.`, zh: 'Lola 打开书读起来。' },
        { en: `"Look for a white hat," she says.`, zh: '“找一顶白帽子。”她说。' },
        { en: `"And big feet!" says Monty.`, zh: '“还有一双大脚！”Monty 说。' },
      ],
      [
        { en: `In a city, a man has a white hat and big feet.`, zh: '在城里，一个男人戴着白帽子，还有一双大脚。' },
        { en: `"It's Mr. Sonic, Secret Agent 10!" they say.`, zh: '“是 Sonic 老师，10 号特工！”他们说。' },
        { en: `The secret is here with them.`, zh: '秘密就留在他们这儿啦。' },
      ],
    ],
  },
  '3-11': {
    title: 'Who Is Agent 10?',
    titleZh: '10 号特工是谁？',
    paragraphs: [
      [
        { en: `Monty and Lola see a message at school.`, zh: 'Monty 和 Lola 在学校看到一条留言。' },
        { en: `"Who left the message?" asks Lola.`, zh: '“是谁留下的留言呀？”Lola 问。' },
        { en: `"Who is Secret Agent 10?" says Monty.`, zh: '“谁是 10 号特工呢？”Monty 说。' },
        { en: `They open the book and read.`, zh: '他们打开书读起来。' },
      ],
      [
        { en: `They see a man with brown hair and blue eyes.`, zh: '他们看见一个男人，有棕色头发和蓝眼睛。' },
        { en: `A girl has blond hair and green eyes.`, zh: '一个女孩有金发和绿色眼睛。' },
        { en: `A woman has black hair and small feet.`, zh: '一位女士有黑头发和一双小脚。' },
        { en: `"Look! This message is from Mr. Sonic," says Lola.`, zh: '“看！这条留言来自 Sonic 老师。”Lola 说。' },
      ],
      [
        { en: `Mr. Sonic comes near.`, zh: 'Sonic 老师走近了。' },
        { en: `He has big feet.`, zh: '他有一双大脚。' },
        { en: `Mr. Sonic is Secret Agent 10!`, zh: 'Sonic 老师就是 10 号特工！' },
        { en: `Now Monty and Lola know the answer.`, zh: '现在 Monty 和 Lola 知道答案啦。' },
      ],
    ],
  },
}

// ===================== Extension Topics（拓展词主题库） =====================
export const u3_ext: Record<string, ExtTopic> = {
  circus: {
    zh: '马戏团与表演',
    words: [
      w('clown', '小丑', '🤡'), w('circus', '马戏团', '🎪'), w('balloon', '气球', '🎈'),
      w('flower', '花', '🌸'), w('spider', '蜘蛛', '🕷️'), w('hat', '帽子', '🎩'),
      w('teacher', '老师', '👩‍🏫'), w('performance', '表演', '🎭'),
    ],
  },
  emotions: {
    zh: '情绪',
    words: [
      w('happy', '开心的', '😊'), w('sad', '难过的', '😢'), w('excited', '兴奋的', '🤩'),
      w('scared', '害怕的', '😨'), w('tired', '累的', '😴'), w('angry', '生气的', '😠'),
      w('surprised', '惊讶的', '😲'),
    ],
  },
  toys: {
    zh: '玩具',
    words: [
      w('toy', '玩具', '🧸'), w('ball', '球', '⚽'), w('doll', '洋娃娃', '🪆'),
      w('car', '小汽车', '🚗'), w('balloon', '气球', '🎈'), w('blocks', '积木', '🧱'),
      w('kite', '风筝', '🪁'), w('teddy bear', '泰迪熊', '🧸'),
    ],
  },
}

// ===================== Module（单元总入口） =====================
export const u3_module: Module = {
  id: 3,
  slug: 'monty-the-clown',
  title: 'Monty the Clown',
  titleZh: '蒙蒂小丑',
  emoji: '🤡',
  color: '#F5B017',
  colorSoft: '#FFF3C4',
  preview: {
    goals: [
      '认识家庭成员（爸爸妈妈、爷爷奶奶、叔叔阿姨、兄弟姐妹、表亲）',
      '用 This is my... / These are my... 介绍家人（单数与复数）',
      '用 He has... / She has... 描述外貌（头发、眼睛）',
      '读懂 Ruby 救猫与「10 号特工」小故事，学说自然拼读 /er/ 音',
      '了解「不一样／很像／一模一样」与双胞胎的科学概念',
    ],
    keyWords: 'mom, dad, grandma, grandpa, aunt, uncle, brother, sister, cousins, long hair, short hair, big eyes, small eyes, blond hair, different, similar, identical, twins, clown, circus, balloon',
    keySentences: "This is my dad. These are my cousins. He has big eyes. She has long hair. They are twins. Come to the circus!",
    tip: '预习时拿出家人合照，用英语边指边说 This is my...；读故事时模仿角色语气；练 /er/ 音可以读 brother、sister、teacher 这些词。',
  },
  lessons: u3_lessons[3],
  quiz: [
    { q: '爷爷用英语怎么说？👴', options: ['grandpa', 'grandma', 'dad'], answer: 0, explain: '爷爷是 grandpa，grandma 是奶奶。' },
    { q: '想说「这些是我的表兄弟姐妹」，应该用？👫', options: ['This is my cousin.', 'These are my cousins.', 'He is my cousin.'], answer: 1, explain: '复数用 These are my cousins。' },
    { q: '描述男生「他有一双大眼睛」，怎么说？👀', options: ['She has big eyes.', 'He has big eyes.', 'He has small eyes.'], answer: 1, explain: '男生用 He has...，大眼睛是 big eyes。' },
    { q: 'Lily 和 Anna 长得一模一样，她们是？👯', options: ['different', 'similar', 'identical / twins'], answer: 2, explain: '一模一样的双胞胎用 identical，她们是 twins（双胞胎）。' },
    { q: '小丑用英语怎么说？🤡', options: ['clown', 'circus', 'teacher'], answer: 0, explain: '小丑是 clown，circus 是马戏团。' },
  ],
}
