// 课文点读：整句中文 + 朗读整句按钮 + 逐词点读（逐词部分复用 TappableWords）。
// 整句中文不常驻，点单词时与右上角喇叭按钮同一行显示。

import { useState } from 'react'
import SpeakButton from './SpeakButton'
import TappableWords from './TappableWords'
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
  // 点过词才显示整句中文（与喇叭按钮同行）
  const [picked, setPicked] = useState(false)

  return (
    <div className="tt-wrap">
      <div className="tt-head">
        {picked && textZh && (
          <span className="tt-head-zh">{textZhAuto ? '逐词参考' : '整句'}：{textZh}</span>
        )}
        <SpeakButton text={text} label="朗读整句" />
      </div>

      <TappableWords text={text} vocab={vocab} boxOf={boxOf} onPick={() => setPicked(true)} />
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
