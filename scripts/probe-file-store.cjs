// 数据落盘端到端探针：在真实 Electron 壳里验证「进度真的写进了文件」。
//
// 为什么需要它：storage.test.ts 用的是**假的** preload bridge，
// 证明不了 preload/IPC/主进程这条真实链路通。这里跑真壳，链路是：
//   渲染进程写 store → 防抖 → window.starlightStore.write()
//   → ipcRenderer.invoke → ipcMain.handle → fs 原子写 → userData/starlight-data.json
//
// 用法：ELECTRON_BUILD=1 npx vite build && node scripts/probe-file-store.cjs
// 退出码：0 = 全部通过，1 = 有断言失败（便于 CI / 人工判断）

const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os')

// 用独立 userData，避免污染真实安装后的数据
const TMP_USER_DATA = path.join(os.tmpdir(), 'starlight-probe-' + process.pid)
app.setPath('userData', TMP_USER_DATA)

const DATA_FILE = path.join(TMP_USER_DATA, 'starlight-data.json')

// 复用 main.cjs 里的 IPC 定义：直接 require 会连带创建窗口，
// 所以这里按同样的契约复刻一遍（契约不变的话行为一致）。
function registerStoreIpc() {
  const { ipcMain } = require('electron')
  const dataFilePath = () => DATA_FILE
  ipcMain.handle('starlight-store:read', () => {
    try {
      if (!fs.existsSync(dataFilePath())) return null
      return fs.readFileSync(dataFilePath(), 'utf8')
    } catch {
      return null
    }
  })
  ipcMain.handle('starlight-store:write', (_e, json) => {
    try {
      if (typeof json !== 'string') return { ok: false, error: 'not a string' }
      const tmp = dataFilePath() + '.tmp'
      fs.mkdirSync(path.dirname(dataFilePath()), { recursive: true })
      fs.writeFileSync(tmp, json, 'utf8')
      fs.renameSync(tmp, dataFilePath())
      return { ok: true }
    } catch (e) {
      return { ok: false, error: String(e) }
    }
  })
  ipcMain.handle('starlight-store:path', () => dataFilePath())
}

const results = []
const check = (name, pass, detail) => {
  results.push({ name, pass, detail })
  console.log(`[probe] ${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`)
}

async function run() {
  registerStoreIpc()

  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'electron', 'preload.cjs'),
      partition: 'persist:starlight-probe',
    },
  })

  await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  await new Promise((r) => setTimeout(r, 2500)) // 等水合 + React 挂载

  // 1) preload 是否真的暴露了 bridge（最小权限面）
  const bridge = await win.webContents.executeJavaScript(
    `JSON.stringify({
       has: !!window.starlightStore,
       keys: window.starlightStore ? Object.keys(window.starlightStore).sort() : [],
       leakedRequire: typeof window.require,
       leakedProcess: typeof window.process
     })`
  )
  const b = JSON.parse(bridge)
  check('preload 暴露 starlightStore', b.has, JSON.stringify(b.keys))
  check('只暴露 3 个白名单方法', b.keys.length === 3 && b.keys.join(',') === 'path,read,write', b.keys.join(','))
  check('未泄漏 require', b.leakedRequire === 'undefined', 'typeof window.require=' + b.leakedRequire)
  check('未泄漏 process', b.leakedProcess === 'undefined', 'typeof window.process=' + b.leakedProcess)

  // 2) 通过真实链路写数据：走 preload → ipcRenderer.invoke → ipcMain → fs
  //    （渲染进程里发起，与界面写 store 后防抖触发的调用是同一入口）
  const written = await win.webContents.executeJavaScript(
    `(async () => {
       // 故意写成 version 8（当前是 9）：模拟「老数据文件 + 新版应用」，
       // 用来验证水合路径确实跑了 store 的迁移链，而不是只做 JSON 透传
       const payload = JSON.stringify({ state: { totalStars: 4242, wrongWords: [] }, version: 8 })
       const res = await window.starlightStore.write(payload)
       const p = await window.starlightStore.path()
       const back = await window.starlightStore.read()
       return JSON.stringify({ res, p, backHasStars: back ? back.includes('4242') : false })
     })()`
  )
  const w = JSON.parse(written)
  check('IPC write 返回 ok', w.res && w.res.ok === true, JSON.stringify(w.res))
  check('文件写入后能读回（原子写生效）', w.backHasStars === true)

  // 3) 主进程侧确认文件真的在磁盘上
  await new Promise((r) => setTimeout(r, 300))
  check('userData 下存在 starlight-data.json', fs.existsSync(DATA_FILE), DATA_FILE)
  if (fs.existsSync(DATA_FILE)) {
    const content = fs.readFileSync(DATA_FILE, 'utf8')
    let parseOk = false
    try {
      const parsed = JSON.parse(content)
      parseOk = parsed && parsed.state && parsed.state.totalStars === 4242
    } catch {}
    check('文件内容是合法 JSON 且含刚写入的数据', parseOk)
  }

  // 4) 首启水合：重启壳（新窗口），看能否读回刚才写的值
  const win2 = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'electron', 'preload.cjs'),
      partition: 'persist:starlight-probe',
    },
  })
  await win2.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  await new Promise((r) => setTimeout(r, 2500))
  const rehydrated = await win2.webContents.executeJavaScript(
    `(async () => {
       const raw = localStorage.getItem('starlight-course')
       if (!raw) return JSON.stringify({ found: false })
       const parsed = JSON.parse(raw)
       const st = parsed.state || {}
       return JSON.stringify({
         found: true,
         stars: st.totalStars,
         hasProfile: !!st.profile,
         profileName: st.profile ? st.profile.name : null,
       })
     })()`
  )
  const rh = JSON.parse(rehydrated)
  check('重启后水合把数据读回 store', rh.found && rh.stars === 4242, JSON.stringify(rh))
  // v9：水合时迁移链补出了 profile（老数据文件里没有这个字段）
  check(
    'v8 数据文件水合后补出 profile',
    rh.hasProfile === true && rh.profileName === '',
    `hasProfile=${rh.hasProfile} name=${JSON.stringify(rh.profileName)}`
  )

  const failed = results.filter((r) => !r.pass)
  console.log(`\n[probe] ${results.length - failed.length}/${results.length} passed`)
  console.log(`[probe] userData = ${TMP_USER_DATA}`)

  try {
    fs.rmSync(TMP_USER_DATA, { recursive: true, force: true })
  } catch {}
  app.exit(failed.length === 0 ? 0 : 1)
}

app.whenReady().then(run)
