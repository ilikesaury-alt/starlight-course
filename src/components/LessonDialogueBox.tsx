// 外教课堂对话：把 lessonDialogue.ts 里的一课对话渲染成聊天气泡。
// 👩‍🏫 外教在左、🧒 孩子在右；每句逐词可点（朗读 + 弹释义），附中文对照与教学提示。

import ZoneCard from './ZoneCard'
import TappableWords from './TappableWords'
import SpeakButton from './SpeakButton'
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
  return (
    <ZoneCard title={`🎭 外教课堂对话 · ${dialogue.title}`} side="点词听发音" mcStyle={mcStyle}>
      <div className="dialogue-list">
        {dialogue.turns.map((t, i) => (
          <div key={i} className={'dialogue-bubble ' + (t.speaker === 'T' ? 'left' : 'right')}>
            <div className="dialogue-speaker">{t.speaker === 'T' ? '👩‍🏫 外教' : '🧒 孩子'}</div>
            <TappableWords text={t.en} vocab={vocab} boxOf={boxOf} />
            <div className="dialogue-foot">
              <SpeakButton text={t.en} label="朗读整句" />
              <SpeakButton text={t.en} label="慢速" slow />
            </div>
            {t.note && <div className="dialogue-note">{t.note}</div>}
            {t.zh && <div className="dialogue-zh">{t.zh}</div>}
          </div>
        ))}
      </div>
    </ZoneCard>
  )
}
