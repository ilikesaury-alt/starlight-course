import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import FcWord from '../components/FcWord'
import SafeBoundary from '../components/SafeBoundary'
import ModuleFilterChips, { type ModuleFilter } from '../components/ModuleFilterChips'
import { modules, STARLIGHT_THEME } from '../data/starlight'
import { MODULE_LIST, type ModuleId } from '../data/modules'
import { useCourseStore } from '../store/useCourseStore'
import { boxLabel, boxEmoji, type SrsCard } from '../data/srs'
import { speakText } from '../utils/speak'
import { moduleThemeVars } from '../utils/theme'
import { quizStars } from '../utils/stars'

// 建一份 en → 内容元信息的索引,供卡片渲染时取 emoji/zh/ipa（单词和句型都索引）。
// 故事类模块词表经 load() 动态加载,因此索引为异步构建;组件在 ready 前不进入会话。
interface ContentMeta {
  en: string
  zh: string
  emoji?: string
  ipa?: string
  from: string
  type: 'word' | 'sentence'
  hint?: string
}
let contentIndex: Record<string, ContentMeta> = {}
const contentIndexReady = (async () => {
  const idx: Record<string, ContentMeta> = {}
  // 五个模块的单词（含故事类,故事词表按需下载）
  for (const m of MODULE_LIST) {
    const { items, getWords } = await m.load()
    for (const it of items) {
      for (const w of getWords(it.id)) {
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
  contentIndex = idx
})()

interface SessionStats {
  correct: number
  wrong: number
  wrongWords: { en: string; zh: string; emoji?: string; from: string }[]
}

export default function SmartReview() {
  const recordReview = useCourseStore((s) => s.recordReview)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const removeWrongWord = useCourseStore((s) => s.removeWrongWord)
  const addStars = useCourseStore((s) => s.addStars)
  const getTomorrowDueCount = useCourseStore((s) => s.getTomorrowDueCount)
  const getDueCards = useCourseStore((s) => s.getDueCards)

  // 默认选中第一个模块(主课),「全部」在智能复习页已隐藏,改为按模块逐一复习
  const [filter, setFilter] = useState<ModuleFilter>('starlight')
  // 拍快照:进入页面/切换模块时一次性确定本次复习队列,避免复习过程中队列抖动
  const loadQueue = (f: ModuleFilter) => getDueCards(20, f === 'all' ? undefined : f)
  const [queue, setQueue] = useState<SrsCard[]>(() => loadQueue('starlight'))
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [session, setSession] = useState<SessionStats>({ correct: 0, wrong: 0, wrongWords: [] })
  const [done, setDone] = useState(false)
  // 内容索引(含故事词表动态下载)就绪前不进入会话,避免卡片缺中文释义
  const [metaReady, setMetaReady] = useState(false)
  useEffect(() => {
    void contentIndexReady.then(() => setMetaReady(true))
  }, [])

  const total = queue.length
  const cur = queue[idx]
  const mcStyle = moduleThemeVars(STARLIGHT_THEME)

  // 「去预习」按钮按当前筛选模块跳到对应课程首页,避免语文/故事卡片误跳 Starlight
  const previewTo =
    filter === 'all'
      ? '/starlight'
      : filter === 'chinese'
        ? '/chinese'
        : filter === 'flyguy'
          ? '/flyguy'
          : filter === 'rocketgirl'
            ? '/rocketgirl'
            : '/starlight'

  // 切换复习卡（进入/下一题/再复习一轮）时自动朗读单词,作为回忆提示
  // 语文卡片(汉字)用中文嗓音朗读
  useEffect(() => {
    if (cur) speakText(cur.en, { lang: cur.modules.includes('chinese') ? 'zh' : 'en' })
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
  if (!metaReady) {
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
            <div className="smart-empty-emoji">⏳</div>
            <h2 className="smart-empty-title">正在准备复习内容…</h2>
          </div>
        </SafeBoundary>
        <div className="page-nav">
          <Link to="/" className="back-link">← 返回首页</Link>
        </div>
      </div>
    )
  }

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
          {/* 空状态也要保留模块筛选 chips：切到空模块后仍可切回有内容的模块 */}
          <ModuleFilterChips value={filter} onChange={changeFilter} hideAll />

          <div className="smart-empty">
            <div className="smart-empty-emoji">🎉</div>
            <h2 className="smart-empty-title">今天没有需要复习的单词</h2>
            <p className="smart-empty-sub">
              已学过的单词都还在记忆保鲜期内,<br />
              去预习新内容或做听力测验吧!
            </p>
            <div className="smart-empty-actions">
              <Link to={previewTo} className="btn btn-sun">📖 去预习</Link>
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
                <div className="smart-stat-val">+{quizStars(session.correct, total)}</div>
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
                      <SpeakButton text={w.en} label={w.en} lang={/[一-龥]/.test(w.en) ? 'zh' : 'en'} />
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
    const w = contentIndex[cur.en]
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
      addStars(quizStars(finalCorrect, total))
      setDone(true)
    } else {
      setIdx(idx + 1)
      setRevealed(false)
    }
  }

  const boxInfo = cur ? `${boxEmoji(cur.box)} ${boxLabel(cur.box)} · 盒 ${cur.box}` : ''
  const remainMeta = cur ? contentIndex[cur.en] : undefined

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

        {/* 模块筛选 chips：统一隐藏「全部」，与空状态分支保持一致 */}
        <ModuleFilterChips value={filter} onChange={changeFilter} hideAll />

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
              <FcWord text={remainMeta.en} lang={cur.modules.includes('chinese') ? 'zh' : 'en'} />
              <SpeakButton text={remainMeta.en} label={remainMeta.en} lang={cur.modules.includes('chinese') ? 'zh' : 'en'} />
              <SpeakButton text={remainMeta.en} label={`${remainMeta.en} 慢速`} slow lang={cur.modules.includes('chinese') ? 'zh' : 'en'} />
            </div>
            {remainMeta.ipa && <div className="fc-ipa">{remainMeta.ipa}</div>}

            {revealed ? (
              <div className="fc-zh" onClick={() => setRevealed(false)} title="点击隐藏">
                {remainMeta.zh}
                {remainMeta.hint && <div className="sent-hint">💡 {remainMeta.hint}</div>}
              </div>
            ) : (
              <button type="button" className="fc-reveal" onClick={() => setRevealed(true)}>
                {remainMeta.type === 'sentence'
                  ? '👀 想想这句的意思,然后翻面'
                  : cur.modules.includes('chinese')
                    ? '👀 想想拼音和组词,然后翻面'
                    : '👀 想想中文,然后翻面'}
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
      </div>
    </div>
  )
}
