import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SafeBoundary from '@/components/SafeBoundary'
import { getEngLesson, type EngLesson as Lesson } from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { moduleThemeVars } from '@/utils/theme'
import { dayStamp } from '@/data/srs'

type Tab = 'knowledge' | 'read' | 'quiz'

export default function Eng3aLesson() {
  const { unitId = '', lessonId = '' } = useParams()
  const found = getEngLesson(unitId, lessonId)
  const markRecite = useCourseStore((s) => s.markEng3aRecite)
  const markQuiz = useCourseStore((s) => s.markEng3aQuiz)
  const seedCards = useCourseStore((s) => s.seedCards)
  const reciteDays = useCourseStore((s) => (found ? s.eng3aRecite[found.lesson.slug] : undefined)) ?? []
  const quizResult = useCourseStore((s) =>
    found ? s.eng3aQuiz[found.lesson.slug] : undefined,
  )

  const [tab, setTab] = useState<Tab>('knowledge')

  // 进课即把本课「单词」播种进 SRS（module='eng3a'），进入智能复习到期调度
  useEffect(() => {
    if (!found) return
    const ens = (found.lesson.words ?? []).map((w) => w.en)
    if (ens.length) seedCards(ens, 'eng3a')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found?.lesson.slug])

  if (!found) {
    return (
      <div className="empty">
        <p>没有找到这一课。</p>
        <Link to="/eng3a" className="btn">返回英语课程</Link>
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

      {unit.cover && (
        <img className="en3-lesson-cover" src={unit.cover} alt={unit.titleZh} loading="lazy" />
      )}

      <div className="tab-bar" style={mcStyle}>
        <button type="button" className={'tab-btn' + (tab === 'knowledge' ? ' active' : '')} onClick={() => setTab('knowledge')}>
          📖 知识点
        </button>
        <button type="button" className={'tab-btn' + (tab === 'read' ? ' active' : '')} onClick={() => setTab('read')}>
          🔊 跟读练习
        </button>
        <button type="button" className={'tab-btn' + (tab === 'quiz' ? ' active' : '')} onClick={() => setTab('quiz')}>
          📝 自测练习
        </button>
      </div>

      <SafeBoundary label="英语课">
        {tab === 'knowledge' && <KnowledgeTab lesson={lesson} mcStyle={mcStyle} />}
        {tab === 'read' && (
          <ReadTab
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
            quiz={lesson.exercise}
            lastResult={quizResult}
            onSubmit={(score, total) => markQuiz(lesson.slug, score, total)}
            mcStyle={mcStyle}
          />
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/eng3a/${unit.slug}`} className="back-link">← 课程列表</Link>
        <div className="lesson-nav">
          {prevLesson && (
            <Link to={`/eng3a/${unit.slug}/${prevLesson.slug}`} className="btn btn-soft">← 上一课</Link>
          )}
          {nextLesson && (
            <Link to={`/eng3a/${unit.slug}/${nextLesson.slug}`} className="btn">下一课 →</Link>
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
      {lesson.words && lesson.words.length > 0 && (
        <section className="cn-hanzi" style={mcStyle}>
          <div className="cn-section-title">🔤 词汇（英文 · 中文 · 例句）</div>
          <div className="cn-hanzi-grid en3-word-grid">
            {lesson.words.map((w, i) => (
              <div className="cn-hanzi-card" key={i}>
                <div className="cn-hanzi-top">
                  {w.emoji && <span className="en3-word-emoji">{w.emoji}</span>}
                  <span className="cn-hanzi-char en3-word-en">{w.en}</span>
                  <SpeakButton text={w.en} label={w.en} />
                </div>
                <div className="cn-hanzi-pinyin">{w.zh}</div>
                {w.sentence && (
                  <div className="en3-word-sentence">
                    <span className="en3-word-sentence-en">{w.sentence}</span>
                    <SpeakButton text={w.sentence} label={w.sentence} slow />
                    {w.sentenceZh && <span className="en3-word-sentence-zh">{w.sentenceZh}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {lesson.dialogs && lesson.dialogs.length > 0 && (
        <section className="en3-dialogs" style={mcStyle}>
          <div className="cn-section-title">💬 句型对话</div>
          {lesson.dialogs.map((d, i) => (
            <div className="en3-dialog" key={i}>
              <div className="en3-dialog-line">
                {d.speaker && <span className="en3-dialog-speaker">{d.speaker}</span>}
                <span className="en3-dialog-en">{d.en}</span>
                <SpeakButton text={d.en} label={d.en} slow />
              </div>
              {d.zh && <div className="en3-dialog-zh">{d.zh}</div>}
            </div>
          ))}
        </section>
      )}

      {lesson.chant && (
        <section className="en3-chant" style={mcStyle}>
          <div className="cn-section-title">🎵 {lesson.chant.title ?? '歌谣'}</div>
          <div className="en3-chant-lines">
            {lesson.chant.lines.map((ln, i) => (
              <div className="en3-chant-line" key={i}>{ln}</div>
            ))}
          </div>
          <button
            type="button"
            className="cn-read-all"
            onClick={() => speakText(lesson.chant!.lines.join('. '), { lang: 'en' })}
          >
            🔊 朗读歌谣
          </button>
          {lesson.chant.zh && <div className="en3-chant-tip">💡 {lesson.chant.zh}</div>}
        </section>
      )}

      {lesson.letters && lesson.letters.length > 0 && (
        <section className="en3-letters" style={mcStyle}>
          <div className="cn-section-title">🔡 字母（认读）</div>
          <div className="en3-letters-grid">
            {lesson.letters.map((L, i) => (
              <div className="en3-letter-card" key={i}>
                <span className="en3-letter">{L}</span>
                <SpeakButton text={L[0]} label={L} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ===================== 跟读练习（替换“背诵打卡”） =====================
function ReadTab({
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
      <p className="lead">点 🔊 听一听，跟着大声读出来吧！读完这一课，点下面的按钮打个卡～</p>
      <div className="cn-recite-stats">
        <div className="cn-recite-stat">
          <div className="cn-recite-num">{streak}</div>
          <div className="cn-recite-label">连续跟读(天)</div>
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
        {today ? '✅ 今天已打卡' : '📅 今天读过了，打卡！'}
      </button>
      {today && <p className="cn-recite-hint">真棒！明天也来读一读吧～</p>}
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
  quiz: Lesson['exercise']
  lastResult?: { score: number; total: number; date: number }
  onSubmit: (score: number, total: number) => void
  mcStyle: React.CSSProperties
}) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setSelected(null)
  }, [idx, finished])

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
