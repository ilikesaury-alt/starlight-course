// 「孩子模式 / 家长模式」的读写 —— 与 data/homeLevel.ts 同一套模式：
// 单独成文件（避免组件文件导出非组件触发 react-refresh），
// 存 localStorage（视图偏好，不是学习进度，不参与 persist 版本号），
// 用订阅广播补上「同页静默」这一环。
//
// 为什么要有这个开关：此前孩子和家长看**同一套界面** ——
// 「重置全部数据」「导出备份」「改档案」这些家长操作就摆在孩子点得到的地方。
// 产品口径（2026-11-16 Lichun 定）是 **C 方案：完全分开的入口，家长模式藏在角落**：
//   · 孩子模式 = 默认，只有学习和玩，看不到任何破坏性按钮；
//   · 家长模式 = 从顶栏角落的小锁进入，收口档案 / 备份 / 重置。
//
// ⚠️ 这**不是安全边界**，是产品分层：孩子点得到角落的锁，但那是「家长的抽屉」，
//    不是要防的人。真正的防线是「破坏性操作通过就不在孩子的路径上」，
//    再加一道确认弹层（已有的 ConfirmDialog）。别把它当密码锁宣传。

export type ViewMode = 'kid' | 'parent'

export const VIEW_MODE_KEY = 'starlight-view-mode'

/** 读取当前模式。**默认孩子模式** —— 默认值是最重要的产品决定：
 *  家长打开看到的少几块，孩子打开看到的全是他能用的。 */
export function readViewMode(): ViewMode {
  try {
    const saved = localStorage.getItem(VIEW_MODE_KEY)
    if (saved === 'parent' || saved === 'kid') return saved
  } catch {
    // 隐私模式 / localStorage 被禁用：回落孩子模式，不让界面崩
  }
  return 'kid'
}

const listeners = new Set<() => void>()

export function writeViewMode(mode: ViewMode): void {
  try {
    localStorage.setItem(VIEW_MODE_KEY, mode)
  } catch {
    // 同上：写不进去也要让本次会话的两处 UI 保持一致
  }
  for (const fn of listeners) fn()
}

/** 订阅模式变更（同页写入 + 跨标签页 storage 事件）。返回取消订阅函数。 */
export function subscribeViewMode(onChange: () => void): () => void {
  listeners.add(onChange)
  let onStorage: ((e: StorageEvent) => void) | undefined
  try {
    onStorage = (e: StorageEvent) => {
      if (e.key === VIEW_MODE_KEY) onChange()
    }
    window.addEventListener('storage', onStorage)
  } catch {
    // 无 window（极端环境）就只靠同页通知
  }
  return () => {
    listeners.delete(onChange)
    if (onStorage) {
      try {
        window.removeEventListener('storage', onStorage)
      } catch {
        // ignore
      }
    }
  }
}