import CourseEntries from '@/components/CourseEntries'
import TodayTasks from '@/components/TodayTasks'

export default function Home() {
  return (
    <div className="home home--workbench">
      {/* 首页第一屏：一个标题 + 一句说明。看五秒就知道是什么、给谁用、下一步做什么。 */}
      <section className="hero">
        <h1 className="hero-title">课前预习 · 课后复习</h1>
        <p className="hero-sub">
          配合校内课程与一对一外教课，每本教材都有 <b>预习导学</b>、<b>单词卡</b>、<b>句型对话</b>、<b>互动测验</b>。
        </p>
        <p className="hero-scope">
          牛津 Starlight 预备级 · 人教版语文 · 外研版英语 · Fly Guy / Rocket Girl 绘本
        </p>
      </section>

      {/* 「今天翻到这里」：到期复习 + 各模块的下一课 */}
      <TodayTasks />

      <h2 className="section-title">课程入口</h2>
      <CourseEntries />
    </div>
  )
}
