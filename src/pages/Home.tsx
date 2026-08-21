import CourseEntries from '@/components/CourseEntries'
import TodayTasks from '@/components/TodayTasks'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-emoji">🌟</div>
        <h1 className="hero-title">课前预习 · 课后复习</h1>
        <p className="hero-sub">
          配合校内课程与一对一外教课，每本教材都有 <b>预习导学</b>、<b>单词卡</b>、<b>句型对话</b>、<b>互动测验</b>。
        </p>
        <div className="hero-tags">
          <span className="hero-tag">👂 听</span>
          <span className="hero-tag">👄 说</span>
          <span className="hero-tag">📖 读</span>
          <span className="hero-tag">✍️ 写</span>
        </div>
      </section>

      <TodayTasks />

      <h2 className="section-title">⚡ 课程入口</h2>
      <CourseEntries />
    </div>
  )
}
