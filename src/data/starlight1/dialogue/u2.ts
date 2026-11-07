// Starlight 1 · Unit 2 外教课堂对话（11 课）
// 与预备级 src/data/dialogue/ 同构：热身 → 带新词 → 练句型 → 玩游戏 → 闭环复述。
// speaker: T = 外教老师, S = 学生（孩子）。数据口径与 lessonsByUnit1 一致。
// 校验口径见 src/data/starlight1/dialogue1.ts 的 validateDialogue1()。

import type { LessonDialogue } from '../../lessonDialogue'

export const u2_dialogue: Record<string, LessonDialogue> = {
  // 2-1 身体部位（一）
  '2-1': {
    title: 'Look At My Face · 看看我的脸',
    turns: [
      { speaker: 'T', en: "Hello, Leo! Doctor! Doctor! I'm ill today!", zh: '你好，Leo！医生！医生！我今天生病啦！', note: '（戴上玩具听诊器，装出生病的样子）' },
      { speaker: 'S', en: 'Hello, Doctor!', zh: '你好，医生！' },
      { speaker: 'T', en: "Look at my face! What's this? Look at my eyes. Eyes!", zh: '看我的脸！这是什么？看我的眼睛。眼睛！', note: '（指着自己的眼睛）' },
      { speaker: 'S', en: 'Eyes!', zh: '眼睛！' },
      { speaker: 'T', en: 'What are these? Look at my ears. Ears!', zh: '这些是什么？看我的耳朵。耳朵！', note: '（揪揪两只耳朵）' },
      { speaker: 'S', en: 'Ears!', zh: '耳朵！' },
      { speaker: 'T', en: 'Good! Look at my nose. Nose!', zh: '好！看我的鼻子。鼻子！', note: '（点点鼻子）' },
      { speaker: 'S', en: 'Nose!', zh: '鼻子！' },
      { speaker: 'T', en: 'Now look at my mouth and my teeth. Smile!', zh: '现在看我的嘴和我的牙齿。笑一个！', note: '（张大嘴，再露齿笑）' },
      { speaker: 'S', en: 'Mouth! Teeth!', zh: '嘴！牙齿！' },
      { speaker: 'T', en: 'Fast game! Eyes, ears, nose, mouth, teeth. You point!', zh: '快快游戏！眼睛、耳朵、鼻子、嘴、牙齿。你来指！', note: '（越念越快，孩子跟着指部位）' },
      { speaker: 'S', en: 'Eyes, ears, nose, mouth, teeth!', zh: '眼睛、耳朵、鼻子、嘴、牙齿！' },
      { speaker: 'T', en: 'Wonderful! Look at my face. My mouth and my teeth. Well done, little Doctor!', zh: '太棒了！看我的脸。我的嘴和我的牙齿。干得好，小医生！', note: '（竖起大拇指）' },
    ],
  },

  // 2-2 身体部位（二）
  '2-2': {
    title: 'What Is This · 这是什么',
    turns: [
      { speaker: 'T', en: 'Hi, Leo! Look at this picture. Who is he?', zh: '嗨，Leo！看这张图片。他是谁？', note: '（举起课本里的人物大图）' },
      { speaker: 'S', en: 'A boy!', zh: '一个男孩！' },
      { speaker: 'T', en: "Yes! What's this on his head? Look at my hair.", zh: '对！他头上这是什么？看我的头发。', note: '（指着自己的头发）' },
      { speaker: 'S', en: 'Hair!', zh: '头发！' },
      { speaker: 'T', en: 'Right! And what are these? Look at my cheeks.', zh: '对！那这些是什么？看我的脸颊。', note: '（戳戳自己的脸颊）' },
      { speaker: 'S', en: 'Cheeks!', zh: '脸颊！' },
      { speaker: 'T', en: 'Great! Look at my face. Hair, cheeks, eyes, nose, mouth!', zh: '太棒了！看我的脸。头发、脸颊、眼睛、鼻子、嘴！', note: '（沿着脸画一圈）' },
      { speaker: 'S', en: 'Face!', zh: '脸！' },
      { speaker: 'T', en: 'Now look down. What are these? Look at my feet.', zh: '现在往下看。这些是什么？看我的脚。', note: '（跺跺脚）' },
      { speaker: 'S', en: 'Feet!', zh: '脚！' },
      { speaker: 'T', en: 'Game time! Look at my toes! I say a word, you point. Face, hair, cheeks, feet, toes!', zh: '游戏时间！看我的脚趾！我说单词，你来指。脸、头发、脸颊、脚、脚趾！', note: '（数脚趾，进入快速指认游戏）' },
      { speaker: 'S', en: 'Face, hair, cheeks, feet, toes!', zh: '脸、头发、脸颊、脚、脚趾！' },
      { speaker: 'T', en: "Perfect! What's this? It's your face. You know them all!", zh: '完美！这是什么？是你的脸。你全都认识啦！', note: '（竖起大拇指）' },
    ],
  },

  // 2-3 可怜的熊先生
  '2-3': {
    title: 'Poor Mr. Bear · 可怜的熊先生',
    turns: [
      { speaker: 'T', en: 'Hello, Leo! Look at this picture. Poor Mr. Bear!', zh: '你好，Leo！看这张图片。可怜的熊先生！', note: '（举起课本里缠着绷带的熊）' },
      { speaker: 'S', en: 'Oh no! A bear!', zh: '哎呀！一只熊！' },
      { speaker: 'T', en: 'Yes, a bear! Who is he? Mr. Bear is ill.', zh: '对，一只熊！他是谁？熊先生生病了。', note: '（指着图上的熊）' },
      { speaker: 'S', en: 'Ill?', zh: '生病了？' },
      { speaker: 'T', en: "Ill means not well. He's in the hospital. Where is he?", zh: '生病就是不舒服。他在医院里。他在哪儿呢？', note: '（指一指玩具医院）' },
      { speaker: 'S', en: 'In the hospital!', zh: '在医院里！' },
      { speaker: 'T', en: 'Right! Here is the doctor. How are you today, Mr. Bear?', zh: '对！医生来了。熊先生，你今天好吗？', note: '（拿起医生玩偶，凑近小熊）' },
      { speaker: 'S', en: "I'm ill today!", zh: '我今天生病啦！' },
      { speaker: 'T', en: 'Oh dear. This is for you! A big bandage!', zh: '哎呀。这是给你的！一条大绷带！', note: '（把绷带贴到小熊头上）' },
      { speaker: 'S', en: 'A bandage!', zh: '一条绷带！' },
      { speaker: 'T', en: 'Now the doctor takes off the bandage. Look! I have a mouth. Hurray!', zh: '现在医生把绷带取下来。看！我有一张嘴。万岁！', note: '（慢慢揭开绷带，学小熊说话）' },
      { speaker: 'S', en: 'Hurray! I have eyes! I have a nose!', zh: '万岁！我有眼睛！我有一个鼻子！' },
      { speaker: 'T', en: "Wonderful! Mr. Bear is ill, he's in the hospital, and now he can smile. Well done, Doctor Leo!", zh: '太棒了！熊先生生病了，他在医院里，现在他能笑啦。干得好，Leo 医生！', note: '（竖起大拇指，带孩子复述故事）' },
    ],
  },

  // 2-4 狼先生
  '2-4': {
    title: 'It Is Mr. Wolf · 是狼先生',
    turns: [
      { speaker: 'T', en: "Hi, Leo! Remember Mr. Bear? He's in the hospital, in bed.", zh: '嗨，Leo！还记得熊先生吗？他在医院里，躺在床上。', note: '（举起上一课的图片）' },
      { speaker: 'S', en: 'Poor Mr. Bear!', zh: '可怜的熊先生！' },
      { speaker: 'T', en: 'Here is another bed. Another bandage! Let us take it off.', zh: '这儿还有一张床。还有一条绷带！我们把它取下来。', note: '（指向课本里第二张床）' },
      { speaker: 'S', en: 'Okay!', zh: '好呀！' },
      { speaker: 'T', en: 'Look! I have a nose and eyes. Hurray!', zh: '看！我有一个鼻子和眼睛。万岁！', note: '（慢慢揭开绷带，学病人说话）' },
      { speaker: 'S', en: 'A nose and eyes!', zh: '一个鼻子和眼睛！' },
      { speaker: 'T', en: 'Look! I have ears. Two big ears!', zh: '看！我有耳朵。两只大耳朵！', note: '（再揭一点，露出大耳朵）' },
      { speaker: 'S', en: 'Ears! Big ears!', zh: '耳朵！大耳朵！' },
      { speaker: 'T', en: "Oh! Big ears, a big mouth. That isn't Mr. Bear!", zh: '哦！大耳朵，一张大嘴。那不是熊先生！', note: '（后退一步，故意很惊讶）' },
      { speaker: 'S', en: "That isn't Mr. Bear!", zh: '那不是熊先生！' },
      { speaker: 'T', en: "It isn't Mr. Bear. It's Mr. Wolf! Poor Mr. Wolf!", zh: '那不是熊先生，是狼先生！可怜的狼先生！', note: '（指向狼的尖耳朵）' },
      { speaker: 'S', en: 'Mr. Wolf!', zh: '狼先生！' },
      { speaker: 'T', en: "Yes! Mr. Bear is in the other bed. I'm here! Good job, Leo!", zh: '对！熊先生在另一张床上。我在这儿呢！干得好，Leo！', note: '（翻到另一张床，竖起大拇指）' },
    ],
  },

  // 2-5 I have...
  '2-5': {
    title: 'I Have A Mouth · 我有一张嘴',
    turns: [
      { speaker: 'T', en: 'Hello, Leo! Today we say I have. Ready?', zh: '你好，Leo！今天我们说「我有」。准备好了吗？', note: '（举起手偶）' },
      { speaker: 'S', en: 'Ready!', zh: '准备好啦！' },
      { speaker: 'T', en: 'Look! I have a mouth. Hurray!', zh: '看！我有一张嘴。万岁！', note: '（指着自己的嘴）' },
      { speaker: 'S', en: 'I have a mouth!', zh: '我有一张嘴！' },
      { speaker: 'T', en: 'Great! I have eyes. I have teeth, too.', zh: '好！我有眼睛。我还有牙齿。', note: '（指眼睛，再露出牙齿）' },
      { speaker: 'S', en: 'I have eyes! I have teeth!', zh: '我有眼睛！我有牙齿！' },
      { speaker: 'T', en: 'Wonderful. I have a face, a nose and hair!', zh: '真棒。我有一张脸、一个鼻子，还有头发！', note: '（摸摸脸、鼻子、头发）' },
      { speaker: 'S', en: 'A face! A nose! Hair!', zh: '一张脸！一个鼻子！头发！' },
      { speaker: 'T', en: 'Now a silly game. Listen. I have nose. Is that right?', zh: '现在玩个找错游戏。听好。I have nose。这样说对吗？', note: '（故意说错，挑挑眉）' },
      { speaker: 'S', en: 'No! I have a nose!', zh: '不对！应该说 I have a nose！' },
      { speaker: 'T', en: 'Yes! And listen. I have a teeth. Hmm?', zh: '对！再听。I have a teeth。嗯？', note: '（再故意说错一次）' },
      { speaker: 'S', en: 'No! I have teeth!', zh: '不对！应该说 I have teeth！' },
      { speaker: 'T', en: "Perfect! That isn't Mr. Bear. It's you! Look! I have a mouth. Well done!", zh: '完美！那不是熊先生，是你！看！我有一张嘴。干得漂亮！', note: '（竖起大拇指，带孩子复述）' },
    ],
  },

  // 2-6 This is his / her...
  '2-6': {
    title: 'This Is His Soap · 这是他的肥皂',
    turns: [
      { speaker: 'T', en: 'Hi, Leo! Look at our bear. Is he clean?', zh: '嗨，Leo！看我们的小熊。他干净吗？', note: '（举起玩具熊）' },
      { speaker: 'S', en: 'No! Dirty bear!', zh: '不干净！脏小熊！' },
      { speaker: 'T', en: 'Oh no! Let us wash him. Here is his towel.', zh: '哎呀！我们给他洗一洗。这是他的毛巾。', note: '（拿起小毛巾）' },
      { speaker: 'S', en: 'Towel!', zh: '毛巾！' },
      { speaker: 'T', en: 'Yes! This is his soap. This is his towel. Wash! Wash! Wash!', zh: '对！这是他的肥皂。这是他的毛巾。洗！洗！洗！', note: '（搓肥皂，做搓洗动作）' },
      { speaker: 'S', en: 'Wash! Wash! Wash!', zh: '洗！洗！洗！' },
      { speaker: 'T', en: 'Now his hair. This is his comb. And this is his shampoo.', zh: '现在洗头发。这是他的梳子。这是他的洗发水。', note: '（拿起梳子和洗发水瓶）' },
      { speaker: 'S', en: 'Comb! Shampoo!', zh: '梳子！洗发水！' },
      { speaker: 'T', en: 'Right! This is his bear shampoo. And this is his toothbrush, too.', zh: '对！这是他的小熊洗发水。这也是他的牙刷。', note: '（举起小牙刷）' },
      { speaker: 'S', en: 'Toothbrush!', zh: '牙刷！' },
      { speaker: 'T', en: 'Game! Boy or girl? This is her towel. This is his soap. You pick!', zh: '游戏！男孩还是女孩？这是她的毛巾。这是他的肥皂。你来分！', note: '（把卡片分成两堆，玩 his / her 分类）' },
      { speaker: 'S', en: 'Her towel! His soap!', zh: '她的毛巾！他的肥皂！' },
      { speaker: 'T', en: "Perfect! He's a clean bear now. This is his toothbrush, too. Well done!", zh: '完美！他现在是干净小熊啦。这也是他的牙刷。干得好！', note: '（把干净的小熊递给孩子）' },
    ],
  },

  // 2-7 自然拼读 th
  '2-7': {
    title: 'Th Says Th · 字母组合 th',
    turns: [
      { speaker: 'T', en: 'Hello, Leo! Today we play with one sound, th!', zh: '你好，Leo！今天我们玩一个音，th！', note: '（舌尖轻抵牙齿，示范发音）' },
      { speaker: 'S', en: 'Th!', zh: 'th！' },
      { speaker: 'T', en: 'Yes! Th says th, th, th. Open your mouth. Put your tongue here.', zh: '对！th 发 th、th、th 的音。张开你的嘴。把舌头放在这儿。', note: '（张大嘴，指指舌尖）' },
      { speaker: 'S', en: 'Th, th, th!', zh: 'th、th、th！' },
      { speaker: 'T', en: 'Great! Brush your teeth. Th, th, th!', zh: '好！刷你的牙齿。th、th、th！', note: '（拿牙刷做刷牙动作）' },
      { speaker: 'S', en: 'Brush my teeth!', zh: '刷我的牙齿！' },
      { speaker: 'T', en: 'This is his shampoo. This is her comb. Do you hear th?', zh: '这是他的洗发水。这是她的梳子。你听到 th 了吗？', note: '（举起两张图卡）' },
      { speaker: 'S', en: 'No th!', zh: '没有 th！' },
      { speaker: 'T', en: 'Right! Now hear it. Mouth, teeth, three, thirteen!', zh: '对！现在来听。mouth、teeth、three、thirteen！', note: '（逐张亮出单词卡）' },
      { speaker: 'S', en: 'Th, th, th, th!', zh: 'th、th、th、th！' },
      { speaker: 'T', en: 'One more! Where do we brush our teeth? The bathroom!', zh: '再来一个！我们在哪儿刷牙呢？在浴室！', note: '（指浴室图片卡）' },
      { speaker: 'S', en: 'Bathroom!', zh: '浴室！' },
      { speaker: 'T', en: 'Game time! I say a word, you clap for th. Th says th, th, th. Open your mouth, brush your teeth! Well done!', zh: '游戏时间！我说单词，听到 th 就拍手。th 发 th、th、th 的音。张开嘴，刷刷牙！干得漂亮！', note: '（拍手听音游戏，最后竖起大拇指）' },
    ],
  },

  // 2-8 CLIL 科学：牙齿
  '2-8': {
    title: 'Take Care Of Your Teeth · 保护好牙齿',
    turns: [
      { speaker: 'T', en: 'Hi, Leo! Today let us learn about teeth. Are you ready?', zh: '嗨，Leo！今天我们来认识牙齿。准备好了吗？', note: '（举起牙齿图片卡）' },
      { speaker: 'S', en: 'Teeth!', zh: '牙齿！' },
      { speaker: 'T', en: 'You get teeth when you are a baby. Baby teeth!', zh: '你还是小宝宝的时候就会长牙。乳牙！', note: '（指小宝宝照片）' },
      { speaker: 'S', en: 'Baby teeth!', zh: '乳牙！' },
      { speaker: 'T', en: 'When you are three, you have twenty baby teeth. Twenty!', zh: '你三岁的时候，有二十颗乳牙。二十！', note: '（伸出手指比二十）' },
      { speaker: 'S', en: 'Twenty!', zh: '二十！' },
      { speaker: 'T', en: 'Then when you are six, you get adult teeth. Adult teeth are big!', zh: '到六岁的时候，你会长恒牙。恒牙大大的！', note: '（比一比大牙和小牙）' },
      { speaker: 'S', en: 'Adult teeth!', zh: '恒牙！' },
      { speaker: 'T', en: 'Game time! I say an age, you say the teeth. Ready? Three!', zh: '游戏时间！我说年龄，你说牙齿。准备好了吗？三岁！', note: '（举起年龄卡）' },
      { speaker: 'S', en: 'Twenty baby teeth!', zh: '二十颗乳牙！' },
      { speaker: 'T', en: 'Good! Six!', zh: '好！六岁！', note: '（换一张年龄卡）' },
      { speaker: 'S', en: 'I get adult teeth!', zh: '我长恒牙啦！' },
      { speaker: 'T', en: 'Perfect! Take care of your teeth! Brush your teeth three times a day. Well done, Leo!', zh: '完美！保护好你的牙齿！每天刷三次牙。干得好，Leo！', note: '（拿牙刷示范，竖起大拇指）' },
    ],
  },

  // 2-9 综合练习
  '2-9': {
    title: 'Big Review · 综合大复习',
    turns: [
      { speaker: 'T', en: 'Hello, Leo! Big review today. Look at me!', zh: '你好，Leo！今天来个大复习。看着我！', note: '（挥挥手，站到镜头前）' },
      { speaker: 'S', en: 'Hello!', zh: '你好！' },
      { speaker: 'T', en: 'I have a mouth. I have eyes. I have feet. Your turn!', zh: '我有一张嘴。我有眼睛。我有脚。轮到你啦！', note: '（指嘴、眼睛，再跺跺脚）' },
      { speaker: 'S', en: 'I have a mouth. I have eyes. I have feet!', zh: '我有一张嘴。我有眼睛。我有脚！' },
      { speaker: 'T', en: "Fantastic! Now the bath things. What's this?", zh: '太棒了！现在看洗澡用品。这是什么？', note: '（举起小毛巾）' },
      { speaker: 'S', en: 'A towel!', zh: '一条毛巾！' },
      { speaker: 'T', en: 'Right! This is his towel. And this is his soap.', zh: '对！这是他的毛巾。这是他的肥皂。', note: '（把毛巾和肥皂放到男孩卡旁边）' },
      { speaker: 'S', en: 'His towel! His soap!', zh: '他的毛巾！他的肥皂！' },
      { speaker: 'T', en: 'This is his toothbrush. And I have a brush, and a comb!', zh: '这是他的牙刷。我还有一把刷子和一把梳子！', note: '（举起牙刷、刷子、梳子）' },
      { speaker: 'S', en: 'A toothbrush! A brush! A comb!', zh: '牙刷！刷子！梳子！' },
      { speaker: 'T', en: 'Game! I hide one thing. Close your eyes. Which one is missing?', zh: '游戏！我藏起一样东西。闭上眼睛。哪一样不见了？', note: '（悄悄藏起一样物品）' },
      { speaker: 'S', en: 'The comb is missing!', zh: '梳子不见了！' },
      { speaker: 'T', en: 'Yes! This is his toothbrush, this is his towel, and you have a great memory. Well done!', zh: '对！这是他的牙刷，这是他的毛巾，你的记性真好。干得漂亮！', note: '（把物品全摆回来，竖起大拇指）' },
    ],
  },

  // 2-10 游戏：画画比赛
  '2-10': {
    title: 'The Paint Race · 画画比赛',
    turns: [
      { speaker: 'T', en: 'Hi, Leo! Today is the Paint Race. Are you ready?', zh: '嗨，Leo！今天是画画比赛。准备好了吗？', note: '（举起画笔和色卡）' },
      { speaker: 'S', en: 'Ready!', zh: '准备好啦！' },
      { speaker: 'T', en: "First, pick a color. Look! It's blue.", zh: '先选一种颜色。看！是蓝色。', note: '（举起蓝色颜料）' },
      { speaker: 'S', en: 'Blue!', zh: '蓝色！' },
      { speaker: 'T', en: "It's my pencil. It's your schoolbag. Say it with me!", zh: '它是我的铅笔。它是你的书包。跟我一起说！', note: '（举起铅笔和书包）' },
      { speaker: 'S', en: "It's my pencil! It's your schoolbag!", zh: '它是我的铅笔！它是你的书包！' },
      { speaker: 'T', en: 'Look at my face. My mouth and my teeth. I have a mouth. I have ears.', zh: '看我的脸。我的嘴和我的牙齿。我有一张嘴。我有耳朵。', note: '（在纸上画脸，边画边说）' },
      { speaker: 'S', en: 'A mouth! Ears! Teeth!', zh: '一张嘴！耳朵！牙齿！' },
      { speaker: 'T', en: 'This is her towel. Paint it blue, please!', zh: '这是她的毛巾。请把它涂成蓝色！', note: '（把毛巾卡递给孩子）' },
      { speaker: 'S', en: 'Blue towel!', zh: '蓝毛巾！' },
      { speaker: 'T', en: "Race time! Paint the nose! It's my nose. One, two, three, go!", zh: '比赛开始！画鼻子！它是我的鼻子。一、二、三，开始！', note: '（计时开始，指着鼻子）' },
      { speaker: 'S', en: "It's my nose! Done!", zh: '它是我的鼻子！画好啦！' },
      { speaker: 'T', en: 'Wow! Blue nose, white teeth, her towel, my pencil. You win the Paint Race!', zh: '哇！蓝鼻子、白牙齿、她的毛巾、我的铅笔。画画比赛你赢啦！', note: '（举起作品，竖起大拇指）' },
    ],
  },

  // 2-11 文化：日本
  '2-11': {
    title: 'Hello From Japan · 来自日本的问候',
    turns: [
      { speaker: 'T', en: "Hello, Leo! Let's enjoy a song! Today we go to Japan.", zh: '你好，Leo！我们来听首歌！今天我们去日本。', note: '（举起小旗子和地图）' },
      { speaker: 'S', en: 'Japan!', zh: '日本！' },
      { speaker: 'T', en: "Yes! Meet my friend. Hello! I'm Miho. I'm from Japan.", zh: '对！认识一下我的朋友。你好！我是美穗。我来自日本。', note: '（举起 Miho 手偶）' },
      { speaker: 'S', en: 'Hello, Miho!', zh: '你好，美穗！' },
      { speaker: 'T', en: "Listen to Miho. I'm in grade 1. I'm six. How old are you?", zh: '听美穗说。我上一年级。我六岁。你几岁啦？', note: '（用手偶说话，再问孩子）' },
      { speaker: 'S', en: "I'm six, too!", zh: '我也六岁！' },
      { speaker: 'T', en: 'This is my teacher, Mr. Sato. He is nice!', zh: '这是我的老师，佐藤先生。他很好！', note: '（指课本里老师的照片）' },
      { speaker: 'S', en: 'Hello, Mr. Sato!', zh: '你好，佐藤先生！' },
      { speaker: 'T', en: 'I have lunch at school. I eat my lunch in my classroom.', zh: '我在学校吃午饭。我在教室里吃我的午饭。', note: '（指教室里的午餐图）' },
      { speaker: 'S', en: 'Lunch!', zh: '午饭！' },
      { speaker: 'T', en: 'Today I have rice, fish and milk. I use chopsticks!', zh: '今天我吃米饭、鱼和牛奶。我用筷子！', note: '（举起筷子和米饭图）' },
      { speaker: 'S', en: 'Rice! Chopsticks!', zh: '米饭！筷子！' },
      { speaker: 'T', en: 'Game! Show me. After lunch, I brush my teeth at school. Well done, Leo! Say bye to Miho!', zh: '游戏！做给我看。午饭后，我在学校刷牙。干得好，Leo！跟美穗说再见！', note: '（拿牙刷做刷牙动作，挥手告别）' },
    ],
  },
}
