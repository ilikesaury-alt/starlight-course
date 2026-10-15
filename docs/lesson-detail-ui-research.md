# 课文详情页（LessonPreview）UI/交互专项调研

> 调研时间：2026-10-10 ｜ 触发：用户反馈「课文详情这个页面的 ui 设计很垃圾，不管是内容展示或是交互都烂」。
> 方法：① 本地 `vite preview` + Playwright 截图实测（`docs/shots/`）；② 通读当前实现源码；③ GitHub 专项调研同类「儿童点读/阅读器」开源实现，提炼可落地模式。
> 范围：`src/pages/LessonPreview.tsx` + 其下 6 个 Tab 涉及的组件与样式（`ReadingZone` / `TappableWords` / `TappableText` / `BookTextView` / `LessonDialogueBox` / `SentenceFrameCard` / `ZoneCard` / `_study.scss`）。
> 与既有文档的关系：`ui-review-children-ux.md`（全站通审）与 `github-research-kids-english-2026-07-31.md`（竞品全景）偏全局，本文是**针对本页的深挖**，不复述其结论。
>
> **✅ 实施状态（同日）**：第一级「止血」A1~A5 已全部落地，第二级的部分收益（focus dimming + 自动滚动 + 按需中文）已进阅读区与对话区；详见 §三各条目后的「已做」标注与 §六回归数据。

---

## 0. 实测证据：页面到底长什么样

对 `#/preview/hello/1`（Module 1 · Lesson 1）在 430×900 手机视口下逐个 Tab 截图：

| Tab | 元素高度 | 约等于几屏手机 |
|---|---|---|
| 🎴 单词卡 | ~1,100 px | 1.2 屏 |
| 🧩 句型 | ~2,000 px | 2.2 屏 |
| 📖 课本原文 | **12,440 px** | **13.8 屏** |
| 🎯 闯关 | ~3,600 px | 4 屏 |
| 📚 阅读 | **3,542 px** | **3.9 屏** |

**「📖 课本原文」一个 Tab 高 12,440 px** —— 这不是「有点长」，这是一个 Tab 里塞了：
1. 「💬 本课重点句型（5）」卡片（5 句，每句 2 个喇叭：正常 + 慢速）
2. 「🎭 外教课堂对话」卡片（8 轮聊天气泡，每轮 2 个喇叭：朗读整句 + 慢速）
3. 「📖 课本原文 · 拆解成课堂对话」卡片（**16 个气泡**，每轮 1 个喇叭）
4. 底部着色图例 + 「← 课程列表」

也就是说：**同一批 5 个句型，在同一个 Tab 里被展示了 3 遍**（重点句型 → 外教对话 → 课本原文），每遍还各自带朗读按钮。这是「内容展示烂」的根因，不是配色问题。

「📚 阅读」3,542 px / 10 句，问题不同：每句的**每个词都是一个独立按钮**（`.tt-word`），视觉上变成一堆带底色的方块词，句子被切碎成「词块拼图」，孩子看不出这是一句话。

---

## 一、问题清单（按证据定位，按严重度排序）

### 🔴 P0-1「课本原文」Tab 三重重叠，一屏放不下任何东西
- 证据：截图 `docs/shots/tab-课本原文.png`，12,440 px。
- 代码事实：`LessonPreview.tsx` `tab === 'book'` 分支同时渲染 `PatternStrip` + `LessonDialogueBox` + `passageTurns`（或 `BookTextView`），三者内容同源（都是本课句子），只是换了三种包装。
- 后果：孩子要滚 14 屏才能看完「一课」，滚完已经忘了开头；老师/家长也无法快速判断「这一课讲了什么」。

### 🔴 P0-2 每句配 2~3 个喇叭，控件密度爆炸
- 证据：截图中每个气泡右侧是一颗或两颗大喇叭按钮；重点句型每句 2 颗（正常 + 慢速）。
- 代码事实：`PatternStrip` 每句渲染 `<SpeakButton>` ×2；`LessonDialogueBox` 每轮 ×2；课本原文气泡 ×1。全 Tab 喇叭按钮 **37 个**。
- 后果：真正的操作目标（点词听发音）被 37 个同形按钮包围，误触率极高；且「正常 / 慢速」两个按钮的区分度对孩子几乎为零。

### 🔴 P0-3 点词区域被切成「方块词」，句子不成句
- 证据：`docs/shots/reading-before.png` —— 「Hello! I am a small cat.」被渲染成 6 个带浅底色的小方块，横向排列。
- 代码事实：`TappableWords` 把每个 token 渲成 `<button className="tt-word">`，`.tt-word` 带 `padding:2px 3px; margin:0 1px; border-radius:4px` + SRS 三色背景（`_study.scss:935-946`）。
- 后果：**阅读体验的核心是「看到一句话」，现在看到的是「一堆词」**。SRS 三色背景在密集小词上同时出现时，视觉噪声远大于信息量。孩子无法练「整词阅读 / 眼跳」。

### 🟡 P1-1 Tab 栏语义混乱，6 个 Tab 里有 3 个在讲同一批句子
- 代码事实：`type Tab = 'vocab' | 'speak' | 'frame' | 'read' | 'book' | 'quiz'`。其中 `frame`（句型）、`book`（课本原文，含重点句型+外教对话）三者内容高度同源。
- 后果：用户（和家长）无法理解「句型」和「课本原文」的区别，每次都在猜该点哪个。

### 🟡 P1-2 顶部 Tab 栏 + 面包屑 + 大标题，三行头部挤占首屏
- 证据：截图中在到达任何内容前，已经有：面包屑（🏠 › Starlight 主课 › Hello! › Lesson 1）、`page-emoji` + `Module 1 · Lesson 1` + 大标题、`mode-badge`（📖 Starlight 课前预习）、Tab 栏 —— 共 4 层。
- 后果：430 px 视口下首屏几乎看不到内容，孩子第一眼看到的是导航 chrome 而不是学习内容。

### 🟡 P1-3 缺乏「读到哪了」的锚点：无进度、无当前位置、无一句一停
- 对比：调研的 readalong-reader / TouchRead.js 都有「当前句高亮 + 自动滚动到可视区 + focus dimming（淡化非当前句）」。
- 现状：`ReadingZone` 有 `reading-sent--now` 高亮，但**没有自动滚动**，整篇朗读时高亮句可能滚出视口；课本原文区则完全没有当前句概念。

### 🟡 P1-4 中文对照是「全有或全无」的全局开关
- 代码事实：`ReadingZone` 的 `showZh` 一次性开关控制全部句子；课本原文区则每句都常驻中文（`dialogue-zh`）。
- 后果：两种极端 —— 阅读区要么满屏中文（失去英文阅读），要么全无（不会的词没提示）；课本原文则是「中文常驻 + 自动逐词拼的粗释义」，英文被中文稀释。调研的 Lute 做法是 **hover/点击单句才显示该句译文**（`t` 热键），是更合理的折中。

### 🟡 P1-5 区块可折叠但折叠态信息量为零
- 代码事实：`ZoneCard` 折叠后只显示 `side`（如「点词听发音」）+ 「展开 ▼」。
- 后果：折叠 3 个重叠区块后，用户看到 3 行几乎相同的「点词听发音 · 展开 ▼」，依然不知道区别，也无法做判断。

### 🟢 P2-1 每句中文与英文上下堆叠，长句占双倍高度
- 代码事实：`.reading-zh` 在 `.tt-text` 下方独立成行；`dialogue-zh` 同理。
- 后果：10 句 × (1 行英文 + 1~2 行中文) 直接撑出 3,542 px。

### 🟢 P2-2 无障碍与反馈缺失（沿用全局审查结论，本页同样命中）
- 点词无键盘可达性；TTS 全失败时静默（点词没反应，无「没声音，再试一次」提示）；`.reading-say` 34 px 低于 44 pt 规范。

---

## 二、GitHub 同类实现调研（提炼可落地模式）

调研样本 12 个，按与「儿童教材课文点读」的相关度排序。**结论：这个细分（儿童 / 教材对齐 / 逐词点读 + 逐句朗读）几乎没有成熟开源实现，但「阅读器」这个交互形态有三四个高质量参照。**

### 2.1 核心参照

| 项目 | Star | 为什么必须看 | 许可证 |
|---|---|---|---|
| **fourleaf13-hue/touchread-js** | 新 | **定位完全重合**：「open-source read-aloud engine for **tappable, word-synchronized** children's reading experiences」，Sentence-level + word-level tap、同一语音配置、全局慢速 0.7×、逐词高亮 | MIT |
| **BrunoAMSilva/readalong-reader** | 新 | 单文件 web component，**句级 + 词级同步高亮 + focus dimming**，为低视力/阅读障碍儿童设计，`aria-current`、全键盘 | MIT |
| **LuteOrg/lute-v3** | ~1,580 | 「Learning Using Texts」品类的**事实标准**：点词弹释义、词状态着色（可关）、悬停出释义、译文按需（热键） | MIT |
| **richardr1126/OpenReader-WebUI** | — | 多格式 read-along，同步高亮 + 自动滚动 | — |
| **liorwn/book-karaoke** | — | 把任意文本变成卡拉OK式逐词高亮，体验参照 | — |

### 2.2 TouchRead.js：设计原则直接可抄（`docs/product-requirements.md` + `Design principles`）

它的 4 条设计原则，恰好逐条命中本页的问题：

1. **「Same text, same pronunciation profile」** —— 句级朗读和词级朗读用**同一套** voice/rate/pitch。
   → 对应本页 P0-2：不要再给「正常 / 慢速」两个按钮，改成**一个全局慢速开关**（它默认 `0.7x`），每句每词共用一套发音配置。
2. **「Child-visible feedback」** —— 每次点击都必须有明确视觉状态：selected sentence / selected word / **active spoken word**。
   → 对应本页 P1-3：不仅要有「当前句高亮」，还要有「正在读的词」高亮。
3. **「Human-correctable AI」** / 4. **「Open annotation over closed content」** —— 与数据层相关，本页可借鉴「内容与呈现分离」，但本页数据已是结构化数据，优先级低。

它的 UI 结构（`packages/react-reader/src/TouchReadPageView.tsx`）值得注意：
- **页面即画布**：句子/词是绝对定位的透明 `<button>` 覆盖在原图/版式上，`font-size: 0` 的 word box 只做命中区，文字由原版式呈现 —— **命中区与视觉完全解耦**。
- **词级命中区是「框」不是「词块」**：`--wordBox` 只有点击时有 `border-radius: 10px` 背景，**常态完全透明**（对比本页 `.tt-word` 常态带三色底）。
- 转写区 `__transcript` 用 `padding: 9px 12px` 的胶囊词，**仅在选中句出现**（`showTranscript && activeSentence`）。

### 2.3 readalong-reader：focus dimming 是「阅读体验」的关键一招

```css
:host([focus]) .sent { opacity: .32; transition: opacity .25s; }
:host([focus]) .sent.active { opacity: 1; }
:host([focus]) .eyebrow { opacity: .32; }
```
- 朗读时**非当前句降到 32% 不透明度**，当前句 100%。这是「跟着声音走」的最轻量实现，不需要自动滚动就能锁住注意力。
- 它的 CSS 变量架构也可借鉴：`--sentence`（当前句底色）/ `--word`（当前词底色）/ `--word-text`（当前词文字色）/ `--maxw`（栏宽）/ `--fontsize` / `--accent`。
- `aria-current` 标注当前句 + 完整键盘支持 + `prefers-reduced-motion`。

### 2.4 Lute v3：点词释义与词状态着色的正确做法

- **点词 → 弹编辑/释义表单；悬停已存词 → 直接出释义弹层**；移动端「点未知词开表单 / 点已知词出悬停 / 再点一次开表单」。
- **词状态着色默认开、可一键关**（设置项「Highlight terms by status」+ 阅读中热键 `h`），且**悬停时才显示高亮**的选项存在。
  → 本页把 SRS 三色**常驻**在每个词上，正是 Lute 明确做成「可关」的那一项。
- **译文按需**：悬停词 + 按 `t` 才调句级词典；不常驻。
- 页底「✅ 标记本页完成」→ 剩余未知词全部置为 known，给「读完一页」一个明确闭环。

### 2.5 其他可借鉴点

| 来源 | 模式 | 本页落点 |
|---|---|---|
| Duolingo（screenrove/uiland 设计解析） | 一次一题、全屏无导航、顶部细进度条、底部固定单主操作 | 「课本原文」Tab 改**一句一屏**时直接套用：顶部进度条 + 底部「下一句」 |
| Duolingo ABC（官方博客） | 3–8 岁重度依赖**音频旁白 + 动画**，视觉 Joyful | 每句进场动画、读完一句的即时反馈 |
| dyslexiflow / larstvei/Focus | 淡化/模糊非活动文本，隔离当前段 | 同 focus dimming，儿童版可只用透明度不用模糊 |
| react-segmented-control / affectUI | 2–6 项的 segmented control：滑动指示器 + 图标 + 角标 + 横向滚动 | 本页 5 个 Tab 正好适用，比现有 `tab-btn` 更清晰表达「同页切换视图」 |

---

## 三、可落地方案（按「先止血、再重构」分三级）

### 🩹 第一级：止血（不改信息架构，半天量）

| # | 改动 | 文件 | 预期效果 | 状态 |
|---|---|---|---|---|
| A1 | **「课本原文」Tab 拆成 3 个 Tab**：`💬 句型`（重点句型）/ `🎭 外教对话` / `📖 课文`，三个区块不再堆在一个 Tab 里 | `LessonPreview.tsx` | 单 Tab 高度从 12,440 px → ~3,500 px | ✅ 已做（12,440 → 3,314 px） |
| A2 | **删掉「慢速」按钮，改全局「🐢 慢速」开关**（复刻 TouchRead 原则 1） | `PatternStrip` / `LessonDialogueBox` / `ReadingZone` / 新增 `utils/slowMode.ts` + `components/PlayTools.tsx` | 喇叭按钮 37 → 13 个 | ✅ 已做（且点词与整句共用同一语速） |
| A3 | **`.tt-word` 常态去底色**，只保留 hover/active 底色；SRS 三色改为显式开关（复刻 Lute 热键 `h`） | `_study.scss` `.tt-word` + 新增 `utils/memoryState.ts` | 句子重新变回「一句话」，这是阅读体验的最大单点改善 | ✅ 已做（默认关；图例色板不受开关影响） |
| A4 | 头部 4 层压到 2 层：`mode-badge` 删掉（与面包屑信息重复）、面包屑缩短 | `LessonPreview.tsx` | 首屏多出 ~120 px 内容 | ✅ 已做 |
| A5 | 阅读区加 **focus dimming**（朗读时非当前句 `opacity:.32`）+ 当前句 `scrollIntoView({block:'center'})` | `ReadingZone.tsx` + `_study.scss` | 「跟着声音走」真正成立 | ✅ 已做 |
| A6 | 外教对话/课文的**中文改为按需显示**（默认收起，点开关才展开该区译文） | `LessonDialogueBox.tsx` | 英文不再被常驻中文稀释，气泡高度减半 | ✅ 已做 |

**踩过的坑（记录给后续）**：「再点一次正在播的句子 = 停止」最初失效 —— 点击处理读的是
`busyIdx` state，同一句连点时渲染还没提交，读到旧值 `-1` 于是当成新播放。改成同步 ref
（`busyRef`）后修复。这类「点击要读同步真相源」的坑在 `chainRef` / `sentSid` 上已踩过一次。

### 🏗️ 第二级：重构阅读/课文呈现（核心，1~2 天）

**「一句一屏」的课文阅读器**（综合 Duolingo 单题屏 + TouchRead 命中区解耦 + readalong focus dimming）：

```text
┌─────────────────────────────┐
│ ‹ 返回      ▓▓▓░░░ 3/16      │  ← 细进度条，一眼知道读到哪
├─────────────────────────────┤
│                             │
│   I'm good.                 │  ← 当前句，大字号（≥22px），居中
│   我很好。                   │  ← 点一下才显示该句中文（复刻 Lute 按需译文）
│                             │
│   [ 🔊 听这句 ]  [ 🐢 慢速 ]  │  ← 每句 1~2 个大按钮（≥48px）
│                             │
│   点单词听发音 · 带波浪线的是学过的词 │
└─────────────────────────────┘
        [ ← 上一句 ]  [ 下一句 → ]     ← 底部固定
```

- 句子本身仍走 `TappableWords`（点词发音保留），但**视觉上是一整句话**（A3 之后自然成立）。
- 每句一个主操作「🔊 听这句」，慢速是全局开关而非每句按钮。
- 中文按需：默认隐藏，点句子或点「🇨🇳」才显示**这一句**的译文（不再是全开/全关）。
- 底部「上一句 / 下一句」+ 顶部进度条，替代无限滚动。
- 读完最后一句给一个完成态（读复刻 Lute 的「标记本页完成」闭环 + 本项目已有星星体系）。

这个结构同时用于「📖 课本原文」和「📚 阅读」，两者只是数据来源不同（`passageTurns` vs `reading`），可抽成共用组件 `SentenceReaderView`。

### 🎯 第三级：信息架构收敛（P2）

- `frame`（句型）与拆出来的「💬 句型」合并，避免又出现同源重复。
- Tab 从 6 个收敛到 5 个，命名用孩子能懂的话：`单词卡 / 句型 / 课堂对话 / 课文 / 闯关`，「阅读」作为课后自选（已在最后）。
- Tab 栏改 segmented control 样式（图标 + 短标签 + 滑动指示器），窄屏横向滚动并自动保持选中项可见。

---

## 四、明确不建议做（避免过度设计）

1. **不要**给课文加跟读 STT —— AGENTS.md 已裁决，麦克风在目标设备（儿童桌面 Chrome）不可用。
2. **不要**把课本原文做成「绘本式绝对定位覆盖」—— TouchRead 那套是为「扫描 PDF +  bounding box」设计的；本页数据是结构化句子，DOM 流式排版足够，只需把命中区与视觉解耦（A3）。
3. **不要**引入 blur 做 focus dimming —— 儿童版用透明度即可，blur 有性能与可读性代价。
4. **不要**为「慢速」做每句按钮（已在上表删除）。

---

## 五、附：本页涉及文件速查

| 文件 | 作用 | 需改 |
|---|---|---|
| `src/pages/LessonPreview.tsx` | Tab 定义 + 6 分支渲染 | ✅ Tab 拆分/合并、头部精简 |
| `src/components/ReadingZone.tsx` | 📚 阅读短文 | ✅ focus dimming、自动滚动、按需中文 |
| `src/components/TappableWords.tsx` | 逐词点读（全站复用） | ⚠️ 只改样式不改行为 |
| `src/components/TappableText.tsx` | 课文点读（整句中文 + 喇叭） | 可能被一句一屏阅读器替代 |
| `src/components/BookTextView.tsx` | 课本原文（点词 + 听原文） | 与一句一屏阅读器二选一 |
| `src/components/LessonDialogueBox.tsx` | 外教对话气泡 | ✅ 拆出独立 Tab、删慢速按钮 |
| `src/components/ZoneCard.tsx` | 分区卡片 | 折叠态文案可加一句内容摘要 |
| `src/components/SentenceFrameCard.tsx` | 句型框架卡 | 低优先 |
| `src/styles/_study.scss` | `.tt-word` / `.reading-*` / `.dialogue-*` / `.zone-card` | ✅ `.tt-word` 去底色（最大单点） |

---

## 六、实施后回归数据（2026-10-10）

对 `#/preview/hello/1`（Module 1 · Lesson 1）在 430×900 视口下逐个 Tab 实测 `.lesson-shell` 高度：

| Tab | 实施前 | 实施后 | 降幅 |
|---|---|---|---|
| 🎴 单词卡 | 1,100 px | 1,234 px | —（未动） |
| 🧩 句型 | 2,000 px | 1,192 px | -40%（重点句型并入） |
| 🎭 外教对话 | （原来挤在课文里） | 2,015 px | 独立成 Tab |
| 📖 课文 | **12,440 px** | **3,314 px** | **-73%** |
| 🎯 闯关 | 3,600 px | 641 px | -82%（原数据含头部，现头部已精简） |
| 📚 阅读 | 3,542 px | 1,522 px | -57% |

**测试**：`npm run test` 215 passed；`npx playwright test` 58 passed / 3 skipped（跟读 Tab 原有跳过）；
`npm run lint` 与 `npx tsc -b` 均干净。

**新增测试**（`tests/starlight-zones.spec.ts`）：
- Tab 栏断言从「五个标签」更新为「六个标签」，并断言旧名「课本原文」已不存在
- 🎭 外教课堂对话：气泡按说话人渲染、中文默认收起可切换、每轮只剩一个朗读按钮
- 📚 阅读：每句一个小喇叭（句数 = 喇叭数）、点一下读这句再点停、focus dimming 生效与撤销、
  记忆状态默认关（`background-color` 透明）可开启、慢速开关跨 Tab 共享

**截图**：`docs/shots/after-*.png`（实施后）/ `docs/shots/tab-*.png`（实施前，其中 `tab-课本原文.png` 高 12,440 px）。
