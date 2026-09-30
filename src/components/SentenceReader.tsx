// 逐句跟读卡片：播原句 → 孩子跟读 → 逐词高亮 → 达标点亮 / 再试一次。
// 儿童 UX：始终正反馈，不展示分数；识别失败先自动重听，仍不行由孩子自己重读或
// 跳过 —— 全程自动判定，没有「家长确认」这一环。

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

/** 终态失败的提示：重试一律指向麦克风按钮，不让孩子去找家长 */
const ERR_TEXT: Record<string, string> = {
  'no-speech':
    '没有听到声音：大声一点、靠近麦克风再说一次；也看看麦克风是不是被别的软件占用了',
  'not-allowed': '麦克风还没打开：点地址栏的锁图标，允许麦克风后再点「我来读」',
  network: '网络有点慢，识别服务连不上，等一下点「我来读」再说一次～',
  'audio-capture': '没找到麦克风，点「我来读」再试一次～',
  aborted: '这次断了，点「我来读」再来一遍～',
  unknown: '这次没识别出来，点「我来读」再说一次～',
}

/** 录音阶段：示范 → 在听 → 自动重听，三态文案固定、互不重叠 */
type Stage = 'play' | 'listen' | 'retry'
const STAGE_TEXT: Record<Stage, string> = {
  play: '🔊 先听一遍示范…',
  listen: '🎤 轮到你读啦！照着上面的句子大声说',
  retry: '🤔 没听清，我再听一次…',
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
  const stage: Stage | null = reader.retrying
    ? 'retry'
    : reader.status === 'playing'
      ? 'play'
      : reader.status === 'listening'
        ? 'listen'
        : null

  return (
    <div className="sr-card">
      <div className="sr-sentence">{sentence}</div>
      {zh && <div className="sr-zh">{zh}</div>}

      {/* 录音阶段横幅：波形动画 + 固定文案，让「正在听」看得见；
          在听时还显示识别出的中间文字，麦克风有没有收到声音一目了然 */}
      {stage && (
        <div className={`sr-stage sr-stage--${stage}`} role="status" aria-live="polite">
          <span className="sr-stage-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="sr-stage-text">{STAGE_TEXT[stage]}</span>
        </div>
      )}
      {stage === 'listen' && reader.interim && (
        <p className="sr-interim">👂 我听到：{reader.interim}</p>
      )}

      <div className="sr-actions">
        <SpeakButton text={sentence} label="听示范" autoPlay={autoPlay} />
        <button
          type="button"
          className={'btn sr-mic' + (reader.status === 'listening' ? ' is-live' : '')}
          onClick={reader.start}
          disabled={stage !== null}
        >
          {stage === 'play'
            ? '🔊 示范中…'
            : stage === 'listen' || stage === 'retry'
              ? '🎤 在听你说…'
              : '🎤 我来读'}
        </button>
        {/* 录音 / 示范进行中给一个明确的取消出口：不用干等它结束或出错 */}
        {stage && (
          <button type="button" className="btn btn-soft" onClick={reader.cancel}>
            ⏹ 停一下
          </button>
        )}
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

      {/* 终态降级（麦克风没权限 / 自动重听用完）：重试走上面的麦克风按钮，
          这里只留「跳过这句」，不找家长代答。
          浏览器不支持识别时只留一条常驻说明 —— 没有可跳过的失败态，也不假装能打分 */}
      {reader.degraded && !scored && !reader.retrying && (
        <div className="sr-fallback">
          <p className="sr-fallback-text">
            {!reader.supported
              ? '这个浏览器不支持语音识别，换 Chrome / Edge 就能自动打分'
              : ERR_TEXT[reader.errorCode ?? 'unknown'] ?? ERR_TEXT.unknown}
          </p>
          {reader.supported && (
            <div className="sr-fallback-actions">
              <button type="button" className="btn btn-soft" onClick={reader.skip}>
                ➡️ 跳过这句
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
