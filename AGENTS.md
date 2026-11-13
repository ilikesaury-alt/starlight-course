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
  - 英文: **微软神经语音**(`edgeNeural`，仅 Edge 浏览器可用，见下「微软神经语音」) → **Kokoro**(神经 TTS，**默认关闭**，需显式开启) → 云 TTS（`playYoudaoResilient`：**整句先百度、单词先有道**） → WebSpeech
  - 中文: **微软神经语音**(同上) → Edge TTS(旧 CDN 库) → 云 TTS（**百度恒优先**） → WebSpeech
  - **分段朗读**（`engine/segmentedSpeak.ts`）：传 `speakText(text, {segments, onSegment})` 时**一次合成整段**再播放，句间不插网络往返。这是「朗读不好听」里最被忽略的一半 —— 见下「分段朗读」
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
  - **微软神经语音**（`engine/edgeNeural.ts`，2026-11-02 新增）——**当前音质最好的引擎**，48kbps 神经音色（对比百度只有 24kbps/16kHz），中英文统一，句子自然连贯。⚠️ 但**只在 Edge 浏览器可用**，原因很硬：
    - 服务端（`speech.platform.bing.com` 的 WSS 合成接口）**校验 User-Agent 里的 `Edg/`**。2026-11-02 消融实验（每种组合都握手实测）：Edge UA → **101 握手成功**；Chrome UA → 403；无 UA → 403；**Origin / Cookie / Client Hints 全都无关**（普通网页 Origin 即可，不必伪装扩展）
    - **网页 JS 无法设置 User-Agent**（浏览器受禁头）→ Chrome/Firefox 必然 403。故 `canUseEdgeNeural()` 严格按 `/Edg\//` 判断 UA，Chrome 下**直接跳过该级**，不去白等一次失败握手
    - ❗**DRM 令牌必须是 v2 格式**：`<16 hex CS64>-<64 hex SHA256>` + `Sec-MS-GEC-Version=2-…`。旧 v1（64 位 hex + `1-`）自 2026-10 起**被服务端全面拒绝**。算法移植自 edge-tts(MIT) 的 `drm.py`（`engine/msGecV2.ts`），单测用 Edge 真实抓包向量逐字节校验（`generateSecMsGecV2(1791888000)` → `492D7694A183A45E-…`）。**别再退回 v1，也别用 CDN 上的 edge-tts-universal —— 它还在发 v1，必然 403**
    - **微软私有帧格式**（`extractMp3Payload`）：二进制帧 = `00 80` + 2 字节 MP3 同步字 + ascii 元数据头（以 `Path:audio\r\n` 结尾）+ MP3 数据。直接把整帧当 MP3 会多出前导 0x00 字节 → 播放器解码失败 → 「点了没声音」
    - ⚠️ **浏览器 WebSocket 的二进制帧是 Blob 不是 ArrayBuffer**：`new Uint8Array(ev.data)` 得到空数组。必须 `await ev.data.arrayBuffer()`
    - 端点无 CORS 头 → 只能 `<audio>` 直连播放，不能 `fetch` 成 blob（与其他引擎统一走 `playUrl`）
    - 实测性能：握手 0.8~1.6s，首音 1.0~1.7s，整句合成完 1.2~2.4s
  - **分段朗读**（`engine/segmentedSpeak.ts`）——「朗读不好听」里**最被忽略的一半**：逐句朗读的天然实现是「句1 合成→播放→句2 合成→播放…」，于是**每句之间插一次网络往返**（实测 TTFB 300~450ms/句），5 句话就有约 2 秒断点，听起来「一顿一顿」。实测同一段 5 句：逐句 = 14.9s（5 次往返）vs **合并一次合成 = 11.8s（1 次往返）**；百度在合并时还会压缩句间停顿，听感更连贯
    - 做法：先**并发**量出每句时长（实测 5 句并发 ≈ 567ms），再把整段合并成**一次**请求播放，用量出的时长当时间窗推进「当前句」高亮
    - ⚠️ **合并音频比逐段总长短约 30%**（实测合并 9864ms vs 逐段合计 14256ms）→ 时间窗必须**按比例缩放**到合并音频的实际时长，否则高亮越走越滞后
    - ⚠️ **`timeupdate` 必须在 audio 元素创建时挂**（`playUrl` 的 `onAudio` 回调里），不能等 `playUrl` 返回 —— 它的 `success` 是**播放结束**时才 resolve 的，那时再挂就永远收不到事件
    - 用法：`speakText(text, { segments: [...], onSegment: (i) => setNowIdx(i) })`。`ReadingZone` 的「听整篇」与 `Eng3aPlayScript` 的「朗读全剧」已改用此路径
  - **百度语速档位**（`engine/baidu.ts`）：原实现用 `spd=5`（最快），实测同句 spd=1~3 ≈ 3.0s、spd=4~5 ≈ 1.9s —— 对幼儿**偏快**。现已改为默认 `spd=2`、慢速朗读 `spd=1`
    - ⚠️ **慢速要用「源端慢速档」而不是「播放端慢放」**：慢放（`playbackRate=0.6`）有金属感与轻微变调，听着「不像人在说话」；源端 spd=1 是合成的自然慢速人声。「慢而自然」远好于「慢而糊」
    - 慢放只保留给**原生合成器**（`webSpeech` rate=0.6）—— 它没有「源端慢速」这个概念
  - **有道不是通用 TTS**（实测 `dict.youdao.com`）：单词稳定，整句约 **65% 返回 HTTP 500**，中文几乎只回**同一段 48ms 空白音频**（不同文本字节完全相同）。所以它只能当「锦上添花」，句子发音的真正底线是云 TTS + 设备自带的 WebSpeech —— 这条链路必须保证任何设备（含手机）都能出声
  - ⚠️ **英文音色不能用童声 AnaNeural**（2026-11-12 改掉，现用 `en-US-JennyNeural`）：
    - 症状：家长报「/alphablocks 的发音永远只能听到第一个字母」。查下来**音频没被截断** —— 8496 字节 / 59 帧 / 1.416s，播放范围 `[0, 1.368]` 全程，`turn.end` 后 `pendingFrames=0` 无丢帧
    - 根因：童声的词尾清辅音（/t/ /p/ /k/ /s/）又轻又短，经 48kbps 压缩后基本糊掉。孩子听到「ca…」而不是「cat」
    - 判据（可复现）：解码到 PCM，按 5~10ms 求 RMS 包络，看主峰衰减后**有没有二次爆破峰**。Ana 念 hat：主元音后单调衰减到静音，`burst/peak = 0%`；Jenny 同位置 `29.9%`（sit 20.6%、map 8.3%）。频谱图上 Jenny 在词尾有一道横跨全频段的竖条，Ana 没有
    - 为什么这件事对本项目是硬伤：`/alphablocks` 要孩子听出「这个词有几个音」，词尾听不见 = 音数数不对 = 整个模块失效
    - **换音色前先做上面这个量化验证，别凭「听起来还行」** —— 那正是当初选错 Ana 的原因（注释写着「清晰、语调平稳，适合幼儿跟读」）
    - 单测 `edgeNeural.test.ts` 已钉死 `VOICES.en.id` 不得匹配 `/AnaNeural/`
    - 顺带记录：微软服务端对单词会补约 **0.9s 尾部静音**（与 `sentenceBoundaryEnabled` 无关，实测开关两种都是 8928 字节）。只影响按钮「播放中」多停留一会儿，不影响听感
  - **Chrome 网页端拿不到神经音色**（2026-11-02 全面实测）：Google Translate TTS 国内**连接超时**；有道整句 500；搜狗/腾讯/讯飞/阿里/火山全部不可用；微软的 HTTP 合成接口全 404/403（只有 `voices/list` 可直连）。**唯一可用的是百度**（整句 12/12 成功，TTFB 385~925ms）。所以 Chrome 端的质量上限就是百度的 24kbps/16kHz —— 想再提升只能等微软放开 UA 校验
  - ⚠️ **Windows 上的原生合成器没有英文本地嗓音**（实测本机：只有 zh-CN Huihui/Kangkang/Yaoyao + en-US Google 远端）。Google 远端嗓音在国内 `speak()` 既不 onstart 也不 onerror（静默无回调）→ 英文句子的最终兜底**不可靠**，这也是「整句朗读必须有云 TTS 兜底」的原因
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
- 阅读短文（`src/data/reading/unit1..12.ts`，96 篇，每课一段 70~100 词）：**2026-11-02 起全部重写为「小故事」文体**，规格见 `docs/reading-passage-style.md`（含定稿样例 1-1/1-2 与 9 条文体要求）。旧版是互不相关的句子清单（例句集），新版每篇 = 完整因果链 + 对话推进 + 结尾回声余韵，段落 = 叙事节拍，中文同步改成温暖口语。**硬约束不变**（`readingPassage.test.ts` 8 条）：零超纲（`allowedWordsFor` 口径）、本课词 100% 出现、70~100 词 / 8~12 句 / 1~3 段、每句有中文、英文无中文标点、同篇无重复句
  - **改写/新增短文先读 `docs/reading-passage-style.md`**，再跑 `node scripts/check-reading.mjs N --stats`（N = 单元号）自验。❗这个脚本**不依赖 vitest/vite server**（只用 esbuild 现场打包 TS 再 import），**12 个 Agent 并行改写时不会互相抢 `node_modules/.vite` 缓存**导致假失败；单测 `readingPassage.test.ts` 仍是 CI 的唯一权威口径（用 `$env:READING_UNIT='N'` 只校验单单元）
  - `--brief` 模式打印该单元的**精确允许词表 + 逐课词表 + 本课句型**：`node scripts/check-reading.mjs N --brief`。写之前先看它，别凭感觉猜词
  - ⚠️ 常见超纲词（多个 Agent 栽过）：`by` `land` `lands` `orange` `first` `let` `end` `race` `full` `quiz` `winner` `grow` `sunny` `soon` `meow` `softly` `beautiful` `wonderful` `street` `seaside`
  - ⚠️ **多词词条可以如实写出来**（旧注释说「写不出来」是误判）：单测的「本课词 100%」是 `w.split(' ').every(part => fullText.includes(part))` —— 按空格拆开做**子串**匹配，不是拿整串比 token 集合；且 `sea/world/umbrella/tennis/merry/round/bumper/ferris/wheel` 早就在 `BASE_WORDS` 里。**不要为绕开多词词条而牺牲内容质量**
  - **第一册（Starlight 1）是另一套数据，别用上面的脚本/词表**：短文在 `src/data/starlight1/reading.ts`（Unit 1）与 `uN.ts` 的 `uN_reading`，9 单元 / 96 课全有短文。零超纲允许域真源 = `src/data/starlight1/readingVocab1.ts`（预备级 `BASE_WORDS` ∪ `BOOK1_EXTRA_WORDS` 教材角色名/口语词 ∪ 本单元课词表 ∪ 本单元课本原文 token）——第一册教材故事必须能写 Monty/Lola/Mr. Gnome 这些人物。校验器 `readingPassage1.test.ts`、自检脚本 `node scripts/check-reading1.mjs N --brief / --stats`、唯一口径实现 `validateReadingPassage1()`（生成与单测共用）。文体要求与预备级通用，见 `docs/reading-passage-style.md` 第 3 节
  - **外教课堂对话**：预备级 96 课在 `src/data/dialogue/unit1..12.ts`，门面 `lessonDialogue.ts`（`getLessonDialogue(unitId, lessonId)`，key 形如 `5-5`）；第一册 96 课在 `src/data/starlight1/dialogue/u1..9.ts`，独立门面 `starlight1/dialogue1.ts`（`getLessonDialogue1` / `LESSON_DIALOGUE1`）。**两册单元号都从 1 开始，必须按 level 分发**（`starlightSeriesData.ts` 的 `seriesDialogue`），直接按裸 unitId 查会串书。第一册校验器 `dialogue1.test.ts` + `node scripts/check-dialogue1.mjs N --brief / --stats`，唯一口径 `validateDialogue1()`：10~15 轮、T/S 都有、每轮 en+zh、英文无中文标点、无重复台词、本课词覆盖 ≥60%（对话有课堂用语，不像短文那样要求零超纲 / 100% 覆盖）
  - 阅读区视觉：`.reading-body` 是「书页」（暖纸色 + 斜向纤维纹 + 顶部丝带），`.reading-title` 居中带手写下划线；**两种排版模式**由 `.reading-zone.is-zh` 切换 —— 默认「流式散文」（句子 inline-block 连成一段），显示中文后切「逐句双语」（一句一行、译文紧跟其下）。改样式**不得破坏** e2e 契约（`tests/starlight-zones.spec.ts`）：类名一个都不能改、`.reading-sent` == `.reading-zh` == `.reading-say` 数量、译文必须在英文**下方**且与英文**左对齐**（偏差 < 6px）、`.tt-word` 默认透明底
  - ⚠️ **Rocket Girl 是阅读模块，不是故事闯关**（2026-11-13 重做，`be0c950`）：`/rocketgirl` = `RocketGirlHome` → `ReadingBook source={RG_READING_SOURCE} custom={RG_BOOK}`，与 `/reading` 共用白纸页 / hero / 通栏目录 / 展开见宝藏词 / 点一条就地展开 `ReadingZone` 的**同一套组件和流程**。RG 没有单词卡 / 闯关测验 / 标记本关完成 / 星数 / 128 本绘本馆 / 搜索 / Tab，`/rocketgirl/:slug` 只重定向回 `/rocketgirl`。`StoryHome` / `StoryPage` / `BookTextView` / `QuizEngine` **现在只服务 Fly Guy**，别按旧印象给 RG 加回去
    - `ReadingBook` 的 `custom` 覆盖项**全部可选**，不传就走原 Starlight 分支逐字节不变 —— 这是保住 `/reading`、`/reading1` 的 41 条 e2e 契约的机制。**不要**扩展 `StarlightLevel` / `STARLIGHT_LEVEL_ORDER` / `READING_PATHS`，也不要给 `.sl-series-tab` 加第三项（e2e 钉死恰好 2 项，RG 用面包屑代替切换条）
    - RG 的 108 集按标题冒号前共同前缀分成 **27 个故事弧 × 4 集**，弧 = 「单元」、集 = 「课」。数据适配在 `src/data/rocketgirlReading.ts`：`rgPassageOf` **必须返回稳定引用**（`ReadingZone` 的 `useEffect([passage])` 会因引用变化 `cancelSpeech()` 掐断朗读）——按 key 缓存，别每次现算新对象
    - RG 没有绘本正文（0/108 有 `bookText`），读的是**词条例句**（每集 ≤10 句），文案一律写「这一集的例句」，绝不标成「绘本原文 / 小故事」；128 本 PDF 是用户本地版权材料（435MB，已 gitignore），**不要抽取/提交**
    - 查词链 `lookupRgZh`（bookDict → RG 自动词表 → 词形回退）是 **RG 专属独立文件**，别倒进 `BOOK_WORD_ZH`（后者被 `bookQuiz.ts` 用来挑挖空候选，会改变 Fly Guy / Starlight 出题分布）；查不到的长尾靠 `TappableWords` 的 `sentenceZh` 整句中文兜底
    - `completedStories` 持久化字段**保留但 RG 页不再读/写**（不删字段、不升 store version，避免迁移）。首页 / `Progress` / `TodayTasks` 的 RG 文案是静态数量，不伪造「已读/已通关」进度

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
├── utils/         # stars.ts(星规) / similarity.ts(跟读评分) / reviewQueue.ts(复习配额) / speakService + engine/(youdao·baidu·webSpeech·kokoro·edgeTts·edgeNeural·msGecV2·segmentedSpeak)
└── store/         # Zustand state management (含 starlightExtensions 拓展词 + extensionRound 填充轮次)
```

## Common Pitfalls
- **PWA caching**: Service Worker may cache old versions; use `skipWaiting: true` config
- **Speech errors**: speechSynthesis throws async errors that can crash React 18; global handlers prevent this
- **GitHub Pages**: HashRouter required; direct URL routing won't work without server config
- **localStorage**: User progress persists across sessions; clear via store.resetAll() or browser dev tools