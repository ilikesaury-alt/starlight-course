# Starlight 主课程功能优化方案（实现向）

> 配套调研依据：见 `docs/英语学习路线调研与开源参考.md`（§1 学习路线诊断、§3 GitHub 开源调研）。
> 本文把调研结论落到本项目的**文件 / 函数 / 接口**级别，作为后续实现的施工蓝图。
> 范围仅限 **Starlight 主课程模块**（`src/data/starlight.ts` + Starlight 相关页面），不扩展到 flyguy / rocketgirl / chinese / eng3a。

---

## 0. 现状速览（代码事实，避免空谈）

| 维度 | 现状 | 证据（文件 / 符号） |
|---|---|---|
| SRS 算法 | Leitner 7-box，固定间隔数组 | `srs.ts`：`BOX_INTERVALS=[0,1,2,4,7,14,30]`、`scheduleNext()` |
| SRS 卡模型 | 仅单词维度（`en` 为 key） | `srs.ts`：`interface SrsCard { en; box; nextReview; lastReview; streak; reviews; modules }` |
| 持久化 | zustand persist，version 6，`migrate` 已处理 masteredWords→box3、单元级→课级拆分 | `useCourseStore.ts`：`persist({version:6, migrate})` |
| 句型数据 | `Lesson.sentences` 已结构化；`ModulePreview.keySentences` 仍是**字符串** | `starlight.ts`：`Sentence {en,zh,hint}` / `keySentences: string` |
| 复习交互 | "想中文→翻面"的**识别型**被动回忆，句子卡与单词卡混排 | `SmartReview.tsx`：`contentIndex` 含 `type:'sentence'`，但 `answer()` 只记"记得/忘了" |
| 语音能力 | 仅 TTS（合成），全局唯一发声者 + 安全定时器 | `speakerControl.ts` / `SpeakButton.tsx` |
| 语音识别 | **全仓库无 STT / Web Speech Recognition** | grep 无 `SpeechRecognition` / `webkitSpeechRecognition` |
| 课文文本 | `Lesson` 无"课文对话长文本"字段 | `starlight.ts`：`Lesson { id; title; titleZh; words; sentences }` |

**核心缺口（对应调研根因）**：
1. 调度不个性化（Leitner 固定间隔）→ 8 岁孩子节奏差异大，生词/熟词一视同仁。
2. 复习只练"识别"不练"产出" → 课堂要开口时脑子没有现成句子 schema（Swain 输出假说 / 注意缺口）。
3. 句型是整句但未被结构化成语块（frame）→ 无法做"替换词、保框架"的公式化流利度训练。
4. 课文不可点读 → 缺"阅读即习得"的整句输入内化入口（Lute 思路）。

---

## 1. 优化项总览与优先级

| # | 优化项 | 借鉴来源 | 收益 | 改动量 | 优先级 |
|---|---|---|---|---|---|
| A | FSRS 替换 SRS 内核 | ts-fsrs (#1) | 调度个性化，复习量降 30–40% | 中（换内核 + migrate） | **P0** |
| B | 逐句跟读模式（产出练习） | Echoic (#5) + english-learning-app (#4) | 直击"课堂卡壳"，练整句输出 | 中（新增 STT hook + 组件 + 页面） | **P1** |
| C | 句子框架卡（语块进 SRS） | 调研 §2 句子框架库 | 公式化流利度，单词挂 frame 可产出 | 中（扩 SrsCard + 数据建模） | **P1** |
| D | 课文点读 | Lute (#2) | 整句输入内化，阅读即习得 | 中（补数据 + 新增组件） | **P2** |
| E | 课堂拓展词融合（动态录入） | 上课真实场景 + RAZ/little fox 等 | 预习覆盖全 + 拓展词进 SRS/跟读/框架/点读 | 中（store 加字段 + 录入 UI） | **P1** |

**顺序理由**：A 是内核，改动最小、收益最高、且是 B/C 的基础（句子卡复用同一套 SRS 持久化）；B/C 直接解决"课堂卡壳"根因，共用 SentenceReader + SrsCard 扩展；D 是进一步增强，可后置。

---

## 2. A. FSRS 替换 SRS 内核

### 2.1 为什么
现有 `BOX_INTERVALS` 对所有词一视同仁。孩子有的词一遍就熟、有的词反复错，固定间隔既浪费时间（熟词还按 14/30 天排）又低效（难词 7 天后才召回已忘）。FSRS 用 `difficulty / stability / retrievability` 三变量按个人表现动态调度，宣称同等留存下工作量少 30–40%。纯 TS、零依赖、~1KB，可前端直接跑，**不破坏"纯前端 PWA / localStorage"定位**。

### 2.2 涉及现状
- `srs.ts`：`SrsCard`、`scheduleNext()`、`BOX_INTERVALS`、`createNewCard()`、`isDue()`、`sortDueCards()`。
- `useCourseStore.ts`：`recordReview / seedCard / seedCards / getDueCards / getTodayDueCount / getTomorrowDueCount`，以及 `migrate` 里对 `box/nextReview` 的假设。

### 2.3 实施方案

**(1) 依赖**：`npm i ts-fsrs`（MIT，零运行时依赖）。

**(2) 扩展 `SrsCard`（向后兼容）** — 在 `srs.ts`：
```ts
import { Card, Rating, FSRS } from 'ts-fsrs'

// FSRS 需要的原始调度字段（新增）
export interface FsrsFields {
  difficulty: number      // D
  stability: number       // S
  due: number             // dayStamp，下次到期
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: number           // FSRS CardState: New/Learning/Review/Relearning
}

export interface SrsCard extends FsrsFields {
  en: string
  modules: ModuleId[]
  // 展示用派生字段（保留，兼容旧 UI 与 boxLabel/boxEmoji）
  box: number             // 由 state+stability 反推的展示档位 0..6
  reviews: number         // 别名 reps，兼容旧代码读取
  streak: number
  lastReview: number
  nextReview: number      // 别名 due，兼容旧代码读取
}
```
> 保留 `en/box/reviews/streak/lastReview/nextReview` 是为了**不改动 SmartReview / Progress / migrate 现有读取代码**，FSRS 真实调度用 `due/difficulty/stability`。

**(3) 新增调度封装** — `src/data/fsrs.ts`：
```ts
import { FSRS, Rating, type Card, type RecordLog } from 'ts-fsrs'
import { dayStamp } from './srs'

const fsrs = new FSRS({ enable_fuzz: true, enable_short_term: true })

/** 把我们的 SrsCard 转成 FSRS Card（首建时给默认新卡） */
export function toFsrsCard(c: SrsCard): Card { /* ... */ }
export function fromFsrsCard(card: Card, en: string, modules: ModuleId[]): SrsCard { /* ... + 反推 box */ }

/** 统一评分入口，包装 FSRS.repeat 的 4 种 what-if 为单一调用 */
export function gradeCard(c: SrsCard, rating: Rating, now = dayStamp()): SrsCard {
  const { card } = fsrs.repeat(toFsrsCard(c), now)
  return fromFsrsCard(card, c.en, c.modules)
}
```

**(4) store 适配** — `useCourseStore.ts`：
- `recordReview(en, correct, module)`：把 `scheduleNext(existing, correct, today)` 换成
  `gradeCard(existing, correct ? Rating.Good : Rating.Again, today)`。
- `createNewCard` 改为返回 FSRS 默认新卡（`fsrs.repeat` 的 New→Learning 首评）。
- `getDueCards / getTodayDueCount / getTomorrowDueCount`：把 `isDue(c, today)`（`nextReview<=today`）换成 `c.due <= today`。
- `sortDueCards`：仍可用（按 `due`  overdue 排序）。

**(5) migrate 升级** — `useCourseStore.ts` 的 `migrate`：
- `version: 6 → 7`。
- 旧 Leitner 卡（`box/nextReview`，无 FSRS 字段）→ 用 `box` 估算初始 `stability`：
  `stability = [0,0.5,1,2.5,5,8,14,30][box]`（与旧间隔对齐），`difficulty` 按 `box` 线性，`state=Review`，`due=nextReview`，`lapses = box===0?1:0`。
- 旧 `masteredWords`（已处理为 box3）同理升级。

**(6) 展示兼容**：`boxLabel/boxEmoji` 不变（用反推的 box）；Progress 页"盒"可视化继续可用。

### 2.4 验证（严守项目验证纪律）
- 改 SRS 调度属"改权重/常数"，**必须先跑 `npm run test`（`srs.test.ts`）**。
- 现有 `srs.test.ts` 断言的是 Leitner 行为，**需改写为 FSRS 行为断言**（如：连续 Good 后 due 间隔递增且 > Leitner；Again 后 due 回当天；难度随 Again 上升）。
- 建议新增 `fsrs.test.ts`：种子卡首评、4 档 Rating 的 what-if、migrate v6→v7 字段补全。
- 跑 `npm run check`（tsc）+ `npm run build` 确认类型与产物。

---

## 3. B. 逐句跟读模式（产出型口语练习）

### 3.1 为什么
调研核心结论：孩子"课堂卡壳"的根因是**只练了识别、没练产出**，且路线缺整句。SmartReview 当前对句子卡只问"想不想得起中文"，从不要求"说出整句"。跟读模式 = 播放原句 → 孩子开口说 → 识别反馈，把 Swain 的"被推动的输出"落到每日 drill。这是直击痛点的最高优先功能。

### 3.2 涉及现状
- TTS：`speakerControl.ts`（`useAnimatedSpeak`）、`SpeakButton.tsx` — **可复用播原句**。
- STT：**无**，需净新增。
- 句子来源：`Lesson.sentences` 已结构化，直接可用。

### 3.3 实施方案

**(1) 新增 STT hook** — `src/utils/useSpeechRecognition.ts`：
```ts
export function useSpeechRecognition(opts: { lang?: string; onResult: (text: string) => void }) {
  // 守卫：'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  // 配置：lang='en-US', interimResults=true, continuous=false
  // 生命周期：start()/stop()，卸载自动 abort，错误回调（no-speech / not-allowed / network）
  // 返回 { supported, listening, transcript, start, stop, error }
}
```
> 参考 `react-speech-kit`（#6）的封装思路：内置 `supported` 守卫 + 卸载清理 + 错误事件，替代手写兜底。

**(2) 新增跟读组件** — `src/components/SentenceReader.tsx`：
```
交互：
  ① 播放原句（复用 useAnimatedSpeak / SpeakButton）
  ② 「开始跟读」→ useSpeechRecognition 监听
  ③ 识别文本与原句做归一化比对（小写、去标点、去冠词 a/the 容错）
  ④ 反馈：逐词高亮（原句词 vs 识别词重合）+ 相似度%（词集合 Jaccard / Levenshtein）
  ⑤ 「再说一次」循环；达标（≥阈值）点亮 ✅
降级：supported=false 或识别失败 → 显示「家长/老师确认」按钮（手动记对）
```
> 评分**先用文本相似度**（纯前端，零后端），不引 WhisperX/wav2vec2 —— 只取 Echoic (#5) 的 UX 范式（逐句、调速、A/B、弱点汇总），重 ML 评分作可选增强，保持纯前端 PWA 定位。

**(3) 接入主课** — 在 `LessonPreview.tsx` 内嵌"跟读" tab（与现有"单词/句型/测验"并列），从 `lesson.sentences` 取数据；或在 `SmartReview.tsx` 对 `type==='sentence'` 卡翻面后显示「说出整句」按钮，调 SentenceReader。

**(4) 产出练习记 SRS**：跟读达标 → 调 `recordReview(en_sentence, true, 'starlight')`，让句子卡进入复习调度（与 C 项句子框架卡共用 SrsCard 扩展）。

### 3.4 风险与降级
- Web Speech Recognition **Safari/iOS 不支持**（仅 Chrome/Edge 桌面 + Android Chrome）。必须 `supported` 守卫 + 手动确认降级，否则 iOS 上功能不可见。
- 需 `https` 或 `localhost`（PWA 部署到 GitHub Pages 满足 https）。
- 儿童发音不标准时识别率低 → 阈值放宽（如 ≥60%）+ 家长确认兜底，避免挫败。

---

## 4. C. 句子框架卡（公式化语块进 SRS）

### 4.1 为什么
调研 §2 的"句子框架库"：RAZ 缺的是整句积累，光刷单词（basic reading）是有砖没图纸。把 Starlight 句型结构化成语块（"I want a ___."），替换词保框架，是公式化流利度的标准训练法（Nation / Ellis / Kormos）。

### 4.2 涉及现状
- `SrsCard` 仅单词维度（key=`en`）→ 句子卡需扩展。
- `ModulePreview.keySentences` 是**字符串**（"Hello! How are you? What's your name? ..."）→ 需结构化。
- `Lesson.sentences` 已结构化，但未建模"填空框架"。

### 4.3 实施方案

**(1) 结构化关键句** — `starlight.ts`：
- 新增 `SentenceFrame` 类型：
```ts
export interface SentenceFrame {
  pattern: string          // "I want a ___."（下划线为填空位）
  blanks: { options: string[] }[]  // 填空候选，取自本课 words.en
  zh: string
  hint?: string
}
```
- 把 `ModulePreview.keySentences: string` 改为 `keyFrames: SentenceFrame[]`（或在 `lessons.ts` 每课补 `frames: SentenceFrame[]`）。例如 Unit 4 玩具：`{ pattern: "I want a ___.", blanks:[{options:['car','train','doll','piano']}] }`。

**(2) 扩 `SrsCard` 支持句子卡** — `srs.ts`：
```ts
export interface SrsCard {
  // ...FSRS 字段（见 A）
  en: string               // 句子卡用 pattern 的稳定哈希（如 hash("I want a ___.")）
  kind: 'word' | 'sentence'   // 新增：卡片类型
  frame?: SentenceFrame    // 句子卡附带的框架（含填空候选）
  modules: ModuleId[]
}
```
> `seedCards` 增加 `seedSentenceFrames(frames, module)`，sentence 卡 key 用 pattern 哈希避免与单词卡冲突，复用 `modules` 标记来源。

**(3) SmartReview 渲染区分** — `SmartReview.tsx`：
- `type==='sentence'` / `kind==='sentence'` 卡：翻面后显示「说出整句」→ 渲染 `SentenceReader`，随机填一个 blank 候选让孩子产出（替换词保框架）。
- 识别达标 → `recordReview(frameKey, true, 'starlight')`。

**(4) contentIndex 扩展** — `SmartReview.tsx` 的 `contentIndex` 增加 `frame` 元信息，索引 sentence 卡。

### 4.4 验证
- 扩 `srs.test.ts` / 新增：sentence 卡 seed + 复习不改变单词卡；frame 候生成正确。
- `npm run check` 确认 `kind`/`frame` 字段类型。

---

## 5. D. 课文点读（阅读即习得，纯前端）

### 5.1 为什么
Lute (#2) 思路：通过阅读习得，点词查义、词按熟悉度着色。把 Starlight 课文变成可点读文本，提供"整句输入内化"入口，补"RAZ/整句输入缺口"的阅读侧。

### 5.2 涉及现状
- `Lesson` 无课文长文本字段 → 需补数据。
- TTS + 词索引（`bookDict` / `Word`）已具备，点读是组合复用。

### 5.3 实施方案

**(1) 补课文数据** — `starlight.ts`：`Lesson.passage?: string`（课文对话原文，从教材 PDF 提取；`scripts/` 已有提取脚本可复用）。

**(2) 新增点读组件** — `src/components/TappableText.tsx`：
```
- 把 passage 按词切分（保留标点归属）
- 每词可点：① SpeakButton 朗读（复用 speakerControl）② 弹释义（查 Word/bookDict 索引）
- 词着色：用该词 SrsCard.box 映射 Lute 式状态色（已知=绿 / 模糊=黄 / 未知=灰）
- 点击整句可整句朗读（听读结合）
```
> 只取 Lute 的**产品思路**（阅读即习得 + 词状态可视化），**不取 Python 后端**——纯前端组件，数据来自静态 `lessons.ts`。

**(3) 接入**：`LessonPreview.tsx` 新增"课文"区，渲染 `TappableText`。

### 5.4 验证
- `npm run check` 确认 `passage` 字段可选、TappableText props 类型。
- 手动：点词出释义 + 朗读；未知词灰、熟词绿。

---

## 6. 整体架构与数据流（文字图）

```
                        src/data/lessons.ts (Lesson{words, sentences, frames?, passage?})
                                      + 课堂拓展词（运行时录入，store.starlightExtensions）
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   【SRS 持久化】              【课文点读】              【跟读/产出】
   src/data/srs.ts            TappableText.tsx          SentenceReader.tsx
   + fsrs.ts (A)              (D)                       (B)
   SrsCard{kind,FSRS字段}     点词→释义+朗读            原句TTS→STT识别→反馈
            │                         │                         │
            └─────────┬───────────────┘─────────────────────────┘
                      ▼
            useCourseStore (recordReview/seedCards/getDueCards)
            persist version 7 + migrate (A 的 v6→v7)
                      │
                      ▼
            SmartReview.tsx（统一调度：单词卡识别 + 句子卡产出 + 框架填空）
            LessonPreview.tsx（单词/句型/跟读/课文 四区）
```

**新增文件清单**：
- `src/data/fsrs.ts`（A）
- `src/utils/useSpeechRecognition.ts`（B）
- `src/components/SentenceReader.tsx`（B/C）
- `src/components/TappableText.tsx`（D）
- 测试：`src/data/fsrs.test.ts`、`src/utils/useSpeechRecognition.test.ts`（或 mock）

**修改文件清单**：
- `src/data/srs.ts`（SrsCard 扩 FSRS + kind/frame）
- `src/data/starlight.ts`（SentenceFrame 类型、keyFrames、Lesson.passage）
- `src/store/useCourseStore.ts`（recordReview 换 gradeCard、migrate v6→v7）
- `src/pages/SmartReview.tsx`（句子卡/框架卡分支 + SentenceReader）
- `src/pages/LessonPreview.tsx`（跟读 tab + 课文区）
- `srs.test.ts`（断言改 FSRS 行为）

---

## 7. 实施顺序与里程碑

| 阶段 | 任务 | 出口标准 |
|---|---|---|
| **P0** | A：引入 ts-fsrs，扩 SrsCard，换 recordReview，migrate v6→v7，改 srs.test.ts | `npm run test` + `check` + `build` 通过；旧数据升级无丢失 |
| **P1a** | C：SentenceFrame 建模 + SrsCard.kind + seedSentenceFrames + SmartReview 句子卡分支 | 句子框架卡可播种、可复习、不影响单词卡 |
| **P1b** | B：useSpeechRecognition + SentenceReader + LessonPreview 跟读 tab | 跟读可运行（Chrome），iOS 降级可用 |
| **P1c** | E：store.starlightExtensions + LessonPreview 拓展词录入 UI + 拓展词 seed 进 SRS | 老师课堂拓展词可录入并进入复习/跟读/框架 |
| **P2** | D：Lesson.passage + TappableText + 课文区 | 点读出释义+朗读，词状态着色正确 |

---

## 8. 风险与取舍

| 风险 | 说明 | 缓解 |
|---|---|---|
| STT 兼容性 | Safari/iOS 无 Web Speech Recognition | `supported` 守卫 + 家长确认降级 |
| FSRS 与 Leitner 展示冲突 | 旧 UI 读 box/nextReview | 保留派生字段，FSRS 真实调度用 due/difficulty |
| 数据迁移 | 旧 localStorage 卡缺 FSRS 字段 | migrate v6→v7 按 box 估算 stability，旧数据不丢 |
| 句子卡 key 冲突 | 句子与单词用同一 srsCards map | 句子 key 用 pattern 哈希，与单词 en 隔离 |
| 后端诱惑 | Lute/Echoic 有后端 ML | **明确不引入**，保持纯前端 PWA；评分用前端文本相似度 |
| 儿童挫败感 | 识别率低/跟读难 | 阈值放宽 + 手动确认 + 先求整句再求准确 |

---

## 9. 验证纪律（项目约束）

- AGENTS.md 规定"改权重/常数必须先跑 rule_validate"。**FSRS 替换 = 改调度常数，必须先跑 `npm run test`**，且 `srs.test.ts` 必须覆盖 FSRS 行为（连续 Good 间隔递增、Again 回当天、难度随错上升、v6→v7 迁移字段完整）。
- 每阶段结束跑 `npm run check` + `npm run build`；P1 后跑 `npm run e2e`（Playwright）确认 LessonPreview / SmartReview 不回归。
- 改动 SrsCard 结构属"结构性口径改动"，不只跑单测——需同步确认 Progress 页盒可视化、getTomorrowDueCount 提示、migrate 三处读取点。

---

## 10. 不采纳项（与定位冲突）

- **Lute 的 Python/Flask 后端**、**Echoic 的 FastAPI + WhisperX/wav2vec2 后端**：与"纯前端 PWA、零服务器"定位冲突，且引入运维成本，单孩家用场景不需要。只取产品/UX 思路。
- **各 Leitner 项目的 Supabase/Express 后端**：同上，不采纳；本项目 localStorage 路线更契合离线家用。
- **Anki 同步 / 自建云**：跨设备同步需求（调研 #3 提到的 GitHub 同步）可作为独立后续项，不在本方案内，且须保持零服务器成本。

---

## 11. E. 课堂拓展词的录入与融合（课堂真实词汇纳入体系）

### 11.1 为什么（本轮新发现）
实际使用中，课前用 Starlight 做预习，但菲教老师上课会针对当课主题**拓展更多词汇**（如蔬菜单元不止教材的 apple/banana，还会带出 broccoli / cabbage / cucumber / eggplant / lettuce…）。这些词：
- 不在 `Lesson.words` 静态数据 → **预习覆盖不全**，孩子课上遇到拓展词没底（直接加剧"卡壳"）；
- 进不了 A/B/C/D 任何体系 → 不能被 SRS 复习（A）、不能跟读（B）、不能填框架（C）、不能点读（D）。

本项是贯穿 A–D 的**数据入口增强**，让"老师课上多讲的词"（以及 RAZ/little fox 等其他绘本里遇到的词）和教材词一样可管理、可复习。

### 11.2 涉及现状
- 方案 A–D 的数据源全是静态 `lessons.ts`，**无运行时用户词入口**。
- `useCourseStore` 持久化 `srsCards`，由各页 `seedCards` 写入，但无"用户自定义词"存储字段。
- `Word` 类型（`starlight.ts`：`en/zh/emoji/ipa`）已可直接复用承载拓展词。

### 11.3 实施方案

**(1) 数据模型** — `useCourseStore.ts`：
```ts
// 课堂拓展词：按课 key 存，绝不写回静态教材数据
// lessonKey 形如 `${unitSlug}-${lessonId}`，如 'unit4-2'
starlightExtensions: Record<string, Word[]>
addExtensionWord: (lessonKey: string, w: Word) => void
removeExtensionWord: (lessonKey: string, en: string) => void
```
- `partialize` 增加 `starlightExtensions`；`migrate`（**与 A 的 v6→v7 合并批次**，因 A/B/C/D 均未落地）补默认 `{}`，旧数据无该字段不崩，避免版本号膨胀到 v8。

**(2) 录入入口** — `LessonPreview.tsx` 每课加「➕ 加词」按钮：
```
弹录入卡：en（必填）+ zh（选填，自动查 bookDict/有道兜底）+ emoji（选填，📝 默认）
  → addExtensionWord(lessonKey, w)
  → 同时 seedSrsCard(en, 'starlight') 让该词立即进入复习池
  → 列表展示本课拓展词，带「拓展」badge + 删除按钮（家长复核，防儿童误录/拼写错）
```

**(3) 融合 A（SRS）**：拓展词经 `seedSrsCard` 写入 `srsCards`，SmartReview 按 `modules.includes('starlight')` 自然混排；`contentIndex` 标记 `source:'extension'`，渲染「拓展」角标。

**(4) 融合 B（跟读）**：拓展词进跟读区，支持单词跟读（复述发音）+ 填入课文句跟读（如 "Do you like ___?"）。

**(5) 融合 C（框架）**：拓展词自动成为**同单元框架**的 blank 候选（蔬菜词→"Do you like ___?" "I want ___." 已填空位），无需手动配置。

**(6) 融合 D（点读）**：拓展词并入该课 `TappableText` 词索引，可点读 + 按 box 着色。

**(7) 隔离 / 合并策略**：拓展词独立存 `starlightExtensions`，**不污染 `lessons.ts`**；复习/框架/点读时与教材词合并呈现，UI 用「拓展」badge 区分来源，方便家长区分"教材词"与"老师拓展词"。

### 11.4 验证（严守验证纪律）
- `npm run check`：新字段/动作类型通过。
- 改 store 结构属"结构性口径改动"，跑 `npm run test` + `npm run build` 确认无回归。
- 手测：录入→退出重进数据仍在（persist）；SmartReview 队列出现该拓展词并带角标；`migrate` 旧版无 `starlightExtensions` 不崩。
- 去重：同课重复录同一词不翻倍；删除生效。

### 11.5 风险与取舍
- 录入拼写/释义错（儿童或 iPad 手写）→ 删除按钮 + 家长复核；zh/emoji 缺失走 `bookDict`/有道兜底。
- 拓展词过多稀释教材复习 → SmartReview 提供「仅教材 / 仅拓展 / 混合」筛选（复用 `ModuleFilterChips` 思路）。
- **不引后端**：纯前端 localStorage，符合 PWA 定位。

---

## 12. 方案评估：能否解决最初的问题（2026-09-29 复盘）

> 最初问题：8 岁孩子在菲教 Starlight 课（25min，主攻听说）经常无法组织语言、卡住不知如何表达；假设根因是路线缺整句积累与口头输出。本方案是 Starlight 主课程的 App 实现蓝图，以下评估其对症程度。

### 12.1 结论（一句话）
方向对，B/C/E 直击根因；但方案**单独不足以解决**最初问题，且有三处关键空白 + 一处优先级错位。它是"家庭训练系统"的 App 半边，另半边（课堂对齐 + 角色扮演 + 效果验证）须用户亲自补。

### 12.2 对症度对照
| 原始根因/诉求 | 对应项 | 是否解决 | 说明 |
|---|---|---|---|
| 缺整句输入内化（RAZ 缺口） | D 点读 + C 框架 | 部分/较强 | 未含 little fox/基本阅读改造 |
| 缺被推动的输出（Swain） | B 跟读 | **强** | 全方案唯一"开口说+反馈"项 |
| 句子积累不足（核心假设） | C + B | **强** | 语块进 SRS |
| 预习覆盖不全（老师拓展词） | E 拓展词 | **强** | 直击用户最新反馈 |
| 复习调度低效 | A FSRS | **弱（对原问题）** | 只优化"何时复习"，不加内容不练输出 |

### 12.3 三处关键空白
- **G1 真实课堂不受 App 控制**：菲教对齐（逼整句）、家庭角色扮演、little fox 跟读改造全在 App 外，A–E 未含——这是原始 Q2 答案的另一半。
- **G2 无效果验证闭环**：无"每课后回传孩子能否说出目标句型"的机制，无法判断是否见效。
- **G3 优先级错位**：A 排 P0 但最不对症，B/C/E 排 P1；应问题驱动重排。

### 12.4 执行风险
- 设备兼容：B 依赖 Web Speech Recognition，**Safari/iPad 不支持** → 跟读主药在 iPad 上失效，只能降级家长手机。
- 动机假设：B/C/E 假设孩子愿每日开口跟读，8 岁麦克风羞怯/屏幕时间未知；star 激励是否覆盖"说整句"未写清。

### 12.5 建议
1. 重排：E → B → C → A（可选）→ D。
2. 补家长侧动作（菲教对齐 + 角色扮演 + little fox 改造），与 App 并行。
3. 加最小验证闭环：每课后勾选"能否用目标句型说出几句"，2–4 周看趋势。
4. iPad 兼容预案：明确跟读降级路径，否则主药架空。
