# HANDOFF · 听写练习（/dictation）

> 冷启动入口：未来会话要改这个功能时，先读本文件，再读 `docs/CONTEXT-听写练习-已归档.md`（决策/验收）与 `docs/features/dictation/听写练习-交付文档.md`（面向测试/业务）。
> 本文件回答「从哪接着干」；归档的 CONTEXT 回答「怎么做成这样的」。

## 当前状态（revision）

- **功能已提交：** `296aa30`（听写模块）+ `811cd14`（E2E 第 11 步）。
- **UI/交互重构：** 本次提交（一字一盒 / 听音主操作 / 逐格标色 / 退出 / 报告环 + 星星），规则层抽到 `src/utils/dictationSlots.ts` 并补 19 项单测。
- 已完成：需求对齐 → 方案 → 实现 → 对抗审查 → 人工 Review → 交付文档 → 提交 → E2E → **UI 重构**。
- 剩余：**真机人工确认**（出声 / 触屏字母盘手感 / 1.1s 自动推进观感），见文末「未验证」。

## 改动文件

**新增**
```
src/data/phonics.ts                 音素切分 / 金字塔 / 拼读提示（轻量规则）
src/utils/dictation.ts              取词池 / 长度过滤 / 干扰项 / 三选一 / 洗牌
src/utils/dictationSlots.ts         ★ 一字一盒规则层（比对口径 / 铺格 / 第几个字母错）
src/components/DictationPlayer.tsx  单轮：听→写/选→反馈→音素格子/金字塔
src/pages/DictationPage.tsx         范围+模式选择 / 流程编排 / 会话报告 / 回灌
src/styles/_dictation.scss          听写相关样式
src/data/phonics.test.ts            8 项
src/utils/dictation.test.ts         13 项
src/utils/dictationSlots.test.ts    ★ 19 项（逐格判色 / 漏写虚线 / 撇号与空格 / 部分正确 / 多打字）
src/pages/DictationPage.test.tsx    3 项（页面级：渲染/兜底/不加星回归）
src/pages/__dictationTestHelpers.ts 测试辅助（读 eng3a 真实词池）
docs/dictation-design.md            前期调研+草图（非正式口径，参考用）
docs/features/dictation/听写练习-交付文档.md
tests/dictation.spec.ts             E2E 12 条
```

**修改**
```
src/App.tsx                  加 lazy import + <Route path="/dictation">
src/components/CourseEntries.tsx  首页加「✍️ 听写练习」卡片
src/styles/_theme.scss       加 dt-home-entry mixin 调用（青绿）
src/index.scss               注册 styles/dictation
docs/CONTEXT-听写练习-已归档.md  需求/方案/验收/证据/流程状态
```

## 复现验证命令

```bash
npm run check                                        # tsc（含 e2e tsconfig）
npm run lint                                         # ESLint，应零告警
npm run test                                         # 全量 258 项 / 22 文件
npx vitest run src/utils/dictationSlots.test.ts src/utils/dictation.test.ts src/data/phonics.test.ts src/pages/DictationPage.test.tsx
npx playwright test tests/dictation.spec.ts          # 听写 E2E 12 条
npm run build                                        # 产 dist/，DictationPage 独立 chunk
npm run dev                                          # 手动看 #/dictation
```

## 关键实现约定（改代码前必读）

1. **星数只在进入报告页时结算一次**（`handleAdvance` 里 `quizStars` + `addStars`）。
   ❌ 绝不要在 JSX/渲染期调用 `addStars` —— 曾因此重复加星（对抗审查 A1）。
   已有测试守住：`DictationPage.test.tsx` 的「渲染设置页本身不会改变 totalStars」。
2. **结算读 `correctRef` 而非 `correctCount`** —— `onAdvance` 会被 `DictationPlayer` 的
   `setTimeout` 闭包捕获，读 state 会拿到上一轮旧值（对抗审查 A2）。
3. **计分口径**：首次独立写对才算对；第一次错第二次改对**仍计错**（进错题本）。
   这是有意设计，`DictationPlayer.tsx` 的 `settle` 上方有注释说明，勿当 bug 改。
4. **干扰项必须是原词的"小变形"**（换元音/换辅音/双写/删字母/相邻换位/魔术 e），
   不是随机字母串。测试用「共享字母数」+「编辑距离 ≤2」两条约束守住。
5. **`wrongWords` 用 `setupEpoch` 触发重算**，因为 `getWrongWords` 是 store 读方法、非订阅式；
   靠 `[phase]` 会读到过期快照（A4）。
6. **零新增持久化字段**：只复用 `wrongWords` / `srsCards`，`persist version: 8` 不动。
7. **一字一盒的规则全在 `src/utils/dictationSlots.ts`**，组件不得再内联一份：
   - `spellingLetters` / `isSpellingCorrect` 是**唯一**比对口径（去空白、小写、只留字母）——
     撇号（`let's` → `lets`）与空格（`Ms Smart` → `mssmart`）都不需要孩子打出来。
   - `buildDictationSlots(answer, input, status)` 决定铺几格、哪格绿/红/虚线：
     - `idle`：尾部留一个空光标格（提示「可以继续写」）；
     - `correct` / `wrong`：**不留**尾部空格。`wrong` 时没写到的字母必须是 `missing`（虚线），
       否则「还差几个」看不出来 —— 这个 bug 曾被单测抓到（同一条判断写两遍时，虚线分支根本走不到）。
   - `firstMistakeIndex` 给「第 n 个字母不对」的人话提示，1 基。
8. **`✕ 退出` 直接回设置页**：不结算星星、不弹确认（`backToSetup`）。本轮已写入的错词/SRS 记录仍在
   （`onSettled` 每词即时落库），因此「退出」只是丢弃剩余进度，不是撤销。
9. **E2E 选择器契约**（`tests/dictation.spec.ts` 依赖，勿改）：
   `input.dt-input` / `'✅ 检查'` / `'我拼不出来'` / `'多给一个字母'` / `'下一个'` /
   `.dt-feedback.ok|warn|bad` / `.dt-answer` / `.dt-boxes` / `.dt-box-text` / `.dt-slot.is-ok|is-bad|is-missing|is-punct` /
   `.dt-pyramid-step.is-on` / `.dt-choice` / `.dt-modes` / `.dt-ring` / `.dt-stat-num`（**第一个必须是正确率**）。

## 未解决问题 / 待办

| 项 | 说明 |
|---|---|
| 真机人工确认 | **唯一剩余项**：真实设备出声、移动端触控手感、1.1s 自动推进观感（自动化覆盖不到） |
| 已知设计取舍 | 两试一揭的计分口径、轻量音素切分、`✕ 退出` 不结算不确认——见交付文档第 5 节，**不是待修 bug** |
| 撇号分支无真实数据 | eng3a 词表没有含撇号的单词（撇号只在例句里），`let's` 格子逻辑目前只有单测覆盖 |
| 后续 Phase 2 | 手写输入、跨模块取词、按 SRS 到期自适应选词（见归档 CONTEXT 的 Out of scope） |

## 猜测 vs 已验证（明确分开）

**已验证**
- ✅ 258 项单测全绿（22 文件）、lint 零告警、`npm run check` 通过、`npm run build` 成功
- ✅ 一字一盒规则有 19 项单测：逐格判色、漏写虚线、部分正确、多打字、撇号格、空格式、第 n 个字母提示
- ✅ 干扰项为原词变形（编辑距离 ≤2 已断言）
- ✅ 渲染不重复加星（已断言）
- ✅ 空错题本时按钮禁用 + 兜底提示（已断言）
- ✅ 词池确实来自 eng3a 真实教材数据（已断言 >20 词）
- ✅ 音素切分在真实词上的输出已逐个打印核对（apple/banana/cake/chick/ship/this/name/green/book/teacher…）
- ✅ **E2E（Playwright 12 条全过，`--repeat-each=2` → 24/24 稳定）**：首页入口、词池计数、空错题本兜底、
  两试一揭、答对反馈、音素格子、金字塔逐阶、星数一次性、完整走完一轮（0% + 正确率环）、
  一字一盒逐格标色（T17）、中途退出（T18）
- ✅ **全量 E2E 无失败**：71 passed / 0 failed / 3 skipped

**未验证（需真机人工确认）**
- ⬜ 真实设备上 🔊 能否出声 —— headless 的 `speechSynthesis` 被 playwright.config 的 initScript mock，
  自动化测不到真实音频链路（云 TTS 可用性依赖网络/设备）
- ⬜ 移动端字母盘 26 键的实际触控手感（E2E 已验证可点，但触屏手感无法自动化）
- ⬜ 答对后 1.1s 自动进下一词的观感是否合适（未做真实使用时长测试）
- ⬜ "第一次错第二次改对仍计错" 在孩子实际使用中的心理接受度（教学口径判断，非技术验证）
- ⬜ `✕ 退出` 不加确认是否会让孩子误触丢成绩（真实使用中才能看出来）
