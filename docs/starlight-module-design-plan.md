# Starlight 模块重设计 · 设计工作单（tasteskill v2 步骤 1–5）

方向单：`.taste-skill/starlight/direction.json`（`framed-sheet`, seed 1491983000, kind smb-admin）
Before：`.taste-skill/starlight/before/{sl-home,sl-list,sl-lesson,sl-quiz}/`

## Step 1 · Inventory（只属于这个产品、不属于任何竞品的东西）

1. **教材本身**：Oxford Starlight Starter（预备级），12 单元 × 8 课 = 96 课，每单元是孩子生活里的一个场景。
2. **12 个单元主题**：Hello! / Animals / Food & Drinks / Toys / Opposites / My Body / My Home / Food Groups / My Day / Birthday / Places / Transport —— 这是一张「孩子认识世界的顺序表」。
3. **每课固定的结构**：5 个单词 + 5 个句子（`Word{en,zh,emoji,ipa?}` / `Sentence{en,zh}`）。
4. **每个词配一幅图**：教材是图画书，词与图一一对应；app 用 `Word.emoji` 承接这个位置。
5. **课本原文 1459 句**：从 96 份教材 PDF 逐句提取，外教 ↔ 孩子的真实课堂对话（不是编的例句）。
6. **外教课堂对话**：每课一段，`src/data/dialogue/unit1..12.ts`，真实上课语气。
7. **句型框架卡 98 张**：手写填空，每课至少一张，填空答案能复现教材里真实教的句子。
8. **一课 = 5 页练习**：单词卡 → 句型 → 外教对话 → 课文点读 → 闯关（正好是 5 个 Tab）。
9. **星规**：全对 5 星 / ≥80% 3 星 / 参与 1 星；≥80% 算通过（`src/utils/stars.ts`）。
10. **E 课堂拓展词**：每课硬上限 5 个，家长现场照着绘本补词，删了不会自动回填。
11. **教材 PDF 原件 96 份**：`src/data/starlight0/Unit N Lesson M *.pdf`，纸页比例与封面是现成的视觉母题（原件不入库，但形状与命名在）。
12. **使用场景**：课前在家预习 → 一对一菲教课 → 课后复习；家长坐旁边，孩子用鼠标点词。

## Step 2 · Argument（claims + proof，一行一个区块）

| # | Claim | Proof（真实数据 / 功能） |
|---|---|---|
| 1 | 这是教材的哪一页 | 面包屑 `Module 1 › Lesson 1` + h1「Say Hello · 说你好」+ 页码式 `1 / 8` |
| 2 | 这一页要学什么 | 5 个生词（图 / 音标 / 中文）、5 个句子；数字「5 词 · 5 句」 |
| 3 | 学到哪了 | 「已完成 0 / 8 课」、本课完成标记、星规；零要如实写成 `0` |
| 4 | 这一页有哪几样练习 | 5 个下划线 Tab（单词卡 / 句型 / 外教对话 / 课文 / 闯关） |
| 5 | 课本上这一页真的长什么样 | 外教 ↔ 孩子对话气泡 + 逐词点读 + 1459 句中的这一课 |
| 6 | 下一步做什么 | 「下一课」翻页控件 + 单元测验 + 去复习 |

删掉没有 claim 的区块：页面顶部的 mode-badge（已在之前删过）、重复的「课程列表」返回链（面包屑已覆盖）。

## Step 3 · 方向

**app 风格 `framed-sheet`**（`--app --kind smb-admin --style framed-sheet`）：
> 一个 tinted L 框，内容落在一张白纸页上（1px 边、16px 圆角、无阴影），active tab 是 2px 下划线，其余 chrome 全灰。色彩预算 <3%。

**为什么**：app-screens.md 里 8 个 dropdown 风格中，只有它把「纸页」当结构；而 Starlight 的本体就是一本纸书。它的三条 off-style 正好对应本模块现在的毛病：
- 「cards whose border is heavier than the sheet's」→ 现在 `.zone-card` 是 `1px solid var(--mc)` 满色边；
- 「a fourth nesting level」→ 现在是 桌面底色 → page-head 黄块 → 白卡片 → 卡片内黄条，四层；
- 「different gutters」→ 现在 14 / 10 / 12px 混用。

**idea 引擎借 `page-is-the-object`**（page 方向，`--sector education`）：把页面做成主体世界里已有的印刷品。这里就是**牛津 Starlight 课本摊开的那一页**。page run 本身不适用于 app screen，只借 idea engine；实施全部按 `app-screens.md` 的规则。

**品牌适配**（`--keep palette`）：模块琥珀 `#F5B017` 保留，但只落在 2px tab 下划线、页码、进度点这类小标记上；tinted frame 用项目已有的骨白纸 `#f2f1ee`，白纸页用 `#fff`。

**face（app-screens.md §2.3 要求一个只有这个产品有的元素）**：**页码 + 翻页角**。每个页面右下角有 `1 / 8` 这样的课本页码，以及一个折角形的「下一课」控件；它用真实课表数据，不是装饰。

## Step 4 · Idea 与 live thing

> 在这块屏幕上，**牛津 Starlight 课本 Unit 1 · Lesson 1 的那一页** 变成 **摊开在桌面上的一张练习纸**：左半是这一页的生词，右半是这一页要做的练习，右下角的折角就是下一课。

**Competitor test**：把「叽里呱啦 / Khan Academy Kids / RAZ Kids」代进去——它们没有这本教材的 96 课原文、单元主题顺序与 1459 句外教对话，「Unit 1 Lesson 1 那一页」就不成立。通过。

**Live thing（两选一，主用前者）**：
1. **翻页角**：课内页右下角的「下一课 →」，按 `mod.lessons` 顺序翻到真实存在的下一课，最后一课翻到单元测验；每次打开都随 `lessonCompleted` 变化。
2. **点词就响**：纸页上每个生词都是发声按钮（`speakService` 有界兜底链），这是纸质教材做不到的事。

**Scenes / imagery**（app screen 不适用 page 的图片 caps，见 app-screens.md §2.7）：不引入外部图片；用 code-drawn 的「书页」元素——页码、折角、页眉细线、12 单元主题色的小色标——它们都来自教材本身。

## Step 5 · Copy deck（标题文本受 e2e 契约约束，一个字都不能改；只加支撑句与区块标题）

| 页面 | h1（锁定） | 新增支撑句（一句话，32–48px 下方） | 区块标题 |
|---|---|---|---|
| `/starlight` | `Starlight 主课` | 牛津 Starlight 预备级 · 12 单元 / 96 课 · 配合一对一菲教课 | 目录 · 12 个单元 |
| `/preview/:unit` | `Hello!` | Module 1 · 打招呼与颜色 · 8 课 | 这一单元的 8 课 / 单元导学 |
| `/preview/:unit/:lesson` | `Say Hello · 说你好` | Lesson 1 · 5 个词 · 5 句话 · 课本第 1 页 | 这一页的生词 / 这一页要做的练习 / 课本上的对话 |
| `/preview/:unit/quiz` | `Hello! 综合测验` | Module 1 · 5 题 · 全对得 5 星 | — |

**零 / 空状态文案**（app-screens.md §11：零就打印 `0`，缺值用破折号，不画插画不说 "No data yet"）：
- `已完成 0 / 8 课`
- `0 颗星 · 这一单元还没开始`
- 空列表保留标题与框，加一句「这一课还没有外教对话。」

## 实施约束（硬）

- **e2e 契约**：`.tab-btn` 必须 5 个且名称含「单词卡/句型/外教对话/课文/闯关」；`.ext-item`、`.ext-badge`、`.sfc-*`、`.dialogue-bubble.left/right`、`.dialogue-zh`、`.passage-zone .tt-word`、`.tt-pop`、`.word-list-mini .word-chip`、`.flashcard`、`.fc-progress` 类名与数量全部不动。
- `SHOW_SPEAK_TAB = false` 保持不变；跟读渲染分支原样保留。
- `.tt-word` 默认透明底（reading.spec.ts 断言）。
- 不改 store / 路由 / 数据结构 / TTS / SRS。
- **作用域隔离**：`.flashcard` / `.zone-card` / `.page-head` 等被其它模块共用，新样式一律挂在新增的 `.starlight-sheet` 作用域下，不改全局定义。
