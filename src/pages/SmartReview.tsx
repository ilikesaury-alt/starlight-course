import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { modules, STARLIGHT_THEME } from '../data/starlight'
import { MODULE_LIST, moduleThemeOf, type ModuleId } from '../data/modules'
import { useCourseStore } from '../store/useCourseStore'
import { boxLabel, boxEmoji, type SrsCard } from '../data/srs'
import { speakText } from '../utils/speak'
import { moduleThemeVars } from '../utils/theme'

// 建一份 en → 内容元信息的索引,供卡片渲染时取 emoji/zh/ipa（单词和句型都索引）
interface ContentMeta {
  en: string
  zh: string
  emoji?: string
  ipa?: string
  from: string
  type: 'word' | 'sentence'
  hint?: string
}
const CONTENT_INDEX: Record<string, ContentMeta> = (() => {
  const idx: Record<string, ContentMeta> = {}
  // 三个模块的单词（含故事类）
  for (const m of MODULE_LIST) {
    for (const it of m.items) {
      for (const w of m.getWords(it.id)) {
        if (!idx[w.en]) {
          idx[w.en] = {
            en: w.en,
            zh: w.zh,
            emoji: w.emoji,
            from: `${m.labelZh} · ${it.title || it.id}`,
            type: 'word',
          }
        }
      }
    }
  }
  // Starlight 句型也加入索引
  for (const m of modules) {
    for (const l of m.lessons) {
      for (const s of l.sentences) {
        if (!idx[s.en]) {
          idx[s.en] = {
            en: s.en,
            zh: s.zh,
            from: `${m.title} · L${l.id}`,
            type: 'sentence',
            hint: s.hint,
          }
        }
      }
    }
  }
  return idx
})()

interface SessionStats {
  correct: number
  wrong: number
  wrongWords: { en: string; zh: string; emoji?: string; from: string }[]
}

type ModuleFilter = ModuleId | 'all'

export default function SmartReview() {
  const recordReview = useCourseStore((s) => s.recordReview)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const removeWrongWord = useCourseStore((s) => s.removeWrongWord)
  const addStars = useCourseStore((s) => s.addStars)
  const getTomorrowDueCount = useCourseStore((s) => s.getTomorrowDueCount)
  const getDueCards = useCourseStore((s) => s.getDueCards)

  const [filter, setFilter] = useState<ModuleFilter>('all')
  // 拍快照:进入页面/切换模块时一次性确定本次复习队列,避免复习过程中队列抖动
  const loadQueue = (f: ModuleFilter) => getDueCards(20, f === 'all' ? undefined : f)
  const [queue, setQueue] = useState<SrsCard[]>(() => loadQueue('all'))
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [session, setSession] = useState<SessionStats>({ correct: 0, wrong: 0, wrongWords: [] })
  const [done, setDone] = useState(false)

  const total = queue.length
  const cur = queue[idx]
  const mcStyle = moduleThemeVars(STARLIGHT_THEME)

  // 切换复习卡（进入/下一题/再复习一轮）时自动朗读英文单词,作为回忆提示
  useEffect(() => {
    if (cur) speakText(cur.en)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, queue])

  // 重置本次会话,重新拉一次到期队列(答错的词归零后会再次出现)
  const reload = () => {
    setQueue(loadQueue(filter))
    setIdx(0)
    setRevealed(false)
    setSession({ correct: 0, wrong: 0, wrongWords: [] })
    setDone(false)
  }

  // 切换模块过滤
  const changeFilter = (f: ModuleFilter) => {
    setFilter(f)
    setQueue(loadQueue(f))
    setIdx(0)
    setRevealed(false)
    setSession({ correct: 0, wrong: 0, wrongWords: [] })
    setDone(false)
  }

  // 队列为空
  if (total === 0) {
    return (
      <div className="page smart-review" style={mcStyle}>
        <div className="page-head" style={mcStyle}>
          <span className="page-emoji">🎯</span>
          <div>
            <div className="page-kicker">智能复习</div>
            <h1 className="page-title">今日复习</h1>
          </div>
        </div>

        <SafeBoundary label="智能复习">
          <div className="smart-empty">
            <div className="smart-empty-emoji">🎉</div>
            <h2 className="smart-empty-title">今天没有需要复习的单词</h2>
            <p className="smart-empty-sub">
              已学过的单词都还在记忆保鲜期内,<br />
              去预习新内容或做听力测验吧!
            </p>
            <div className="smart-empty-actions">
              <Link to="/preview" className="btn btn-sun">📖 去预习</Link>
              <Link to="/review" className="btn btn-soft">🔁 自主复习</Link>
            </div>
          </div>
        </SafeBoundary>

        <div className="page-nav">
          <Link to="/" className="back-link">← 返回首页</Link>
        </div>
      </div>
    )
  }

  // 完成页
  if (done) {
    const allRight = session.correct === total
    const mostlyRight = session.correct >= total * 0.8
    const tomorrowCount = getTomorrowDueCount()
    return (
      <div className="page smart-review" style={mcStyle}>
        <div className="page-head" style={mcStyle}>
          <span className="page-emoji">🎯</span>
          <div>
            <div className="page-kicker">智能复习</div>
            <h1 className="page-title">本次复习完成</h1>
          </div>
        </div>

        <SafeBoundary label="复习结果">
          <div className="smart-result">
            <div className="result-emoji">{allRight ? '🌟' : mostlyRight ? '👍' : '💪'}</div>
            <h2 className="result-title">
              {allRight ? '全部记住啦!' : mostlyRight ? '记得很牢!' : '继续加油!'}
            </h2>
            <div className="result-score">
              答对 <b>{session.correct}</b> / {total} 题
            </div>
            <div className="result-bar">
              <div className="result-bar-fill" style={{ width: `${(session.correct / total) * 100}%` }} />
            </div>

            <div className="smart-stats-row">
              <div className="smart-stat">
                <div className="smart-stat-emoji">✅</div>
                <div className="smart-stat-val">{session.correct}</div>
                <div className="smart-stat-label">答对</div>
              </div>
              <div className="smart-stat">
                <div className="smart-stat-emoji">😅</div>
                <div className="smart-stat-val">{session.wrong}</div>
                <div className="smart-stat-label">忘了</div>
              </div>
              <div className="smart-stat">
                <div className="smart-stat-emoji">⭐</div>
                <div className="smart-stat-val">+{allRight ? session.correct + 5 : session.correct}</div>
                <div className="smart-stat-label">星星</div>
              </div>
            </div>

            {session.wrongWords.length > 0 && (
              <div className="smart-wrong-list">
                <h3 className="smart-wrong-title">📋 这些内容需要再练</h3>
                {session.wrongWords.map((w) => (
                  <div key={w.en} className="smart-wrong-item">
                    <span className="sw-emoji">{w.emoji ?? '❓'}</span>
                    <span className="sw-en">{w.en}</span>
                    <span className="sw-zh">{w.zh}</span>
                    <span onClick={(e) => e.stopPropagation()}>
                      <SpeakButton text={w.en} label={w.en} />
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="smart-tomorrow-hint">
              📅 明天约有 <b>{tomorrowCount}</b> 个单词到期复习
            </p>

            <div className="result-actions">
              <button type="button" className="btn btn-sun" onClick={reload}>
                🔁 再复习一轮
              </button>
              <Link to="/wrong" className="btn btn-soft">📋 错题本</Link>
              <Link to="/" className="btn btn-soft">返回首页</Link>
            </div>
          </div>
        </SafeBoundary>
      </div>
    )
  }

  const curModule: ModuleId = filter !== 'all' ? filter : cur.modules[0] ?? 'starlight'

  const answer = (correct: boolean) => {
    if (!cur) return
    recordReview(cur.en, correct, curModule)
    // 答错自动加入错题本,答对则从错题本移除(已确认掌握)
    const w = CONTENT_INDEX[cur.en]
    const newWrong = !correct && w
      ? [...session.wrongWords, { en: w.en, zh: w.zh, emoji: w.emoji ?? '❓', from: w.from }]
      : session.wrongWords
    if (!correct && w) {
      addWrongWord({ en: w.en, zh: w.zh, emoji: w.emoji ?? '❓', from: w.from, module: curModule })
    } else if (correct) {
      removeWrongWord(cur.en)
    }

    const finalCorrect = session.correct + (correct ? 1 : 0)
    setSession({
      correct: finalCorrect,
      wrong: session.wrong + (correct ? 0 : 1),
      wrongWords: newWrong,
    })

    if (idx + 1 >= total) {
      // 最后一题:直接结算加星,不依赖 useEffect,避免重复触发
      const stars = finalCorrect === total ? finalCorrect + 5 : finalCorrect
      addStars(stars)
      setDone(true)
    } else {
      setIdx(idx + 1)
      setRevealed(false)
    }
  }

  const boxInfo = cur ? `${boxEmoji(cur.box)} ${boxLabel(cur.box)} · 盒 ${cur.box}` : ''
  const remainMeta = cur ? CONTENT_INDEX[cur.en] : undefined

  return (
    <div className="page smart-review" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">🎯</span>
        <div>
          <div className="page-kicker">智能复习 · 跨模块</div>
          <h1 className="page-title">今日复习</h1>
        </div>
      </div>

      <SafeBoundary label="智能复习">
        <div className="mode-badge mode-review">🧠 大脑健身 · 先回忆再翻面</div>

        {/* 模块筛选 chips */}
        <div className="filter-chips">
          <button
            type="button"
            className={'chip' + (filter === 'all' ? ' active' : '')}
            onClick={() => changeFilter('all')}
          >
            全部
          </button>
          {MODULE_LIST.map((m) => (
            <button
              key={m.id}
              type="button"
              className={'chip' + (filter === m.id ? ' active' : '')}
              style={{ '--mc': m.color, '--mc-soft': m.colorSoft } as React.CSSProperties}
              onClick={() => changeFilter(m.id)}
            >
              {m.labelZh}
            </button>
          ))}
        </div>

        <div className="quiz-meta">
          <span>第 {idx + 1} / {total} 张</span>
          <span>已答对 {session.correct} · 忘了 {session.wrong}</span>
        </div>
        <div className="quiz-progress">
          <div className="quiz-progress-fill" style={{ width: `${(idx / total) * 100}%` }} />
        </div>

        {cur && remainMeta && (
          <div className="smart-card" style={mcStyle}>
            <div className="smart-card-from">📍 {remainMeta.from}</div>
            {remainMeta.emoji && <div className="smart-card-emoji">{remainMeta.emoji}</div>}

            <div className="fc-word-row">
              <button type="button" className="fc-word" onClick={() => speakText(remainMeta.en)}>{remainMeta.en}</button>
              <SpeakButton text={remainMeta.en} label={remainMeta.en} />
              <SpeakButton text={remainMeta.en} label={`${remainMeta.en} 慢速`} slow />
            </div>
            {remainMeta.ipa && <div className="fc-ipa">{remainMeta.ipa}</div>}

            {revealed ? (
              <div className="fc-zh" onClick={() => setRevealed(false)} title="点击隐藏">
                {remainMeta.zh}
                {remainMeta.hint && <div className="sent-hint">💡 {remainMeta.hint}</div>}
              </div>
            ) : (
              <button type="button" className="fc-reveal" onClick={() => setRevealed(true)}>
                {remainMeta.type === 'sentence' ? '👀 想想这句的意思,然后翻面' : '👀 想想中文,然后翻面'}
              </button>
            )}

            <div className="smart-card-box">{boxInfo}</div>
            <div className="smart-card-stat">
              已复习 {cur.reviews} 次 · 连续答对 {cur.streak} 次
            </div>
          </div>
        )}

        <div className="smart-controls">
          <button
            type="button"
            className="btn smart-btn-wrong"
            onClick={() => answer(false)}
            disabled={!revealed}
          >
            😅 忘了
          </button>
          <button
            type="button"
            className="btn smart-btn-right"
            onClick={() => answer(true)}
            disabled={!revealed}
          >
            ✅ 记得
          </button>
        </div>
        {!revealed && (
          <p className="smart-hint">先在心里说出中文意思,再点「翻面」对照</p>
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
        <Link to="/review" className="btn btn-soft">自主选单元</Link>
      </div>
    </div>
  )
}
