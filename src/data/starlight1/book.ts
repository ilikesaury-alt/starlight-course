// Starlight 1 · Level 1 · Unit 1「Monty the Artist」课本原文（试点单元）
// 对照 starlight-book.ts（level-0）：Record<`单元-课`, LessonBook>，每课按活动分成若干 chapter，
// 每个 page 存一句真实出现过的英文原句 + 中文释义。
// 这里只保留教学相关的关键句（去掉页码 / 重复活动帧），中文释义来自人工翻译。

import type { LessonBook } from '../starlight-book'
import { u2_book } from './u2'
import { u3_book } from './u3'
import { u4_book } from './u4'
import { u5_book } from './u5'
import { u6_book } from './u6'
import { u7_book } from './u7'
import { u8_book } from './u8'
import { u9_book } from './u9'

export const STARLIGHT_BOOK1: Record<string, LessonBook> = {
  ...u2_book,
  ...u3_book,
  ...u4_book,
  ...u5_book,
  ...u6_book,
  ...u7_book,
  ...u8_book,
  ...u9_book,
  '1-1': {
    title: 'Monty and Lola',
    sections: [
      { chapter: 'Get to know each other.', chapterZh: '互相认识。', pages: [
        { text: "Hello! I'm Mr. Sonic.", textZh: '你好！我是 Sonic 老师。' },
        { text: "What's your name?", textZh: '你叫什么名字？' },
        { text: "I'm Monty.", textZh: '我是 Monty。' },
        { text: "I'm Lola.", textZh: '我是 Lola。' },
      ] },
      { chapter: 'Focus on: classroom words.', chapterZh: '重点词汇：教室物品。', pages: [
        { text: 'chair', textZh: '椅子' },
        { text: 'board', textZh: '黑板' },
        { text: 'window', textZh: '窗户' },
        { text: 'trash can', textZh: '垃圾桶' },
      ] },
      { chapter: 'Look, count and say.', chapterZh: '看一看，数一数，说一说。', pages: [
        { text: 'What can you see in the picture?', textZh: '你在图片里看到了什么？' },
        { text: 'How many chairs are there?', textZh: '有几把椅子？' },
        { text: 'I can see a chair.', textZh: '我看见一把椅子。' },
        { text: 'Look! Two chairs.', textZh: '看！两把椅子。' },
        { text: 'one chair / two chairs', textZh: '一把椅子 / 两把椅子' },
      ] },
    ],
  },
  '1-2': {
    title: 'Colors (1)',
    sections: [
      { chapter: 'Warm up.', chapterZh: '热身。', pages: [
        { text: "What's this?", textZh: '这是什么？' },
        { text: 'What color can you see?', textZh: '你能看到什么颜色？' },
      ] },
      { chapter: 'Focus on: colors.', chapterZh: '重点词汇：颜色。', pages: [
        { text: 'red', textZh: '红色' },
        { text: 'black', textZh: '黑色' },
        { text: 'green', textZh: '绿色' },
        { text: 'white', textZh: '白色' },
        { text: 'purple', textZh: '紫色' },
      ] },
      { chapter: 'Listen and sing along.', chapterZh: '听一听，一起唱。', pages: [
        { text: "I'm an artist.", textZh: '我是一个画家。' },
        { text: "My painting's big.", textZh: '我的画很大。' },
        { text: "It's red, green, orange and yellow and pink.", textZh: '它是红的、绿的、橙的、黄的和粉的。' },
        { text: "It's white, black, brown and purple, too.", textZh: '还有白的、黑的、棕的和紫的。' },
        { text: 'But my favorite color is blue, blue, blue!', textZh: '但我最爱的颜色是蓝、蓝、蓝！' },
      ] },
    ],
  },
  '1-3': {
    title: 'Colors (2)',
    sections: [
      { chapter: 'Focus on: more colors.', chapterZh: '重点词汇：更多颜色。', pages: [
        { text: 'blue', textZh: '蓝色' },
        { text: 'pink', textZh: '粉色' },
        { text: 'brown', textZh: '棕色' },
        { text: 'yellow', textZh: '黄色' },
        { text: 'orange', textZh: '橙色' },
      ] },
      { chapter: 'Look and say.', chapterZh: '看一看，说一说。', pages: [
        { text: 'A: What color is it?', textZh: '甲：它是什么颜色？' },
        { text: 'B: It’s blue.', textZh: '乙：是蓝色的。' },
        { text: "This is my paint.", textZh: '这是我的颜料。' },
        { text: 'My favorite color is blue.', textZh: '我最喜欢的颜色是蓝色。' },
      ] },
    ],
  },
  '1-4': {
    title: 'Art Class',
    sections: [
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'Today is art class.', textZh: '今天是美术课。' },
        { text: 'The teacher is Mr. Gnome.', textZh: '老师是 Gnome 先生。' },
        { text: 'Look at my painting.', textZh: '看我的画。' },
        { text: "It's a butterfly.", textZh: '它是一只蝴蝶。' },
        { text: "It's very good.", textZh: '它非常好。' },
      ] },
      { chapter: 'Oh no!', chapterZh: '哦不！', pages: [
        { text: 'A handprint!', textZh: '一个手印！' },
        { text: "It's blue.", textZh: '是蓝色的。' },
        { text: 'Mr. Gnome sees a handprint on the wall.', textZh: 'Gnome 老师看见墙上有个手印。' },
        { text: 'This is Sammy.', textZh: '这是 Sammy。' },
        { text: "This is my paint. It's red.", textZh: '这是我的颜料，是红色的。' },
        { text: 'This is Daisy.', textZh: '这是 Daisy。' },
        { text: "This is my paint. It's yellow.", textZh: '这是我的颜料，是黄色的。' },
      ] },
      { chapter: 'Show Time.', chapterZh: '展示时间。', pages: [
        { text: "Look, it's my work.", textZh: '看，这是我的作品。' },
        { text: "This is a butterfly. It's ...", textZh: '这是一只蝴蝶，它是……' },
      ] },
    ],
  },
  '1-5': {
    title: 'Whose Handprint?',
    sections: [
      { chapter: 'Guided reading.', chapterZh: '引导阅读。', pages: [
        { text: 'This is Billy.', textZh: '这是 Billy。' },
        { text: "This is my paint. It's blue.", textZh: '这是我的颜料，是蓝色的。' },
        { text: 'My favorite color is blue.', textZh: '我最喜欢的颜色是蓝色。' },
        { text: 'But my hand is small. This hand is big.', textZh: '但我的手很小，这只手很大。' },
        { text: 'Look at your hand, Mr. Gnome!', textZh: '看看你的手，Gnome 老师！' },
      ] },
      { chapter: 'The answer.', chapterZh: '答案揭晓。', pages: [
        { text: "Billy has an idea.", textZh: 'Billy 有了主意。' },
        { text: "Oh! It's blue!", textZh: '哦！是蓝色的！' },
        { text: "Sorry, children!", textZh: '对不起，孩子们！' },
        { text: "It's Mr. Gnome's handprint.", textZh: '这是 Gnome 老师的手印。' },
        { text: "It's OK, Mr. Gnome!", textZh: '没关系的，Gnome 老师！' },
      ] },
    ],
  },
  '1-6': {
    title: 'What Color Is It?',
    sections: [
      { chapter: 'Grammar.', chapterZh: '语法。', pages: [
        { text: 'What color is it?', textZh: '它是什么颜色？' },
        { text: "It's red.", textZh: '它是红色的。' },
        { text: "It's blue.", textZh: '它是蓝色的。' },
        { text: "It's yellow.", textZh: '它是黄色的。' },
        { text: "It's = It is", textZh: 'It’s = It is（它是）' },
      ] },
      { chapter: 'Make sentences.', chapterZh: '造句。', pages: [
        { text: "It's a red book.", textZh: '它是一本红色的书。' },
        { text: "It's a blue desk.", textZh: '它是一张蓝色的书桌。' },
        { text: "It's a yellow chair.", textZh: '它是一把黄色的椅子。' },
        { text: "It's a purple trash can.", textZh: '它是一个紫色的垃圾桶。' },
        { text: "It's a green door.", textZh: '它是一扇绿色的门。' },
      ] },
    ],
  },
  '1-7': {
    title: 'School Things',
    sections: [
      { chapter: 'Learn new words.', chapterZh: '学习新词。', pages: [
        { text: 'pen', textZh: '钢笔' },
        { text: 'pencil', textZh: '铅笔' },
        { text: 'pencil case', textZh: '铅笔盒' },
        { text: 'schoolbag', textZh: '书包' },
        { text: 'eraser', textZh: '橡皮' },
      ] },
      { chapter: 'Grammar: my / your.', chapterZh: '语法：我的／你的。', pages: [
        { text: "It's my pencil.", textZh: '它是我的铅笔。' },
        { text: "It's your pencil.", textZh: '它是你的铅笔。' },
        { text: 'my: 我的', textZh: 'my = 我的' },
        { text: 'your: 你的', textZh: 'your = 你的' },
        { text: 'Whose is this pen?', textZh: '这支钢笔是谁的？' },
        { text: "It's your eraser.", textZh: '它是你的橡皮。' },
        { text: "It's your schoolbag.", textZh: '它是你的书包。' },
      ] },
    ],
  },
  '1-8': {
    title: 'Phonics: /i/',
    sections: [
      { chapter: 'Chant Time.', chapterZh: 'chant 时间。', pages: [
        { text: 'I says i, I says i,', textZh: 'I 发 i 的音，I 发 i 的音，' },
        { text: 'There is a big pig.', textZh: '有一只大猪。' },
        { text: 'i i i.', textZh: 'i i i。' },
      ] },
      { chapter: 'Learn and read the words.', chapterZh: '学习并拼读单词。', pages: [
        { text: 'pink', textZh: '粉色' },
        { text: 'six', textZh: '六' },
        { text: 'big', textZh: '大的' },
        { text: 'artist', textZh: '艺术家' },
        { text: 'handprint', textZh: '手印' },
        { text: 'window', textZh: '窗户' },
      ] },
      { chapter: 'Can you sound it out?', chapterZh: '你能拼读出来吗？', pages: [
        { text: 'if', textZh: '如果' },
        { text: 'milk', textZh: '牛奶' },
        { text: 'pick', textZh: '摘' },
        { text: 'chip', textZh: '薯片' },
        { text: 'sit', textZh: '坐' },
        { text: 'tip', textZh: '尖儿／小费' },
        { text: 'sick', textZh: '生病的' },
      ] },
    ],
  },
  '1-9': {
    title: 'Shapes',
    sections: [
      { chapter: 'Focus on: shapes.', chapterZh: '重点词汇：形状。', pages: [
        { text: 'circle', textZh: '圆形' },
        { text: 'square', textZh: '正方形' },
        { text: 'triangle', textZh: '三角形' },
        { text: 'rectangle', textZh: '长方形' },
      ] },
      { chapter: 'Abstract Art.', chapterZh: '抽象艺术。', pages: [
        { text: 'In abstract art, artists use different shapes.', textZh: '在抽象艺术里，艺术家使用不同的形状。' },
        { text: 'like squares, rectangles, triangles and circles.', textZh: '比如正方形、长方形、三角形和圆形。' },
        { text: 'They also use many colors.', textZh: '他们也使用很多颜色。' },
      ] },
      { chapter: 'Describe the picture.', chapterZh: '描述图画。', pages: [
        { text: 'Six circles, two triangles, four squares and one rectangle.', textZh: '六个圆形、两个三角形、四个正方形和一个长方形。' },
      ] },
    ],
  },
  '1-10': {
    title: 'Practice',
    sections: [
      { chapter: 'Look and read along.', chapterZh: '看一看，跟着读。', pages: [
        { text: 'Six handprints! One is blue.', textZh: '六个手印！一个是蓝色的。' },
        { text: 'One is pink and yellow, too.', textZh: '还有一个也是粉色和黄色。' },
        { text: 'One on the window, one on the wall.', textZh: '一个在窗户上，一个在墙上。' },
        { text: 'One is big and one is small.', textZh: '一个大，一个小。' },
      ] },
      { chapter: 'Say the sentences.', chapterZh: '说出这些句子。', pages: [
        { text: "It's my eraser. It's yellow.", textZh: '它是我的橡皮，是黄色的。' },
        { text: "It's your schoolbag. It's pink.", textZh: '它是你的书包，是粉色的。' },
        { text: "This is my paint. It's blue.", textZh: '这是我的颜料，是蓝色的。' },
        { text: 'My favorite color is blue.', textZh: '我最喜欢的颜色是蓝色。' },
        { text: 'There are two triangles and three circles.', textZh: '有两个三角形和三个圆形。' },
      ] },
    ],
  },
}
