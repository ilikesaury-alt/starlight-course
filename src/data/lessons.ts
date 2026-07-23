// Starlight 0 预备级 - 96 课详细数据
// 每个单元 8 课,每课有独立的单词和句型
// 数据来源:从教材 PDF 提取的 starlight0_extracted.json

import type { Lesson } from './starlight'

export const lessonsByUnit: Record<number, Lesson[]> = {
  // === Unit 1: Hello! ===
  1: [
    { id: 1, title: 'Say Hello', titleZh: '说你好',
      words: [
        { en: 'hello', zh: '你好', emoji: '👋', ipa: '/həˈləʊ/' },
        { en: 'good', zh: '好的', emoji: '👍', ipa: '/ɡʊd/' },
        { en: 'great', zh: '很好', emoji: '🌟', ipa: '/ɡreɪt/' },
        { en: 'name', zh: '名字', emoji: '🏷️', ipa: '/neɪm/' },
        { en: 'friend', zh: '朋友', emoji: '🤝', ipa: '/frend/' },
      ],
      sentences: [
        { en: 'Hello! How are you?', zh: '你好！你好吗？', hint: '打招呼问好' },
        { en: "I'm good.", zh: '我很好。', hint: '回答自己状态' },
        { en: "Hello, what's your name?", zh: '你好，你叫什么名字？', hint: '询问对方名字' },
        { en: 'My name is Abby.', zh: '我叫Abby。', hint: '介绍自己名字' },
        { en: 'How are you, my friend?', zh: '你好吗，我的朋友？', hint: '问候朋友' },
      ]
    },
    { id: 2, title: 'Good Morning', titleZh: '早上好',
      words: [
        { en: 'morning', zh: '早上', emoji: '🌅', ipa: '/ˈmɔːnɪŋ/' },
        { en: 'afternoon', zh: '下午', emoji: '☀️', ipa: '/ˌɑːftəˈnuːn/' },
        { en: 'evening', zh: '晚上', emoji: '🌙', ipa: '/ˈiːvnɪŋ/' },
        { en: 'hello', zh: '你好', emoji: '👋', ipa: '/həˈləʊ/' },
      ],
      sentences: [
        { en: 'Good morning!', zh: '早上好！', hint: '早上打招呼' },
        { en: 'Good afternoon!', zh: '下午好！', hint: '下午打招呼' },
        { en: 'Good evening!', zh: '晚上好！', hint: '晚上打招呼' },
        { en: 'How are you?', zh: '你好吗？', hint: '问候对方' },
        { en: "I'm great!", zh: '我很好！', hint: '回答自己状态' },
      ]
    },
    { id: 3, title: 'Look At Me', titleZh: '看看我',
      words: [
        { en: 'boy', zh: '男孩', emoji: '👦', ipa: '/bɔɪ/' },
        { en: 'girl', zh: '女孩', emoji: '👧', ipa: '/ɡɜːl/' },
        { en: 'mirror', zh: '镜子', emoji: '🪞', ipa: '/ˈmɪrə/' },
        { en: 'missing', zh: '不见了', emoji: '🤔', ipa: '/ˈmɪsɪŋ/' },
      ],
      sentences: [
        { en: "Who's missing?", zh: '谁不见了？', hint: '找找谁不见了' },
        { en: 'Boy or girl?', zh: '男孩还是女孩？', hint: '辨别男孩女孩' },
        { en: 'How many boys?', zh: '有几个男孩？', hint: '询问数量' },
        { en: 'Two boys!', zh: '两个男孩！', hint: '回答数量' },
        { en: 'Look at the mirror.', zh: '看镜子。', hint: '看镜子' },
      ]
    },
    { id: 4, title: 'I Love Colors', titleZh: '我爱颜色',
      words: [
        { en: 'color', zh: '颜色', emoji: '🎨', ipa: '/ˈkʌlə/' },
        { en: 'red', zh: '红色', emoji: '🔴', ipa: '/red/' },
        { en: 'yellow', zh: '黄色', emoji: '🟡', ipa: '/ˈjeləʊ/' },
        { en: 'blue', zh: '蓝色', emoji: '🔵', ipa: '/bluː/' },
        { en: 'balloon', zh: '气球', emoji: '🎈', ipa: '/bəˈluːn/' },
      ],
      sentences: [
        { en: 'What color is the balloon?', zh: '气球是什么颜色？', hint: '询问颜色' },
        { en: "It's red.", zh: '是红色的。', hint: '回答颜色' },
        { en: "Let's spell the word.", zh: '我们来拼单词。', hint: '拼写单词' },
        { en: 'Which color do you like?', zh: '你喜欢哪种颜色？', hint: '询问喜好' },
        { en: 'Hello, colors!', zh: '你好，颜色！', hint: '跟颜色打招呼' },
      ]
    },
    { id: 5, title: 'Mix it Up', titleZh: '混合起来',
      words: [
        { en: 'green', zh: '绿色', emoji: '🟢', ipa: '/ɡriːn/' },
        { en: 'orange', zh: '橙色', emoji: '🟠', ipa: '/ˈɒrɪndʒ/' },
        { en: 'purple', zh: '紫色', emoji: '🟣', ipa: '/ˈpɜːpl/' },
        { en: 'rainbow', zh: '彩虹', emoji: '🌈', ipa: '/ˈreɪnbəʊ/' },
        { en: 'make', zh: '变成', emoji: '✨', ipa: '/meɪk/' },
      ],
      sentences: [
        { en: 'What color do blue and yellow make?', zh: '蓝色和黄色变成什么颜色？', hint: '颜色混合提问' },
        { en: 'Blue and yellow make green.', zh: '蓝色加黄色变成绿色。', hint: '颜色混合结果' },
        { en: 'What color is it?', zh: '它是什么颜色？', hint: '询问颜色' },
        { en: "It's green.", zh: '是绿色的。', hint: '回答颜色' },
        { en: 'I like orange.', zh: '我喜欢橙色。', hint: '表达喜好' },
      ]
    },
    { id: 6, title: 'Quiz 1', titleZh: '小测验1',
      words: [
        { en: 'hello', zh: '你好', emoji: '👋', ipa: '/həˈləʊ/' },
        { en: 'name', zh: '名字', emoji: '🏷️', ipa: '/neɪm/' },
        { en: 'boy', zh: '男孩', emoji: '👦', ipa: '/bɔɪ/' },
        { en: 'girl', zh: '女孩', emoji: '👧', ipa: '/ɡɜːl/' },
        { en: 'color', zh: '颜色', emoji: '🎨', ipa: '/ˈkʌlə/' },
      ],
      sentences: [
        { en: 'Can you say hello to our friends?', zh: '你能跟朋友们打招呼吗？', hint: '打招呼复习' },
        { en: 'Hello! My name is …', zh: '你好！我叫……', hint: '自我介绍' },
        { en: "What's your name?", zh: '你叫什么名字？', hint: '询问名字' },
        { en: 'Are you a boy or a girl?', zh: '你是男孩还是女孩？', hint: '询问性别' },
        { en: 'What color is number …?', zh: '数字几是什么颜色？', hint: '询问颜色' },
      ]
    },
    { id: 7, title: "Let's Count", titleZh: '一起来数数',
      words: [
        { en: 'one', zh: '一', emoji: '1️⃣', ipa: '/wʌn/' },
        { en: 'two', zh: '二', emoji: '2️⃣', ipa: '/tuː/' },
        { en: 'three', zh: '三', emoji: '3️⃣', ipa: '/θriː/' },
        { en: 'four', zh: '四', emoji: '4️⃣', ipa: '/fɔː/' },
        { en: 'five', zh: '五', emoji: '5️⃣', ipa: '/faɪv/' },
      ],
      sentences: [
        { en: "Let's count.", zh: '我们来数数。', hint: '数数' },
        { en: 'What number is missing?', zh: '哪个数字不见了？', hint: '找缺失数字' },
        { en: 'Five is missing.', zh: '五不见了。', hint: '回答缺失数字' },
        { en: 'Count and Match.', zh: '数一数，连一连。', hint: '数数配对' },
        { en: 'Put the numbers in order.', zh: '把数字排好顺序。', hint: '数字排序' },
      ]
    },
    { id: 8, title: 'I Know My Numbers', titleZh: '我认识数字',
      words: [
        { en: 'six', zh: '六', emoji: '6️⃣', ipa: '/sɪks/' },
        { en: 'seven', zh: '七', emoji: '7️⃣', ipa: '/ˈsevn/' },
        { en: 'eight', zh: '八', emoji: '8️⃣', ipa: '/eɪt/' },
        { en: 'nine', zh: '九', emoji: '9️⃣', ipa: '/naɪn/' },
        { en: 'ten', zh: '十', emoji: '🔟', ipa: '/ten/' },
      ],
      sentences: [
        { en: 'How many frogs are there?', zh: '有几只青蛙？', hint: '询问数量' },
        { en: 'Fill in the missing numbers.', zh: '填上缺少的数字。', hint: '填数字' },
        { en: 'How many animals are there?', zh: '有几只动物？', hint: '询问动物数量' },
        { en: '1 comes before it.', zh: '1在它前面。', hint: '数字前后顺序' },
        { en: '3 comes after it.', zh: '3在它后面。', hint: '数字前后顺序' },
      ]
    },
  ],

  // === Unit 2: Animals ===
  2: [
    { id: 1, title: 'Have a Pet', titleZh: '养宠物',
      words: [
        { en: 'pet', zh: '宠物', emoji: '🐾', ipa: '/pet/' },
        { en: 'dog', zh: '狗', emoji: '🐶', ipa: '/dɒɡ/' },
        { en: 'cat', zh: '猫', emoji: '🐱', ipa: '/kæt/' },
        { en: 'rabbit', zh: '兔子', emoji: '🐰', ipa: '/ˈræbɪt/' },
        { en: 'hamster', zh: '仓鼠', emoji: '🐹', ipa: '/ˈhæmstə/' },
      ],
      sentences: [
        { en: 'Hello, dog!', zh: '你好，小狗！', hint: '跟宠物打招呼' },
        { en: "Mom, it's a dog!", zh: '妈妈，这是一只狗！', hint: '告诉妈妈' },
        { en: "Yes, it's so cute.", zh: '是的，它真可爱。', hint: '夸宠物可爱' },
        { en: 'Which pet do you like?', zh: '你喜欢哪个宠物？', hint: '询问喜欢的宠物' },
        { en: 'I like the cat.', zh: '我喜欢猫。', hint: '表达喜好' },
      ]
    },
    { id: 2, title: 'Farm Animals', titleZh: '农场动物',
      words: [
        { en: 'cow', zh: '奶牛', emoji: '🐮', ipa: '/kaʊ/' },
        { en: 'pig', zh: '猪', emoji: '🐷', ipa: '/pɪɡ/' },
        { en: 'duck', zh: '鸭子', emoji: '🦆', ipa: '/dʌk/' },
        { en: 'chicken', zh: '鸡', emoji: '🐔', ipa: '/ˈtʃɪkɪn/' },
        { en: 'farm', zh: '农场', emoji: '🏡', ipa: '/fɑːm/' },
      ],
      sentences: [
        { en: "What's this animal?", zh: '这是什么动物？', hint: '询问动物' },
        { en: 'This is a cow.', zh: '这是一头奶牛。', hint: '介绍动物' },
        { en: 'What does the cow say?', zh: '奶牛怎么叫？', hint: '问动物叫声' },
        { en: 'Moo, moo!', zh: '哞，哞！', hint: '奶牛叫声' },
        { en: 'Hello, pig!', zh: '你好，小猪！', hint: '跟动物打招呼' },
      ]
    },
    { id: 3, title: 'Zoo Animals', titleZh: '动物园动物',
      words: [
        { en: 'zoo', zh: '动物园', emoji: '🦁', ipa: '/zuː/' },
        { en: 'parrot', zh: '鹦鹉', emoji: '🦜', ipa: '/ˈpærət/' },
        { en: 'bear', zh: '熊', emoji: '🐻', ipa: '/beə/' },
        { en: 'monkey', zh: '猴子', emoji: '🐵', ipa: '/ˈmʌŋki/' },
        { en: 'panda', zh: '熊猫', emoji: '🐼', ipa: '/ˈpændə/' },
      ],
      sentences: [
        { en: "Let's go to the zoo!", zh: '我们去动物园吧！', hint: '去动物园' },
        { en: 'What animal do you see?', zh: '你看到什么动物？', hint: '询问看到的动物' },
        { en: 'I see a panda.', zh: '我看到一只熊猫。', hint: '描述看到的动物' },
        { en: 'What animals do you see?', zh: '你看到哪些动物？', hint: '询问看到的动物' },
        { en: 'Name the animals.', zh: '说出动物的名字。', hint: '命名动物' },
      ]
    },
    { id: 4, title: 'Ocean Animals', titleZh: '海洋动物',
      words: [
        { en: 'ocean', zh: '海洋', emoji: '🌊', ipa: '/ˈəʊʃn/' },
        { en: 'fish', zh: '鱼', emoji: '🐟', ipa: '/fɪʃ/' },
        { en: 'dolphin', zh: '海豚', emoji: '🐬', ipa: '/ˈdɒlfɪn/' },
        { en: 'seahorse', zh: '海马', emoji: '🐴', ipa: '/ˈsiːhɔːs/' },
        { en: 'turtle', zh: '海龟', emoji: '🐢', ipa: '/ˈtɜːtl/' },
      ],
      sentences: [
        { en: "Let's go to the ocean.", zh: '我们去海洋吧。', hint: '去海洋' },
        { en: "What's this animal?", zh: '这是什么动物？', hint: '询问动物' },
        { en: 'This is a turtle.', zh: '这是一只海龟。', hint: '介绍动物' },
        { en: 'Swim like a fish.', zh: '像鱼一样游泳。', hint: '模仿动物动作' },
        { en: 'Dive like a dolphin.', zh: '像海豚一样潜水。', hint: '模仿动物动作' },
      ]
    },
    { id: 5, title: 'Bugs! Bugs! Bugs!', titleZh: '虫虫虫',
      words: [
        { en: 'bug', zh: '虫子', emoji: '🐛', ipa: '/bʌɡ/' },
        { en: 'butterfly', zh: '蝴蝶', emoji: '🦋', ipa: '/ˈbʌtəflaɪ/' },
        { en: 'spider', zh: '蜘蛛', emoji: '🕷️', ipa: '/ˈspaɪdə/' },
        { en: 'bee', zh: '蜜蜂', emoji: '🐝', ipa: '/biː/' },
        { en: 'caterpillar', zh: '毛毛虫', emoji: '🐛', ipa: '/ˈkætəpɪlə/' },
      ],
      sentences: [
        { en: "They're bugs.", zh: '它们是虫子。', hint: '介绍虫子' },
        { en: 'How many butterflies do you see?', zh: '你看到几只蝴蝶？', hint: '询问数量' },
        { en: 'I see 3 butterflies.', zh: '我看到3只蝴蝶。', hint: '回答数量' },
        { en: 'How many bees do you see?', zh: '你看到几只蜜蜂？', hint: '询问数量' },
        { en: 'I see four bees.', zh: '我看到四只蜜蜂。', hint: '回答数量' },
      ]
    },
    { id: 6, title: 'Quiz 2', titleZh: '小测验2',
      words: [
        { en: 'animal', zh: '动物', emoji: '🐾', ipa: '/ˈænɪml/' },
        { en: 'pet', zh: '宠物', emoji: '🐶', ipa: '/pet/' },
        { en: 'ocean', zh: '海洋', emoji: '🌊', ipa: '/ˈəʊʃn/' },
        { en: 'cute', zh: '可爱', emoji: '😍', ipa: '/kjuːt/' },
        { en: 'count', zh: '数数', emoji: '🔢', ipa: '/kaʊnt/' },
      ],
      sentences: [
        { en: 'How many animals are there?', zh: '有几只动物？', hint: '询问数量' },
        { en: "What's this animal?", zh: '这是什么动物？', hint: '询问动物' },
        { en: "It's a dog.", zh: '这是一只狗。', hint: '回答动物' },
        { en: 'What animals can you see in the ocean?', zh: '你能在海洋里看到什么动物？', hint: '询问海洋动物' },
        { en: "I like cats. It's so cute.", zh: '我喜欢猫。它真可爱。', hint: '表达喜好' },
      ]
    },
    { id: 7, title: 'Add It Up', titleZh: '加起来',
      words: [
        { en: 'leg', zh: '腿', emoji: '🦵', ipa: '/leɡ/' },
        { en: 'plus', zh: '加', emoji: '➕', ipa: '/plʌs/' },
        { en: 'equals', zh: '等于', emoji: '🟰', ipa: '/ˈiːkwəlz/' },
        { en: 'altogether', zh: '总共', emoji: '🧮', ipa: '/ˌɔːltəˈɡeðə/' },
        { en: 'addition', zh: '加法', emoji: '➕', ipa: '/əˈdɪʃn/' },
      ],
      sentences: [
        { en: 'How many legs does a dog have?', zh: '狗有几条腿？', hint: '询问数量' },
        { en: '4 plus 4 equals 8.', zh: '4加4等于8。', hint: '加法算式' },
        { en: 'How many legs do they have altogether?', zh: '它们总共有几条腿？', hint: '询问总数' },
        { en: 'They have 8 legs altogether.', zh: '它们总共有8条腿。', hint: '回答总数' },
        { en: 'Do the addition then say the sentence.', zh: '算一算再说句子。', hint: '做加法' },
      ]
    },
    { id: 8, title: 'What Comes Next', titleZh: '下一个是什么',
      words: [
        { en: 'pattern', zh: '规律', emoji: '🔁', ipa: '/ˈpætn/' },
        { en: 'next', zh: '下一个', emoji: '➡️', ipa: '/nekst/' },
        { en: 'come', zh: '来', emoji: '🚶', ipa: '/kʌm/' },
        { en: 'finish', zh: '完成', emoji: '✅', ipa: '/ˈfɪnɪʃ/' },
        { en: 'missing', zh: '缺少', emoji: '❓', ipa: '/ˈmɪsɪŋ/' },
      ],
      sentences: [
        { en: 'What comes next?', zh: '下一个是什么？', hint: '找规律' },
        { en: 'The cat comes next.', zh: '下一个是猫。', hint: '回答下一个' },
        { en: "It's a pattern.", zh: '这是一个规律。', hint: '描述规律' },
        { en: 'Can you read the pattern?', zh: '你能读出这个规律吗？', hint: '读规律' },
        { en: "Let's finish the patterns.", zh: '我们来完成规律。', hint: '完成规律' },
      ]
    },
  ],

  // === Unit 3: Food & Drinks ===
  3: [
    { id: 1, title: 'Fruit I Like', titleZh: '我喜欢的水果',
      words: [
        { en: 'fruit', zh: '水果', emoji: '🍉', ipa: '/fruːt/' },
        { en: 'apple', zh: '苹果', emoji: '🍎', ipa: '/ˈæpl/' },
        { en: 'watermelon', zh: '西瓜', emoji: '🍉', ipa: '/ˈwɔːtəmelən/' },
        { en: 'peach', zh: '桃子', emoji: '🍑', ipa: '/piːtʃ/' },
        { en: 'grapes', zh: '葡萄', emoji: '🍇', ipa: '/ɡreɪps/' },
      ],
      sentences: [
        { en: 'Hello, apple!', zh: '你好，苹果！', hint: '跟水果打招呼' },
        { en: 'What is it?', zh: '它是什么？', hint: '询问水果' },
        { en: "It's an apple.", zh: '它是苹果。', hint: '回答水果' },
        { en: 'Which fruit do you like?', zh: '你喜欢哪种水果？', hint: '询问喜好' },
        { en: 'I like grapes.', zh: '我喜欢葡萄。', hint: '表达喜好' },
      ]
    },
    { id: 2, title: 'All about Fruit', titleZh: '水果大探索',
      words: [
        { en: 'cherry', zh: '樱桃', emoji: '🍒', ipa: '/ˈtʃeri/' },
        { en: 'orange', zh: '橙子', emoji: '🍊', ipa: '/ˈɒrɪndʒ/' },
        { en: 'strawberry', zh: '草莓', emoji: '🍓', ipa: '/ˈstrɔːbəri/' },
        { en: 'banana', zh: '香蕉', emoji: '🍌', ipa: '/bəˈnɑːnə/' },
        { en: 'fruit', zh: '水果', emoji: '🍉', ipa: '/fruːt/' },
      ],
      sentences: [
        { en: "What's this fruit?", zh: '这是什么水果？', hint: '询问水果' },
        { en: "It's a red cherry.", zh: '它是一颗红樱桃。', hint: '描述水果' },
        { en: "It's a yellow banana.", zh: '它是一根黄香蕉。', hint: '描述水果' },
        { en: 'What color is it?', zh: '它是什么颜色？', hint: '询问颜色' },
        { en: 'I like bananas.', zh: '我喜欢香蕉。', hint: '表达喜好' },
      ]
    },
    { id: 3, title: 'My Drinks', titleZh: '我的饮料',
      words: [
        { en: 'juice', zh: '果汁', emoji: '🧃', ipa: '/dʒuːs/' },
        { en: 'water', zh: '水', emoji: '💧', ipa: '/ˈwɔːtə/' },
        { en: 'soda', zh: '汽水', emoji: '🥤', ipa: '/ˈsəʊdə/' },
        { en: 'milk', zh: '牛奶', emoji: '🥛', ipa: '/mɪlk/' },
        { en: 'drink', zh: '饮料', emoji: '🥤', ipa: '/drɪŋk/' },
      ],
      sentences: [
        { en: "What's this?", zh: '这是什么？', hint: '询问饮料' },
        { en: 'This is milk.', zh: '这是牛奶。', hint: '介绍饮料' },
        { en: 'What would you like to drink?', zh: '你想喝什么？', hint: '询问想喝的' },
        { en: "I'd like to drink juice.", zh: '我想喝果汁。', hint: '表达想喝的' },
        { en: "Let's make some fruit juice.", zh: '我们来做果汁吧。', hint: '做果汁' },
      ]
    },
    { id: 4, title: 'We Love Vegetables', titleZh: '我们爱蔬菜',
      words: [
        { en: 'vegetable', zh: '蔬菜', emoji: '🥦', ipa: '/ˈvedʒtəbl/' },
        { en: 'broccoli', zh: '西兰花', emoji: '🥦', ipa: '/ˈbrɒkəli/' },
        { en: 'potato', zh: '土豆', emoji: '🥔', ipa: '/pəˈteɪtəʊ/' },
        { en: 'tomato', zh: '番茄', emoji: '🍅', ipa: '/təˈmɑːtəʊ/' },
        { en: 'celery', zh: '芹菜', emoji: '🥬', ipa: '/ˈseləri/' },
      ],
      sentences: [
        { en: 'Do you know these vegetables?', zh: '你认识这些蔬菜吗？', hint: '询问蔬菜' },
        { en: 'What colors are they?', zh: '它们是什么颜色？', hint: '询问颜色' },
        { en: "Let's go shopping.", zh: '我们去购物吧。', hint: '去购物' },
        { en: 'I want broccoli.', zh: '我要西兰花。', hint: '表达想要的' },
        { en: 'Shopping List: broccoli, potato…', zh: '购物清单：西兰花、土豆……', hint: '购物清单' },
      ]
    },
    { id: 5, title: 'Vegetables I Eat', titleZh: '我吃的蔬菜',
      words: [
        { en: 'lettuce', zh: '生菜', emoji: '🥬', ipa: '/ˈletɪs/' },
        { en: 'cucumber', zh: '黄瓜', emoji: '🥒', ipa: '/ˈkjuːkʌmbə/' },
        { en: 'bean', zh: '豆子', emoji: '🫘', ipa: '/biːn/' },
        { en: 'carrot', zh: '胡萝卜', emoji: '🥕', ipa: '/ˈkærət/' },
        { en: 'salad', zh: '沙拉', emoji: '🥗', ipa: '/ˈsæləd/' },
      ],
      sentences: [
        { en: 'These are carrots.', zh: '这些是胡萝卜。', hint: '介绍蔬菜' },
        { en: 'Do you like vegetables?', zh: '你喜欢蔬菜吗？', hint: '询问喜好' },
        { en: 'Yes, I do.', zh: '是的，我喜欢。', hint: '肯定回答' },
        { en: "No, I don't.", zh: '不，我不喜欢。', hint: '否定回答' },
        { en: 'I like carrots.', zh: '我喜欢胡萝卜。', hint: '表达喜好' },
      ]
    },
    { id: 6, title: 'Quiz 3', titleZh: '小测验3',
      words: [
        { en: 'fruit', zh: '水果', emoji: '🍉', ipa: '/fruːt/' },
        { en: 'vegetable', zh: '蔬菜', emoji: '🥦', ipa: '/ˈvedʒtəbl/' },
        { en: 'drink', zh: '饮料', emoji: '🥤', ipa: '/drɪŋk/' },
        { en: 'plus', zh: '加', emoji: '➕', ipa: '/plʌs/' },
        { en: 'equal', zh: '等于', emoji: '🟰', ipa: '/ˈiːkwəl/' },
      ],
      sentences: [
        { en: 'What fruit do you like?', zh: '你喜欢什么水果？', hint: '询问喜欢的水果' },
        { en: 'I like apples.', zh: '我喜欢苹果。', hint: '表达喜好' },
        { en: 'Do you like vegetables?', zh: '你喜欢蔬菜吗？', hint: '询问喜好' },
        { en: "Yes, I do. / No, I don't.", zh: '是的，我喜欢。/ 不，我不喜欢。', hint: '回答喜好' },
        { en: 'What drinks would you like to drink?', zh: '你想喝什么饮料？', hint: '询问想喝的' },
      ]
    },
    { id: 7, title: 'Yummy Snacks', titleZh: '美味零食',
      words: [
        { en: 'snack', zh: '零食', emoji: '🍪', ipa: '/snæk/' },
        { en: 'chips', zh: '薯片', emoji: '🍟', ipa: '/tʃɪps/' },
        { en: 'lollipop', zh: '棒棒糖', emoji: '🍭', ipa: '/ˈlɒlipɒp/' },
        { en: 'gummy bear', zh: '小熊软糖', emoji: '🐻', ipa: '/ˈɡʌmi beə/' },
        { en: 'marshmallow', zh: '棉花糖', emoji: '🍡', ipa: '/mɑːʃˈmæləʊ/' },
      ],
      sentences: [
        { en: 'What do you want?', zh: '你想要什么？', hint: '询问想要什么' },
        { en: 'I want chips.', zh: '我要薯片。', hint: '表达想要的' },
        { en: 'What does 4 plus 2 equal?', zh: '4加2等于多少？', hint: '加法算式' },
        { en: 'What is missing?', zh: '什么不见了？', hint: '找缺失' },
        { en: 'Abracadabra!', zh: '阿布拉卡达布拉！', hint: '魔法咒语' },
      ]
    },
    { id: 8, title: 'Snack World', titleZh: '零食世界',
      words: [
        { en: 'jelly bean', zh: '果冻豆', emoji: '🍬', ipa: '/ˈdʒeli biːn/' },
        { en: 'popcorn', zh: '爆米花', emoji: '🍿', ipa: '/ˈpɒpkɔːn/' },
        { en: 'nut', zh: '坚果', emoji: '🥜', ipa: '/nʌt/' },
        { en: 'candy', zh: '糖果', emoji: '🍬', ipa: '/ˈkændi/' },
        { en: 'want', zh: '想要', emoji: '🙋', ipa: '/wɒnt/' },
      ],
      sentences: [
        { en: 'What do you want?', zh: '你想要什么？', hint: '询问想要什么' },
        { en: 'I want popcorn.', zh: '我要爆米花。', hint: '表达想要的' },
        { en: 'I want nuts and candies.', zh: '我要坚果和糖果。', hint: '表达多个想要' },
        { en: 'Do you want these?', zh: '你想要这些吗？', hint: '询问是否想要' },
        { en: 'What are they?', zh: '它们是什么？', hint: '询问是什么' },
      ]
    },
  ],

  // === Unit 4: Toys & Fun ===
  4: [
    { id: 1, title: 'My Toys', titleZh: '我的玩具',
      words: [
        { en: 'doll', zh: '洋娃娃', emoji: '🪆', ipa: '/dɒl/' },
        { en: 'blocks', zh: '积木', emoji: '🧱', ipa: '/blɒks/' },
        { en: 'play dough', zh: '橡皮泥', emoji: '🟡', ipa: '/pleɪ dəʊ/' },
        { en: 'puzzle', zh: '拼图', emoji: '🧩', ipa: '/ˈpʌz.əl/' },
      ],
      sentences: [
        { en: 'I have a doll.', zh: '我有一个洋娃娃。', hint: '表达拥有（单数）' },
        { en: 'I have blocks.', zh: '我有积木。', hint: '表达拥有（复数）' },
        { en: 'I have a puzzle.', zh: '我有一个拼图。', hint: '表达拥有' },
        { en: "What's missing?", zh: '哪个不见了？', hint: '询问缺失的物品' },
      ]
    },
    { id: 2, title: 'My Toy Shop', titleZh: '我的玩具店',
      words: [
        { en: 'car', zh: '小汽车', emoji: '🚗', ipa: '/kɑː/' },
        { en: 'train', zh: '火车', emoji: '🚂', ipa: '/treɪn/' },
        { en: 'airplane', zh: '飞机', emoji: '✈️', ipa: '/ˈeə.pleɪn/' },
        { en: 'scooter', zh: '滑板车', emoji: '🛴', ipa: '/ˈskuː.tə/' },
      ],
      sentences: [
        { en: 'I want a car.', zh: '我想要一辆小汽车。', hint: '表达想要' },
        { en: 'Which toy do you want?', zh: '你想要哪个玩具？', hint: '询问选择' },
        { en: "Let's go shopping.", zh: '我们去购物吧。', hint: '提议去做某事' },
        { en: 'I want a train.', zh: '我想要一列火车。', hint: '表达想要' },
      ]
    },
    { id: 3, title: 'Be Polite', titleZh: '懂礼貌',
      words: [
        { en: 'please', zh: '请', emoji: '🙏', ipa: '/pliːz/' },
        { en: 'sorry', zh: '对不起', emoji: '😔', ipa: '/ˈsɒr.i/' },
        { en: 'thanks', zh: '谢谢', emoji: '🙏', ipa: '/θæŋks/' },
        { en: 'okay', zh: '好的', emoji: '👌', ipa: '/ˌəʊˈkeɪ/' },
      ],
      sentences: [
        { en: 'Thank you!', zh: '谢谢你！', hint: '表达感谢' },
        { en: "I'm sorry.", zh: '对不起。', hint: '表达歉意' },
        { en: "It's okay.", zh: '没关系。', hint: '回应别人的道歉' },
        { en: 'Here you are!', zh: '给你！', hint: '递给别人物品时说' },
        { en: 'Please.', zh: '请。', hint: '礼貌地请求' },
      ]
    },
    { id: 4, title: 'Look! Superman!', titleZh: '看！超人！',
      words: [
        { en: 'Superman', zh: '超人', emoji: '🦸', ipa: '/ˈsuː.pə.mæn/' },
        { en: 'Spiderman', zh: '蜘蛛侠', emoji: '🕸️', ipa: '/ˈspaɪ.də.mæn/' },
        { en: 'princess', zh: '公主', emoji: '👸', ipa: '/ˈprɪn.ses/' },
        { en: 'Transformer', zh: '变形金刚', emoji: '🤖', ipa: '/trænsˈfɔː.mə/' },
      ],
      sentences: [
        { en: 'This is Spiderman.', zh: '这是蜘蛛侠。', hint: '介绍人物' },
        { en: 'This is Superman.', zh: '这是超人。', hint: '介绍人物' },
        { en: 'Who is this?', zh: '这是谁？', hint: '询问身份' },
        { en: 'I want to be Superman.', zh: '我想成为超人。', hint: '表达想成为的角色' },
      ]
    },
    { id: 5, title: 'I Love Music', titleZh: '我爱音乐',
      words: [
        { en: 'violin', zh: '小提琴', emoji: '🎻', ipa: '/ˌvaɪ.əˈlɪn/' },
        { en: 'guitar', zh: '吉他', emoji: '🎸', ipa: '/ɡɪˈtɑː/' },
        { en: 'flute', zh: '长笛', emoji: '🪈', ipa: '/fluːt/' },
        { en: 'piano', zh: '钢琴', emoji: '🎹', ipa: '/piˈæn.əʊ/' },
      ],
      sentences: [
        { en: "What's this?", zh: '这是什么？', hint: '询问事物' },
        { en: "It's a violin.", zh: '这是小提琴。', hint: '介绍乐器' },
        { en: "It's a guitar.", zh: '这是吉他。', hint: '介绍乐器' },
        { en: "It's a piano.", zh: '这是钢琴。', hint: '介绍乐器' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '小测验',
      words: [
        { en: 'doll', zh: '洋娃娃', emoji: '🪆', ipa: '/dɒl/' },
        { en: 'puzzle', zh: '拼图', emoji: '🧩', ipa: '/ˈpʌz.əl/' },
        { en: 'scooter', zh: '滑板车', emoji: '🛴', ipa: '/ˈskuː.tə/' },
        { en: 'Spiderman', zh: '蜘蛛侠', emoji: '🕸️', ipa: '/ˈspaɪ.də.mæn/' },
      ],
      sentences: [
        { en: 'What toys do you have?', zh: '你有什么玩具？', hint: '询问拥有的物品' },
        { en: 'I have a puzzle.', zh: '我有一个拼图。', hint: '回答拥有的玩具' },
        { en: 'What toys do you want?', zh: '你想要什么玩具？', hint: '询问想要的物品' },
        { en: 'This is Spiderman.', zh: '这是蜘蛛侠。', hint: '介绍人物' },
      ]
    },
    { id: 7, title: 'Show Time', titleZh: '表演时间',
      words: [
        { en: 'guitar', zh: '吉他', emoji: '🎸', ipa: '/ɡɪˈtɑː/' },
        { en: 'violin', zh: '小提琴', emoji: '🎻', ipa: '/ˌvaɪ.əˈlɪn/' },
        { en: 'flute', zh: '长笛', emoji: '🪈', ipa: '/fluːt/' },
        { en: 'piano', zh: '钢琴', emoji: '🎹', ipa: '/piˈæn.əʊ/' },
      ],
      sentences: [
        { en: 'Can you play the violin?', zh: '你会拉小提琴吗？', hint: '询问会否演奏乐器' },
        { en: 'I can play the piano.', zh: '我会弹钢琴。', hint: '表达能力' },
        { en: 'What instruments can you play?', zh: '你会演奏什么乐器？', hint: '询问能演奏的乐器' },
        { en: 'I can play the guitar.', zh: '我会弹吉他。', hint: '表达能力' },
      ]
    },
    { id: 8, title: 'Take Away', titleZh: '减一减',
      words: [
        { en: 'count', zh: '数数', emoji: '🔢', ipa: '/kaʊnt/' },
        { en: 'left', zh: '剩下的', emoji: '➡️', ipa: '/left/' },
        { en: 'take away', zh: '减去', emoji: '➖', ipa: '/teɪk əˈweɪ/' },
        { en: 'candy', zh: '糖果', emoji: '🍬', ipa: '/ˈkæn.di/' },
      ],
      sentences: [
        { en: 'How many candies are there?', zh: '有多少颗糖？', hint: '询问数量' },
        { en: 'How many are left?', zh: '还剩多少？', hint: '询问剩余数量' },
        { en: '5 take away 2 is 3.', zh: '5减去2等于3。', hint: '减法运算' },
        { en: "Let's count!", zh: '我们来数一数！', hint: '提议数数' },
      ]
    },
  ],

  // === Unit 5: Opposites ===
  5: [
    { id: 1, title: 'Big or Small', titleZh: '大还是小',
      words: [
        { en: 'big', zh: '大的', emoji: '🐘', ipa: '/bɪɡ/' },
        { en: 'small', zh: '小的', emoji: '🐭', ipa: '/smɔːl/' },
        { en: 'ant', zh: '蚂蚁', emoji: '🐜', ipa: '/ænt/' },
        { en: 'lion', zh: '狮子', emoji: '🦁', ipa: '/ˈlaɪ.ən/' },
      ],
      sentences: [
        { en: "It's big.", zh: '它很大。', hint: '描述大小' },
        { en: "It's small.", zh: '它很小。', hint: '描述大小' },
        { en: 'Hello, ant!', zh: '你好，蚂蚁！', hint: '打招呼' },
        { en: 'The melon is big.', zh: '瓜很大。', hint: '描述事物的大小' },
      ]
    },
    { id: 2, title: "It's Loud", titleZh: '好大声',
      words: [
        { en: 'loud', zh: '大声的', emoji: '🔊', ipa: '/laʊd/' },
        { en: 'quiet', zh: '安静的', emoji: '🤫', ipa: '/ˈkwaɪ.ət/' },
        { en: 'drumbeat', zh: '鼓声', emoji: '🥁', ipa: '/ˈdrʌm.biːt/' },
        { en: 'whisper', zh: '低语', emoji: '💬', ipa: '/ˈwɪs.pə/' },
      ],
      sentences: [
        { en: "It's loud.", zh: '很大声。', hint: '描述声音大' },
        { en: "It's quiet.", zh: '很安静。', hint: '描述声音小' },
        { en: 'What is very loud?', zh: '什么声音很大？', hint: '询问声音大的事物' },
        { en: 'Quieter and quieter.', zh: '越来越安静。', hint: '表达程度渐变' },
      ]
    },
    { id: 3, title: 'Running Race', titleZh: '跑步比赛',
      words: [
        { en: 'fast', zh: '快的', emoji: '⚡', ipa: '/fɑːst/' },
        { en: 'slow', zh: '慢的', emoji: '🐌', ipa: '/sləʊ/' },
        { en: 'rabbit', zh: '兔子', emoji: '🐇', ipa: '/ˈræb.ɪt/' },
        { en: 'turtle', zh: '乌龟', emoji: '🐢', ipa: '/ˈtɜː.tl̩/' },
      ],
      sentences: [
        { en: 'Ready? Go!', zh: '准备？开始！', hint: '比赛开始的口令' },
        { en: 'The rabbit is fast.', zh: '兔子很快。', hint: '描述动物的速度' },
        { en: 'The turtle is slow.', zh: '乌龟很慢。', hint: '描述动物的速度' },
        { en: 'You can run really fast.', zh: '你跑得真快。', hint: '夸赞速度' },
      ]
    },
    { id: 4, title: 'Is It Good', titleZh: '好不好',
      words: [
        { en: 'good', zh: '好的', emoji: '👍', ipa: '/ɡʊd/' },
        { en: 'bad', zh: '坏的', emoji: '👎', ipa: '/bæd/' },
        { en: 'awful', zh: '糟糕的', emoji: '😫', ipa: '/ˈɔː.fʊl/' },
      ],
      sentences: [
        { en: "It's good.", zh: '很好。', hint: '评价好' },
        { en: "It's bad.", zh: '很差。', hint: '评价差' },
        { en: 'Is it good or bad?', zh: '它是好还是差？', hint: '询问评价' },
        { en: "It's awful.", zh: '太糟糕了。', hint: '强烈地评价差' },
      ]
    },
    { id: 5, title: 'A Fat Cat', titleZh: '一只胖猫',
      words: [
        { en: 'fat', zh: '胖的', emoji: '🐷', ipa: '/fæt/' },
        { en: 'thin', zh: '瘦的', emoji: '🐁', ipa: '/θɪn/' },
        { en: 'cat', zh: '猫', emoji: '🐱', ipa: '/kæt/' },
        { en: 'monkey', zh: '猴子', emoji: '🐵', ipa: '/ˈmʌŋ.ki/' },
      ],
      sentences: [
        { en: "It's a fat cat.", zh: '这是一只胖猫。', hint: '描述动物胖瘦' },
        { en: "It's a thin cat.", zh: '这是一只瘦猫。', hint: '描述动物胖瘦' },
        { en: 'Is it thin or fat?', zh: '它是瘦还是胖？', hint: '询问胖瘦特征' },
        { en: 'Which monkey is fat?', zh: '哪只猴子胖？', hint: '询问选择' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '小测验',
      words: [
        { en: 'big', zh: '大的', emoji: '🐘', ipa: '/bɪɡ/' },
        { en: 'fast', zh: '快的', emoji: '⚡', ipa: '/fɑːst/' },
        { en: 'fat', zh: '胖的', emoji: '🐷', ipa: '/fæt/' },
        { en: 'good', zh: '好的', emoji: '👍', ipa: '/ɡʊd/' },
      ],
      sentences: [
        { en: 'Is it good or bad?', zh: '它是好还是差？', hint: '询问评价' },
        { en: 'Is it big or small?', zh: '它是大还是小？', hint: '询问大小' },
        { en: 'Is it fast or slow?', zh: '它是快还是慢？', hint: '询问速度' },
        { en: 'Is it thin or fat?', zh: '它是瘦还是胖？', hint: '询问胖瘦' },
      ]
    },
    { id: 7, title: "I'm Happy", titleZh: '我很开心',
      words: [
        { en: 'happy', zh: '开心的', emoji: '😊', ipa: '/ˈhæp.i/' },
        { en: 'sad', zh: '难过的', emoji: '😢', ipa: '/sæd/' },
        { en: 'feel', zh: '感觉', emoji: '💭', ipa: '/fiːl/' },
        { en: 'clap', zh: '拍手', emoji: '👏', ipa: '/klæp/' },
      ],
      sentences: [
        { en: "I'm happy.", zh: '我很开心。', hint: '表达开心情绪' },
        { en: "I'm sad.", zh: '我很难过。', hint: '表达难过情绪' },
        { en: 'How do you feel?', zh: '你感觉怎么样？', hint: '询问感受' },
        { en: "If you're happy, clap your hands.", zh: '如果你开心就拍拍手。', hint: '条件句' },
      ]
    },
    { id: 8, title: "It's Hot", titleZh: '好热',
      words: [
        { en: 'hot', zh: '热的', emoji: '🔥', ipa: '/hɒt/' },
        { en: 'cold', zh: '冷的', emoji: '❄️', ipa: '/kəʊld/' },
        { en: 'snowman', zh: '雪人', emoji: '⛄', ipa: '/ˈsnəʊ.mæn/' },
      ],
      sentences: [
        { en: "It's hot.", zh: '很热。', hint: '描述温度高' },
        { en: "It's cold.", zh: '很冷。', hint: '描述温度低' },
        { en: 'Is it hot or cold?', zh: '它是热还是冷？', hint: '询问温度' },
        { en: 'Is the snowman hot?', zh: '雪人热吗？', hint: '是非问句' },
        { en: 'Which one is cold?', zh: '哪个是冷的？', hint: '询问选择' },
      ]
    },
  ],

  // === Unit 6: My Body ===
  6: [
    { id: 1, title: 'My Face', titleZh: '我的脸',
      words: [
        { en: 'nose', zh: '鼻子', emoji: '👃', ipa: '/nəʊz/' },
        { en: 'mouth', zh: '嘴巴', emoji: '👄', ipa: '/maʊθ/' },
        { en: 'eye', zh: '眼睛', emoji: '👁️', ipa: '/aɪ/' },
        { en: 'ear', zh: '耳朵', emoji: '👂', ipa: '/ɪə/' },
      ],
      sentences: [
        { en: 'What do you have?', zh: '你有什么？', hint: '询问拥有' },
        { en: 'I have a nose.', zh: '我有一个鼻子。', hint: '表达拥有（单数）' },
        { en: 'I have 2 eyes.', zh: '我有两只眼睛。', hint: '表达拥有（复数）' },
        { en: 'Eyes can see.', zh: '眼睛能看。', hint: '表达器官功能' },
        { en: 'A nose can smell.', zh: '鼻子能闻。', hint: '表达器官功能' },
      ]
    },
    { id: 2, title: 'Oh! My Mouth!', titleZh: '哦！我的嘴巴！',
      words: [
        { en: 'eat', zh: '吃', emoji: '🍽️', ipa: '/iːt/' },
        { en: 'drink', zh: '喝', emoji: '🥤', ipa: '/drɪŋk/' },
        { en: 'sing', zh: '唱歌', emoji: '🎤', ipa: '/sɪŋ/' },
        { en: 'smell', zh: '闻', emoji: '👃', ipa: '/smel/' },
      ],
      sentences: [
        { en: 'I can eat.', zh: '我会吃。', hint: '表达能力' },
        { en: 'I can drink.', zh: '我会喝。', hint: '表达能力' },
        { en: 'I can sing.', zh: '我会唱歌。', hint: '表达能力' },
        { en: 'What can your mouth do?', zh: '你的嘴巴能做什么？', hint: '询问器官功能' },
      ]
    },
    { id: 3, title: 'My Body Parts', titleZh: '我的身体部位',
      words: [
        { en: 'arm', zh: '胳膊', emoji: '💪', ipa: '/ɑːm/' },
        { en: 'leg', zh: '腿', emoji: '🦵', ipa: '/leɡ/' },
        { en: 'hand', zh: '手', emoji: '✋', ipa: '/hænd/' },
        { en: 'foot', zh: '脚', emoji: '🦶', ipa: '/fʊt/' },
      ],
      sentences: [
        { en: 'I have 2 arms.', zh: '我有两只胳膊。', hint: '表达拥有（复数）' },
        { en: 'I have 2 hands.', zh: '我有两只手。', hint: '表达拥有（复数）' },
        { en: 'Clap your hands!', zh: '拍拍你的手！', hint: '指令动作' },
        { en: 'Touch your feet!', zh: '摸摸你的脚！', hint: '指令动作' },
      ]
    },
    { id: 4, title: 'What Can You Do', titleZh: '你会做什么',
      words: [
        { en: 'run', zh: '跑', emoji: '🏃', ipa: '/rʌn/' },
        { en: 'jump', zh: '跳', emoji: '🦘', ipa: '/dʒʌmp/' },
        { en: 'walk', zh: '走', emoji: '🚶', ipa: '/wɔːk/' },
        { en: 'frog', zh: '青蛙', emoji: '🐸', ipa: '/frɒɡ/' },
      ],
      sentences: [
        { en: 'I can run.', zh: '我会跑。', hint: '表达能力' },
        { en: 'I can walk.', zh: '我会走。', hint: '表达能力' },
        { en: 'I can jump.', zh: '我会跳。', hint: '表达能力' },
        { en: 'Can you walk like a lion?', zh: '你能像狮子一样走吗？', hint: '询问能否模仿' },
        { en: 'What can they do?', zh: '它们能做什么？', hint: '询问能力' },
      ]
    },
    { id: 5, title: 'Magic Hands', titleZh: '神奇的手',
      words: [
        { en: 'paint', zh: '涂色画画', emoji: '🎨', ipa: '/peɪnt/' },
        { en: 'draw', zh: '画画', emoji: '✏️', ipa: '/drɔː/' },
        { en: 'write', zh: '写字', emoji: '✍️', ipa: '/raɪt/' },
        { en: 'card', zh: '卡片', emoji: '🃏', ipa: '/kɑːd/' },
      ],
      sentences: [
        { en: 'I can paint.', zh: '我会涂色画画。', hint: '表达能力' },
        { en: 'I can draw.', zh: '我会画画。', hint: '表达能力' },
        { en: 'I can write.', zh: '我会写字。', hint: '表达能力' },
        { en: 'Can you make a card?', zh: '你能做一张卡片吗？', hint: '询问能否制作' },
        { en: 'What can hands do?', zh: '手能做什么？', hint: '询问器官功能' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '小测验',
      words: [
        { en: 'jump', zh: '跳', emoji: '🦘', ipa: '/dʒʌmp/' },
        { en: 'run', zh: '跑', emoji: '🏃', ipa: '/rʌn/' },
        { en: 'spin', zh: '旋转', emoji: '🌀', ipa: '/spɪn/' },
        { en: 'bend', zh: '弯腰', emoji: '🙇', ipa: '/bend/' },
      ],
      sentences: [
        { en: 'Are you happy or sad?', zh: '你开心还是难过？', hint: '询问情绪' },
        { en: 'Is it hot or cold?', zh: '它热还是冷？', hint: '询问温度' },
        { en: 'What can you do?', zh: '你会做什么？', hint: '询问能力' },
        { en: 'I can eat.', zh: '我会吃。', hint: '回答自己的能力' },
        { en: 'Touch and say the body parts.', zh: '摸一摸并说出身体部位。', hint: '指令动作' },
      ]
    },
    { id: 7, title: "Let's Dance", titleZh: '一起来跳舞',
      words: [
        { en: 'bend', zh: '弯腰', emoji: '🙇', ipa: '/bend/' },
        { en: 'spin', zh: '旋转', emoji: '🌀', ipa: '/spɪn/' },
        { en: 'dance', zh: '跳舞', emoji: '💃', ipa: '/dɑːns/' },
      ],
      sentences: [
        { en: "Let's bend.", zh: '我们弯一弯。', hint: '提议动作' },
        { en: "Let's spin.", zh: '我们转一转。', hint: '提议动作' },
        { en: "Let's dance.", zh: '我们跳舞吧。', hint: '提议动作' },
        { en: 'I can bend.', zh: '我会弯腰。', hint: '表达能力' },
        { en: 'I can dance.', zh: '我会跳舞。', hint: '表达能力' },
      ]
    },
    { id: 8, title: 'All About Me', titleZh: '关于我自己',
      words: [
        { en: 'boy', zh: '男孩', emoji: '👦', ipa: '/bɔɪ/' },
        { en: 'girl', zh: '女孩', emoji: '👧', ipa: '/ɡɜːl/' },
        { en: 'hand', zh: '手', emoji: '✋', ipa: '/hænd/' },
        { en: 'foot', zh: '脚', emoji: '🦶', ipa: '/fʊt/' },
        { en: 'eye', zh: '眼睛', emoji: '👁️', ipa: '/aɪ/' },
      ],
      sentences: [
        { en: 'She is a girl.', zh: '她是一个女孩。', hint: '介绍性别' },
        { en: 'He is a boy.', zh: '他是一个男孩。', hint: '介绍性别' },
        { en: 'I have two eyes.', zh: '我有两只眼睛。', hint: '表达拥有（身体部位）' },
        { en: 'How old are you?', zh: '你几岁了？', hint: '询问年龄' },
        { en: 'I like apples.', zh: '我喜欢苹果。', hint: '表达喜好' },
      ]
    },
  ],

  // === Unit 7: My Home ===
  7: [
    { id: 1, title: 'My Bedroom', titleZh: '我的卧室',
      words: [
        { en: 'bed', zh: '床', emoji: '🛏️', ipa: '/bed/' },
        { en: 'quilt', zh: '被子', emoji: '🛌', ipa: '/kwɪlt/' },
        { en: 'pillow', zh: '枕头', emoji: '🛏️', ipa: '/ˈpɪləʊ/' },
        { en: 'picture', zh: '图画', emoji: '🖼️', ipa: '/ˈpɪktʃə(r)/' },
      ],
      sentences: [
        { en: 'There is a bed.', zh: '有一张床。', hint: '描述卧室里有某物' },
        { en: 'There is a pillow.', zh: '有一个枕头。', hint: '描述某处有某物' },
        { en: 'There is a picture.', zh: '有一幅画。', hint: '描述墙上有画' },
        { en: 'Is there a bed?', zh: '有一张床吗？', hint: '询问某处是否有某物' },
      ]
    },
    { id: 2, title: 'My Living Room', titleZh: '我的客厅',
      words: [
        { en: 'sofa', zh: '沙发', emoji: '🛋️', ipa: '/ˈsəʊfə/' },
        { en: 'clock', zh: '时钟', emoji: '🕑', ipa: '/klɒk/' },
        { en: 'TV', zh: '电视', emoji: '📺', ipa: '/ˌtiːˈviː/' },
        { en: 'vase', zh: '花瓶', emoji: '🏺', ipa: '/vɑːz/' },
        { en: 'table', zh: '桌子', emoji: '🪑', ipa: '/ˈteɪbl/' },
      ],
      sentences: [
        { en: 'There is a sofa.', zh: '有一张沙发。', hint: '描述客厅里有沙发' },
        { en: 'There is a clock.', zh: '有一个时钟。', hint: '描述某处有时钟' },
        { en: 'There is a table.', zh: '有一张桌子。', hint: '描述客厅里有桌子' },
        { en: 'There is a vase.', zh: '有一个花瓶。', hint: '描述某处有花瓶' },
      ]
    },
    { id: 3, title: 'The Bathroom', titleZh: '浴室',
      words: [
        { en: 'toilet', zh: '马桶', emoji: '🚽', ipa: '/ˈtɔɪlət/' },
        { en: 'tub', zh: '浴缸', emoji: '🛁', ipa: '/tʌb/' },
        { en: 'sink', zh: '洗手池', emoji: '🚰', ipa: '/sɪŋk/' },
        { en: 'mirror', zh: '镜子', emoji: '🪞', ipa: '/ˈmɪrə(r)/' },
      ],
      sentences: [
        { en: 'There is a toilet.', zh: '有一个马桶。', hint: '描述浴室里有马桶' },
        { en: 'There is a tub.', zh: '有一个浴缸。', hint: '描述浴室里有浴缸' },
        { en: 'There is a sink.', zh: '有一个洗手池。', hint: '描述浴室里有洗手池' },
        { en: 'There is a mirror.', zh: '有一面镜子。', hint: '描述浴室里有镜子' },
        { en: 'Is there a tub?', zh: '有浴缸吗？', hint: '询问浴室里是否有某物' },
      ]
    },
    { id: 4, title: 'My Garden', titleZh: '我的花园',
      words: [
        { en: 'grass', zh: '草', emoji: '🌱', ipa: '/ɡrɑːs/' },
        { en: 'soil', zh: '泥土', emoji: '🟤', ipa: '/sɔɪl/' },
        { en: 'shovel', zh: '铲子', emoji: '🪏', ipa: '/ˈʃʌvl/' },
        { en: 'flower', zh: '花', emoji: '🌸', ipa: '/ˈflaʊə(r)/' },
      ],
      sentences: [
        { en: 'There is grass.', zh: '有草。', hint: '描述花园里有草' },
        { en: 'There is soil.', zh: '有泥土。', hint: '描述花园里有泥土' },
        { en: 'There is a shovel.', zh: '有一把铲子。', hint: '描述花园里有铲子' },
        { en: 'There are flowers.', zh: '有一些花。', hint: '用复数描述花园里有多朵花' },
        { en: 'Are there flowers?', zh: '有花吗？', hint: '询问花园里是否有花（复数）' },
      ]
    },
    { id: 5, title: 'The Kitchen', titleZh: '厨房',
      words: [
        { en: 'knife', zh: '刀', emoji: '🔪', ipa: '/naɪf/' },
        { en: 'pan', zh: '平底锅', emoji: '🍳', ipa: '/pæn/' },
        { en: 'cupboard', zh: '橱柜', emoji: '🚪', ipa: '/ˈkʌbəd/' },
        { en: 'stove', zh: '炉子', emoji: '🔥', ipa: '/stəʊv/' },
      ],
      sentences: [
        { en: 'There is a knife.', zh: '有一把刀。', hint: '描述厨房里有刀' },
        { en: 'There is a pan.', zh: '有一个平底锅。', hint: '描述厨房里有锅' },
        { en: 'There is a cupboard.', zh: '有一个橱柜。', hint: '描述厨房里有橱柜' },
        { en: 'There is a stove.', zh: '有一个炉子。', hint: '描述厨房里有炉子' },
        { en: 'Is there a pan?', zh: '有平底锅吗？', hint: '询问厨房里是否有某物' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '小测验',
      words: [
        { en: 'bedroom', zh: '卧室', emoji: '🛏️', ipa: '/ˈbedruːm/' },
        { en: 'bathroom', zh: '浴室', emoji: '🛁', ipa: '/ˈbɑːθruːm/' },
        { en: 'kitchen', zh: '厨房', emoji: '🍳', ipa: '/ˈkɪtʃɪn/' },
        { en: 'garden', zh: '花园', emoji: '🌷', ipa: '/ˈɡɑːdn/' },
      ],
      sentences: [
        { en: 'What room is it?', zh: '这是什么房间？', hint: '询问房间名称' },
        { en: 'What is there in the bedroom?', zh: '卧室里有什么？', hint: '询问某房间里的物品' },
        { en: 'There is a bed.', zh: '有一张床。', hint: '回答房间里的物品' },
        { en: 'Is it a clock?', zh: '它是时钟吗？', hint: '询问某物是否是某件东西' },
      ]
    },
    { id: 7, title: 'My Study', titleZh: '我的书房',
      words: [
        { en: 'desk', zh: '书桌', emoji: '🪑', ipa: '/desk/' },
        { en: 'lamp', zh: '台灯', emoji: '💡', ipa: '/læmp/' },
        { en: 'bookshelf', zh: '书架', emoji: '📚', ipa: '/ˈbʊkʃelf/' },
        { en: 'book', zh: '书', emoji: '📖', ipa: '/bʊk/' },
      ],
      sentences: [
        { en: 'There is a desk.', zh: '有一张书桌。', hint: '描述书房里有书桌' },
        { en: 'There is a lamp.', zh: '有一盏台灯。', hint: '描述书房里有台灯' },
        { en: 'There is a bookshelf.', zh: '有一个书架。', hint: '描述书房里有书架' },
        { en: 'There are some books.', zh: '有一些书。', hint: '用复数描述书房里有多本书' },
        { en: 'There is a red book.', zh: '有一本红色的书。', hint: '描述带颜色的物品' },
      ]
    },
    { id: 8, title: 'Review', titleZh: '复习',
      words: [
        { en: 'living room', zh: '客厅', emoji: '🛋️', ipa: '/ˈlɪvɪŋ ruːm/' },
        { en: 'study', zh: '书房', emoji: '📚', ipa: '/ˈstʌdi/' },
        { en: 'house', zh: '房子', emoji: '🏠', ipa: '/haʊs/' },
        { en: 'room', zh: '房间', emoji: '🚪', ipa: '/ruːm/' },
      ],
      sentences: [
        { en: 'This is my house.', zh: '这是我的房子。', hint: '介绍自己的家' },
        { en: 'How many rooms are there?', zh: '有多少个房间？', hint: '询问房间数量' },
        { en: 'There are five rooms.', zh: '有五个房间。', hint: '回答房间数量' },
        { en: 'What room is this?', zh: '这是什么房间？', hint: '询问房间名称' },
        { en: 'There is a TV in the living room.', zh: '客厅里有一台电视。', hint: '描述某房间里有某物' },
      ]
    },
  ],

  // === Unit 8: Food Groups ===
  8: [
    { id: 1, title: 'Fruit', titleZh: '水果',
      words: [
        { en: 'kiwifruit', zh: '猕猴桃', emoji: '🥝', ipa: '/ˈkiːwiːfruːt/' },
        { en: 'pineapple', zh: '菠萝', emoji: '🍍', ipa: '/ˈpaɪnæpl/' },
        { en: 'dragon fruit', zh: '火龙果', emoji: '🐉', ipa: '/ˈdræɡən fruːt/' },
        { en: 'lychee', zh: '荔枝', emoji: '🍇', ipa: '/ˈlaɪtʃiː/' },
      ],
      sentences: [
        { en: 'What would you like?', zh: '你想要什么？', hint: '礼貌询问对方想要什么' },
        { en: "I'd like kiwifruit.", zh: '我想要猕猴桃。', hint: '礼貌表达自己想要某物' },
        { en: "I'd like pineapples.", zh: '我想要菠萝。', hint: '用复数表达想要的水果' },
        { en: 'Do you like fruit?', zh: '你喜欢水果吗？', hint: '询问是否喜欢某物' },
      ]
    },
    { id: 2, title: 'Vegetables', titleZh: '蔬菜',
      words: [
        { en: 'cauliflower', zh: '花椰菜', emoji: '🥦', ipa: '/ˈkɒliflaʊə(r)/' },
        { en: 'eggplant', zh: '茄子', emoji: '🍆', ipa: '/ˈeɡplɑːnt/' },
        { en: 'pumpkin', zh: '南瓜', emoji: '🎃', ipa: '/ˈpʌmpkɪn/' },
        { en: 'onion', zh: '洋葱', emoji: '🧅', ipa: '/ˈʌnjən/' },
      ],
      sentences: [
        { en: 'What do you want?', zh: '你想要什么？', hint: '询问对方想要什么' },
        { en: 'I want cauliflowers.', zh: '我想要花椰菜。', hint: '表达自己想要花椰菜' },
        { en: 'I want pumpkins.', zh: '我想要南瓜。', hint: '表达自己想要南瓜' },
        { en: 'I want eggplants.', zh: '我想要茄子。', hint: '表达自己想要茄子' },
        { en: 'I want onions.', zh: '我想要洋葱。', hint: '表达自己想要洋葱' },
      ]
    },
    { id: 3, title: 'Seafood', titleZh: '海鲜',
      words: [
        { en: 'squid', zh: '鱿鱼', emoji: '🦑', ipa: '/skwɪd/' },
        { en: 'crab', zh: '螃蟹', emoji: '🦀', ipa: '/kræb/' },
        { en: 'oyster', zh: '牡蛎', emoji: '🦪', ipa: '/ˈɔɪstə(r)/' },
        { en: 'shrimp', zh: '虾', emoji: '🦐', ipa: '/ʃrɪmp/' },
      ],
      sentences: [
        { en: "I'd like a crab.", zh: '我想要一只螃蟹。', hint: '用单数表达想要的海鲜' },
        { en: "I'd like some shrimps.", zh: '我想要一些虾。', hint: '用 some 表达想要一些' },
        { en: "I'd like some oysters.", zh: '我想要一些牡蛎。', hint: '用复数表达想要的海鲜' },
        { en: "I'd like a squid.", zh: '我想要一只鱿鱼。', hint: '用单数表达想要的海鲜' },
        { en: 'What would you like?', zh: '你想要什么？', hint: '礼貌询问对方想要什么' },
      ]
    },
    { id: 4, title: 'Snacks', titleZh: '零食',
      words: [
        { en: 'raisins', zh: '葡萄干', emoji: '🍇', ipa: '/ˈreɪzənz/' },
        { en: 'chocolate', zh: '巧克力', emoji: '🍫', ipa: '/ˈtʃɒklət/' },
        { en: 'nori', zh: '海苔', emoji: '🟢', ipa: '/ˈnɔːri/' },
        { en: 'cookie', zh: '饼干', emoji: '🍪', ipa: '/ˈkʊki/' },
      ],
      sentences: [
        { en: 'What snacks do you want?', zh: '你想要什么零食？', hint: '询问对方想要的零食' },
        { en: 'I want chocolate.', zh: '我想要巧克力。', hint: '表达想要的零食' },
        { en: 'I want raisins.', zh: '我想要葡萄干。', hint: '表达想要的零食' },
        { en: 'I want nori.', zh: '我想要海苔。', hint: '表达想要的零食' },
        { en: 'I want cookies.', zh: '我想要饼干。', hint: '用复数表达想要的饼干' },
      ]
    },
    { id: 5, title: 'Chinese Everyday Food', titleZh: '中国日常食物',
      words: [
        { en: 'rice', zh: '米饭', emoji: '🍚', ipa: '/raɪs/' },
        { en: 'dumplings', zh: '饺子', emoji: '🥟', ipa: '/ˈdʌmplɪŋz/' },
        { en: 'steamed buns', zh: '馒头', emoji: '🍞', ipa: '/stiːmd bʌnz/' },
        { en: 'noodles', zh: '面条', emoji: '🍜', ipa: '/ˈnuːdlz/' },
      ],
      sentences: [
        { en: 'Do you like Chinese food?', zh: '你喜欢中国食物吗？', hint: '询问是否喜欢中国食物' },
        { en: 'What would you like?', zh: '你想要什么？', hint: '礼貌询问对方想要什么' },
        { en: "I'd like rice.", zh: '我想要米饭。', hint: '表达想要的主食' },
        { en: "I'd like dumplings.", zh: '我想要饺子。', hint: '表达想要的主食' },
        { en: "I'd like noodles.", zh: '我想要面条。', hint: '表达想要的主食' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '小测验',
      words: [
        { en: 'fruit', zh: '水果', emoji: '🍎', ipa: '/fruːt/' },
        { en: 'vegetables', zh: '蔬菜', emoji: '🥕', ipa: '/ˈvedʒtəblz/' },
        { en: 'seafood', zh: '海鲜', emoji: '🦐', ipa: '/ˈsiːfuːd/' },
        { en: 'snack', zh: '零食', emoji: '🍬', ipa: '/snæk/' },
      ],
      sentences: [
        { en: 'What would you like?', zh: '你想要什么？', hint: '礼貌询问对方想要什么' },
        { en: "I'd like kiwifruit.", zh: '我想要猕猴桃。', hint: '回答想要的水果' },
        { en: 'What do you want?', zh: '你想要什么？', hint: '询问对方想要什么' },
        { en: 'I want chocolate.', zh: '我想要巧克力。', hint: '回答想要的零食' },
      ]
    },
    { id: 7, title: 'Meat', titleZh: '肉类',
      words: [
        { en: 'beef', zh: '牛肉', emoji: '🥩', ipa: '/biːf/' },
        { en: 'pork', zh: '猪肉', emoji: '🥓', ipa: '/pɔːk/' },
        { en: 'chicken', zh: '鸡肉', emoji: '🍗', ipa: '/ˈtʃɪkɪn/' },
        { en: 'fish', zh: '鱼肉', emoji: '🐟', ipa: '/fɪʃ/' },
      ],
      sentences: [
        { en: 'What do you want?', zh: '你想要什么？', hint: '询问对方想要什么' },
        { en: 'I want some beef.', zh: '我想要一些牛肉。', hint: '用 some 表达想要一些肉' },
        { en: 'I want some pork.', zh: '我想要一些猪肉。', hint: '表达想要的肉' },
        { en: 'I want some fish.', zh: '我想要一些鱼肉。', hint: '表达想要的肉' },
        { en: 'I want some chicken.', zh: '我想要一些鸡肉。', hint: '表达想要的肉' },
      ]
    },
    { id: 8, title: 'Review', titleZh: '复习',
      words: [
        { en: 'fruit', zh: '水果', emoji: '🍎', ipa: '/fruːt/' },
        { en: 'vegetables', zh: '蔬菜', emoji: '🥦', ipa: '/ˈvedʒtəblz/' },
        { en: 'seafood', zh: '海鲜', emoji: '🦀', ipa: '/ˈsiːfuːd/' },
        { en: 'meat', zh: '肉类', emoji: '🥩', ipa: '/miːt/' },
      ],
      sentences: [
        { en: 'What are these?', zh: '这些是什么？', hint: '询问复数物品的类别' },
        { en: 'They are fruit.', zh: '它们是水果。', hint: '回答物品类别' },
        { en: 'What do you want?', zh: '你想要什么？', hint: '询问对方想要什么' },
        { en: 'I want some fruit and seafood.', zh: '我想要一些水果和海鲜。', hint: '用 and 连接两样想要的东西' },
        { en: 'I want some meat and vegetables.', zh: '我想要一些肉和蔬菜。', hint: '用 and 连接两样想要的东西' },
      ]
    },
  ],

  // === Unit 9: My Day ===
  9: [
    { id: 1, title: 'Get up', titleZh: '起床',
      words: [
        { en: 'towel', zh: '毛巾', emoji: '🧖', ipa: '/ˈtaʊəl/' },
        { en: 'comb', zh: '梳子', emoji: '💇', ipa: '/kəʊm/' },
        { en: 'toothbrush', zh: '牙刷', emoji: '🪥', ipa: '/ˈtuːθbrʌʃ/' },
        { en: 'toothpaste', zh: '牙膏', emoji: '🦷', ipa: '/ˈtuːθpeɪst/' },
      ],
      sentences: [
        { en: 'It is a towel.', zh: '它是一条毛巾。', hint: '介绍某件物品' },
        { en: 'It is a comb.', zh: '它是一把梳子。', hint: '介绍某件物品' },
        { en: 'It is a toothbrush.', zh: '它是一把牙刷。', hint: '介绍某件物品' },
        { en: 'It is toothpaste.', zh: '它是牙膏。', hint: '介绍牙膏（不可数，不用 a）' },
        { en: 'What is it?', zh: '它是什么？', hint: '询问单数物品的名称' },
      ]
    },
    { id: 2, title: 'My Breakfast', titleZh: '我的早餐',
      words: [
        { en: 'egg', zh: '鸡蛋', emoji: '🥚', ipa: '/eɡ/' },
        { en: 'bread', zh: '面包', emoji: '🍞', ipa: '/bred/' },
        { en: 'porridge', zh: '粥', emoji: '🍚', ipa: '/ˈpɒrɪdʒ/' },
        { en: 'cereal', zh: '麦片', emoji: '🥣', ipa: '/ˈsɪəriəl/' },
      ],
      sentences: [
        { en: 'I like bread for breakfast.', zh: '我早餐喜欢面包。', hint: '表达早餐喜欢什么' },
        { en: 'I like eggs for breakfast.', zh: '我早餐喜欢鸡蛋。', hint: '用复数表达喜欢的早餐' },
        { en: 'I like porridge for breakfast.', zh: '我早餐喜欢粥。', hint: '表达早餐喜欢什么' },
        { en: 'I like cereal for breakfast.', zh: '我早餐喜欢麦片。', hint: '表达早餐喜欢什么' },
        { en: 'What does she like for breakfast?', zh: '她早餐喜欢什么？', hint: '询问他人早餐喜欢什么' },
      ]
    },
    { id: 3, title: 'In the Classroom', titleZh: '在教室里',
      words: [
        { en: 'glue stick', zh: '固体胶', emoji: '🖍️', ipa: '/ɡluː stɪk/' },
        { en: 'eraser', zh: '橡皮', emoji: '🧽', ipa: '/ɪˈreɪzə(r)/' },
        { en: 'pencil', zh: '铅笔', emoji: '✏️', ipa: '/ˈpensl/' },
        { en: 'crayon', zh: '蜡笔', emoji: '🖍️', ipa: '/ˈkreɪən/' },
      ],
      sentences: [
        { en: "What's in your school bag?", zh: '你的书包里有什么？', hint: '询问书包里的物品' },
        { en: 'There is a glue stick.', zh: '有一支固体胶。', hint: '描述书包里的物品' },
        { en: 'There is an eraser.', zh: '有一块橡皮。', hint: '用 an 描述元音开头的物品' },
        { en: 'There are some pencils.', zh: '有一些铅笔。', hint: '用 some + 复数描述多件物品' },
        { en: 'There are some crayons.', zh: '有一些蜡笔。', hint: '用 some + 复数描述多件物品' },
      ]
    },
    { id: 4, title: 'Have Fun', titleZh: '开心玩耍',
      words: [
        { en: 'seesaw', zh: '跷跷板', emoji: '⚖️', ipa: '/ˈsiːsɔː/' },
        { en: 'swing', zh: '秋千', emoji: '🎪', ipa: '/swɪŋ/' },
        { en: 'slide', zh: '滑梯', emoji: '🛝', ipa: '/slaɪd/' },
        { en: 'playground', zh: '操场', emoji: '🏟️', ipa: '/ˈpleɪɡraʊnd/' },
      ],
      sentences: [
        { en: 'This is a swing.', zh: '这是一个秋千。', hint: '介绍某件物品' },
        { en: 'This is a seesaw.', zh: '这是一个跷跷板。', hint: '介绍某件物品' },
        { en: 'This is a slide.', zh: '这是一个滑梯。', hint: '介绍某件物品' },
        { en: 'This is a playground.', zh: '这是一个操场。', hint: '介绍某个场所' },
        { en: "What's this?", zh: '这是什么？', hint: '询问近处物品的名称' },
      ]
    },
    { id: 5, title: 'Snack time', titleZh: '点心时间',
      words: [
        { en: 'cake', zh: '蛋糕', emoji: '🍰', ipa: '/keɪk/' },
        { en: 'donut', zh: '甜甜圈', emoji: '🍩', ipa: '/ˈdəʊnʌt/' },
        { en: 'yogurt', zh: '酸奶', emoji: '🥛', ipa: '/ˈjɒɡət/' },
        { en: 'lollipop', zh: '棒棒糖', emoji: '🍭', ipa: '/ˈlɒlipɒp/' },
      ],
      sentences: [
        { en: 'What do you like?', zh: '你喜欢什么？', hint: '询问对方喜欢什么' },
        { en: 'I like yogurt and donuts.', zh: '我喜欢酸奶和甜甜圈。', hint: '用 and 连接两样喜欢的东西' },
        { en: 'I like cake and lollipops.', zh: '我喜欢蛋糕和棒棒糖。', hint: '用 and 连接两样喜欢的东西' },
        { en: 'Do you like snacks?', zh: '你喜欢零食吗？', hint: '询问是否喜欢零食' },
        { en: 'I like cake and yogurt.', zh: '我喜欢蛋糕和酸奶。', hint: '用 and 连接两样喜欢的东西' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '小测验',
      words: [
        { en: 'towel', zh: '毛巾', emoji: '🧖', ipa: '/ˈtaʊəl/' },
        { en: 'egg', zh: '鸡蛋', emoji: '🥚', ipa: '/eɡ/' },
        { en: 'pencil', zh: '铅笔', emoji: '✏️', ipa: '/ˈpensl/' },
        { en: 'swing', zh: '秋千', emoji: '⚖️', ipa: '/swɪŋ/' },
      ],
      sentences: [
        { en: 'What do you want?', zh: '你想要什么？', hint: '询问对方想要什么' },
        { en: 'What do you like for breakfast?', zh: '你早餐喜欢什么？', hint: '询问早餐喜欢什么' },
        { en: 'What is this?', zh: '这是什么？', hint: '询问物品的名称' },
        { en: "What's in your schoolbag?", zh: '你的书包里有什么？', hint: '询问书包里的物品' },
        { en: 'What do you like to eat?', zh: '你喜欢吃什么？', hint: '询问喜欢吃什么' },
      ]
    },
    { id: 7, title: 'Time for Bed', titleZh: '睡觉时间',
      words: [
        { en: 'take a shower', zh: '洗澡', emoji: '🚿', ipa: '/teɪk ə ˈʃaʊə(r)/' },
        { en: 'read a book', zh: '读书', emoji: '📖', ipa: '/riːd ə bʊk/' },
        { en: 'go to bed', zh: '上床睡觉', emoji: '🛏️', ipa: '/ɡəʊ tə bed/' },
      ],
      sentences: [
        { en: "It's time to take a shower.", zh: '该洗澡了。', hint: "用 It's time to 表达该做某事" },
        { en: "It's time to read a book.", zh: '该读书了。', hint: "用 It's time to 表达该做某事" },
        { en: "It's time to go to bed.", zh: '该上床睡觉了。', hint: "用 It's time to 表达该做某事" },
        { en: 'Time for bed!', zh: '该睡觉啦！', hint: '简短表达该睡觉了' },
      ]
    },
    { id: 8, title: 'Review', titleZh: '复习',
      words: [
        { en: 'get up', zh: '起床', emoji: '⏰', ipa: '/ɡet ʌp/' },
        { en: 'brush my teeth', zh: '刷牙', emoji: '🪥', ipa: '/brʌʃ maɪ tiːθ/' },
        { en: 'have breakfast', zh: '吃早餐', emoji: '🍳', ipa: '/hæv ˈbrekfəst/' },
        { en: 'play', zh: '玩耍', emoji: '⚽', ipa: '/pleɪ/' },
      ],
      sentences: [
        { en: "It's time to get up.", zh: '该起床了。', hint: "用 It's time to 表达该起床" },
        { en: "It's time to brush my teeth.", zh: '该刷牙了。', hint: "用 It's time to 表达该刷牙" },
        { en: "It's time to have breakfast.", zh: '该吃早餐了。', hint: "用 It's time to 表达该吃早餐" },
        { en: "It's time to play.", zh: '该玩耍了。', hint: "用 It's time to 表达该玩耍" },
        { en: "It's time to ______.", zh: '该______了。', hint: "用 It's time to 描述一天的活动" },
      ]
    },
  ],

  // === Unit 10: Birthday ===
  10: [
    { id: 1, title: 'My Birthday', titleZh: '我的生日',
      words: [
        { en: 'balloon', zh: '气球', emoji: '🎈', ipa: '/bəˈluːn/' },
        { en: 'ribbon', zh: '丝带', emoji: '🎀', ipa: '/ˈrɪbən/' },
        { en: 'hat', zh: '帽子', emoji: '🎩', ipa: '/hæt/' },
        { en: 'cake', zh: '蛋糕', emoji: '🎂', ipa: '/keɪk/' },
      ],
      sentences: [
        { en: 'I need some balloons.', zh: '我需要一些气球。', hint: '表达需要' },
        { en: 'I need some ribbons.', zh: '我需要一些丝带。', hint: '表达需要' },
        { en: 'I need some hats.', zh: '我需要一些帽子。', hint: '表达需要' },
        { en: 'I need a cake.', zh: '我需要一个蛋糕。', hint: '表达需要' },
      ]
    },
    { id: 2, title: 'Friends', titleZh: '朋友',
      words: [
        { en: 'he', zh: '他', emoji: '👦', ipa: '/hiː/' },
        { en: 'she', zh: '她', emoji: '👧', ipa: '/ʃiː/' },
        { en: 'friend', zh: '朋友', emoji: '🤝', ipa: '/frend/' },
        { en: 'boy', zh: '男孩', emoji: '👶', ipa: '/bɔɪ/' },
        { en: 'girl', zh: '女孩', emoji: '👧', ipa: '/ɡɜːrl/' },
      ],
      sentences: [
        { en: 'He is my friend.', zh: '他是我的朋友。', hint: '介绍男孩朋友' },
        { en: 'She is my friend.', zh: '她是我的朋友。', hint: '介绍女孩朋友' },
        { en: 'He is a boy.', zh: '他是一个男孩。', hint: '介绍性别' },
        { en: 'She is a girl.', zh: '她是一个女孩。', hint: '介绍性别' },
      ]
    },
    { id: 3, title: 'My Gifts', titleZh: '我的礼物',
      words: [
        { en: 'ice skates', zh: '冰鞋', emoji: '⛸️', ipa: '/aɪs skeɪts/' },
        { en: 'scarf', zh: '围巾', emoji: '🧣', ipa: '/skɑːrf/' },
        { en: 'gloves', zh: '手套', emoji: '🧤', ipa: '/ɡlʌvz/' },
        { en: 'gift', zh: '礼物', emoji: '🎁', ipa: '/ɡɪft/' },
      ],
      sentences: [
        { en: 'Here are ice skates for you.', zh: '这是给你的冰鞋。', hint: '赠送礼物' },
        { en: 'Here are gloves for you.', zh: '这是给你的手套。', hint: '赠送礼物' },
        { en: 'Here is a scarf for you.', zh: '这是给你的围巾。', hint: '赠送礼物' },
        { en: 'Thank you.', zh: '谢谢你。', hint: '表达感谢' },
      ]
    },
    { id: 4, title: 'Show Love', titleZh: '表达爱',
      words: [
        { en: 'smile', zh: '微笑', emoji: '😊', ipa: '/smaɪl/' },
        { en: 'hug', zh: '拥抱', emoji: '🤗', ipa: '/hʌɡ/' },
        { en: 'kiss', zh: '亲吻', emoji: '💋', ipa: '/kɪs/' },
        { en: 'love', zh: '爱', emoji: '❤️', ipa: '/lʌv/' },
      ],
      sentences: [
        { en: 'He smiles at me.', zh: '他对我微笑。', hint: '表达动作' },
        { en: 'She hugs me.', zh: '她拥抱我。', hint: '表达动作' },
        { en: 'She kisses me.', zh: '她亲吻我。', hint: '表达动作' },
        { en: 'I love you.', zh: '我爱你。', hint: '表达爱意' },
      ]
    },
    { id: 5, title: 'Gather Around the Cake', titleZh: '围着蛋糕',
      words: [
        { en: 'birthday song', zh: '生日歌', emoji: '🎵', ipa: '/ˈbɜːrθdeɪ sɒŋ/' },
        { en: 'wish', zh: '愿望', emoji: '🌟', ipa: '/wɪʃ/' },
        { en: 'candle', zh: '蜡烛', emoji: '🕯️', ipa: '/ˈkændl/' },
        { en: 'birthday cake', zh: '生日蛋糕', emoji: '🎂', ipa: '/ˈbɜːrθdeɪ keɪk/' },
      ],
      sentences: [
        { en: "Let's sing a birthday song.", zh: '我们来唱生日歌吧。', hint: '提议做事' },
        { en: "Let's make a wish.", zh: '我们来许个愿吧。', hint: '提议做事' },
        { en: "Let's blow out the candles.", zh: '我们来吹蜡烛吧。', hint: '提议做事' },
        { en: 'May your wishes come true.', zh: '愿你的愿望成真。', hint: '表达祝福' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '测评',
      words: [
        { en: 'balloon', zh: '气球', emoji: '🎈', ipa: '/bəˈluːn/' },
        { en: 'friend', zh: '朋友', emoji: '🤝', ipa: '/frend/' },
        { en: 'gift', zh: '礼物', emoji: '🎁', ipa: '/ɡɪft/' },
        { en: 'hug', zh: '拥抱', emoji: '🤗', ipa: '/hʌɡ/' },
      ],
      sentences: [
        { en: 'What do you need for a birthday party?', zh: '你的生日派对需要什么？', hint: '询问需要' },
        { en: 'He is my friend.', zh: '他是我的朋友。', hint: '介绍朋友' },
        { en: 'Here is a gift for you.', zh: '这是给你的礼物。', hint: '赠送礼物' },
        { en: 'She hugs me.', zh: '她拥抱我。', hint: '表达动作' },
      ]
    },
    { id: 7, title: 'Clean Up', titleZh: '打扫整理',
      words: [
        { en: 'clean up', zh: '打扫', emoji: '🧹', ipa: '/kliːn ʌp/' },
        { en: 'put away', zh: '收好', emoji: '📦', ipa: '/pʊt əˈweɪ/' },
        { en: 'blocks', zh: '积木', emoji: '🧱', ipa: '/blɒks/' },
        { en: 'doll', zh: '洋娃娃', emoji: '🪆', ipa: '/dɒl/' },
      ],
      sentences: [
        { en: "It's time to clean up.", zh: '该打扫了。', hint: '表达该做什么' },
        { en: 'Put away the blocks.', zh: '把积木收好。', hint: '指令收东西' },
        { en: 'Put away the dolls.', zh: '把洋娃娃收好。', hint: '指令收东西' },
        { en: 'Clean up the floor.', zh: '打扫地板。', hint: '指令打扫' },
      ]
    },
    { id: 8, title: 'Review', titleZh: '复习',
      words: [
        { en: 'birthday', zh: '生日', emoji: '🎂', ipa: '/ˈbɜːrθdeɪ/' },
        { en: 'gift', zh: '礼物', emoji: '🎁', ipa: '/ɡɪft/' },
        { en: 'friend', zh: '朋友', emoji: '🤝', ipa: '/frend/' },
        { en: 'candle', zh: '蜡烛', emoji: '🕯️', ipa: '/ˈkændl/' },
      ],
      sentences: [
        { en: 'Today is my birthday!', zh: '今天是我的生日！', hint: '表达生日' },
        { en: 'I get many gifts.', zh: '我收到许多礼物。', hint: '表达收到' },
        { en: 'My friends and I sing a birthday song.', zh: '我和朋友们唱生日歌。', hint: '表达动作' },
        { en: "It's time to clean up.", zh: '该打扫了。', hint: '表达该做什么' },
      ]
    },
  ],

  // === Unit 11: Places ===
  11: [
    { id: 1, title: 'Where to Go', titleZh: '去哪里',
      words: [
        { en: 'zoo', zh: '动物园', emoji: '🦁', ipa: '/zuː/' },
        { en: 'Sea World', zh: '海洋世界', emoji: '🐬', ipa: '/siː wɜːrld/' },
        { en: 'beach', zh: '海滩', emoji: '🏖️', ipa: '/biːtʃ/' },
      ],
      sentences: [
        { en: 'I want to go to the zoo.', zh: '我想去动物园。', hint: '表达想去' },
        { en: 'I want to go to Sea World.', zh: '我想去海洋世界。', hint: '表达想去' },
        { en: 'I want to go to the beach.', zh: '我想去海滩。', hint: '表达想去' },
        { en: 'Where do you want to go?', zh: '你想去哪里？', hint: '询问想去' },
      ]
    },
    { id: 2, title: 'Go to the Zoo', titleZh: '去动物园',
      words: [
        { en: 'elephant', zh: '大象', emoji: '🐘', ipa: '/ˈelɪfənt/' },
        { en: 'giraffe', zh: '长颈鹿', emoji: '🦒', ipa: '/dʒəˈrɑːf/' },
        { en: 'deer', zh: '鹿', emoji: '🦌', ipa: '/dɪr/' },
        { en: 'zebra', zh: '斑马', emoji: '🦓', ipa: '/ˈziːbrə/' },
      ],
      sentences: [
        { en: 'I see elephants in the zoo.', zh: '我在动物园看到大象。', hint: '表达看到' },
        { en: 'I see giraffes in the zoo.', zh: '我在动物园看到长颈鹿。', hint: '表达看到' },
        { en: 'I see zebras in the zoo.', zh: '我在动物园看到斑马。', hint: '表达看到' },
        { en: 'What animal do you see in the zoo?', zh: '你在动物园看到什么动物？', hint: '询问看到' },
      ]
    },
    { id: 3, title: 'Sea World', titleZh: '海洋世界',
      words: [
        { en: 'octopus', zh: '章鱼', emoji: '🐙', ipa: '/ˈɒktəpəs/' },
        { en: 'shark', zh: '鲨鱼', emoji: '🦈', ipa: '/ʃɑːrk/' },
        { en: 'jellyfish', zh: '水母', emoji: '🪼', ipa: '/ˈdʒelɪfɪʃ/' },
        { en: 'sea lion', zh: '海狮', emoji: '🦭', ipa: '/siː ˈlaɪən/' },
      ],
      sentences: [
        { en: 'I see an octopus in the water.', zh: '我在水里看到章鱼。', hint: '表达看到' },
        { en: 'I see a shark in the water.', zh: '我在水里看到鲨鱼。', hint: '表达看到' },
        { en: 'I see a jellyfish in the water.', zh: '我在水里看到水母。', hint: '表达看到' },
        { en: "It's a shark!", zh: '它是一条鲨鱼！', hint: '表达是什么' },
      ]
    },
    { id: 4, title: 'Go to the Beach', titleZh: '去海滩',
      words: [
        { en: 'sun umbrella', zh: '遮阳伞', emoji: '⛱️', ipa: '/sʌn ʌmˈbrelə/' },
        { en: 'starfish', zh: '海星', emoji: '⭐', ipa: '/ˈstɑːrfɪʃ/' },
        { en: 'shell', zh: '贝壳', emoji: '🐚', ipa: '/ʃel/' },
        { en: 'sand', zh: '沙子', emoji: '🏖️', ipa: '/sænd/' },
      ],
      sentences: [
        { en: 'I see a sun umbrella on the beach.', zh: '我在海滩上看到遮阳伞。', hint: '表达看到' },
        { en: 'I see some starfish on the beach.', zh: '我在海滩上看到海星。', hint: '表达看到' },
        { en: 'I see sand on the beach.', zh: '我在海滩上看到沙子。', hint: '表达看到' },
        { en: 'I see some shells on the beach.', zh: '我在海滩上看到贝壳。', hint: '表达看到' },
      ]
    },
    { id: 5, title: 'Playground', titleZh: '操场',
      words: [
        { en: 'basketball', zh: '篮球', emoji: '🏀', ipa: '/ˈbɑːskɪtbɔːl/' },
        { en: 'football', zh: '足球', emoji: '⚽', ipa: '/ˈfʊtbɔːl/' },
        { en: 'table tennis', zh: '乒乓球', emoji: '🏓', ipa: '/ˈteɪbl ˈtenɪs/' },
        { en: 'ball', zh: '球', emoji: '⚽', ipa: '/bɔːl/' },
      ],
      sentences: [
        { en: 'I like playing basketball.', zh: '我喜欢打篮球。', hint: '表达喜欢' },
        { en: 'I like playing football.', zh: '我喜欢踢足球。', hint: '表达喜欢' },
        { en: 'I like playing table tennis.', zh: '我喜欢打乒乓球。', hint: '表达喜欢' },
        { en: 'What kind of ball game does the panda like playing?', zh: '熊猫喜欢什么球类运动？', hint: '询问喜欢' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '测评',
      words: [
        { en: 'zoo', zh: '动物园', emoji: '🦁', ipa: '/zuː/' },
        { en: 'beach', zh: '海滩', emoji: '🏖️', ipa: '/biːtʃ/' },
        { en: 'basketball', zh: '篮球', emoji: '🏀', ipa: '/ˈbɑːskɪtbɔːl/' },
        { en: 'octopus', zh: '章鱼', emoji: '🐙', ipa: '/ˈɒktəpəs/' },
      ],
      sentences: [
        { en: "It's time to put away the blocks.", zh: '该把积木收好了。', hint: '指令收东西' },
        { en: 'I want to go to the zoo.', zh: '我想去动物园。', hint: '表达想去' },
        { en: 'I see elephants in the zoo.', zh: '我在动物园看到大象。', hint: '表达看到' },
        { en: 'I like playing basketball.', zh: '我喜欢打篮球。', hint: '表达喜欢' },
      ]
    },
    { id: 7, title: 'Theme Park', titleZh: '主题公园',
      words: [
        { en: 'merry-go-round', zh: '旋转木马', emoji: '🎠', ipa: '/ˈmeri ɡoʊ raʊnd/' },
        { en: 'bumper cars', zh: '碰碰车', emoji: '🚗', ipa: '/ˈbʌmpər kɑːrz/' },
        { en: 'Ferris wheel', zh: '摩天轮', emoji: '🎡', ipa: '/ˈferɪs wiːl/' },
      ],
      sentences: [
        { en: 'I like to ride the Ferris wheel.', zh: '我喜欢坐摩天轮。', hint: '表达喜欢' },
        { en: 'I like to ride the merry-go-round.', zh: '我喜欢坐旋转木马。', hint: '表达喜欢' },
        { en: 'I like to ride the bumper cars.', zh: '我喜欢坐碰碰车。', hint: '表达喜欢' },
        { en: 'What do you like to ride?', zh: '你喜欢坐什么？', hint: '询问喜欢' },
      ]
    },
    { id: 8, title: 'Review', titleZh: '复习',
      words: [
        { en: 'elephant', zh: '大象', emoji: '🐘', ipa: '/ˈelɪfənt/' },
        { en: 'shark', zh: '鲨鱼', emoji: '🦈', ipa: '/ʃɑːrk/' },
        { en: 'beach', zh: '海滩', emoji: '🏖️', ipa: '/biːtʃ/' },
        { en: 'table tennis', zh: '乒乓球', emoji: '🏓', ipa: '/ˈteɪbl ˈtenɪs/' },
      ],
      sentences: [
        { en: 'I see elephants in the zoo.', zh: '我在动物园看到大象。', hint: '表达看到' },
        { en: 'I see a shark in the water.', zh: '我在水里看到鲨鱼。', hint: '表达看到' },
        { en: 'I want to go to the playground.', zh: '我想去游乐场。', hint: '表达想去' },
        { en: 'I like playing table tennis.', zh: '我喜欢打乒乓球。', hint: '表达喜欢' },
      ]
    },
  ],

  // === Unit 12: Transport ===
  12: [
    { id: 1, title: 'I See It', titleZh: '我看到了',
      words: [
        { en: 'park', zh: '公园', emoji: '🏞️', ipa: '/pɑːrk/' },
        { en: 'school', zh: '学校', emoji: '🏫', ipa: '/skuːl/' },
        { en: 'hospital', zh: '医院', emoji: '🏥', ipa: '/ˈhɒspɪtl/' },
      ],
      sentences: [
        { en: 'I see a school.', zh: '我看到一所学校。', hint: '表达看到' },
        { en: 'I see a hospital.', zh: '我看到一家医院。', hint: '表达看到' },
        { en: 'I see a park.', zh: '我看到一个公园。', hint: '表达看到' },
        { en: 'What do you see?', zh: '你看到什么？', hint: '询问看到' },
      ]
    },
    { id: 2, title: 'Shop Shop', titleZh: '购物',
      words: [
        { en: 'supermarket', zh: '超市', emoji: '🛒', ipa: '/ˈsuːpərmɑːrkɪt/' },
        { en: 'bakery', zh: '面包店', emoji: '🥖', ipa: '/ˈbeɪkəri/' },
        { en: 'barbershop', zh: '理发店', emoji: '💈', ipa: '/ˈbɑːrbərʃɒp/' },
      ],
      sentences: [
        { en: 'I see a supermarket.', zh: '我看到一家超市。', hint: '表达看到' },
        { en: 'I see a bakery.', zh: '我看到一家面包店。', hint: '表达看到' },
        { en: 'I see a barbershop.', zh: '我看到一家理发店。', hint: '表达看到' },
        { en: 'Where are they?', zh: '他们在哪里？', hint: '询问位置' },
      ]
    },
    { id: 3, title: 'How Do You Go to School', titleZh: '你怎么去上学',
      words: [
        { en: 'bus', zh: '公共汽车', emoji: '🚌', ipa: '/bʌs/' },
        { en: 'bike', zh: '自行车', emoji: '🚲', ipa: '/baɪk/' },
        { en: 'subway', zh: '地铁', emoji: '🚇', ipa: '/ˈsʌbweɪ/' },
        { en: 'taxi', zh: '出租车', emoji: '🚕', ipa: '/ˈtæksi/' },
      ],
      sentences: [
        { en: 'How do you go to school?', zh: '你怎么去上学？', hint: '询问方式' },
        { en: 'I go to school by bus.', zh: '我坐公共汽车上学。', hint: '表达方式' },
        { en: 'I go to school by bike.', zh: '我骑自行车上学。', hint: '表达方式' },
        { en: 'I go to school by subway.', zh: '我坐地铁上学。', hint: '表达方式' },
      ]
    },
    { id: 4, title: 'Traffic Lights', titleZh: '交通灯',
      words: [
        { en: 'red light', zh: '红灯', emoji: '🔴', ipa: '/red laɪt/' },
        { en: 'yellow light', zh: '黄灯', emoji: '🟡', ipa: '/ˈjeloʊ laɪt/' },
        { en: 'green light', zh: '绿灯', emoji: '🟢', ipa: '/ɡriːn laɪt/' },
        { en: 'stop', zh: '停止', emoji: '✋', ipa: '/stɒp/' },
        { en: 'wait', zh: '等待', emoji: '⏳', ipa: '/weɪt/' },
      ],
      sentences: [
        { en: 'The yellow says wait.', zh: '黄灯说等一等。', hint: '表达交通规则' },
        { en: 'The red says stop.', zh: '红灯说停下。', hint: '表达交通规则' },
        { en: 'The green says go.', zh: '绿灯说走。', hint: '表达交通规则' },
        { en: 'Should we go, wait or stop?', zh: '我们该走、等还是停？', hint: '询问该做什么' },
      ]
    },
    { id: 5, title: 'Street Signs', titleZh: '街道指示牌',
      words: [
        { en: 'turn left', zh: '向左转', emoji: '⬅️', ipa: '/tɜːrn left/' },
        { en: 'turn right', zh: '向右转', emoji: '➡️', ipa: '/tɜːrn raɪt/' },
        { en: 'go straight', zh: '直走', emoji: '⬆️', ipa: '/ɡoʊ streɪt/' },
      ],
      sentences: [
        { en: 'Turn left!', zh: '向左转！', hint: '指示方向' },
        { en: 'Turn right!', zh: '向右转！', hint: '指示方向' },
        { en: 'Go straight!', zh: '直走！', hint: '指示方向' },
        { en: 'How can the boy get to school from home?', zh: '男孩从家怎么去学校？', hint: '询问路线' },
      ]
    },
    { id: 6, title: 'Quiz', titleZh: '测评',
      words: [
        { en: 'supermarket', zh: '超市', emoji: '🛒', ipa: '/ˈsuːpərmɑːrkɪt/' },
        { en: 'fire station', zh: '消防站', emoji: '🚒', ipa: '/ˈfaɪər ˈsteɪʃn/' },
        { en: 'police station', zh: '警察局', emoji: '🚓', ipa: '/pəˈliːs ˈsteɪʃn/' },
        { en: 'bus', zh: '公共汽车', emoji: '🚌', ipa: '/bʌs/' },
      ],
      sentences: [
        { en: 'There is a fire station on my street.', zh: '我的街上有一个消防站。', hint: '表达存在' },
        { en: 'There is a police station on my street.', zh: '我的街上有一个警察局。', hint: '表达存在' },
        { en: 'How do you go to school?', zh: '你怎么去上学？', hint: '询问方式' },
        { en: 'I go to school by bus.', zh: '我坐公共汽车上学。', hint: '表达方式' },
      ]
    },
    { id: 7, title: 'Make Way Please', titleZh: '请让一让',
      words: [
        { en: 'ambulance', zh: '救护车', emoji: '🚑', ipa: '/ˈæmbjələns/' },
        { en: 'fire truck', zh: '消防车', emoji: '🚒', ipa: '/ˈfaɪər trʌk/' },
        { en: 'police car', zh: '警车', emoji: '🚓', ipa: '/pəˈliːs kɑːr/' },
      ],
      sentences: [
        { en: 'This is a police car.', zh: '这是一辆警车。', hint: '介绍事物' },
        { en: 'This is a fire truck.', zh: '这是一辆消防车。', hint: '介绍事物' },
        { en: 'This is an ambulance.', zh: '这是一辆救护车。', hint: '介绍事物' },
        { en: 'Make way, please!', zh: '请让一让！', hint: '请求让路' },
      ]
    },
    { id: 8, title: 'Review', titleZh: '复习',
      words: [
        { en: 'school', zh: '学校', emoji: '🏫', ipa: '/skuːl/' },
        { en: 'hospital', zh: '医院', emoji: '🏥', ipa: '/ˈhɒspɪtl/' },
        { en: 'supermarket', zh: '超市', emoji: '🛒', ipa: '/ˈsuːpərmɑːrkɪt/' },
        { en: 'bakery', zh: '面包店', emoji: '🥖', ipa: '/ˈbeɪkəri/' },
      ],
      sentences: [
        { en: 'This is a school.', zh: '这是一所学校。', hint: '介绍事物' },
        { en: 'What do you see?', zh: '你看到什么？', hint: '询问看到' },
        { en: 'They are buildings.', zh: '它们是建筑物。', hint: '表达分类' },
        { en: 'They are vehicles.', zh: '它们是车辆。', hint: '表达分类' },
      ]
    },
  ],
}
