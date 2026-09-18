// 句子连线（说句子关卡的互动形式）
// ------------------------------------------------------------
// 从本课句型对话里自动取 4 组「英文 ↔ 中文」，左边英文、右边中文打乱顺序，
// 先点英文再点中文，配对正确就变绿锁住。目的不是考记忆，而是让孩子
// 把「这一句英文」和「这个意思」对上号 —— 阅读理解的第一次真实提取。
//
// 设计取舍：不额外维护一份配对数据，直接复用 dialogs 的 en/zh，
// 这样加了新句型对话，连线题自动跟着更新，不会两处数据打架。

import { useMemo, useState } from 'react'
import SpeakButton from '@/components/SpeakButton'
import type { EngDialog } from '@/data/eng3a'

interface Pair {
  id: number
  en: string
  zh: string
}

/** 取前 4 组「有中文、且英文句子不太长」的句型，太长的连起来吃力 */
function buildPairs(dialogs: EngDialog[], limit = 4): Pair[] {
  const seen = new Set<string>()
  const picked: Pair[] = []
  for (const d of dialogs) {
    if (!d.zh || !d.en) continue
    const key = d.en.trim()
    if (seen.has(key)) continue
    seen.add(key)
    picked.push({ id: picked.length, en: key, zh: d.zh })
  }
  picked.sort((a, b) => a.en.length - b.en.length)
  return picked.slice(0, limit)
}

/** 固定顺序的洗牌（按下标奇偶交错），避免 Math.random 造成重复渲染抖动 */
function shuffle<T>(arr: T[]): T[] {
  const out: T[] = []
  const even = arr.filter((_, i) => i % 2 === 0)
  const odd = arr.filter((_, i) => i % 2 === 1)
  for (let i = 0; i < arr.length; i++) {
    out.push((i % 2 === 0 ? odd : even).shift() ?? arr[i])
  }
  return out
}

export default function EngMatchPairs({ dialogs }: { dialogs: EngDialog[] }) {
  const pairs = useMemo(() => buildPairs(dialogs), [dialogs])
  const [round, setRound] = useState(0)

  const leftOrder = useMemo(
    () => (round % 2 === 0 ? pairs : pairs.slice().reverse()),
    [pairs, round],
  )
  const rightOrder = useMemo(
    () => (round % 2 === 0 ? shuffle(pairs) : shuffle(pairs.slice().reverse())),
    [pairs, round],
  )

  const [en, setEn] = useState<number | null>(null)
  const [zh, setZh] = useState<number | null>(null)
  const [matched, setMatched] = useState<number[]>([])
  const [wrongFlash, setWrongFlash] = useState<{ en: number; zh: number } | null>(null)

  if (pairs.length < 2) return null

  const done = matched.length === pairs.length

  const pickEn = (id: number) => {
    if (matched.includes(id)) return
    setEn(id)
    if (zh !== null) judge(id, zh)
  }
  const pickZh = (id: number) => {
    if (matched.includes(id)) return
    setZh(id)
    if (en !== null) judge(en, id)
  }

  const judge = (enId: number, zhId: number) => {
    if (enId === zhId) {
      setMatched((m) => [...m, enId])
      setEn(null)
      setZh(null)
    } else {
      setWrongFlash({ en: enId, zh: zhId })
      window.setTimeout(() => {
        setWrongFlash(null)
        setEn(null)
        setZh(null)
      }, 520)
    }
  }

  const restart = () => {
    setRound((r) => r + 1)
    setEn(null)
    setZh(null)
    setMatched([])
    setWrongFlash(null)
  }

  const cls = (side: 'en' | 'zh', id: number) => {
    const locked = matched.includes(id)
    const picked = side === 'en' ? en === id : zh === id
    const wrong = wrongFlash ? wrongFlash[side] === id : false
    return (
      'en3-match-item' +
      (locked ? ' matched' : '') +
      (picked && !locked ? ' picked' : '') +
      (wrong ? ' wrong' : '')
    )
  }

  return (
    <div className="en3-match">
      <div className="en3-match-bar">
        <span className="en3-match-tip">🔗 先点左边的英文，再点右边对应的中文</span>
        <span className="en3-match-progress">
          {matched.length} / {pairs.length}
        </span>
      </div>

      <div className="en3-match-board">
        <div className="en3-match-col">
          {leftOrder.map((p) => (
            <div
              key={p.id}
              className={cls('en', p.id)}
              role="button"
              tabIndex={0}
              onClick={() => pickEn(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  pickEn(p.id)
                }
              }}
            >
              <span className="en3-match-text">{p.en}</span>
              <span className="en3-match-speak" onClick={(e) => e.stopPropagation()}>
                <SpeakButton text={p.en} label={p.en} slow />
              </span>
            </div>
          ))}
        </div>
        <div className="en3-match-col">
          {rightOrder.map((p) => (
            <div
              key={p.id}
              className={cls('zh', p.id)}
              role="button"
              tabIndex={0}
              onClick={() => pickZh(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  pickZh(p.id)
                }
              }}
            >
              <span className="en3-match-text">{p.zh}</span>
            </div>
          ))}
        </div>
      </div>

      {done && (
        <div className="en3-match-done">
          <span>🎉 全部连对啦！</span>
          <button type="button" className="cn-read-all" onClick={restart}>
            🔁 再来一次
          </button>
        </div>
      )}
    </div>
  )
}
