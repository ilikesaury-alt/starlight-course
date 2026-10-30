# Spec: 阅读模块 UI 美化（「学过的词宝藏」）

> 工作流：ai-dev-flow。上游需求讨论已对齐（见 §0）。本 Spec 进入阶段 2，待方案复核门禁通过后进入「先测后码」。
> 参考技能：`Leonxlnx/taste-skill`（v2 反 slop 前端技能）。**适配方式见 §4**：它是为"从零搭获奖落地页"设计的，本任务为"已有品牌体系的儿童 app 内页重风格化"，故只借鉴其**方法与批判镜**，不照搬其落地页禁令。

## 0. 已对齐的需求（来自需求讨论）

| 维度 | 决策 |
| --- | --- |
| 主题 / idea | **学过的词宝藏**——把"这些故事只用了你学过的词、点一下就能听"做成全页贯穿的视觉母题（点子来自 app 本身：短文 = 学过的词的产物，竞品替换不成立） |
| 美化范围 | **入口页 + 阅读器**（ReadingZone 现仅被 `/reading` 使用，安全） |
| 视觉语言 | **保留儿童品牌**（圆角/柔影/cute 字体/靛蓝），taste-skill 作批判镜而非硬禁令 |
| 宝藏指示器 N | **课本词去重计数**（静态，来自 `modules`/`words`，零持久化） |
| 宝藏词动效 | **静态金边/柔光 + 仅交互时 twinkle**（阅读不打扰） |

## 1. 问题

上一轮把阅读从课内 Tab 提升为独立 `/reading` 模块，功能完整、测试绿，但视觉是**最普通的"阅读列表页"**：

- 首屏 hero 把"用学过的词写的小故事"只当作小注，没有用尺度把它立成主视觉；
- 12 个折叠卡 + 8 课按钮全是相近权重的圆角卡（taste-skill 把"一排相同卡片"列为 warned），无视觉锚点；
- 课本词高亮（`.tt-word--mark` 波浪下划线）是隐性卖点，没有把"你学过的词"显性化；
- 阅读器开关用了 `btn-soft` 类名，但 CSS 只定义了 `.btn--soft`，导致中文/记忆/慢速/听整篇按钮**渲染成实心深色**（既丑又误导"可点状态"）；
- 空态裸、lazy chunk 冷启动首屏空白无加载态。

## 2. 目标

在不改数据层、不改朗读/记忆/慢速**行为逻辑**、不新增持久化的前提下，把 `/reading` 从头到尾（入口列表 + 阅读器）美化成统一、有"学过的词宝藏"母题、状态完整的儿童向界面，并以 taste-skill 的批判镜自查（首屏有清晰主视觉、等宽边距、状态齐全、相邻区块构图不同、无裸空白）。

## 3. 非目标（明确不做）

- 96 篇逐篇插画（无图片资产管线；taste-skill 要的"real pictures"在此退化为 emoji / 代码绘制 motif）。
- 调用 `draw.mjs --app` 抽构图蓝图：其 app 库偏 dashboard/editorial，与"保留儿童品牌"冲突，改为借鉴其**原则**（批判 before、定 idea、用尺度制造主次、补齐状态）。
- 改动阅读内容 / 数据（`src/data/reading/**` 零改动）。
- SRS 已掌握词数（已选静态课本词计数）。
- 把 taste-skill 的落地页禁令（禁渐变、禁静止阴影、禁靛蓝）硬套到儿童品牌上——按技能自身豁免规则 `--allow` 保留。

## 4. 关键决策

1. **保留儿童品牌 + taste-skill 作批判镜**（已确认）。保留：hero 靛蓝渐变、卡片圆角柔影、cute 字体、靛蓝阅读主题色。借用其方法：before 批判 → 定 idea → 尺度主次 → 状态齐全 → 相邻构图不同。
2. **N = 课本词去重计数**（已确认）。每个单元卡显示「💎 N 词」，N = `m.lessons[].words` 跨课去重后的词数；纯静态，来自数据，不读 `srsCards`、不写 localStorage。
3. **宝藏词 = 静态金边/柔光 + 交互 twinkle**（已确认）。**事实修正**：原计划复用 `sparkle` keyframe，但仓库中**未定义**（`grep` 无结果，AGENTS.md 误列）；改用现有 `@keyframes twinkle`（同属"闪"语义，且已是品牌动画）——不新增动效库。作用域限定 `.reading-module .tt-word--mark`，不影响课文/句型/对话等其它页的词标记。
4. **修 `btn-soft` 类名 bug**（顺带，全局副作用低风险）：阅读器内 ReadingZone 自身开关（听整篇、中文）与共享 `PlayTools` 的慢速/记忆开关，统一改为 `btn--soft`。`PlayTools` 为全站共享组件，修正后全站开关视觉一致（期望副作用）；`.btn--soft` 已有 `.play-tools .btn.active` 配合，active = 模块色填充、inactive = 浅色，正是预期开关态。
5. **首屏 hero 放大**：用大尺度把"只用了你学过的词"讲清楚（文案沿用现有 hero 文案，不重写；只是视觉权重从"小注"升为"主视觉"），可加 2–3 个示例宝藏词（带 twinkle/金边）作 teaser。
6. **状态补齐**：空态（缺短文，已有 `.empty` 但裸 → 加图标/指引）、加载态（lazy chunk 首屏冷启动 → 骨架/占位，避免裸空白）。

## 5. 验收标准（可判定；每条须链接代码位置 + 测试证据）

| # | 验收标准 | 代码位置（计划） | 验证方式 |
| --- | --- | --- | --- |
| 1 | 首屏 hero 以「学过的词」为主视觉：大尺度标题/陈述，文案明确表达"只用了你学过的词、点词能听"，不再是小注区块 | `ReadingPage.tsx` hero 段 + `_reading.scss` `.rm-hero` | E2E 截图 + 文案断言（`rm-hero-title`/文案含"学过的词"）；布局断言 hero 高度/字号阈值 |
| 2 | 每个单元卡显示「💎 N 词」宝藏指示器，N = 该单元课本词去重计数，与数据一致 | `ReadingPage.tsx` 单元卡 + 计算 `uniqueWords(m)` | 单测：给定单元，`💎 N 词` 文本 N === `new Set(words).size`；E2E 抽查 Unit 1 |
| 3 | 阅读器内课本词（`.reading-module .tt-word--mark`）默认金边/柔光静态样式；hover/active 触发 `twinkle` | `_reading.scss` `.reading-module .tt-word--mark*` + `twinkle` | E2E：读者内 `.tt-word--mark` 存在且 `animation` 含 twinkle（交互态）；视觉取证截图 |
| 4 | 阅读器开关（听整篇/中文/慢速/记忆）为正确软按钮态：active = 靛蓝填充、inactive = 浅色，不再实心深色 | `ReadingZone.tsx`（`btn-soft`→`btn--soft`×2）、`PlayTools.tsx`（×2） | E2E：开关元素 `class` 含 `btn--soft`；active 态背景为模块色（getComputedStyle 断言） |
| 5 | 空态与加载态有明确视觉，不裸空白 | `ReadingPage.tsx` `.empty` 增强 + 首屏 loading 占位 | E2E：缺短文课显示增强空态；首屏冷启动出现骨架/占位后再出内容 |
| 6 | 视觉语言保持儿童品牌：保留圆角/柔影/cute/靛蓝；不引入新动效库（仅复用现有 `twinkle`）、不新增持久化 | 全改文件 | `grep` 确认无新动效库引入、无 `localStorage`/`srsCards` 写入 |
| 7 | `check`/`lint`/`test`/`e2e` 全绿；阅读数据层与朗读/记忆/慢速**行为逻辑**零改动（仅视觉/类名） | — | 全量门禁；`git diff --stat` 确认无 `src/data/reading` 变更、无行为逻辑改动 |

## 6. 影响面

**改动文件（计划）**

| 文件 | 改动 |
| --- | --- |
| `src/pages/ReadingPage.tsx` | hero 放大 + 单元卡宝藏指示器（去重计数）+ 空态/加载态增强 |
| `src/styles/_reading.scss` | `.rm-hero` 主视觉化、`.rm-unit` 加💎指示器样式、`.reading-module .tt-word--mark` 宝藏样式（静态金边/柔光 + twinkle）、加载骨架 |
| `src/components/ReadingZone.tsx` | `btn-soft`→`btn--soft`（听整篇、中文）×2 |
| `src/components/PlayTools.tsx` | `btn-soft`→`btn--soft`（慢速、记忆）×2（全站共享，期望副作用） |
| `src/styles/_study.scss`（或 `_reading.scss`） | `.tt-word--mark` 的 reading-module 作用域宝藏样式（见决策 3） |

**不动**：阅读数据层（`src/data/reading/**`）、朗读/记忆/慢速行为逻辑、`srsCards` 写入、localStorage/version。

**已验证事实**

- `ReadingZone` 仅被 `ReadingPage` 使用（`grep` 确认，仅测试/注释引用），改其视觉不牵连其它页。
- `.tt-word--mark` 定义在 `src/styles/_study.scss:963`，被 `TappableWords`/`ReadingZone`/`SentenceFrameCard`/`TappableText`/`LessonPreview` 等多处使用 → 必须作用域限定在 `.reading-module`。
- `sparkle` 在仓库中未定义；`twinkle` 存在（`@keyframes twinkle`）→ 用 twinkle。
- `btn-soft` 误用位置：`ReadingZone.tsx:155,160`、`PlayTools.tsx:31,41`、`LessonList.tsx:46`。本次改 ReadingZone + PlayTools；`LessonList`（首页课程列表）不在范围，标注但不改（若评审认为应一并修可纳入）。

## 7. 假设

- 品牌已有 `twinkle` 动画视觉上适合"宝藏词闪光"（实现时会先看其关键帧参数，必要时微调时长/幅度，但不另建动画）。
- 儿童品牌"保留"意味着不削弱现有圆角/柔影/靛蓝，仅在其之上叠加宝藏母题与状态，而非推翻。
- 首屏冷启动加载态用 CSS 骨架即可，不必引入加载库。

## 8. 实现过程中的偏离与发现（实现后回填）

### 8.1 计划外新增（需明示）

- **新增 1 个 CSS 关键帧 `pl-shimmer`**（加载骨架的流动高光）。不是"动效库"，是一个单文件内的单个 `@keyframes`；已有 `prefers-reduced-motion` 降级（关掉流动、保留静态底色）。「不引入新动效库」的约束仍然成立，但「不新增 `@keyframes`」并不成立，故在此写明。
- **新增 `pl-shimmer` 之外未新增任何动画**；宝藏词闪动复用品牌已有的 `twinkle`。

### 8.2 实现中修正的设计判断

| 原计划 | 实际做法 | 原因 |
| --- | --- | --- |
| hero 用大标题写母题（h1 = 母题） | **h1 = 模块名「阅读小故事」**，母题写成大字**陈述句** `<p>` | ① 改 h1 会打断既有 E2E 的 `getByRole('heading', {name:'阅读小故事'})`，且模块名不该只活在面包屑里；② taste-skill 规定「陈述句用 `<p>`、页面只有一个 h1」，母题是介绍性一句话而非第二个标题 |
| 母题字号 `clamp(26px, 6.4vw, 38px)` | `clamp(22px, 5.4vw, 32px)` + `b { white-space: nowrap }` | 原尺寸下 420px 视口母题折成三行、且"学过的词"被拆行。taste-skill 硬规矩：**陈述句最多两行**。已加 E2E 断言（≤2 行、`<b>` 不折行） |
| 单元卡头：徽章 `margin-left:auto` 各自独立 | 两枚徽章包进 `.rm-unit-badges` 成组 | 独立排布时窄屏下「8 篇」和「💎 32 词」被拆到两行，且把标题挤成两行、中文被截断成「打招呼与…」 |
| 宝藏词用大面积金底 | 深金字 + 金色波浪线 + **淡**金底（74% 处起） | 大面积金底在 16px 正文里太脏、抢句子轮廓；「宝藏感」靠颜色+波浪线更清楚 |
| — | 记忆状态开启时**保留**金色波浪线（只清掉金底） | 三色底色与金底叠在一起看不清；但"这个词你学过"（金线）与"记忆强度"（三色）是两回事，不该互相抹掉 |

### 8.3 实现中发现的既有缺陷 / 连带影响

| 发现 | 处置 |
| --- | --- |
| `PlayTools` 是**全站共享**组件（课文页 `LessonPreview`、外教对话 `LessonDialogueBox` 都在用）。改 `btn-soft`→`btn--soft` 会**连带改变课文页/对话页**的开关外观 | 判定为**期望副作用**（那些开关之前同样落回实心深色 `.btn`，本来就是错的）。已实测课文页：开关变为该页主题色的淡黄软色，观感更好；既有 E2E 未断言开关类名，无假红 |
| 展开阅读器后，桌面端阅读器被挤在左半列、右半列整片空着 | `.rm-lesson-wrap.is-open { grid-column: 1 / -1 }`（阅读器跨满两列） |
| E2E「整篇连读中点某一句」用了 `force: true`，导致点击落到**底部导航栏**上（桌面端靠下的句子被 fixed nav 盖住） | 改用 `scrollIntoViewIfNeeded()` + 标准 `click()`（Playwright 会先确认可点击）。`force:true` 绕过了可点击性检查，等于没在测「点句子」。注：`.app-main` 已有 `padding-bottom:90px` 避让 nav，末段内容不会被永久遮挡 |

### 8.3b 范围扩大（用户拍板）：全站按钮类名修复

在实现阶段发现 `btn-soft` / `btn-sm` / `btn-lg` / `btn-danger` 误用**遍布全站 49 处**（17 个文件），不止阅读模块。用户选择「全站一次修完」。

- 方向：代码写单连字符 → CSS 定义双连字符。**改代码不改 CSS**（CSS 的双连字符写法已经被 `AlphablocksPage` / `DictationPage` 正确使用了；改 CSS 会让那 7 处失效）。
- 附带成果：新增 `src/components/btnClassGuard.test.ts` 守卫测试——以后有人再写单连字符会直接红灯，而不是变成一个“不报错、只是看起来不对”的视觉事故。
- 这个 bug 能活这么久的原因：**全站没有一条测试断言按钮的类名或外观**。

详见验收报告 §2.6。

### 8.4 验证方式的一处订正

- 原验收标准 3 写「`hover` 触发 `twinkle`」——实际实现是 `:hover/:focus-visible/:active` 三态都触发。E2E 断言按实现写（hover 后 `animationName === 'twinkle'`）。
- 「记忆状态默认关闭 → 句子无彩色底」这条既有 E2E 原本取**第一个词**，而第一个词恰好是本课词（自带宝藏金底）→ 两种信号混为一谈。已改为取 `.tt-word:not(.tt-word--mark)`（非宝藏词），断言的仍是记忆色开关本身。
- **新增门禁项**：`npx sass src/index.scss /tmp/out.css`。原因：`npm run check` / `npm run lint` **不校验 SCSS**——本轮曾因一处注释吞掉 `.rm-unit {` 导致 sass 报 `unmatched "}"`、dev server 整页 500，而 check 与 lint 全绿。只有 sass/babel 才会报出来。
