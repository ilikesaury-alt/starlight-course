// 单词翻卡（认单词关卡的互动形式）
// ------------------------------------------------------------
// 设计取舍：三年级孩子需要「先看英文、想中文」的提取练习，而不是把
// 英文与中文并排摆着读一遍。翻卡把中文藏在背面，让孩子先自己回忆，
// 再翻过来核对 —— 这就是最小成本的「主动回忆」。
// 卡片正面只放 emoji + 英文（点 🔊 听发音），背面放中文 + 例句。
//
// 实现注意：卡片外层必须用 div[role=button] 而非 <button> ——
// SpeakButton 本身就是 <button>，button 嵌套 button 是非法 HTML，
// 浏览器会拆开节点导致翻面失效。用 stopPropagation 拦住发音键的冒泡。

import { useState } from 'react'
import SpeakButton from '@/components/SpeakButton'
import type { EngWord } from '@/data/eng3a'

export default function EngFlipWords({ words }: { words: EngWord[] }) {
  // flipped[i] === true 表示第 i 张卡「相对默认状态取反」：
  // 默认全盖上时 true = 翻开；点过「全部翻开」后 true = 盖上。
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const [allOpen, setAllOpen] = useState(false)

  const isOpen = (i: number) => (allOpen ? !flipped[i] : !!flipped[i])
  const toggle = (i: number) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))

  const toggleAll = () => {
    setFlipped({})
    setAllOpen((v) => !v)
  }

  if (!words.length) return null

  return (
    <div className="en3-flip-wrap">
      <div className="en3-flip-bar">
        <span className="en3-flip-tip">👆 先看英文想一想，再点卡片翻过来检查</span>
        <button type="button" className="en3-flip-all" onClick={toggleAll}>
          {allOpen ? '🙈 全部盖上' : '👀 全部翻开'}
        </button>
      </div>
      <div className="en3-flip-grid">
        {words.map((w, i) => (
          <div
            key={`${w.en}-${i}`}
            className={'en3-flip-card' + (isOpen(i) ? ' open' : '')}
            role="button"
            tabIndex={0}
            aria-label={`单词卡 ${w.en}`}
            onClick={() => toggle(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggle(i)
              }
            }}
          >
            <div className="en3-flip-inner">
              <div className="en3-flip-face en3-flip-front">
                {w.emoji && <span className="en3-flip-emoji">{w.emoji}</span>}
                <span className="en3-flip-en">{w.en}</span>
                <span className="en3-flip-speak" onClick={(e) => e.stopPropagation()}>
                  <SpeakButton text={w.en} label={w.en} />
                </span>
              </div>
              <div className="en3-flip-face en3-flip-back">
                <span className="en3-flip-zh">{w.zh}</span>
                {w.sentence && <span className="en3-flip-eg">{w.sentence}</span>}
                {w.sentenceZh && <span className="en3-flip-egzh">{w.sentenceZh}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
