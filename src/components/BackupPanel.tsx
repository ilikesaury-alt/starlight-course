// 学习数据备份面板：导出 / 导入。
//
// 放在「学习进度」页底部、紧挨着「重置全部数据」——那里正是家长最容易手滑的地方，
// 备份入口必须在同一屏可见，而不是藏进设置。
//
// 交互约束（对 6~9 岁孩子的家长而言，安全 > 效率）：
// - 导入是**两段式**：先选文件解析出摘要，确认后才真正写入。选错文件不会覆盖进度。
// - 导入成功后立刻重新读一次 store 渲染，让孩子看到「数据回来了」。
// - 任何失败都显示人话原因，不弹技术堆栈。

import { useRef, useState } from 'react'
import {
  applyBackup,
  buildCurrentBackup,
  downloadBackup,
  pickPersisted,
  readBackupFile,
  summarize,
  type BackupSummary,
  type PersistedState,
} from '@/utils/backup'

type Pending = { data: PersistedState; summary: BackupSummary; migratedFrom?: number }

/** 摘要的一行小字：把「导出了什么」说清楚，而不是只报一个总数 */
function summaryLine(s: BackupSummary): string {
  return [
    `${s.stars} 颗星`,
    `${s.srsCards} 张记忆卡`,
    `${s.wrongWords} 个错题`,
    `${s.lessonsDone} 课完成`,
  ].join(' · ')
}

export default function BackupPanel() {
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState<Pending | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // 当前进度摘要：让家长在导出前就知道「这份备份里有什么」
  const current = summarize(pickPersisted())

  const onExport = () => {
    setError(null)
    setDone(null)
    try {
      const name = downloadBackup(buildCurrentBackup())
      setDone(`已导出 ${name}`)
    } catch (e) {
      setError(`导出失败：${String(e)}`)
    }
  }

  const onPick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError(null)
    setDone(null)
    setPending(null)
    const res = await readBackupFile(file)
    setBusy(false)
    // 允许重复选同一个文件（否则第二次点选不会触发 change）
    if (fileRef.current) fileRef.current.value = ''
    if (!res.ok || !res.data || !res.summary) {
      setError(res.error ?? '这个备份文件读不出学习数据。')
      return
    }
    setPending({ data: res.data, summary: res.summary, migratedFrom: res.migratedFrom })
  }

  const onConfirm = () => {
    if (!pending) return
    try {
      applyBackup(pending.data)
      setDone('学习数据已恢复 ✓')
      setPending(null)
    } catch (e) {
      setError(`恢复失败：${String(e)}`)
    }
  }

  return (
    <div className="backup-panel">
      <div className="bp-head">
        <span className="bp-emoji" aria-hidden="true">
          💾
        </span>
        <div>
          <div className="bp-title">学习数据备份</div>
          <div className="bp-sub">当前：{summaryLine(current)}</div>
        </div>
      </div>

      <p className="bp-hint">
        卸载重装、换电脑、或者不小心清了数据，都可以用备份文件恢复。建议每周导出一份。
      </p>

      <div className="bp-actions">
        <button type="button" className="btn btn--soft" onClick={onExport} disabled={busy}>
          ⬇️ 导出备份
        </button>
        <button
          type="button"
          className="btn btn--soft"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          ⬆️ 从备份恢复
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="bp-file"
          onChange={(e) => void onPick(e.target.files?.[0])}
        />
      </div>

      {busy && <div className="bp-note">正在读取备份文件…</div>}

      {error && (
        <div className="bp-note bp-note--error" role="alert">
          ⚠️ {error}
        </div>
      )}

      {done && (
        <div className="bp-note bp-note--ok" role="status">
          ✅ {done}
        </div>
      )}

      {/* 待确认：先看清楚这份备份里是什么，再决定要不要覆盖当前进度 */}
      {pending && (
        <div className="bp-confirm" role="dialog" aria-label="确认恢复备份">
          <div className="bp-confirm-title">这份备份里有：</div>
          <div className="bp-confirm-body">{summaryLine(pending.summary)}</div>
          {pending.migratedFrom !== undefined && (
            <div className="bp-confirm-warn">
              这是旧版本（v{pending.migratedFrom}）的备份，恢复时会自动升级到当前格式。
            </div>
          )}
          <div className="bp-confirm-warn">
            恢复会<strong>覆盖</strong>当前进度。如果现在也有进度要保留，请先导出。
          </div>
          <div className="bp-confirm-actions">
            <button type="button" className="btn btn--sm" onClick={onConfirm}>
              确认恢复
            </button>
            <button
              type="button"
              className="btn btn--sm btn--soft"
              onClick={() => setPending(null)}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
