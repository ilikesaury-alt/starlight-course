import CourseEntries from '@/components/CourseEntries'
import TodayTasks from '@/components/TodayTasks'
import { useCourseStore } from '@/store/useCourseStore'

export default function Home() {
  // 设了昵称就把孩子叫出来 —— 首页第一句是给孩子的，叫名字比「课前预习」亲近得多。
  // 没设置时退回原来的标题，不做任何强制引导。
  const profile = useCourseStore((s) => s.profile)
  const named = profile.name.trim().length > 0

  return (
    <div className="home home--workbench">
      {/* 首页第一屏：一个标题 + 一句说明。看五秒就知道是什么、给谁用、下一步做什么。 */}
      <section className="hero">
        <h1 className="hero-title">
          {named ? (
            <>
              {profile.avatar} {profile.name}，今天学点什么呢？
            </>
          ) : (
            '课前预习 · 课后复习'
          )}
        </h1>
        <p className="hero-sub">
          配合校内课程与一对一外教课，每本教材都有 <b>预习导学</b>、<b>单词卡</b>、<b>句型对话</b>、<b>互动测验</b>。
        </p>
        <p className="hero-scope">
          牛津 Starlight 预备级 + 第一册 · 人教版语文 · 外研版英语 · Fly Guy 绘本 · Rocket Girl 阅读
        </p>
      </section>

      {/* 「今天翻到这里」：到期复习 + 各模块的下一课 */}
      <TodayTasks />

      <h2 className="section-title">课程入口</h2>
      <CourseEntries />
    </div>
  )
}
