import { Link } from 'react-router-dom'
import SafeBoundary from '../components/SafeBoundary'
import { alphabet, STARLIGHT_THEME } from '../data/starlight'
import { moduleThemeVars } from '../utils/theme'
import { speakText } from '../utils/speak'
import { cleanForSpeak } from '../utils/bookDict'
import { useSlowMode } from '../utils/slowMode'

const mcStyle = moduleThemeVars(STARLIGHT_THEME)

// 26 个字母 = 一张表（教室墙上那张 alphabet chart），不是 26 张卡片。
// 每一格的「听」入口就长在要读的东西上：点字母听字母，点单词听单词 ——
// 比两个匿名喇叭清楚（原来卡片里最重的元素是两个喇叭，字母反而次要）。
export default function AlphabetPage() {
  const slow = useSlowMode()
  return (
    <div className="page alphabet alphabet-sheet" style={mcStyle}>
      <div className="page-head">
        <div className="page-kicker">My Alphabet</div>
        <h1 className="page-title">26 个字母</h1>
      </div>

      <SafeBoundary label="字母表">
        <p className="lead">点字母听发音，点单词听例词。跟着读，注意大小写。</p>
        <div className="letter-grid">
          {alphabet.map((l) => (
            <div key={l.upper} className="letter-card">
              <button
                type="button"
                className="letter-shape"
                onClick={() => speakText(cleanForSpeak(l.upper), { slow })}
                aria-label={`播放字母 ${l.upper}`}
                title="点一下听字母发音"
              >
                <span className="letter-upper">{l.upper}</span>
                <span className="letter-lower">{l.lower}</span>
              </button>
              <div className="letter-word">
                <span className="letter-emoji" aria-hidden="true">{l.emoji}</span>
                <button
                  type="button"
                  className="letter-word-btn"
                  onClick={() => speakText(cleanForSpeak(l.word), { slow })}
                  aria-label={`播放例词 ${l.word}`}
                  title={`${l.word} · 点一下听发音`}
                >
                  {l.word}
                </button>
              </div>
              <div className="letter-ipa">{l.ipa}</div>
            </div>
          ))}
        </div>
      </SafeBoundary>

      <div className="page-nav">
        <Link to="/" className="back-link">← 返回首页</Link>
      </div>
    </div>
  )
}
