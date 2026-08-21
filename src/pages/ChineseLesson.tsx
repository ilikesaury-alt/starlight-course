// 三年级上册语文课页：知识点/打卡/自测骨架由 SelfStudyLesson 共享，
// 本文件只保留语文课的知识点渲染与数据接线。

import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SelfStudyLesson from '@/components/SelfStudyLesson'
import { getChineseLesson, type ChineseLesson as Lesson } from '@/data/chinese'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { quizStars, isPassed } from '@/utils/stars'

export default function ChineseLesson() {
  const { unitId = '', lessonId = '' } = useParams()
  const found = getChineseLesson(unitId, lessonId)
  const markRecite = useCourseStore((s) => s.markRecite)
  const markQuiz = useCourseStore((s) => s.markChineseQuiz)
  const addStars = useCourseStore((s) => s.addStars)
  const markDone = useCourseStore((s) => s.markChineseDone)
  const completed = useCourseStore((s) => s.completedChinese)
  const seedCards = useCourseStore((s) => s.seedCards)
  const reciteDays = useCourseStore((s) => (found ? s.reciteCheckins[found.lesson.slug] : undefined)) ?? []
  const quizResult = useCourseStore((s) =>
    found ? s.chineseQuiz[found.lesson.slug] : undefined,
  )

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

  const { unit, lesson, lessonIdx } = found
  const prevLesson = unit.lessons[lessonIdx - 1]
  const nextLesson = unit.lessons[lessonIdx + 1]
  const mcStyle = {
    '--mc': unit.theme.color,
    '--mc-soft': unit.theme.colorSoft,
  } as React.CSSProperties

  // 自测交卷统一结算:存成绩 + 统一星规 + ≥80% 自动完成。
  // 注:语文自测为阅读理解题,无对应记忆卡(key 为空),错题不入词卡式错题本。
  const handleSubmitQuiz = (score: number, total: number) => {
    markQuiz(lesson.slug, score, total)
    addStars(quizStars(score, total))
    if (isPassed(score, total)) markDone(lesson.slug)
  }

  return (
    <SelfStudyLesson
      moduleId="chinese"
      theme={unit.theme}
      emoji={lesson.emoji}
      kicker={`${unit.title} · 第 ${lesson.id} 课`}
      title={lesson.title}
      safeLabel="语文课"
      knowledge={<KnowledgeTab lesson={lesson} mcStyle={mcStyle} />}
      reciteLabel="✅ 背诵打卡"
      reciteLead="背完这一课，点下面的按钮打个卡吧！坚持每天背诵，记得更牢～"
      reciteStreakLabel="连续打卡(天)"
      reciteCta="📅 今天背会了，打卡！"
      reciteDoneHint="真棒！明天也来背一背吧～"
      reciteDays={reciteDays}
      onCheckin={() => markRecite(lesson.slug)}
      quiz={lesson.quiz}
      lastResult={quizResult}
      onSubmitQuiz={handleSubmitQuiz}
      done={completed.includes(lesson.slug)}
      onMarkDone={() => markDone(lesson.slug)}
      backTo={{ to: `/chinese/${unit.slug}`, label: '课程列表' }}
      prevTo={prevLesson ? `/chinese/${unit.slug}/${prevLesson.slug}` : undefined}
      nextTo={nextLesson ? `/chinese/${unit.slug}/${nextLesson.slug}` : undefined}
    />
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
            <button type="button" className="cn-read-all" onClick={() => speakText(p.lines.map((l) => l.text).join(''), { lang: 'zh' })}>
              🔊 朗读全文
            </button>
          </div>
          <div className="cn-poem-lines">
            {p.lines.map((line, j) => (
              <div className="cn-poem-line-wrap" key={j}>
                <div className="cn-poem-line">
                  <span>{line.text}</span>
                  <SpeakButton text={line.text} label={line.text} lang="zh" />
                </div>
                {line.explain && <div className="cn-poem-explain">💡 {line.explain}</div>}
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
                {h.mean && <div className="cn-hanzi-mean">释义：{h.mean}</div>}
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
                <div className="cn-idiom-row">
                  <span className="cn-idiom-term">{it.term}</span>
                  {it.source && <span className="cn-idiom-src">{it.source}</span>}
                  <SpeakButton text={it.term} label={it.term} lang="zh" />
                </div>
                {it.meaning && <div className="cn-idiom-meaning">释义：{it.meaning}</div>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
