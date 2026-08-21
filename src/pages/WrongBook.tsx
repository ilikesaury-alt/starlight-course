import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import ConfirmDialog from '../components/ConfirmDialog'
import QuizEngine, { type QuizItem, type QuizPickInfo } from '../components/QuizEngine'
import ModuleFilterChips, { type ModuleFilter } from '../components/ModuleFilterChips'
import { useCourseStore } from '../store/useCourseStore'
import { STARLIGHT_THEME } from '../data/starlight'
import { MODULE_LIST, moduleThemeOf, type ModuleId } from '../data/modules'
import { moduleThemeVars } from '../utils/theme'
import { buildWordQuiz } from '../utils/bookQuiz'
import { quizStars } from '../utils/stars'

const mcStyle = moduleThemeVars(STARLIGHT_THEME)

export default function WrongBook() {
  const wrongWords = useCourseStore((s) => s.wrongWords)
  const removeWrongWord = useCourseStore((s) => s.removeWrongWord)
  const markMastered = useCourseStore((s) => s.markMastered)
  const clearWrongWords = useCourseStore((s) => s.clearWrongWords)
  const recordReview = useCourseStore((s) => s.recordReview)
  const addStars = useCourseStore((s) => s.addStars)

  const [filter, setFilter] = useState<ModuleFilter>('all')
  const [showClear, setShowClear] = useState(false)
  // 重测模式:用当前筛选的错词生成词义题,答对即移出错题本
  const [quizItems, setQuizItems] = useState<QuizItem[] | null>(null)
  // 一轮重测内已结算的词(en|module),避免同词多模块重复记 SRS
  const settledRef = useRef<Set<string>>(new Set())

  const list = filter === 'all' ? wrongWords : wrongWords.filter((w) => w.module === filter)

  // 各模块错题数量，供筛选 chips 显示并隐藏为 0 的模块
  const counts = MODULE_LIST.reduce<Partial<Record<ModuleId, number>>>((acc, m) => {
    acc[m.id] = wrongWords.filter((w) => w.module === m.id).length
    return acc
  }, {})

  // 模块中文名查表，用于在标签上展示
  const moduleLabel = (id: ModuleId) => MODULE_LIST.find((m) => m.id === id)?.labelZh ?? id

  // 开始重测:词义题(语文汉字自动切中文嗓),至少 4 个错词才有足够干扰项
  const startRetest = () => {
    const items = buildWordQuiz(list, list, 12).map((item) =>
      list.find((w) => w.en === item.speakText)?.module === 'chinese'
        ? { ...item, lang: 'zh' as const }
        : item
    )
    settledRef.current = new Set()
    setQuizItems(items)
  }

  // 每次作答:写 SRS;答对立即移出错题本(与「掌握」同一语义,但不强制 markMastered)
  const handlePick = ({ en, correct }: QuizPickInfo) => {
    for (const w of wrongWords.filter((x) => x.en === en)) {
      const key = `${en}|${w.module}`
      if (settledRef.current.has(key)) continue
      settledRef.current.add(key)
      recordReview(en, correct, w.module)
      if (correct) removeWrongWord(en, w.module)
    }
  }

  const handleFinish = (correct: number, total: number) => {
    addStars(quizStars(correct, total))
  }

  return (
    <div className="page wrong-book" style={mcStyle}>
      <div className="page-head">
        <span className="page-emoji">📋</span>
        <div>
          <div className="page-kicker">错题本</div>
          <h1 className="page-title">把错的练对</h1>
        </div>
      </div>

      <SafeBoundary label="错题本">
        {wrongWords.length === 0 ? (
          <div className="wrong-empty">
            <div className="wrong-empty-emoji">🎉</div>
            <p>错题本是空的，太棒啦！</p>
            <p style={{ fontSize: '13px' }}>做完测验后，错题会自动出现在这里。</p>
            <Link to="/smart" className="btn">去复习</Link>
          </div>
        ) : quizItems ? (
          <>
            <p className="lead">重测这批错词，答对一题就移出一题。加油！</p>
            <QuizEngine
              quiz={quizItems}
              mcStyle={mcStyle}
              badgeText="🎯 错题重测 · 选出正确的词"
              resultTitle="重测完成！"
              resultLinks={
                <>
                  <button type="button" className="btn btn-soft" onClick={() => setQuizItems(null)}>
                    📋 返回错题本
                  </button>
                  <Link to="/smart" className="btn btn-soft">🧠 去复习</Link>
                </>
              }
              onPick={handlePick}
              onFinish={handleFinish}
            />
          </>
        ) : (
          <>
            <p className="lead">
              共 {wrongWords.length} 个错词。点击 🔊 听发音，练熟后点"已掌握"移除。
            </p>

            <ModuleFilterChips value={filter} onChange={setFilter} counts={counts} />

            <div className="wrong-list">
              {list.map((w) => (
                <div key={w.en + '|' + w.module} className="wrong-item">
                  <div className="wrong-emoji">{w.emoji}</div>
                  <div className="wrong-info">
                    <div className="wrong-en">{w.en}</div>
                    {w.zh && <div className="wrong-zh">{w.zh}</div>}
                    <div className="wrong-from">
                      来自：{w.from}
                      <span
                        className="wrong-module-tag"
                        style={moduleThemeVars(moduleThemeOf(w.module))}
                      >
                        {moduleLabel(w.module)}
                      </span>
                    </div>
                  </div>
                  <div className="wrong-actions">
                    <SpeakButton text={w.en} label={w.en} lang={w.module === 'chinese' ? 'zh' : 'en'} />
                    <button
                      type="button"
                      className="mastery-btn mastered"
                      onClick={() => {
                        markMastered(w.en)
                        removeWrongWord(w.en, w.module)
                        // 同步 SRS:答对一次,升盒,避免今日复习反复考
                        recordReview(w.en, true, w.module)
                      }}
                    >
                      ✅ 掌握
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '22px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn"
                onClick={startRetest}
                disabled={list.length < 4}
                title={list.length < 4 ? '至少积累 4 个错词才能重测' : undefined}
              >
                🎯 重测这些题（{list.length}）
              </button>
              <button
                type="button"
                className="btn btn-soft"
                onClick={() => setShowClear(true)}
              >
                🧹 清空全部
              </button>
            </div>
            {list.length > 0 && list.length < 4 && (
              <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ink-mute)', marginTop: '8px' }}>
                再积累 {4 - list.length} 个错词就可以重测啦～
              </p>
            )}

            <ConfirmDialog
              open={showClear}
              emoji="🧹"
              title="要清空所有错题吗？"
              message="清空后就找不回来了哦，确定吗？"
              confirmText="清空"
              cancelText="先不啦"
              danger
              onConfirm={() => {
                clearWrongWords()
                setShowClear(false)
              }}
              onCancel={() => setShowClear(false)}
            />
          </>
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
