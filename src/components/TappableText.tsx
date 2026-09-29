// 课文点读：按词切分（保留空白），每词可点（朗读 + 弹释义），
// 记忆状态按 SrsCard.box 着色（熟=绿 / 模糊=黄 / 未知=灰），整句可朗读；
// 整句中文不常驻，点单词时与右上角喇叭按钮同一行显示。

import { useState } from 'react'
import SpeakButton from './SpeakButton'
import { speakText } from '@/utils/speak'
import { lookupZh, wordBase, cleanForSpeak } from '@/utils/bookDict'
import { boxLevel } from '@/utils/boxLevel'
import { MAX_BOX } from '@/data/srs'
import type { Word } from '@/data/starlight'

interface Props {
  /** 一句课文 */
  text: string
  /** 整句中文（人工翻译优先，缺失时由调用方传逐词拼出的粗释义）；点单词时显示在喇叭按钮同行 */
  textZh?: string
  /** 整句中文是否为逐词拼出的粗释义（用于换个措辞，不冒充整句翻译） */
  textZhAuto?: boolean
  /** 本课词表，用于优先取 emoji/中文释义 */
  vocab?: Word[]
  /** en → 记忆盒号，来自 SRS */
  boxOf?: (en: string) => number | undefined
}

export default function TappableText({ text, textZh, textZhAuto = false, vocab = [], boxOf }: Props) {
  const [picked, setPicked] = useState<{ word: string; zh: string; emoji?: string } | null>(null)

  const vocabIndex = new Map<string, Word>()
  for (const w of vocab) vocabIndex.set(w.en.toLowerCase(), w)

  // 按空白切分，同时保留空白（渲染时不丢空格）
  const tokens = text.split(/(\s+)/)

  return (
    <div className="tt-wrap">
      <div className="tt-head">
        {/* 整句中文不常驻：点单词时跟喇叭按钮同一行显示（按钮居右、译文居左） */}
        {picked && textZh && (
          <span className="tt-head-zh">{textZhAuto ? '逐词参考' : '整句'}：{textZh}</span>
        )}
        <SpeakButton text={text} label="朗读整句" />
      </div>

      <p className="tt-text">
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
              }}
              title={zh || '点击听发音'}
              data-zh={zh || undefined}
            >
              {tk}
            </button>
          )
        })}
      </p>

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

/** 着色图例：整课只渲染一次（在课文区顶部），不随每句重复 */
export function PassageLegend() {
  return (
    <div className="tt-legend">
      <span className="tt-word tt-word--known">熟</span>
      <span className="tt-word tt-word--vague">模糊</span>
      <span className="tt-word tt-word--unknown">未知</span>
      <span className="tt-legend-note">按记忆强度着色，共 {MAX_BOX + 1} 档</span>
    </div>
  )
}
