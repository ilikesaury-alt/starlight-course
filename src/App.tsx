import { HashRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Layout from '@/components/Layout'
import SafeBoundary from '@/components/SafeBoundary'
import { cancelSpeech } from '@/utils/speak'

// 路由级代码分割:每个页面(含其专属课程数据)按需加载,减小首屏 bundle。
// 数据文件(如 starlight-book/绘本原文)只被对应页面引用,会随页面 chunk 一起懒加载。
const Home = lazy(() => import('@/pages/Home'))
const Courses = lazy(() => import('@/pages/Courses'))
const LessonList = lazy(() => import('@/pages/LessonList'))
const LessonPreview = lazy(() => import('@/pages/LessonPreview'))
const UnitQuiz = lazy(() => import('@/pages/UnitQuiz'))
const WrongBook = lazy(() => import('@/pages/WrongBook'))
const Progress = lazy(() => import('@/pages/Progress'))
const AlphabetPage = lazy(() => import('@/pages/AlphabetPage'))
const SmartReview = lazy(() => import('@/pages/SmartReview'))
const RocketGirlHome = lazy(() => import('@/pages/RocketGirlHome'))
const RocketGirlStory = lazy(() => import('@/pages/RocketGirlStory'))
const FlyGuyHome = lazy(() => import('@/pages/FlyGuyHome'))
const FlyGuyStory = lazy(() => import('@/pages/FlyGuyStory'))
const StarlightHome = lazy(() => import('@/pages/StarlightHome'))
const ChineseHome = lazy(() => import('@/pages/ChineseHome'))
const ChineseUnit = lazy(() => import('@/pages/ChineseUnit'))
const ChineseLesson = lazy(() => import('@/pages/ChineseLesson'))
const Eng3aHome = lazy(() => import('@/pages/Eng3aHome'))
const Eng3aUnit = lazy(() => import('@/pages/Eng3aUnit'))
const Eng3aLesson = lazy(() => import('@/pages/Eng3aLesson'))
const PhrasesPage = lazy(() => import('@/pages/PhrasesPage'))

// 分包加载中的兜底:轻量居中提示(儿童向文案)
function PageLoading() {
  return (
    <div className="empty" role="status" aria-label="页面加载中">
      <p>📖 正在翻开这一页…</p>
    </div>
  )
}

// 内层:在 Router 内部使用 useLocation,路由变化时重置 SafeBoundary
function AppRoutes() {
  const location = useLocation()

  // 离开页面 / 切换路由时立即停止任何残留的语音播放
  useEffect(() => {
    cancelSpeech()
  }, [location.pathname, location.search, location.hash])

  return (
    <SafeBoundary key={location.pathname}>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/preview" element={<Navigate to="/starlight" replace />} />
          <Route path="/preview/:unitId" element={<LessonList />} />
          <Route path="/preview/:unitId/:lessonId" element={<LessonPreview />} />
          <Route path="/preview/:unitId/quiz" element={<UnitQuiz />} />
          {/* 旧路由兜底：重定向到课程列表，兼容已存书签 */}
          <Route path="/preview/:unitId/vocab" element={<RedirectToLessonList />} />
          <Route path="/preview/:unitId/patterns" element={<RedirectToLessonList />} />
          <Route path="/preview/:unitId/dialogue" element={<RedirectToLessonList />} />
          <Route path="/smart" element={<SmartReview />} />
          <Route path="/wrong" element={<WrongBook />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/alphabet" element={<AlphabetPage />} />
          <Route path="/rocketgirl" element={<RocketGirlHome />} />
          <Route path="/rocketgirl/:slug" element={<RocketGirlStory />} />
          <Route path="/flyguy" element={<FlyGuyHome />} />
          <Route path="/flyguy/:slug" element={<FlyGuyStory />} />
          <Route path="/starlight" element={<StarlightHome />} />
          <Route path="/chinese" element={<ChineseHome />} />
          <Route path="/chinese/:unitId" element={<ChineseUnit />} />
          <Route path="/chinese/:unitId/:lessonId" element={<ChineseLesson />} />
          <Route path="/eng3a" element={<Eng3aHome />} />
          <Route path="/eng3a/:unitId" element={<Eng3aUnit />} />
          <Route path="/eng3a/:unitId/:lessonId" element={<Eng3aLesson />} />
          <Route path="/phrases" element={<PhrasesPage />} />
        </Routes>
      </Suspense>
    </SafeBoundary>
  )
}

// 旧预习子路径(单词/句型/对话)重定向回课程列表,避免书签白屏
function RedirectToLessonList() {
  const { unitId = '' } = useParams()
  return <Navigate to={`/preview/${unitId}`} replace />
}

export default function App() {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  )
}
