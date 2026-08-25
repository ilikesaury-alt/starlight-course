import BookHome from '@/components/BookHome'
import { chineseUnits, CHINESE_THEME, totalChineseLessons } from '@/data/chinese'
import { useCourseStore } from '@/store/useCourseStore'

export default function ChineseHome() {
  const reciteCheckins = useCourseStore((s) => s.reciteCheckins)

  return (
    <BookHome
      theme={CHINESE_THEME}
      heroEmoji="📚"
      heroTitle="三年级上册语文"
      heroSub={
        <>
          人教版（统编版）必背知识点，配合在校学习。<br />
          共 <b>{chineseUnits.length}</b> 个单元、<b>{totalChineseLessons}</b> 课，含
          <b>古诗词</b>、<b>课文重点段落</b>、<b>生字词</b>与<b>日积月累</b>。
        </>
      }
      heroTags={['📜 古诗词', '📖 课文', '✍️ 生字', '✅ 打卡']}
      progressLabel="已背诵打卡"
      totalLessons={totalChineseLessons}
      sectionTitle="📚 学习单元"
      basePath="/chinese"
      units={chineseUnits}
      checkins={reciteCheckins}
      doneWord="已背"
      aboutNote={
        <>
          课程依据<b>人教版（统编版）三年级上册语文</b>教材的必背内容整理，覆盖全部 8 个单元：
          古诗词（9 首）、课文重点段落、写字表生字（拼音 + 组词）与语文园地日积月累。
          每课都能<b>看知识点</b>、<b>做背诵打卡</b>、<b>玩自测练习</b>，帮助课内巩固。
        </>
      }
    />
  )
}
