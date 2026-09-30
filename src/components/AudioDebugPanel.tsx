/**
 * 语音诊断面板（仅在 `?debug=audio` 时挂载，生产默认不存在任何 DOM）。
 *
 * 解决的问题：「点了播放没声音」在三级兜底链里无从判断到底是哪一级坏了。
 * 面板直接回答三个问题：
 *   1. 这台机器缺什么？（WebGPU / 系统语音包 en·zh 数量）
 *   2. 上一次真正出声的是哪一级引擎？
 *   3. 刚才这次点击，各级引擎分别发生了什么（failed / blocked / note + 耗时）？
 *
 * 开启方式（任一，刷新后生效）：
 *   - 地址栏加 ?debug=audio（HashRouter 下 #/xxx?debug=audio 同样识别）
 *   - 控制台执行 localStorage.setItem('starlight.debug.audio','1')
 */

import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  clearTrace,
  getLastSuccess,
  getTrace,
  isAudioDebug,
  readAudioEnv,
  subscribeTrace,
  type TraceEvent,
} from '@/utils/engine/engineTrace'
import { isKokoroEnabled, isKokoroReady } from '@/utils/engine/kokoro'

/** 订阅事件流：面板需要在引擎切换/记录时重渲染 */
function useTraceVersion(): number {
  return useSyncExternalStore(subscribeTrace, () => getTrace().length, () => 0)
}

const STATUS_TEXT: Record<TraceEvent['status'], string> = {
  success: '✅ 出声',
  failed: '❌ 失败',
  blocked: '⛔ 被拦截',
  aborted: '⏹ 已取消',
  note: 'ℹ️ 提示',
}

const STATUS_COLOR: Record<TraceEvent['status'], string> = {
  success: '#1a7f37',
  failed: '#b42318',
  blocked: '#b54708',
  aborted: '#667085',
  note: '#175cd3',
}

function timeOf(at: number): string {
  const d = new Date(at)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export default function AudioDebugPanel() {
  const version = useTraceVersion()
  // 语音包是异步加载的，每 2s 刷一次环境快照
  const [, force] = useState(0)
  useEffect(() => {
    if (!isAudioDebug()) return
    const t = setInterval(() => force((n) => n + 1), 2000)
    return () => clearInterval(t)
  }, [])

  if (!isAudioDebug()) return null

  const env = readAudioEnv({ enabled: isKokoroEnabled(), ready: isKokoroReady() })
  const last = getLastSuccess()
  const events = getTrace()
  const missing: string[] = []
  if (!env.voiceEn) missing.push('英文语音包')
  if (!env.voiceZh) missing.push('中文语音包')
  if (env.kokoroEnabled && !env.kokoroReady) missing.push('Kokoro 模型未就绪')

  return (
    <div
      style={{
        position: 'fixed',
        right: 10,
        bottom: 10,
        zIndex: 9999,
        width: 330,
        maxHeight: '62vh',
        overflow: 'auto',
        padding: '8px 10px',
        borderRadius: 10,
        background: 'rgba(20,20,24,0.92)',
        color: '#e6e6ea',
        font: '12px/1.5 ui-monospace, Menlo, Consolas, monospace',
        boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b>🔊 语音诊断</b>
        <button
          type="button"
          onClick={clearTrace}
          style={{
            background: '#333',
            color: '#eee',
            border: 0,
            borderRadius: 6,
            padding: '2px 8px',
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          清空
        </button>
      </div>

      <div style={{ marginTop: 4, color: '#9aa4b2' }}>
        WebGPU {env.webgpu ? '✅' : '❌'} · Kokoro{' '}
        {env.kokoroEnabled ? (env.kokoroReady ? '✅已就绪' : '⏳未就绪') : '⏸已关闭'} · 语音包 en{' '}
        {env.voiceEn} / zh {env.voiceZh}（共 {env.voiceTotal}）
      </div>

      {missing.length > 0 && (
        <div style={{ marginTop: 4, color: '#fdb022' }}>⚠️ 缺：{missing.join('、')}</div>
      )}

      <div style={{ marginTop: 6 }}>
        上次出声：
        {last ? (
          <span style={{ color: '#7ee787' }}>
            {last.engine} · 「{last.text}」 · {timeOf(last.at)}
          </span>
        ) : (
          <span style={{ color: '#f85149' }}>还没有任何一次成功出声</span>
        )}
      </div>

      <div style={{ marginTop: 6, color: '#9aa4b2' }}>最近事件（key={version}）</div>
      {events.length === 0 ? (
        <div style={{ color: '#667085' }}>点任意 🔊 按钮后这里会出现记录</div>
      ) : (
        <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
          {events
            .slice()
            .reverse()
            .slice(0, 12)
            .map((e) => (
              <li key={e.id} style={{ borderBottom: '1px solid #2a2a31', padding: '2px 0' }}>
                <span style={{ color: '#6b7280' }}>{timeOf(e.at)}</span>{' '}
                <b>{e.engine}</b>{' '}
                <span style={{ color: STATUS_COLOR[e.status] }}>{STATUS_TEXT[e.status]}</span>{' '}
                <span style={{ color: '#6b7280' }}>{e.ms}ms</span>
                {e.text && <span style={{ color: '#9aa4b2' }}>「{e.text}」</span>}
                {e.note && (
                  <div style={{ color: '#8b949e', paddingLeft: 2 }}>{e.note}</div>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
