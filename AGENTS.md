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
```

**No test framework exists** - project has no test scripts or test files.

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
- Speech synthesis uses browser API with Youdao TTS fallback (see `src/components/SpeakButton.tsx`)

## File Structure
```
src/
├── components/     # Layout, SpeakButton, SafeBoundary
├── pages/         # 14 page components (Home, Preview*, Review*, SmartReview, etc.)
├── data/          # Course content (starlight.ts, lessons.ts) + SRS algorithm
└── store/         # Zustand state management
```

## Common Pitfalls
- **PWA caching**: Service Worker may cache old versions; use `skipWaiting: true` config
- **Speech errors**: speechSynthesis throws async errors that can crash React 18; global handlers prevent this
- **GitHub Pages**: HashRouter required; direct URL routing won't work without server config
- **localStorage**: User progress persists across sessions; clear via store.resetAll() or browser dev tools