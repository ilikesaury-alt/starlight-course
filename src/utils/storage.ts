// 学习数据落盘（桌面版）/ localStorage（网页版）的适配层。
//
// 背景：进度原来只存 localStorage。桌面版于是有两个真问题：
//   1. 卸载重装 = 进度清零（localStorage 在 userData 里，随卸载删除）；
//   2. 家长想自己看/拷数据，找不到任何文件。
// 现在桌面版把整份数据写进 userData 下的 starlight-data.json，磁盘上始终有一份。
//
// ⚠️ **水合必须在 React 挂载之前完成**（见 src/main.tsx 的 boot()）：
//    IPC 读文件是异步的，若放到组件里 await，首屏会先按「空 store」渲染一帧 ——
//    进度条闪一下 0、星星闪成 0。放到挂载前就没有这个窗口期，
//    而且天然绕开 React 18 StrictMode 对 effect 的双次执行（不需要防重入锁）。
//
// 文件格式 = zustand persist 的原始落盘格式 `{ state, version }`：
//   与 localStorage 里的内容完全同构，因此读写都能直接复用 utils/backup.ts
//   里已经过 17 条单测的解析 / 迁移链，不另造一套。

import { useCourseStore } from '@/store/useCourseStore'
import { applyBackup, buildCurrentBackup, parseBackup, pickPersisted, storeVersion } from './backup'

/** preload 暴露的最小接口（见 electron/preload.cjs） */
interface StarlightStoreBridge {
  read: () => Promise<string | null>
  write: (json: string) => Promise<{ ok: boolean; error?: string }>
  path: () => Promise<string>
}

declare global {
  interface Window {
    starlightStore?: StarlightStoreBridge
  }
}

/** 是否运行在带落盘能力的桌面壳里（网页版没有这个对象） */
export function hasFileStore(): boolean {
  return typeof window !== 'undefined' && !!window.starlightStore
}

/** 写入防抖：学习动作很密集（点词、翻页、答题），每次 setState 都写盘会太频繁 */
const WRITE_DEBOUNCE_MS = 400
let writeTimer: ReturnType<typeof setTimeout> | null = null
let detach: (() => void) | null = null

/** 立刻把当前 store 写进数据文件（防抖到期或被 pagehide 触发时调用） */
async function writeNow(): Promise<void> {
  if (!hasFileStore()) return
  try {
    const payload = JSON.stringify({
      state: pickPersisted(),
      version: storeVersion(),
    })
    await window.starlightStore!.write(payload)
  } catch (e) {
    // 写盘失败不能影响学习：只记录，不抛（内存里的数据仍在，下次变更会重试）
    console.error('[storage] 写入数据文件失败', e)
  }
}

/**
 * 挂载前的水合：把数据文件读进 store。
 *
 * - 文件存在 → 走 backup 的解析 + **store 自己的 migrate**，旧格式文件自动升级；
 * - 文件不存在（首次启动 / 从旧版本升级上来）→ 把当前 localStorage 里的进度
 *   写进文件，完成一次性迁移，**进度不丢**；
 * - 任何失败都退回「继续用 localStorage」，绝不因为读盘问题打不开应用。
 *
 * 返回数据文件路径（供界面展示），失败时返回 null。
 */
export async function hydrateFromFile(): Promise<string | null> {
  if (!hasFileStore()) return null
  try {
    const raw = await window.starlightStore!.read()
    if (raw && raw.trim()) {
      // 与「从备份恢复」共用一条链路：同样的字段校验 + 同样的迁移链
      const res = await parseBackup(raw)
      if (res.ok && res.data) {
        applyBackup(res.data)
      } else {
        console.error('[storage] 数据文件无法解析，保留现有进度：', res.error)
      }
    } else {
      // 首次运行：把 localStorage 里已有的进度种进文件（一次性迁移）
      await writeNow()
    }
    return await window.starlightStore!.path()
  } catch (e) {
    console.error('[storage] 水合失败，退回 localStorage', e)
    return null
  }
}

/**
 * 开始把 store 的每次变更同步到数据文件。挂载后调用一次。
 * 返回 detach 函数（主要给测试用）。
 */
export function attachFileStore(): () => void {
  if (!hasFileStore() || detach) return () => {}

  const unsubscribe = useCourseStore.subscribe(() => {
    if (writeTimer) clearTimeout(writeTimer)
    writeTimer = setTimeout(() => {
      writeTimer = null
      void writeNow()
    }, WRITE_DEBOUNCE_MS)
  })

  // 关窗 / 切后台时把挂起的写入立刻落地 —— 否则最后 400ms 内的学习动作会丢
  const flush = () => {
    if (writeTimer) {
      clearTimeout(writeTimer)
      writeTimer = null
      void writeNow()
    }
  }
  window.addEventListener('pagehide', flush)
  window.addEventListener('beforeunload', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })

  detach = () => {
    unsubscribe()
    window.removeEventListener('pagehide', flush)
    window.removeEventListener('beforeunload', flush)
    detach = null
  }
  return detach
}

/** 导出用的「当前数据文件路径」，拿不到时 null（网页版 / 出错了） */
export async function dataFilePath(): Promise<string | null> {
  if (!hasFileStore()) return null
  try {
    return await window.starlightStore!.path()
  } catch {
    return null
  }
}

/** 便于诊断面板 / smoke：当前是否已能在文件里留下数据 */
export function isFilePersistenceActive(): boolean {
  return hasFileStore()
}

// buildCurrentBackup 在此处 re-export，避免调用方为了「导出一份备份」
// 又去 import 两个模块（storage 已经是数据的门面）
export { buildCurrentBackup }
