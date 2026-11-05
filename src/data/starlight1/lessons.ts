// Starlight 1 · Level 1 · Unit 1「Monty the Artist」课程数据（试点单元）
// 数据来源：scripts/extract_starlight1.py 从教材 PDF 提取的 extracted.json
// 结构对齐 level-0（src/data/lessons.ts）：每个单元 N 课，每课独立的 words + sentences。
// Level 1 每单元 10 课（Starter + Vocabulary / Reading / Language Focus / Phonics / CLIL / Practice），
// 因此这里 Unit 1 有 10 课，每课聚焦一种技能，单词与句型围绕该技能抽取。

import type { Lesson } from '../starlight'
import { u2_lessons } from './u2'
import { u3_lessons } from './u3'
import { u4_lessons } from './u4'
import { u5_lessons } from './u5'
import { u6_lessons } from './u6'
import { u7_lessons } from './u7'
import { u8_lessons } from './u8'
import { u9_lessons } from './u9'

export const lessonsByUnit1: Record<number, Lesson[]> = {
  ...u2_lessons,
  ...u3_lessons,
  ...u4_lessons,
  ...u5_lessons,
  ...u6_lessons,
  ...u7_lessons,
  ...u8_lessons,
  ...u9_lessons,
  // === Unit 1: Monty the Artist（试点，内联） ===
  1: [
    {
      id: 1,
      title: 'Monty and Lola',
      titleZh: '蒙蒂和罗拉（开学）',
      words: [
        { en: 'chair', zh: '椅子', emoji: '🪑', ipa: '/tʃeə/' },
        { en: 'board', zh: '黑板', emoji: '🟫', ipa: '/bɔːd/' },
        { en: 'window', zh: '窗户', emoji: '🪟', ipa: '/ˈwɪndəʊ/' },
        { en: 'trash can', zh: '垃圾桶', emoji: '🗑️', ipa: '/træʃ kæn/' },
      ],
      sentences: [
        { en: 'What can you see in the picture?', zh: '你在图片里看到了什么？', hint: '看图提问' },
        { en: 'I can see a chair.', zh: '我看见一把椅子。', hint: '回答看到的物品' },
        { en: 'How many chairs are there?', zh: '有几把椅子？', hint: '询问数量' },
        { en: 'Look! Two chairs.', zh: '看！两把椅子。', hint: '用复数表达数量' },
        { en: "Let's count.", zh: '我们数一数。', hint: '一起数数' },
      ],
    },
    {
      id: 2,
      title: 'Colors (1)',
      titleZh: '颜色（一）',
      words: [
        { en: 'red', zh: '红色', emoji: '🔴', ipa: '/red/' },
        { en: 'black', zh: '黑色', emoji: '⚫', ipa: '/blæk/' },
        { en: 'green', zh: '绿色', emoji: '🟢', ipa: '/ɡriːn/' },
        { en: 'white', zh: '白色', emoji: '⚪', ipa: '/waɪt/' },
        { en: 'purple', zh: '紫色', emoji: '🟣', ipa: '/ˈpɜːpl/' },
      ],
      sentences: [
        { en: 'What color can you see?', zh: '你能看到什么颜色？', hint: '问看到的颜色' },
        { en: "It's red.", zh: '它是红色的。', hint: '回答颜色' },
        { en: "I'm an artist.", zh: '我是一个画家。', hint: '自我介绍身份' },
        { en: "My painting's big.", zh: '我的画很大。', hint: '描述画作' },
        { en: 'My favorite color is blue.', zh: '我最喜欢的颜色是蓝色。', hint: '表达最爱的颜色' },
      ],
    },
    {
      id: 3,
      title: 'Colors (2)',
      titleZh: '颜色（二）',
      words: [
        { en: 'blue', zh: '蓝色', emoji: '🔵', ipa: '/bluː/' },
        { en: 'pink', zh: '粉色', emoji: '🌸', ipa: '/pɪŋk/' },
        { en: 'brown', zh: '棕色', emoji: '🟤', ipa: '/braʊn/' },
        { en: 'yellow', zh: '黄色', emoji: '🟡', ipa: '/ˈjeləʊ/' },
        { en: 'orange', zh: '橙色', emoji: '🟠', ipa: '/ˈɒrɪndʒ/' },
      ],
      sentences: [
        { en: 'What color is it?', zh: '它是什么颜色？', hint: '询问颜色' },
        { en: "It's blue.", zh: '它是蓝色的。', hint: '回答颜色' },
        { en: "This is my paint.", zh: '这是我的颜料。', hint: '指着自己的颜料说' },
        { en: 'My favorite color is blue.', zh: '我最喜欢的颜色是蓝色。', hint: '表达最爱的颜色' },
        { en: 'What color is the handprint?', zh: '手印是什么颜色？', hint: '结合故事提问' },
      ],
    },
    {
      id: 4,
      title: 'Art Class',
      titleZh: '美术课（阅读）',
      words: [
        { en: 'painting', zh: '画作', emoji: '🖼️', ipa: '/ˈpeɪntɪŋ/' },
        { en: 'butterfly', zh: '蝴蝶', emoji: '🦋', ipa: '/ˈbʌtəflaɪ/' },
        { en: 'handprint', zh: '手印', emoji: '✋', ipa: '/ˈhændprɪnt/' },
        { en: 'wall', zh: '墙', emoji: '🧱', ipa: '/wɔːl/' },
        { en: 'art class', zh: '美术课', emoji: '🎨', ipa: '/ɑːt klɑːs/' },
      ],
      sentences: [
        { en: 'Today is art class.', zh: '今天是美术课。', hint: '说明场景' },
        { en: 'Look at my painting.', zh: '看我的画。', hint: '展示自己的画' },
        { en: "It's a butterfly.", zh: '它是一只蝴蝶。', hint: '描述画的内容' },
        { en: "It's very good.", zh: '它非常好。', hint: '夸奖画作' },
        { en: 'Oh no! A handprint!', zh: '哦不！一个手印！', hint: '发现墙上的手印' },
      ],
    },
    {
      id: 5,
      title: 'Whose Handprint?',
      titleZh: '是谁的手印？（阅读）',
      words: [
        { en: 'favorite', zh: '最喜欢的', emoji: '⭐', ipa: '/ˈfeɪvərɪt/' },
        { en: 'idea', zh: '主意', emoji: '💡', ipa: '/aɪˈdɪə/' },
        { en: 'sorry', zh: '抱歉', emoji: '😟', ipa: '/ˈsɒri/' },
        { en: 'children', zh: '孩子们', emoji: '👧', ipa: '/ˈtʃɪldrən/' },
        { en: 'hand', zh: '手', emoji: '✋', ipa: '/hænd/' },
      ],
      sentences: [
        { en: 'This is Billy.', zh: '这是 Billy。', hint: '介绍角色' },
        { en: "This is my paint. It's blue.", zh: '这是我的颜料，是蓝色的。', hint: '描述颜料颜色' },
        { en: 'My favorite color is blue.', zh: '我最喜欢的颜色是蓝色。', hint: '表达最爱颜色' },
        { en: "It's Mr. Gnome's handprint.", zh: '这是 Gnome 老师的手印。', hint: '揭示答案' },
        { en: "It's OK, Mr. Gnome!", zh: '没关系的，Gnome 老师！', hint: '安慰老师' },
      ],
    },
    {
      id: 6,
      title: 'What Color Is It?',
      titleZh: '它是什么颜色？',
      words: [
        { en: 'book', zh: '书', emoji: '📕', ipa: '/bʊk/' },
        { en: 'desk', zh: '书桌', emoji: '🪑', ipa: '/desk/' },
        { en: 'door', zh: '门', emoji: '🚪', ipa: '/dɔː/' },
        { en: 'red', zh: '红色', emoji: '🔴', ipa: '/red/' },
        { en: 'blue', zh: '蓝色', emoji: '🔵', ipa: '/bluː/' },
      ],
      sentences: [
        { en: 'What color is it?', zh: '它是什么颜色？', hint: '询问颜色' },
        { en: "It's red.", zh: '它是红色的。', hint: '回答颜色（It\'s = It is）' },
        { en: "It's a red book.", zh: '它是一本红色的书。', hint: 'a / an + 颜色 + 物品' },
        { en: "It's a blue desk.", zh: '它是一张蓝色的书桌。', hint: '描述物品颜色' },
        { en: "It's a yellow chair.", zh: '它是一把黄色的椅子。', hint: '描述物品颜色' },
      ],
    },
    {
      id: 7,
      title: 'School Things',
      titleZh: '文具与「我的／你的」',
      words: [
        { en: 'pen', zh: '钢笔', emoji: '🖊️', ipa: '/pen/' },
        { en: 'pencil', zh: '铅笔', emoji: '✏️', ipa: '/ˈpensl/' },
        { en: 'pencil case', zh: '铅笔盒', emoji: '📦', ipa: '/ˈpensl keɪs/' },
        { en: 'schoolbag', zh: '书包', emoji: '🎒', ipa: '/ˈskuːlbæɡ/' },
        { en: 'eraser', zh: '橡皮', emoji: '🧽', ipa: '/ɪˈreɪzə/' },
      ],
      sentences: [
        { en: "It's my pencil.", zh: '它是我的铅笔。', hint: 'my = 我的' },
        { en: "It's your eraser.", zh: '它是你的橡皮。', hint: 'your = 你的' },
        { en: 'Whose is this pen?', zh: '这支钢笔是谁的？', hint: '询问物品归属' },
        { en: "It's your schoolbag.", zh: '它是你的书包。', hint: '回答归属' },
        { en: "Let's clean up!", zh: '我们收拾一下吧！', hint: '收拾文具' },
      ],
    },
    {
      id: 8,
      title: 'Phonics: /i/',
      titleZh: '自然拼读：短音 i',
      words: [
        { en: 'pig', zh: '猪', emoji: '🐷', ipa: '/pɪɡ/' },
        { en: 'six', zh: '六', emoji: '6️⃣', ipa: '/sɪks/' },
        { en: 'big', zh: '大的', emoji: '🐘', ipa: '/bɪɡ/' },
        { en: 'pink', zh: '粉色', emoji: '🌸', ipa: '/pɪŋk/' },
        { en: 'window', zh: '窗户', emoji: '🪟', ipa: '/ˈwɪndəʊ/' },
      ],
      sentences: [
        { en: 'I says i, i, i.', zh: '字母 I 发 i 的音。', hint: '字母 i 的短音' },
        { en: 'There is a big pig.', zh: '有一只大猪。', hint: '含短音 i 的句子' },
        { en: 'I can see six.', zh: '我看见六个。', hint: '数数 + 短音 i' },
        { en: 'The window is pink.', zh: '窗户是粉色的。', hint: '结合颜色' },
        { en: 'Can you sound it out?', zh: '你能拼读出来吗？', hint: '拼读提示' },
      ],
    },
    {
      id: 9,
      title: 'Shapes',
      titleZh: '形状（艺术）',
      words: [
        { en: 'circle', zh: '圆形', emoji: '⭕', ipa: '/ˈsɜːkl/' },
        { en: 'square', zh: '正方形', emoji: '🟦', ipa: '/skweə/' },
        { en: 'triangle', zh: '三角形', emoji: '🔺', ipa: '/ˈtraɪæŋɡl/' },
        { en: 'rectangle', zh: '长方形', emoji: '▭', ipa: '/ˈrektæŋɡl/' },
        { en: 'art', zh: '艺术', emoji: '🎨', ipa: '/ɑːt/' },
      ],
      sentences: [
        { en: 'This is a circle.', zh: '这是一个圆形。', hint: '指认形状' },
        { en: 'This is a square.', zh: '这是一个正方形。', hint: '指认形状' },
        { en: 'I see triangles.', zh: '我看见三角形。', hint: '用复数说形状' },
        { en: 'Artists use many shapes.', zh: '艺术家使用很多形状。', hint: '艺术中的形状' },
        { en: 'This painting is colorful.', zh: '这幅画色彩丰富。', hint: '描述画作' },
      ],
    },
    {
      id: 10,
      title: 'Practice',
      titleZh: '综合练习',
      words: [
        { en: 'triangle', zh: '三角形', emoji: '🔺', ipa: '/ˈtraɪæŋɡl/' },
        { en: 'circle', zh: '圆形', emoji: '⭕', ipa: '/ˈsɜːkl/' },
        { en: 'pen', zh: '钢笔', emoji: '🖊️', ipa: '/pen/' },
        { en: 'eraser', zh: '橡皮', emoji: '🧽', ipa: '/ɪˈreɪzə/' },
        { en: 'schoolbag', zh: '书包', emoji: '🎒', ipa: '/ˈskuːlbæɡ/' },
      ],
      sentences: [
        { en: "It's my eraser. It's yellow.", zh: '它是我的橡皮，是黄色的。', hint: '描述归属与颜色' },
        { en: "It's your schoolbag. It's pink.", zh: '它是你的书包，是粉色的。', hint: '描述归属与颜色' },
        { en: "This is my paint. It's blue.", zh: '这是我的颜料，是蓝色的。', hint: '结合故事' },
        { en: 'There are two triangles and three circles.', zh: '有两个三角形和三个圆形。', hint: '数量 + 形状' },
        { en: 'My favorite color is blue.', zh: '我最喜欢的颜色是蓝色。', hint: '表达最爱颜色' },
      ],
    },
  ],
}
