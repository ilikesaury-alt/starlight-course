import { Link } from 'react-router-dom'
import { modules } from '@/data/starlight'
import { useCourseStore } from '@/store/useCourseStore'

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

      <h2 className="section-title">⚡ 快速入口</h2>
      <Link to="/rocketgirl" className="rg-home-entry">
        <span className="rg-home-emoji">🚀</span>
        <div className="rg-home-body">
          <div className="rg-home-title">Rocket Girl 英语闯关</div>
          <div className="rg-home-sub">宝贝最爱的动画片主题课 · 108 个故事关卡</div>
        </div>
        <span className="rg-home-arrow">›</span>
      </Link>
      <div className="quick-row">
        <Link to="/preview" className="quick-card quick-preview">
          <span className="qc-emoji">📖</span>
          <span>课前预习</span>
          <span className="qc-sub">先学一遍，上课更自信</span>
        </Link>
        <Link to="/review" className="quick-card quick-review">
          <span className="qc-emoji">🔁</span>
          <span>课后复习</span>
          <span className="qc-sub">巩固单词，听力测验</span>
        </Link>
      </div>
      <div className="quick-row" style={{ marginTop: '10px' }}>
        <Link to="/alphabet" className="quick-card quick-alphabet">
          <span className="qc-emoji">🔤</span>
          <span>字母表</span>
          <span className="qc-sub">26 个字母发音</span>
        </Link>
        <Link to="/progress" className="quick-card quick-progress">
          <span className="qc-emoji">📊</span>
          <span>学习进度</span>
          <span className="qc-sub">星星与成就</span>
        </Link>
      </div>

      <h2 className="section-title">📚 12 个学习模块</h2>
      <div className="module-grid">
        {modules.map((m) => (
          <Link
            key={m.id}
            to={`/preview/${m.slug}`}
            className="module-card"
            style={{ '--mc': m.color, '--mc-soft': m.colorSoft } as React.CSSProperties}
          >
            <div className="module-emoji">{m.emoji}</div>
            <div className="module-info">
              <div className="module-num">Module {m.id}</div>
              <div className="module-title">{m.title}</div>
              <div className="module-zh">{m.titleZh}</div>
            </div>
            <div className="module-lessons-badge">{m.lessons.length} 课</div>
            <div className="module-arrow">›</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
