# Starlight 第一册（Book 1）数据体检与视觉补齐

> Book 1 由并行工作线接入（`da09ab0` 数据层、`289676f` 入口）。
> 本文是那次接入之后的**体检结论**与**视觉补齐**记录。
> 体检脚本：`.taste-skill/audit-book1.mjs`（esbuild 现场打包 TS，不依赖 vite server）

## 1. 96 课资源覆盖（实测）

```
资源            覆盖        备注
单词            96 / 96     485 词
句子            96 / 96     487 句
教材原页        96 / 96     book.ts（从 raw/*.json 提取）
句型框架卡      19 / 96     每单元的 Language Focus 课（课 5/6/7/9 附近）
阅读小故事      27 / 96     u2_reading … u9_reading
外教课堂对话     0 / 96     第一册整册还没抽
音素切分异常     0 课        phonemeSegments 能把每个词原样切回来
```

**结论**：Book 1 的**词与句子是完整的**，缺的是三类「衍生内容」——
句型框架卡、阅读小故事、外教课堂对话。前两者已经在 `src/data/starlight1/u2.ts … u9.ts`
里抽出来了一部分（uN_frames / uN_reading），只是**聚合层没接**；外教对话则是整册没做
（预备级的 `lessonDialogue.ts` 是另一种从 PDF 抽的素材，Book 1 没走这一步）。

## 2. 本轮做的三件事

### 2.1 把 u2–u9 已抽出的数据接进聚合层

`src/data/starlight1/index.ts` 新增两个按单元归拢的表：
- `FRAMES_BY_UNIT1`（Unit 1 的 `STARLIGHT_FRAMES1` + u2…u9 的 `uN_frames`）
- `READINGS_BY_UNIT1`（Unit 1 的 `READING_PASSAGES1` + u2…u9 的 `uN_reading`）

`starlightSeriesData.ts` 的 `seriesFrames` / `seriesReading` 改走这两张表。

净收益：句型框架卡 **53 → 100 张**（同一课多了几张候选）；阅读小故事覆盖 **19 → 27 课**。

> ⚠️ 体检时踩过的坑：先用预备级的 `getReadingPassage` / `getLessonDialogue` 量 Book 1，
> 两册的单元号都从 1 开始 —— 查出来的是**预备级的数据**，一度得出「短文 850 句 / 缺 24 课」
> 的假象。**跨册取数据一律按 level + slug 分发**（`starlightSeriesData.ts` 顶部的铁律）。

### 2.2 第一册的 9 张单元图形

第一册的单元不是「主题」而是**角色**（蒙蒂和罗拉各做各的职业），所以画的是**职业道具**：

| 单元 | 图形 | 单元 | 图形 |
|---|---|---|---|
| 1 蒙蒂小画家 | 调色盘 + 画笔 | 6 罗拉海盗 | 海盗帽 + 望远镜 |
| 2 罗拉医生 | 听诊器 | 7 蒙蒂魔术师 | 礼帽 + 魔术棒 |
| 3 蒙蒂小丑 | 小丑帽 + 小丑脸 | 8 罗拉运动员 | 奖牌 |
| 4 罗拉飞行员 | 侧视小飞机 | 9 蒙蒂潜水员 | 潜水镜 + 气泡 |
| 5 蒙蒂农场主 | 稻草人 | | |

与预备级同一套图形语言（24×24 / flat filled / 满色主体 / 浅色细节）。
`UnitGlyph` 现在**按册分开查表**（`UNIT_GLYPHS` / `UNIT_GLYPHS_BOOK1`）——
两册单元号都从 1 开始，不分开就会「换一本书看到另一本的图形」。

### 2.3 空态说实话

第一册整册没有外教对话、且多数课没有填空框架卡。原来那句「这一课还没有外教对话。」
会让孩子以为是自己没找对。改为按册区分：

- 第一册：「第一册的外教课堂对话还在整理，先用「单词卡」和「课文」读这一课。」
- 预备级：「这一课还没有外教对话。」（不变）

## 3. 验证

```
npm run test    364 passed / 30 files
npm run check   ✓     npm run lint  ✓     npm run build  ✓
npm run e2e     95 passed / 4 skipped / 0 failed
                （skipped 3–4 正常：alphablocks A7 是条件跳过 —— 40 轮内没抽到
                  含重复块的词就 skip；跟读区 3 个 describe.skip）
```

e2e 契约未破：`.ab-level` 恰好 5 个、`.ab-block` 可 disabled 且 textContent 裸字母、
`.ab-hint` 拼完即出现、`.ab-wrong` 含「这块不对」、错词拼完才写入；
听写与句型框架卡相关的断言全部未受影响。

## 4. 留给内容工作的缺口（不是代码问题）

| 缺口 | 规模 | 备注 |
|---|---|---|
| 外教课堂对话 | 96 课 | 需要像预备级那样从教材 PDF 抽（`src/data/lessonDialogue.ts` 是现成模板） |
| 句型框架卡 | 77 课 | 每课至少一张（预备级 98 张覆盖 96 课的做法可参考） |
| 阅读小故事 | 69 课 | `docs/reading-passage-style.md` 有文体规范；脚本 `scripts/check-reading.mjs` 可自验 |

三样都是**内容工程**（从教材素材抽取 + 按质量标准撰写），不是 UI 改造。
本轮已把它们在界面上的表现处理成「诚实的空态」，不会让用户以为应用坏了。

### 4.1 后续补齐进度（本表是审计当时的快照，数字保留）

| 缺口 | 状态 | 落地 |
|---|---|---|
| 句型框架卡 77 课 | ✅ 已补齐（19/96 → 96/96，130 张） | `src/data/starlight1/sentenceFrame1.test.ts` 按预备级同口径校验；顺带修了 `FRAMES_BY_UNIT1` 桶污染与 `framesOfLesson1Series` 返回重复卡 |
| 阅读小故事 69 课 | ✅ 已补齐（27/96 → 96/96） | 第一册专属词表允许域 `src/data/starlight1/readingVocab1.ts`（预备级基线 ∪ 教材角色名 ∪ 本单元课本原文 token），校验器 `readingPassage1.test.ts`、自检脚本 `scripts/check-reading1.mjs --brief/--stats` |
| 外教课堂对话 96 课 | 待补 | 仍需给 `seriesDialogue` 接线并改 `LessonPreview` 空态 |

> 阅读短文的「零超纲」口径与预备级略有不同：第一册教材角色名（Monty/Lola/Mr. Gnome/Pippa…）
> 和课本原文里出现过的词也算「孩子学过的」，否则连教材故事都写不出来。
> 生成与校验共用 `validateReadingPassage1()` 一份实现，不会漂移。
