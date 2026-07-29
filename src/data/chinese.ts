// ============================================================
//  三年级上册语文（人教版 / 统编版）必背知识点数据
//  ------------------------------------------------------------
//  按单元组织，每单元含若干「课」：
//    · 课文重点段落 / 古诗词（知识点展示）
//    · 写字表生字（拼音 + 组词）（知识点展示）
//    · 语文园地·日积月累（俗语 / 成语 / 格言）（知识点展示）
//    · quiz 自测练习（背诵打卡 + 自测在页面层实现）
//  主题色采用「中国红」基调，各单元略有传统色变化。
// ============================================================
import type { ModuleTheme } from '@/utils/theme'

export interface Hanzi {
  /** 生字（会写字） */
  char: string
  /** 拼音（带声调） */
  pinyin: string
  /** 组词 */
  group: string[]
}

export interface Poem {
  title: string
  author: string
  dynasty: string
  /** 诗句逐句 */
  lines: string[]
}

export interface Passage {
  title?: string
  text: string
  /** 段落说明 / 背诵提示 */
  note?: string
}

export interface IdiomSet {
  title: string
  kind: 'idioms' | 'proverbs' | 'sayings'
  items: { term: string; source?: string }[]
}

export interface QuizItem {
  /** 题干 */
  q: string
  options: string[]
  /** 正确选项下标 */
  answer: number
  explain?: string
}

export interface ChineseLesson {
  id: number
  slug: string
  title: string
  emoji: string
  poems?: Poem[]
  passages?: Passage[]
  hanzi?: Hanzi[]
  idioms?: IdiomSet[]
  quiz: QuizItem[]
}

export interface ChineseUnit {
  id: number
  slug: string
  title: string
  titleZh: string
  emoji: string
  theme: ModuleTheme
  lessons: ChineseLesson[]
}

/** 全局中国红主题（页面根容器统一挂载） */
export const CHINESE_THEME: ModuleTheme = { color: '#dc2626', colorSoft: '#fee2e2' }

export const chineseUnits: ChineseUnit[] = [
  // ============================== 第一单元 ==============================
  {
    id: 1,
    slug: 'u1',
    title: '第一单元',
    titleZh: '多姿多彩的校园',
    emoji: '🌱',
    theme: { color: '#dc2626', colorSoft: '#fee2e2' },
    lessons: [
      {
        id: 1,
        slug: 'u1-1',
        title: '大青树下的小学',
        emoji: '🏫',
        passages: [
          {
            title: '第 1 自然段（背诵）',
            text: '早晨，从山坡上，从坪坝里，从一条条开着绒球花和太阳花的小路上，走来了许多小学生，有汉族的，有傣族的，有景颇族的，还有阿昌族和德昂族的。大家穿戴不同，来到学校，都成了好朋友。那鲜艳的服装，把学校打扮得绚丽多彩。',
            note: '写各民族小学生一起上学的欢乐场景，注意「穿戴」「绚丽多彩」等词语。',
          },
        ],
        quiz: [
          {
            q: '「从一条条开着绒球花和太阳花的小路上」，这句话运用了什么修辞手法？',
            options: ['排比', '比喻', '夸张', '反问'],
            answer: 0,
            explain: '「从……从……从……」三个相同结构连用，是排比。',
          },
          {
            q: '大青树下的小学里，小学生来自哪些民族？（多选概念，选「都包含」的一项）',
            options: ['只有汉族', '汉族、傣族、景颇族、阿昌族、德昂族等', '只有傣族', '只有少数民族'],
            answer: 1,
            explain: '课文写到汉族、傣族、景颇族、阿昌族和德昂族的小朋友。',
          },
        ],
      },
      {
        id: 2,
        slug: 'u1-2',
        title: '花的学校',
        emoji: '🌸',
        passages: [
          {
            title: '第 2 自然段（背诵）',
            text: '当雷云在天上轰响，六月的阵雨落下的时候，润湿的东风走过荒野，在竹林中吹着口笛。于是，一群一群的花从无人知道的地方突然跑出来，在绿草上跳舞、狂欢。',
            note: '把「东风」「花」当成人来写，是拟人句。',
          },
        ],
        quiz: [
          {
            q: '「润湿的东风走过荒野，在竹林中吹着口笛」运用了什么写法？',
            options: ['拟人', '比喻', '排比', '设问'],
            answer: 0,
            explain: '东风「走过」「吹着口笛」是人的动作，属于拟人。',
          },
          {
            q: '「一群一群的花从无人知道的地方突然跑出来」，花是在什么时候跑出来的？',
            options: ['六月阵雨落下时', '冬天', '晴天中午', '夜晚'],
            answer: 0,
            explain: '课文写「六月的阵雨落下的时候」花跑了出来。',
          },
        ],
      },
      {
        id: 3,
        slug: 'u1-3',
        title: '语文园地一 · 日积月累',
        emoji: '📜',
        poems: [
          {
            title: '所见',
            author: '袁枚',
            dynasty: '清',
            lines: ['牧童骑黄牛，', '歌声振林樾。', '意欲捕鸣蝉，', '忽然闭口立。'],
          },
        ],
        quiz: [
          {
            q: '《所见》的作者是哪个朝代的？',
            options: ['唐', '宋', '清', '元'],
            answer: 2,
            explain: '《所见》是清代诗人袁枚所作。',
          },
          {
            q: '「意欲捕鸣蝉，忽然闭口立」中，牧童为什么忽然闭口？',
            options: ['想捉蝉怕惊飞它', '睡着了', '生气了', '唱歌累了'],
            answer: 0,
            explain: '牧童想要捕捉鸣叫的蝉，所以闭上嘴站着不动。',
          },
        ],
      },
      {
        id: 4,
        slug: 'u1-4',
        title: '第一单元 · 生字词',
        emoji: '✍️',
        hanzi: [
          { char: '晨', pinyin: 'chén', group: ['早晨', '晨光'] },
          { char: '绒', pinyin: 'róng', group: ['绒毛', '绒球'] },
          { char: '球', pinyin: 'qiú', group: ['皮球', '足球'] },
          { char: '汉', pinyin: 'hàn', group: ['汉族', '汉字'] },
          { char: '艳', pinyin: 'yàn', group: ['鲜艳', '艳丽'] },
          { char: '服', pinyin: 'fú', group: ['衣服', '服务'] },
          { char: '装', pinyin: 'zhuāng', group: ['服装', '化妆'] },
          { char: '扮', pinyin: 'bàn', group: ['打扮', '扮演'] },
          { char: '读', pinyin: 'dú', group: ['读书', '朗读'] },
          { char: '静', pinyin: 'jìng', group: ['安静', '平静'] },
          { char: '停', pinyin: 'tíng', group: ['停止', '停车'] },
          { char: '粗', pinyin: 'cū', group: ['粗心', '粗壮'] },
          { char: '影', pinyin: 'yǐng', group: ['影子', '电影'] },
          { char: '落', pinyin: 'luò', group: ['落下', '落叶'] },
          { char: '荒', pinyin: 'huāng', group: ['荒野', '荒凉'] },
          { char: '笛', pinyin: 'dí', group: ['笛子', '口笛'] },
          { char: '舞', pinyin: 'wǔ', group: ['跳舞', '舞蹈'] },
          { char: '狂', pinyin: 'kuáng', group: ['狂欢', '狂风'] },
          { char: '罚', pinyin: 'fá', group: ['罚站', '惩罚'] },
          { char: '假', pinyin: 'jià', group: ['放假', '假期'] },
          { char: '互', pinyin: 'hù', group: ['互相', '互动'] },
          { char: '所', pinyin: 'suǒ', group: ['所以', '场所'] },
          { char: '够', pinyin: 'gòu', group: ['足够', '能够'] },
          { char: '猜', pinyin: 'cāi', group: ['猜想', '猜测'] },
          { char: '扬', pinyin: 'yáng', group: ['飞扬', '表扬'] },
          { char: '臂', pinyin: 'bì', group: ['手臂', '双臂'] },
        ],
        quiz: [
          {
            q: '「晨」的拼音是？',
            options: ['chén', 'chéng', 'cén', 'chěn'],
            answer: 0,
            explain: '晨 = chén（早晨）。',
          },
          {
            q: '「舞」可以组词？',
            options: ['跳舞', '午饭', '武器', '财产'],
            answer: 0,
            explain: '舞 → 跳舞、舞蹈。',
          },
          {
            q: '「假」在「放假」中读？',
            options: ['jià', 'jiǎ', 'xià', 'há'],
            answer: 0,
            explain: '放假、假期读 jià；真假读 jiǎ。',
          },
        ],
      },
    ],
  },

  // ============================== 第二单元 ==============================
  {
    id: 2,
    slug: 'u2',
    title: '第二单元',
    titleZh: '金秋时节',
    emoji: '🍂',
    theme: { color: '#ea580c', colorSoft: '#ffedd5' },
    lessons: [
      {
        id: 1,
        slug: 'u2-1',
        title: '古诗三首',
        emoji: '📜',
        poems: [
          {
            title: '山行',
            author: '杜牧',
            dynasty: '唐',
            lines: ['远上寒山石径斜，', '白云生处有人家。', '停车坐爱枫林晚，', '霜叶红于二月花。'],
          },
          {
            title: '赠刘景文',
            author: '苏轼',
            dynasty: '宋',
            lines: ['荷尽已无擎雨盖，', '菊残犹有傲霜枝。', '一年好景君须记，', '最是橙黄橘绿时。'],
          },
          {
            title: '夜书所见',
            author: '叶绍翁',
            dynasty: '宋',
            lines: ['萧萧梧叶送寒声，', '江上秋风动客情。', '知有儿童挑促织，', '夜深篱落一灯明。'],
          },
        ],
        quiz: [
          {
            q: '「停车坐爱枫林晚」中「坐」的意思是？',
            options: ['因为', '坐下', '座位', '乘着'],
            answer: 0,
            explain: '古文中「坐」常作「因为」讲：因为喜爱傍晚的枫林而停车。',
          },
          {
            q: '《赠刘景文》中「最是橙黄橘绿时」写的是哪个季节？',
            options: ['秋末冬初', '春天', '盛夏', '深冬'],
            answer: 0,
            explain: '橙子黄、橘子绿，是秋末冬初的好景。',
          },
          {
            q: '《夜书所见》「知有儿童挑促织」中「促织」指？',
            options: ['蟋蟀（蛐蛐）', '蝴蝶', '蚂蚁', '蜜蜂'],
            answer: 0,
            explain: '促织即蟋蟀，儿童夜里拨弄蟋蟀玩耍。',
          },
        ],
      },
      {
        id: 2,
        slug: 'u2-2',
        title: '秋天的雨（第 2 段）',
        emoji: '🍁',
        passages: [
          {
            title: '第 2 自然段（背诵）',
            text: '秋天的雨，有一盒五彩缤纷的颜料。你看，它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。它把红色给了枫树，红红的枫叶像一枚枚邮票，飘哇飘哇，邮来了秋天的凉爽。金黄色是给田野的，看，田野像金色的海洋。橙红色是给果树的，橘子、柿子你挤我碰，争着要人们去摘呢！菊花仙子得到的颜色就更多了，紫红的、淡黄的、雪白的……美丽的菊花在秋雨里频频点头。',
            note: '比喻句：叶子像小扇子、枫叶像邮票、田野像海洋。',
          },
        ],
        quiz: [
          {
            q: '「黄黄的叶子像一把把小扇子」是哪种修辞手法？',
            options: ['比喻', '拟人', '夸张', '排比'],
            answer: 0,
            explain: '把叶子比作小扇子，是比喻。',
          },
          {
            q: '「橘子、柿子你挤我碰，争着要人们去摘呢」用了什么写法？',
            options: ['拟人', '比喻', '设问', '对偶'],
            answer: 0,
            explain: '果子「你挤我碰」「争着」像人一样，是拟人。',
          },
        ],
      },
      {
        id: 3,
        slug: 'u2-3',
        title: '语文园地二 · 日积月累',
        emoji: '🍃',
        idioms: [
          {
            title: '描写秋天的成语',
            kind: 'idioms',
            items: [
              { term: '秋高气爽' },
              { term: '天高云淡' },
              { term: '秋风习习' },
              { term: '一叶知秋' },
              { term: '金桂飘香' },
              { term: '层林尽染' },
              { term: '五谷丰登' },
              { term: '果实累累' },
              { term: '春华秋实' },
            ],
          },
        ],
        quiz: [
          {
            q: '下列哪个成语不是描写秋天的？',
            options: ['秋高气爽', '金桂飘香', '春华秋实', '骄阳似火'],
            answer: 3,
            explain: '骄阳似火描写夏天炎热；其余都和秋天有关。',
          },
          {
            q: '「一叶知秋」的意思最接近？',
            options: ['看到一片落叶就知道秋天来了', '树叶很多', '秋天很长', '风很大'],
            answer: 0,
            explain: '比喻通过细微迹象可以推测事物的发展趋向。',
          },
        ],
      },
      {
        id: 4,
        slug: 'u2-4',
        title: '第二单元 · 生字词',
        emoji: '✍️',
        hanzi: [
          { char: '寒', pinyin: 'hán', group: ['寒冷', '寒风'] },
          { char: '径', pinyin: 'jìng', group: ['小径', '路径'] },
          { char: '斜', pinyin: 'xié', group: ['斜阳', '倾斜'] },
          { char: '霜', pinyin: 'shuāng', group: ['秋霜', '冰霜'] },
          { char: '赠', pinyin: 'zèng', group: ['赠送', '赠品'] },
          { char: '刘', pinyin: 'liú', group: ['姓刘', '刘海'] },
          { char: '盖', pinyin: 'gài', group: ['盖子', '锅盖'] },
          { char: '菊', pinyin: 'jú', group: ['菊花', '秋菊'] },
          { char: '残', pinyin: 'cán', group: ['残菊', '残月'] },
          { char: '君', pinyin: 'jūn', group: ['君子', '诸君'] },
          { char: '橙', pinyin: 'chéng', group: ['橙子', '橙色'] },
          { char: '送', pinyin: 'sòng', group: ['送给', '送别'] },
          { char: '挑', pinyin: 'tiāo', group: ['挑选', '挑食'] },
          { char: '铺', pinyin: 'pū', group: ['铺满', '床铺'] },
          { char: '泥', pinyin: 'ní', group: ['泥土', '水泥'] },
          { char: '晶', pinyin: 'jīng', group: ['水晶', '亮晶晶'] },
          { char: '紧', pinyin: 'jǐn', group: ['紧张', '抓紧'] },
          { char: '院', pinyin: 'yuàn', group: ['院子', '庭院'] },
          { char: '印', pinyin: 'yìn', group: ['印象', '脚印'] },
          { char: '排', pinyin: 'pái', group: ['排队', '排列'] },
          { char: '列', pinyin: 'liè', group: ['排列', '列车'] },
          { char: '规', pinyin: 'guī', group: ['规则', '规定'] },
          { char: '则', pinyin: 'zé', group: ['法则', '否则'] },
          { char: '乱', pinyin: 'luàn', group: ['杂乱', '凌乱'] },
          { char: '棕', pinyin: 'zōng', group: ['棕色', '棕树'] },
          { char: '迟', pinyin: 'chí', group: ['迟到', '迟延'] },
          { char: '盒', pinyin: 'hé', group: ['盒子', '文具盒'] },
          { char: '颜', pinyin: 'yán', group: ['颜色', '容颜'] },
          { char: '料', pinyin: 'liào', group: ['颜料', '材料'] },
          { char: '票', pinyin: 'piào', group: ['邮票', '车票'] },
          { char: '飘', pinyin: 'piāo', group: ['飘扬', '飘落'] },
          { char: '争', pinyin: 'zhēng', group: ['争论', '争取'] },
          { char: '仙', pinyin: 'xiān', group: ['神仙', '仙女'] },
          { char: '闻', pinyin: 'wén', group: ['新闻', '见闻'] },
          { char: '梨', pinyin: 'lí', group: ['梨子', '梨花'] },
          { char: '淡', pinyin: 'dàn', group: ['平淡', '冷淡'] },
        ],
        quiz: [
          {
            q: '「径」的拼音是？',
            options: ['jìng', 'jīng', 'jìn', 'jíng'],
            answer: 0,
            explain: '径 = jìng（小径、路径）。',
          },
          {
            q: '「橙」可以组词？',
            options: ['橙色', '澄清', '城市', '成功'],
            answer: 0,
            explain: '橙 → 橙子、橙色。',
          },
        ],
      },
    ],
  },

  // ============================== 第三单元 ==============================
  {
    id: 3,
    slug: 'u3',
    title: '第三单元',
    titleZh: '童话世界',
    emoji: '🧚',
    theme: { color: '#16a34a', colorSoft: '#dcfce7' },
    lessons: [
      {
        id: 1,
        slug: 'u3-1',
        title: '在牛肚子里旅行（要点）',
        emoji: '🐄',
        passages: [
          {
            title: '课文要点（熟读理解）',
            text: '红头和青头是一对好朋友。红头不小心被牛吃进肚子里，青头隔着牛肚皮鼓励它，告诉它牛有四个胃、会反刍。红头随着草一起移动，最后在牛打喷嚏时喷了出来，脱离了危险。',
            note: '科学知识：牛有四个胃，吃草后会把草送回嘴里重新咀嚼（反刍）。',
          },
        ],
        quiz: [
          {
            q: '牛有几个胃？',
            options: ['四个', '一个', '两个', '八个'],
            answer: 0,
            explain: '课文里青头告诉红头，牛有四个胃。',
          },
          {
            q: '红头最后是怎么出来的？',
            options: ['牛打喷嚏喷出来', '自己爬出来', '青头拉出来', '被人救出'],
            answer: 0,
            explain: '红头在牛打喷嚏时被喷了出来。',
          },
        ],
      },
      {
        id: 2,
        slug: 'u3-2',
        title: '语文园地三 · 日积月累',
        emoji: '💡',
        idioms: [
          {
            title: '关于道理的俗语',
            kind: 'proverbs',
            items: [
              { term: '灯不拨不亮，理不辩不明。' },
              { term: '有理走遍天下，无理寸步难行。' },
              { term: '一时强弱在于力，万古胜负在于理。' },
            ],
          },
        ],
        quiz: [
          {
            q: '「有理走遍天下」的下一句是？',
            options: ['无理寸步难行', '无理也行', '有力走天下', '无理天下行'],
            answer: 0,
            explain: '完整俗语：有理走遍天下，无理寸步难行。',
          },
          {
            q: '「一时强弱在于力」强调什么更重要？',
            options: ['道理（理）', '力气', '速度', '运气'],
            answer: 0,
            explain: '下一句「万古胜负在于理」，强调道理才能决定长远胜负。',
          },
        ],
      },
      {
        id: 3,
        slug: 'u3-3',
        title: '第三单元 · 生字词',
        emoji: '✍️',
        hanzi: [
          { char: '旅', pinyin: 'lǚ', group: ['旅行', '旅游'] },
          { char: '咱', pinyin: 'zán', group: ['咱们', '咱家'] },
          { char: '救', pinyin: 'jiù', group: ['救命', '抢救'] },
          { char: '命', pinyin: 'mìng', group: ['生命', '命令'] },
          { char: '拼', pinyin: 'pīn', group: ['拼命', '拼写'] },
          { char: '扫', pinyin: 'sǎo', group: ['打扫', '扫地'] },
          { char: '胃', pinyin: 'wèi', group: ['胃口', '肠胃'] },
          { char: '管', pinyin: 'guǎn', group: ['保管', '管理'] },
          { char: '等', pinyin: 'děng', group: ['等待', '等于'] },
          { char: '流', pinyin: 'liú', group: ['流水', '流泪'] },
          { char: '算', pinyin: 'suàn', group: ['计算', '打算'] },
          { char: '泪', pinyin: 'lèi', group: ['眼泪', '泪水'] },
          { char: '富', pinyin: 'fù', group: ['富有', '丰富'] },
        ],
        quiz: [
          {
            q: '「旅」的拼音是？',
            options: ['lǚ', 'lǔ', 'nǚ', 'lú'],
            answer: 0,
            explain: '旅 = lǚ（旅行）。',
          },
          {
            q: '「命」可以组词？',
            options: ['生命', '名字', '明天', '民众'],
            answer: 0,
            explain: '命 → 生命、命令。',
          },
        ],
      },
    ],
  },

  // ============================== 第四单元 ==============================
  {
    id: 4,
    slug: 'u4',
    title: '第四单元',
    titleZh: '预测与猜想',
    emoji: '🔮',
    theme: { color: '#b45309', colorSoft: '#fef3c7' },
    lessons: [
      {
        id: 1,
        slug: 'u4-1',
        title: '总也倒不了的老屋（要点）',
        emoji: '🏚️',
        passages: [
          {
            title: '课文要点（熟读理解）',
            text: '老屋已经活了一百多岁，准备倒下，却一次次因为小猫、老母鸡、小蜘蛛的请求而继续站立，帮助了它们。故事鼓励我们一边读一边预测，并根据课文内容修正自己的猜测。',
            note: '本单元是「阅读策略」单元，重点学习「预测」。',
          },
        ],
        quiz: [
          {
            q: '老屋为什么总也倒不了？',
            options: ['它一次次帮助小动物，被请求留下', '它很坚固', '没人推它', '它怕黑'],
            answer: 0,
            explain: '小猫、老母鸡、小蜘蛛的请求让老屋继续站立帮忙。',
          },
          {
            q: '第四单元学习的阅读策略主要是？',
            options: ['预测', '默读', '查字典', '速读'],
            answer: 0,
            explain: '本单元是「预测」策略单元。',
          },
        ],
      },
      {
        id: 2,
        slug: 'u4-2',
        title: '语文园地四 · 日积月累',
        emoji: '🤝',
        idioms: [
          {
            title: '关于团结的俗语',
            kind: 'proverbs',
            items: [
              { term: '人心齐，泰山移。' },
              { term: '二人同心，其利断金。' },
              { term: '三个臭皮匠，顶个诸葛亮。' },
              { term: '一个篱笆三个桩，一个好汉三个帮。' },
            ],
          },
        ],
        quiz: [
          {
            q: '「人心齐，泰山移」讲的是？',
            options: ['团结力量大', '山很高', '人多热闹', '泰山很美'],
            answer: 0,
            explain: '大家心往一处想，连泰山也能移动，比喻团结力量大。',
          },
          {
            q: '「三个臭皮匠，顶个诸葛亮」意思是？',
            options: ['多人智慧合起来能胜过聪明人', '皮匠很聪明', '诸葛亮不聪明', '三个人就够了'],
            answer: 0,
            explain: '比喻集思广益，集体的智慧很强。',
          },
        ],
      },
      {
        id: 3,
        slug: 'u4-3',
        title: '第四单元 · 生字词',
        emoji: '✍️',
        hanzi: [
          { char: '暴', pinyin: 'bào', group: ['暴雨', '暴力'] },
          { char: '准', pinyin: 'zhǔn', group: ['准备', '准确'] },
          { char: '备', pinyin: 'bèi', group: ['准备', '备用'] },
          { char: '睡', pinyin: 'shuì', group: ['睡觉', '睡眠'] },
          { char: '砍', pinyin: 'kǎn', group: ['砍柴', '砍树'] },
          { char: '蜘', pinyin: 'zhī', group: ['蜘蛛'] },
          { char: '蛛', pinyin: 'zhū', group: ['蜘蛛', '蛛丝'] },
          { char: '撞', pinyin: 'zhuàng', group: ['撞上', '撞击'] },
          { char: '晒', pinyin: 'shài', group: ['晒太阳', '晾晒'] },
          { char: '壁', pinyin: 'bì', group: ['墙壁', '壁画'] },
          { char: '漂', pinyin: 'piào', group: ['漂亮', '漂泊'] },
          { char: '饱', pinyin: 'bǎo', group: ['吃饱', '饱满'] },
        ],
        quiz: [
          {
            q: '「暴」的拼音是？',
            options: ['bào', 'bāo', 'pào', 'pù'],
            answer: 0,
            explain: '暴 = bào（暴雨、暴力）。',
          },
          {
            q: '「漂」在「漂亮」中读？',
            options: ['piào', 'piāo', 'piǎo', 'biào'],
            answer: 0,
            explain: '漂亮读 piào liang；漂流读 piāo。',
          },
        ],
      },
    ],
  },

  // ============================== 第五单元 ==============================
  {
    id: 5,
    slug: 'u5',
    title: '第五单元',
    titleZh: '观察与发现',
    emoji: '🔍',
    theme: { color: '#0d9488', colorSoft: '#ccfbf1' },
    lessons: [
      {
        id: 1,
        slug: 'u5-1',
        title: '金色的草地（第 3 段）',
        emoji: '🌿',
        passages: [
          {
            title: '第 3 自然段（背诵）',
            text: '有一天，我起得很早去钓鱼，发现草地并不是金色的，而是绿色的。中午回家的时候，我看见草地是金色的。傍晚的时候，草地又变绿了。这是为什么呢？我来到草地上，仔细观察，发现蒲公英的花瓣是合拢的。原来，蒲公英的花就像我们的手掌，可以张开、合上。花朵张开时，花瓣是金色的，草地也是金色的；花朵合拢时，金色的花瓣被包住了，草地就变成绿色的了。',
            note: '蒲公英的花像手掌，张开时草地金色，合拢时草地绿色。',
          },
        ],
        quiz: [
          {
            q: '草地早上和中午颜色不同，是因为？',
            options: ['蒲公英花朵张开与合拢', '太阳颜色变了', '下雨了', '草长高了'],
            answer: 0,
            explain: '蒲公英花张开→金色，合拢→绿色。',
          },
          {
            q: '「蒲公英的花就像我们的手掌」是哪种修辞？',
            options: ['比喻', '拟人', '夸张', '反问'],
            answer: 0,
            explain: '把花比作手掌，是比喻。',
          },
        ],
      },
      {
        id: 2,
        slug: 'u5-2',
        title: '搭船的鸟（要点）',
        emoji: '🐦',
        passages: [
          {
            title: '课文要点（细致观察）',
            text: '下雨天，一只彩色的小鸟站在船头。作者仔细观察了它的羽毛、翅膀和长嘴，后来看到它冲进水里，叼起一条小鱼飞走了。课文教我们：要留心观察周围的事物。',
            note: '翠鸟：羽毛翠绿、翅膀带蓝色、红色长嘴。',
          },
        ],
        quiz: [
          {
            q: '搭船的鸟是什么鸟？',
            options: ['翠鸟', '麻雀', '乌鸦', '鸽子'],
            answer: 0,
            explain: '那只彩色的小鸟是翠鸟。',
          },
          {
            q: '作者通过观察发现了翠鸟的什么特点？',
            options: ['羽毛翠绿、长嘴红、会捕鱼', '不会飞', '很大', '是白色的'],
            answer: 0,
            explain: '翠鸟羽毛翠绿、红色长嘴，并能冲进水里捉鱼。',
          },
        ],
      },
      {
        id: 3,
        slug: 'u5-3',
        title: '第五单元 · 生字词',
        emoji: '✍️',
        hanzi: [
          { char: '搭', pinyin: 'dā', group: ['搭船', '搭车'] },
          { char: '亲', pinyin: 'qīn', group: ['亲人', '亲密'] },
          { char: '父', pinyin: 'fù', group: ['父亲', '父母'] },
          { char: '沙', pinyin: 'shā', group: ['沙子', '沙滩'] },
          { char: '啦', pinyin: 'la', group: ['哗啦', '呼啦'] },
          { char: '响', pinyin: 'xiǎng', group: ['响亮', '响声'] },
          { char: '羽', pinyin: 'yǔ', group: ['羽毛', '羽翼'] },
          { char: '翠', pinyin: 'cuì', group: ['翠绿', '翠鸟'] },
          { char: '嘴', pinyin: 'zuǐ', group: ['嘴巴', '嘴角'] },
          { char: '吞', pinyin: 'tūn', group: ['吞下', '吞吐'] },
          { char: '捕', pinyin: 'bǔ', group: ['捕鱼', '捕捉'] },
          { char: '蒲', pinyin: 'pú', group: ['蒲公英', '蒲扇'] },
          { char: '英', pinyin: 'yīng', group: ['英雄', '英语'] },
          { char: '盛', pinyin: 'shèng', group: ['盛开', '盛大'] },
          { char: '耍', pinyin: 'shuǎ', group: ['玩耍', '戏耍'] },
          { char: '喊', pinyin: 'hǎn', group: ['喊叫', '呼喊'] },
          { char: '欠', pinyin: 'qiàn', group: ['哈欠', '欠身'] },
          { char: '钓', pinyin: 'diào', group: ['钓鱼', '钓竿'] },
          { char: '而', pinyin: 'ér', group: ['而且', '然而'] },
          { char: '察', pinyin: 'chá', group: ['观察', '察觉'] },
          { char: '拢', pinyin: 'lǒng', group: ['合拢', '拉拢'] },
          { char: '趣', pinyin: 'qù', group: ['有趣', '趣味'] },
          { char: '喜', pinyin: 'xǐ', group: ['喜欢', '欢喜'] },
        ],
        quiz: [
          {
            q: '「翠」的拼音是？',
            options: ['cuì', 'chuì', 'cùi', 'cuī'],
            answer: 0,
            explain: '翠 = cuì（翠绿、翠鸟）。',
          },
          {
            q: '「察」可以组词？',
            options: ['观察', '喝茶', '检查', '茶叶'],
            answer: 0,
            explain: '察 → 观察、察觉。',
          },
        ],
      },
    ],
  },

  // ============================== 第六单元 ==============================
  {
    id: 6,
    slug: 'u6',
    title: '第六单元',
    titleZh: '祖国河山',
    emoji: '🏞️',
    theme: { color: '#0284c7', colorSoft: '#e0f2fe' },
    lessons: [
      {
        id: 1,
        slug: 'u6-1',
        title: '古诗三首',
        emoji: '📜',
        poems: [
          {
            title: '望天门山',
            author: '李白',
            dynasty: '唐',
            lines: ['天门中断楚江开，', '碧水东流至此回。', '两岸青山相对出，', '孤帆一片日边来。'],
          },
          {
            title: '饮湖上初晴后雨',
            author: '苏轼',
            dynasty: '宋',
            lines: ['水光潋滟晴方好，', '山色空蒙雨亦奇。', '欲把西湖比西子，', '淡妆浓抹总相宜。'],
          },
          {
            title: '望洞庭',
            author: '刘禹锡',
            dynasty: '唐',
            lines: ['湖光秋月两相和，', '潭面无风镜未磨。', '遥望洞庭山水翠，', '白银盘里一青螺。'],
          },
        ],
        quiz: [
          {
            q: '《饮湖上初晴后雨》把西湖比作谁？',
            options: ['西子（西施）', '王昭君', '杨贵妃', '貂蝉'],
            answer: 0,
            explain: '「欲把西湖比西子」，西子即西施。',
          },
          {
            q: '「白银盘里一青螺」描写的是？',
            options: ['洞庭湖中的君山', '大海', '江河', '雪山'],
            answer: 0,
            explain: '把洞庭湖面比作白银盘，湖中君山比作青螺。',
          },
          {
            q: '《望天门山》的作者是？',
            options: ['李白', '杜甫', '白居易', '王维'],
            answer: 0,
            explain: '《望天门山》是唐代李白所作。',
          },
        ],
      },
      {
        id: 2,
        slug: 'u6-2',
        title: '富饶的西沙群岛（结尾段）',
        emoji: '🐠',
        passages: [
          {
            title: '结尾段（背诵）',
            text: '富饶的西沙群岛，是我们祖祖辈辈生活的地方。随着祖国建设事业的发展，可爱的西沙群岛必将变得更加美丽，更加富饶。',
            note: '课文写了西沙群岛的海水、海底生物、海滩和海岛，表达热爱之情。',
          },
        ],
        quiz: [
          {
            q: '西沙群岛的特点是？',
            options: ['美丽、富饶', '寒冷', '干旱', '荒凉'],
            answer: 0,
            explain: '课文题目就是「富饶的西沙群岛」。',
          },
          {
            q: '「必将变得更加美丽，更加富饶」表达了作者怎样的感情？',
            options: ['对祖国海疆的热爱与自豪', '难过', '害怕', '无所谓'],
            answer: 0,
            explain: '表达了对祖国河山的热爱与自豪。',
          },
        ],
      },
      {
        id: 3,
        slug: 'u6-3',
        title: '语文园地六 · 日积月累',
        emoji: '⛰️',
        poems: [
          {
            title: '早发白帝城',
            author: '李白',
            dynasty: '唐',
            lines: ['朝辞白帝彩云间，', '千里江陵一日还。', '两岸猿声啼不住，', '轻舟已过万重山。'],
          },
        ],
        quiz: [
          {
            q: '「朝辞白帝彩云间」中「辞」的意思是？',
            options: ['告别、离开', '词语', '推辞', '命令'],
            answer: 0,
            explain: '早晨告别白帝城，从彩云间出发。',
          },
          {
            q: '「轻舟已过万重山」让人感受到？',
            options: ['船行很快、心情轻快', '山很多很慢', '船沉了', '风很大'],
            answer: 0,
            explain: '小船飞快越过万重山，写出诗人轻快喜悦的心情。',
          },
        ],
      },
      {
        id: 4,
        slug: 'u6-4',
        title: '第六单元 · 生字词',
        emoji: '✍️',
        hanzi: [
          { char: '断', pinyin: 'duàn', group: ['断开', '中断'] },
          { char: '楚', pinyin: 'chǔ', group: ['清楚', '楚国'] },
          { char: '至', pinyin: 'zhì', group: ['至于', '至少'] },
          { char: '孤', pinyin: 'gū', group: ['孤单', '孤独'] },
          { char: '帆', pinyin: 'fān', group: ['帆船', '风帆'] },
          { char: '饮', pinyin: 'yǐn', group: ['饮水', '饮料'] },
          { char: '初', pinyin: 'chū', group: ['初升', '初级'] },
          { char: '镜', pinyin: 'jìng', group: ['镜子', '明镜'] },
          { char: '未', pinyin: 'wèi', group: ['未来', '未必'] },
          { char: '磨', pinyin: 'mó', group: ['磨刀', '折磨'] },
          { char: '遥', pinyin: 'yáo', group: ['遥远', '遥望'] },
          { char: '银', pinyin: 'yín', group: ['银色', '银子'] },
          { char: '盘', pinyin: 'pán', group: ['盘子', '圆盘'] },
          { char: '优', pinyin: 'yōu', group: ['优美', '优秀'] },
          { char: '浅', pinyin: 'qiǎn', group: ['浅绿', '深浅'] },
          { char: '错', pinyin: 'cuò', group: ['错误', '对错'] },
          { char: '岩', pinyin: 'yán', group: ['岩石', '岩洞'] },
          { char: '虾', pinyin: 'xiā', group: ['小虾', '鱼虾'] },
          { char: '挺', pinyin: 'tǐng', group: ['挺立', '挺直'] },
          { char: '鼓', pinyin: 'gǔ', group: ['鼓励', '鼓掌'] },
          { char: '数', pinyin: 'shǔ', group: ['数不清', '数数'] },
          { char: '厚', pinyin: 'hòu', group: ['厚厚', '深厚'] },
          { char: '宝', pinyin: 'bǎo', group: ['宝贝', '宝贵'] },
          { char: '贵', pinyin: 'guì', group: ['珍贵', '贵重'] },
          { char: '滨', pinyin: 'bīn', group: ['海滨', '湖滨'] },
          { char: '灰', pinyin: 'huī', group: ['灰色', '灰心'] },
          { char: '渔', pinyin: 'yú', group: ['渔民', '渔船'] },
          { char: '遍', pinyin: 'biàn', group: ['一遍', '遍布'] },
          { char: '躺', pinyin: 'tǎng', group: ['躺下', '躺椅'] },
          { char: '载', pinyin: 'zài', group: ['满载', '装载'] },
          { char: '靠', pinyin: 'kào', group: ['靠岸', '依靠'] },
          { char: '栽', pinyin: 'zāi', group: ['栽树', '栽种'] },
          { char: '亚', pinyin: 'yà', group: ['亚热带', '亚军'] },
          { char: '夏', pinyin: 'xià', group: ['夏天', '夏季'] },
          { char: '除', pinyin: 'chú', group: ['除了', '消除'] },
          { char: '踩', pinyin: 'cǎi', group: ['踩踏', '踩水'] },
          { char: '洁', pinyin: 'jié', group: ['洁白', '清洁'] },
          { char: '脑', pinyin: 'nǎo', group: ['脑袋', '大脑'] },
          { char: '袋', pinyin: 'dài', group: ['口袋', '袋子'] },
          { char: '严', pinyin: 'yán', group: ['严实', '严格'] },
          { char: '实', pinyin: 'shí', group: ['实在', '果实'] },
          { char: '挡', pinyin: 'dǎng', group: ['挡住', '阻挡'] },
          { char: '视', pinyin: 'shì', group: ['视线', '电视'] },
          { char: '线', pinyin: 'xiàn', group: ['线条', '电线'] },
          { char: '坛', pinyin: 'tán', group: ['花坛', '天坛'] },
          { char: '显', pinyin: 'xiǎn', group: ['显现', '明显'] },
          { char: '材', pinyin: 'cái', group: ['木材', '材料'] },
          { char: '软', pinyin: 'ruǎn', group: ['柔软', '松软'] },
          { char: '刮', pinyin: 'guā', group: ['刮风', '刮胡子'] },
          { char: '库', pinyin: 'kù', group: ['宝库', '仓库'] },
        ],
        quiz: [
          {
            q: '「楚」的拼音是？',
            options: ['chǔ', 'cǔ', 'chū', 'cū'],
            answer: 0,
            explain: '楚 = chǔ（清楚、楚国）。',
          },
          {
            q: '「镜」可以组词？',
            options: ['镜子', '竞争', '安静', '环境'],
            answer: 0,
            explain: '镜 → 镜子、明镜。',
          },
        ],
      },
    ],
  },

  // ============================== 第七单元 ==============================
  {
    id: 7,
    slug: 'u7',
    title: '第七单元',
    titleZh: '我与自然',
    emoji: '🎵',
    theme: { color: '#7c3aed', colorSoft: '#ede9fe' },
    lessons: [
      {
        id: 1,
        slug: 'u7-1',
        title: '大自然的声音（风）',
        emoji: '🌬️',
        passages: [
          {
            title: '第 2 自然段（背诵）',
            text: '风，是大自然的音乐家。他会在森林里演奏他的手风琴。当他翻动树叶，树叶便像歌手一样，唱出各种不同的歌曲。不一样的树叶，有不一样的声音；不一样的季节，有不一样的音乐。当微风拂过，那声音轻轻柔柔的，好像呢喃细语，让人感受到大自然的温柔；当狂风吹起，整座森林都激动起来，合奏出一首雄伟的乐曲，那声音充满力量，令人感受到大自然的威力。',
            note: '把风比作「音乐家」，把树叶比作「歌手」，是拟人 + 比喻。',
          },
        ],
        quiz: [
          {
            q: '「风，是大自然的音乐家」运用了什么写法？',
            options: ['比喻 + 拟人', '夸张', '反问', '排比'],
            answer: 0,
            explain: '把风比作音乐家（比喻），又赋予它演奏的动作（拟人）。',
          },
          {
            q: '微风拂过时，声音给人什么感觉？',
            options: ['轻轻柔柔、温柔', '雄伟有力', '吵闹', '刺耳'],
            answer: 0,
            explain: '微风「轻轻柔柔的，好像呢喃细语」，让人感到温柔。',
          },
        ],
      },
      {
        id: 2,
        slug: 'u7-2',
        title: '语文园地七 · 日积月累',
        emoji: '🪷',
        poems: [
          {
            title: '采莲曲',
            author: '王昌龄',
            dynasty: '唐',
            lines: ['荷叶罗裙一色裁，', '芙蓉向脸两边开。', '乱入池中看不见，', '闻歌始觉有人来。'],
          },
        ],
        quiz: [
          {
            q: '《采莲曲》中「荷叶罗裙一色裁」写采莲女和什么颜色一样？',
            options: ['荷叶的绿色', '荷花红色', '天空蓝色', '水黄色'],
            answer: 0,
            explain: '罗裙和荷叶都是绿色，仿佛用同一块布裁成。',
          },
          {
            q: '《采莲曲》的作者是？',
            options: ['王昌龄', '李白', '杜甫', '王维'],
            answer: 0,
            explain: '《采莲曲》是唐代王昌龄所作。',
          },
        ],
      },
      {
        id: 3,
        slug: 'u7-3',
        title: '第七单元 · 生字词',
        emoji: '✍️',
        hanzi: [
          { char: '妙', pinyin: 'miào', group: ['美妙', '奇妙'] },
          { char: '演', pinyin: 'yǎn', group: ['演奏', '表演'] },
          { char: '奏', pinyin: 'zòu', group: ['演奏', '节拍'] },
          { char: '琴', pinyin: 'qín', group: ['钢琴', '琴声'] },
          { char: '柔', pinyin: 'róu', group: ['温柔', '柔和'] },
          { char: '感', pinyin: 'gǎn', group: ['感受', '感动'] },
          { char: '受', pinyin: 'shòu', group: ['接受', '感受'] },
          { char: '激', pinyin: 'jī', group: ['激动', '激发'] },
          { char: '击', pinyin: 'jī', group: ['打击', '敲击'] },
          { char: '器', pinyin: 'qì', group: ['乐器', '机器'] },
          { char: '滴', pinyin: 'dī', group: ['水滴', '滴水'] },
          { char: '敲', pinyin: 'qiāo', group: ['敲打', '敲门'] },
          { char: '鸣', pinyin: 'míng', group: ['虫鸣', '鸣叫'] },
        ],
        quiz: [
          {
            q: '「琴」的拼音是？',
            options: ['qín', 'qíng', 'jīn', 'qīn'],
            answer: 0,
            explain: '琴 = qín（钢琴、琴声）。',
          },
          {
            q: '「激」可以组词？',
            options: ['激动', '吃水', '基础', '打击'],
            answer: 0,
            explain: '激 → 激动、激发。',
          },
        ],
      },
    ],
  },

  // ============================== 第八单元 ==============================
  {
    id: 8,
    slug: 'u8',
    title: '第八单元',
    titleZh: '美好品质',
    emoji: '🌟',
    theme: { color: '#44403c', colorSoft: '#e7e5e4' },
    lessons: [
      {
        id: 1,
        slug: 'u8-1',
        title: '司马光（文言文）',
        emoji: '🪨',
        passages: [
          {
            title: '全文（背诵）',
            text: '群儿戏于庭，一儿登瓮，足跌没水中，众皆弃去，光持石击瓮破之，水迸，儿得活。',
            note: '注释：庭＝庭院；瓮＝口小肚大的陶器；跌＝跌倒；没＝沉没；皆＝全、都；弃＝丢下；持＝拿；击＝砸；迸＝涌出。',
          },
        ],
        quiz: [
          {
            q: '「群儿戏于庭」中「庭」的意思是？',
            options: ['庭院', '大厅', '厨房', '学校'],
            answer: 0,
            explain: '庭＝庭院，孩子们在庭院里玩耍。',
          },
          {
            q: '司马光是怎么救出落水小孩的？',
            options: ['拿石头砸破水缸', '跳下去救', '叫大人', '伸手拉'],
            answer: 0,
            explain: '光持石击瓮破之——司马光拿石头砸破瓮，水流出来，小孩得救。',
          },
          {
            q: '「水迸，儿得活」中「迸」的意思是？',
            options: ['涌出', '进入', '停止', '结冰'],
            answer: 0,
            explain: '迸＝涌出，水流出来，小孩活了下来。',
          },
        ],
      },
      {
        id: 2,
        slug: 'u8-2',
        title: '掌声（要点）',
        emoji: '👏',
        passages: [
          {
            title: '课文要点（熟读理解）',
            text: '英子小时候生病落下残疾，不愿让别人看见她走路的样子。一次上台讲故事，同学们给了她热烈的掌声，使她鼓起勇气。后来英子变得开朗自信。故事告诉我们：掌声能给人鼓励和勇气。',
            note: '重点词：犹豫、骤然、经久不息。',
          },
        ],
        quiz: [
          {
            q: '同学们给英子的掌声起到了什么作用？',
            options: ['鼓励她、给她勇气', '嘲笑她', '让她难过', '没有作用'],
            answer: 0,
            explain: '掌声让英子鼓起勇气，变得自信开朗。',
          },
          {
            q: '英子后来变得怎样了？',
            options: ['开朗自信', '更自卑', '不爱说话', '离开学校'],
            answer: 0,
            explain: '得到鼓励后，英子变得开朗、自信。',
          },
        ],
      },
      {
        id: 3,
        slug: 'u8-3',
        title: '语文园地八 · 日积月累',
        emoji: '❤️',
        idioms: [
          {
            title: '关于仁爱的格言',
            kind: 'sayings',
            items: [
              { term: '爱人若爱其身。', source: '《墨子》' },
              { term: '不迁怒，不贰过。', source: '《论语》' },
              { term: '仁者爱人，有礼者敬人。', source: '《孟子》' },
              { term: '与人善言，暖于布帛；伤人以言，深于矛戟。', source: '《荀子》' },
            ],
          },
        ],
        quiz: [
          {
            q: '「爱人若爱其身」出自哪部典籍？',
            options: ['《墨子》', '《论语》', '《孟子》', '《荀子》'],
            answer: 0,
            explain: '「爱人若爱其身」出自《墨子》。',
          },
          {
            q: '「不迁怒，不贰过」意思是？',
            options: ['不把怒气转到别人身上，不犯同样的错', '不生气', '不说话', '不迟到'],
            answer: 0,
            explain: '出自《论语》，指不把脾气发泄在别人身上，不重犯同样的过失。',
          },
        ],
      },
      {
        id: 4,
        slug: 'u8-4',
        title: '第八单元 · 生字词',
        emoji: '✍️',
        hanzi: [
          { char: '司', pinyin: 'sī', group: ['司机', '公司'] },
          { char: '庭', pinyin: 'tíng', group: ['庭院', '家庭'] },
          { char: '登', pinyin: 'dēng', group: ['登山', '登高'] },
          { char: '跌', pinyin: 'diē', group: ['跌倒', '跌跤'] },
          { char: '众', pinyin: 'zhòng', group: ['观众', '众人'] },
          { char: '弃', pinyin: 'qì', group: ['放弃', '丢弃'] },
          { char: '持', pinyin: 'chí', group: ['坚持', '保持'] },
          { char: '雀', pinyin: 'què', group: ['灰雀', '麻雀'] },
          { char: '郊', pinyin: 'jiāo', group: ['郊外', '郊区'] },
          { char: '养', pinyin: 'yǎng', group: ['养病', '养成'] },
          { char: '粉', pinyin: 'fěn', group: ['粉红', '粉笔'] },
          { char: '谷', pinyin: 'gǔ', group: ['谷粒', '山谷'] },
          { char: '粒', pinyin: 'lì', group: ['米粒', '颗粒'] },
          { char: '男', pinyin: 'nán', group: ['男孩', '男生'] },
          { char: '或', pinyin: 'huò', group: ['或者', '或许'] },
          { char: '者', pinyin: 'zhě', group: ['作者', '读者'] },
          { char: '冻', pinyin: 'dòng', group: ['冻死', '冻结'] },
          { char: '惜', pinyin: 'xī', group: ['可惜', '珍惜'] },
          { char: '肯', pinyin: 'kěn', group: ['肯定', '不肯'] },
          { char: '诚', pinyin: 'chéng', group: ['诚实', '真诚'] },
        ],
        quiz: [
          {
            q: '「跌」的拼音是？',
            options: ['diē', 'dié', 'tiē', 'dīe'],
            answer: 0,
            explain: '跌 = diē（跌倒、跌跤）。',
          },
          {
            q: '「诚」可以组词？',
            options: ['诚实', '城市', '成功', '成分'],
            answer: 0,
            explain: '诚 → 诚实、真诚。',
          },
        ],
      },
    ],
  },
]

// ===================== 访问辅助函数 =====================
export function getUnit(slug: string | undefined): ChineseUnit | undefined {
  if (!slug) return undefined
  return chineseUnits.find((u) => u.slug === slug)
}

export function getChineseLesson(
  unitSlug: string | undefined,
  lessonSlug: string | undefined,
): { unit: ChineseUnit; lesson: ChineseLesson; unitIdx: number; lessonIdx: number } | undefined {
  const unitIdx = chineseUnits.findIndex((u) => u.slug === unitSlug)
  if (unitIdx < 0) return undefined
  const unit = chineseUnits[unitIdx]
  const lessonIdx = unit.lessons.findIndex((l) => l.slug === lessonSlug)
  if (lessonIdx < 0) return undefined
  return { unit, lesson: unit.lessons[lessonIdx], unitIdx, lessonIdx }
}

export const totalChineseLessons = chineseUnits.reduce((a, u) => a + u.lessons.length, 0)
