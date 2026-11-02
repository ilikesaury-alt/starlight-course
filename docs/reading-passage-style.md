# 📚 阅读短文文体规格（Starlight 96 课）

> 真源：`src/data/reading/unit1.ts … unit12.ts`；词表真源：`src/data/reading/baseVocab.ts`；
> 不变量真源：`src/data/readingPassage.test.ts`。
> 本文件是**文体**规格（写得好不好看），硬约束仍以单测为准，两者都必须满足。

## 0. 一句话说清

> 每篇短文 = **一个孩子能一口气读完、读完心里一动的小故事**。
> 不是「本课生词例句清单」。

## 1. 为什么改（旧版的病）

旧版 96 篇多数是**互不相关的句子清单**：句子之间没有因果、没有人物动机、没有结尾。
例（Unit 1 旧 1-1）：

```
Hello! I am a small cat.
Today I meet a new friend.
The bird says hello to me.
Hello! My name is Sam.     ← 上一句的鸟为什么叫 Sam？
I am good, and I am great.
Sam is a good boy.          ← 上一句的猫为什么变成男孩？
```

读起来像「例句集」，不是故事。读得下去，但没有故事可读。
**孩子的自主阅读要的是故事**：有谁、在哪、遇到什么、怎么解决、最后怎么样。

## 2. 定稿样例（照这个气质写）

### 1-1 Hello, My Friend（8 句 13 词… 实为 70~100 词区间内）

```ts
paragraphs: [
  [ // 出门
    { en: "Hello! I'm Sam, a little cat.", zh: '你好！我是小猫咪 Sam。' },
    { en: "It's a new day and the sun is up.", zh: '新的一天，太阳公公起来啦。' },
    { en: 'I walk out to play.', zh: '我出门玩喽。' },
    { en: 'Hello! My name is Sam. Can I play with you?', zh: '你好！我叫 Sam，我可以和你一起玩吗？' },
    { en: '"Hello, Sam! Great! You can play with me," says the bird.', zh: '“你好呀，Sam！太好了！跟我一起玩吧。”小鸟说。' },
  ],
  [ // 玩耍
    { en: 'The bird is small and red.', zh: '这只小鸟小小的、红红的。' },
    { en: 'We are happy friends now.', zh: '现在我们是一对好朋友啦。' },
    { en: 'We play and play all day.', zh: '我们玩呀玩，玩了一整天。' },
    { en: 'We run and jump and sing, too.', zh: '还一起跑、一起跳、一起唱歌。' },
  ],
  [ // 道别
    { en: 'The sun goes down. It is evening.', zh: '太阳落山了，到傍晚啦。' },
    { en: '"Good bye, my friend!" I say.', zh: '“再见啦，我的朋友！”我说。' },
    { en: 'Hello, tomorrow! We will play again.', zh: '你好呀，明天！我们还要一起玩哦。' },
  ],
],
```

### 1-2 Good Morning（三段时间线）

```ts
paragraphs: [
  [ // 早晨
    { en: 'Good morning! The sun is up.', zh: '早上好！太阳公公起来啦。' },
    { en: 'Good morning, Mom! Hello, new day!', zh: '早上好，妈妈！你好呀，新的一天！' },
    { en: 'My mom smiles and says hello to me.', zh: '妈妈笑着对我说了声你好。' },
    { en: 'We eat breakfast with my little cat.', zh: '我们和小猫咪一起吃早饭。' },
  ],
  [ // 午后
    { en: 'Good afternoon! The sun is high.', zh: '下午好！太阳爬得高高的。' },
    { en: 'We play with my cat and my dog.', zh: '我们和小猫小狗一起玩。' },
    { en: 'We run and jump in the sun.', zh: '我们在太阳底下跑呀跳呀。' },
    { en: 'What a happy day!', zh: '多么开心的一天呀！' },
  ],
  [ // 夜晚
    { en: 'Good evening! The moon is out.', zh: '晚上好！月亮悄悄爬出来了。' },
    { en: 'The little stars say hello too.', zh: '小星星们也在对我说你好呢。' },
    { en: '"Good night, moon. Good night, stars."', zh: '“晚安，月亮。晚安，星星。”' },
    { en: 'Hello, tomorrow! I can not wait.', zh: '你好呀，明天！我已经等不及啦。' },
  ],
],
```

## 3. 文体要求（写的时候照这几条）

| # | 要求 | 做法 |
|---|------|------|
| 1 | **一个完整故事** | 开头交代场景/人物 → 出现一个小问题或小变化 → 想办法/继续 → 收尾。有因果链，不是句子清单。 |
| 2 | **本课语言点是主线** | 教反义词的单元就靠「大 vs 小」推动情节；教生日的单元故事就发生在生日那天。学什么，故事就演什么。 |
| 3 | **用对话推动** | 引号里的台词给孩子「有人在说话」的感觉。旧版几乎全是陈述句，读起来像念清单。 |
| 4 | **重复变奏** | 某个短语在结尾变形回来（`Hello, tomorrow!`）。这是绘本最常见的「回声」手法，也是短文最省事的高级感。 |
| 5 | **句短、节奏错落** | 一句 4~9 词为主；别把从句套从句；长短句交替，避免连续三句同长。 |
| 6 | **段落 = 叙事节拍** | 2~3 段，一段一个节拍（出门 / 相遇 / 道别）。段间留白是给孩子喘气的地方。 |
| 7 | **结尾有余韵** | 最后一句落在故事的核心词或情绪上，读完有一口气的余味（`Hello, tomorrow!` / `We will play again.`）。 |
| 8 | **中文也要美** | 译文是给孩子看的对照，要**温暖、口语、有画面感**（「我出门玩喽」「现在我们是一对好朋友啦」），不要直译腔；但必须忠实对应英文句意。 |
| 9 | **标点** | 英文句只用 ASCII 标点（`" . , ! ?`），中文标点只出现在 `zh` 里。 |

## 4. 硬约束（单测逐条卡，别碰）

1. **只改本单元一个文件**：`src/data/reading/unit{N}.ts`。
   ❌ 禁止改 `baseVocab.ts`（词表唯一真源）、`lessons.ts`、`readingPassage.test.ts`、别的 unit 文件。
2. **结构不变**：`Record<string, ReadingPassage>`；key（`N-1`…`N-8`）与 `title` 保持原样（`titleZh` 可润色成更顺的中文）；`paragraphs` 仍是 `ReadingSentence[][]`，`ReadingSentence = { en, zh }`。
3. **篇幅**：每篇 70~100 词 / 8~12 句 / 1~3 段（词数按 `tokenizeReading` 口径 = 小写后 `/[a-z]+(?:'[a-z]+)?/g` 切词）。
4. **零超纲**：每个 token ∈ `allowedWordsFor(unit, lesson)` = `BASE_WORDS` ∪ `NAMES` ∪ 本单元全部课词表 ∪ 本课词表，允许词形回退（-s/-ing/-ed/-er/-est + 不规则表）。
   人名白名单：`abby leo grace sam anna ben mia tom lily kate jack emma`。
   **不要为了过测往 `baseVocab.ts` 加词**（原任务纪律：孩子没学过的词不能出现）。
5. **本课词表 100% 出现**：`src/data/lessons.ts` 里该课 `words[]` 每个词都要在正文出现（多词词条按空格拆，每个部分都要出现）。
6. **每句有中文**，`en` 无中文/全角标点，同篇无完全重复句。
7. **单元头部注释里的坑依然成立**（尤其 unit10 / unit11 的多词词条问题）：先读头部注释，照它说的处理；**不要删头部注释**，可在末尾追加一行说明本次改写。

## 5. 自验命令

```powershell
$env:READING_UNIT='3'; npx vitest run src/data/readingPassage.test.ts   # 只校验 Unit 3
npx vitest run src/data/readingPassage.test.ts                          # 全量
```

8 条测试全绿才算完成。报错 key 不是本单元的（如 `5-3 ...`）说明别的 Agent 正在并行改别的 unit，忽略后重跑即可。
