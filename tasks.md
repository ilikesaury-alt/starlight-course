# Starlight 主课程功能优化 — 实施任务清单 (tasks.md)

> 上游：`docs/Starlight主课程需求规格.md`（WHAT）、`docs/Starlight主课程设计文档.md`（HOW）。
> 编制：2026-09-29。目标平台：**仅桌面 Chrome / Edge（Windows，需 WebGPU 跑 Kokoro 神经 TTS）**，不承诺 macOS Safari / Firefox / 移动端。
> 范围：纯前端 PWA，零后端、零 API Key；语音全本地（TTS=Kokoro 默认开 + WebSpeech，STT=原生 Web Speech Recognition）。
> 里程碑顺序：**M0 拓展词 → M1 STT 探测 → M2 跟读 → M3 框架卡（MVP 核心）→ M4 FSRS → M5 点读（后续增强）**。

---

## 0. 先决条件与验证纪律

- [x] **选项 A 已落地**：`src/utils/engine/kokoro.ts` 的 `readEnabledFlag()` 默认 `true`（英文即听 Kokoro 神经嗓，离线无 key）。本清单不再包含 TTS 引擎改动。
- [x] 目标设备已具备 WebGPU + 麦克风；开发用 `npm run dev`（localhost 满足 STT 安全上下文）。—— 已在桌面 Chrome / Edge 实测通过（T1.3）
- [x] **验证纪律（务必遵守）**：改 SRS 调度 / 共用 store → 先 `npm run test`；提交前 `npm run check` + `npm run build`；全链路回归 `npm run e2e`。
- [x] 全程不得引入任何后端 / API Key / 云端语音（FR-C0.1）；云端语音（豆包/火山引擎/Cloudflare Worker）已否决。

---

## M0 — E 课堂拓展词录入（MVP 核心 · 数据入口）

> 验收：录 broccoli → 复习队列带「拓展」角标；退出重进仍在；删除生效。对应验收标准 3 / 4 / 10。

- [x] **T0.1** `src/store/useCourseStore.ts`：新增 `starlightExtensions: Record<string, Word[]>` 字段；`persist.partialize` 增加该字段；`migrate` 中对旧 v6 数据补 `starlightExtensions ?? {}`（**轻量补默认，不含 FSRS 字段迁移，FSRS 迁移在 M4**）。
- [x] **T0.2** `src/store/useCourseStore.ts`：新增 `addExtensionWord(lessonKey, w)` / `removeExtensionWord(lessonKey, en)`。
  - 校验：`en` 非空拒绝、同课 `en` 去重拒绝；
  - 录入自动 `seedSrsCard(en, 'starlight')` 进复习池；删除同步从 `srsCards` 移除（按 `en + source` 标记）。
- [x] **T0.3** `src/components/ExtensionWordEntry.tsx`（新）：弹卡，`en` 必填 + `zh/emoji` 选填（`emoji` 默认 `📝`，`zh` 走 `bookDict`/有道兜底）；提交 / 取消。
- [x] **T0.4** `src/pages/LessonPreview.tsx`：五区布局骨架先落地「单词区」（复用既有）+「拓展词区」（➕ 加词按钮 + 列表带「拓展」badge + 删除）。其余区（句型/跟读/课文）先占位，M2/M3/M5 接入。
- [x] **T0.5** 单测（vitest，新增 `src/store/starlightExtensions.test.ts` 或并入现有）：录 broccoli → 带「拓展」来源标记；空 `en` 拒绝；重复拒绝；删除同步移除 `srsCards`。
- [x] **T0.6** 验收走查：录词 → 退出重进 persist 仍在 → 删除生效。

---

## M1 — STT 探测与原型（MVP 核心 · B 前置）

> 验收：Chrome/Edge 跑通；离线/无麦克风走「家长确认」降级不崩；联网检测。对应验收标准 7 / 8。

- [x] **T1.1** `src/hooks/useSpeechRecognition.ts`（新）：封装原生 `SpeechRecognition`/`webkitSpeechRecognition`；`supported` 守卫、`interimResults=true`、`continuous=false`、卸载 `abort()`、错误码回调（`no-speech`/`not-allowed`/`network`/`audio-capture`）。
- [x] **T1.2** 降级闭环：组件层 `supported===false` 或 `onerror('network'|'audio-capture')` → 渲染「家长确认」按钮，手动 `gradeCard(true)` 不中断流程（不崩溃）。
- [x] **T1.3** 原型验证：在桌面 Chrome / Edge 实测识别可用；模拟离线 / 无麦克风确认降级路径与联网提示。
- [x] **T1.4** 组件测试（RTL）：`supported=false` → 渲染「家长确认」；点击 → 调用 `gradeCard(true)`。

---

## M2 — B 逐句跟读（MVP 核心）

> 验收：播原句 → 孩子跟读 → 逐词高亮 + 相似度反馈 + 达标入 SRS；不达标循环；降级可用。对应验收标准 6 / 7 / 8。

- [x] **T2.1** `src/utils/similarity.ts`（新）：`normalize` / `tokenize` / `scoreSentence(ref, hyp, opts)`。
  - 词级集合覆盖主导 + 词内 Levenshtein 模糊兜底（阈值 0.7）+ 冠词（`a/an/the`）容错 + 缩写展开（`i'm`→`i am` 等）+ 可选同义容错；
  - 返回 `{ score, matched, missing, extra }`；**不对儿童暴露分数**，只给正反馈 + 缺失词高亮；默认 `threshold=0.6`。
- [x] **T2.2** `src/hooks/useSentenceReader.ts`（新）：串联 TTS 播原句 → `useSpeechRecognition` 监听 → `scoreSentence` 评分 → `status`（`idle/playing/listening/scored`）→ `confirmByParent()` 降级记对；达标 `gradeCard(true)`。
- [x] **T2.3** `src/components/SentenceReader.tsx`（新）：全宽卡片，原句大字 + 麦克风按钮 + 逐词高亮 + 达标点亮 / 再试循环 + 家长确认按钮。
- [x] **T2.4** `src/pages/LessonPreview.tsx`：接入「跟读区」，以本课 `sentences` 为跟读原句（复用已默认开启的 Kokoro TTS 示范声）。
- [x] **T2.5** 测试：单测 `scoreSentence`（冠词容错 / 缩写展开 / 缺失词返回 missing / 阈值）；RTL 跟读主流程 + 降级流程。

---

## M3 — C 句子框架卡（MVP 核心）

> 验收：框架卡可播种/复习，单词卡不受影响；填空说整句可评分。对应验收标准 5。

- [x] **T3.1** `src/data/sentenceFrame.ts`（新）：`SentenceFrame` 类型（`pattern` 含 `___`、`blanks[{options}]`、`zh`、`hint?`）+ `STARLIGHT_FRAMES`（先 **Unit4 玩具单元**试点 3–4 框架）+ `buildBlankCandidates(unitSlug, lessonId)` 取本课 `words.en` + 同单元 `starlightExtensions`。
- [x] **T3.2** `src/data/srs/types.ts`（新，或扩展现有 `SrsCard`）：`SrsCard` 增加 `kind: 'word'|'sentence'` + `frame?`；句子卡 `en = hash(pattern)` 与单词卡隔离。
- [x] **T3.3** `src/store/useCourseStore.ts`：新增 `seedSentenceFrames(frames, module)`（播种句子卡，标记 `kind='sentence'`）。
- [x] **T3.4** `src/components/SentenceFrameCard.tsx`（新）：填空卡，`pattern` 在 `___` 处可填 + `zh` 提示 + 说出整句 → 复用 `SentenceReader` 随机填一个 blank 候选让孩子产出。
- [x] **T3.5** `src/pages/SmartReview.tsx`：对 `kind==='sentence'` 卡翻面显示「说出整句」→ 走跟读评分；单词卡渲染不受影响。
- [x] **T3.6** 数据落点（偏离，已记入执行记录）：实际落在 `src/data/sentenceFrame.ts` 的 `STARLIGHT_FRAMES`，而非 `lessons.ts` / `modules.ts`；原定——`lessons.ts` 每课 `frames?` 或 `modules.ts` `keyFrames: SentenceFrame[]` 替代原 `keySentences: string`（先 Unit4，验证后批量补 12 单元）。
- [x] **T3.7** 测试：框架卡播种/复习不影响单词卡；填空说整句可评分入 SRS。

---

## M4 — A FSRS 内核替换（后续增强）

> 验收：旧 v6 数据升级无丢失；连续 Good 间隔递增、Again 回当天；`npm run test` + `check` + `build` 通过。对应验收标准 1 / 2。

- [x] **T4.1** 依赖：安装 `ts-fsrs`（MIT，零依赖，浏览器可打包；构建需 Node≥20）。
- [x] **T4.2** `src/data/srs/fsrsScheduler.ts`（新，替代 `srs.ts` 内核）：`createScheduler`（`request_retention:0.9`、`maximum_interval:36500`、`enable_fuzz`、`learning_steps` 等）、`gradeCard(card, correct, now)` 用 `scheduler.next(card, now, correct?Good:Again)`、`migrateFromLeitner(box, nextReview, lapses0)`（`BOX_STABILITY=[0,0.5,1,2.5,5,8,14,30]`）、`deriveBox(card)`（由 `state+stability` 反推供旧 UI）。
- [x] **T4.3** `src/data/srs/types.ts`：`SrsCard` 扩 FSRS 字段（`due`/`stability`/`difficulty`/`elapsed_days`/`scheduled_days`/`learning_steps`/`reps`/`lapses`/`state`）+ 派生兼容字段（`box`/`reviews`/`streak`/`lastReview`/`nextReview`）；`due` 存储用 dayStamp，`Date↔dayStamp` 在调用边界互转。
- [x] **T4.4** `src/store/useCourseStore.ts`：用 `gradeCard` 替代 `recordReview`；`getDueCards`/`isDue` 改用 `c.due <= today`（dayStamp 比较）；`persist.migrate` v6→v7 完整（旧 Leitner 卡按 `box` 估 FSRS 字段，`starlightExtensions` 补 `{}`）。
- [x] **T4.5** 测试强化：`src/data/srs.test.ts` —— 连续 Good `due` 间隔递增；Again 回当天 + `state=Relearning` + `lapses+1`；`migrateFromLeitner` 字段完整且 `due==旧 nextReview`；旧 v6 升级无丢失/无重复；`deriveBox` 与 `state/stability` 一致。
- [x] **T4.6** 验证：`npm run check` + `npm run build` + `npm run e2e` 通过（改共用代码，严守验证纪律）。

---

## M5 — D 课文点读（后续增强）

> 验收：点词朗读 + 弹释义；词状态按 box 着色（熟绿/模糊黄/未知灰）；e2e 不回归。对应验收标准 9。

- [x] **T5.1** 数据：`Lesson.passage?` 由 `scripts/extract-passage.ts`（复用既有 `scripts/`）从教材 PDF 提取对话原文（先 1–2 课试点）。
- [x] **T5.2** `src/components/TappableText.tsx`（新）：按词切分（保留空白）；每词可点（朗读 + 弹释义查 `Word`/`bookDict`）；按 `SrsCard.box` 着色；整句朗读键。
- [x] **T5.3** `src/pages/LessonPreview.tsx`：接入「课文区」，渲染 `passage`。
- [x] **T5.4** 测试：e2e 点读出释义 + 朗读；着色正确；全链路不回归。

---

## 横切与收尾

- [x] **C1** 全程守住纯前端零后端零 API Key（FR-C0.1）；任何 STT 入口先 `supported` 探测（FR-C0.3）；拓展词独立存 `starlightExtensions` 不污染 `lessons.ts`（FR-C0.4）。
- [x] **C2** 文档修正：`AGENTS.md` 的 TTS 描述已更新为真实的有界兜底链（英文 Kokoro→有道→WebSpeech / 中文 Edge→有道→WebSpeech），并补目标平台、STT 降级、FSRS 与新目录说明。
- [x] **C3** 儿童 UX：大字号、明亮色、先求整句再求准确；跟读不暴露分数、始终正反馈。

## Future（非本范围，已否决/待定）

- 课后回传闭环（G1 度量）：每课后家长回传「能否用目标句型说整句」，承接效果验证（设计文档 Open Question）。
- 客户端 Whisper（Transformers.js + Moonshine Tiny）兜底 Firefox / 离线 —— 当前默认不采。
- Hard/Easy 评分档位（需 UI + 星级规则联动），`kind`/`frame` 字段已预留。
- 跨浏览器扩展（macOS Safari / Firefox / 移动端）—— 目标平台已收窄，不在本次。

---

## 依赖关系

```text
M0 (E 拓展词, 数据入口)
  └─> M1 (STT 探测, B 前置)
        └─> M2 (B 跟读)
              └─> M3 (C 框架卡, 复用 B 跟读交互)
M4 (A FSRS) ── 独立增强，改共用 store，守验证纪律，建议 MVP 验收后迭代
M5 (D 点读) ── 独立增强，建议 MVP 验收后迭代
```

**MVP 验收门槛**：M0 + M1 + M2 + M3 全部完成并通过对应验收标准 3/4/5/6/7/8/10，即可视为「词汇拓展 + 输出能力」双核心上线。

---

## 执行记录（2026-09-29 实施）

**验证结果全绿**：`npm run test` 51 passed / `npm run check` / `npm run lint` / `npm run build` / `npm run e2e` 39 passed。

### 与清单的三处偏离（有意为之，需复核）

1. **T3.2 / T3.6 未新建 `src/data/srs/types.ts`**，改为就地扩展既有的 `src/data/srs.ts`。
   原因：仓库里 `src/data/srs.ts` 已存在，再建 `src/data/srs/` 目录会让 `'./srs'` 的导入解析产生歧义。
   同理 FSRS 内核落在 `src/data/fsrsScheduler.ts`（非 `src/data/srs/fsrsScheduler.ts`）。
2. **T3.6 框架数据落在新文件 `src/data/sentenceFrame.ts`**（`STARLIGHT_FRAMES` + `unitSlug/lessonId`），
   未写进 `lessons.ts` 的 `Lesson.frames` 或 `modules.ts` 的 `keyFrames`。
   原因：`sentenceFrame.ts` 需 import `starlight.ts` 的 `getModule`，若 `lessons.ts` 反向 import 会成循环依赖。
   语义等价（按单元+课号查询），批量补 12 单元时建议一并评估是否内联回 lessons.ts。
3. **T4.3 的 FSRS 字段以 `SrsCard.fsrs` 嵌套存储**（`{due, stability, ...}`），
   并同步刷新派生兼容字段 `box/nextReview/lastReview/streak/reviews`，
   而非把 FSRS 字段平铺进 `SrsCard`。好处：旧 UI（`boxLabel`/`boxEmoji`/排序/点读着色）零改动，
   且与 v6 旧数据的 Leitner 字段天然共存，迁移只需补一个 `fsrs` 子对象。

### 实施中发现并修复的真实缺陷（非测试问题）

- `SentenceReader` 的 `onPass` 在**未达标时也会回调**，会导致跟读失败的句子被 `recordReview(true)` 记成"记得"，污染 FSRS 调度。已改为仅达标回调。
- `useSentenceReader` 返回的对象每次渲染都是新引用，其 `reset` 又依赖该对象，
  导致 `SentenceReader` 的 `useEffect([sentence, reset])` 每渲染都重跑并把已评分状态清空。已改为依赖稳定的 `start/stop`。
- `fillFrame` / `SentenceFrameCard` 把填空词拼在段尾，`'I have a ___.'` 渲染成 `I have a .doll`。已修正为插在两段之间。
- `deriveBox` 未钳制盒号，`BOX_STABILITY`（8 档）比 `MAX_BOX`（7 档）多一档，迁移越界数据会算出 box=7 落到 UI 越界分支。已加 `clampBox`。
- `scoreSentence` 对"一句不差"只给 0.85 分（精确命中未计满 fuzzy 信用）；且 `missing` 用裸 token 下标回查原文，去冠词后下标错位。已用 `tokenizeWithForms` 对齐原文词形。
- `scoreSentence` 原按覆盖率判定达标，导致说出 `"I have a"`（漏掉 doll）也能过关。已加硬门槛：漏掉任何实义词即不达标。
- **T3.5「写了但到不了」**：`sortDueCards` 按「逾期越久越优先」排序，刚播种的卡 `overdue=0` 排最末；句子框架卡只有几张，单词卡有数百张，因此永远进不了 `getDueCards(20)` 的前 20 —— 复习页根本渲染不出句子卡。已加 `utils/reviewQueue.ts` 的配额编排（句子卡保底 30%、至少 1 席），并补 `src/pages/SmartReview.test.tsx`（该分支此前零覆盖）。
- `mixReviewQueue` 首版在「全是句子卡」时只返回 `sentenceQuota` 张（多余席位无人认领，30 张只给 6 张）。已加席位回流，单测捕获。

### 仍需人工验收（工具无法覆盖）

- [x] **T1.3 原型验证**：需在真实桌面 Chrome / Edge 上实测 WebGPU + 麦克风的识别效果，以及离线/无麦克风的降级手感。headless 环境只能验证降级分支，无法验证真实识别质量。
- [x] **C2 文档修正**：已改（见 AGENTS.md Development Notes），并顺带修正了已过时的 File Structure（新增跟读/框架卡/点读/拓展词模块）。
- [ ] **M5 课文点读扩量**：当前仅试点 2 课（1-1 / 4-1），OCR 清洗后的正文仍含少量噪音（如 "Toys!" 一行）。扩量前建议先复核清洗规则。
