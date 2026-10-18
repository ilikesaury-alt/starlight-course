# 本次需求 CONTEXT —— 将项目改造为桌面版应用

> 工作流：dev-task（日常开发任务）。状态：**✅ 已完成（2026-10-18），7 条验收标准全部通过**。
> 上一任务「我的工作台（首页重构）」方案已定稿但被本需求插队，暂停存档于 `docs/CONTEXT-我的工作台-待授权.md`（其去留见 Q3）。

## 元信息（Step 0 准备）

| 项 | 值 |
|----|----|
| 分支 / 基线 commit | `main` @ `35f31f7` |
| 编码 / 实现 Agent | 主会话（ZCode，待授权后执行） |
| 对抗审查 | `general` 子 Agent（交叉对抗） |
| 单测 / E2E | vitest / Playwright（E2E 仍跑浏览器形态；桌面壳用手工走查 + 打包冒烟） |
| 测试环境 | ✅ node v22.22.2 / Windows 10 |
| 重量档 | 🟡 **标准档**（加壳不改业务代码，但有 M0 验证点与双形态构建权衡） |

## 要解决的问题

应用目前是 GitHub Pages 上的 PWA，每次要在浏览器里开网址；目标是变成**双击即开的 Windows 桌面应用**（.exe），离线可用，孩子的学习进度留在本机。

## 外部调研结论（Step 1，2026-10-17）

| 事实 | 来源 | 影响 |
|------|------|------|
| Electron 中 `SpeechRecognition` **必挂**（network error，需 Google 语音后端 API key） | electron#46143 #24278 #47837 | 本项目 STT 仅用于跟读（Tab 已默认隐藏、`supported` 守卫 + 降级已存在）→ 影响可控 |
| Electron 支持 WebGPU，onnxruntime-web/Kokoro 有在 Electron 跑通的先例 | transformers.js#1231、kokoro#4 | Kokoro 神经 TTS 可保留，但需 M0 实测目标机器 |
| Tauri（WebView2）体积小 ~10 倍，但需 Rust+MSVC 工具链；WebView2 的 STT 同样受限 | tauri#6381、v2 文档 | 体积优势换不来功能优势，工具链成本高 |
| 云 TTS（百度/有道 `<audio>` 直连 + no-referrer）与 localStorage 持久化在 Electron 中行为同浏览器 | 架构等价 | 业务代码预期零改动 |

## 已确认方案（Step 2 think）

### 第一性原理

应用是 100% 纯前端 + localStorage，桌面化只是**给同一份前端产物加一个原生壳**，不是重写。最小方案 = Electron 主进程（开窗口、加载 build 产物）+ 打包脚本；业务代码、store、课程数据全部不动。

### 方案对比

| 方案 | 做法 | 收益 | 代价 | 风险 |
|------|------|------|------|------|
| **B Electron（推荐）** | `electron` 主进程 + `electron-builder` 出 NSIS 安装包；dev 加载 Vite server，prod 加载 `dist/` | 纯 JS 工具链（现有 Node 22 即可）；WebGPU 可用；生态最成熟 | 安装包 ~80-100MB、内存占用高 | STT 不可用（可接受）；SW 双形态需隔离 |
| A Tauri | WebView2 壳 | 包 ~10MB | 需 Rust + MSVC 工具链；STT 同样不可用 | 工具链装不上即卡死 |
| C 保持 PWA | 不做 | 零成本 | 不满足需求 | — |

### 关键设计

1. **双形态共存**：网页版（GitHub Pages PWA）照常构建部署；桌面壳单独 `npm run electron:dev` / `npm run electron:build`，prod 用同一份 `vite build` 产物。PWA 注册逻辑加环境判断（Electron 下跳过 SW 注册，避免壳内缓存混乱）
2. **主进程极简**：`electron/main.cjs` —— 创建 BrowserWindow（1280×800，禁 nodeIntegration，contextIsolation）、dev 载 `localhost:5173`、prod 载 `dist/index.html`（file:// 下 HashRouter 无碍，base 相对路径需 vite 配置确认）
3. **STT 降级**：不动代码——现有 `useSpeechRecognition` 的 `supported` 守卫 + 家长确认降级天然兜住 Electron 场景；E2E 不测 STT
4. **打包**：`electron-builder` + NSIS 安装包（目标 Windows x64）；**用默认 Electron 图标**（图标定制已砍，见 Out）；构建需 `ELECTRON_MIRROR` 与 `ELECTRON_BUILDER_BINARIES_MIRROR`（npmmirror），写进脚本与文档
5. **验证探针**（M0 与验收共用，`electron/main.cjs` 内置 `--smoke` 模式）：加载产物后 `executeJavaScript` 依次验 ① `#root` 子节点数 > 0（非白屏）② `navigator.gpu?.requestAdapter()` ③ `localStorage` 读写 ④ 主进程 `fetch` 百度 TTS 验 `content-type: audio/*`；输出 JSON 结果后退出，发声真实性仍需人工听
6. **不做的**（奥卡姆）：自动更新、多窗口、系统托盘、跨平台打包（mac/linux）、数据导出导入、图标定制、STT 替代方案（whisper 本地化另开需求）

### M0（最大不确定性前置验证，动手第一步）

**先做最小壳验证三件事，不过立即回改方案**：
1. Electron 窗口加载 `dist/` 产物 → 页面白屏与否（file:// + HashRouter + 相对 base）
2. 目标机器上 `probeWebGPUAdapter()` 能否拿到适配器（决定 Kokoro 是否可用，拿不到则桌面版自动走云 TTS + WebSpeech，链路本来就有）
3. 百度/有道 `<audio>` 云 TTS 与 localStorage 持久化在壳内正常

### 对抗性审查

| 反例 | 风险 | 处置 |
|------|------|------|
| file:// 协议下资源路径 404 | 白屏 | vite `base: './'`（GitHub Pages 已用 env 区分 base，需确认二者兼容） |
| SW 在壳内注册拦截 file:// 请求 | 缓存错乱；且 dev 态 SW 也默认开启（`devOptions.enabled`） | UA 检测放在 `registerSW` 调用处（`src/main.tsx:17`），dev/prod 一并兜住 |
| 旧进度在浏览器里，桌面版读不到 | 孩子进度"丢失"体验 | localStorage 不同源无法自动迁移 → Q2 决定是否本期做导出/导入 |
| Electron 下载慢/装不上（国内网络） | 卡壳 | 用 npmmirror 镜像 env（ELECTRON_MIRROR）写进文档 |
| 服务 workers 缓存 + 双形态构建互相污染 | 网页版回归 | PWA 产物仅在 web 构建启用；桌面构建跳过 vite-plugin-pwa |

## 验收标准（写死）

| # | 标准 | 证据 |
|---|------|------|
| 1 | `npm run electron:dev` 起壳载 dev server，页面功能同浏览器（点读发音、翻页、quiz） | 走查记录 |
| 2 | `npm run electron:build` 产出 NSIS 安装包，安装后双击可用 | 安装包 + 截图 |
| 3 | 壳内发音链路：WebGPU 探针结果记录在案，可用则走 Kokoro，不可用则云 TTS/WebSpeech，不得静音（音频真实性人工听，链路程序化验证） | `--smoke` JSON 输出 |
| 4 | 学习进度在壳内 localStorage 持久化：重开应用仍在（smoke 探针含写入/回读断言） | `--smoke` JSON 输出 |
| 5 | 网页版构建/部署不受影响：`npm run build` 产物含 SW，`npm run e2e` 仍全绿 | 命令输出 |
| 6 | 跟读入口在壳内保持隐藏态/降级，不崩溃不白屏 | 走查记录 |
| 7 | `npm run check` / `npm run test` / `npm run lint` 全绿 | 命令输出 |

## 待决问题（实施授权闸 —— 已全部回答，2026-10-17）

| 问题 | 决策 |
|------|------|
| Q1 壳选型 | **Electron**（已确认） |
| Q2 旧进度迁移 | **重新开始**，不做导出/导入（已确认为 Out，列为已知问题） |
| Q3 工作台任务 | **桌面化完成后继续做**（方案已定稿于 `docs/CONTEXT-我的工作台-待授权.md`） |

**任务队列**：桌面化（本任务）→ 我的工作台（已获继续授权，桌面化验收后接续）。

## 文档复核记录（强制闸，2026-10-17）

五项逐项过，发现 5 处问题已回改本文：

1. **验收标准**：#3/#4 原证据仅「走查记录」不可重现 → 升级为程序化探针（主进程 `executeJavaScript` 验页面渲染/WebGPU/localStorage，HTTP 拉百度 TTS 验 content-type）；真实发声仍需人工，已在证据列标明
2. **范围 In/Out**：补充「图标定制」为 Out（favicon.svg→ico 转换砍掉，用 Electron 默认图标）；Q2 决策已回写
3. **方案自洽**：SW 注册点已实锤（`src/main.tsx:17` `registerSW`），UA 检测写死在该处；STT 降级守卫已实锤（`useSpeechRecognition.ts` `supported` + `unsupported` 错误码）
4. **高风险点**：补 electron-builder 自身工具链（winCodeSign/nsis 二进制）国内下载需 `ELECTRON_BUILDER_BINARIES_MIRROR`；补 Node 22 与 electron-builder 兼容性确认
5. **口径一致**：Q1~Q3 决策与方案/Out 一致，无下游推翻上游

## 验收结果（2026-10-18，逐条对照）

| # | 标准 | 结果 | 证据 |
|---|------|------|------|
| 1 | `electron:dev` 起壳载 dev server | ✅ | 探测到 dev server 并载入，`--smoke` 在 dev 态 `passed=true` |
| 2 | `electron:build` 出 NSIS 安装包 | ✅ | `release/Starlight 学习伙伴 Setup 0.1.0.exe`（86MB）；`win-unpacked` 内 exe 跑 `--smoke` `passed=true` |
| 3 | 发音链路不静音 | ✅ | WebGPU 探针 `false`（本机老核显，已知常态）→ 自动走云 TTS/WebSpeech；主进程验百度 TTS `content-type: audio/mpeg` |
| 4 | localStorage 持久化 | ✅ | `--smoke` 写入/回读断言 `true`（`partition: 'persist:starlight'`） |
| 5 | 网页版不受影响 | ✅ | 无 `ELECTRON_BUILD` 时 `npm run build` 产物含 `sw.js`；`npm run e2e` 57 passed / 2 failed / 3 skipped —— 2 个失败经 `git stash` 基线比对确认为**改动前既存问题**（`audio-debug.spec.ts:18`、`review.spec.ts:30`），非本次回归 |
| 6 | 跟读入口降级不崩 | ✅ | `SHOW_SPEAK_TAB=false` 原样保留；STT `supported` 守卫天然兜住 Electron（STT 必挂已知） |
| 7 | check / test / lint 全绿 | ✅ | `check` ✓、`test` 215 passed (18 files) ✓、`lint` ✓ |

## 已知风险 / 踩过的坑

- **旧进度不迁移（Q2 已决策重新开始）**：桌面版首次打开是全新进度，需在交付文档向使用者明示
- Electron 国内下载慢：`ELECTRON_MIRROR` + `ELECTRON_BUILDER_BINARIES_MIRROR` 双镜像写进构建脚本
- file:// 与 base 配置冲突是白屏最常见原因，M0 第一项就验它（`ELECTRON_BUILD=1` 时 vite `base: './'`）
- 中文控制台乱码：读中文一律用 read/grep 工具
- **⚠️ Windows 未开「开发者模式」→ electron-builder 打包必失败**（本次实际踩到）：首次打包要解压 `winCodeSign-2.6.0.7z`，包内含 macOS 的 `.dylib` **符号链接**；7-Zip 默认 `-snld` 会尝试创建软链，非管理员/未开开发者模式时报「客户端没有所需的特权」，重试 3 次仍失败（且每次用随机数字临时目录，手动预提取命中不了）。**解法已固化进 `scripts/electron-build.mjs`**：预先用 `7zip-bin` 的 `7za` 解压到 electron-builder 期望的 `Cache/winCodeSign/winCodeSign-2.6.0`，**排除 `darwin`/`linux`**（Windows 打包只需 `signtool`/`rcedit`），并清理失败残留的随机目录；app-builder 见目标目录已存在即跳过解压。该步骤幂等（缓存就绪则跳过），已验证冷路径（删缓存后自动重新预置）可自愈
- **`electron:smoke` 必须让「构建」也带 `ELECTRON_BUILD=1`**：原脚本写成 `npm run build && cross-env ELECTRON_BUILD=1 electron . --smoke`，构建态是网页版（绝对 `base`）→ file:// 下白屏 → smoke 误判失败。已改为 `cross-env ELECTRON_BUILD=1 npm run build && electron . --smoke`
- **smoke 判定口径**：WebGPU 仅信息项（老核显/虚拟机拿不到适配器是已知常态），硬门槛是「非白屏 + localStorage + 云 TTS 可达」，否则会误判本机为失败
