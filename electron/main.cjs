// Electron 主进程：给同一份前端产物加一个原生壳。
//
// 设计要点（与 CONTEXT.md 对齐）：
// - 业务代码零改动：窗口只是加载 vite build 的产物或 dev server。
// - 自动选目标：dev server 可达就载它（开发态），否则载 dist/index.html（生产态）。
//   这样 `npm run electron:dev` 不需要额外 env 变量或第二终端。
// - --smoke 模式：程序化验证「非白屏 / WebGPU / localStorage / 云 TTS」，输出 JSON 后退出。
//   这是验收标准 #3 #4 的证据来源（真实发声仍需人工听）。

const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const DEV_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
const SMOKE = process.argv.includes('--smoke')

// WebGPU 在 Electron 中并非所有构建都默认开启，显式打开以避免 Kokoro 神经 TTS 静默降级。
// 拿不到适配器时链路本来就会退回云 TTS / WebSpeech，不会静音（见 src/utils/speakService.ts）。
app.commandLine.appendSwitch('enable-unsafe-webgpu')

/** dev server 是否可用：用一次短超时探测，避免开发时误载旧 dist。 */
async function devServerAlive() {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 800)
    const res = await fetch(DEV_URL, { signal: ctrl.signal })
    clearTimeout(timer)
    return res.ok
  } catch {
    return false
  }
}

/**
 * --smoke：加载后注入一段探针脚本，逐项验验收标准 #3 #4，结果打到 stdout。
 * 任一项失败即以非零码退出，让 CI / 人工能一眼看出壳是否可用。
 */
async function runSmoke(win) {
  const probes = await win.webContents.executeJavaScript(
    `(async () => {
       const root = document.getElementById('root')
       const out = {
         rootChildren: root ? root.children.length : -1,
         bodyText: (document.body.innerText || '').slice(0, 80),
       }
       try {
         const adapter = navigator.gpu ? await navigator.gpu.requestAdapter() : null
         out.webgpu = !!adapter
       } catch (e) { out.webgpu = false; out.webgpuError = String(e) }
       try {
         localStorage.setItem('__smoke__', 'ok')
         out.localStorage = localStorage.getItem('__smoke__') === 'ok'
         localStorage.removeItem('__smoke__')
       } catch (e) { out.localStorage = false; out.localStorageError = String(e) }
       return out
     })()`,
    true
  )

  // 云 TTS：主进程直连（不带 Referer —— 百度带 Referer 会回 0 字节 text/html，见 index.html 注释）
  let tts = { ok: false }
  try {
    const res = await fetch('https://fanyi.baidu.com/gettts?lan=en&text=hello&spd=3&source=web')
    tts = { ok: res.ok, status: res.status, contentType: res.headers.get('content-type') }
  } catch (e) {
    tts = { ok: false, error: String(e) }
  }

  // 判定口径（对应 CONTEXT.md 验收标准 #3 #4）：
  // - 非白屏 / localStorage 持久化：硬门槛
  // - 云 TTS 可达：硬门槛（它是「WebGPU 不可用时仍有声」的保底证据）
  // - WebGPU：仅信息项。老核显/虚拟机拿不到适配器是已知常态（AGENTS.md 有记录），
  //   拿不到会自动退回云 TTS / WebSpeech，不能因此判失败。
  const result = { ...probes, baiduTts: tts }
  const passed = probes.rootChildren > 0 && probes.localStorage === true && tts.ok

  console.log('[smoke] ' + JSON.stringify(result, null, 2))
  console.log('[smoke] passed=' + passed + (probes.webgpu ? ' (WebGPU 可用 → Kokoro)' : ' (WebGPU 不可用 → 云 TTS/WebSpeech 保底)'))
  app.exit(passed ? 0 : 1)
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: 'Starlight 学习伙伴',
    // smoke 模式不显示窗口，避免闪屏；正常启动照常显示
    show: !SMOKE,
    webPreferences: {
      // 前端是纯静态应用，不需要 Node 能力：保持最小权限面
      nodeIntegration: false,
      contextIsolation: true,
      // file:// 下 localStorage 需要非 opaque origin 才能持久化（smoke 会断言）
      partition: 'persist:starlight',
    },
  })

  const dev = await devServerAlive()
  if (dev) {
    await win.loadURL(DEV_URL)
  } else {
    await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  if (SMOKE) {
    // 等首屏渲染稳定再探针（Kokoro 预热与 React 挂载都在这一帧之后）
    await new Promise((r) => setTimeout(r, 1500))
    await runSmoke(win)
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
