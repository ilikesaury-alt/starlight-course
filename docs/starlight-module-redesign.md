# Starlight 主课模块重设计 — 工作记录（tasteskill v2）

> 在全站换皮之后，单独对 Starlight 主课模块（`/starlight` → 单元课表 → 课内 5 Tab → 单元测验）
> 重跑了一遍完整 skill 流程。
> Before：`.taste-skill/starlight/before/{sl-home,sl-list,sl-lesson,sl-quiz}/`
> After：`.taste-skill/starlight/after/{…}/`
> 方向单：`.taste-skill/starlight/direction.json`（`framed-sheet`, seed 1491983000, kind smb-admin）
> 设计工作单（步骤 1–5）：`.taste-skill/starlight/plan.md`

## 1. 方向

| 项 | 值 |
|---|---|
| app 风格 | **`framed-sheet`**：一个 tinted L 框，内容落在**一张白纸页**上（1px 边 / 16px 圆角 / **无阴影**），active tab 是 2px 下划线，其余 chrome 全灰，色彩预算 <3% |
| idea 引擎 | 借 page 方向的 `page-is-the-object`：**把页面做成主体世界里已有的印刷品** —— 这里就是牛津 Starlight 课本摊开的那一页 |
| 品牌适配 | `--keep palette`：模块琥珀只落在 2px tab 下划线、页码、进度标记这些小地方 |

**为什么是 framed-sheet**：它是 8 个 app 风格里唯一把「纸页」当结构的，而 Starlight 的本体就是一本纸书。它的三条 off-style 正好是本模块原来的毛病：
- 「cards whose border is heavier than the sheet's」→ 原来 `.zone-card` 是 `1px solid var(--mc)` 满色边；
- 「a fourth nesting level」→ 原来桌面底色 → 黄横幅 → 白卡 → 卡内黄条，四层；
- 「different gutters」→ 原来 14 / 10 / 12px 混用。

page run 本身不适用于 app screen（SKILL.md L44–55），只借它的 idea engine；实施全部按 `app-screens.md`。

## 2. Idea

> 在这块屏幕上，**牛津 Starlight 预备级 12 单元 × 8 课的目录** 变成 **一张摊开在桌面上的 96 格课次星图** —— 点一格就是一课，右下角的按钮就是下一课。

**Competitor test**：换成「叽里呱啦 / Khan Academy Kids / RAZ Kids」都不成立——它们没有这本教材的 12×8 固定课次、96 课原文与 1459 句外教对话。而「彩色卡片 + 星星奖励学英语」放进任何竞品都成立，所以那不是 idea。

**Live thing**：**课次星图**（`src/components/LessonStarMap.tsx`）—— 96 格就是教材的目录本身，格子状态全部由 `store.lessonCompleted` 派生，每次来都不同；每格都是真实链接，点一下直达那一课。旁边一行「继续 Lesson N · 标题 →」是目录意义上的下一课，一击可达。

## 3. 改了什么

### 新增
- **`src/components/LessonStarMap.tsx`** —— 96 格课次星图。12 单元 × 8 课，每格一个真实链接；三态（已完成 / 当前 / 未完成）；`已完成 N / 96 课` 与格子数从**同一份 `modules` 数据**算出，永远对得上。首页画全图，单元页画本单元 8 格。
- **`src/styles/_starlight.scss`** —— 模块专属样式层。**所有规则都挂在 `.starlight-sheet` 下**：`flashcard` / `zone-card` / `page-head` / `tab-bar` / `card` 都被别的模块共用，这里一个全局定义都没改。

### 页面（4 个）
| 页面 | 改法 |
|---|---|
| `/starlight` | hero 压成「24px 名词 h1 + 一句 14px 灰支撑句 + 右上 action」；删 hero emoji / eyebrow / 胶囊阵列；插入 96 格星图；模块列表两列通排 |
| `/preview/:unit` | 单元横幅 → 标题行；插入本单元 8 格星图；**导学默认收起**（首屏先让 8 课表露出来）；8 课表变**无卡片包裹的两列表格**，序号方块 + 右对齐词数（tabular figures） |
| `/preview/:unit/:lesson` | 页面头 → 标题行 + `Lesson 1 / 8 · 5 词 · 5 句 · 课本第 1 页` + 右上「下一课 · 标题 →」；**单词卡 Tab 改两栏**：左栏是卡片本身（emoji / 词 / 喇叭 / 音标 / 中文 / 自评 / 进度 / 翻页），右栏是本课词表 + E 课堂拓展词；`.zone-card` 降层为细线区块，不再是第四层卡片 |
| `/preview/:unit/quiz` | 同上，标题行 + 页码脚 |

### 具体规则（都来自 app-screens.md）
- **层次只有三层**：骨白纸 `#f2f1ee` = tinted frame（不改全站底色）→ `.starlight-sheet` = 白纸页（1px 边 / 16px 圆角 / 无阴影）→ 页内区块只靠 1px 细线与色阶分开。
- **h1 = 24px 名词**（§4.3 中位 24），第二行 14px 灰支撑句；删 eyebrow / 装饰 emoji / hero header（§13）。
- **Tab 保持下划线**：1px 通栏线 + 2px 主题色指示条（§4.4）。
- **大字号给内容不给界面**：单词 36px、中文 24px、emoji 44px（内容）；界面 h1 24px、正文 15-16px、控件 40-44px 高（§10 密度三件套、§8.3）。
- **表格而非卡片**：单元课表与本课词表都是无卡片包裹的行，1px 行线，数字右对齐 + tabular figures（§7.1 / §7.4）。
- **数字对账**：`0 / 96 课` 如实印成 0，不藏成「暂无」；进度只在星图头显示一次，不在别处重复（§2.1 / §11）。
- **动效只留反馈**：删了单词卡的入场弹跳与中文滑入，保留 `:active` / `:hover` / `:focus-visible`（§2.8「nothing performs an entrance」）。

## 4. Critique（`references/critique.md` §4）

```
ROUND 1 — before (.taste-skill/starlight/before/sl-lesson/desktop-fold.jpg)
Seen in one second: 一个黄横幅、五个带 emoji 的标签、一张居中的大白卡，卡下面又一张黄卡。
Idea: 没有。换成任何一本分级英语教材都成立。
Live thing: 无。翻到哪一课、这一课学到哪，全靠用户自己找。
Layout words by section: head=黄横幅 / tabs=一排胶囊 / card=居中大卡 / list=又一张卡
Scores: design 3 · usability 5 · creativity 3 · content 7 → overall 4.0
Caps applied: 11 档字号（上限 9）；0 FAIL 但 hero-void / unused-canvas WARN 一堆。
Top three problems:
1. sl-lesson：单词卡是「居中大 emoji + 大词 + 一排喇叭」的地板页排版，摊在 1200px 宽的白卡里，两侧全空。改成左栏主内容 + 右栏词表的两栏工作界面。
2. sl-list：五个各自为政的通栏卡片（目标 / 贴士 / 测验 / 8 课行），第一屏只露第 1 行。导学收起、8 课表两列通排。
3. sl-home：96 课没有一处可看进度，「已完成 N/96」藏在一个黄色药丸里。换成 96 格星图。

ROUND 2 — after (.taste-skill/starlight/after/sl-lesson/desktop-fold.jpg)
Seen in one second: 一张摊开的课本页：左边是这一课的生词，右边是词表和要做的练习。
Idea: 12 单元 × 8 课的目录本身变成 96 格星图；点一格就是一课。
Live thing: 课次星图 —— 96 格是教材目录本身，状态随进度变化，每格可点。
Layout words by section: head=标题行+翻页 / tabs=下划线 / card=左栏 / list=右栏 / map=目录
Scores: design 7 · usability 8 · creativity 7 · content 7 → overall 7.4
Caps applied: 0 FAIL / 0 WARN（4 页 × 3 宽度）；0 张自有图片，creativity 记 7 不记更高。
Top three remaining problems:
1. 单元 emoji 仍是系统 emoji，不是教材插画。画 12 个单元主题的 code-drawn 图形（挥手 / 餐盘 / 小巴士）能再提一档，但涉及 12 张图的绘制工作量，本轮没做。
2. 课内 5 个 Tab 共用同一套区块样式，句型与课文 Tab 的版式和单词卡 Tab 接近（§2.2 建议一屏一问、按 job 分版式），本轮只做到了「一个 Tab 一个工作区」。
3. 96 格星图在 1440px 下每格只有 ~70px 宽，点得准但不够大；窄屏下会降到 8 列一屏，触控目标偏紧。
```

两轮之间 4 个页面的 inspector 从 **2 FAIL + 3 WARN**（课内页 11 档字号、首页 hero-void）到 **0 FAIL / 0 WARN**。

## 5. 验证

```
npm run test    343 passed / 28 files
npm run check   ✓     npm run lint  ✓     npm run build  ✓
npm run e2e     96 passed / 3 skipped / 0 failed
inspect.mjs     sl-home / sl-list / sl-lesson / sl-quiz × 1440/768/390：全部 0 FAIL / 0 WARN
```

**e2e 契约一条没破**：`.tab-btn` 仍 5 个且名称不变、`.ext-item` / `.ext-badge` / `.sfc-*` / `.dialogue-bubble.left/right` / `.dialogue-zh` / `.passage-zone .tt-word` / `.tt-pop` / `.word-list-mini .word-chip`（5 个）/ `.flashcard` / `.fc-progress` 的类名与数量全部不变；`.tt-word` 默认透明底不变；`SHOW_SPEAK_TAB = false` 不变。

**结构改动只有三处**（都不改类名与文本）：`VocabTab` 前四项包进新增的 `.sl-card-pane`；`LessonList` 的导学 `showGuide` 默认值 `true → false`；4 个页面根节点加了 `.starlight-sheet` 类。

**未改动**：路由、store、教材数据、SRS / TTS / STT 逻辑。
