// 自学型课程页共享骨架：语文课与英语3A 课的结构性双胞胎合并。
// 差异（主题色、文案、知识点内容、数据源、store 动作）全部通过 props 注入，
// 页面只保留各自的知识点渲染。统一承载：
//   打卡(streak 计算) / 自测(统一星规 + ≥80% 完成判定 + 错题收集) / 手动标记完成。

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import ConfirmDialog from '@/components/ConfirmDialog'
import { dayStamp } from '@/data/srs'
import { quizStars, isPassed } from '@/utils/stars'

/** 自测题结构化类型：chinese.QuizItem 与 eng3a.EngExercise 均可赋值 */
export interface SelfQuizItem {
  q: string
  options: string[]
  answer: number
  explain?: string
  /** 错题关联的记忆卡 key(英文词/句);缺省时该题错题不入错题本 */
  key?: string
  /** 记忆卡中文释义;缺省时用正确选项文本 */
  keyZh?: string
}

export interface SelfStudyLessonProps {
  moduleId: string
  theme: { color: string; colorSoft: string }
  emoji: string
  kicker: string
  title: string
  safeLabel: string
  /** 知识点 tab 内容(由各页面自行渲染) */
  knowledge: React.ReactNode
  cover?: string
  // ---- 打卡 tab ----
  reciteLabel: string
  reciteLead: string
  reciteStreakLabel: string
  reciteCta: string
  reciteDoneHint: string
  reciteDays: number[]
  onCheckin: () => void
  // ---- 自测 tab ----
  quiz: SelfQuizItem[]
  lastResult?: { score: number; total: number; date: number }
  /** 交卷回调:score/total 为成绩,wrongKeys 为可入错题本的错题(key 非空的题) */
  onSubmitQuiz: (score: number, total: number, wrongKeys: { en: string; zh: string }[]) => void
  // ---- 完成判定(≥80% 自动点亮,或手动标记) ----
  done: boolean
  onMarkDone: () => void
  // ---- 导航 ----
  backTo: { to: string; label: string }
  prevTo?: string
  nextTo?: string
}

type Tab = 'knowledge' | 'recite' | 'quiz'

export default function SelfStudyLesson({
  moduleId,
  theme,
  emoji,
  kicker,
  title,
  safeLabel,
  knowledge,
  cover,
  reciteLabel,
  reciteLead,
  reciteStreakLabel,
  reciteCta,
  reciteDoneHint,
  reciteDays,
  onCheckin,
  quiz,
  lastResult,
  onSubmitQuiz,
  done,
  onMarkDone,
  backTo,
  prevTo,
  nextTo,
}: SelfStudyLessonProps) {
  const mcStyle = {
    '--mc': theme.color,
    '--mc-soft': theme.colorSoft,
  } as React.CSSProperties
  const [tab, setTab] = useState<Tab>('knowledge')
  const [showDone, setShowDone] = useState(false)

  const today = reciteDays.includes(dayStamp())
  const streak = (() => {
    if (!reciteDays.length) return 0
    const set = new Set(reciteDays)
    let cur = dayStamp()
    let n = 0
    while (set.has(cur)) {
      n++
      cur -= 1
    }
    return n
  })()

  return (
    <div className="page cn-lesson" style={mcStyle} data-module={moduleId}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{emoji}</span>
        <div>
          <div className="page-kicker">{kicker}</div>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>

      {cover && <img className="en3-lesson-cover" src={cover} alt={title} loading="lazy" />}

      <div className="tab-bar" style={mcStyle}>
        <button type="button" className={'tab-btn' + (tab === 'knowledge' ? ' active' : '')} onClick={() => setTab('knowledge')}>
          📖 知识点
        </button>
        <button type="button" className={'tab-btn' + (tab === 'recite' ? ' active' : '')} onClick={() => setTab('recite')}>
          {reciteLabel}
        </button>
        <button type="button" className={'tab-btn' + (tab === 'quiz' ? ' active' : '')} onClick={() => setTab('quiz')}>
          📝 自测练习
        </button>
      </div>

      <SafeBoundary label={safeLabel}>
        {tab === 'knowledge' && knowledge}
        {tab === 'recite' && (
          <ReciteTab
            today={today}
            streak={streak}
            total={reciteDays.length}
            onCheckin={onCheckin}
            lead={reciteLead}
            streakLabel={reciteStreakLabel}
            cta={reciteCta}
            doneHint={reciteDoneHint}
            mcStyle={mcStyle}
          />
        )}
        {tab === 'quiz' && (
          <QuizTab quiz={quiz} lastResult={lastResult} onSubmit={onSubmitQuiz} mcStyle={mcStyle} />
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={backTo.to} className="back-link">← {backTo.label}</Link>
        <div className="lesson-nav">
          {prevTo && <Link to={prevTo} className="btn btn-soft">← 上一课</Link>}
          {nextTo && <Link to={nextTo} className="btn">下一课 →</Link>}
        </div>
      </div>

      {/* 课级完成:自测 ≥80% 自动标记,或手动点「本课完成」 */}
      <div style={{ textAlign: 'center', marginTop: '18px' }}>
        {done ? (
          <p style={{ color: 'var(--ok)', fontWeight: 600 }}>✅ 本课已完成学习</p>
        ) : (
          <button type="button" className="btn btn-soft" onClick={() => setShowDone(true)}>
            ✅ 标记本课完成
          </button>
        )}
      </div>
      <ConfirmDialog
        open={showDone}
        emoji="✅"
        title="学完这一课了吗？"
        message="标记后这一课就算完成啦，可以在课程列表里看到进度。"
        confirmText="完成啦"
        cancelText="再学一会儿"
        onConfirm={() => {
          onMarkDone()
          setShowDone(false)
        }}
        onCancel={() => setShowDone(false)}
      />
    </div>
  )
}

// ===================== 打卡 Tab =====================
function ReciteTab({
  today,
  streak,
  total,
  onCheckin,
  lead,
  streakLabel,
  cta,
  doneHint,
  mcStyle,
}: {
  today: boolean
  streak: number
  total: number
  onCheckin: () => void
  lead: string
  streakLabel: string
  cta: string
  doneHint: string
  mcStyle: React.CSSProperties
}) {
  return (
    <div className="cn-recite" style={mcStyle}>
      <p className="lead">{lead}</p>
      <div className="cn-recite-stats">
        <div className="cn-recite-stat">
          <div className="cn-recite-num">{streak}</div>
          <div className="cn-recite-label">{streakLabel}</div>
        </div>
        <div className="cn-recite-stat">
          <div className="cn-recite-num">{total}</div>
          <div className="cn-recite-label">累计打卡(次)</div>
        </div>
      </div>
      <button
        type="button"
        className={'cn-recite-btn' + (today ? ' done' : '')}
        onClick={onCheckin}
        disabled={today}
      >
        {today ? '✅ 今天已打卡' : cta}
      </button>
      {today && <p className="cn-recite-hint">{doneHint}</p>}
    </div>
  )
}

// ===================== 自测 Tab =====================
function QuizTab({
  quiz,
  lastResult,
  onSubmit,
  mcStyle,
}: {
  quiz: SelfQuizItem[]
  lastResult?: { score: number; total: number; date: number }
  onSubmit: (score: number, total: number, wrongKeys: { en: string; zh: string }[]) => void
  mcStyle: React.CSSProperties
}) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  // 切换题目/重置时清空选择
  useEffect(() => {
    setSelected(null)
  }, [idx, finished])

  // 进入新一套题时重置
  const start = () => {
    setIdx(0)
    setSelected(null)
    setCorrect(0)
    setFinished(false)
  }

  if (quiz.length === 0) {
    return <div className="empty"><p>这一课还没有自测题。</p></div>
  }

  if (finished) {
    const total = quiz.length
    const pass = isPassed(correct, total)
    return (
      <div className="cn-quiz-result" style={mcStyle}>
        <div className="cn-quiz-score">{correct} / {total}</div>
        <div className="cn-quiz-verdict">{pass ? '🎉 太棒了，过关！' : '💪 再练练就更熟啦！'}</div>
        <div className="cn-quiz-last">⭐ 本次获得 {quizStars(correct, total)} 颗星星</div>
        {lastResult && <div className="cn-quiz-last">最近成绩：{lastResult.score}/{lastResult.total}</div>}
        <div className="result-actions">
          <button type="button" className="btn btn-sun" onClick={start}>🔁 再测一次</button>
          <Link to="/wrong" className="btn btn-soft">📋 错题本</Link>
          <Link to="/smart" className="btn btn-soft">🧠 去复习</Link>
        </div>
      </div>
    )
  }

  const q = quiz[idx]
  const isCorrect = selected === q.answer

  const handlePick = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.answer) setCorrect((c) => c + 1)
  }

  const next = () => {
    if (idx + 1 >= quiz.length) {
      setFinished(true)
      const finalCorrect = selected === q.answer ? correct + 1 : correct
      // 收集可入错题本的错题:仅限带 key(记忆卡词/句)的题目
      const wrongKeys: { en: string; zh: string }[] = []
      quiz.forEach((item, i) => {
        const picked = i === idx ? selected : undefined
        if (!item.key) return
        if (picked === undefined || picked === item.answer) return
        wrongKeys.push({ en: item.key, zh: item.keyZh ?? item.options[item.answer] })
      })
      onSubmit(finalCorrect, quiz.length, wrongKeys)
    } else {
      setIdx((i) => i + 1)
    }
  }

  return (
    <div className="cn-quiz" style={mcStyle}>
      <div className="cn-quiz-progress">第 {idx + 1} / {quiz.length} 题</div>
      <div className="cn-quiz-q">{q.q}</div>
      <div className="cn-quiz-opts">
        {q.options.map((opt, i) => {
          let cls = 'cn-quiz-opt'
          if (selected !== null) {
            if (i === q.answer) cls += ' correct'
            else if (i === selected) cls += ' wrong'
          }
          return (
            <button key={i} type="button" className={cls} onClick={() => handlePick(i)} disabled={selected !== null}>
              <span className="cn-opt-key">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div className="cn-quiz-feedback">
          <div className={'cn-quiz-mark' + (isCorrect ? ' ok' : ' no')}>
            {isCorrect ? '✅ 答对啦！' : '❌ 答错咯'}
          </div>
          {q.explain && <div className="cn-quiz-explain">💡 {q.explain}</div>}
          <button type="button" className="btn" onClick={next}>
            {idx + 1 >= quiz.length ? '查看成绩 →' : '下一题 →'}
          </button>
        </div>
      )}
    </div>
  )
}
