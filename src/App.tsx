import { HashRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '@/components/Layout'
import SafeBoundary from '@/components/SafeBoundary'
import Home from '@/pages/Home'
import PreviewList from '@/pages/PreviewList'
import LessonList from '@/pages/LessonList'
import LessonPreview from '@/pages/LessonPreview'
import ReviewList from '@/pages/ReviewList'
import ReviewEntry from '@/pages/ReviewEntry'
import VocabReview from '@/pages/VocabReview'
import ListeningQuiz from '@/pages/ListeningQuiz'
import WrongBook from '@/pages/WrongBook'
import Progress from '@/pages/Progress'
import AlphabetPage from '@/pages/AlphabetPage'
import SmartReview from '@/pages/SmartReview'
import RocketGirlHome from '@/pages/RocketGirlHome'
import RocketGirlStory from '@/pages/RocketGirlStory'

// 内层:在 Router 内部使用 useLocation,路由变化时重置 SafeBoundary
function AppRoutes() {
  const location = useLocation()
  return (
    <SafeBoundary key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<PreviewList />} />
        <Route path="/preview/:unitId" element={<LessonList />} />
        <Route path="/preview/:unitId/:lessonId" element={<LessonPreview />} />
        {/* 旧路由兜底：重定向到课程列表，兼容已存书签 */}
        <Route path="/preview/:unitId/vocab" element={<RedirectToLessonList />} />
        <Route path="/preview/:unitId/patterns" element={<RedirectToLessonList />} />
        <Route path="/preview/:unitId/dialogue" element={<RedirectToLessonList />} />
        <Route path="/review" element={<ReviewList />} />
        <Route path="/review/:unitId" element={<ReviewEntry />} />
        <Route path="/review/:unitId/vocab" element={<VocabReview />} />
        <Route path="/review/:unitId/quiz" element={<ListeningQuiz />} />
        <Route path="/smart" element={<SmartReview />} />
        <Route path="/wrong" element={<WrongBook />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/alphabet" element={<AlphabetPage />} />
        <Route path="/rocketgirl" element={<RocketGirlHome />} />
        <Route path="/rocketgirl/:slug" element={<RocketGirlStory />} />
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
  // 全局兜底:捕获任何未处理的异步错误,防止整页白屏崩溃
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      // 只阻止 speechSynthesis 相关错误崩溃,不掩盖真实错误
      if (e.message?.includes('speechSynthesis') || e.message?.includes('SpeechSynthesis')) {
        e.preventDefault()
      }
    }
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason
      if (reason?.message?.includes('speechSynthesis') || reason?.message?.includes('SpeechSynthesis')) {
        e.preventDefault()
      }
    }
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  )
}
