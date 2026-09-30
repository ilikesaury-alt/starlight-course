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
  - 英文: **Kokoro**(WebGPU 神经 TTS，默认开，模型就绪时) → 有道 → WebSpeech
  - 中文: **Edge TTS**(仅 Edge 且已预热) → 有道(长文本分片) → WebSpeech
  - Kokoro 默认开启（`kokoro.ts` 的 `readEnabledFlag()` 返回 `true`）；偶发「模型就绪但推理中途失败 → 回退跨域音频被自动播放策略拦截」时，控制台执行 `localStorage.setItem('starlight.kokoro.enabled','0')` 并刷新即可回到稳定链路
  - `SpeakButton` 只是 `speakService` 的 UI 封装，**播放逻辑不在组件里**
- Speaking: STT is the native `SpeechRecognition` API via `useSpeechRecognition` (no back-end, no API key). Judgement is fully automatic: the engine's alternatives are all scored (best match wins), transient failures (`no-speech`/`aborted`/`network`) auto-re-listen up to 2 times, and only on terminal failure does the child get a **跳过这句** button — there is no 家长确认 path
- Target platform: **desktop Chrome / Edge on Windows** (WebGPU for Kokoro, localhost for the mic secure context). Firefox / Safari / mobile are not committed to
- Star rules: `src/utils/stars.ts` is the single source of truth — `quizStars` (all correct = 5, ≥80% = 3, participated = 1) and pass check (`isPassed`: ≥80%)
- SRS: `src/data/srs.ts` holds card types + Leitner-compat derived fields, `src/data/fsrsScheduler.ts` holds the FSRS kernel (ts-fsrs). FSRS state lives in the nested `SrsCard.fsrs`; `box/nextReview/streak` are derived and kept in sync for the old UI

## File Structure
```
src/
├── components/     # Layout, SpeakButton, SafeBoundary + 跟读/框架卡/点读/拓展词录入
├── pages/         # page components (Home, LessonPreview, SmartReview, etc.)
├── hooks/         # useSettleQuiz(结算) / useSpeechRecognition(STT) / useSentenceReader(跟读编排)
├── data/          # 课程内容(starlight.ts, lessons.ts) + sentenceFrame.ts(句型框架) + srs.ts / fsrsScheduler.ts
├── utils/         # stars.ts(星规) / similarity.ts(跟读评分) / reviewQueue.ts(复习配额) / speak* 语音
└── store/         # Zustand state management (含 starlightExtensions 拓展词)
```

## Common Pitfalls
- **PWA caching**: Service Worker may cache old versions; use `skipWaiting: true` config
- **Speech errors**: speechSynthesis throws async errors that can crash React 18; global handlers prevent this
- **GitHub Pages**: HashRouter required; direct URL routing won't work without server config
- **localStorage**: User progress persists across sessions; clear via store.resetAll() or browser dev tools