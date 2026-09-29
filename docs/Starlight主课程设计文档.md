# Starlight 主课程功能优化 — 实现级设计文档

> 本文由 `design-doc-gen` 生成，上游为 `docs/Starlight主课程需求规格.md`（requirements-doc-gen 产出，含 D1–D6、数据字典、里程碑、技术调研 pass）。
> 设计原则：业务与适配层分离（SRS 调度内核独立封装）、返回值即 API（store action 即对外契约）、风险前置（最大不确定性 M0/M1 先验证）。
> 编制日期：2026-09-29。目标平台：桌面浏览器 PWA，**仅 Chrome / Edge（Windows，需 WebGPU 以跑 Kokoro 神经 TTS）**，不承诺 macOS Safari / Firefox / 移动端/iPad。

---

## 1. 文档说明

- **依据**：需求规格 FR-A~FR-E、NFR、D1–D6、数据字典、里程碑 M0–M5。
- **设计原则**：
  1. **业务与适配层分离**：`fsrsScheduler.ts` 封装 ts-fsrs，UI/store 不直接 import ts-fsrs，便于未来换算法或参数。
  2. **返回值即 API**：`useCourseStore` 的 action（`gradeCard` / `addExtensionWord` / `seedSentenceFrames`）即对外契约；组件只依赖 action 签名，不依赖内部字段。
  3. **核心优先 + 风险前置**：MVP 由两个核心诉求驱动——**词汇拓展（E）+ 输出能力（B 逐句跟读、C 句子框架卡）**；其中 E（拓展词录入，数据入口）与 STT 探测（B 前置）是 MVP 最先验证项。A（FSRS 内核）与 D（课文点读）为后续增强，不阻塞 MVP。
  4. **不引任何后端/API Key**：核心纯前端；语音全本地（Kokoro/WebSpeech/Web Speech），无云端 premium 层。
- **与需求文档的关系**：需求文档定义 WHAT（功能/非功能/验收），本文定义 HOW（架构/机制代码/接口/UI/错误/性能/测试/调研佐证）。需求追溯矩阵见 §14。

---

## 2. 总体设计

### 2.1 架构总览图

```
┌──────────────────────────────────────────────────────────────────────┐
│                         浏览器端（React18 + TS + Vite6 PWA）            │
│                                                                        │
│  ┌──────────── UI 层 ────────────┐   ┌────────── Hook 层 ────────────┐ │
│  │ LessonPreview（5区）           │   │ useSpeechRecognition（STT）   │ │
│  │ SmartReview（分 kind 渲染）    │   │ useSentenceReader（跟读业务） │ │
│  │ SentenceReader（跟读 UI）      │   │ useFsrsGrade（封装 gradeCard）│ │
│  │ SentenceFrameCard（填空）      │   │ useSettleQuiz（扩展结算）     │ │
│  │ TappableText（点读）           │   └──────────────────────────────┘ │
│  │ ExtensionWordEntry（录入）     │                                    │
│  └───────────────────────────────┘   ┌──────── 核心算法层 ───────────┐ │
│                                       │ fsrsScheduler（封装 ts-fsrs） │ │
│  ┌──────────── 数据层 ───────────┐   │ similarity（跟读评分）        │ │
│  │ useCourseStore（zustand persist)│  │ sentenceFrame（框架库+blank） │ │
│  │  ├ srsCards（含 FSRS 字段）    │   └──────────────────────────────┘ │
│  │  ├ starlightExtensions（运行时）│                                    │
│  │ lessons.ts / modules.ts（静态）│   ┌──────── 语音适配层 ──────────┐ │
│  └───────────────────────────────┘   │ speakService（TTS 路由）      │ │
│                                       │  Kokoro/有道/WebSpeech（离线）  │ │
│                                       └────────────┬─────────────────┘ │
└───────────────────────────────────────┼──────────────────────────────┘
                                          │ STT：Web Speech Recognition
                                          │ （Chrome / Edge 原生，需联网）
```

### 2.2 模块划分职责表

| 模块 | 职责 | 关键文件（新增/修改） |
|---|---|---|
| FSRS 调度内核 | 封装 ts-fsrs，提供 gradeCard / 派生 box / dayStamp 互转 | `src/data/srs/fsrsScheduler.ts`（新，替代 `srs.ts` 内核） |
| SRS 数据模型 | SrsCard 扩展 FSRS 字段 + 派生兼容字段 | `src/data/srs/types.ts`（新） |
| 句子框架 | SentenceFrame 类型 + 框架库 + blank 候选生成 | `src/data/sentenceFrame.ts`（新） |
| 跟读评分 | 归一化 + 词级覆盖 + 字符级模糊兜底 | `src/utils/similarity.ts`（新） |
| STT Hook | Web Speech Recognition 封装 + 离线降级 | `src/hooks/useSpeechRecognition.ts`（新） |
| 跟读业务 Hook | 串联 TTS 播句→STT 识别→评分→入 SRS | `src/hooks/useSentenceReader.ts`（新） |
| FSRS 评分 Hook | 封装 store.gradeCard + 派生 box 读取 | `src/hooks/useFsrsGrade.ts`（新） |
| 状态层 | gradeCard 替代 recordReview；starlightExtensions 字段 + 录入 action；migrate v6→v7 | `src/store/useCourseStore.ts`（改） |
| 跟读 UI | SentenceReader 卡片 + 逐词高亮 | `src/components/SentenceReader.tsx`（新） |
| 框架卡 UI | SentenceFrameCard 填空产出 | `src/components/SentenceFrameCard.tsx`（新） |
| 点读 UI | TappableText 切词 + 着色 | `src/components/TappableText.tsx`（新） |
| 拓展词录入 UI | ExtensionWordEntry 弹卡 | `src/components/ExtensionWordEntry.tsx`（新） |
| 课程页 | LessonPreview 5 区（单词/句型/跟读/课文/拓展词） | `src/pages/LessonPreview.tsx`（改） |
| 复习页 | SmartReview 分 kind 渲染（识别/产出/填空） | `src/pages/SmartReview.tsx`（改） |
| 语音适配 | TTS 路由（Kokoro→有道→WebSpeech，离线） | `src/utils/speakService.ts`（改） |

### 2.3 目录结构（精确到文件 + 职责）

```
src/
├── data/
│   ├── srs/
│   │   ├── fsrsScheduler.ts   # 封装 ts-fsrs：createScheduler/gradeCard/migrateFromLeitner/deriveBox
│   │   └── types.ts           # SrsCard / FSRS 字段 / State / Rating / 派生 box 类型
│   ├── sentenceFrame.ts       # SentenceFrame 类型 + STARLIGHT_FRAMES 库 + buildBlankCandidates()
│   ├── lessons.ts             # 扩展 Lesson{passage?,frames?}（数据补录）
│   ├── modules.ts             # ModulePreview.keyFrames 替代 keySentences
│   └── starlight.ts           # Word/Sentence（既有，复用）
├── utils/
│   ├── similarity.ts          # normalize()/tokenize()/scoreSentence()（跟读评分）
│   ├── dayStamp.ts            # dayStamp↔Date 互转（既有，复用）
│   └── speakService.ts        # TTS 路由（Kokoro→有道→WebSpeech，离线）
├── hooks/
│   ├── useSpeechRecognition.ts  # STT hook（supported 守卫 + 离线降级）
│   ├── useSentenceReader.ts     # 跟读业务编排
│   └── useFsrsGrade.ts          # 封装 store.gradeCard + 派生 box
├── store/
│   └── useCourseStore.ts       # gradeCard / addExtensionWord / removeExtensionWord / migrate v6→v7
├── components/
│   ├── SentenceReader.tsx       # 跟读 UI + 逐词高亮
│   ├── SentenceFrameCard.tsx    # 框架填空产出
│   ├── TappableText.tsx         # 课文点读
│   └── ExtensionWordEntry.tsx   # 拓展词录入弹卡
└── pages/
    ├── LessonPreview.tsx        # 5 区布局
    └── SmartReview.tsx          # 分 kind 渲染
scripts/
└── extract-passage.ts          # 从教材 PDF 提取 passage（复用既有 scripts/）
```

### 2.4 技术选型决策表（DR）

| DR | 决策点 | 选型 | 理由 |
|---|---|---|---|
| DR-1 | SRS 内核 | ts-fsrs | 个性化调度，官方宣称同等留存工作量降 30–40%；纯 TS 零依赖、浏览器可打包 |
| DR-2 | 跟读评分 | 词级集合覆盖 + 字符级 Levenshtein 词内模糊兜底 | 儿童短句词级比字符级 Levenshtein 更鲁棒（NAES 论文）；字符级仅做词内近似匹配 |
| DR-3 | STT 引擎 | 原生 Web Speech Recognition（Chrome / Edge） | 目标平台原生支持、零成本即时；唯一风险为需联网，离线/无麦克风走「家长确认」降级（D1）；不引入跨浏览器降级引擎 |
| DR-4 | SrsCard 扩展 | 扩 FSRS 字段 + 派生 box（兼容旧 UI） | 不破坏 `boxLabel/boxEmoji`、计数、migrate |
| DR-5 | 拓展词存储 | 独立 `starlightExtensions` Record | 不污染静态 `lessons.ts`，可删可复核 |
| DR-6 | 不引入云端语音 | 否决 Cloudflare Worker / 豆包代理 | 目标平台仅 Chrome/Edge，Web Speech 原生可用、Kokoro 离线可用，无跨浏览器痛点；引入 key/费用/代理违背零运维定位（见需求 §3.1(e)） |
| DR-7 | 框架数据位置 | `lessons.ts` 每课 `frames`（主键级） + `modules.ts` `keyFrames`（单元概览） | 框架需随课/单元绑定，便于 blank 候选生成 |

---

## 3. 核心机制设计（逐攻坚点 D1–D6，代码级）

### 3.1 D1 — STT 联网依赖与降级（★★）

**问题回顾**：目标平台 Chrome / Edge 原生支持 Web Speech Recognition，无需跨浏览器降级；唯一风险是**需联网**（音频上传云端）。离线/无麦克风时必须优雅降级（「家长确认」）且不崩溃。

**设计 — `useSpeechRecognition` hook（可抄）**：

```ts
// src/hooks/useSpeechRecognition.ts
import { useCallback, useEffect, useRef, useState } from 'react';

type STTEngine = 'webspeech'; // 仅原生 Web Speech，无云端引擎

interface Options {
  lang?: string;            // 默认 'en-US'
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (code: string) => void;
}

interface Return {
  supported: boolean;       // 探测守卫，组件据此显示「家长确认」
  isListening: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

const isWebSpeechSupported = () =>
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export function useSpeechRecognition(opts: Options = {}): Return {
  const { lang = 'en-US', onResult, onError } = opts;
  const [supported, setSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const manualStop = useRef(false);

  useEffect(() => { onResultRef.current = onResult; onErrorRef.current = onError; }, [onResult, onError]);

  // 探测：目标平台 Chrome/Edge 原生支持 Web Speech；离线/无麦克风时 supported 仍 true（识别时再报错降级）
  useEffect(() => {
    setSupported(isWebSpeechSupported());
  }, []);

  useEffect(() => {
    if (!isWebSpeechSupported()) return;
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang;
    rec.maxAlternatives = 1;
    rec.onstart = () => { setIsListening(true); };
    rec.onresult = (e: any) => {
      let finalT = '', interimT = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalT += t; else interimT += t;
      }
      if (finalT) onResultRef.current?.(finalT.trim(), true);
      else if (interimT) onResultRef.current?.(interimT.trim(), false);
    };
    rec.onerror = (e: any) => {
      setIsListening(false);
      onErrorRef.current?.(e.error); // 'no-speech'|'not-allowed'|'network'|'audio-capture'
    };
    rec.onend = () => { setIsListening(false); };
    recRef.current = rec;
    return () => { try { rec.abort(); } catch {} }; // 卸载自动清理，防内存泄漏
  }, [lang]);

  const start = useCallback(() => {
    manualStop.current = false;
    if (recRef.current) {
      try { recRef.current.start(); } catch {} // 连续模式下已 start 会抛错，忽略
    }
  }, []);

  const stop = useCallback(() => { manualStop.current = true; recRef.current?.stop(); }, []);
  const abort = useCallback(() => { manualStop.current = true; recRef.current?.abort(); }, []);

  return { supported, isListening, start, stop, abort };
}
```

**降级闭环（D1）**：
- Web Speech 原生支持；`supported` 守卫 + 错误码（`no-speech`/`not-allowed`/`network`）→ 组件显示「家长确认」按钮，手动 `gradeCard(true)` 不阻塞流程。
- 唯一风险为**需联网**（音频上传云端）；离线/无麦克风时 `network`/`audio-capture` 错误触发降级，无跨浏览器降级引擎。

**边界**：`onend` 后若 `continuous` 自动重启会触发重复识别——本项目 `continuous=false`（儿童短句一次一句），故不重启。

### 3.2 D2 — FSRS 与 Leitner 数据迁移（★★★）

**问题回顾**：旧 `box/nextReview` 缺 FSRS 字段；`due` 在 ts-fsrs 是 `Date` 而存储用 dayStamp；旧 UI 读 `box` 需派生兼容。

**设计 — `fsrsScheduler.ts` 封装（可抄）**：

```ts
// src/data/srs/fsrsScheduler.ts
import { createEmptyCard, fsrs, Rating, type Card, type State } from 'ts-fsrs';
import { dayStampNow } from '@/utils/dayStamp';

const scheduler = fsrs({
  request_retention: 0.9,
  maximum_interval: 36500,
  enable_fuzz: true,
  enable_short_term: true,
  learning_steps: ['1m', '10m'],
  relearning_steps: ['10m'],
});

// 旧 Leitner box → 初始 stability 映射（[0,0.5,1,2.5,5,8,14,30] 对应 box 0..7）
const BOX_STABILITY = [0, 0.5, 1, 2.5, 5, 8, 14, 30];

export function migrateFromLeitner(box: number, nextReview: number, lapses0: boolean): Partial<Card> {
  const b = Math.min(Math.max(box, 0), 7);
  return {
    stability: BOX_STABILITY[b],
    difficulty: 5 + b * 0.5,           // 线性估算，box 越高越易
    state: State.Review,
    due: new Date(nextReview * 86400000),
    elapsed_days: 0,
    scheduled_days: BOX_STABILITY[b],
    learning_steps: 0,
    reps: b,
    lapses: lapses0 ? 1 : 0,
  };
}

export function gradeCard(card: Card, correct: boolean, now: Date = dayStampNow() as unknown as Date): Card {
  const rating = correct ? Rating.Good : Rating.Again;
  return scheduler.next(card, now, rating).card; // afterHandler 在边界做 Date→dayStamp
}

// 派生 box（供旧 UI：boxLabel/boxEmoji/计数），由 state+stability 反推
export function deriveBox(card: Card): number {
  if (card.state === State.New) return 0;
  if (card.state === State.Learning) return 1;
  if (card.state === State.Relearning) return Math.max(1, Math.round(card.stability / 2));
  return Math.min(7, Math.round(Math.log2(card.stability + 1)) + 1); // Review：stability→box 近似
}
```

**store migrate（v6→v7，与 E 合并批次）**：

```ts
// useCourseStore.ts persist 段（示意）
migrate(persisted: any, version: number) {
  if (version < 6) return persisted;            // 旧版走既有逻辑
  const v7 = { ...persisted };
  v7.srsCards = (persisted.srsCards ?? []).map((c: any) => ({
    ...c,
    ...migrateFromLeitner(c.box ?? 0, c.nextReview ?? dayStampNow(), (c.box ?? 0) === 0),
    kind: c.kind ?? 'word',
  }));
  v7.starlightExtensions = persisted.starlightExtensions ?? {}; // 旧数据补 {} 不崩
  return v7;
}
```

**验证（必跑 `srs.test.ts`）**：
- 连续 `gradeCard(true)` → `due` 间隔递增（dayStamp 单调递增）；
- `gradeCard(false)` → `due` 回当天（dayStamp == today），`lapses+1`，`state=Relearning`；
- `migrateFromLeitner` 输出 `state=Review`、`due` 与旧 `nextReview` 一致、`stability` 落在映射区间。

### 3.3 D3 — 跟读评分准确性（★★）

**问题回顾**：纯前端文本相似度，儿童发音不准 → ASR 输出噪声大，易误判；不能评发音，只能评"词覆盖"。

**设计 — `similarity.ts`（可抄，核心算法）**：

```ts
// src/utils/similarity.ts
const ARTICLES = new Set(['a', 'an', 'the']);
const CONTRACTIONS: Record<string, string[]> = {                  // 展开缩写，容错
  "i'm": ['i', 'am'], "don't": ['do', 'not'], "can't": ['can', 'not'],
  "it's": ['it', 'is'], "that's": ['that', 'is'],
};
const SYNONYMS: Record<string, string[]> = {                     // 同义框架容错（可选扩展）
  want: ['would', 'like'], like: ['enjoy'],
};

export function normalize(s: string): string {
  return s.toLowerCase().replace(/[.,!?;:'"()]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function tokenize(s: string): string[] {
  return normalize(s).split(' ').flatMap(w => CONTRACTIONS[w] ?? [w]).filter(Boolean);
}

// 词内字符级模糊匹配（Levenshtein 归一化），允许 ASR 拼写近似
function wordSim(a: string, b: string): number {
  if (a === b) return 1;
  const lev = levenshtein(a, b);
  return 1 - lev / Math.max(a.length, b.length);
}

export interface ScoreResult {
  score: number;          // 0..1
  matched: string[];      // 命中的目标词（高亮）
  missing: string[];      // 目标缺词
  extra: string[];        // 多余词
}

export function scoreSentence(ref: string, hyp: string, opts?: { articleTolerant?: boolean }): ScoreResult {
  const articleTolerant = opts?.articleTolerant ?? true;
  const targets = tokenize(ref).filter(w => !(articleTolerant && ARTICLES.has(w)));
  const hyps = tokenize(hyp);
  const used = new Array(hyps.length).fill(false);
  const matched: string[] = [];
  const missing: string[] = [];
  for (const t of targets) {
    let hit = -1, best = 0.7; // 词内模糊阈值 0.7
    for (let i = 0; i < hyps.length; i++) {
      if (used[i]) continue;
      const sim = wordSim(t, hyps[i]) * (SYNONYMS[t]?.includes(hyps[i]) ? 1 : 1);
      if (sim >= best) { hit = i; best = sim; break; }
    }
    if (hit >= 0) { used[hit] = true; matched.push(t); }
    else missing.push(t);
  }
  const extra = hyps.filter((_, i) => !used[i]);
  const coverage = targets.length ? matched.length / targets.length : 1;
  const penalty = extra.length * 0.1;                 // 多余词轻罚
  return { score: Math.max(0, Math.min(1, coverage - penalty)), matched, missing, extra };
}
```

**阈值与反馈**：默认 `threshold=0.6`（FR-B3，儿童宽容）。`score>=0.6` → ✅ 点亮 + `gradeCard(true)`；否则循环「再说一次」+ 显示 `missing` 词提示。**不对儿童暴露分数**（ACM 2026 结论：始终正反馈），只显示"很棒/再试一次"+ 缺失词高亮。

**多路线择一**：A 词级覆盖（默认，鲁棒）→ B 纯字符 Levenshtein（仅在词级失效时作词内匹配，已内置）。D3 风险由阈值放宽 + 高亮 + 家长确认兜底共同下调。

### 3.4 D4 — 句子框架结构化（★★）

**问题回顾**：`keySentences:string` 未结构化，无法做填空产出；12 单元框架需手工建模 + blank 候选生成。

**设计 — `sentenceFrame.ts`**：

```ts
// src/data/sentenceFrame.ts
export interface SentenceFrame {
  id: string;                 // `${unitSlug}-${n}`
  pattern: string;            // 含 "___" 占位，如 "I want a ___."
  blanks: { options: string[] }[]; // 每个空位的候选（取自本课 words.en / 同单元拓展词）
  zh: string;
  hint?: string;
}

export function buildBlankCandidates(unitSlug: string, lessonId: string): string[] {
  // 取本课 words.en + 同单元 starlightExtensions；去重；按出现序
  const lesson = getLesson(unitSlug, lessonId);
  const ext = useCourseStore.getState().starlightExtensions[`${unitSlug}-${lessonId}`] ?? [];
  return [...new Set([...lesson.words.map(w => w.en), ...ext.map(w => w.en)])];
}

// STARLIGHT_FRAMES：手工建模，3–4 框架/单元（先 Unit4 玩具试点）
export const STARLIGHT_FRAMES: Record<string, SentenceFrame[]> = {
  'unit4': [
    { id: 'unit4-1', pattern: 'Which ___ do you want?', blanks: [{ options: buildBlankCandidates('unit4', '1') }], zh: '你想要哪个___？' },
    { id: 'unit4-2', pattern: 'I want a ___.', blanks: [{ options: buildBlankCandidates('unit4', '1') }], zh: '我想要一个___。' },
    { id: 'unit4-3', pattern: 'Here you are. Thank you.', blanks: [{ options: [] }], zh: '给你。谢谢。' },
  ],
  // ... 其余单元按需补
};
```

**数据落点**：`ModulePreview.keyFrames: SentenceFrame[]` 替代 `keySentences`；或 `lessons.ts` 每课 `frames`。M3 先 Unit4 试点，验证后可批量补 12 单元。

### 3.5 D5 — 课文点读数据生产（★）

**问题回顾**：`passage` 需从教材 PDF 提取；切词 + 词状态着色映射。

**设计 — `TappableText` + 数据**：

```ts
// src/components/TappableText.tsx（示意）
function TappableText({ passage, wordIndex }: { passage: string; wordIndex: Map<string, number> }) {
  const tokens = passage.split(/(\s+)/); // 保留空白
  return <p>{tokens.map((tok, i) => {
    const key = tok.toLowerCase().replace(/[.,!?;:'"]/g, '');
    const box = wordIndex.get(key);
    const color = box === undefined ? 'text-ink' : box >= 5 ? 'text-mint' : box >= 2 ? 'text-sun' : 'text-coffee/40';
    if (!/^[a-zA-Z]/.test(tok)) return <span key={i}>{tok}</span>;
    return <button key={i} className={color} onClick={() => speak(tok)} onMouseEnter={() => showDict(tok)}>{tok}</button>;
  })}</p>;
}
```

**数据生产**：`Lesson.passage?` 由 `scripts/extract-passage.ts` 从教材 PDF 提取对话原文（复用既有 `scripts/`）；先 1–2 课试点，验证切词 + 着色映射（`box` 取自 `srsCards`）。

### 3.6 D6 — 拓展词数据质量（★）

**问题回顾**：儿童/iPad 录入拼写错；需删除 + 家长复核；zh/emoji 兜底。

**设计 — 录入校验 + 兜底（store action）**：

```ts
// useCourseStore.ts
addExtensionWord(lessonKey: string, w: { en: string; zh?: string; emoji?: string }) {
  const en = w.en.trim().toLowerCase();
  if (!en) return { ok: false, reason: 'empty' };          // 空 en 不允许提交
  const list = this.starlightExtensions[lessonKey] ?? [];
  if (list.some(x => x.en === en)) return { ok: false, reason: 'dup' }; // 同课去重
  const word: Word = {
    en, zh: w.zh ?? bookDictLookup(en) ?? '',              // bookDict/有道兜底
    emoji: w.emoji ?? '📝', ipa: '',
  };
  this.starlightExtensions = { ...this.starlightExtensions, [lessonKey]: [...list, word] };
  seedSrsCard(en, 'starlight');                            // 自动进复习池
  return { ok: true };
}
removeExtensionWord(lessonKey: string, en: string) {
  const list = (this.starlightExtensions[lessonKey] ?? []).filter(x => x.en !== en);
  this.starlightExtensions = { ...this.starlightExtensions, [lessonKey]: list };
  // 同步从 srsCards 移除（按 en + 来源标记）
}
```

**复核**：`ExtensionWordEntry` 弹卡 `en` 必填校验；列表带「拓展」badge + 删除按钮（家长复核）；拼写错靠删除 + 重录兜底。

---

## 4. 接口 Schema 代码（store action / hook / 组件 props）

> 本项目为前端应用，无 agent tool；以下为对外的 TS 接口契约（返回值即 API）。缺参一律在 action/hook 内校验，不靠调用方保证。

### 4.1 store action 接口

```ts
// useCourseStore.ts 关键 action 签名
interface CourseStore {
  // A：FSRS 评分（替代 recordReview）
  gradeCard(en: string, correct: boolean, module?: ModuleId): void;
  // A：旧 UI 兼容读取
  getDueCards(): SrsCard[];
  getTodayDueCount(): number;
  getTomorrowDueCount(): number;
  // E：拓展词
  starlightExtensions: Record<string, Word[]>;
  addExtensionWord(lessonKey: string, w: { en: string; zh?: string; emoji?: string }): { ok: boolean; reason?: string };
  removeExtensionWord(lessonKey: string, en: string): void;
  // C：框架卡
  seedSentenceFrames(frames: SentenceFrame[], module: ModuleId): void;
}
```

### 4.2 useSpeechRecognition 接口（见 §3.1，supported/onResult/onError 为缺参兜底关键）

### 4.3 useSentenceReader 接口

```ts
// useSentenceReader.ts
interface UseSentenceReader {
  sentence: string;            // 当前跟读原句（已填 blank）
  status: 'idle' | 'playing' | 'listening' | 'scored';
  result?: ScoreResult;        // 来自 similarity.ts
  startRead(): void;           // 播原句(TTS)→自动 start STT
  retry(): void;
  confirmByParent(): void;     // 降级：家长确认记对
}
```

### 4.4 STT 接口约定（原生 Web Speech）

```
前端（React）→ window.SpeechRecognition/webkitSpeechRecognition（Chrome/Edge 原生）
  → onresult 回调 {transcript, isFinal}（同 onResult 契约）
  → onerror 回调 {error: 'no-speech'|'not-allowed'|'network'|'audio-capture'}（同 onError 契约）
说明：无云端代理；音频在浏览器内采集并由浏览器上传识别服务（需联网）。
```

---

## 5. 数据结构汇总

```ts
// src/data/srs/types.ts
import type { State, Rating } from 'ts-fsrs';

export type CardKind = 'word' | 'sentence';
export type ModuleId = 'starlight' | 'flyguy' | 'rocketgirl' | 'chinese' | 'eng3a';

export interface SrsCard {
  en: string;                       // 单词卡=词；句子卡=hash(pattern)
  kind: CardKind;
  frame?: string;                   // 句子卡填后整句（C 产出）
  // FSRS 字段（内部 Date 经边界转 dayStamp 存储）
  due: number;                      // 存 dayStamp（FR-A5）
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: State;                     // 0 New /1 Learning /2 Review /3 Relearning
  // 派生兼容字段（不写库，运行时由 deriveBox 计算；旧数据 migrate 时预填）
  box?: number;
  reviews?: number;
  streak?: number;
  lastReview?: number;
  nextReview?: number;
  modules: ModuleId[];
  source?: 'textbook' | 'extension'; // 区分教材词/拓展词（E）
}

// 既有（复用）
export interface Word { en: string; zh: string; emoji: string; ipa?: string; }
export interface Sentence { en: string; zh: string; hint?: string; }
export interface SentenceFrame { id: string; pattern: string; blanks: { options: string[] }[]; zh: string; hint?: string; }
export interface Lesson { id: string; title: string; titleZh: string; words: Word[]; sentences: Sentence[]; frames?: SentenceFrame[]; passage?: string; }

// FSRS 枚举（来自 ts-fsrs）
// State: 0 New /1 Learning /2 Review /3 Relearning
// Rating: 0 Manual /1 Again /2 Hard /3 Good /4 Easy
```

**字典注入方式**：`STARLIGHT_FRAMES`（§3.4）在 `seedSentenceFrames` 时注入；`bookDict` 兜底下 `zh`，运行时查 `Word` 表，保证模型词表与渲染一致。

---

## 6. 关键流程时序（ASCII）

### 6.1 跟读完整闭环（B + D3）

```
家长/孩子        LessonPreview(跟读tab)   useSentenceReader   speakService(TTS)   useSpeechRecognition   similarity   store
   │                    │                      │                    │                   │                │       │
   │  点「开始跟读」     │                      │                    │                   │                │       │
   ├───────────────────>│  startRead()         │                    │                   │                │       │
   │                    ├─────────────────────>│  play(原句)        │                   │                │       │
   │                    │                      ├───────────────────>│  Kokoro/WebSpeech │                │       │
   │                    │                      │<───────────────────┤  音频             │                │       │
   │                    │                      ├───────────────────────────────────────────────────────>│ start()│
   │  孩子开口复述       │                      │                    │                   │  onresult(text)│       │
   │───────────────────────────────────────────────────────────────────────────────────────────────────>│       │
   │                    │                      │<───────────────────────────────────────┤                │       │
   │                    │                      ├───────────────────────────────────────┤ scoreSentence()│       │
   │                    │                      │<───────────────────────────────────────┤ {score,missing}│       │
   │                    │  逐词高亮+相似度%     │                    │                   │                │       │
   │                    │<─────────────────────┤                    │                   │                │       │
   │  score>=0.6? ──────┤                      │                    │                   │                │       │
   │   是 ──────────────┼─────────────────────────────────────────────────────────────────────────────>│ gradeCard(true)
   │   否 ──────────────┼─「再说一次」循环 ─────┤                    │                   │                │       │
   │  supported=false ──┼─「家长确认」按钮 ─────┼─────────────────────────────────────────────────────>│ gradeCard(true)
```

### 6.2 拓展词录入闭环（E）

```
家长        LessonPreview       ExtensionWordEntry      store              srsCards
 │ 点「➕加词」│                      │                    │                  │
 ├──────────>│ 弹录入卡            │                    │                  │
 │ 填 broccoli│<────────────────────┤ addExtensionWord() │                  │
 ├───────────┼─────────────────────>│ (校验 en非空/去重) │                  │
 │           │                      ├───────────────────>│ seedSrsCard()   │
 │           │                      │                    ├─────────────────>│ 入复习池
 │           │ 列表显示「拓展」badge │<───────────────────┤                  │
 │ 退出重进   │ 仍在（persist）      │                    │                  │
```

### 6.3 FSRS 迁移（M0）

```
旧 v6 localStorage ──> persist.migrate(v7)
  ├ srsCards: map(c => {...c, ...migrateFromLeitner(c.box, c.nextReview)})
  ├ starlightExtensions: {} (补默认)
  └ deriveBox 预填 box（旧 UI 兼容）
```

---

## 7. UI 设计

### 7.1 LessonPreview 五区布局

```
┌─────────────────────────────────────────────┐
│  Unit 4 · Lesson 1 玩具                        │
├──────────┬──────────┬──────────┬─────────────┤
│ 单词区    │ 句型区    │ 跟读区    │ 课文区       │ 拓展词区 │
│ Word[]    │ keyFrames│ Sentence │ TappableText│ ➕加词   │
│ (SpeakBtn)│ (翻面)   │ Reader   │ (点读着色)   │ 列表badge│
└──────────┴──────────┴──────────┴─────────────┴─────────┘
```

### 7.2 卡片规格表

| 组件 | 尺寸/行为 | 必备元素 |
|---|---|---|
| SentenceReader | 全宽卡片，原句大字 + 麦克风按钮 | 原句、逐词高亮、相似度%、✅/再试、家长确认按钮 |
| SentenceFrameCard | 填空卡，pattern 显示 + blank 下拉 | pattern（___ 处可填）、zh 提示、说出整句→跟读 |
| TappableText | 课文段落，词可点 | 词按钮（按 box 着色）、整句朗读键 |
| ExtensionWordEntry | 弹卡 | en 输入（必填）、zh/emoji（选填）、提交/取消 |

### 7.3 表单字段映射

| 录入字段 | 控件 | 数据源 | 快捷项 |
|---|---|---|---|
| 拓展词 en | 文本输入 | 家长键盘 | 语音输入（TTS 播出确认） |
| 拓展词 zh | 文本输入 | 手动/bookDict 兜底 | — |
| 拓展词 emoji | 选择器 | 预设 emoji 集 | 📝 默认 |
| 跟读阈值 | 滑块 | 设置 | 0.6 默认 |

---

## 8. 错误处理设计（四列表）

| 场景 | 检测点 | 处理 | 用户所见 |
|---|---|---|---|
| STT 不可用（离线/无麦克风） | `useSpeechRecognition.supported===false` 或 `onerror('network'/'audio-capture')` | 不初始化识别 / 降级；显示「家长确认」 | 「家长听后点✅」按钮，流程不中断 |
| STT 无语音 `no-speech` | `onerror('no-speech')` | 重试提示；超 2 次→降级 | 「没听清，再说一次」/「家长确认」 |
| STT 拒权 `not-allowed` | `onerror('not-allowed')` | 引导浏览器授权 | 「请在浏览器允许麦克风」 |
| STT 离线 `network` | `onerror('network')` | 降级 + 联网提示 | 「需联网识别，或请家长确认」 |
| TTS 全链路失败 | `speakService` 三层兜底耗尽 | console.warn + 跳过播放 | 无音频但不崩 |
| FSRS migrate 异常 | `migrate` try/catch | 回退旧数据 + 告警 | 旧复习照常，新调度下次生效 |
| 拓展词空 en/重复 | `addExtensionWord` 校验 | 返回 {ok:false} | 「不能为空」/「已添加」 |
| 重复录同词 | `addExtensionWord` 去重 | 拒绝 | 「已添加」提示 |

---

## 9. 性能设计（预算表）

| 路径 | 预算 | 说明 |
|---|---|---|
| `getDueCards`（≤2000 卡） | <16ms | map+filter，FR-A6 |
| `scoreSentence`（儿童短句 <15 词） | <5ms | 词级集合，无递归重算 |
| TTS 首载 Kokoro 模型 | ~80MB 懒加载，IndexedDB 缓存后秒开 | 仅桌面 WebGPU；加载时进度提示 |
| STT 反馈感知延迟 | <1s（FR-B6） | 依赖浏览器云端识别（需联网），非本端瓶颈 |
| 内存 | 不泄漏 | `useSpeechRecognition` 卸载 `abort()`；Kokoro 模型常驻但单例 |

---

## 10. 测试设计

| 层 | 用例类型 | 代表用例 |
|---|---|---|
| 单元（vitest） | FSRS 行为确定性 | 连续 Good→due 递增；Again→回当天+state=Relearning+lapses+1；`deriveBox` 与 `state/stability` 一致 |
| 单元 | 迁移完整性 | `migrateFromLeitner` 输出字段完整、`due`==旧 `nextReview`、旧 v6 升级无丢失/无重复 |
| 单元 | 相似度 | `scoreSentence("I want a car","i want car")>=0.6`；冠词容错；缩写展开；缺失词返回 missing |
| 组件（RTL） | 跟读降级 | `supported=false` → 渲染「家长确认」；点击→`gradeCard(true)` |
| 组件 | 拓展词 | 录 broccoli→队列带「拓展」badge；删除→移除；空 en 拒绝 |
| E2E（Playwright） | 全链路 | 验收标准 1–10（迁移/FSRS/拓展录删/框架卡/跟读主流程+降级+离线/点读着色/边界） |
| 交叉验证 | FSRS 调度 | 同输入同输出（确定性）；与 Anki 风格间隔量级对照抽样 |

---

## 11. 部署与运行

- **启动（开发）**：`npm run dev`（Vite，localhost 安全上下文满足 STT）。
- **构建**：`npm run build`（`tsc -b && vite build`）；`npm run preview` 验证生产包。
- **部署**：GitHub Actions → GitHub Pages（HTTPS 满足 STT 安全上下文）。
- **部署**：仅 GitHub Pages，无 Worker / 无 API Key；语音全本地（Kokoro/WebSpeech/Web Speech），核心功能零依赖、零运维。
- **版本锁定**：`ts-fsrs`（MIT，Node≥20 构建）；其余复用现有依赖（Web Speech 原生、无新增语音库）。
- **离线预案**：核心（TTS Kokoro/WebSpeech、SRS、拓展词、点读、跟读 UI）全离线/本地；仅 Web Speech STT 需联网（音频上传云端），离线时走「家长确认」降级。

---

## 12. 难点调研资料与分析（D1–D6 分水岭）

### 12.1 D1 — STT 兼容性
- **资料**：MDN `SpeechRecognition`；testmu.ai 兼容表（2026 实测：macOS Safari 14.1+ 已支持 `webkitSpeechRecognition`，Firefox 不支持，需 HTTPS+联网）；fiberui `useSpeechRecognition` 实现范式（supported 守卫 + interimResults + 卸载 abort + onerror 错误码）。
- **关键事实**：目标平台 Chrome / Edge 全支持（无需降级引擎）；其他浏览器不在范围。错误码 `no-speech/not-allowed/network/audio-capture` 是降级依据（离线/无麦克风触发）。
- **对设计的帮助**：直接落地 §3.1 hook 的 `supported` 守卫与错误分支；确定降级为「家长确认」而非崩溃。

### 12.2 D2 — FSRS API
- **资料**：ts-fsrs npm/jsdelivr 官方文档（2026）；GitHub `open-spaced-repetition/ts-fsrs`。
- **关键事实**：`fsrs()` 初始化参数（request_retention/maximum_interval/enable_fuzz/learning_steps）；`scheduler.next(card, now, rating)` 返回 `.card`；`createEmptyCard()`；`Card.due` 为 `Date`；`State`(0-3)/`Rating`(0-4) 枚举；Node≥20 构建；`afterHandler` 可在边界序列化 `Date→number`。
- **对设计的帮助**：确认 FR-A5 的 `Date↔dayStamp` 边界互转；`gradeCard` 用 `next` 而非 `repeat`（已知 rating）；`migrateFromLeitner` 用 box→stability 映射。

### 12.3 D3 — 跟读评分
- **资料**：IJERT（Levenshtein 相似度与专家发音评分相关 r=0.84）；乌克兰 NAES 论文（儿童短句/无言语障碍场景 Levenshtein 优于 Jaro）；ACM 2026（词级 WER 评分 + 对儿童只给正反馈不暴露分数）。
- **关键事实**：① Levenshtein 字符相似度是发音质量的可靠自动化代理；② 但对儿童短句，**词级集合覆盖**比字符级更鲁棒（ASR 字符噪声大）；③ 临床/教育系统对儿童始终正反馈。
- **对设计的帮助**：推翻需求里"Jaccard/Levenshtein"的模糊表述 → 设计为**词级覆盖主导 + 词内 Levenshtein 模糊兜底**（§3.3）；明确**不向儿童暴露分数**，只给正反馈 + 缺失词高亮。这是需求文档未细化、本文补强的核心算法。

### 12.4 D4 — 框架结构化
- **资料**：需求文档 §5.4（FR-C1~C3）；Starlight Starter 官方单元结构（engage→practice→communicate，最后一步为整句交流）。
- **关键事实**：句型在教材中高频复现，框架填空即公式化语块训练（呼应调研文档 Swain/公式化语块理论）。
- **对设计的帮助**：`SentenceFrame` 的 `pattern/blanks` 结构 + `buildBlankCandidates` 取自本课/拓展词；先 Unit4 试点。

### 12.5 D5 — 点读数据
- **资料**：需求文档 §5.5（FR-D1~D2）；Lute 思路（阅读即习得，词状态着色）。
- **关键事实**：`Lesson.passage` 需从教材 PDF 提取；词着色映射 `box`（已知绿/模糊黄/未知灰）。
- **对设计的帮助**：`TappableText` 按 `box` 着色 + 点词朗读/释义；`scripts/extract-passage.ts` 复用既有 PDF 脚本。

### 12.6 D6 — 拓展词质量
- **资料**：需求文档 §5.6（FR-E1~E4）；用户反馈（老师课堂拓展词如蔬菜 broccoli/cabbage/cucumber 不在教材）。
- **关键事实**：录入错误靠删除 + 家长复核兜底；zh/emoji 走 bookDict/有道兜底。
- **对设计的帮助**：`addExtensionWord` 校验（非空/去重）+ 列表 badge + 删除；明确 source 标记区分教材/拓展。

---

## 13. 里程碑 → 设计验证映射 + 需求追溯矩阵

### 13.1 里程碑 → 设计验证映射

| 里程碑 | 层级 | 验证的设计点 | 验证手段 |
|---|---|---|---|
| M0 | 【MVP 核心】 | addExtensionWord 校验 + persist + badge（E 拓展词） | 录 broccoli→队列带角标；退出重进仍在；删除生效 |
| M1 | 【MVP 核心·B 前置】 | useSpeechRecognition.supported/降级；联网检测 | Chrome / Edge 跑通；离线/无麦克风时「家长确认」降级不崩 |
| M2 | 【MVP 核心】 | useSentenceReader + 逐词高亮 + similarity.scoreSentence + 降级（复用 Kokoro TTS 示范） | 跟读达标✅入 SRS；不达标循环；降级可用 |
| M3 | 【MVP 核心】 | SentenceFrame + SrsCard.kind + seedSentenceFrames（复用 B 交互） | 框架卡可播种/复习，单词卡不受影响；填空说整句可评分 |
| M4 | 【后续增强】 | fsrsScheduler.gradeCard / migrateFromLeitner / deriveBox；dayStamp 边界（A FSRS） | `srs.test.ts` + `npm run check` + `build` |
| M5 | 【后续增强】 | TappableText + passage 着色 + e2e（D 点读） | 点读出释义+朗读；着色正确；e2e 不回归 |

> **MVP 实施顺序**：M0（E 词汇拓展）→ M1（STT 探测）→ M2（B 跟读）→ M3（C 框架卡）。A/D 在 MVP 验收后作为增强迭代。

### 13.2 需求追溯矩阵（FR → 设计落点）

| FR | 设计落点 |
|---|---|
| FR-A1~A7 | §3.2 fsrsScheduler + store.gradeCard + §5 SrsCard + §10 测试 |
| FR-B1~B6 | §3.1 useSpeechRecognition + §3.3 similarity + §4.3 useSentenceReader + §11 部署 |
| FR-C1~C3 | §3.4 sentenceFrame + §4.4 + SmartReview 分支 |
| FR-D1~D2 | §3.5 TappableText + scripts/extract-passage |
| FR-E1~E4 | §3.6 addExtensionWord/removeExtensionWord + ExtensionWordEntry |
| FR-C0.1~C0.4 | §2.1 架构 + §11 部署 + §8 错误（兼容守卫/数据隔离） |

---

## 附录：Open Questions

1. **跨浏览器扩展（未来）**：当前仅 Chrome/Edge；若未来需 Firefox/Safari 支持，可加客户端 Whisper（Transformers.js + Whisper Tiny.en，~40MB，零后端）或云端 STT 代理，但均不在本次范围。当前默认不采。
2. **Hard/Easy 评分**：当前 UI 仅二元（Good/Again），FR 预留 `kind`/`frame` 扩展；后续可加 Hard/Easy 按钮（需 UI + 星级规则联动）。
4. **AGENTS.md 过时 TTS 描述**：仍写「speechSynthesis + 有道兜底」，与现状（Kokoro 默认开 + Edge/有道/WebSpeech）不符，待用户确认后修正（不影响本设计实现）。
5. **效果验证闭环（G2 度量）**：每课后家长回传「能否用目标句型说整句」的机制，当前设计未含独立 UI；建议在 LessonPreview 加「课后回传」轻量入口，承接需求 G1 度量。

---

> 本文与需求规格、方案蓝图、调研文档共同构成 Starlight 主课程优化的完整交付链：调研（诊断）→ 需求（WHAT）→ 设计（HOW）。下一步进入 Implementation（M0 起）。
