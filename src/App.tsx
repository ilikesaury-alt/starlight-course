import { HashRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '@/components/Layout'
import SafeBoundary from '@/components/SafeBoundary'
import { cancelSpeech } from '@/utils/speak'
import Home from '@/pages/Home'
import Courses from '@/pages/Courses'
import LessonList from '@/pages/LessonList'
import LessonPreview from '@/pages/LessonPreview'
import UnitQuiz from '@/pages/UnitQuiz'
import WrongBook from '@/pages/WrongBook'
import Progress from '@/pages/Progress'
import AlphabetPage from '@/pages/AlphabetPage'
import SmartReview from '@/pages/SmartReview'
import RocketGirlHome from '@/pages/RocketGirlHome'
import RocketGirlStory from '@/pages/RocketGirlStory'
import FlyGuyHome from '@/pages/FlyGuyHome'
import FlyGuyStory from '@/pages/FlyGuyStory'
import StarlightHome from '@/pages/StarlightHome'
import ChineseHome from '@/pages/ChineseHome'
import ChineseUnit from '@/pages/ChineseUnit'
import ChineseLesson from '@/pages/ChineseLesson'
import Eng3aHome from '@/pages/Eng3aHome'
import Eng3aUnit from '@/pages/Eng3aUnit'
import Eng3aLesson from '@/pages/Eng3aLesson'
import PhrasesPage from '@/pages/PhrasesPage'

// 内层:在 Router 内部使用 useLocation,路由变化时重置 SafeBoundary
function AppRoutes() {
  const location = useLocation()

  // 离开页面 / 切换路由时立即停止任何残留的语音播放
  useEffect(() => {
    cancelSpeech()
  }, [location.pathname, location.search, location.hash])

  return (
    <SafeBoundary key={location.pathname}>
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
