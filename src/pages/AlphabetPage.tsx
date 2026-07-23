import { Link } from 'react-router-dom'
import SpeakButton from '../components/SpeakButton'
import SafeBoundary from '../components/SafeBoundary'
import { alphabet } from '../data/starlight'

export default function AlphabetPage() {
  return (
    <div className="page alphabet">
      <div className="page-head" style={{ '--mc': '#7c3aed' } as React.CSSProperties}>
        <span className="page-emoji">🔤</span>
        <div>
          <div className="page-kicker">My Alphabet</div>
          <h1 className="page-title">26 个字母</h1>
        </div>
      </div>

      <SafeBoundary label="字母表">
        <p className="lead">点击 🔊 听字母发音和例词。跟着读，注意大小写。</p>
        <div className="letter-grid">
          {alphabet.map((l) => (
            <div key={l.upper} className="letter-card">
              <div className="letter-shape">
                <span className="letter-upper">{l.upper}</span>
                <span className="letter-lower">{l.lower}</span>
              </div>
              <div className="letter-acts">
                <SpeakButton text={l.upper} label={l.upper} />
                <SpeakButton text={l.word} label={l.word} />
              </div>
              <div className="letter-word">
                <span className="letter-emoji">{l.emoji}</span>
                <span className="letter-word-text">{l.word}</span>
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
