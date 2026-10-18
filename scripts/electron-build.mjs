// 桌面版打包：设置 ELECTRON_BUILD=1（vite 输出相对 base，file:// 才不白屏），
// 跑一次前端构建，再交给 electron-builder 出 NSIS 安装包。
//
// 国内网络注意：Electron 二进制与 electron-builder 的 winCodeSign/nsis 工具链
// 都走 GitHub，直连会卡死。这里默认注入 npmmirror 镜像（可用同名环境变量覆盖）。
//
// ⚠️ Windows 未开「开发者模式」时的符号链接坑：
//   electron-builder 首次打包要解压 winCodeSign-2.6.0.7z，包里含 macOS 的
//   .dylib 软链。7-Zip 默认 -snld 会尝试创建符号链接，非管理员/未开开发者模式
//   时直接报「客户端没有所需的特权」，打包失败（重试 3 次仍失败）。
//   解法：预先用 7za 解压该包到 electron-builder 期望的缓存目录
//   Cache/winCodeSign/winCodeSign-2.6.0，并排除 darwin/linux（我们只需 Windows
//   的 signtool/rcedit）。app-builder 见目录已存在即跳过解压。
//   这一步幂等：目录已存在则直接跳过，零成本。

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)

const env = {
  ...process.env,
  ELECTRON_BUILD: '1',
  ELECTRON_MIRROR: process.env.ELECTRON_MIRROR || 'https://npmmirror.com/mirrors/electron/',
  ELECTRON_BUILDER_BINARIES_MIRROR:
    process.env.ELECTRON_BUILDER_BINARIES_MIRROR ||
    'https://npmmirror.com/mirrors/electron-builder-binaries/',
}

const run = (cmd, args, label) => {
  console.log(`\n[electron-build] ${label}: ${cmd} ${args.join(' ')}`)
  const r = spawnSync(cmd, args, { stdio: 'inherit', env, shell: process.platform === 'win32' })
  if (r.status !== 0) {
    console.error(`[electron-build] ${label} 失败（exit ${r.status}）`)
    process.exit(r.status ?? 1)
  }
}

const WIN_CODE_SIGN_VERSION = 'winCodeSign-2.6.0'
// electron-builder 的缓存根目录（Windows: %LOCALAPPDATA%\electron-builder\Cache；
// 其它平台走 ~/.cache/electron-builder）
const cacheRoot =
  process.env.ELECTRON_BUILDER_CACHE ||
  path.join(
    process.platform === 'win32'
      ? process.env.LOCALAPPDATA || path.join(homedir(), 'AppData', 'Local')
      : path.join(homedir(), '.cache'),
    'electron-builder',
    'Cache',
  )
const winCodeSignDir = path.join(cacheRoot, 'winCodeSign')
const unpackedDir = path.join(winCodeSignDir, WIN_CODE_SIGN_VERSION)
const archivePath = path.join(winCodeSignDir, `${WIN_CODE_SIGN_VERSION}.7z`)

// 缓存已就绪（含 Windows 端签名工具）→ 无需再动
function cacheReady() {
  return existsSync(path.join(unpackedDir, 'windows-10', 'x64', 'signtool.exe'))
}

// 清掉 app-builder 解压失败时留下的随机数字临时目录（避免缓存越堆越乱）
function cleanStaleTempDirs() {
  if (!existsSync(winCodeSignDir)) return
  for (const name of readdirSync(winCodeSignDir)) {
    if (/^\d+$/.test(name)) {
      try {
        rmSync(path.join(winCodeSignDir, name), { recursive: true, force: true })
      } catch {
        /* 忽略：可能被占用 */
      }
    }
  }
}

function ensureWinCodeSignCache() {
  if (cacheReady()) {
    console.log(`[electron-build] winCodeSign 缓存已就绪，跳过预置`)
    return
  }
  if (process.platform !== 'win32') {
    // 非 Windows 平台由 electron-builder 自己处理（且通常有符号链接权限）
    return
  }

  console.log(`[electron-build] 预置 winCodeSign 缓存（绕过未开开发者模式的软链限制）`)
  mkdirSync(winCodeSignDir, { recursive: true })
  cleanStaleTempDirs()

  const { path7za } = require('7zip-bin')
  if (!existsSync(archivePath)) {
    const url = `${env.ELECTRON_BUILDER_BINARIES_MIRROR}${WIN_CODE_SIGN_VERSION}/${WIN_CODE_SIGN_VERSION}.7z`
    console.log(`[electron-build] 下载 ${url}`)
    const r = spawnSync(
      'curl',
      ['-sL', '--retry', '3', '-o', archivePath, url],
      { stdio: 'inherit', env, shell: true },
    )
    if (r.status !== 0 || !existsSync(archivePath)) {
      console.error(`[electron-build] 下载 winCodeSign 失败；请检查网络或手动放置 ${archivePath}`)
      process.exit(1)
    }
  }

  // 排除 darwin/linux：它们才是软链，且 Windows 打包根本用不到
  const r = spawnSync(
    path7za,
    ['x', archivePath, `-o${unpackedDir}`, '-x!darwin', '-x!linux', '-y'],
    { stdio: 'inherit', env },
  )
  if (r.status !== 0 || !cacheReady()) {
    console.error(`[electron-build] 预置 winCodeSign 失败（exit ${r.status}）`)
    process.exit(r.status ?? 1)
  }
  console.log(`[electron-build] winCodeSign 缓存预置完成`)
}

ensureWinCodeSignCache()
run('npm', ['run', 'build'], '前端构建')
run('npx', ['electron-builder'], '打包安装包')

console.log('\n[electron-build] 完成，产物在 release/')
