import CourseEntries from '@/components/CourseEntries'
import Breadcrumb from '@/components/Breadcrumb'

// 课程中心：底部导航「课程」入口直达，所有模块一级可达，
// 不用先回首页再滚动找入口。复用 CourseEntries 与首页同一套宫格。
export default function Courses() {
  return (
    <div className="page courses">
      <Breadcrumb items={[{ label: '🏠', to: '/' }, { label: '全部课程' }]} />
      <div className="page-head">
        <span className="page-emoji">📚</span>
        <div>
          <div className="page-kicker">课程中心</div>
          <h1 className="page-title">选一本，开始学吧</h1>
        </div>
      </div>
      <CourseEntries />
    </div>
  )
}
