// 逐句跟读卡片：播原句 → 孩子跟读 → 逐词高亮 → 达标点亮 / 再试一次。
// 儿童 UX：始终正反馈，不展示分数；识别不了时给「家长确认」按钮，流程不中断。

import { useEffect } from 'react'
import SpeakButton from './SpeakButton'
import { useSentenceReader } from '@/hooks/useSentenceReader'
import { normalize } from '@/utils/similarity'

interface Props {
  /** 原句 */
  sentence: string
  /** 中文提示 */
  zh?: string
  /** 达标回调（达标记对 SRS）*/
  onPass?: () => void
  /** 切句后自动播一遍示范（由「上一句 / 下一句」点击触发） */
  autoPlay?: boolean
}

const ERR_TEXT: Record<string, string> = {
  'no-speech': '没有听清，再说一次试试？',
  'not-allowed': '需要允许使用麦克风哦',
  network: '网络不通，先请家长确认吧',
  'audio-capture': '找不到麦克风，请家长确认',
  aborted: '再试一次吧',
  unknown: '识别出了点问题，请家长确认',
}

/** 把原句按词切开，标出「已说到的词」 */
function highlight(sentence: string, heard: string | null, passed: boolean) {
  const toks = normalize(sentence).split(' ').filter(Boolean)
  const heardSet = new Set(normalize(heard ?? '').split(' ').filter(Boolean))
  const hasHeard = heardSet.size > 0
  return toks.map((t, i) => {
    let cls = 'sr-word'
    if (hasHeard) {
      if (heardSet.has(t)) cls += passed ? ' sr-word--hit' : ' sr-word--near'
      else cls += ' sr-word--miss'
    }
    return (
      <span key={i} className={cls}>
        {t}{' '}
      </span>
    )
  })
}

export default function SentenceReader({ sentence, zh, onPass, autoPlay = false }: Props) {
  // 只在达标时回调 onPass：页面用它把「答对」写进 SRS，
  // 若失败也回调会把没读对的句子记成记得（错调度）。
  const reader = useSentenceReader({
    reference: sentence,
    onPass: (ok) => { if (ok) onPass?.() },
  })
  const { reset } = reader
  // 换句回到待播状态
  useEffect(() => { reset() }, [sentence, reset])

  const passed = reader.result?.passed ?? false
  const scored = reader.status === 'scored'

  return (
    <div className="sr-card">
      <div className="sr-sentence">{sentence}</div>
      {zh && <div className="sr-zh">{zh}</div>}

      <div className="sr-actions">
        <SpeakButton text={sentence} label="听示范" autoPlay={autoPlay} />
        <button
          type="button"
          className={'btn sr-mic' + (reader.status === 'listening' ? ' is-live' : '')}
          onClick={reader.start}
          disabled={reader.status === 'listening'}
        >
          {reader.status === 'playing' ? '🔊 示范中…' : reader.status === 'listening' ? '🎤 在听你说…' : '🎤 我来读'}
        </button>
        {scored && !passed && (
          <button type="button" className="btn btn-soft" onClick={reader.start}>🔁 再试一次</button>
        )}
      </div>

      {scored && (
        <div className={'sr-result ' + (passed ? 'sr-result--ok' : 'sr-result--retry')}>
          {passed ? (
            <span>🌟 太棒了！读得真棒！</span>
          ) : (
            <span>💪 差一点点，试试再读一次～</span>
          )}
        </div>
      )}

      {scored && (
        <div className="sr-words">
          {highlight(sentence, reader.result?.heard ?? null, passed)}
        </div>
      )}

      {/* 降级：浏览器不支持识别 / 权限被拒 / 离线 / 无麦克风 */}
      {reader.degraded && !scored && (
        <div className="sr-fallback">
          <p className="sr-fallback-text">
            {!reader.supported
              ? '这个浏览器不支持语音识别，请家长帮忙确认一下～'
              : ERR_TEXT[reader.errorCode ?? 'unknown'] ?? ERR_TEXT.unknown}
          </p>
          <button type="button" className="btn" onClick={reader.confirmByParent}>
            ✅ 家长确认：读对了
          </button>
        </div>
      )}
    </div>
  )
}
