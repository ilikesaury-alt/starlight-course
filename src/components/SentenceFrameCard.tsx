// 句子框架卡：填空 → 拼出整句 → 复用 SentenceReader 说出整句（跟读评分）。
// 儿童 UX：先选词拼句，再开口说整句；不展示相似度分数。

import { useState } from 'react'
import SentenceReader from './SentenceReader'
import SpeakButton from './SpeakButton'
import { fillFrame, type SentenceFrame } from '@/data/sentenceFrame'

interface Props {
  frame: SentenceFrame
  /** 说出整句达标 → 记入 SRS */
  onPass?: () => void
}

export default function SentenceFrameCard({ frame, onPass }: Props) {
  const [picks, setPicks] = useState<number[]>(() => frame.blanks.map(() => -1))
  const [showReader, setShowReader] = useState(false)

  const blanksCount = frame.blanks.length
  const filled = picks.every((p, i) => p >= 0 && p < frame.blanks[i].options.length)

  const pick = (blankIdx: number, optIdx: number) => {
    setPicks((prev) => {
      const next = [...prev]
      next[blankIdx] = optIdx
      return next
    })
    setShowReader(false)
  }

  // 空位按已选词渲染，未选显示 ___；零空位的框架直接是原句
  // 填词要插在两段之间：seg0 + word0 + seg1（见 fillFrame 注释）
  const preview = () => {
    if (blanksCount === 0) return frame.pattern
    return frame.pattern
      .split('___')
      .map((seg, idx) => {
        if (idx === 0) return seg
        const blank = frame.blanks[idx - 1]
        const p = picks[idx - 1]
        const word = p >= 0 && blank ? blank.options[p] : '___'
        return `${word}${seg}`
      })
      .join('')
  }

  const full = fillFrame(frame, picks.map((p, i) => (p >= 0 ? p : frame.blanks[i]?.answer ?? 0)))

  return (
    <div className="sfc-card">
      <div className="sfc-zh">💡 {frame.zh}</div>
      <div className="sfc-pattern">{preview()}</div>

      {blanksCount > 0 && (
        <div className="sfc-blanks">
          {frame.blanks.map((b, bi) => (
            <div key={bi} className="sfc-blank-row">
              <span className="sfc-blank-label">第 {bi + 1} 个空</span>
              <div className="sfc-opts">
                {b.options.map((o, oi) => (
                  <button
                    key={oi}
                    type="button"
                    className={'sfc-opt' + (picks[bi] === oi ? ' on' : '')}
                    onClick={() => pick(bi, oi)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="sfc-actions">
        <SpeakButton text={full} label="听整句" />
        <button
          type="button"
          className="btn"
          disabled={!filled}
          onClick={() => setShowReader(true)}
        >
          🎤 说出整句
        </button>
        {frame.hint && <span className="sfc-hint">{frame.hint}</span>}
      </div>

      {showReader && (
        <SentenceReader sentence={full} zh={frame.zh} onPass={onPass} />
      )}
    </div>
  )
}
