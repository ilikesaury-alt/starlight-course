// 剧本页（英语小剧场 · 角色朗读）
// 互动形式：选角色 → 只看/只听这个角色的台词 → 逐句跟读 → 打卡。
// 「全部」模式则按剧本顺序通读，方便亲子分角色演一遍。

import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import SpeakButton from '@/components/SpeakButton'
import EngFlipWords from '@/components/EngFlipWords'
import { eng3aPlays, getEngPlay, ENG3A_THEME } from '@/data/eng3a'
import { dayStamp } from '@/data/srs'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'

export default function Eng3aPlayScript() {
  const { playId = '' } = useParams()
  const play = getEngPlay(playId)
  const recite = useCourseStore((s) => s.eng3aRecite)
  const completed = useCourseStore((s) => s.completedEng3a)
  const markRecite = useCourseStore((s) => s.markEng3aRecite)
  const markDone = useCourseStore((s) => s.markEng3aDone)
  const seedCards = useCourseStore((s) => s.seedCards)

  const [role, setRole] = useState<string>('全部')

  // 进剧本即把重点词播种进 SRS（module='eng3a'），进入智能复习到期调度
  useEffect(() => {
    if (!play) return
    seedCards(play.words.map((w) => w.en), 'eng3a')
    setRole('全部')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play?.slug])

  const playIdx = useMemo(() => eng3aPlays.findIndex((p) => p.slug === playId), [playId])
  const prevPlay = playIdx > 0 ? eng3aPlays[playIdx - 1] : undefined
  const nextPlay =
    playIdx >= 0 && playIdx < eng3aPlays.length - 1 ? eng3aPlays[playIdx + 1] : undefined

  if (!play) {
    return (
      <div className="empty">
        <p>没有找到这个剧本。</p>
        <Link to="/eng3a/play" className="btn">返回小剧场</Link>
      </div>
    )
  }

  const mcStyle = moduleThemeVars(play.theme)
  const days = recite[play.slug] ?? []
  const today = days.includes(dayStamp())
  const streak = (() => {
    if (!days.length) return 0
    const set = new Set(days)
    let cur = dayStamp()
    let n = 0
    while (set.has(cur)) {
      n++
      cur -= 1
    }
    return n
  })()
  const done = completed.includes(play.slug)

  const visibleLines =
    role === '全部' ? play.lines : play.lines.filter((l) => l.speaker === role)

  const readAll = () => {
    const text = visibleLines.map((l) => l.en).join(' ')
    speakText(text, { lang: 'en' })
  }

  const speakerLabel = (name?: string) =>
    name ? `${name}（${play.charactersZh[name] ?? ''}）`.replace('（）', '') : '旁白'

  return (
    <div className="page en3-play-script" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{play.emoji}</span>
        <div>
          <div className="page-kicker">英语小剧场</div>
          <h1 className="page-title">{play.titleZh}</h1>
        </div>
      </div>

      <div className="en3-play-en-title">{play.title}</div>
      <div className="en3-play-moral-big">💡 {play.moral}</div>

      {/* 角色选择：选一个角色，就只看（只念）这个角色的台词 */}
      <div className="en3-role-bar">
        <div className="en3-role-hint">🎭 选一个角色，跟着念他的台词：</div>
        <div className="en3-role-chips">
          {['全部', ...play.characters].map((c) => (
            <button
              key={c}
              type="button"
              className={'en3-role-chip' + (role === c ? ' active' : '')}
              onClick={() => setRole(c)}
            >
              {c === '全部' ? '📖 全部' : `${c}${play.charactersZh[c] ? ` · ${play.charactersZh[c]}` : ''}`}
            </button>
          ))}
        </div>
      </div>

      <div className="en3-script-toolbar">
        <button type="button" className="cn-read-all" onClick={readAll}>
          🔊 朗读{role === '全部' ? '全剧' : '我的台词'}
        </button>
        <span className="en3-script-count">
          {role === '全部' ? `全剧 ${play.lines.length} 句` : `我的台词 ${visibleLines.length} 句`}
        </span>
      </div>

      <SafeBoundary label="剧本台词">
        <div className="en3-script">
          {visibleLines.map((l, i) => (
            <div
              key={i}
              className={'en3-script-line' + (l.speaker ? '' : ' narr')}
              style={l.speaker ? mcStyle : undefined}
            >
              {l.speaker && <span className="en3-script-speaker">{speakerLabel(l.speaker)}</span>}
              <div className="en3-script-main">
                <span className="en3-script-en">{l.en}</span>
                <SpeakButton text={l.en} label={l.en} slow />
              </div>
              <div className="en3-script-zh">{l.zh}</div>
              {l.stage && <div className="en3-script-stage">（{l.stage}）</div>}
            </div>
          ))}
        </div>
      </SafeBoundary>

      {/* 剧本重点词：复用翻卡，和课文模块的互动形式保持一致 */}
      <section className="en3-script-words" style={mcStyle}>
        <div className="cn-section-title">🔤 剧本重点词</div>
        <EngFlipWords words={play.words} />
      </section>

      {/* 打卡：念完一遍就算今天读过 */}
      <section className="cn-recite" style={mcStyle}>
        <p className="lead">念完一遍台词，给自己打个卡吧。</p>
        <div className="cn-recite-stats">
          <div className="cn-recite-stat">
            <div className="cn-recite-num">{streak}</div>
            <div className="cn-recite-label">连续朗读(天)</div>
          </div>
          <div className="cn-recite-stat">
            <div className="cn-recite-num">{days.length}</div>
            <div className="cn-recite-label">累计打卡(次)</div>
          </div>
        </div>
        <button
          type="button"
          className={'cn-recite-btn' + (today ? ' done' : '')}
          onClick={() => markRecite(play.slug)}
          disabled={today}
        >
          {today ? '✅ 今天已打卡' : '📅 今天念过了，打卡！'}
        </button>
        {today && <p className="cn-recite-hint">真棒！明天换一个角色再演一次吧～</p>}
      </section>

      <div style={{ textAlign: 'center', marginTop: '18px' }}>
        {done ? (
          <p style={{ color: 'var(--ok)', fontWeight: 600 }}>✅ 这个剧本已经演过啦</p>
        ) : (
          <button type="button" className="btn btn-soft" onClick={() => markDone(play.slug)}>
            ✅ 我们演完啦
          </button>
        )}
      </div>

      <div className="page-nav">
        <Link to="/eng3a/play" className="back-link">← 小剧场</Link>
        <div className="lesson-nav">
          {prevPlay && (
            <Link to={`/eng3a/play/${prevPlay.slug}`} className="btn btn-soft">
              ← {prevPlay.titleZh}
            </Link>
          )}
          {nextPlay && (
            <Link to={`/eng3a/play/${nextPlay.slug}`} className="btn">
              {nextPlay.titleZh} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
