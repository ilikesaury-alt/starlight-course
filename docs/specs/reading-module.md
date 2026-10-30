# Spec: 阅读模块（把每课阅读短文提升为独立模块）

> 状态机：本文件是本次任务的单一活文档。下游不得推翻上游口径（要推翻必须显式回改本文件）。
> 工作流：ai-dev-flow（接单 → 需求对齐 → 沉淀 Spec → 拆增量 → ⛔方案复核 → 实现 → 交叉审查 → E2E → 验收）。
> 关联历史：`docs/CONTEXT-阅读短文-已归档.md`（阅读短文*数据 + 课内 Tab* 的已归档工作，本 Spec 是其上层「独立模块」形态）。

## 0. 元信息

| 项 | 值 |
|----|----|
| 分支 | `feat/reading-module`（由 `main` @ `11dfc3b` 切出） |
| 重量档 | 🟢 轻量（外壳 + 路由 + 入口 + 移除非 Tab，数据层与阅读器已就绪） |
| 测试 | vitest（`src/**/*.test.tsx`）/ Playwright（`tests/*.spec.ts`） |
| 环境 | node v22.22.2、Playwright 1.62.1、`npm run dev` 可用（同历史验证） |

## 1. 问题

阅读短文数据（`src/data/reading/`，96 篇，已建）与阅读器 `ReadingZone`（点词发音 / 本课词高亮 / 逐句朗读 / 中文开关 / 记忆状态 / 慢速，已建）目前**只挂在 `LessonPreview` 的第 5 个 Tab 里**。孩子要「集中读全部阅读」必须先钻进某一课预习页，路径深、且和「学新课」抢位置。需要把阅读从课内 Tab **提升为独立模块**：首页宫格直达、单页聚合浏览全部 96 篇。

## 2. 范围

**做**

- 新页面 `src/pages/ReadingPage.tsx`（`/reading`）：单页聚合，12 单元用折叠容器，点课卡片内联展开 `ReadingZone`。
- 路由：`src/App.tsx` 加 `/reading`。
- 首页入口：`src/components/CourseEntries.tsx` 加「📚 阅读」宫格卡片。
- 移除 `LessonPreview` 的「📚 阅读」Tab（含 import、状态、渲染块、`Tab` 类型）。
- E2E 迁移：`tests/starlight-zones.spec.ts` 删阅读 Tab 用例；新建 `tests/reading.spec.ts` 覆盖 `/reading` 交互 + 96 课覆盖度回归。
- 样式：阅读模块容器 / 单元折叠 / 课卡片 / 展开态（复用 `ReadingZone` 既有 `.reading-*` 样式）。

**不做（沿用 `CONTEXT-阅读短文-已归档.md` 的裁决）**

- 不播种 SRS、不做阅读理解测验、不引入跟读 STT。
- 阅读完成态**不单独持久化**（不加 store 字段 / 版本迁移）；首页宫格不加「已读进度」徽标。
- 不把 reading 加进 `modules.ts` 的 SRS 模块注册表（它不是 SRS 模块）。
- 不改动阅读数据层（`src/data/reading/`）。
- `ReadingZone` 组件原则上不改动；**例外（交叉审查后新增，见 §7）**：修一处既有的「单句/整篇互锁」缺陷（1 行，断链后再起句）。
  理由：阅读器现在只被本模块使用，而该缺陷会让「整篇连读时点某一句」读错句子，直接影响本模块可用性。

## 3. 验收标准

| # | 验收标准 | 判定方式 |
| --- | --- | --- |
| 1 | 首页宫格出现「📚 阅读」入口，点击进入 `/reading` | E2E：首页有入口、跳转 `/reading`（`tests/reading.spec.ts`） |
| 2 | `/reading` 渲染 12 个单元，每个单元展开后列出该单元 8 课 | 单测 `ReadingPage.test.tsx`：渲染 12 个单元节点 + 某单元 8 课节点 |
| 3 | 点某课卡片内联展开 `ReadingZone`，可见 `.reading-zone`、标题中英文、本课词高亮 `tt-word--mark` | E2E：展开课 → `.reading-zone` 可见、`.tt-word--mark` ≥ 5；单测：点击事件后渲染 ReadingZone |
| 4 | 阅读器交互完整：听整篇进入朗读态再点停止、中文开关可切换、逐句小喇叭可点停 | E2E：平移自历史 `starlight-zones.spec.ts` 阅读区用例（去掉「点 Tab」步骤，换成「展开单元+课」） |
| 5 | 一次只展开一篇阅读；收起 / 切走触发 ReadingZone 卸载停声（无残留朗读） | E2E：在某篇听整篇进行中，展开另一篇 / 收起 → `.reading-zone` 停声或只剩一个；代码审查 |
| 6 | `LessonPreview` 不再有「阅读」Tab，且 `ReadingZone`/`getReadingPassage` 仅被新页引用 | `grep` + `npm run lint` + `npm run check`；E2E `starlight-zones.spec.ts` 不再断言阅读 Tab |
| 7 | 全 96 课阅读短文数据完好（覆盖度回归不被破坏） | `src/data/readingPassage.test.ts`（既有，须仍全绿）+ E2E 96 课覆盖度回归 |
| 8 | `npm run check` / `npm run lint` / `npm run test` 全绿 | 命令输出 |

## 4. 关键决策

| 决策 | 理由 | 备选及放弃原因 | 记录位置 |
| --- | --- | --- | --- |
| 单页聚合（非三页路由） | 用户已确认；12 单元折叠 + 点课内联展开，96 篇不一次性铺满、代码更少 | 三页路由（/reading/:unitId/:lessonId）更重、URL 深 | 本文件 §2 |
| 移除课内「阅读」Tab | 用户已确认；独立模块已能集中读全部阅读，课内页更聚焦 | 两个入口并存 → 维护双份、定位模糊 | 本文件 §2 |
| 一次只展开一篇阅读（受控 `openLesson`） | 规避多 `ReadingZone` 实例朗读链打架；ReadingZone 卸载 `cancelSpeech()` 自清理 | 多课同时展开 → 多串行朗读链互抢、UI 状态乱 | 增量 I1 |
| 不新增阅读进度持久化 | 阅读是课后自选动作，沿用历史裁决「不进 SRS」；避免 store 版本迁移 | 加 readingDone 集合 → 需迁移 + 首页徽标，超出本次范围 | 本文件 §2 不做 |
| 复用 `ReadingZone`，仅修 1 处既有互锁缺陷 | 阅读器已含全部交互（含记忆状态/慢速开关），直接喂 `passage`/`vocab`/`boxOf` 即可；互锁缺陷见 §7 #3 | 重写阅读器 → 重复劳动、破坏既有 E2E 契约；保留缺陷 → 整篇连读时点单句读错句子 | 增量 I1 + 审查修复 |

> 用户已确认两项：模块形态=单页聚合；课内 Tab=移除。
> 用户未回答但实现不阻塞的次要点，取默认并登记如下（非阻塞）：
> - 默认展开态：**单元与课全收起**（首页只露单元名），点击逐级展开。
> - 已读进度：**暂不做**。

## 5. 假设与待确认

**已验证（来自代码库现状，动手前已 `locate` 核实）**

- 96 篇短文数据存在：`src/data/reading/index.ts` 导出 `READING_PASSAGES` 与 `getReadingPassage(unitId, lessonId)`，key 形如 `'1-1'`。单测 `readingPassage.test.ts` 强制 96 课全覆盖。
- `ReadingZone`（`src/components/ReadingZone.tsx`）自包含：仅依赖 `TappableWords` / `PlayTools` / speak 工具 / `useSlowMode` / 类型；**不 import `LessonPreview`**；props 为 `passage` / `vocab: Word[]` / `boxOf?`。内部已渲染 `PlayTools`（含 🐢慢速、🧠记忆状态开关）与整篇/逐句朗读、中文开关。
- `LessonPreview` 仅在 `tab==='read'` 块引用 `ReadingZone` 与 `getReadingPassage`（`grep` 确认：两处引用均只在阅读 Tab）。
- 路由为 `HashRouter` + `lazy` 分包（`src/App.tsx`），新增页照搬模式即可。
- 单元/课元信息取自 `@/data/starlight` 的 `modules`（12 单元，每单元 `lessons[].words: Word[]`）。
- store 有 `srsCards: Record<en, SrsCard>`，`SrsCard.box: number`，可作 `boxOf` 入参（记忆状态开关照常生效）。
- 首页宫格 `CourseEntries.tsx` 为一组 `<Link>` 卡片，加一张即可。

**假设（未经证实，若不成立影响验收）**

- 单页渲染 12 个折叠单元 × 8 课卡片（共 96 卡片）无性能问题 —— 卡片默认仅渲染标题，ReadingZone 仅在展开时挂载，影响可控。
- `ReadingZone` 在「非 LessonPreview 上下文」下行为一致（已验证无外部依赖，但仍以 E2E #3/#4 兜底）。

**待确认（需人工回答）—— 用户已选择「不回答 / 取默认」，按 §4 默认值执行，非阻塞**

- [x] 默认展开态：全收起（已定默认）
- [x] 已读进度：暂不做（已定默认）

## 6. 影响面
- 涉及文件/模块：
  - 新建：`src/pages/ReadingPage.tsx`、`src/pages/ReadingPage.test.tsx`、`tests/reading.spec.ts`
  - 改：`src/App.tsx`（路由）、`src/components/CourseEntries.tsx`（入口）、`src/pages/LessonPreview.tsx`（移除 Tab）、`tests/starlight-zones.spec.ts`（删阅读 Tab 用例）、`src/styles/_study.scss`（或新 `_reading.scss` 引入）
- 数据或接口变更：无（复用既有数据/组件，不改签名）
- 风险点：
  - 多 `ReadingZone` 实例朗读链互抢 → 受控单篇展开 + 卸载 `cancelSpeech()` 规避（验收 #5）
  - 移除 Tab 时漏删 import 致 lint/check 失败 → 增量 I3 用 `grep` 复核（验收 #6）
  - E2E 阅读用例迁移遗漏 → 历史 `starlight-zones.spec.ts` 阅读 describe 整段迁到 `reading.spec.ts`（验收 #4/#7）

## 7. 交叉对抗审查结论（阶段 5）

两个**独立上下文**的只读审查（A 对抗性 / B 安全与一致性），未带实现过程。

| # | 审查方 | 严重度 | 发现 | 处置 |
| --- | --- | --- | --- | --- |
| 1 | A+B | 高(P1) | 单元 `<details>` 收起只隐藏子树、不卸载阅读器 → 朗读继续而 ⏸ 停止按钮不可见 | **已修复**：`onToggle` 清 `openKey`；单测 + E2E 各一条 |
| 2 | B | 中 | `ZoneCard` 默认可折叠：收起 body 但阅读器仍挂载 → 声音继续 | **已修复**：本页 `collapsible={false}`，收起职责归课按钮 |
| 3 | B | 中 | `ReadingZone` 单句/整篇互锁失效（既有缺陷）：整篇连读中点单句会跳过被点的句子 | **已修复（单独提交）**：`playOne` 先 `stop()` 断链；E2E 先红后绿 |
| 4 | A | 低 | 缺短文时静默不渲染，但按钮显示「收起 ▲」 | **已修复**：保留空态兜底 |
| 5 | A | 低 | 记忆状态 E2E 属自证（`boxLevel(undefined)` 也是 unknown，boxOf 断了照样绿） | **已修复**：新增单测断言 box≥4 的词渲染为 `known` |
| 6 | A+B | 低 | `LessonPreview` 页头注释仍写「五区布局 / 📚 阅读区」 | **已修复** |
| 7 | B | 低 | 中文课名等有效内容用 `--ink-mute`（≈2.5:1）对比度不足 | **已修复**：改 `--ink-soft`（≈4.8:1） |
| 8 | B | 低 | E2E 只展开 Unit 1 | **已修复**：循环 1..12 断言每单元 8 课 |
| 9 | B | 低 | `boxOf` 内联箭头导致开篇重渲染、`srsCards` 订阅粒度粗 | **接受风险**：本页无 SRS 写入，开篇重渲染一次可忽略；收窄需 `useCallback` + `getState()`，收益不足 |
| 10 | B | 低 | `.reading-zone-card` 疑为死 CSS | **误报**：全仓无该 CSS 规则，删 className 属纯清理 |

审查方另行核实的「反例不成立」项：96 篇数据未动（`git diff` 无 `src/data/` 变更）；旧书签不受影响（阅读从未进 URL，全仓无 `tab=`/`useSearchParams`）；无迁移缺口（store 与 version 均未变）；无 SRS 播种 / STT / 测验副作用；单实例由 `openKey` 真保证。
