import BookHome from '@/components/BookHome'
import { eng3aUnits, ENG3A_THEME, totalEngLessons } from '@/data/eng3a'
import { useCourseStore } from '@/store/useCourseStore'

export default function Eng3aHome() {
  const recite = useCourseStore((s) => s.eng3aRecite)

  return (
    <BookHome
      theme={ENG3A_THEME}
      heroEmoji="📘"
      heroTitle="三年级上册英语"
      heroSub={
        <>
          外研版（新标准 2024）课本同步，配合在校学习。<br />
          共 <b>{eng3aUnits.length}</b> 个单元、<b>{totalEngLessons}</b> 课，含
          <b>词汇</b>、<b>句型对话</b>、<b>字母歌谣</b>与<b>自测练习</b>。
        </>
      }
      heroTags={['🔤 词汇', '💬 句型', '🎵 歌谣', '✅ 跟读']}
      progressLabel="已跟读打卡"
      totalLessons={totalEngLessons}
      sectionTitle="📘 学习单元"
      basePath="/eng3a"
      units={eng3aUnits}
      checkins={recite}
      doneWord="已读"
      aboutNote={
        <>
          课程依据<b>外研版（新标准 2024）三年级上册英语</b>教材整理，覆盖全部 6 个单元：
          打招呼与姓名、学习用品、颜色、数字、家庭、我的家。每课都能<b>看知识点</b>、
          <b>做跟读练习</b>、<b>玩自测练习</b>；课文插图均从原版教材提取，帮助课内巩固与听说启蒙。
        </>
      }
    />
  )
}
