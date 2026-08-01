import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { installSpeechErrorGuard } from './utils/speechGuard'
import { installAudioUnlock } from './utils/audioUnlock'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// 注册 Service Worker,检测到新版本时自动刷新页面
// 配合 workbox.skipWaiting + clientsClaim,实现"部署后用户下次访问即拿到新版"
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

// 全局兜底:吞掉 speechSynthesis 异步错误,防止 React 18 因未捕获异常卸载整棵组件树。
// 与 SpeakButton 的 try/catch、SafeBoundary 错误边界构成三重防护(单点挂载,避免重复)。
installSpeechErrorGuard()

// 音频自动播放解锁:首次用户交互时解锁媒体管线,规避 iOS/Android 对异步 play() 的
// 自动播放拦截(表现为「前几次能响、之后间歇性静音」)。详见 utils/audioUnlock.ts。
installAudioUnlock()
