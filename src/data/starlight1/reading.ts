// Starlight 1 · Level 1 · 阅读短文（自主阅读用）
// 对应 level-0 的 src/data/reading/（READING_PASSAGES）：每课一段连贯短文。
// 与课本原文（book.ts）分工：book.ts = 教材真实课文（一句一活动，供点读/挖空）；
// 本文件 = 另写的连贯小故事（有人物、有小变化、有收尾，不是生词例句清单）。
//
// 文体规范：docs/reading-passage-style.md
// 硬约束（零超纲 / 本课词 100% 出现 / 篇幅）由 src/data/starlight1/readingPassage1.test.ts
// 与 scripts/check-reading1.mjs 共用 readingVocab1.ts 的 validateReadingPassage1() 把住。
// Unit 2–9 的短文在各自 uN.ts 的 uN_reading 里，这里只放 Unit 1 并摊平成总表。

import type { ReadingPassage } from '../reading/index'
import { u2_reading } from './u2'
import { u3_reading } from './u3'
import { u4_reading } from './u4'
import { u5_reading } from './u5'
import { u6_reading } from './u6'
import { u7_reading } from './u7'
import { u8_reading } from './u8'
import { u9_reading } from './u9'

/** Unit 1 专有短文（美术课「蓝色手印」系列故事 + 各课语言点小故事） */
export const UNIT1_READINGS: Record<string, ReadingPassage> = {
  '1-1': {
    title: 'Count With Mr. Sonic',
    titleZh: '和 Sonic 老师一起数',
    paragraphs: [
      [
        { en: "Hello! I'm Mr. Sonic. What can you see?", zh: '你好！我是 Sonic 老师。你们能看见什么？' },
        { en: 'Monty says, "I can see a chair near the board."', zh: '蒙蒂说：「我能看见黑板旁边有一把椅子。」' },
        { en: 'Lola points at the big window.', zh: '罗拉指着那扇大窗户。' },
        { en: '"Look! Two chairs and one board," she says.', zh: '她说：「看！两把椅子和一块黑板。」' },
      ],
      [
        { en: '"But where is the trash can?" asks Monty.', zh: '「可是垃圾桶在哪儿呢？」蒙蒂问。' },
        { en: 'Lola looks near the window and under the desk.', zh: '罗拉看了看窗户旁边，又看了看书桌底下。' },
        { en: '"I can\'t find it!" she says.', zh: '她说：「我找不到它！」' },
        { en: 'Mr. Sonic smiles. "Look behind the chair."', zh: 'Sonic 老师笑了：「看看椅子后面。」' },
      ],
      [
        { en: '"Here it is! The trash can is small," says Lola.', zh: '罗拉说：「在这儿呢！这个垃圾桶小小的。」' },
        { en: '"Let\'s count again: chair, board, window, trash can."', zh: '「我们再数一遍：椅子、黑板、窗户、垃圾桶。」' },
        { en: '"Hurray! We can count them all!"', zh: '「太好啦！我们全都能数出来！」' },
      ],
    ],
  },
  '1-2': {
    title: 'Five Colors',
    titleZh: '五种颜色',
    paragraphs: [
      [
        { en: '"I\'m an artist today!" says Monty.', zh: '「今天我是小画家！」蒙蒂说。' },
        { en: 'My painting is big. Look at my colors.', zh: '我的画大大的。快看我的颜色。' },
        { en: '"What color can you see?" asks Lola.', zh: '「你能看见什么颜色？」罗拉问。' },
      ],
      [
        { en: '"I can see red and green," says Monty.', zh: '「我看见了红色和绿色。」蒙蒂说。' },
        { en: 'Lola finds white and black, too.', zh: '罗拉还找到了白色和黑色。' },
        { en: '"But where is purple?" she asks.', zh: '「可是紫色在哪儿呢？」她问。' },
        { en: 'Purple is here, under the red paint in the box!', zh: '紫色在这儿，在盒子里红色颜料的下面！' },
      ],
      [
        { en: '"Now my picture has five colors," he says.', zh: '他说：「现在我的画上有五种颜色了。」' },
        { en: '"It\'s red, black, green, white and purple."', zh: '「有红色、黑色、绿色、白色，还有紫色。」' },
        { en: '"But my favorite color is blue!"', zh: '「不过我最喜欢的颜色是蓝色！」' },
        { en: '"Blue, blue, blue!" they laugh.', zh: '「蓝色、蓝色、蓝色！」他们笑起来。' },
      ],
    ],
  },
  '1-3': {
    title: 'The Blue Handprint',
    titleZh: '蓝色的手印',
    paragraphs: [
      [
        { en: '"What color is the handprint?" asks Lola.', zh: '「这个手印是什么颜色？」罗拉问。' },
        { en: '"This is my paint," says Monty.', zh: '「这是我的颜料。」蒙蒂说。' },
        { en: '"It\'s blue. Blue is my favorite color."', zh: '「是蓝色的。蓝色是我最喜欢的颜色。」' },
      ],
      [
        { en: 'Lola finds pink and yellow on the wall.', zh: '罗拉在墙上找到了粉色和黄色。' },
        { en: '"Look! Brown and orange, too!" she says.', zh: '她说：「看！还有棕色和橙色呢！」' },
        { en: '"But where is the blue handprint?"', zh: '「可是蓝色的手印在哪儿呢？」' },
        { en: '"Oh! It is on my hand, not on the wall!"', zh: '「哦！它在我手上，不在墙上！」' },
      ],
      [
        { en: '"Sorry, Mr. Gnome!" says Monty.', zh: '「对不起，Gnome 老师！」蒙蒂说。' },
        { en: '"It\'s OK. Blue is a good color," says Mr. Gnome.', zh: '「没关系，蓝色是很好看的颜色。」Gnome 老师说。' },
        { en: '"Let\'s paint five handprints: blue, pink, brown, yellow, orange!"', zh: '「我们来印五个手印吧：蓝色、粉色、棕色、黄色、橙色！」' },
        { en: '"Hurray!" the children laugh.', zh: '「太好啦！」孩子们笑起来。' },
      ],
    ],
  },
  '1-4': {
    title: 'The Blue Handprint',
    titleZh: '蓝色手印',
    paragraphs: [
      [
        { en: 'Today is art class. The teacher is Mr. Gnome.', zh: '今天是美术课，老师是 Gnome 先生。' },
        { en: 'Look at my painting. It is a butterfly. It is very good.', zh: '看我的画。这是一只蝴蝶，画得真好。' },
        { en: 'Sammy has red paint. Daisy has yellow paint.', zh: 'Sammy 有红色颜料，Daisy 有黄色颜料。' },
      ],
      [
        { en: 'Oh no! A blue handprint is on the wall!', zh: '哦不！墙上有一个蓝色手印！' },
        { en: 'Mr. Gnome sees the handprint. He is not happy.', zh: 'Gnome 老师看见了手印，他不高兴。' },
        { en: 'Billy has blue paint. His hand is big.', zh: 'Billy 有蓝色颜料，他的手很大。' },
      ],
      [
        { en: 'Look at your hand, Mr. Gnome!', zh: '看看你的手，Gnome 老师！' },
        { en: "Oh! It is Mr. Gnome's handprint. It is blue!", zh: '哦！原来是 Gnome 老师的手印，是蓝色的！' },
        { en: 'It is OK, Mr. Gnome!', zh: '没关系的，Gnome 老师！' },
      ],
    ],
  },
  '1-5': {
    title: "Billy's Idea",
    titleZh: 'Billy 的主意',
    paragraphs: [
      [
        { en: 'This is Billy. His paint is blue.', zh: '这是 Billy，他的颜料是蓝色的。' },
        { en: '"My favorite color is blue," he says.', zh: '他说：「我最喜欢的颜色是蓝色。」' },
        { en: '"But my hand is small. This hand is big."', zh: '「可是我的手很小，这只手却很大。」' },
      ],
      [
        { en: 'Billy looks at Mr. Gnome.', zh: 'Billy 看着 Gnome 老师。' },
        { en: '"Billy has an idea!" says Lola.', zh: '罗拉说：「Billy 有主意了！」' },
        { en: '"Look at your hand, Mr. Gnome!"', zh: '「看看你的手，Gnome 老师！」' },
        { en: '"Oh! It\'s blue! It is my handprint."', zh: '「哦！是蓝色的！这是我的手印。」' },
      ],
      [
        { en: '"Sorry, children!" says Mr. Gnome.', zh: '「对不起，孩子们！」Gnome 老师说。' },
        { en: '"It\'s OK, Mr. Gnome!" the children laugh.', zh: '「没关系的，Gnome 老师！」孩子们笑起来。' },
        { en: '"Now we can paint six hands on the wall!"', zh: '「现在我们可以在墙上印六只手啦！」' },
        { en: '"Hurray for the big idea!"', zh: '「好主意，太棒啦！」' },
      ],
    ],
  },
  '1-6': {
    title: 'A Red Book, A Blue Desk',
    titleZh: '红色的书，蓝色的书桌',
    paragraphs: [
      [
        { en: '"What color is it?" asks Monty.', zh: '「它是什么颜色？」蒙蒂问。' },
        { en: '"It\'s red. It\'s a red book," says Lola.', zh: '「是红色的。这是一本红色的书。」罗拉说。' },
        { en: '"And it\'s a blue desk!"', zh: '「还有一张蓝色的书桌！」' },
      ],
      [
        { en: 'Monty looks at the door.', zh: '蒙蒂看着那扇门。' },
        { en: '"Is the door green?" he asks.', zh: '他问：「门是绿色的吗？」' },
        { en: '"Yes! It\'s a green door," says Lola.', zh: '「对！这是一扇绿色的门。」罗拉说。' },
        { en: '"But where is my red book?"', zh: '「可是我那本红色的书在哪儿呢？」' },
      ],
      [
        { en: '"It is under the blue desk!"', zh: '「它在蓝色书桌底下！」' },
        { en: '"A purple trash can, a yellow chair, a green door," she counts.', zh: '她数着：「紫色垃圾桶、黄色椅子、绿色门。」' },
        { en: 'This classroom has many colors!', zh: '这间教室有好多颜色！' },
        { en: '"Let\'s put the red book on the blue desk."', zh: '「我们把红色的书放到蓝色书桌上吧。」' },
        { en: '"Hurray! We can read now."', zh: '「太好啦！现在可以读书了。」' },
      ],
    ],
  },
  '1-7': {
    title: 'Whose Is This Pen?',
    titleZh: '这支钢笔是谁的？',
    paragraphs: [
      [
        { en: '"Whose is this pen?" asks Lola.', zh: '「这支钢笔是谁的？」罗拉问。' },
        { en: '"It\'s my pencil," says Monty.', zh: '「这是我的铅笔。」蒙蒂说。' },
        { en: '"And it\'s your eraser," he says.', zh: '他又说：「这是你的橡皮。」' },
      ],
      [
        { en: '"Look! A pencil case is under the desk."', zh: '「看！书桌底下有个铅笔盒。」' },
        { en: '"Is it your schoolbag?" asks Lola.', zh: '「这是你的书包吗？」罗拉问。' },
        { en: '"Yes! My schoolbag is big and blue."', zh: '「对！我的书包大大的，是蓝色的。」' },
        { en: '"Here it is, in the pencil case!"', zh: '「橡皮在这儿，在铅笔盒里！」' },
      ],
      [
        { en: '"Let\'s clean up!" says the teacher.', zh: '老师说：「我们收拾一下吧！」' },
        { en: '"Pen, pencil, eraser, pencil case, schoolbag," counts Monty.', zh: '蒙蒂数着：「钢笔、铅笔、橡皮、铅笔盒、书包。」' },
        { en: '"Now my desk is clean. Thank you, Lola!"', zh: '「现在我的书桌干干净净。谢谢你，罗拉！」' },
        { en: '"Hurray! We can go home!"', zh: '「太好啦！我们可以回家啦！」' },
      ],
    ],
  },
  '1-8': {
    title: 'Six Pink Pigs',
    titleZh: '六只粉红小猪',
    paragraphs: [
      [
        { en: '"There is a big pig!" says Lola.', zh: '「有一只大猪！」罗拉说。' },
        { en: '"It\'s pink. Look at the pink pig!"', zh: '「它是粉色的。快看这只粉红小猪！」' },
        { en: '"I can see six," says Monty.', zh: '「我能看见六只。」蒙蒂说。' },
      ],
      [
        { en: '"Six pigs? What can you see?"', zh: '「六只猪？你看见了什么？」' },
        { en: 'Six little pigs near the big window.', zh: '大窗户旁边有六只小猪。' },
        { en: 'One is big and five are small.', zh: '一只大大的，五只小小的。' },
        { en: '"Can you say it? Pig, pig, pig!"', zh: '「你会说吗？猪、猪、猪！」' },
        { en: '"The window is pink, too!"', zh: '「窗户也是粉色的！」' },
      ],
      [
        { en: '"Let\'s count again: one, two, three, four, five, six."', zh: '「我们再数一遍：一、二、三、四、五、六。」' },
        { en: '"Six pigs and one pink window!"', zh: '「六只猪，还有一扇粉色的窗户！」' },
        { en: '"Hurray! We can count to six today!"', zh: '「太好啦！今天我们数到六啦！」' },
      ],
    ],
  },
  '1-9': {
    title: 'Shapes In Art Class',
    titleZh: '美术课里的形状',
    paragraphs: [
      [
        { en: '"In art class, artists use many shapes," says Mr. Gnome.', zh: '「美术课上，画家会用到很多形状。」Gnome 老师说。' },
        { en: '"This is a circle. It\'s big and blue."', zh: '「这是一个圆形，大大的，是蓝色的。」' },
        { en: '"And this is a square," says Lola.', zh: '「这是一个正方形。」罗拉说。' },
      ],
      [
        { en: 'Monty draws a triangle on the wall.', zh: '蒙蒂在墙上画了一个三角形。' },
        { en: '"I see triangles and rectangles, too!"', zh: '「我还看见了三角形和长方形！」' },
        { en: '"Six circles, two triangles, four squares," he counts.', zh: '他数着：「六个圆形、两个三角形、四个正方形。」' },
        { en: '"And one rectangle!" says Lola.', zh: '「还有一个长方形！」罗拉说。' },
        { en: '"But my painting has no circle," says Monty.', zh: '「可是我的画上没有圆形。」蒙蒂说。' },
      ],
      [
        { en: '"Make a circle with your hand!"', zh: '「用你的手印一个圆形吧！」' },
        { en: '"Hurray! Now my painting has six shapes!"', zh: '「太好啦！现在我的画上有六个形状啦！」' },
        { en: '"Art is fun with circles and squares!"', zh: '「有圆形和正方形，美术真好玩！」' },
      ],
    ],
  },
  '1-10': {
    title: 'Six Handprints',
    titleZh: '六个手印',
    paragraphs: [
      [
        { en: '"Six handprints! One is blue," says Lola.', zh: '「六个手印！一个是蓝色的。」罗拉说。' },
        { en: '"One is pink and yellow, too."', zh: '「还有一个粉色带黄色的。」' },
        { en: '"Look! One on the window, one on the wall."', zh: '「看！一个在窗户上，一个在墙上。」' },
      ],
      [
        { en: '"It\'s my eraser. It\'s yellow," says Monty.', zh: '「这是我的橡皮，是黄色的。」蒙蒂说。' },
        { en: '"And it\'s your schoolbag. It\'s pink."', zh: '「这是你的书包，是粉色的。」' },
        { en: '"Whose is this pen?" asks Lola.', zh: '「这支钢笔是谁的？」罗拉问。' },
        { en: '"It\'s my pen. This is my paint. It\'s blue."', zh: '「是我的钢笔。这是我的颜料，是蓝色的。」' },
      ],
      [
        { en: '"There are two triangles and three circles!"', zh: '「有两个三角形和三个圆形！」' },
        { en: '"But my favorite color is blue, blue, blue!"', zh: '「不过我最喜欢的颜色是蓝色、蓝色、蓝色！」' },
        { en: '"Let\'s count the shapes on the painting."', zh: '「我们数一数画上的形状吧。」' },
        { en: '"Hurray! Six handprints and many colors!"', zh: '「太好啦！六个手印，还有好多颜色！」' },
      ],
    ],
  },
}

/** 全册摊平总表（供 getReadingPassage1 / 校验器 / STARLIGHT1.readings 用） */
export const READING_PASSAGES1: Record<string, ReadingPassage> = {
  ...UNIT1_READINGS,
  ...u2_reading,
  ...u3_reading,
  ...u4_reading,
  ...u5_reading,
  ...u6_reading,
  ...u7_reading,
  ...u8_reading,
  ...u9_reading,
}

export function getReadingPassage1(unitId: number, lessonId: number): ReadingPassage | undefined {
  return READING_PASSAGES1[`${unitId}-${lessonId}`]
}
