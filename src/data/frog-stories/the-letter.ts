// 《The Letter》（信）—— Arnold Lobel 正版绘本《Frog and Toad Storybook Favorites》中的故事
// 内容来源：用户自有正版绘本 PDF 第 61~72 页（书页 57~68），经 OCR 提取 + 人工校对。
// 原 OCR 噪声及修正：
//   - 字母 T 大量误识为 I（"T have"→"I have"、"T think"→"I think"、"T am"→"I am"）
//   - 弯曲引号 “ ” ’ 统一为英文直引号 " '
//   - 跨行断句按语义合并（如 "It is the time / when I wait..."）
//   - 第 67/69 页环绕插画的乱序碎片（{7 / wy / seattacn Oi 等）按语序剔除
//   - 页脚页码（57~68）删除
//
// 版权口径：仅放文字（逐句 en/zh）作合理使用展示，不含扫描图片，原 PDF 不进版本控制。

import type { ReadingSentence } from '../reading/index'
import type { Word } from '../starlight'

export interface FrogStory {
  id: string
  title: string
  titleZh: string
  sentences: ReadingSentence[]
  words: Word[]
}

export const theLetter: FrogStory = {
  id: 'the-letter',
  title: 'The Letter',
  titleZh: '信',
  sentences: [
    { en: 'Toad was sitting on his front porch.', zh: '蟾蜍正坐在他家的前廊上。' },
    { en: 'Frog came along and said, "What is the matter, Toad? You are looking sad."', zh: '青蛙走过来问："蟾蜍，你怎么啦？你看起来好难过。"' },
    { en: '"Yes," said Toad.', zh: '"是呀，"蟾蜍说。' },
    { en: '"This is my sad time of day. It is the time when I wait for the mail to come. It always makes me very unhappy."', zh: '"这是我一天里最难过的时刻。就是我等信来的时候。等信总让我特别不开心。"' },
    { en: '"Why is that?" asked Frog.', zh: '"为什么呢？"青蛙问。' },
    { en: '"Because I never get any mail," said Toad.', zh: '"因为我从来收不到信，"蟾蜍说。' },
    { en: '"Not ever?" asked Frog.', zh: '"一次都没有吗？"青蛙问。' },
    { en: '"No, never," said Toad.', zh: '"没有，从来没有，"蟾蜍说。' },
    { en: '"No one has ever sent me a letter. Every day my mailbox is empty. That is why waiting for the mail is a sad time for me."', zh: '"从来没有人给我寄过信。每天我的信箱都是空的。所以等信对我来说，才是难过的时刻。"' },
    { en: 'Frog and Toad sat on the porch, feeling sad together.', zh: '青蛙和蟾蜍坐在前廊上，一起难过着。' },
    { en: 'Then Frog said, "I have to go home now, Toad. There is something that I must do."', zh: '然后青蛙说："我现在得回家了，蟾蜍。我有件事必须去做。"' },
    { en: 'Frog hurried home.', zh: '青蛙急急忙忙跑回了家。' },
    { en: 'He found a pencil and a piece of paper.', zh: '他找到一支铅笔和一张纸。' },
    { en: 'He wrote on the paper.', zh: '他在纸上写了起来。' },
    { en: 'He put the paper in an envelope.', zh: '他把纸装进一个信封里。' },
    { en: 'On the envelope he wrote "A LETTER FOR TOAD."', zh: '他在信封上写着"写给蟾蜍的信"。' },
    { en: 'Frog ran out of his house.', zh: '青蛙跑出了家门。' },
    { en: 'He saw a snail that he knew.', zh: '他看见了一只自己认识的蜗牛。' },
    { en: `"Snail," said Frog, "please take this letter to Toad's house and put it in his mailbox."`, zh: '"蜗牛，"青蛙说，"请把这封信送到蟾蜍家，放进他的信箱里。"' },
    { en: '"Sure," said the snail. "Right away."', zh: '"当然可以，"蜗牛说，"马上就去。"' },
    { en: "Then Frog ran back to Toad's house.", zh: '然后青蛙又跑回了蟾蜍家。' },
    { en: 'Toad was in bed, taking a nap.', zh: '蟾蜍正躺在床上打盹儿。' },
    { en: '"Toad," said Frog, "I think you should get up and wait for the mail some more."', zh: '"蟾蜍，"青蛙说，"我想你该起来，再多等一会儿信。"' },
    { en: '"No," said Toad, "I am tired of waiting for the mail."', zh: '"不啦，"蟾蜍说，"我等信等累了。"' },
    { en: "Frog looked out of the window at Toad's mailbox.", zh: '青蛙望着窗外蟾蜍的信箱。' },
    { en: 'The snail was not there yet.', zh: '蜗牛还没到呢。' },
    { en: '"Toad," said Frog, "you never know when someone may send you a letter."', zh: '"蟾蜍，"青蛙说，"你永远不知道什么时候会有人给你寄信。"' },
    { en: '"No, no," said Toad. "I do not think anyone will ever send me a letter."', zh: '"不会的，不会的，"蟾蜍说，"我觉得不会有人给我寄信的。"' },
    { en: 'Frog looked out of the window.', zh: '青蛙又望向窗外。' },
    { en: 'The snail was not there yet.', zh: '蜗牛还是没到。' },
    { en: '"But, Toad," said Frog, "someone may send you a letter today."', zh: '"可是，蟾蜍，"青蛙说，"说不定今天就会有人给你寄信呢。"' },
    { en: `"Don't be silly," said Toad.`, zh: '"别傻啦，"蟾蜍说。' },
    { en: '"No one has ever sent me a letter before, and no one will send me a letter today."', zh: '"以前从来没有人给我寄过信，今天也不会有人寄的。"' },
    { en: 'Frog looked out of the window.', zh: '青蛙又往窗外看去。' },
    { en: 'The snail was still not there.', zh: '蜗牛依然没到。' },
    { en: '"Frog, why do you keep looking out of the window?" asked Toad.', zh: '"青蛙，你怎么老往窗外看呀？"蟾蜍问。' },
    { en: '"Because now I am waiting for the mail," said Frog.', zh: '"因为现在我在等信呀，"青蛙说。' },
    { en: '"But there will not be any," said Toad.', zh: '"可是不会有信的，"蟾蜍说。' },
    { en: '"Oh, yes there will," said Frog, "because I have sent you a letter."', zh: '"哦，会的，"青蛙说，"因为我已经给你寄了一封信。"' },
    { en: '"You have?" said Toad.', zh: '"你寄了？"蟾蜍问。' },
    { en: '"What did you write in the letter?"', zh: '"你在信里写了什么？"' },
    { en: `Frog said, "I wrote 'Dear Toad, I am glad that you are my best friend. Your best friend, Frog.'"`, zh: `青蛙说："我写的是'亲爱的蟾蜍，我很高兴你是我最好的朋友。你最好的朋友，青蛙。'"` },
    { en: '"Oh," said Toad, "that makes a very good letter."', zh: '"哦，"蟾蜍说，"这真是一封很棒的信。"' },
    { en: 'Then Frog and Toad went out onto the front porch to wait for the mail.', zh: '然后青蛙和蟾蜍一起走到前廊上，等着信来。' },
    { en: 'They sat there, feeling happy together.', zh: '他们坐在那儿，一起感到很开心。' },
    { en: 'Frog and Toad waited a long time.', zh: '青蛙和蟾蜍等了很久很久。' },
    { en: "Four days later the snail got to Toad's house and gave him the letter from Frog.", zh: '四天以后，蜗牛终于到了蟾蜍家，把青蛙的信交给了他。' },
    { en: 'Toad was very pleased to have it.', zh: '蟾蜍收到这封信，心里高兴极了。' },
  ],
  words: [
    { en: 'letter', zh: '信', emoji: '✉️' },
    { en: 'frog', zh: '青蛙', emoji: '🐸' },
    { en: 'toad', zh: '蟾蜍', emoji: '🐸' },
    { en: 'porch', zh: '门廊', emoji: '🏠' },
    { en: 'mail', zh: '邮件', emoji: '📬' },
    { en: 'mailbox', zh: '信箱', emoji: '📮' },
    { en: 'envelope', zh: '信封', emoji: '📨' },
    { en: 'pencil', zh: '铅笔', emoji: '✏️' },
    { en: 'paper', zh: '纸', emoji: '📄' },
    { en: 'snail', zh: '蜗牛', emoji: '🐌' },
    { en: 'friend', zh: '朋友', emoji: '🤝' },
    { en: 'sad', zh: '难过的', emoji: '😢' },
  ],
}
