import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '@/components/Layout'
import SafeBoundary from '@/components/SafeBoundary'
import Home from '@/pages/Home'
import PreviewList from '@/pages/PreviewList'
import PreviewEntry from '@/pages/PreviewEntry'
import VocabPreview from '@/pages/VocabPreview'
import PatternPreview from '@/pages/PatternPreview'
import DialoguePreview from '@/pages/DialoguePreview'
import ReviewList from '@/pages/ReviewList'
import ReviewEntry from '@/pages/ReviewEntry'
import VocabReview from '@/pages/VocabReview'
import ListeningQuiz from '@/pages/ListeningQuiz'
import WrongBook from '@/pages/WrongBook'
import Progress from '@/pages/Progress'
import AlphabetPage from '@/pages/AlphabetPage'
import SmartReview from '@/pages/SmartReview'

// 内层:在 Router 内部使用 useLocation,路由变化时重置 SafeBoundary
function AppRoutes() {
  const location = useLocation()
  return (
    <SafeBoundary key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<PreviewList />} />
        <Route path="/preview/:unitId" element={<PreviewEntry />} />
        <Route path="/preview/:unitId/vocab" element={<VocabPreview />} />
        <Route path="/preview/:unitId/patterns" element={<PatternPreview />} />
        <Route path="/preview/:unitId/dialogue" element={<DialoguePreview />} />
        <Route path="/review" element={<ReviewList />} />
        <Route path="/review/:unitId" element={<ReviewEntry />} />
        <Route path="/review/:unitId/vocab" element={<VocabReview />} />
        <Route path="/review/:unitId/quiz" element={<ListeningQuiz />} />
        <Route path="/smart" element={<SmartReview />} />
        <Route path="/wrong" element={<WrongBook />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/alphabet" element={<AlphabetPage />} />
      </Routes>
    </SafeBoundary>
  )
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
