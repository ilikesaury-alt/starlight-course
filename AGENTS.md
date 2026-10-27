# Starlight English Learning App - Agent Instructions

## Project Overview
- **Type**: Pure frontend PWA (no backend)
- **Stack**: React 18 + TypeScript 5.8 + Vite 6 + Zustand + Tailwind CSS
- **Purpose**: English learning tool for preschool/elementary children, paired with Oxford Starlight Starter textbook

## Essential Commands
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build (tsc -b && vite build)
npm run lint         # ESLint check
npm run check        # TypeScript type check (no emit)
npm run preview      # Preview production build on 0.0.0.0
npm run test         # Vitest unit tests (src/**/*.test.ts only)
npm run e2e          # Playwright E2E tests (tests/*.spec.ts)
npm run electron:dev    # 桌面壳开发态（并发起 vite + electron，自动探测 dev server）
npm run electron:smoke  # 桌面壳冒烟探针（构建 + 加载 + 程序化验验收标准，输出 JSON）
npm run electron:build  # 打包 Windows NSIS 安装包（产物在 release/）
```

**Testing**: Unit tests use vitest (e.g. `src/data/srs.test.ts`); E2E uses Playwright (`tests/*.spec.ts`, `npm run e2e`). Vitest is configured in `vite.config.ts` (`test.include: src/**`) so it never collects the Playwright specs.

## Architecture
- **State**: Zustand store (`src/store/useCourseStore.ts`) with localStorage persistence
- **Data**: Static course data in `src/data/` (96 lessons across 12 units)
- **SRS Algorithm**: Leitner 5-box system in `src/data/srs.ts` for spaced repetition
- **Routing**: HashRouter (not BrowserRouter) for GitHub Pages compatibility
- **PWA**: Service Worker via vite-plugin-pwa, offline-first with Workbox

## Key Conventions
- **Path alias**: `@/*` maps to `./src/*` (configured in tsconfig.json)
- **Theme**: Custom Tailwind colors (sun, sky2, mint, coral, paper, ink, coffee)
- **Fonts**: `font-cute` (ZCOOL KuaiLe) for playful UI, `font-sans` (Noto Sans SC) for body
- **Animations**: Custom keyframes (wiggle, float, pop, rise, sparkle, confetti)
- **Error handling**: Triple-layer protection for speechSynthesis errors (global catch + SafeBoundary + component try/catch)

## Build & Deploy
- **CI**: GitHub Actions on push to main → GitHub Pages
- **Base path**: Auto-configured via `GITHUB_REPOSITORY` env var in vite.config.ts
- **PWA assets**: Generate with `npm run pwa-assets` (requires public/favicon.svg)

### Desktop (Electron)
- **壳**: `electron/main.cjs` —— 业务代码**零改动**，只开窗口加载同一份前端产物：dev server 可达则载它，否则载 `dist/index.html`。`--smoke` 模式程序化验证「非白屏 / WebGPU / localStorage / 云 TTS」后退出
- **打包**: `scripts/electron-build.mjs` —— 设 `ELECTRON_BUILD=1`（vite 输出相对 `base: './'`，file:// 才不白屏）→ 前端构建 → electron-builder 出 NSIS；国内镜像（`ELECTRON_MIRROR` / `ELECTRON_BUILDER_BINARIES_MIRROR`）默认注入，可用同名 env 覆盖
- **双形态隔离**: 桌面构建时 `VitePWA` 用 `disable: process.env.ELECTRON_BUILD === '1'`（**不是**从 plugins 数组摘掉，否则 `virtual:pwa-register` 虚拟模块解析失败）；另有 `src/main.tsx` 的 UA 守卫跳过 SW 注册。网页版构建照常含 `sw.js`
- **⚠️ 未开「开发者模式」的 Windows 打包必失败**（winCodeSign 包内含 macOS `.dylib` 软链，7-Zip `-snld` 建链被拒）：`electron-build.mjs` 会预先用 `7za` 解压到 `Cache/winCodeSign/winCodeSign-2.6.0` 并**排除 `darwin`/`linux`**（Windows 只需 `signtool`/`rcedit`），幂等、可自愈
- **STT 在 Electron 必挂**（需 Google 语音后端）：无需处理，`useSpeechRecognition` 的 `supported` 守卫 + 跟读 Tab 默认隐藏天然兜住
- **WebGPU 不可用是常态**（老核显/虚拟机拿不到适配器）：自动退回云 TTS/WebSpeech，**不静音**（验收标准 #3）

## Development Notes
- TypeScript strict mode is **disabled** (`strict: false` in tsconfig.json)
- No Prettier config - code formatting is not enforced
- ESLint uses react-hooks and react-refresh plugins
- `react-dev-locator` babel plugin included for development debugging
- Speech synthesis goes through `src/utils/speakService.ts` — a **bounded fallback chain** (never recursive, never dead-loops), with a per-request hard budget so a play button can never hang:
  - 英文: **Kokoro**(神经 TTS，**默认关闭**，需显式开启) → 云 TTS（`playYoudaoResilient`：**整句先百度、单词先有道**） → WebSpeech
  - 中文: **Edge TTS**(仅 Edge 且已预热) → 云 TTS（**百度恒优先**） → WebSpeech
  - **Kokoro 默认关闭，英文走「有道 → WebSpeech」（1~3s 出声）**。这是 2026-10-09 实测后**反转**过的判断，别再凭「神经音色更好」打开它：
    - 实测大量机器 WebGPU 拿不到适配器（老 Intel 核显 2016 驱动、**无 `vulkan-1.dll`**、远程桌面 / 虚拟机）→ 只能退 CPU；
    - CPU 上 82M 参数模型实测**每个单词 7~9 秒**。幼儿点读等不了（会在第一个词出声前点掉五六个），还要叠加首次 88MB 下载；
    - 历史上默认开过，代价是「前几次能响、模型就绪后反而哑火」（见 `fa71ee6`）
    - 想要神经音色：控制台 `localStorage.setItem('starlight.kokoro.enabled','1')` + 刷新。**前提是先把核显驱动更新到支持 Vulkan**，否则等于主动选择 7~9s 的延迟
  - **Kokoro 开启后的可靠性措施**（`engine/kokoro.ts`，保留以便将来驱动更新后直接可用）：
    - **WASM 推理必须放 Worker**（`kokoro.worker.ts`）：onnxruntime-web 在主线程是**同步**跑的，实测一个单词冻结主线程 **5957ms**（基线 111ms）。连带后果是「页面很卡」+「等几秒才发音」+「喇叭 ⏸ 动画完全不出现」——最后一条最误导：`setPlaying(true)` 确实执行了，但**重绘也要主线程**，线程冻住就一帧都画不出来。搬进 Worker 后冻结降到 **0ms**，音质不变。WebGPU 推理本身在 GPU/异步队列上，不阻塞 UI，故仍留主线程
    - **`'gpu' in navigator` 是假阳性**：必须 `probeWebGPUAdapter()` 真 `requestAdapter()` 一次，拿不到就**别下那 86MB**
    - **多模型源 + 停滞看门狗**：`huggingface.co`（国内实测 connect 20s 超时 / 0.47 MB/s）与 `hf-mirror.com`（1.78 MB/s 稳定）按序尝试。⚠️ **故意不按「探测延迟」选源**：直连源对 44 字节文件要 2.4~2.6s 才回，但拉 86MB 有 1.6 MB/s —— 小文件慢 ≠ 大文件慢，按延迟选会把好源误判成坏源
    - **绝不能让 `loadingPromise` 永久挂着**：原实现加载卡住时它一直非空，`warmupKokoro()` 每次都早退，模型整场会话停在「未就绪」且**不报任何错**。现在失败会释放它并退避 60s 允许重试
    - **首屏就预热**（`App.tsx`）：模型可用性直接决定「点单词有没有声音」，等点下去才下载会让人误以为功能坏了
  - **慢设备自适应（2026-10-09 手机实测一个单词 5~6s、整句 20~60s）**：Kokoro 生成有**按词数放宽的时间预算**（`generateBudgetMs`，6s 基础 + 2s/词、封顶 20s；离线备份场景放宽到 30s），超时判 failed 直接降级云 TTS；生成成功但 >5s 也会把本会话标记为**慢设备**（`isKokoroSlow`）—— 之后 Kokoro 退到云 TTS **之后**只当断网备份（云端 2~3 秒能出声就没必要让孩子干等）。诊断面板显示 `🐢 慢（退到云后）`
    - 该阈值**对 WASM 同样适用且是必需的**：CPU 上每词 7~9s 必然超阈值 → 第一次慢就把 Kokoro 降到云 TTS 之后，后续点击回到 1~3s。曾给 WASM 开过 30s「免判慢」的特例，等于让每次点击都死等 9 秒，是错误的判断（已撤销）。WASM 只是**生成预算**更宽（`wasmBudgetMs`：12s 基础 + 4s/词、封顶 45s），好让第一次能跑完并完成这次「测速」
  - **跟读区的开麦兜底**：`useSentenceReader` 等示范 `onEnd` 开麦，另有 `PHASE_TIMEOUT_MS=12s` 保险 —— 到点先 `cancelSpeech()` 停掉还没播完的示范再开麦，绝不让流程卡在一声不响的等待上，也不让迟到音频盖在孩子跟读上
  - **有道不是通用 TTS**（实测 `dict.youdao.com`）：单词稳定，整句约 **65% 返回 HTTP 500**，中文几乎只回**同一段 48ms 空白音频**（不同文本字节完全相同）。所以它只能当「锦上添花」，句子发音的真正底线是云 TTS + 设备自带的 WebSpeech —— 这条链路必须保证任何设备（含手机）都能出声
  - **百度云 TTS 是「句子没声」的解药**（`engine/baidu.ts`，实测 `fanyi.baidu.com/gettts` 整句 8/8、中文 3/3 返回真实音频，TTFB ≈ 480ms）。⚠️ **带非百度的 Referer 就回 0 字节 `text/html`**（`Origin` 头无害、`Referer` 有罪），所以 `index.html` 必须保留 `<meta name="referrer" content="no-referrer">` —— 删掉它 `<audio>` 会拿到空 HTML（`MEDIA_ERR_SRC_NOT_SUPPORTED`），整句重新变静音。百度也没有 CORS 头，只能 `<audio>` 直连播放、不能 `fetch` 成 blob（统一走 `playUrl`）
  - **空白音频 = 失败**：`playUrl` 把时长 < 200ms 的片段判 `failed`（而非 `onended` 就当成功），否则兜底链会停在静音上、后面所有引擎都不再发声，表现为「点了完全没声音」且无任何报错
  - **整段（按序双引擎）→ 分片（同序双引擎）→ 原生兜底**（`playYoudaoResilient`）；连续拿不到有效音频时熔断 60s，**只跳过有道**（百度与原生照常），避免每句都白等一串必然失败的请求。借道别的引擎出声时结果带 `via`，诊断面板按实际引擎记名
  - **原生合成器是最后一级，必须传 `lastResort: true`**：无视「假死冷却期」每次都真试一次。冷却期只用于省掉空转；若在最后一级照常硬判失败，就会出现「前一句还能响、之后整段静默」
  - Kokoro 默认开启（`kokoro.ts` 的 `readEnabledFlag()` 返回 `true`）；偶发「模型就绪但推理中途失败 → 回退跨域音频被自动播放策略拦截」时，控制台执行 `localStorage.setItem('starlight.kokoro.enabled','0')` 并刷新即可回到稳定链路
  - `SpeakButton` 只是 `speakService` 的 UI 封装，**播放逻辑不在组件里**
- 听写入口 (`/dictation`) 是**难度阶梯**，不是「选玩法」：
  - ① 先认 · 三选一（**默认停在这里**）→ ② 再拼 · 搭积木（链到 `/alphablocks`，虚线框表示「去别处练」）→ ③ 后写 · 听音写词。
  - 家长设置（只练错题本 / 单元 chips / 词的长短）收进 `<details class="dt-parent-box">` **默认收起**。
  - 为什么：原来的「玩法 + 范围 + 长短」是 4 组连续决策，6~9 岁做不了；`mode` 默认值从 `spell` 改成 `choice` 也是这个原因 —— **音-写不同步阶段要先练认**，一上来从 26 个字母里凭空拼等于先懵一遍。
  - e2e 因此要显式选模式：`tests/dictation.spec.ts` 的 `chooseSpell()` / `openParentSettings()` 两个 helper 就是干这个的，改入口结构时同步改它们。
- **「先数一数」（`DictationPlayer` 的 `.dt-count`）是音-写不同步阶段的关键桥**：
  - 听音写词每个词进场时逐个亮出「这个词有 N 个音」，**只数数量，绝不显示字母或概念标签** —— 显示字母就等于给答案，只剩抄写。
  - 真正的教学价值在**音数 ≠ 字母格数**：`show` 是 2 个音 / 4 个字母（`sh`+`ow`）、`mother` 是 4 个音 / 6 个字母（`th`+`er`）。孩子看到「2 个音要填 4 格」就自己悟到字母小队，不需要先讲概念。
  - 面板只在 `status==='idle' && !input.trim() && mode==='spell'` 时出现：开始打字就让位，答错后由警告横幅和音素格子接管，不堆杂物。
- Speaking: STT is the native `SpeechRecognition` API via `useSpeechRecognition` (no back-end, no API key). Judgement is fully automatic: the engine's alternatives are all scored (best match wins), transient failures (`no-speech`/`aborted`/`network`) auto-re-listen up to 2 times, and only on terminal failure does the child get a **跳过这句** button — there is no 家长确认 path
- 「🗣️ 跟读」Tab **默认隐藏**（`LessonPreview` 的 `SHOW_SPEAK_TAB = false`）：麦克风跟读在目标设备上用不上，五个标签也太挤。这只是收起入口 —— 渲染分支、`SentenceReader`、`useSentenceReader`、自动换句播放全部原样保留，把 flag 改回 `true` 即恢复（同时把 `tests/starlight-zones.spec.ts` 里 `跟读区（降级闭环）` 的 `describe.skip` 改回 `describe`）。句子仍会在打开课时照常 `seedCards` 进复习池，隐藏 Tab 不影响 SRS
- Target platform: **desktop Chrome / Edge on Windows** (WebGPU for Kokoro, localhost for the mic secure context). Firefox / Safari / mobile are not committed to
- Star rules: `src/utils/stars.ts` is the single source of truth — `quizStars` (all correct = 5, ≥80% = 3, participated = 1) and pass check (`isPassed`: ≥80%)
- SRS: `src/data/srs.ts` holds card types + Leitner-compat derived fields, `src/data/fsrsScheduler.ts` holds the FSRS kernel (ts-fsrs). FSRS state lives in the nested `SrsCard.fsrs`; `box/nextReview/streak` are derived and kept in sync for the old UI
- Extensions: `src/data/extensionTopics.ts` is a hand-curated theme word bank (52 themes, ~630 en/zh/emoji words) covering all 96 lessons — no open RAZ dataset exists (Reading A-Z is copyrighted), so the bank is maintained by hand. **`EXT_LIMIT = 5` words per lesson** (hard cap, shared by auto-fill and manual entry). `suggestExtensions()` picks by theme, drops lesson words + already-added words, and rotates by `round` so 「换一批」 really changes the batch. Auto-fill runs **once per lesson** when the list is first empty; `store.extensionRound` remembers the round so deleting words never triggers a refill
- Sentence frames: `src/data/sentenceFrame.ts` holds 98 hand-written fill-in-the-blank frames — **every one of the 96 lessons has at least one**, so 「🧩 句型」 never shows 「这一课还没有句型框架卡。」 (that empty state existed while coverage was 2 cards per 12 units). Frames are seeded into the shared review pool **only when the lesson is opened** (`seedSentenceFrames` in `LessonPreview`), so the pool grows with study progress instead of pre-occupying review seats. `frameZh` supports **single blanks only** (`zhOptions` holds whole-sentence Chinese — a template swap produces broken Chinese), and a few lessons whose every sentence is an "A or B?" choice use a **zero-blank** card where the child reads the whole sentence. `sentenceFrame.test.ts` machine-checks the invariants, including that filling in the correct answer reproduces a sentence the lesson actually teaches (that check caught two pilot frames hung on the wrong lesson)

- Phonics: `src/data/phonics.ts` 的音素切分口径**对齐《字母积木》(Alphablocks / BBC CBeebies) 的教学分级** —— 孩子正在看的动画是这套片，app 必须跟动画对得上号，否则提示反而干扰：
  - L1-2 单字母 / L3 字母小队（两三个字母合成一个音：`ch`/`ai`/`igh`/`ar`/`er`…）/ L4 手拉手（辅音簇各发各的音：`st`/`bl`/`-nd`）/ L5 魔法E（`e` **单独成格**、自己不发声、但让前面元音发长音）/ 特别篇双写（`ll`/`ss`/`ff` 合成一个音）
  - 旧口径有四处**正好教反了**（2026-10 已改，别回退）：① 魔法E 的 e 被吐进前一格（`cake → c/a/ke`）且自相矛盾（`cake` 吐 e、`blue` 留 e）；② 双写被拆成两格（旧注释写「按一个音处理」但代码给了两格）；③ 字母小队只认 15 个，`ar/or/er/ir/ur/igh` 全缺（`father → f/a/th/e/r`）；④ 完全没有「手拉手」概念
  - 2026-10-27 又修四处（别回退）：⑤ `thr` 不是手拉手——th 自己是小队，`three → th/r/ee`（积木库的 `three` 已从绿级挪到黄级）；⑥ 词尾 e 是**唯一元音**时必须发音（`the/she/he/me/we/be`，旧口径标成不发音是语音学错误）；⑦ `two` 的 w、`listen` 的 t 不发音，进 OVERRIDES；⑧ `orange` 的 `nge` 不是一个音（n/g 各发各的、e 不发音），进 OVERRIDES
  - **魔法E 的 e 必须是独立的一格**（动画里 E 是一块会飞的独立积木），不能并入前一格
  - 切分是**规则优先 + 例外兜底**：规则判不了的英语不规则词走 `OVERRIDES` 人工表（`welcome`/`picture`/`orange`/`umbrella`/`people`…），不引入发音词典
  - ⚠️ 短音词不吃魔法E（`come`/`have`/`love`/`one` 结尾的 e 不发音）—— 用**词表**判定而不是后缀规则（后缀会把 `stone` 误判成短音 `one`）
  - ⚠️ 多词词条按**空格分段**后再逐词切，否则 `next to` 的 `t t` 会被误判成双写 `tt`、`is my` 的 `s m` 会被误判成手拉手
  - 不变量：**所有片段拼起来 === 原词字母序列**（`phonics.test.ts` 钉住；e2e 靠 `.dt-box-text` 拼答案）
  - 改规则时先用真实词表跑一遍：`src/data/eng3a.ts` 里 229 个词，旧口径有 47% 退化成逐字母拆分，新口径降到 32%

- Alphablocks 练习 (`/alphablocks`)：看完《字母积木》动画的“练稳固”入口。**词源不用 eng3a 课程词，而是一份专用词库 `src/data/alphablocks.ts`** —— 孩子看的是动画，要练的必须是动画里出现的词，才能和画面里的词对上号（课程词继续走 `/dictation`，互不干扰）。
  - 词库按动画官方五级（红橙黄绿蓝）+ 特别篇双写分组，每级对应一个教学点；单测 `alphablocks.test.ts` **强制校验词库与教学点匹配**（黄级每词必须含 team、绿级必须含 blend、蓝级大部分含 magic-e、特别篇必须含 double）
  - ❗**候选积木堆必须真洗牌**：早期实现的 `shuffleStable()` 直接 `return list`，导致正确块总按答案顺序排在前面，孩子从左往右点就对了 —— 练习完全失效。e2e A4 盯着这条
  - ❗**判定必须按位置不按文本**：`tight → t/igh/t`、`nine → n/i/n/e` 有重复块，只比文本的话孩子把第 3 位的 `t` 先点上去也算对。现在用 `usedPoolIdx`（已用块下标）+ 比对“下一个所需块”来判，e2e A7 盯着这条
  - 复用 `phonemeSegments` 的概念分类给积木配色/标签；星规复用 `quizStars`；错词回灌错题本与 SRS，`module='alphablocks'`（已加入 `ModuleId` 联合类型，不新增持久化字段，因此 **无需升 localStorage version**）

## File Structure
```
src/
├── components/     # Layout, SpeakButton, SafeBoundary + 跟读/框架卡/点读/拓展词录入
├── pages/         # page components (Home, LessonPreview, SmartReview, etc.)
├── hooks/         # useSettleQuiz(结算) / useSpeechRecognition(STT) / useSentenceReader(跟读编排)
├── data/          # 课程内容(starlight.ts, lessons.ts) + sentenceFrame.ts(句型框架) + extensionTopics.ts(拓展词主题库) + srs.ts / fsrsScheduler.ts
├── utils/         # stars.ts(星规) / similarity.ts(跟读评分) / reviewQueue.ts(复习配额) / speakService + engine/(youdao·baidu·webSpeech·kokoro·edgeTts)
└── store/         # Zustand state management (含 starlightExtensions 拓展词 + extensionRound 填充轮次)
```

## Common Pitfalls
- **PWA caching**: Service Worker may cache old versions; use `skipWaiting: true` config
- **Speech errors**: speechSynthesis throws async errors that can crash React 18; global handlers prevent this
- **GitHub Pages**: HashRouter required; direct URL routing won't work without server config
- **localStorage**: User progress persists across sessions; clear via store.resetAll() or browser dev tools