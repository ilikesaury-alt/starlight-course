import { Link } from 'react-router-dom'
import { flyGuyStoryCount, flyGuyWordCount } from '@/data/flyguy'
import { totalEngLessons, eng3aWordCount } from '@/data/eng3a'

// 首页与「课程」页共用的模块入口宫格 + 快捷入口。
// 抽成组件避免两处重复维护相同的 5 个模块入口。
export default function CourseEntries() {
  return (
    <>
      <div className="home-entries">
        <Link to="/chinese" className="cn-home-entry">
          <span className="cn-home-emoji">📚</span>
          <div className="cn-home-body">
            <div className="cn-home-title">三年级上册语文</div>
            <div className="cn-home-sub">人教版必背 · 8 单元 / 古诗词·课文·生字·日积月累</div>
          </div>
          <span className="cn-home-arrow">›</span>
        </Link>
        <Link to="/eng3a" className="en3-home-entry">
          <span className="en3-home-emoji">📘</span>
          <div className="en3-home-body">
            <div className="en3-home-title">三年级上册英语</div>
            <div className="en3-home-sub">外研版（新标准 2024）· 6 单元 / {totalEngLessons} 课 / {eng3aWordCount} 词 · 听说启蒙</div>
          </div>
          <span className="en3-home-arrow">›</span>
        </Link>
        <Link to="/starlight" className="sl-home-entry">
          <span className="sl-home-emoji">🌟</span>
          <div className="sl-home-body">
            <div className="sl-home-title">Starlight 主课</div>
            <div className="sl-home-sub">牛津 Starlight 预备级 · 12 单元 / 96 课 / 全教材单词</div>
          </div>
          <span className="sl-home-arrow">›</span>
        </Link>
        <Link to="/rocketgirl" className="rg-home-entry">
          <span className="rg-home-emoji">🚀</span>
          <div className="rg-home-body">
            <div className="rg-home-title">Rocket Girl 英语闯关</div>
            <div className="rg-home-sub">宝贝最爱的动画片主题课 · 108 个故事关卡</div>
          </div>
          <span className="rg-home-arrow">›</span>
        </Link>
        <Link to="/flyguy" className="fg-home-entry">
          <span className="fg-home-emoji">🐝</span>
          <div className="fg-home-body">
            <div className="fg-home-title">Fly Guy 英语绘本闯关</div>
            <div className="fg-home-sub">小男孩 Buzz 和宠物苍蝇的爆笑绘本 · {flyGuyStoryCount} 个故事 / {flyGuyWordCount} 词</div>
          </div>
          <span className="fg-home-arrow">›</span>
        </Link>
      </div>

      <div className="quick-row">
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
    </>
  )
}
