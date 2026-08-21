// 三年级上册英语（外研版）课页：知识点/打卡/自测骨架由 SelfStudyLesson 共享，
// 本文件只保留英语课的知识点渲染与数据接线。

import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import SpeakButton from '@/components/SpeakButton'
import SelfStudyLesson from '@/components/SelfStudyLesson'
import { getEngLesson, type EngLesson as Lesson } from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'
import { speakText } from '@/utils/speak'
import { quizStars, isPassed } from '@/utils/stars'

export default function Eng3aLesson() {
  const { unitId = '', lessonId = '' } = useParams()
  const found = getEngLesson(unitId, lessonId)
  const markRecite = useCourseStore((s) => s.markEng3aRecite)
  const markQuiz = useCourseStore((s) => s.markEng3aQuiz)
  const addStars = useCourseStore((s) => s.addStars)
  const markDone = useCourseStore((s) => s.markEng3aDone)
  const completed = useCourseStore((s) => s.completedEng3a)
  const seedCards = useCourseStore((s) => s.seedCards)
  const addWrongWord = useCourseStore((s) => s.addWrongWord)
  const recordReview = useCourseStore((s) => s.recordReview)
  const reciteDays = useCourseStore((s) => (found ? s.eng3aRecite[found.lesson.slug] : undefined)) ?? []
  const quizResult = useCourseStore((s) =>
    found ? s.eng3aQuiz[found.lesson.slug] : undefined,
  )

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

  const { unit, lesson, lessonIdx } = found
  const prevLesson = unit.lessons[lessonIdx - 1]
  const nextLesson = unit.lessons[lessonIdx + 1]
  const mcStyle = {
    '--mc': unit.theme.color,
    '--mc-soft': unit.theme.colorSoft,
  } as React.CSSProperties

  // 自测交卷统一结算：存成绩 + 统一星规 + ≥80% 自动完成 + 错题(key 题)入错题本并进 SRS
  const handleSubmitQuiz = (score: number, total: number, wrongKeys: { en: string; zh: string }[]) => {
    markQuiz(lesson.slug, score, total)
    addStars(quizStars(score, total))
    if (isPassed(score, total)) markDone(lesson.slug)
    wrongKeys.forEach(({ en, zh }) => {
      addWrongWord({
        en,
        zh,
        emoji: lesson.emoji,
        from: `${unit.title} · ${lesson.title}`,
        module: 'eng3a',
      })
      recordReview(en, false, 'eng3a')
    })
  }

  return (
    <SelfStudyLesson
      moduleId="eng3a"
      theme={unit.theme}
      emoji={lesson.emoji}
      kicker={`${unit.title} · 第 ${lesson.id} 课`}
      title={lesson.title}
      safeLabel="英语课"
      cover={unit.cover}
      knowledge={<KnowledgeTab lesson={lesson} mcStyle={mcStyle} />}
      reciteLabel="🔊 跟读练习"
      reciteLead="点 🔊 听一听，跟着大声读出来吧！读完这一课，点下面的按钮打个卡～"
      reciteStreakLabel="连续跟读(天)"
      reciteCta="📅 今天读过了，打卡！"
      reciteDoneHint="真棒！明天也来读一读吧～"
      reciteDays={reciteDays}
      onCheckin={() => markRecite(lesson.slug)}
      quiz={lesson.exercise}
      lastResult={quizResult}
      onSubmitQuiz={handleSubmitQuiz}
      done={completed.includes(lesson.slug)}
      onMarkDone={() => markDone(lesson.slug)}
      backTo={{ to: `/eng3a/${unit.slug}`, label: '课程列表' }}
      prevTo={prevLesson ? `/eng3a/${unit.slug}/${prevLesson.slug}` : undefined}
      nextTo={nextLesson ? `/eng3a/${unit.slug}/${nextLesson.slug}` : undefined}
    />
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
        <section className="en3-dialogs">
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
        <section className="en3-chant">
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
        <section className="en3-letters">
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
