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
      {/* 首页第一屏：一句问候 + 一行范围说明。
          ⚠️ 2026-11-16 重设计后**刻意做薄**：旧版是三段文案（标题 + 功能列表 +
          教材清单），占了首屏 193px 高，但没有一处指向「现在该做什么」。
          卡片化之后首屏要留给「今日清单 + 主课」，文案退成一行副标题。

          hero-title 保留原样（未设昵称时仍是「课前预习 · 课后复习」）——
          tests/home.spec.ts 用它做锚点，且设昵称后换成孩子名字是明确的产品契约。 */}
      <section className="hero hero--hall">
        <h1 className="hero-title">
          {named ? (
            <>
              {profile.avatar} {profile.name}，今天学点什么呢？
            </>
          ) : (
            '课前预习 · 课后复习'
          )}
        </h1>
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
