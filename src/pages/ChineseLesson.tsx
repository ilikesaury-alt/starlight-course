import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SafeBoundary from '@/components/SafeBoundary'
import { getChineseLesson, type ChineseLesson as Lesson } from '@/data/chinese'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'
import { dayStamp } from '@/data/srs'

type Tab = 'knowledge' | 'recite' | 'quiz'

export default function ChineseLesson() {
  const { unitId = '', lessonId = '' } = useParams()
  const found = getChineseLesson(unitId, lessonId)
  const markRecite = useCourseStore((s) => s.markRecite)
  const markChineseQuiz = useCourseStore((s) => s.markChineseQuiz)
  const seedCards = useCourseStore((s) => s.seedCards)
  const reciteDays = useCourseStore((s) => (found ? s.reciteCheckins[found.lesson.slug] : undefined)) ?? []
  const quizResult = useCourseStore((s) =>
    found ? s.chineseQuiz[found.lesson.slug] : undefined,
  )

  const [tab, setTab] = useState<Tab>('knowledge')

  // 进课即把本课「生字(汉字)」播种进 SRS,使其进入智能复习到期调度
  useEffect(() => {
    if (!found) return
    const chars = (found.lesson.hanzi ?? []).map((h) => h.char)
    if (chars.length) seedCards(chars, 'chinese')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found?.lesson.slug])

  if (!found) {
    return (
      <div className="empty">
        <p>没有找到这一课。</p>
        <Link to="/chinese" className="btn">返回语文课程</Link>
      </div>
    )
  }

  const { unit, lesson, unitIdx, lessonIdx } = found
  const mcStyle = moduleThemeVars(unit.theme)
  const prevLesson = unit.lessons[lessonIdx - 1]
  const nextLesson = unit.lessons[lessonIdx + 1]

  const reciteToday = reciteDays.includes(dayStamp())
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
    <div className="page cn-lesson" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{lesson.emoji}</span>
        <div>
          <div className="page-kicker">{unit.title} · 第 {lesson.id} 课</div>
          <h1 className="page-title">{lesson.title}</h1>
        </div>
      </div>

      <div className="tab-bar" style={mcStyle}>
        <button type="button" className={'tab-btn' + (tab === 'knowledge' ? ' active' : '')} onClick={() => setTab('knowledge')}>
          📖 知识点
        </button>
        <button type="button" className={'tab-btn' + (tab === 'recite' ? ' active' : '')} onClick={() => setTab('recite')}>
          ✅ 背诵打卡
        </button>
        <button type="button" className={'tab-btn' + (tab === 'quiz' ? ' active' : '')} onClick={() => setTab('quiz')}>
          📝 自测练习
        </button>
      </div>

      <SafeBoundary label="语文课">
        {tab === 'knowledge' && <KnowledgeTab lesson={lesson} mcStyle={mcStyle} />}
        {tab === 'recite' && (
          <ReciteTab
            slug={lesson.slug}
            today={reciteToday}
            streak={streak}
            total={reciteDays.length}
            onCheckin={() => markRecite(lesson.slug)}
            mcStyle={mcStyle}
          />
        )}
        {tab === 'quiz' && (
          <QuizTab
            quiz={lesson.quiz}
            lastResult={quizResult}
            onSubmit={(score, total) => markChineseQuiz(lesson.slug, score, total)}
            mcStyle={mcStyle}
          />
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/chinese/${unit.slug}`} className="back-link">← 课程列表</Link>
        <div className="lesson-nav">
          {prevLesson && (
            <Link to={`/chinese/${unit.slug}/${prevLesson.slug}`} className="btn btn-soft">← 上一课</Link>
          )}
          {nextLesson && (
            <Link to={`/chinese/${unit.slug}/${nextLesson.slug}`} className="btn">下一课 →</Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ===================== 知识点展示 =====================
function KnowledgeTab({ lesson, mcStyle }: { lesson: Lesson; mcStyle: React.CSSProperties }) {
  return (
    <div className="cn-knowledge">
      {lesson.poems?.map((p, i) => (
        <section className="cn-poem" key={i} style={mcStyle}>
          <div className="cn-poem-head">
            <div>
              <div className="cn-poem-title">《{p.title}》</div>
              <div className="cn-poem-meta">{p.dynasty} · {p.author}</div>
            </div>
            <button type="button" className="cn-read-all" onClick={() => speakText(p.lines.join(''), { lang: 'zh' })}>
              🔊 朗读全文
            </button>
          </div>
          <div className="cn-poem-lines">
            {p.lines.map((line, j) => (
              <div className="cn-poem-line" key={j}>
                <span>{line}</span>
                <SpeakButton text={line} label={line} lang="zh" />
              </div>
            ))}
          </div>
        </section>
      ))}

      {lesson.passages?.map((p, i) => (
        <section className="cn-passage" key={i} style={mcStyle}>
          {p.title && <div className="cn-passage-title">📄 {p.title}</div>}
          <div className="cn-passage-text">
            {p.text}
            <SpeakButton text={p.text} label="朗读段落" lang="zh" />
          </div>
          {p.note && <div className="cn-passage-note">💡 {p.note}</div>}
        </section>
      ))}

      {lesson.hanzi && lesson.hanzi.length > 0 && (
        <section className="cn-hanzi" style={mcStyle}>
          <div className="cn-section-title">✍️ 生字词（会写字 · 拼音 · 组词）</div>
          <div className="cn-hanzi-grid">
            {lesson.hanzi.map((h, i) => (
              <div className="cn-hanzi-card" key={i}>
                <div className="cn-hanzi-top">
                  <span className="cn-hanzi-char">{h.char}</span>
                  <SpeakButton
                    text={`${h.char}，${h.group.join('，')}`}
                    label={`${h.char} ${h.group.join(' ')}`}
                    lang="zh"
                  />
                </div>
                <div className="cn-hanzi-pinyin">{h.pinyin}</div>
                <div className="cn-hanzi-group">{h.group.join('、')}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {lesson.idioms?.map((set, i) => (
        <section className="cn-idioms" key={i} style={mcStyle}>
          <div className="cn-section-title">🌟 {set.title}</div>
          <div className="cn-idiom-list">
            {set.items.map((it, j) => (
              <div className="cn-idiom" key={j}>
                <span className="cn-idiom-term">{it.term}</span>
                {it.source && <span className="cn-idiom-src">{it.source}</span>}
                <SpeakButton text={it.term} label={it.term} lang="zh" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// ===================== 背诵打卡 =====================
function ReciteTab({
  slug,
  today,
  streak,
  total,
  onCheckin,
  mcStyle,
}: {
  slug: string
  today: boolean
  streak: number
  total: number
  onCheckin: () => void
  mcStyle: React.CSSProperties
}) {
  return (
    <div className="cn-recite" style={mcStyle}>
      <p className="lead">背完这一课，点下面的按钮打个卡吧！坚持每天背诵，记得更牢～</p>
      <div className="cn-recite-stats">
        <div className="cn-recite-stat">
          <div className="cn-recite-num">{streak}</div>
          <div className="cn-recite-label">连续打卡(天)</div>
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
        {today ? '✅ 今天已打卡' : '📅 今天背会了，打卡！'}
      </button>
      {today && <p className="cn-recite-hint">真棒！明天也来背一背吧～</p>}
    </div>
  )
}

// ===================== 自测练习 =====================
function QuizTab({
  quiz,
  lastResult,
  onSubmit,
  mcStyle,
}: {
  quiz: Lesson['quiz']
  lastResult?: { score: number; total: number; date: number }
  onSubmit: (score: number, total: number) => void
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
    const pass = correct >= Math.ceil(total * 0.6)
    return (
      <div className="cn-quiz-result" style={mcStyle}>
        <div className="cn-quiz-score">{correct} / {total}</div>
        <div className="cn-quiz-verdict">{pass ? '🎉 太棒了，过关！' : '💪 再练练就更熟啦！'}</div>
        {lastResult && <div className="cn-quiz-last">最近成绩：{lastResult.score}/{lastResult.total}</div>}
        <button type="button" className="btn" onClick={start}>🔁 再测一次</button>
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
      onSubmit(selected === q.answer ? correct + 1 : correct, quiz.length)
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
