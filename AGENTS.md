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
- Speaking: STT is the native `SpeechRecognition` API via `useSpeechRecognition` (no back-end, no API key). Judgement is fully automatic: the engine's alternatives are all scored (best match wins), transient failures (`no-speech`/`aborted`/`network`) auto-re-listen up to 2 times, and only on terminal failure does the child get a **跳过这句** button — there is no 家长确认 path
- 「🗣️ 跟读」Tab **默认隐藏**（`LessonPreview` 的 `SHOW_SPEAK_TAB = false`）：麦克风跟读在目标设备上用不上，五个标签也太挤。这只是收起入口 —— 渲染分支、`SentenceReader`、`useSentenceReader`、自动换句播放全部原样保留，把 flag 改回 `true` 即恢复（同时把 `tests/starlight-zones.spec.ts` 里 `跟读区（降级闭环）` 的 `describe.skip` 改回 `describe`）。句子仍会在打开课时照常 `seedCards` 进复习池，隐藏 Tab 不影响 SRS
- Target platform: **desktop Chrome / Edge on Windows** (WebGPU for Kokoro, localhost for the mic secure context). Firefox / Safari / mobile are not committed to
- Star rules: `src/utils/stars.ts` is the single source of truth — `quizStars` (all correct = 5, ≥80% = 3, participated = 1) and pass check (`isPassed`: ≥80%)
- SRS: `src/data/srs.ts` holds card types + Leitner-compat derived fields, `src/data/fsrsScheduler.ts` holds the FSRS kernel (ts-fsrs). FSRS state lives in the nested `SrsCard.fsrs`; `box/nextReview/streak` are derived and kept in sync for the old UI
- Extensions: `src/data/extensionTopics.ts` is a hand-curated theme word bank (52 themes, ~630 en/zh/emoji words) covering all 96 lessons — no open RAZ dataset exists (Reading A-Z is copyrighted), so the bank is maintained by hand. **`EXT_LIMIT = 5` words per lesson** (hard cap, shared by auto-fill and manual entry). `suggestExtensions()` picks by theme, drops lesson words + already-added words, and rotates by `round` so 「换一批」 really changes the batch. Auto-fill runs **once per lesson** when the list is first empty; `store.extensionRound` remembers the round so deleting words never triggers a refill
- Sentence frames: `src/data/sentenceFrame.ts` holds 98 hand-written fill-in-the-blank frames — **every one of the 96 lessons has at least one**, so 「🧩 句型」 never shows 「这一课还没有句型框架卡。」 (that empty state existed while coverage was 2 cards per 12 units). Frames are seeded into the shared review pool **only when the lesson is opened** (`seedSentenceFrames` in `LessonPreview`), so the pool grows with study progress instead of pre-occupying review seats. `frameZh` supports **single blanks only** (`zhOptions` holds whole-sentence Chinese — a template swap produces broken Chinese), and a few lessons whose every sentence is an "A or B?" choice use a **zero-blank** card where the child reads the whole sentence. `sentenceFrame.test.ts` machine-checks the invariants, including that filling in the correct answer reproduces a sentence the lesson actually teaches (that check caught two pilot frames hung on the wrong lesson)

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