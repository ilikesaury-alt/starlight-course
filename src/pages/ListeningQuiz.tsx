import { useMemo, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { getModule } from '../data/starlight'
import { useCourseStore } from '../store/useCourseStore'

interface QState {
  picked: number | null
  answered: boolean
}

export default function ListeningQuiz() {
  const { unitId = '' } = useParams()
  const mod = getModule(unitId)
  const [idx, setIdx] = useState(0)
  const [states, setStates] = useState<QState[]>([])
  const [done, setDone] = useState(false)

  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const addStars = useCourseStore((s) => s.addStars)
  const markQuizDone = useCourseStore((s) => s.markQuizDone)

  const quiz = useMemo(() => mod?.quiz ?? [], [mod])

  // 结果提交：统计错题加入错题本、加星
  useEffect(() => {
    if (!done || !mod) return
    let correct = 0
    quiz.forEach((q, i) => {
      const st = states[i]
      if (st?.answered && st.picked === q.answer) {
        correct++
      } else if (st?.answered && st.picked !== q.answer) {
        // 找到对应单词加入错题本
        const wrongOpt = q.options[st.picked ?? 0]
        const correctOpt = q.options[q.answer]
        // 尝试从模块单词中匹配正确的词
        const word = mod.words.find((w) =>
          w.en === correctOpt || w.en === wrongOpt
        )
        addWrongWord({
          en: correctOpt,
          zh: word?.zh ?? '',
          emoji: word?.emoji ?? '❓',
          from: mod.title,
        })
      }
    })
    const stars = correct === quiz.length ? correct + 5 : correct
    addStars(stars)
    markQuizDone(unitId)
  }, [done]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/review" className="btn">返回复习列表</Link>
      </div>
    )
  }

  let correct = 0
  states.forEach((s, i) => {
    if (s.answered && s.picked === quiz[i].answer) correct++
  })

  const cur = quiz[idx]
  const curState = states[idx]
  const isAnswered = !!curState?.answered

  const pick = (i: number) => {
    if (isAnswered) return
    setStates((prev) => {
      const copy = [...prev]
      copy[idx] = { picked: i, answered: true }
      return copy
    })
  }

  const goNext = () => {
    if (idx + 1 >= quiz.length) {
      setDone(true)
    } else {
      setIdx((i) => i + 1)
    }
  }

  const restart = () => {
    setIdx(0)
    setStates([])
    setDone(false)
  }

  return (
    <div className="page listening-quiz">
      <div className="page-head" style={{ '--mc': mod.color } as React.CSSProperties}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 听力测验</div>
          <h1 className="page-title">{mod.title}</h1>
        </div>
      </div>

      <SafeBoundary label="测验">
        {done ? (
          <div className="result-card">
            <div className="result-emoji">{correct === quiz.length ? '🌟' : correct >= quiz.length / 2 ? '👍' : '💪'}</div>
            <h2 className="result-title">完成啦！</h2>
            <div className="result-score">
              答对 <b>{correct}</b> / {quiz.length} 题
            </div>
            <div className="result-bar">
              <div className="result-bar-fill" style={{ width: `${(correct / quiz.length) * 100}%`, background: mod.color }} />
            </div>
            <p className="result-tip">
              {correct === quiz.length
                ? '太棒了！全对！+5 额外星星 🎉'
                : '错题已加入错题本，再练练一定行！'}
            </p>
            <div className="result-actions">
              <button type="button" className="btn" onClick={restart}>🔁 再做一次</button>
              <Link to="/wrong" className="btn btn-soft">📋 看错题本</Link>
              <Link to={`/review/${unitId}`} className="btn btn-soft">复习菜单</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz-meta">
              <span>第 {idx + 1} / {quiz.length} 题</span>
              <span>已答对 {correct} 题</span>
            </div>
            <div className="quiz-progress">
              <div className="quiz-progress-fill" style={{ width: `${(idx / quiz.length) * 100}%`, background: mod.color }} />
            </div>

            <div className="quiz-q">
              <div className="quiz-q-row">
                <span>{cur.q}</span>
                <SpeakButton text={cur.q.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim()} label="题目" />
              </div>
              <div className="quiz-opts">
                {cur.options.map((opt, i) => {
                  let cls = 'quiz-opt'
                  if (isAnswered) {
                    if (i === cur.answer) cls += ' correct'
                    else if (i === curState.picked) cls += ' wrong'
                  }
                  return (
                    <div key={i} className={cls} onClick={() => !isAnswered && pick(i)}>
                      <span className="quiz-opt-letter">{String.fromCharCode(65 + i)}</span>
                      <span>{opt}</span>
                      <SpeakButton text={opt} label={opt} />
                    </div>
                  )
                })}
              </div>
            </div>

            {isAnswered && (
              <div className={'explain ' + (curState.picked === cur.answer ? 'ok' : 'no')}>
                <div className="explain-head">
                  {curState.picked === cur.answer ? '✅ 答对了！' : `❌ 正确答案是 ${String.fromCharCode(65 + cur.answer)}`}
                </div>
                <div className="explain-body">{cur.explain}</div>
              </div>
            )}

            <div className="quiz-controls">
              {isAnswered && (
                <button type="button" className="btn" onClick={goNext}>
                  {idx + 1 >= quiz.length ? '查看结果 🏁' : '下一题 →'}
                </button>
              )}
            </div>
          </>
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/review/${unitId}`} className="back-link">← 复习菜单</Link>
      </div>
    </div>
  )
}
