// 外教课堂对话：把 lessonDialogue.ts 里的一课对话渲染成聊天气泡。
// 👩‍🏫 外教在左、🧒 孩子在右；每句逐词可点（朗读 + 弹释义），附中文对照与教学提示。
//
// 2026-10-10 UI 重构（docs/lesson-detail-ui-research.md）：
//   · 删掉每轮的「慢速」按钮 —— 原来每轮 2 个喇叭，慢速与正常的区分度对孩子几乎为零；
//     改成 PlayTools 里的全局「🐢 慢速」开关，点词和整句共用同一套语速。
//   · 中文改为按需显示：默认收起，点「🇨🇳 中文」才展开该轮译文，
//     避免英文被中文稀释（原来常驻时英文每句都配一行中文，气泡高度翻倍）。

import { useState } from 'react'
import ZoneCard from './ZoneCard'
import TappableWords from './TappableWords'
import SpeakButton from './SpeakButton'
import PlayTools from './PlayTools'
import type { LessonDialogue as LessonDialogueData } from '@/data/lessonDialogue'
import type { Word } from '@/data/starlight'

export default function LessonDialogueBox({
  dialogue,
  mcStyle,
  vocab,
  boxOf,
}: {
  dialogue: LessonDialogueData
  mcStyle: React.CSSProperties
  /** 本课词表：点词弹释义时优先取 emoji/中文 */
  vocab?: Word[]
  /** en → 记忆盒号，来自 SRS（点词着色） */
  boxOf?: (en: string) => number | undefined
}) {
  // 中文按需：默认收起，需要对照时再打开
  const [showZh, setShowZh] = useState(false)

  return (
    <ZoneCard title={`🎭 外教课堂对话 · ${dialogue.title}`} side="点词听发音" mcStyle={mcStyle}>
      <p className="zone-lead">
        外教上课时可能这样和你说话，先看再听。
        <span className="sent-hint">点单词听发音，点 🔊 听整句</span>
      </p>
      <PlayTools hint="点单词听发音">
        <button
          type="button"
          className={'btn btn-soft' + (showZh ? ' active' : '')}
          onClick={() => setShowZh((v) => !v)}
          aria-pressed={showZh}
          data-testid="dialogue-zh-toggle"
        >
          {showZh ? '🇨🇳 隐藏中文' : '🇨🇳 显示中文'}
        </button>
      </PlayTools>
      <div className="dialogue-list">
        {dialogue.turns.map((t, i) => (
          <div key={i} className={'dialogue-bubble ' + (t.speaker === 'T' ? 'left' : 'right')}>
            <div className="dialogue-speaker">{t.speaker === 'T' ? '👩‍🏫 外教' : '🧒 孩子'}</div>
            <TappableWords text={t.en} vocab={vocab} boxOf={boxOf} />
            <div className="dialogue-foot">
              <SpeakButton text={t.en} label="朗读整句" />
            </div>
            {showZh && t.note && <div className="dialogue-note">{t.note}</div>}
            {showZh && t.zh && <div className="dialogue-zh">{t.zh}</div>}
          </div>
        ))}
      </div>
    </ZoneCard>
  )
}
