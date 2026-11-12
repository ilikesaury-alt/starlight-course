// 逐词点读：任意英文句子的每个词都可点（朗读 + 弹释义），
// 记忆状态按 SrsCard.box 着色（熟=绿 / 模糊=黄 / 未知=灰）。
// 从 TappableText 抽出，供课文点读、外教对话、重点句型、句型框架卡等所有区域复用，
// 保证「点词听发音、看词义」的交互在全站一致。

import { useState } from 'react'
import { speakText } from '@/utils/speak'
import { useSlowMode } from '@/utils/slowMode'
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
  /** 额外标记：入参是归一后的词形（wordBase），返回 true 就加 --mark 类（阅读区标本课词用） */
  mark?: (base: string) => boolean
  /** 点到词时回调（供外层做联动，如显示整句译文） */
  onPick?: (word: string) => void
  /** 页面级补充词典：接在全局 lookupZh 之后。默认不传 = 6 个既有消费者行为逐字节不变。
   *  Rocket Girl 用它注入「这一关的词表 + 词形回退」，不污染全局 BOOK_WORD_ZH
   *  （后者还被 bookQuiz.ts 用来挑挖空候选，倒进去会改变 Fly Guy / Starlight 出题分布）。 */
  lookup?: (base: string) => string | undefined
  /** 这一句的中文。词级释义查不到时用它兜底 —— 孩子至少能看懂整句意思，
   *  不会撞上「（词典里还没这个词）」的死胡同。默认不传 = 行为不变。 */
  sentenceZh?: string
}

export default function TappableWords({
  text,
  vocab = [],
  boxOf,
  mark,
  onPick,
  lookup,
  sentenceZh,
}: Props) {
  const [picked, setPicked] = useState<{ word: string; zh: string; emoji?: string } | null>(null)
  // 全局慢速开关：与整句朗读共用同一套语速（TouchRead「same pronunciation profile」）
  const slow = useSlowMode()

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
          const zh = entry?.zh || lookupZh(base) || lookup?.(base) || ''
          const level = boxLevel(boxOf?.(base))
          return (
            <button
              key={i}
              type="button"
              className={`tt-word tt-word--${level}${mark?.(base) ? ' tt-word--mark' : ''}`}
              onClick={() => {
                speakText(cleanForSpeak(tk), { slow })
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
          {/* 词级查不到时优先给整句中文（RG 例句 100% 有中文），
              比「词典里还没这个词」有用得多；连整句也没有才回退到那句提示。 */}
          <span className="tt-pop-zh">
            {picked.zh || (sentenceZh ? `这句的意思：${sentenceZh}` : '（词典里还没这个词）')}
          </span>
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
