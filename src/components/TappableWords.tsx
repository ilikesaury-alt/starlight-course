// 逐词点读：任意英文句子的每个词都可点（朗读 + 弹释义），
// 记忆状态按 SrsCard.box 着色（熟=绿 / 模糊=黄 / 未知=灰）。
// 从 TappableText 抽出，供课文点读、外教对话、重点句型、句型框架卡等所有区域复用，
// 保证「点词听发音、看词义」的交互在全站一致。

import { useState } from 'react'
import { speakText } from '@/utils/speak'
import { lookupZh, wordBase, cleanForSpeak } from '@/utils/bookDict'
import { boxLevel } from '@/utils/boxLevel'
import type { Word } from '@/data/starlight'

interface Props {
  /** 一句英文 */
  text: string
  /** 本课词表，用于优先取 emoji/中文释义 */
  vocab?: Word[]
  /** en → 记忆盒号，来自 SRS */
  boxOf?: (en: string) => number | undefined
  /** 点到词时回调（供外层做联动，如显示整句译文） */
  onPick?: (word: string) => void
}

export default function TappableWords({ text, vocab = [], boxOf, onPick }: Props) {
  const [picked, setPicked] = useState<{ word: string; zh: string; emoji?: string } | null>(null)

  const vocabIndex = new Map<string, Word>()
  for (const w of vocab) vocabIndex.set(w.en.toLowerCase(), w)

  // 按空白切分，同时保留空白（渲染时不丢空格）
  const tokens = text.split(/(\s+)/)

  return (
    <div className="tt-words">
      <div className="tt-text">
        {tokens.map((tk, i) => {
          if (/^\s+$/.test(tk)) return <span key={i}> </span>
          const base = wordBase(tk)
          const entry = vocabIndex.get(base)
          const zh = entry?.zh || lookupZh(base) || ''
          const level = boxLevel(boxOf?.(base))
          return (
            <button
              key={i}
              type="button"
              className={`tt-word tt-word--${level}`}
              onClick={() => {
                speakText(cleanForSpeak(tk))
                setPicked({ word: tk, zh, emoji: entry?.emoji })
                onPick?.(base)
              }}
              title={zh || '点击听发音'}
              data-zh={zh || undefined}
            >
              {tk}
            </button>
          )
        })}
      </div>

      {/* 词义弹层 */}
      {picked && (
        <div className="tt-pop" role="status">
          <span className="tt-pop-emoji">{picked.emoji || '📖'}</span>
          <span className="tt-pop-word">{picked.word}</span>
          <span className="tt-pop-zh">{picked.zh || '（词典里还没这个词）'}</span>
          <button
            type="button"
            className="tt-pop-close"
            aria-label="关闭释义"
            onClick={() => setPicked(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
