import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { installSpeechErrorGuard } from './utils/speechGuard'
import { installAudioUnlock } from './utils/audioUnlock'
import { attachFileStore, hydrateFromFile } from './utils/storage'
import './index.scss'

/**
 * 启动顺序（桌面版的数据落盘依赖它）：
 *   水合（读数据文件 → store）→ 挂载 → 接上写回通道。
 *
 * 为什么水合必须在挂载前 await：IPC 读盘是异步的，若先挂载再异步填数据，
 * 首屏会按空 store 渲染一帧（星星/进度条闪一下 0）。放在挂载前没有这个窗口期。
 * 网页版没有 window.starlightStore，hydrateFromFile 立即返回 null，行为与改前一致。
 */
async function boot() {
  // 桌面版：把磁盘上的学习数据读进 store（文件不存在则把 localStorage 里的进度种进去）。
  // 失败不阻塞启动 —— 函数内部已兜底，读不到就继续用 localStorage。
  await hydrateFromFile()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  // 挂载后接上「store 变更 → 写数据文件」的防抖同步（网页版是空操作）
  attachFileStore()
}

void boot()

// 注册 Service Worker,检测到新版本时自动刷新页面
// 配合 workbox.skipWaiting + clientsClaim,实现"部署后用户下次访问即拿到新版"
//
// 桌面版（Electron）跳过注册:壳内是 file:// 协议,SW 无法接管且会在切换版本时
// 留下脏缓存;壳本身已离线可用,不需要 SW。UA 判断放在这里统一兜住 dev/prod 两种构建。
const isElectron = typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent)
if (!isElectron) {
  registerSW({
    onNeedRefresh() {
      // 检测到新版本,自动刷新(已配置 skipWaiting,新 SW 会立即接管)
      if (document.visibilityState === 'visible') {
        window.location.reload()
      }
    },
    onOfflineReady() {
      // 离线就绪,无需提示
    },
  })
}

// 全局兜底:吞掉 speechSynthesis 异步错误,防止 React 18 因未捕获异常卸载整棵组件树。
// 与 SpeakButton 的 try/catch、SafeBoundary 错误边界构成三重防护(单点挂载,避免重复)。
installSpeechErrorGuard()

// 音频自动播放解锁:首次用户交互时解锁媒体管线,规避 iOS/Android 对异步 play() 的
// 自动播放拦截(表现为「前几次能响、之后间歇性静音」)。详见 utils/audioUnlock.ts。
installAudioUnlock()
