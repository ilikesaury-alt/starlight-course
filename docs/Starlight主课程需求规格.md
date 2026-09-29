# Starlight 主课程功能优化 — 需求规格说明书（评审版）

> 本文由 `requirements-doc-gen` 生成，源材料为 `docs/Starlight主课程功能优化方案.md`（实现向设计蓝图）与 `docs/英语学习路线调研与开源参考.md`（学习路线诊断 + GitHub 开源调研）。
> 模式：**comprehensive（13 章评审版）**。第 3 章技术调研 pass 的结论已并入正文与附录，未丢弃。
> 编制日期：2026-09-29。目标平台：纯前端 PWA（React18 + TS + Vite6 + Zustand + Tailwind，GitHub Pages 部署）。

---

## 元信息

| 项 | 内容 |
|---|---|
| Feature Branch | `feat/starlight-optimization`（建议） |
| 阶段 | Requirements（本文）→ Design → Implementation |
| 目标平台 | 桌面浏览器 PWA，**仅 Chrome / Edge（Windows，需 WebGPU 以跑 Kokoro 神经 TTS）**；不承诺 macOS Safari / Firefox / 移动端/iPad 兼容。**目标设备为桌面 WebGPU** |
| 编制日期 | 2026-09-29 |
| 源文档 | 方案蓝图 + 调研文档（见附录 A） |
| 技术调研结论 | 见第 3 章与附录 B（Web Speech / ts-fsrs 实测） |

---

## 一、项目概述

### 1.1 背景
8 岁孩子使用本 App 配合 Oxford Starlight Starter（菲教 1v1，每节 25 分钟，主攻听说）做课前预习。诊断显示：孩子课堂常"卡住、无法组织语言"，根因是家庭路线为「听 + 认单词」的纯输入型，缺**整句输入内化**与**被推动的口语输出**（Swain 输出假说 / Noticing Gap / 公式化语块理论）。本需求针对 **Starlight 主课程模块**做功能优化，把"整句积累 + 开口产出 + 拓展词纳入体系"落到 App 内，作为家庭训练系统的半边（另半边为家长侧动作，见范围 out）。

**本优化由两个核心诉求驱动（即 MVP 范围）**：① **词汇拓展**——老师课堂拓展词纳入 SRS/跟读/框架体系（对应 E 项）；② **提高小孩课堂输出能力**——逐句跟读（B 项）+ 句子框架卡（C 项）。**A（FSRS 内核替换）与 D（课文点读）为效率增强项，不阻塞 MVP**，在核心功能上线后按需补强。

### 1.2 目标（可度量）
- **G1 课堂句子输出**：每课后家长回传"能用目标句型说出整句数"，8 周内单课 ≥3 整句占比相对基线提升（基线由首次回传建立）。
- **G2 拓展词预习覆盖**：老师每课拓展词课后录入率 ≥90%（家长录入 `starlightExtensions`）。
- **G3 产出练习可及性**：跟读模式在目标设备（桌面 Chrome / Edge）原生可运行（Web Speech Recognition 内建，STT 无需降级引擎）；仅当 STT 不可用（离线/无麦克风）时走「家长确认」降级，不中断流程。
- **G4 复习个性化**：FSRS 替换 Leitner 后，难词召回频次相对固定间隔提升（官方宣称同等留存工作量降 30–40%）。
- **G5 纯前端零运维保持**：不依赖任何后端/API Key（数据仅 localStorage、TTS 离线 Kokoro/WebSpeech、STT 原生 Web Speech Recognition），零运维、零费用。

### 1.3 范围
- **In（按 MVP 核心排序）**：
  - **【MVP 核心】词汇拓展（E）+ 输出能力（B 逐句跟读、C 句子框架卡）**：直接对应「词汇拓展 + 提高小孩输出能力」两大核心诉求，优先交付。
  - **【后续增强】SRS 内核替换（A / FSRS）、课文点读（D）**：提升复习效率与整句输入内化，非 MVP 必需，核心功能上线后按需补强。
- **Out**（不在本需求，仅作建议）：flyguy / rocketgirl / chinese / eng3a 模块；菲教课堂本身与"请老师逼整句"对齐（家长侧动作）；little fox 跟读改造 / basic reading 单词挂框架（路线层改造，非 App）。

---

## 二、术语与缩写

| 术语 | 含义 |
|---|---|
| Starlight | Oxford Starlight Starter 教材，本项目主课模块（12 单元 96 课） |
| SRS | Spaced Repetition System，间隔重复系统 |
| Leitner | 当前 SRS 实现，7-box 固定间隔（`BOX_INTERVALS=[0,1,2,4,7,14,30]`） |
| FSRS | Free Spaced Repetition Scheduler，ML 训练的个性化调度算法（ts-fsrs 实现） |
| Sentence Frame | 句子框架，如 "I want a ___."，填空位替换词保框架 |
| Formulaic Sequence | 公式化语块，口语流利度底层单位（整句当一块存） |
| Shadow Reading / 跟读 | 听原句→开口复述→反馈的产出练习 |
| TTS | Text-To-Speech，语音合成。本项目实际链路：英文=Kokoro(WebGPU 神经,**默认开启**)→有道→WebSpeech；中文=Edge TTS(仅 Edge)→有道→WebSpeech（见 §3.1(d)） |
| STT | Speech-To-Text，语音识别。本 App 采用浏览器原生 Web Speech Recognition（Chrome / Edge 内建，见 §3.1(a)） |
| Web Speech API | 浏览器原生语音接口，含 `SpeechRecognition`(STT) 与 `SpeechSynthesis`(TTS 兜底) |
| Kokoro | 浏览器内 WebGPU 神经 TTS（onnx-community/kokoro-82m-v1.0-onnx，~80MB 懒加载，默认 `af_heart` 美音），英文自然度佳、离线无 key；**默认开启**（2026-09-29 选项 A 已实施，flag `starlight.kokoro.enabled` 默认 `true`；关闭：`starlight.kokoro.enabled=0`） |
| Noticing Gap | 注意缺口：真要开口才发现脑中无现成 schema |
| HashRouter | 本项目路由（GitHub Pages 兼容），非 BrowserRouter |
| PWA | Progressive Web App，本项目离线优先（vite-plugin-pwa） |

---

## 三、系统总体架构（含技术调研结论）

### 3.1 技术调研 pass（强制，决定文档厚度）
对方案具名技术的核实结果：

**(a) Web Speech Recognition（STT）— 兼容性（2026 实测）**
- **目标平台 Chrome / Edge：Full 支持**（前缀 `webkitSpeechRecognition`，识别走云端 Google/微软，需联网）。
- 其他浏览器（macOS Safari / Firefox / Android Chrome / 移动端）：**不在目标范围**，本方案不承诺兼容、不做降级引擎；仅在 STT 完全不可用（离线/无麦克风）时提供「家长确认」降级（见 D1）。
- **强约束**：必须运行在 **HTTPS 或 localhost 安全上下文**（GitHub Pages 满足）；识别**需联网**（音频上传云端）；`lang='en-US'` 配置。
- 注：方案 §12 曾误述"Safari 不支持"——实则 macOS Safari 14.1+ 已支持；但因目标平台已收窄为桌面 Chrome / Edge，该兼容性差异不影响本方案。

**(b) ts-fsrs（FSRS 调度）— API（实测）**
- 导入：`import { createEmptyCard, fsrs, Rating } from 'ts-fsrs'`。
- 初始化：`fsrs({ request_retention: 0.9, maximum_interval: 36500, enable_fuzz: true, enable_short_term: true, learning_steps: ['1m','10m'], relearning_steps: ['10m'] })`。
- `Card` 结构：`{ due: Date; stability: number; difficulty: number; elapsed_days: number; scheduled_days: number; learning_steps: number; reps: number; lapses: number; state: State; last_review?: Date }`。**注意 `due` 为 `Date` 对象**（方案 §2.3 误写为 `number`，需在调用边界做 `Date↔dayStamp` 互转）。
- `State` 枚举：0 New / 1 Learning / 2 Review / 3 Relearning。
- `Rating` 枚举：0 Manual / 1 Again / 2 Hard / 3 Good / 4 Easy。
- 调度：`scheduler.repeat(card, new Date())` 返回 4 档 what-if（`RecordLog`）；`scheduler.next(card, new Date(), Rating.Good)` 返回单档结果。
- 纯前端可行：ESM、零依赖、浏览器可打包（Vite 纳入即可），运行时无需 Node；Node 版本仅影响构建（官方文档要求 ≥20，旧文档 ≥16，以发包版 `engines` 为准）。

**(c) 现有可复用资产（工作区扫描）**
- `src/data/srs.ts`：`SrsCard`、`BOX_INTERVALS`、`scheduleNext`、`createNewCard`、`isDue`、`sortDueCards`。
- `src/store/useCourseStore.ts`：`recordReview / seedCards / getDueCards / getTodayDueCount / getTomorrowDueCount`，`persist({version:6, migrate})`。
- `src/components/SpeakButton.tsx` + `src/utils/speakerControl.ts`：`useAnimatedSpeak`、三层错误兜底（TTS 复用）。
- `src/data/starlight.ts`：`Word{en,zh,emoji,ipa}`、`Sentence{en,zh,hint}`、`Lesson{id,title,titleZh,words,sentences}`、`ModulePreview.keySentences: string`（未结构化）。
- `src/pages/SmartReview.tsx`（`contentIndex` 混排单词/句子卡）、`src/pages/LessonPreview.tsx`。

**(d) 现有 TTS 链路实测（纠正 AGENTS.md）**
- 真实调用链见 `src/utils/speakService.ts`：**英文** Kokoro(WebGPU 神经)→有道(`dict.youdao.com/dictvoice`)→WebSpeech；**中文** Edge TTS(仅 Edge 浏览器, 免费免密钥, zh-CN-XiaoxiaoNeural)→有道→WebSpeech。
- `kokoro.ts` 的 `readEnabledFlag()` 已于 2026-09-29 选项 A 改为**默认开启**（`starlight.kokoro.enabled` 默认 `true`，voice=`af_heart` 美音）。即默认英文即听 Kokoro 神经嗓，免费/离线/无 key；偶发静音可在控制台执行 `localStorage.setItem('starlight.kokoro.enabled','0')` 回落「有道→WebSpeech」。Kokoro 仅桌面 WebGPU 生效，无 WebGPU 设备自动落回原链路。
- 启示：「英文示范声机械」已由选项 A 解决（默认开 Kokoro），**无需引入任何云端语音服务**——纯前端 TTS（Kokoro 离线神经嗓 + WebSpeech 兜底）已满足目标平台需求。

**(e) 云端语音（豆包/火山引擎等）评估结论：不予采纳（2026-09-29 调研，同日收敛）**
- 调研确认豆包 TTS/ASR 为 WebSocket 双向流式、需 `X-Api-Key`；且**所有官方 demo 均后端中转**（key 安全 + CORS，浏览器不能直连），须 Cloudflare Worker 等代理隐藏 key、引入费用与联网依赖。
- **不予采纳理由**：① 目标平台已收窄为桌面 Chrome / Edge，Web Speech Recognition 原生可用、Kokoro 神经 TTS 离线可用，无跨浏览器痛点；② 引入 key/费用/代理违背 G5「零运维零后端」定位；③ 豆包为**中文系模型**，英文音色地道度未经实测、未必优于 Kokoro 专用 en-US 嗓音。
- **结论**：放弃 premium 语音层，TTS=Kokoro(默认开)+WebSpeech、STT=原生 Web Speech Recognition，纯前端满足需求。本节保留为决策追溯（详见附录 B）。

### 3.2 运行形态与数据流（ASCII）
```
                  src/data/lessons.ts (Lesson{words,sentences,frames?,passage?})
                        + 课堂拓展词(运行时录入, store.starlightExtensions)
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
  【SRS 持久化】              【课文点读】              【跟读/产出】
  src/data/srs.ts            TappableText.tsx          SentenceReader.tsx
  + fsrs.ts (A)              (D)                       (B, 净增 STT)
  SrsCard{kind,FSRS字段}     点词→释义+朗读            原句TTS→STT识别→反馈
        │                           │                           │
        └───────────┬───────────────┴───────────────────────────┘
                    ▼
        useCourseStore (recordReview→gradeCard / seedCards / getDueCards)
        persist version 7 + migrate (A 的 v6→v7，与 E 合并批次)
                    │
                    ▼
        SmartReview.tsx（单词卡识别 + 句子卡产出 + 框架填空）
        LessonPreview.tsx（单词/句型/跟读/课文/拓展词 五区）
```

### 3.2.1 语音引擎（纯前端，无 premium 层）
- **TTS**：Kokoro(英文,**默认开启**,仅桌面 WebGPU, `af_heart` 美音) → 有道 → WebSpeech 兜底；中文 Edge TTS(仅 Edge) → 有道 → WebSpeech（见 §3.1(d)）。全部离线、无 key。
- **STT（跟读）**：浏览器原生 Web Speech Recognition，目标平台 Chrome / Edge 内建，无需降级引擎。
- 目标平台为桌面 Chrome / Edge，无需跨浏览器语音代理；若 STT 不可用（离线/无麦克风），走「家长确认」降级（见 D1/FR-B6）。

### 3.3 核心交互流（跟读产出）
`LessonPreview 跟读 tab` → `SentenceReader` 播原句(TTS) → 孩子点「开始跟读」→ `useSpeechRecognition` 监听 → `onResult` 文本 → 归一化比对原句(去标点/冠词容错) → 逐词高亮 + 相似度% → 达标(`≥阈值`)点亮✅并 `recordReview(frameKey,true)` 进 SRS；不达标循环；`supported=false`/失败 → 「家长确认」手动记对。

---

## 四、User Scenarios

- **US-1（Why）**：家长希望孩子课前对当课句型"长在嘴边"，上课从"第一次开口"变"表演"。→ 对应 B/C/E。
- **US-2（Why）**：老师课上拓展的蔬菜词不在 App，孩子遇词没底。→ 对应 E。
- **US-3（Why）**：现有复习只认单词不练整句，与"课堂卡壳"根因错配。→ 对应 A(内核)+B/C(产出)。
- **Independent Test / Acceptance（P1 优先）**：US-2(E) 最小可独立验证；US-1 的 B/C 依赖 SrsCard 扩展（A 内核）；US-3 的 A 独立可测（调度行为）。

---

## 五、功能需求

### 5.1 通用需求（FR-C0）
| 编号 | 需求 | 说明 |
|---|---|---|
| FR-C0.1 | 纯前端零后端 | 不引入任何后端/API Key；数据仅 localStorage；TTS 离线（Kokoro/WebSpeech）、STT 原生 Web Speech Recognition；零运维、零费用 |
| FR-C0.2 | 验证纪律 | 改 SRS 调度=改常数，先跑 `npm run test`；结构性改 SrsCard 需同步确认 Progress/计数/migrate |
| FR-C0.3 | 兼容守卫 | 任何 STT 入口先 `supported` 探测，否则降级且不报错 |
| FR-C0.4 | 数据隔离 | 拓展词独立存 `starlightExtensions`，不污染静态 `lessons.ts` |

### 5.2 A. FSRS 替换 SRS 内核（FR-A*）
- **FR-A1 调度内核**：引入 `ts-fsrs`，`recordReview(en, correct, module)` 用 `scheduler.next(card, now, correct?Rating.Good:Rating.Again)` 替代 `scheduleNext`。
- **FR-A2 扩展 SrsCard**：新增 FSRS 字段（`stability/difficulty/due[Date内部]/elapsed_days/scheduled_days/learning_steps/reps/lapses/state`）+ `kind:'word'|'sentence'`；保留 `box/reviews/streak/lastReview/nextReview` 作为**派生兼容字段**（由 `state+stability` 反推），不改动旧 UI 读取。
- **FR-A3 到期判定**：`isDue`/`getDueCards`/`getTodayDueCount` 改用 `c.due <= today`（dayStamp 比较）。
- **FR-A4 迁移**：`persist` version 6→7（与 E 合并批次）；旧 Leitner 卡按 `box` 估算初始 `stability=[0,0.5,1,2.5,5,8,14,30][box]`、`difficulty` 线性、`state=Review`、`due=nextReview`、`lapses=box===0?1:0`；旧数据无 `starlightExtensions` 补 `{}` 不崩。

**FR-A 输入参数表**
| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| card | SrsCard(含 FSRS 字段) | 是 | 当前卡；调用 ts-fsrs 前 `due` 由 dayStamp 转 `Date` |
| now | Date / dayStamp | 是 | 评分时刻；统一用 `dayStamp()` |
| rating | Rating(1..4) | 是 | `correct?Good:Again`（当前 UI 仅二元，Hard/Easy 暂不用） |
| request_retention | number(0–1) | 否 | 默认 0.9 |
| maximum_interval | number(天) | 否 | 默认 36500 |

- **FR-A5 数据规范**：存储 `due` 用 dayStamp（number），与 ts-fsrs 的 `Date` 在调用边界互转（`new Date(dayStamp*86400000)` / `Math.floor(date.getTime()/86400000)`）。
- **FR-A6 性能阈值**：`getDueCards` 在 ≤2000 卡规模下 <16ms（UI 不卡）。
- **FR-A7 可视化兼容**：`boxLabel/boxEmoji` 继续可用（用反推 box）。

### 5.3 B. 逐句跟读模式（FR-B*，净增 STT）
- **FR-B1 STT hook**：`useSpeechRecognition({lang:'en-US', onResult})` — `supported` 守卫、`interimResults=true`、`continuous=false`、卸载自动 abort、错误回调（no-speech/not-allowed/network）。
- **FR-B2 跟读组件**：`SentenceReader` — 播原句(TTS)→「开始跟读」→ 识别 → 归一化比对（小写/去标点/去冠词 a,the 容错）→ 逐词高亮 + 相似度%(Jaccard/Levenshtein) → 达标✅。
- **FR-B3 反馈阈值**：默认 `≥60%`（儿童发音宽容），可调；不达标循环「再说一次」。
- **FR-B4 降级**：`supported=false` 或识别失败/无网 → 显示「家长确认」按钮手动记对，流程不中断。
- **FR-B5 产出入 SRS**：跟读达标 → `recordReview(en_sentence, true, 'starlight')`（与 C 共用 SrsCard 扩展）。

**FR-B 输入参数表**
| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| sentence | Sentence / frame(已填) | 是 | 跟读原句 |
| lang | string | 否 | 默认 'en-US' |
| threshold | number(0–1) | 否 | 默认 0.6 |
| onResult | (text:string)=>void | 是 | 识别回调 |

- **FR-B6 性能/兼容**：STT 需 HTTPS+联网（音频上传云端）；目标平台 Chrome / Edge 原生支持；不阻塞主线程；离线时走「家长确认」降级。

### 5.4 C. 句子框架卡（FR-C*）
- **FR-C1 框架类型**：`SentenceFrame{pattern:string(含"___"填空位), blanks:[{options:string[]}], zh, hint?}`，把 `ModulePreview.keySentences:string` 改为 `keyFrames:SentenceFrame[]`（或 `lessons.ts` 每课 `frames`）。
- **FR-C2 卡片扩展**：`seedSentenceFrames(frames, module)`；句子卡 `en=hash(pattern)` 与单词卡隔离。
- **FR-C3 渲染**：`SmartReview` 对 `kind==='sentence'` 卡翻面后显示「说出整句」→ `SentenceReader` 随机填一个 blank 候选让孩子产出 → 达标 `recordReview(frameKey,true)`。

**FR-C 输入参数表**
| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| pattern | string | 是 | 含 "___" 占位 |
| blanks[].options | string[] | 是 | 取自本课 words.en / 同单元拓展词 |
| module | ModuleId | 是 | 来源标记 |

### 5.5 D. 课文点读（FR-D*）
- **FR-D1 数据**：`Lesson.passage?:string`（课文对话原文，从教材 PDF 提取，复用 `scripts/`）。
- **FR-D2 组件**：`TappableText` — 按词切分；每词可点（朗读 + 弹释义查 `Word/bookDict`）；词按 `SrsCard.box` 着色（已知绿/模糊黄/未知灰）；点整句整句朗读。

**FR-D 输入参数表**
| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| passage | string | 是（有则渲染） | 课文原文 |
| wordIndex | Map<word, SrsCard> | 否 | 着色映射 |

### 5.6 E. 课堂拓展词融合（FR-E*）
- **FR-E1 模型**：`useCourseStore.starlightExtensions: Record<lessonKey, Word[]>` + `addExtensionWord(lessonKey, w)` / `removeExtensionWord(lessonKey, en)`；`lessonKey='${unitSlug}-${lessonId}'`。
- **FR-E2 录入 UI**：`LessonPreview` 每课「➕ 加词」→ 弹卡（en 必填 + zh/emoji 选填兜底）→ `addExtensionWord` 并 `seedSrsCard(en,'starlight')` → 列表带「拓展」badge + 删除（家长复核）。
- **FR-E3 融合**：拓展词自动进 A 复习、B 跟读（单词复述+填句）、C 框架 blank 候选、D 点读词索引；UI 用「拓展」badge 区分来源。
- **FR-E4 隔离/合并**：独立存 `starlightExtensions`，不污染 `lessons.ts`；复习/框架/点读合并呈现。

**FR-E 输入参数表**
| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| lessonKey | string | 是 | 课标识 |
| w.en | string | 是 | 拓展词（空不允许提交） |
| w.zh / w.emoji | string | 否 | 自动查 bookDict/有道兜底，默认 📝 |

---

## 六、非功能需求

| 类别 | 要求 |
|---|---|
| 性能 | `getDueCards` ≤2000 卡 <16ms；跟读识别反馈 <1s 感知延迟 |
| 兼容 | 目标平台 桌面 Chrome / Edge（WebGPU 跑 Kokoro、Web Speech 原生）；必须 HTTPS/localhost；STT 需联网 |
| 可复现 | FSRS 调度确定性（同输入同输出）；migrate 旧数据升级无丢失、无重复 |
| 可维护 | 严守 AGENTS.md 验证纪律；改动共用代码先问；`srs.test.ts` 覆盖 FSRS 行为 |
| 可扩展 | `kind`/`frame` 字段预留，后续可加 Hard/Easy 评分与复习档位（调研 #3.3） |
| 安全/隐私 | 无 API Key / 无后端；麦克风权限仅在跟读时申请；拓展词家长录入复核；核心数据仅本机 localStorage |
| 语言/UX | 儿童友好中文 UI（大字号、明亮色）；语音 lang=en-US；先求整句再求准确 |

---

## 七、数据需求

### 7.1 数据字典
| 实体 | 关键属性 |
|---|---|
| SrsCard | en, kind('word'\|'sentence'), frame?, FSRS{due(Date内部/存dayStamp), stability, difficulty, elapsed_days, scheduled_days, learning_steps, reps, lapses, state(0-3)}, box(派生), reviews/streak/lastReview/nextReview(派生), modules:ModuleId[] |
| Word | en, zh, emoji, ipa |
| Sentence | en, zh, hint |
| SentenceFrame | pattern(含"___"), blanks:[{options:string[]}], zh, hint? |
| Lesson | id, title, titleZh, words[], sentences[], frames?[], passage? |
| starlightExtensions | Record<lessonKey, Word[]> |
| ModulePreview | keyFrames:SentenceFrame[]（替代 keySentences:string） |
| FSRS 枚举 | State:0 New/1 Learning/2 Review/3 Relearning；Rating:0 Manual/1 Again/2 Hard/3 Good/4 Easy |

### 7.2 存储方案
- **方案 A（采用）**：zustand `persist` 单 key（现有），`partialize` 增 `starlightExtensions`；`migrate` v6→v7。单孩数据量小（≤2000 卡），单 key 足够。
- **方案 B（备选，不采）**：分片多 key / 云端同步（调研 #3.3 GitHub 同步）——跨设备需求，独立后续项，须保持零服务器成本，不在本需求。

---

## 八、难点与技术攻坚点（按 ★ 排序）

- **D1（★★）STT 联网依赖与降级**：目标平台 Chrome / Edge 原生支持 Web Speech Recognition，无需跨浏览器降级；唯一风险是**需联网**（音频上传云端）。攻坚：M0 验证 `supported` 守卫 + 「家长确认」闭环 + 联网检测；离线/无麦克风时 `supported` 置否，走「家长确认」手动记对，不中断复习。难度由 ★★★ 降为 ★★（已收敛到单平台）。
- **D2（★★★）FSRS 与 Leitner 数据迁移**：旧 `box/nextReview` 缺 FSRS 字段；`due` Date↔dayStamp 互转；旧 UI 读 `box` 派生兼容。攻坚：migrate v6→v7 按 box 估 stability；保留派生字段；`srs.test.ts` 断言迁移完整 + FSRS 行为。
- **D3（★★）跟读评分准确性**：纯前端文本相似度，儿童发音不准易误判。攻坚：阈值放宽(≥60%) + 逐词高亮 + 家长确认兜底；不评发音只评词覆盖。
- **D4（★★）句子框架结构化**：`keySentences` 字符串→`SentenceFrame[]`，12 单元框架手工建模 + blank 候选生成（取自本课/拓展词）。攻坚：抽 3–4 框架/单元，先 Unit4 玩具试点。
- **D5（★）课文点读数据生产**：`passage` 从教材 PDF 提取（复用 `scripts/`），词索引着色映射。攻坚：先 1–2 课试点，验证切词+着色。
- **D6（★）拓展词数据质量**：儿童录入拼写错。攻坚：删除按钮 + 家长复核；zh/emoji 缺走 bookDict/有道兜底；同课去重。

---

## 九、基础设施与资源

| 项 | 内容 |
|---|---|
| 软件环境 | Node ≥20（构建）、Vite6、TS5.8、React18、Zustand、Tailwind |
| 平台账号 | GitHub Pages（部署，已满足 HTTPS 安全上下文） |
| 依赖库 | `ts-fsrs`（MIT，零依赖，浏览器可打包）；Web Speech API（原生，无库，STT）；`react-speech-kit` 思路（仅参考封装，TTS/STT 守卫） |
| 硬件/网络 | 麦克风（跟读）；STT 需联网（音频上传云端）；TTS 离线（Kokoro/WebSpeech）；目标设备需 WebGPU 以跑 Kokoro（否则落回 WebSpeech） |
| 不引入 | 任何后端/数据库（Lute/Echoic 的 Python/FastAPI、Supabase）、任何 API Key、任何云端语音（豆包/火山引擎等）——与纯前端零运维定位冲突；语音全部本地（Kokoro/WebSpeech/Web Speech） |

---

## 十、里程碑（风险前置）

| 阶段 | 层级 | 任务 | 验收要点 |
|---|---|---|---|
| **M0** | 【MVP 核心·先验证】 | E：拓展词录入 UI + `starlightExtensions` + seed 进 SRS | 录 broccoli→队列带「拓展」角标；退出重进仍在；删除生效 |
| **M1** | 【MVP 核心·B 前置】 | STT 能力探测与原型：B 的 `useSpeechRecognition` + `supported` 守卫 + 离线降级 | Chrome / Edge 跑通；离线/无麦克风时「家长确认」降级不崩；联网检测 |
| **M2** | 【MVP 核心】 | B：SentenceReader + 逐词高亮 + 反馈（用 M1 原型）+ 现有 Kokoro TTS 示范 | 跟读达标✅入 SRS；不达标循环；降级可用 |
| **M3** | 【MVP 核心】 | C：SentenceFrame 建模 + `SrsCard.kind` + `seedSentenceFrames` + SmartReview 句子卡分支（复用 B 跟读交互） | 框架卡可播种/复习，不影响单词卡；填空说整句可评分 |
| **M4** | 【后续增强】 | A：FSRS 内核 + migrate v6→v7 + 旧 UI 兼容；验证 `due` Date↔dayStamp 互转 | 旧 v6 数据升级无丢失；`npm run test`+`check`+`build` 通过；连续 Good 间隔递增、Again 回当天 |
| **M5** | 【后续增强】 | D：Lesson.passage + TappableText + 课文区 + 全链路 `e2e` | 点读出释义+朗读；词状态着色正确；e2e 不回归 |

> **MVP 实施顺序**：M0（E 词汇拓展，数据入口）→ M1（STT 探测）→ M2（B 跟读）→ M3（C 框架卡）。A/D 在 MVP 验收后作为增强迭代。

---

## 十一、验收标准汇总（Given/When/Then，8–10 条）

1. **【迁移】** Given 旧 v6 localStorage；When 载入新版本；Then 卡片升级无丢失、box 派生正确、`getDueCards` 正常。
2. **【FSRS 调度】** Given 一张卡；When 连续 Good；Then `due` 间隔递增；When Again；Then 回当天；难度随 Again 上升。
3. **【拓展词录入】** Given LessonPreview Unit4；When 点「加词」录 broccoli；Then 立即出现在复习队列带「拓展」角标；退出重进仍在。
4. **【拓展词删除】** Given 已录 broccoli；When 家长删除；Then 队列与 `srsCards` 同步移除。
5. **【框架卡产出】** Given Unit4 框架 "I want a ___." 随机填 car；When 孩子说 "I want a car." 达标；Then `recordReview` 成功且单词卡不受影响。
6. **【跟读主流程】** Given 一句型；When 播原句→孩子跟读；Then 逐词高亮 + 相似度% + 达标✅。
7. **【跟读降级】** Given STT 不可用（离线/无麦克风）；When 进入跟读；Then 显示「家长确认」按钮，手动记对，流程不中断。
8. **【跟读离线】** Given 无网络；When 触发 STT；Then 提示需联网或降级，不崩溃。
9. **【课文点读】** Given 含 passage 的课；When 点词；Then 朗读 + 弹释义；未知词灰、熟词绿（按 box）。
10. **【边界】** Given 重复录同词 / 空 en / 旧版无 `starlightExtensions`；When 操作；Then 不翻倍 / 不允许提交 / 不崩。

---

## 附录

### 附录 A：原始需求对照
| 原始诉求（方案蓝图） | 本需求章节 |
|---|---|
| A FSRS 替换内核 | FR-A / D2 / M0 |
| B 逐句跟读 | FR-B / D1,D3 / M1,M4 |
| C 句子框架卡 | FR-C / D4 / M3 |
| D 课文点读 | FR-D / D5 / M5 |
| E 课堂拓展词融合 | FR-E / D6 / M2 |
| 方案 §12 评估（三空白+优先级） | 见下「评估呼应」 |

**评估呼应（来自方案 §12）**：本需求覆盖 App 半边（B/C/E 直击根因、A 为内核、D 为输入内化）。§12 指出的三空白——G1 真实课堂不受 App 控制（菲教对齐/角色扮演/little fox 改造，见范围 out，需家长并行）、G2 无效果验证闭环（建议每课后家长回传，G1 度量承接）、G3 优先级错位（本需求里程碑已按问题驱动重排为 M0 内核→M1 STT→M2 E→M3 C→M4 B→M5 D）——均已在本文以范围/目标/里程碑形式回应。

### 附录 B：参考链接（技术调研源）
- Web Speech Recognition 兼容：MDN `SpeechRecognition`；cobaltcapture 支持矩阵；AssemblyAI Web Speech API 教程；testmu.ai 兼容表（2026 实测：macOS Safari 14.1+ 已支持 `webkitSpeechRecognition`，Firefox 不支持，需 HTTPS+联网）。
- ts-fsrs：官方文档 `open-spaced-repetition.github.io/ts-fsrs/`；DeepWiki `ts-fsrs` 2.2 数据模型 / 2.3 调度方法；GitHub `open-spaced-repetition/ts-fsrs`。
- 现有资产：本仓库 `src/data/srs.ts`、`src/store/useCourseStore.ts`、`src/components/SpeakButton.tsx`、`src/utils/speakerControl.ts`、`src/data/starlight.ts`、`src/pages/SmartReview.tsx`、`src/pages/LessonPreview.tsx`。
  - 豆包/火山引擎接入调研（GitHub, 2026-09-29，**已否决**）：确认 TTS/ASR 为 WebSocket 双向流式、需 `X-Api-Key`、官方 demo 均后端中转、须 Cloudflare Worker 隐藏 key——因目标平台收窄为桌面 Chrome/Edge、且违背零运维定位，**不采纳**（见 §3.1(e)）。仅供参考，不实现。

### 附录 C：与方案 §12 的事实修正
- 方案 §12 风险 G3 原写"Safari 不支持（跟读主药在 iPad 失效）"——经第 3 章调研核实**不准确**：macOS Safari 14.1+ 已支持 `webkitSpeechRecognition`，真实风险降级为"一致性弱 + 需联网 + Firefox 不支持"。本文第 3.1(a)、第 6 章兼容、D1 已按准确事实表述。另：用户确认无 iPad/移动端，目标设备为桌面 WebGPU，故 STT 兼容聚焦桌面浏览器。
- 方案 §2.3 将 FSRS `due` 写为 `number(dayStamp)`——实测 `Card.due` 为 `Date`，本文 FR-A5 明确 `Date↔dayStamp` 互转边界。
  - 方案/AGENTS.md 称 TTS 为「`speechSynthesis` + 有道兜底」——经读 `speakService.ts` **不准确**：实际为英文 Kokoro(WebGPU 神经)→有道→WebSpeech、中文 Edge TTS(仅 Edge)→有道→WebSpeech。本文 §3.1(d) 已按真实链路表述。**Kokoro 已于 2026-09-29 选项 A 默认开启**（`readEnabledFlag` 默认 `true`，voice=`af_heart`），「机械音」问题已解决；语音全本地、无云端 premium 层（目标平台仅桌面 Chrome/Edge，§3.1(e) 已否决豆包等云端语音）。AGENTS.md 那句 stale TTS 描述仍待修正（用户未确认）。
