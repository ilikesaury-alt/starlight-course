# HANDOFF — 桌面化（Electron 桌面壳）

> dev-task Step 8 交接文档。回答「接下来从哪接着干」；「怎么做成这样的」见 `CONTEXT.md` 与实施记录，测试口径见 `docs/features/desktop/桌面化-交付文档.md`。

## 基线

- **最新 commit**：`116e236` feat(desktop): Electron 桌面壳 + NSIS 打包 + 冒烟探针，验收 7/7 通过（基线分支 `main`，父 commit `35f31f7`）
- **验收状态**：7/7 通过（2026-10-18，证据逐条在 `CONTEXT.md` 的「验收结果」表）
- **版本**：package.json `0.1.0`；安装包 `release/Starlight 学习伙伴 Setup 0.1.0.exe`（已 gitignore，不进版本库）

## 相关文件

| 文件 | 职责 |
|---|---|
| `electron/main.cjs` | 主进程：开窗（1280×800，contextIsolation）、dev 载 Vite server / prod 载 `dist/index.html`、`--smoke` 冒烟探针（非白屏/WebGPU/localStorage/云 TTS → JSON 退出） |
| `scripts/electron-build.mjs` | 打包脚本：`ELECTRON_BUILD=1` → vite 相对 base → electron-builder NSIS；默认注入 `ELECTRON_MIRROR`/`ELECTRON_BUILDER_BINARIES_MIRROR`；winCodeSign 预解压自愈（排除 darwin/linux 软链） |
| `vite.config.ts` | `ELECTRON_BUILD === '1'` 时 `base: './'`；桌面构建 `VitePWA` 用 `disable:` 开关（**不能**从 plugins 摘掉，否则 `virtual:pwa-register` 解析失败） |
| `src/main.tsx` | UA 守卫 `/Electron/i` 跳过 SW 注册（dev/prod 一并兜住） |
| `package.json` | `electron:dev` / `electron:build` / `electron:smoke` 三条命令；`build` 段（appId/productName/nsis） |
| `docs/features/desktop/桌面化-交付文档.md` | 测试/使用方视角六段交付文档 |
| `CONTEXT.md` | 本任务需求/方案/验收全记录（完成后将被下一任务覆写，历史信息以本文件 + 交付文档为准） |

## 复现/验证命令

```bash
npm run electron:dev     # 起壳开发态
npm run electron:smoke   # 构建 + 加载 + 冒烟 JSON（passed=true 为健康）
npm run electron:build   # 出 NSIS 安装包到 release/
npm run build && npm run e2e   # 网页版回归（应与基线一致）
npm run check && npm run test && npm run lint  # 全绿
```

## 未解决问题

1. **网页版 E2E 有 2 个既存失败**（改动前就在）：`audio-debug.spec.ts:18`、`review.spec.ts:30`。非桌面化引入，但迟早要修——建议单独开缺陷任务。
2. **图标定制是 Out**：安装包/窗口用 Electron 默认图标，视觉上未定制。想换图标 = favicon.svg → ico 转换 + electron-builder `icon` 配置，工作量小，随时可加。
3. **自动更新未做**（Out）：发新版需手动重新分发 exe。
4. CONTEXT.md 会在下一个任务（我的工作台）启动时被覆写——桌面化的需求/方案历史需要追溯时看本文件与交付文档。

## 猜测 vs 已验证（明确分开）

**已验证**：
- 7 条验收标准全部有证据（dev 态 smoke passed、安装包 + win-unpacked smoke passed、百度 TTS `audio/mpeg`、localStorage 写读断言、`sw.js` 存在、215 单测全绿、check/lint 全绿）
- winCodeSign 冷路径自愈（删缓存后重跑自动重新预置）
- e2e 2 个失败经 `git stash` 基线比对确认为既存问题

**未验证/凭推断**（改这些前先实测）：
- 发声「真实性」（不哑、不空白）只有链路程序化证据，**人工听音未逐条做**
- 断网场景、卸载重装清进度：交付文档列为人工用例，**尚未执行**
- 换一台机器（非本机核显）WebGPU 可用时 Kokoro 在壳内的表现：**完全没测过**
- NSIS 安装器「卸载是否清应用数据目录」（`partition: 'persist:starlight'` 的落盘位置）是推断，未实测
- mac/Linux 打包未配置也未验证

## 接下来从哪干

**任务队列**：桌面化（本任务，已收尾）→ **我的工作台**（首页重构，方案已定稿于 `docs/CONTEXT-我的工作台-待授权.md`，调研底稿 `docs/github-research-learning-workbench-2026-10-17.md`）。

工作台任务冷启动：读上述两份文档 → 走 dev-task 实施授权闸（方案已定稿，等 lichun 明确授权「开始实现」）→ 按 Step 3 实现。注意该方案定稿于 `35f31f7`，桌面化 commit（`116e236`）改了 `src/main.tsx` 的 SW 注册段与 `vite.config.ts` 的 base 段，实现时以最新代码为准。
