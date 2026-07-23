import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'

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

// speechSynthesis 的异步回调若抛出未捕获错误,React 18 会卸载整个组件树。
// 这里做全局兜底,配合 SpeakButton 内的 try/catch 与 SafeBoundary 三重防护。
function swallowSpeechError(e: unknown) {
  try {
    const ev = e as Event
    const target = ev?.target as unknown as Record<string, unknown> | undefined
    if (target && typeof target === 'object' && 'synthesis' in target) {
      ev.preventDefault?.()
    }
  } catch {
    /* ignore */
  }
}
window.addEventListener('error', swallowSpeechError)
window.addEventListener('unhandledrejection', swallowSpeechError)
