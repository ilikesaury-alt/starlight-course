import { Link } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { useCourseStore } from '../store/useCourseStore'
import { STARLIGHT_THEME } from '../data/starlight'
import { moduleThemeVars } from '../utils/theme'

const mcStyle = moduleThemeVars(STARLIGHT_THEME)

export default function WrongBook() {
  const wrongWords = useCourseStore((s) => s.wrongWords)
  const removeWrongWord = useCourseStore((s) => s.removeWrongWord)
  const markMastered = useCourseStore((s) => s.markMastered)
  const clearWrongWords = useCourseStore((s) => s.clearWrongWords)
  const recordReview = useCourseStore((s) => s.recordReview)

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
            <p style={{ fontSize: '13px' }}>做完听力测验后，错题会自动出现在这里。</p>
            <Link to="/review" className="btn">去复习</Link>
          </div>
        ) : (
          <>
            <p className="lead">
              共 {wrongWords.length} 个错词。点击 🔊 听发音，练熟后点"已掌握"移除。
            </p>

            <div className="wrong-list">
              {wrongWords.map((w) => (
                <div key={w.en} className="wrong-item">
                  <div className="wrong-emoji">{w.emoji}</div>
                  <div className="wrong-info">
                    <div className="wrong-en">{w.en}</div>
                    {w.zh && <div className="wrong-zh">{w.zh}</div>}
                    <div className="wrong-from">来自：{w.from}</div>
                  </div>
                  <div className="wrong-actions">
                    <SpeakButton text={w.en} label={w.en} />
                    <button
                      type="button"
                      className="mastery-btn mastered"
                      onClick={() => {
                        markMastered(w.en)
                        removeWrongWord(w.en)
                        // 同步 SRS:答对一次,升盒,避免今日复习反复考
                        recordReview(w.en, true)
                      }}
                    >
                      ✅ 掌握
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '22px' }}>
              <button
                type="button"
                className="btn btn-soft"
                onClick={() => {
                  if (confirm('确定清空所有错题吗？')) clearWrongWords()
                }}
              >
                🧹 清空全部
              </button>
            </div>
          </>
        )}
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
