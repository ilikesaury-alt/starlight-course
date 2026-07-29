import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import SafeBoundary from '@/components/SafeBoundary'
import QuizEngine, { type QuizItem } from '@/components/QuizEngine'
import { getModule, type QuizQuestion } from '@/data/starlight'
import { moduleThemeOf } from '@/data/modules'
import { useCourseStore } from '@/store/useCourseStore'
import { moduleThemeVars } from '@/utils/theme'

// 从单元所有 lesson 的单词动态生成测验题(每课抽 1 题,最多 16 题)
function buildQuiz(mod: ReturnType<typeof getModule>): QuizItem[] {
  if (!mod) return []
  const allWords = mod.lessons.flatMap((l) => l.words)
  const questions: QuizItem[] = []

  for (const lesson of mod.lessons) {
    if (questions.length >= 16) break
    // 每课取第一个单词作为题干,从全单元抽 3 个干扰项
    const target = lesson.words[0]
    if (!target) continue
    const distractPool = allWords.filter((w) => w.en !== target.en)
    // 简单洗牌取 3 个
    const distract = [...distractPool].sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [target, ...distract].sort(() => Math.random() - 0.5)
    const answer = options.findIndex((o) => o.en === target.en)
    questions.push({
      q: `哪个是 ${target.zh}？ ${target.emoji}`,
      options: options.map((o) => o.en),
      answer,
      explain: `${target.en} 意思是"${target.zh}"。`,
      lessonId: lesson.id,
      speakText: target.en,
    })
  }
  return questions
}

export default function ListeningQuiz() {
  const { moduleId = '', itemId = '' } = useParams()
  const mod = getModule(itemId)

  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const addStars = useCourseStore((s) => s.addStars)
  const markQuizDone = useCourseStore((s) => s.markQuizDone)
  const recordReview = useCourseStore((s) => s.recordReview)
  const seedCard = useCourseStore((s) => s.seedCard)
  const removeWrongWord = useCourseStore((s) => s.removeWrongWord)

  // 动态生成测验题(每课 1 题,比原来固定 5 题更全面)
  const quiz = useMemo<QuizItem[]>(() => {
    const generated = buildQuiz(mod)
    // 合并原有的手写题目(取前 3 题作为补充),手动题用正确选项作为发音文本
    const manual: QuizItem[] = (mod?.quiz ?? []).slice(0, 3).map((q) => ({
      ...q,
      speakText: q.options[q.answer] ?? q.q,
    }))
    return [...generated, ...manual]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod])

  if (!mod) {
    return (
      <div className="empty">
        <p>没有找到这个模块。</p>
        <Link to="/review" className="btn">返回复习列表</Link>
      </div>
    )
  }

  const mcStyle = moduleThemeVars(moduleThemeOf(moduleId))
  const allWords = mod.lessons.flatMap((l) => l.words)

  return (
    <div className="page listening-quiz" style={mcStyle}>
      <div className="page-head" style={mcStyle}>
        <span className="page-emoji">{mod.emoji}</span>
        <div>
          <div className="page-kicker">Module {mod.id} · 听力测验</div>
          <h1 className="page-title">{mod.title}</h1>
        </div>
      </div>

      <SafeBoundary label="测验">
        <QuizEngine
          quiz={quiz}
          mcStyle={mcStyle}
          badgeText="🎯 复习测验 · 听一听选一选"
          resultTitle="完成啦！"
          renderQuestionExtra={(q) =>
            q.lessonId ? <div className="quiz-lesson-tag">📖 Lesson {q.lessonId}</div> : null
          }
          resultLinks={
            <>
              <Link to="/wrong" className="btn btn-soft">📋 看错题本</Link>
              <Link to={`/review/${moduleId}/${itemId}`} className="btn btn-soft">复习菜单</Link>
            </>
          }
          onPick={({ en, picked, correct }) => {
            // 同步 SRS:正确选项对应的单词答对升盒,错误则归零
            const targetWord = allWords.find((w) => w.en === en)
            if (targetWord) {
              seedCard(targetWord.en, 'starlight')
              recordReview(targetWord.en, correct, 'starlight')
              if (correct) {
                // 答对了顺便从错题本移除
                removeWrongWord(targetWord.en)
              }
            }
            // 如果选了错的选项,把那个词也记一次错
            if (!correct) {
              const wrongWord = allWords.find((w) => w.en === picked)
              if (wrongWord && wrongWord.en !== targetWord?.en) {
                seedCard(wrongWord.en, 'starlight')
                recordReview(wrongWord.en, false, 'starlight')
              }
            }
          }}
          onFinish={(_correct, _total, wrongEns) => {
            // 错题加入错题本
            wrongEns.forEach((en) => {
              const word = allWords.find((w) => w.en === en)
              addWrongWord({
                en,
                zh: word?.zh ?? '',
                emoji: word?.emoji ?? '❓',
                from: mod.title,
                module: 'starlight',
              })
            })
            const stars = _correct === _total ? _correct + 5 : _correct
            addStars(stars)
            markQuizDone(itemId)
          }}
        />
      </SafeBoundary>

      <div className="page-nav">
        <Link to={`/review/${moduleId}/${itemId}`} className="back-link">← 复习菜单</Link>
      </div>
    </div>
  )
}
