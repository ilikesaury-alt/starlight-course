# 本次需求 CONTEXT —— 英语听写 + 自然拼读模块（已归档）

> 流程：dev-task-flow（标准档 🟡）。本文件是本次任务贯穿「对齐→方案→验收」的单一活文档，**已归档**（随 commit `296aa30` 于 2026-10-21 归档）。


## 元信息
- 模式组合：规划/实现用当前会话模型；交叉对抗审查用 general-purpose 子 Agent；人工 Review 由用户。
- 定档：🟡 标准（多文件、含 SRS/错题本状态写入、有方案权衡）。

## 要解决的问题
- **用户画像**：8 岁，三年级上册；两年听力启蒙（Little Fox / Big Muzzy），日常刷百词斩反复刷词。
- **痛点**：今年三年级开始做单词听写，发现"很简单的词都不会写"。
- **根因（已分析）**：听/说/理解 ≠ 拼写。两年练的全是前三者，"音→形"反向编码（拼写）从未专门练；百词斩是"认词/再认"而非"写词产出"。三年级体系突然要求听写，需求从"听懂"跳到"写对"，落差大、非退步。
- **本功能目标**：补上"自然拼读 + 拼写"这座桥，让已有听力优势转化为拼写能力，对应学校听写节奏。

## 范围（In / Out）
- **In（本版本）**：
  - 首页独立入口「✍️ 听写练习」+ 独立路由 `/dictation`。
  - 内容**只从 eng3a（三年级上册英语）** 来：单元（Welcome / Unit 1–6）+ 可选剧本词。
  - 听音写词（键盘 + 移动端屏幕字母盘）。
  - 自然拼读桥接：音素格子（Elkonin box）/ 金字塔拼写 / 拼读提示阶梯。
  - 即时反馈：两试一揭（第一次错可改+给线索，第二次错揭答案）。
  - 结果回灌：错词进错题本 `/wrong`；每词结果进 SRS `/smart`。
  - 会话报告：正确率、连对、得分星、错词清单。
- **Out（本版本不做，留 Phase 2）**：
  - 跨模块取词（starlight / flyguy / 错题混合自适应）。
  - 手写字母输入。
  - 成就徽章系统、自适应选词（按 SRS 到期）。

## 数据规格（输入/输出）与边界、异常处理
- **输入（取词源，全部复用现有，零新增词库）**：
  - `src/data/modules.ts` → `eng3aMeta.items`（单元 + 剧本）+ `getWords(itemId)`，覆盖 单元重点词 + 补充词（moreWords）+ 剧本重点词。
  - 子集：全单元词 / 仅错题（`getWrongWords('eng3a')`）/ 长度过滤（短词优先）。
- **输出（写入）**：
  - 错词：`addWrongWord({ en, zh, module:'eng3a', from })` → 错题本。
  - 复习：`recordReview(en, correct, 'eng3a')` → SRS 调度。
  - 本轮临时状态（streak / 正确数 / 错词列表）放组件 `useState`，结束生成报告，无需持久化。
- **异常处理**：
  - 取词为空（如"仅错题"但错题本空）：提示并给兜底入口（去全单元词 / 先去学）。
  - 语音不可用（WebSpeech 缺失/被拦截）：沿用现有 `speakService` 兜底链 + SafeBoundary；按钮降级仍可键盘输入。
  - 首屏需用户手势激活音频（移动端自动播放策略）：进词自动朗读放在真实点击之后。

## 关键决策与取舍
- **独立入口而非课内 Tab**：用户选 B。理由——直击痛点、闭环最短、操作步骤最少。
- **内容先只 eng3a**：用户指定。降低一版复杂度，数据现成。
- **听音写词为核心，而非看词抄写**：正中"音→形"短板。
- **两试一揭而非一次判死**：降低 8 岁孩子挫败感。
- **不新增持久化字段**：避免 localStorage 迁移（version 已到 8），全部复用 `wrongWords` + `srsCards` + 组件临时态。
- **phonics 用轻量规则**（CVC / digraph th,sh,ch,ck / 魔术 e），不追求语言学精确，只要"分段对应"够用。

## 约束
- 技术栈：React 18 + TS + Vite + Zustand + Tailwind（既有）。HashRouter。
- 配色：复用工 3a 主题（蓝 #2563eb / #dbeafe）与 `moduleThemeVars`。
- 语音：复用 `SpeakButton` / `speakText` 既有英文兜底链。
- 复用现有星规 `quizStars`、错题本 `WrongBook`、智能复习 `/smart`。
- 过 `npm run check` + `npm run lint`。

## 验收标准（写死）
1. 首页出现独立「✍️ 听写练习」卡片，点击进入 `/dictation`。
2. `/dictation` 可按 eng3a 单元（含剧本可选）选范围，并支持"仅错题 / 长度过滤"子集。
3. 进入练习后自动朗读单词（用户手势后）；提供 🔊 重听与慢速。
4. 孩子听音后写词：键盘 + 移动端屏幕字母盘均可输入。
5. 反馈规则：第一次错 → 红 + 拼读线索（可重听/看音素格子），可改；第二次错 → 揭晓正确拼写 + 音素拆分布局；对 → 绿 + 鼓励 + 自动进下一词。
6. 自然拼读桥接：每词提供音素格子（按词长动态 N 格，可逐音素朗读）与金字塔拼写提示。
7. 拼写错误的词进入错题本（`/wrong` 中 `module='eng3a'` 可见）；每词对错结果写入 SRS（`recordReview`）。
8. 一轮结束显示会话报告：正确率%、最长连对、得分星、错词清单（可再听写一次）。
9. 所有验收项对应功能在 `npm run check` + `npm run lint` 下无类型/lint 错误。

## 术语表
| Business Term | Code Naming | Description |
|---|---|---|
| 听写 | Dictation | 听音写词练习 |
| 音素格子 | phonemeBoxes / Elkonin box | 把单词按音素切分可视化 |
| 金字塔拼写 | spellingPyramid | c/ca/cat 逐步展开提示 |
| 两试一揭 | two-try-then-reveal | 第一次错可改，第二次错揭答案 |
| 仅错题 | wrong-only | 从 eng3a 错题本取词 |

## 已知风险 / 踩过的坑
- 语音三防护已在本 App 建立（`speakService` 兜底链 + SafeBoundary），沿用即可。
- 首屏音频需用户手势激活（移动端自动播放策略）——进词朗读须放真实点击后。
- `version: 8` 的 localStorage 迁移已有逻辑，不新增持久化字段以免触发迁移风险。

## 待决点（写代码前需用户确认）
- D1（已定=B）：练习主形态 = 听音写词 + 三选一拼写（默认听音写词）。
- D2（已定=不做）：第一版不做手写字母输入，留 Phase 2。
- D3（已定=接受）：phonics 用轻量规则（非语言学精确）。
- D4（已定=保留）：设计稿 `docs/dictation-design.md` 保留作参考。

## 已确认方案
> 见下方「方案设计」段。本段由 design-plan 产出，含 code-reality-check 现状基线。

### 方案设计（design-plan · 标准档 🟡）

**问题本质（第一性原理）**：孩子两年练的是「听→理解/说」的单向输入，缺的是「听→形」反向编码 + 音素↔字母映射（phonics）。功能本质不是"再认词库"，而是**把已听懂的声音，转成可写出的字母序列**，并在过程中显式教音素切分。

**方法触发表**：
- 改造/沿用现有方案（独立入口复用 eng3a 取词 + 既有 SRS/错题本写入 + 既有语音/星规）→ **第一性原理**已做（重定义问题本质）。
- 方案为本会话所出 → **对抗性审查**必跑（第 3.5 复核 + 第 5 步子 Agent）。
- 新增机制（独立 DictationPage + DictationPlayer + phonics 工具 + 屏幕字母盘）→ **奥卡姆剃刀**已自检（删可删项见下）。
- 拆模块划边界 → **高内聚低耦合**已自检（页面/播放器/工具分离）。
- 无"拿不准收益"的机制 → 消融实验未触发。

**方案对比（核心形态取舍）**：
| 方案 | 做法 | 收益 | 代价 | 风险 |
|---|---|---|---|---|
| A 只听音写词 | 听→键盘/字母盘写 | 最贴音→形 | 起步门槛高，易挫败 | 低 |
| B（推荐）听音写词+三选一 | 两种模式，默认听音写词 | 起步友好+核心训练都在 | 多一套 UI | 低 |
| C 只三选一 | 给3拼法选对 | 最易 | 不练"写"，治标 | 偏离核心 |
→ 选 B：三选一作起步缓冲，听音写词作核心，二者共享同一取词/反馈/回灌管线。

**推荐方案 + 模块边界**：
1. `src/pages/DictationPage.tsx`（路由 `/dictation`，lazy）：范围选择 + 模式选择 + 流程编排 + 会话报告。
2. `src/components/DictationPlayer.tsx`：单轮（听→写/选→反馈→音素格子/金字塔）。
3. `src/data/phonics.ts`（待建）：phonemeBoxes / spellingPyramid / phonicsHint（轻量规则）。
4. `src/App.tsx`：加 `/dictation` 路由（lazy）。
5. `src/components/CourseEntries.tsx`：首页加独立卡片。
6. 样式：复用既有 `.page/.btn/.card/.speak-btn` 与主题令牌；少量 dictation 专属 class。

**现状标注（code-reality-check 已逐项核实）**：
- `eng3aMeta.items` / `getWords(itemId)`（`src/data/modules.ts`）：**已存在**，覆盖单元+剧本重点词+补充词。
- `getWrongWords('eng3a')` / `addWrongWord` / `recordReview`（`src/store/useCourseStore.ts`）：**已存在**，错题本+SRS写入接口就绪。
- `SpeakButton` / `speakText`（`src/components/SpeakButton.tsx` / `src/utils/speak.ts`）：**已存在**，英文兜底链复用。
- `quizStars`（`src/utils/stars.ts`）：**已存在**，会话报告得分星复用。
- 路由结构（`src/App.tsx` HashRouter + lazy）：**已存在**，加一路由即可。
- 首页入口（`src/components/CourseEntries.tsx`）：**已存在**，加一张卡片即可。
- `phonics.ts`：**待建**（本方案新建，轻量规则）。
- `DictationPage` / `DictationPlayer`：**待建**。

**高风险点**：
- 音频激活：移动端首屏自动朗读需用户手势，进词朗读放真实点击后（沿用现有 SafeBoundary）。
- 状态写入一致性：错词/复习写入沿用既有 store 接口，不新增持久化字段（避 version 8 迁移）。
- 屏幕字母盘在桌面/移动端都要可达，且不影响键盘输入。

**奥卡姆剃刀自检**：不做手写（D2）、不做跨模块/自适应（Phase 2）、不新增持久化——本版本机制已最简。

## 验收证据

### 第 4 步 实现证据
- `src/data/phonics.test.ts`：8 项通过（音素格子 CVC/digraph/魔术e/清理、金字塔、提示文本、短词判定）
- `src/utils/dictation.test.ts`：13 项通过（取词去重/长度过滤/干扰项变形/编辑距离/选项唯一/洗牌不污染入参）
- `src/pages/DictationPage.test.tsx`：3 项通过（设置页渲染+词池非空、空错题本禁用+兜底提示、渲染不加星）
- 全量回归：`npm run test` → **21 文件 / 239 项通过**，无失败
- 静态：`npm run check` 通过；`npm run lint` 零告警
- 构建：`npm run build` 成功，`DictationPage` 独立 chunk（50.43 kB / gzip 8.29 kB）

### 第 5 步 交叉对抗审查（处置留痕）
> 原计划交 reviewer 子 Agent，**该子 Agent 超时失败（1800s 无输出）**，未重跑；改由主 Agent 直接执行对抗审查（读代码 + 写探针脚本 + 真实词切分验证）。

| # | 问题 | 定位 | 严重度 | 处置 |
|---|---|---|---|---|
| A1 | `earnStars()` 写在 JSX 里，内部调 `addStars` → 每次重渲染重复加星，刷新/重渲染会把星星刷爆 | DictationPage.tsx:320（原） | **阻塞** | 已修：改为进入 report 时 `setStars`+`addStars` 各一次；新增 `stars` state + 回归测试「渲染不加星」 |
| A2 | 末尾词结算时 `correctCount` 被 setTimeout 闭包捕获为旧值 → 正确率/星数算错 | DictationPage.tsx handleAdvance | **阻塞** | 已修：新增 `correctRef` 镜像，结算读 ref 而非 state |
| A3 | 三选一干扰项是随机字母串（如 `xqz`）→ 孩子一眼排除，三选一退化成「找哪个像单词」，练不到音→形 | dictation.ts pickDistractors（原） | **重要** | 已修：改为对原词做小变形（换元音/换辅音/双写/删字母/相邻换位/魔术e），并加两条测试（共享字母数、编辑距离≤2）守住 |
| A4 | `wrongWords` 只依赖 `[phase]`，本轮写入的错词回到设置页读不到 → 「只练错题本」是过期快照 | DictationPage.tsx useMemo | **重要** | 已修：改用 `setupEpoch` 显式触发，`backToSetup` 递增 |
| A5 | 计分口径未显式化：第一次错（已 settle(false)）后改对，UI 显示🎉但计错 | DictationPlayer.tsx settle | 建议 | 判定为**设计如此**（首次独立写对才是掌握度），已补注释写清口径，避免后人误改 |
| A6 | 音素切分教学准确性抽查（apple→`a\|p\|p\|le`、banana→逐字母、cake→`c\|a\|ke`、chick→`ch\|i\|ck`） | phonics.ts | 建议 | 判定**可接受**：轻量规则定位为「分段对应」，不声称音素学精确；D3 已与用户确认接受此精度 |
| A7 | 未使用 import / dead code（`LETTERS` 常量、`streak`/`allWords` 变量） | dictation.ts / DictationPage.tsx | 建议 | 已清（lint 零告警即为证据） |
| A8 | 越界检查（手写/跨模块/自适应） | 全部改动 | — | **无越界**：未实现手写、未跨模块取词、无自适应选词，符合 CONTEXT Out of scope |

结论：A1/A2 两个阻塞级问题已修复并被测试守住；A3/A4 重要问题已修复；无遗留阻塞。

### 第 11 步 E2E 证据（Playwright，chromium）
- 新增 spec：`tests/dictation.spec.ts`（10 条）
- **听写专项 10/10 通过**（43~48s）
- **全量 E2E：68 passed / 1 failed / 3 skipped**
  - 唯一失败 `tests/audio-debug.spec.ts:18`「默认不挂载面板」**为既有失败，与本任务无关**：
    已用 `git stash` 清空工作区后在基线 commit 上复跑同一用例，同样失败（`heading Say Hello` 找不到，
    疑为 `/#/preview/hello/1` 路由数据变更导致）。本任务未触碰该页面。
  - 3 skipped 为既有 `describe.skip`（跟读区降级闭环，AGENTS.md 已说明）。
- 过程中修正 1 个**测试自身缺陷**（非产品 bug）：T2 计数正则 `（(\d+)）` 匹配不到实际文案
  「开始听写（10 个）」中的"个"字，导致误报 0。
- 过程中补强 1 处**测试覆盖名不副实**：原 T4 声称测「答对分支」实际走的是答错→揭晓路径；
  已改为先拿答案再重开轮次真答一次，未抽到该词时显式 `test.info().annotations` 标注而非静默通过。
- E2E 覆盖的用例：T1 入口、T2 词池、T3 空错题本兜底、T4 答对反馈、T5 两试一揭、
  T6 干扰项变形质量、T7 音素格子、T8 金字塔、T12 星数一次性、完整走完一轮进入报告页且 0% 自洽。
- **仍未自动化（需真机人工）**：真实设备能否出声（headless 的 speechSynthesis 被 mock，
  playwright.config.ts initScript 已说明）、移动端字母盘触控手感、1.1s 自动推进的观感。

## 流程状态
- 第 0 步 定档：🟡 标准（已完成）
- 第 1 步 准备：CONTEXT.md 已初始化；测试环境（vitest/tsc/lint）可用（第 4 步确认）。
- 第 2 步 需求对齐：草稿已沉淀，D1–D4 已确认（B/不做/接受/保留）。
- 第 3 步 方案设计：已完成（含 code-reality-check 现状基线，全部已存在项已核实）。
- 第 3.5 步 复核：已完成（六项逐项过，用户已授权实现）。
- 第 4 步 实现：已完成（M0 通过：取词/干扰项/选项纯逻辑先测红；改动落地；既有 239 项测试全绿）。
- 第 5 步 交叉对抗审查：已完成（子 Agent 超时 → 主 Agent 代执行；8 项发现，2 阻塞 2 重要均已修，逐条留痕于上方表格）。
- 第 6 步 人工 Review：**用户确认「通过」**（含验收标准 3 未完全达成——无自动朗读——已说明并获接受）。
- 第 7 步 交付文档：已完成（docs/features/dictation/听写练习-交付文档.md，14 条用例）。
- 第 8 步 提交/MR：已完成 —— commit `296aa30`（18 文件），描述中**已标 E2E pending**。
- 第 9 步 HANDOFF：已完成（docs/features/dictation/HANDOFF.md，含 revision/路径/命令/未决/猜测vs已验证）。
- 第 10 步 复盘：已完成（见下）。
- 第 11 步 E2E：**自动化部分已完成** —— 新增 `tests/dictation.spec.ts`（10 条全过）；
  全量 E2E 68 passed / 1 failed（既有失败 audio-debug，已用 stash 在基线上复现排除）/ 3 skipped。
  剩余需真机人工确认项：真实设备出声、移动端字母盘触控、自动推进观感（见交付文档第 4 节）。

### 第 10 步 复盘（capture-experience）
- **重复 3 次以上的流程？** 无。本流程的重复环节是「先写测试红 → 实现绿」，这是 implement 纪律本身，非本次新发现的可复用流程。
- **本工作流漏了什么？**
  1. **第 5 步子 Agent 可能长时间挂死**：reviewer 子 Agent 跑满 30 分钟无输出后超时，浪费了大量等待时间。建议：dev-task-flow 后续给第 5 步明确「子 Agent 超时即由主 Agent 代执行」的降级路径（本次即如此处理），避免调度失败把流程卡死。
  2. **「渲染期调用 store 写方法」是本项目的高频陷阱**：`addStars` 写在 JSX 里导致重复加星。这类问题测试很难自然想到，但危害直接。建议沉淀为一条检查项：「任何 store 写操作不得出现在 render 表达式里」。
  3. **首页宫格 `last-child` 满宽规则对卡片数量敏感**：本次新增第 6 张卡即产生布局回归。改动 `home-entries` 前应先数卡片奇偶。
- **哪些 DoD 该提前？** 「布局/视觉回归」没有自动化兜底（本项目无视觉回归测试），本次靠人工发现。若后续频繁加首页卡片，可考虑加一条轻量 DOM 结构断言。
- **过时约束清理**：无。本次新增的约束（星数一次性结算、干扰项必须变形）已写进 docs/features/dictation/HANDOFF.md「关键实现约定」，属有效约束，保留。
