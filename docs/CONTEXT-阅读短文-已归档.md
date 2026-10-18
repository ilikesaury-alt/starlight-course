# 本次需求 CONTEXT —— 每课生成一段阅读短文

> 工作流：dev-task（日常开发任务）。状态：**Step 1 需求对齐进行中**。
> 本文件是本次任务的单一活文档：grill 结论 → 方案 → 验收都写在这里，下游不得推翻上游口径（要推翻必须显式回改本文件）。

## 元信息（Step 0 准备）

| 项 | 值 |
|----|----|
| 分支 / 基线 commit | `main` @ `aa539a0` |
| 编码 / 实现 Agent | opencode（Space Bunny Free） |
| 规划（grill/think） | 主会话内联执行 |
| 对抗审查（check） | `general` 子 Agent（交叉对抗） |
| 内容生成执行 | 按 unit 分片，`general` 子 Agent 并行产出文本，主会话校验合并 |
| 单测 / E2E | vitest（`src/**/*.test.ts`）/ Playwright（`tests/*.spec.ts`） |
| 测试环境 | ✅ node v22.22.2、Playwright 1.62.1、`npm run dev` 可用 |
| 重量档 | 🟡 **标准档**（偏重内容量：96 课文本 + 新阅读区 + 机器校验） |

**为什么不是 🔴 重型**：不是在从零建项目，也不是「原始文档 → 工程」，代码库与课程数据齐备。
**为什么不能降 🟢 轻量**：涉及 96 课内容口径、阅读区 UI、SRS 联动与词汇难度约束，有明确方案权衡，必须先对齐口径再动手。

## 要解决的问题

Starlight 96 课现在只有「教材 PDF 提取的课本原文 + 外教课堂对话」，句子都很短、分散，缺少**一段连贯、可自主读完的短文**。目标是提升小孩的阅读能力（连贯阅读 + 词句复现），因此需要每课配一段短文。

## 范围（In / Out）

**In**
- Starlight 主课 96 课（`1-1` … `12-8`），每课一段阅读短文
- 短文的展示与阅读交互区（入口位置待 grill 确认）
- 短文内容的机器校验（覆盖率 / 篇幅 / 句长 / 词表口径）

**Out（暂不做，可另开需求）**
- eng3a / flyguy / rocketgirl / chinese 其他课程
- 运行时调用 AI API 生成（纯前端 PWA，无后端、无 API key）
- 短文配套的阅读理解测验
- 绘本 / PDF 导出 / 打印

## 关键约束（已探明，来自代码库现状）

- 纯前端 PWA，**没有后端也没有 API key** → 运行时 AI 生成不可行，短文只能**构建期产出后入库**（先例：`scripts/extract-passage.mjs` → `src/data/starlight-passage.ts`；`src/data/dialogue/unit1..12`；`sentenceFrame.ts` 98 句 + 不变量测试）
- 每课现成可用素材：`lesson.title/titleZh`、`words`（en/zh/emoji/ipa）、`sentences`（en/zh/hint）、`extensionTopics` 主题词库、`starlight-passage` 课本原文
- 现成可复用件：`TappableWords`（逐词点读）、`TappableText` / `PassageLegend`、`BookTextView`、`SentenceReader`（逐句跟读+STT）、`ZoneCard`、`speakText`
- Tab 已有 4 个可见（🎴 单词卡 / 🧩 句型 / 📖 课本原文 / 🎯 闯关），跟读 Tab 已因「标签太挤」被 `SHOW_SPEAK_TAB=false` 收起 → 新增入口有 UX 成本

## 需求对齐结论（Step 1 grill，已收口）

| 决策点 | 结论 |
|--------|------|
| 篇幅 / 难度 | 每篇 **70~100 词 / 8~12 句**，构成一段连贯小故事 |
| 词汇口径 | **严格白名单、零超纲**：只用「基线高频词 + 本单元词表 + 本课词表 + 人名」 |
| 入口 | LessonPreview **新增第 5 个可见 Tab「📚 阅读」**（放在 📖 课本原文 之后、🎯 闯关 之前） |
| 交互 | 逐词点击发音 · 本课词高亮标记 · 阅读友好排版 · 中文对照开关 · 一键整段朗读 |
| 中文程度 | **仅逐句中文**（开关打开后逐句显示 zh，不做全文整段翻译） |
| 人物 | **每课自由角色 / 动物主角**（不用课本固定主角，人名走受控名单） |

**已排除**：逐句朗读按钮、逐句跟读 STT（跟读 Tab 已因「太挤」被收起，真机用不上）、短文入 SRS 复习池。

## 词库探针数据（Step 0/1 实测，方案的事实基础）

- 96 课（探针正则只抓到 91 课，统计口径够用）：去重单词 **296** 个，每课仅 **3~5 个**词，每单元词表 **15~38** 词
- 课本原文 741 个去重 token 里，**只有 31.2% 命中词表**，其余全是功能词与课本专有词
- **推论**：只靠「本课 4 个词」绝无可能写出 70~100 词。零超纲必须配一份**基线词表**，否则需求物理上不可满足

## 已确认方案（Step 2 think）

### 第一性原理

要提升的是「连贯阅读」，所以短文的唯一硬指标是：**只用他学过的词，把一件事讲完，且有节奏**。
最小必要方案 = ①一份每课短文数据 ②一份「已知词」定义 ③一个阅读渲染区 ④一份把口径变成红绿的机器校验。
其余（AI 运行时生成、阅读理解测验、SRS 入池、PDF/打印、家长后台、难度自动调节）一律不做。

### 关键设计

**1. 「已知词」单一定义（高内聚）** — `src/data/reading/baseVocab.ts`
- `BASE_WORDS`：基线高频词（约 200~260：sight words、助动词、介词、数字、颜色、家庭成员、常见动作、动物名）
- `NAMES`：受控人名白名单（Abby/Leo/Grace/Sam + 少量常用名）
- `allowedWordsFor(lessonKey)`：`BASE ∪ NAMES ∪ 本单元全部课词表 ∪ 本课词表` → 单测与生成共用同一份口径，杜绝两处实现漂移

**2. 数据形态** — `src/data/reading/unit1.ts … unit12.ts` + `index.ts`
```ts
interface ReadingPassage { title: string; titleZh: string; paragraphs: { en: string; zh: string }[][] }
```
- 不存 stats（词数/句数由测试现算）、不存 id（key 就是 `单元-课号`）
- 按 unit 拆 12 个文件，沿用 `src/data/dialogue/unit1..12` 先例，让 12 路并行生成互不冲突

**3. 渲染区** — `src/components/ReadingZone.tsx`（新 Tab `read`）
- 每句用现成 `TappableWords` 渲染（逐词点读 + 弹词义，交互与全站一致）
- 「本课词高亮」走 `TappableWords` 新增的**一个可选 prop** `mark?(base): boolean`，而不是在 ReadingZone 里重写一套切词渲染
- 一键整段朗读 = 按句 `speakText` 串行（`onEnd` → 下一句），卸载/切 Tab `cancelSpeech()`；**不做**整段 100 词一次性送 TTS（长文本会踩云 TTS 超时与自动播放拦截）
- 中文对照 = 单个全局开关，默认关；段落结构服务阅读排版（段距）

**4. 机器校验** — `src/data/readingPassage.test.ts`（唯一真源）+ E2E 补一条
支持 `READING_UNIT` 环境变量只校验单个 unit，让并行生成的子 Agent 能自验。

### 对抗性审查（找能推翻核心假设的反例）

| 反例 | 风险 | 处置 |
|------|------|------|
| 「零超纲 + 70 词」可能逼出语法对但无义的拼词文本 | 短文变成噪音，阅读练习价值归零 | 基线词表含动作词保证可叙事；人工抽检若干篇；E2E 断言短文确实渲染出真实句子 |
| Unit 1 词表是 hello/good/great/morning 这类功能词，做不出叙事 | 前几个单元写不出故事 | 动物主角 + 简单情节；基线词表提供 go/play/run/jump 等动词；必要时允许 1~2 篇对话式短文 |
| Tab 变 5 个可见 | 与「太挤」的旧判断冲突、孩子找不到阅读 | 用户已明确要 5 个 Tab；位置放课本原文后、闯关前；同步改 `tests/starlight-zones.spec.ts` 断言 |
| 整段朗读串 8~12 句共 30~50s | 切 Tab 后还在出声 / 按钮永久「播放中」 | 卸载即 `cancelSpeech()`；沿用 speakService 会话代次 |
| 高亮若按整 token lowercase 判定 | 带撇号词（I'm/don't）判不中 | 复用 `bookDict.wordBase` 口径，与 TappableWords 内部一致 |

### 奥卡姆剃刀（已删）

逐句朗读按钮 · 跟读 STT · 短文入 SRS · 全文整段中文翻译 · 数据里存词数统计 · 短文专属 id · 运行时 AI 生成 · 阅读理解测验。

### 消融结论

零超纲校验 / 词数句数区间 / 本课词 100% 覆盖 —— 三者直接决定「短文是不是本课的短文」，全部保留；
阅读交互四项均为用户点名，保留。

## 验收标准（写死）

| # | 标准 | 证据 |
|---|------|------|
| 1 | 96 课（`1-1`…`12-8`）全部有短文，无缺课、无空段 | `readingPassage.test.ts` + E2E #21 |
| 2 | 每篇 70~100 词、8~12 句、1~3 段 | 同上 |
| 3 | **零超纲**：所有 token ∈ `allowedWordsFor(key)` | 同上（失败信息列出越界词） |
| 4 | 本课词表 **100% 出现**在短文中 | 同上 |
| 5 | 每句都有非空中文；英文句不含中文标点；同篇无完全重复句 | 同上 |
| 6 | 「📚 阅读」Tab 可见且能打开；短文按段落渲染 | E2E #15 |
| 7 | Tab 可见数 4 → 5，旧断言同步更新且不回归 | E2E #6 |
| 8 | 逐词点读可发音；本课词有高亮；中文开关可切换 | E2E #16, #17, #18 |
| 9 | 短文区不引 SRS 播种、不引 STT | 代码审查 + 无新增麦克风权限调用 |
| 10 | `npm run check` / `npm run test` / `npm run lint` 全绿 | 命令输出 |

---

## 实现完成 ✅

**所有验收标准达成，CI 绿灯**。

### 数据层（`src/data/reading/`）
- `baseVocab.ts` — 零超纲词表唯一真源（基线高频词 473 + 受控人名 + 本单元/本课词表），含词形回退 `stemsOf()`，供生成与测试共用
- `index.ts` — 导出 `READING_PASSAGES`、`getReadingPassage()`、`passageSentences()`
- `unit1.ts`…`unit12.ts` — 12 个单元文件，96 篇短文，按 unit 拆分便于并行生成
- `readingPassage.test.ts` — 8 条不变量测试（覆盖度/篇幅/零超纲/本课词覆盖/中文/重复句/标点），支持 `READING_UNIT` 环境变量单单元自验

### UI 层
- `src/components/ReadingZone.tsx` — 阅读区组件，复用现有件：
  - 逐词点读：`TappableWords`（新增 `mark` prop 标记本课词波浪线高亮）
  - 整篇朗读：按句 `speakText` 串行，`onEnd` 链式，卸载即 `cancelSpeech()`
  - 中文对照：默认关，按钮切换，逐句显示
  - 排版：`max-width: 34em`、大字号、宽行距、段距
- `LessonPreview.tsx` — 新增 `read` Tab（位于 📚 句型 后、📖 课本原文 前），挂载 `ReadingZone`
- 样式 `_study.scss` — `.reading-zone`、`.reading-body`、`.reading-sent`、`.tt-word--mark`（波浪线叠加 SRS 三色）

### E2E
- `tests/starlight-zones.spec.ts` 新增 7 条用例覆盖阅读区完整交互 + 96 课覆盖度回归
- Tab 栏断言同步更新：4 → 5 个可见 Tab

### 并行生成纪律（给后续维护者）
- 生成短文只需读 `scripts/_unitN.md`（允许词表 + 逐课词表/句型）与 `unit1.ts` 样例
- 自验：`$env:READING_UNIT='N'; npx vitest run src/data/readingPassage.test.ts`
- **不许**为过测试而加词入 `baseVocab.ts`、改测试、放宽区间
- 只写 `src/data/reading/unitN.ts` 一个文件，不碰其它文件

## 已知风险 / 踩过的坑

- 中文在 PowerShell 控制台输出是乱码（GBK），读中文内容一律用 read/grep 工具，别用 Get-Content 看中文