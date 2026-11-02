# 验收报告: 阅读模块（阅读短文提升为独立模块 /#/reading）

> 规则：每一项验收标准 → 对应代码位置 → 那次测试的证据。没有链接的条目不许写「通过」。
> 工作流：ai-dev-flow。Spec：`docs/specs/reading-module.md`（§7 为交叉审查结论）。

## 0. 结论

- 状态：✅ **全部通过**（1 条既有缺陷已一并修复，见 §3；未验证项见 §4）
- 分支 / commit：`feat/reading-module`，基线 `main@11dfc3b`，当前 `3405bcf`
  - `ea3b0f0` feat(reading): 独立阅读模块（页面 / 路由 / 首页入口 / 样式 / 单测）
  - `274b788` refactor(lesson): 移除课内「📚 阅读」Tab
  - `9d26ccc` fix(reading-zone): 整篇连读中点单句被吞
  - `3405bcf` test(reading): 阅读模块 E2E（含迁移用例）
- 变更规模：11 文件，+812 / −198（其中新增测试 473 行；`LessonPreview` 净删 38 行）

## 1. 验收标准逐项核对

| # | 验收标准 | 结果 | 代码位置 | 证据 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 1 | 首页宫格出现「📚 阅读」入口，点击进入 `/reading` | ✅ | `src/components/CourseEntries.tsx:96`；`src/App.tsx:91` | `$ npx playwright test tests/reading.spec.ts` → `✓ 首页有「阅读小故事」入口，点了进入 /reading`（断言 `.rd-home-entry` 可见 + `toHaveURL(/#\/reading$/)`） | |
| 2 | 12 个单元、每单元 8 课 | ✅ | `src/pages/ReadingPage.tsx:61-95` | 单测 `✓ 渲染 12 个单元、96 课阅读入口`；E2E `✓ 12 个单元全部列出；每个单元都是 8 课`（循环 1..12 断言各 8 条）+ `✓ 页面上的课卡片数 = 课表课数（96）` | 12 单元循环是审查后加严 |
| 3 | 点课卡片内联展开：`.reading-zone`、中英文标题、本课词高亮 | ✅ | `src/pages/ReadingPage.tsx:97-121` | 单测 `✓ 点课卡片就地展开短文本体`；E2E `✓ 点课卡片就地展开短文`（`.reading-sent`≥8）+ `✓ 本课词有高亮标记`（`tt-word--mark`≥5） | |
| 4 | 阅读器交互完整：听整篇/停止、中文开关、逐句小喇叭 | ✅ | `src/components/ReadingZone.tsx`（复用） | E2E `✓ 「听整篇」进入朗读态，再点停止`、`✓ 中文对照默认关，开关可切换`、`✓ 逐句朗读：每句一个小喇叭，点一下读这句、再点一下停`、`✓ 朗读时非当前句淡化`、`✓ 显示中文时译文排在英文下方` | |
| 5 | 一次只展开一篇；收起/切走无残留朗读 | ✅ | `ReadingPage.tsx:66-72`（openKey 单值 + `onToggle` 清态） | 单测 `✓ 一次只展开一篇`、`✓ 再点同一课会收起`、`✓ 收起单元会卸载阅读器`、`✓ 收起其他单元不会误杀当前阅读`；E2E `✓ 一次只展开一篇：点另一课会收起上一篇`、`✓ 听整篇过程中收起单元 → 阅读器卸载，朗读链断开` | **审查抓到的 P1**，原实现收起后仍在朗读 |
| 6 | 课内不再有「阅读」Tab，引用只剩新页 | ✅ | `src/pages/LessonPreview.tsx`（Tab 类型/Tab 栏/渲染块全删） | `$ grep -rn "ReadingZone\|getReadingPassage" src` → 仅命中 `ReadingPage.tsx` 与组件自身定义；E2E `✓ 「🗣️ 跟读」「📚 阅读」已移出课内 Tab，只剩五个标签`（`.tab-btn` = 5）；`npm run lint`/`check` 0 错误 | |
| 7 | 96 篇数据完好（覆盖度回归） | ✅ | `src/data/reading/**`（零改动） | `$ git diff --stat main...HEAD -- src/data` → 空；单测 `src/data/readingPassage.test.ts` 全绿（含在 313 内）；E2E `✓ 全 96 课都有阅读短文` | |
| 8 | `check` / `lint` / `test` 全绿 | ✅ | — | 见 §2 命令与输出 | |

## 2. 端到端执行记录

```
环境：本地 Windows + node v22.22.2 + Vite dev server（Playwright webServer 复用）+ headless Chromium
命令 1：$ npm run check      → tsc -b --noEmit && tsc -p tsconfig.test.json --noEmit  → 无输出（通过）
命令 2：$ npm run lint       → eslint .                                              → 无输出（通过）
命令 3：$ npx vitest run     → Test Files 24 passed (24) / Tests 313 passed (313)
命令 4：$ npx playwright test（全量，10 个 spec）
       → 87 passed / 4 skipped / 0 failed (2.6m)
         其中 skipped = 3 条既有「跟读区（降级闭环）」describe.skip
                    + 1 条 alphablocks A7 的条件自跳过（40 轮未抽到含重复块词，与本改动无关，该文件未修改）
       阅读模块子集（19 条）：全部 passed
视觉取证：docs/shots/reading-1-collapsed.png / -2-unit-open.png / -3-reader-zh.png / -4-desktop.png
```

失败与修复过程（审查后新增的两条红灯，均先复现后修复）：

```
失败现象 1：收起单元后 .reading-zone 仍在 DOM、朗读继续，⏸ 停止按钮随内容隐藏
定位：原生 <details> 收起只隐藏子树，不卸载 React 子树；openKey 仍指向该课
根因：折叠容器未受控
修复：details onToggle 关闭时清 openKey（ReadingPage.tsx:66-72）
重测：✓ 单测「收起单元会卸载阅读器」✓ E2E「听整篇过程中收起单元 → 阅读器卸载」

失败现象 2：整篇连读中点第 5 句小喇叭，该句 data-busy 始终为 0（真浏览器红灯）
定位：speakService.speakText 先同步触发旧会话 done() → 链内 playFrom(i+1) 另起会话 →
      外层 sid 过期却覆盖 activeEnd
根因：ReadingZone.playOne 依赖「内部抢占」，实际抢占不存在
修复：playOne 起句前若仍在连读先 stop() 断链（ReadingZone.tsx:116-125）
重测：✓ E2E「整篇连读中点某一句：读的是被点的那一句（不被连读吞掉）」
```

## 3. 交叉审查结论

两个独立上下文的只读审查（`reviewer`，A 对抗性 / B 安全与一致性），未携带实现过程。

| 审查方向 | 结论 | 发现数 | 已修复 | 接受风险 | 误报 |
| --- | --- | --- | --- | --- | --- |
| A 对抗性审查 | OK with notes（无 P0/P1） | 5 | 4 | 1（并入了 B#9） | 0 |
| B 安全与一致性 | BLOCK（仅因 #1）→ 解除 | 7 | 6 | 1 | 1 |

逐条处置见 `docs/specs/reading-module.md` §7。摘要：

- **修复 7 条**：收起单元不停声（P1）、`ZoneCard` 二级折叠留活阅读器、`ReadingZone` 单句/整篇互锁（既有缺陷，单独 commit）、缺短文空态、记忆状态测试自证、页头注释漂移、中文对比度不足、E2E 只展开 Unit 1。
- **接受风险 1 条**：`boxOf` 内联箭头 + 订阅整张 `srsCards` 会带来一次多余重渲染 —— 本页无 SRS 写入，开篇重渲染一次可忽略；收窄需 `useCallback` + `getState()`，收益不符奥卡姆剃刀。退路：若后续本页出现 SRS 写入，再改为按需读取。
- **误报 1 条**：`.reading-zone-card` 并非死 CSS（全仓本就无该规则），删 className 属纯清理。

审查方另行核实的「反例不成立」：96 篇数据未动、旧书签不受影响（阅读从未进 URL）、无迁移缺口（store/version 未变）、无 SRS/STT/测验副作用、单实例由 `openKey` 真保证、卸载必达 `cancelSpeech`。

## 4. 未验证项

| 验收项 | 未验证原因 | 替代验证 | 遗留风险 |
| --- | --- | --- | --- |
| 「真的出声」 | headless 无真实语音后端（云 TTS 需联网、speechSynthesis 已在 fixture mock），验了只会假绿 | 只验 UI 契约（进入朗读态/停止、busy 标记、dimming） | 低：发声链路本次零改动，沿用既有 `speakService` |
| 移动端真机手感（触控目标、滚动跟随） | 无真机 / 本次仅在 Chromium 420px 视口下截图 | `docs/shots/reading-3-reader-zh.png`（420×900 移动视口） | 低：沿用既有 `.reading-*` 排版，仅新增模块外壳样式 |
| 12 单元 × 96 篇逐篇人工通读内容质量 | 属内容资产评审，非本轮代码改动的验收项 | 既有 `readingPassage.test.ts` 口径校验（零超纲/篇幅/本课词覆盖） | 低：数据零改动 |

## 5. 人工 Review 清单

只需要人看这几项：

- [ ] **测试结果是否真的覆盖验收标准**（不是覆盖率数字）：
  - `src/pages/ReadingPage.test.tsx`（12 条）—— 重点看「收起单元会卸载阅读器」「boxOf 真的接线」这两条是否按你的理解钉住了行为
  - `tests/reading.spec.ts`（19 条）—— 重点看「听整篇过程中收起单元」「整篇连读中点某一句」
- [ ] **核心业务逻辑**：
  - `src/pages/ReadingPage.tsx:63-72`（`<details>` 的 `onToggle` 清 `openKey`：这是「收起即停声」的唯一保证）
  - `src/components/ReadingZone.tsx:116-125`（`playOne` 先 `stop()` 断链：1 行改动，但改变了既有的「抢占」语义）
- [ ] **未验证风险**：§4 三条是否接受
- [ ] 可略过：`_reading.scss` 纯样式、`docs/shots/*` 截图、`_theme.scss` 一行主题色

## 6. 建议下一步

- 提交 MR / 合并到 `main`（4 个 commit 可独立阅读）。
- **既有缺陷（不在本次范围，建议单开）**：全站大量按钮用 `className="btn btn-soft"`，但 CSS 只定义了 `.btn--soft`（双连字符）。因此这些「软按钮」实际渲染成实心深色 `.btn`。`ReadingZone` / `PlayTools` / `LessonList` 都受影响 —— 属全站视觉一致性问题，改动面广，未在本轮处理。
- **可选后续**：阅读「已读进度」（需 store 字段 + localStorage 版本迁移）；`boxOf` 订阅粒度收窄（本页若引入 SRS 写入再做）。