/**
 * 全局兜底：吞掉 speechSynthesis 的异步错误，防止 React 18 因未捕获异常卸载整棵组件树。
 * 与 SpeakButton 内的 try/catch、SafeBoundary 错误边界构成三重防护。
 *
 * 仅吞掉发音相关错误（message 含 speechSynthesis，或事件 target 带 synthesis 字段），
 * 不掩盖真实业务异常。main.tsx 在启动时调用一次即可，避免在多个文件里重复挂监听。
 */
export function installSpeechErrorGuard(): void {
  const isSpeechError = (e: unknown): boolean => {
    try {
      const ev = e as { message?: string; target?: unknown }
      if (typeof ev?.message === 'string' && /speechSynthesis|SpeechSynthesis/i.test(ev.message)) {
        return true
      }
      const target = ev?.target
      if (target && typeof target === 'object' && 'synthesis' in (target as object)) {
        return true
      }
    } catch {
      /* ignore */
    }
    return false
  }

  const onError = (e: ErrorEvent) => {
    if (isSpeechError(e)) e.preventDefault?.()
  }
  const onRejection = (e: PromiseRejectionEvent) => {
    if (isSpeechError(e.reason)) e.preventDefault?.()
  }

  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)
}
