import { Link } from 'react-router-dom'
import { useCourseStore } from '@/store/useCourseStore'
import CourseEntries from '@/components/CourseEntries'

export default function Home() {
  const todayDue = useCourseStore((s) => s.getTodayDueCount())

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-emoji">🌟</div>
        <h1 className="hero-title">课前预习 · 课后复习</h1>
        <p className="hero-sub">
          配合一对一菲教课，每单元都有 <b>预习导学</b>、<b>单词卡</b>、<b>句型对话</b>、<b>互动测验</b>。
        </p>
        <div className="hero-tags">
          <span className="hero-tag">👂 听</span>
          <span className="hero-tag">👄 说</span>
          <span className="hero-tag">📖 读</span>
          <span className="hero-tag">✍️ 写</span>
        </div>
      </section>

      {todayDue > 0 && (
        <Link to="/smart" className="smart-hero-entry">
          <span className="smart-hero-emoji">🎯</span>
          <div className="smart-hero-body">
            <div className="smart-hero-title">今日复习 · 大脑健身</div>
            <div className="smart-hero-sub">
              科学记忆编排，<b>{todayDue}</b> 个单词到期，几分钟就练完
            </div>
          </div>
          <span className="smart-hero-badge">{todayDue}</span>
          <span className="smart-hero-arrow">›</span>
        </Link>
      )}

      <h2 className="section-title">⚡ 课程入口</h2>
      <CourseEntries />
    </div>
  )
}
