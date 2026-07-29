# Starlight-course 架构评估报告

> 评估日期：2026-07-29 ｜ 项目规模：约 8.4k 代码行（实际 TS/TSX 约 19 个、SCSS 8 个，其余 250+ 为 PDF 教学资源）
> 技术栈：Vite 6 + React 18 + TypeScript（strict 关闭）+ Zustand(persist) + HashRouter + 纯前端 PWA（无后端）
> 功能定位：学龄前/小学儿童英语学习工具，含 3 个主题模块（Starlight 主课 / Fly Guy / Rocket Girl）+ SRS 间隔复习

---

## 0. 评估结论速览

**总评：B（架构分层清晰、解耦良好，但页面层存在显著复制粘贴、数据层单词源分叉，属"可工作的中等架构"，主要短板在可维护性随模块数线性恶化）**

| 维度 | 评级 | 一句话结论 |
|------|------|-----------|
| 架构合理性 | ✅ 良好 | 分层（pages/components/store/data/utils/styles）与功能规模匹配，无严重过度/不足 |
| 模块耦合度 | ⚠️ 中等 | 页面间零互引（解耦好），但故事模块页面 ~420 行近字复制（低内聚） |
| 扩展性 | ⚠️ 中等偏上 | `ModuleMeta` 注册表抽象到位，但"加模块=复制 420 行"抵消了注册表的红利 |
| 工程 hygiene | ⚠️ 偏弱 | strict 关闭、Tailwind 死配置、构建产物入仓、无测试 |

**三大优势**：① 路由/页面/数据/store 分层清晰；② 页面间零直接 import，仅经路由+store+data 解耦；③ `ModuleMeta` 注册表 + `moduleThemeVars` 主题派生，模块抽象良好。
**三大风险**：① 故事模块页面大量复制（维护成本翻倍）；② "单元单词全集"多源定义导致进度统计漂移；③ 类型安全网与测试缺失，重构缺乏保护。

---

## 1. 架构合理性评估

### 1.1 当前架构形态
- **入口**：`main.tsx` → `App.tsx`（HashRouter + 全局 error 兜底 + Layout 外壳 + 路由级 SafeBoundary）。
- **视图层**：18 个页面组件，按业务切分（Home/预览链/复习链/故事链/工具页）。
- **状态层**：单一 Zustand store（`useCourseStore`），`persist` 持久化到 localStorage（key=`starlight-course`，version=3）。
- **数据层**：`src/data/` 静态数据（starlight/lessons/flyguy/rocketgirl/srs/modules），SRS 算法为纯函数。
- **工具层**：`speak.ts`（语音降级）、`theme.ts`（主题令牌派生）。
- **样式层**：8 个 SCSS 分片（_base/_components/_home/_smart/_study/_theme/_tokens/_mixins），实际样式 100% 来自 SCSS。

### 1.2 与功能需求的匹配度 → 匹配
当前是"单机离线、内容固定、面向儿童"的工具，无账号、无服务端、无实时协作。分层 + 单 store + 静态数据的选型**恰好匹配**该需求，没有引入路由库之外的多余抽象（无 Redux/无后端/无状态机框架）。规模约 8.4k 行，属中等体量，当前分层足以承载。

### 1.3 是否过度设计 → 局部过度/无用配置
- **S2 Tailwind 死配置**：`tailwind.config.js` + `postcss.config.js` 启用 Tailwind，但 `index.scss` 明确不写 `@tailwind` 指令，实际样式全在 SCSS。Tailwind 扫描在跑却无产出 → **死配置/过度工程**，应删除或真正启用。
- **S11 双重全局错误兜底**：`main.tsx` 与 `App.tsx:65-84` 各注册一套监听 `error`/`unhandledrejection`、靠字符串 `'speechSynthesis'` 吞掉全局错误的逻辑，重复且脆弱（依赖库内部文案、可能误伤/漏拦）。
- 除上述两点外，**无严重过度设计**；多数设计（注册表、主题派生、SRS 纯函数）是恰当的。

### 1.4 是否架构不足 → 有几处明显不足
- **S12 类型安全关闭**：`tsconfig.json` `strict:false` + `noUnusedLocals/Parameters:false`，多处 `as` 强转（如 `SmartReview.tsx` `cur.modules[0] ?? 'starlight'`），编译期无空值保障。
- **S7 数据层单词源分叉**：同一"单元单词全集"存在≥2 个定义（`Module.words` 聚合 vs `lessons.flatMap` 详细），且 `StarlightHome` 用聚合、`Progress` 用 `lessons`、复习系统用 `getWords`→`lessons.flatMap`，三处算法不一致，**进度统计会漂移**。
- **S13 构建产物入仓**：仓库内含 `dist/`、`dev-dist/`（部署产物混入源码仓）。
- **S14 persist 无 `partialize`**：全量 state 持久化，新增非持久字段易遗漏；`migrate` 仅靠 `version` 触发，未来字段变更若忘递增版本号则旧数据不迁移。
- **无测试**：项目无测试框架（AGENTS.md 确认），SRS 纯函数与 store 逻辑缺乏回归保护。

---

## 2. 模块耦合度检查

### 2.1 解耦亮点（已核实）
- **页面间零相互 import**：grep 确认所有页面仅在 `App.tsx` 被引用，页面之间无任何 `from '@/pages/...'`。依赖收敛于「路由 + 共享 store + 共享 data」三处，分层边界清晰。✅
- **SRS 算法高内聚**：`src/data/srs.ts` 纯函数（`scheduleNext/createNewCard/isDue/sortDueCards/dayStamp`），不依赖 React/store，可独立测试。✅
- **主题派生高内聚**：`moduleThemeVars` 单点负责"单色→全套令牌"，页面只声明根节点 style，无散落硬编码（核实无页面写死 hex 颜色）。✅

### 2.2 高耦合 / 低内聚问题
| 编号 | 问题 | 位置 | 性质 |
|------|------|------|------|
| S3 | `FlyGuyStory` ≒ `RocketGirlStory` 约 420 行近字复制（`VocabTab/SentencesTab/QuizTab/buildQuiz/shuffle/cleanForSpeak` 完全相同，仅差异在主题色、emoji 兜底、数据源、module 实参） | `FlyGuyStory.tsx` / `RocketGirlStory.tsx` | **低内聚 / 高重复** |
| S6 | 测验引擎 3 份近似拷贝：`ListeningQuiz.QuizTab` 与故事页 `QuizTab`（选项卡+正误高亮+进度条+结果卡），`buildQuiz` 也复制 | `ListeningQuiz.tsx` / `FlyGuyStory.tsx` / `RocketGirlStory.tsx` | **低内聚** |
| S4 | "掌握计数" `masteredWords.includes(en)` 同一表达式重复 ≥5 处 | `ReviewList:45` / `ModuleReviewHome:49` / `ReviewEntry:27` / `Progress:54` / `VocabReview:58,169` | **低内聚** |
| S5 | 模块筛选 chips UI 重复（同一段 `MODULE_LIST` 渲染 + 内联 `--mc`） | `SmartReview:277` / `WrongBook:51` | **低内聚** |
| S10 | `srsCards` 以单词 `en` 为唯一 key → 同一词跨模块共享一张卡（有意设计，但属**隐式耦合**，需在文档/评审明确） | `useCourseStore.ts:30,143,174` | **隐式耦合** |
| S9 | `completedPreviews` 语义被重载：Starlight=单元预习完成，故事模块=闯关完成（`FlyGuyStory:122`/`RocketGirlStory:122` 调 `markPreviewDone`），跨模块含义不一致 | `useCourseStore.ts:27,105` | **语义耦合隐患** |

### 2.3 内聚度小结
数据层 / 工具层内聚度高（纯函数、单点职责）；**页面层内聚度差**（重复逻辑散落、故事模块复制）。耦合来源集中在 store 与 data，虽经注册表抽象，但"重复实现"型耦合（复制粘贴）是当前最大内聚问题，而非"循环依赖"型耦合。

---

## 3. 扩展性分析

### 3.1 良好扩展点
- **`ModuleMeta` 注册表抽象到位**：新增模块只需在 `modules.ts` 声明 `{id,label,color,kind,items,getWords}` + 页面根节点套 `moduleThemeVars`，路由（`/review/:moduleId/...`）天然支持，无需改路由表。✅
- **路由参数化 moduleId 流转**：复习链路统一经 `getModuleMeta(moduleId)` 解析，模块无关代码（ReviewList/SmartReview/WrongBook）天然多模块可用。✅
- **SRS 卡片 `modules: ModuleId[]` 标签**：支持"一词多模块共享记忆"，扩展新模块自动并入已存在词的记忆。✅

### 3.2 扩展瓶颈
- **最大短板（S3）**：故事模块页面是复制粘贴而非参数化组件。"加第 4 个故事模块"= 再复制 420 行（含 3 套测验引擎），扩展成本是 **O(n) 而非 O(1)**，注册表的红利被抵消。**这是扩展性首要瓶颈。**
- **UI 抽象缺失**：模块筛选 chips、掌握进度条、QuizTab 等无共享组件，UI 扩展靠复制，易产生视觉/行为分叉。
- **单词源未统一（S7）**：新模块若单词来源规则不同，需各自写 `getWords`；虽结构可容纳，但缺乏"单词来源"统一契约，易再次分叉。
- **persist 扩展需谨慎（S14）**：新增 state 字段全量持久化，扩展时需手动维护 `migrate` 与版本号，否则旧用户数据丢失/错位。

---

## 4. 缺失与完善点 + 改进建议（按优先级）

### P0 — 高影响 / 低成本（建议先做的"止血"重构）

**① 提炼泛型 `StoryPage` 组件，统一 FlyGuy/RocketGirl 故事页 + 测验引擎**
- 做法：抽 `src/pages/StoryPage.tsx`，props = `{ moduleId, theme, stories, emojiFallback, navLayout }`；把 `VocabTab/SentencesTab/QuizTab/buildQuiz/shuffle/cleanForSpeak` 搬入。`FlyGuyStory`/`RocketGirlStory` 退化为 ~20 行薄壳。
- 收益：删除 ~600 行重复，新增故事模块变为"注册 + 薄壳"，O(1) 扩展。
- 风险：低（纯搬移 + 参数化，行为不变）。

**② 统一单词数据源为单一真相（`getWords`）**
- 做法：确立 `modules.ts` 的 `getWords(itemId)` 为唯一权威；`StarlightHome`/`Progress` 的总词数改用 `getWords` 或统一 `lessons.flatMap`，废弃 `Module.words` 聚合（或与 `getWords` 引用同一来源）。
- 收益：消除统计漂移，进度/掌握/复习三处口径一致。

**③ 删除死代码**
- `isMastered` / `getCard`（store 方法，零调用，已核实）→ 删除（或 `getCard` 若计划用则补调用）。
- `Module.sentences` 聚合字段（全站未引用，已核实）→ 删除或保留但标注。

### P1 — 中等影响（提升内聚与稳健性）

**④ 抽公共 selector / 组件**
- 掌握计数 → store 内加 `getMasteredCount(words)` 或 hooks selector，替换 5 处内联。
- 模块筛选 chips → 抽 `<ModuleFilterChips value onChange />` 替换 `SmartReview`/`WrongBook` 重复。
- QuizTab + `buildQuiz` → 抽 `<QuizEngine words theme />` 替换 3 份测验引擎。

**⑤ 合并全局 speech 错误兜底为单点**
- 做法：将 `App.tsx:65-84` 与 `main.tsx` 的监听合并进 `speak.ts`（模块加载时 `once` 注册），按 `speechSynthesis` 特征吞错；去掉两处重复。
- 收益：消除脆弱的双重兜底，错误策略集中可测。

**⑥ 渐进开启 `strict`**
- 做法：先在 `tsconfig.json` 开 `noUnusedLocals/noUnusedParameters`，再小步开 `strict`，配合 ESLint 清理 `as` 强转。分阶段进行，避免一次性改动爆炸。

### P2 — 工程 hygiene（降低长期风险）

**⑦ 清理 Tailwind 死配置（S2）**：删除 `tailwind.config.js`/`postcss` 中的 tailwind 插件，或真正启用 `@tailwind` 指令重构 SCSS。
**⑧ `.gitignore` 排除 `dist/`、`dev-dist/`**（S13），避免部署产物入仓。
**⑨ persist 加 `partialize` + 强化 `migrate`（S14）**：只持久化需要的字段；migrate 对未知结构做防御性兜底。
**⑩ 补轻量测试**：至少对 `srs.ts` 纯函数（scheduleNext/isDue）与 store 关键 action 加单测，CI 跑 `npm run check` 已有，测试可后续接入。
**⑪ `completedPreviews` 语义拆分（S9）**：拆为 `completedUnits`（Starlight 单元）与 `completedStories`（故事闯关），或改名 `completedItems` 并统一语义，消除跨模块含义不一致。

---

## 5. 总体结论与落地路线

**架构整体合理、可支撑当前与近中期需求**，核心问题不是"架构选错"，而是**实现层的复制粘贴与数据口径不统一**拖累了可维护性与可扩展性。最该优先解决的是 **P0-①（StoryPage 泛型化）**——它同时修复低内聚（S3/S6）、释放注册表的扩展红利、并让"加模块"回到 O(1)。

**建议落地顺序**：
1. **本周（P0）**：StoryPage 泛型化 → 统一单词源 → 删死代码。预计减 ~650 行、零行为变更。
2. **下周（P1）**：公共 selector/chips/QuizEngine → 合并 speech 兜底 → 渐进 strict。
3. **持续（P2）**：清理 Tailwind、.gitignore、persist partialize、补测试。

> 附注：本报告基于代码实地勘察（含 grep 核实）。所有风险点均标注了文件:行号，可直接定位。重构建议均以"行为不变"为前提，可安全分步推进。
