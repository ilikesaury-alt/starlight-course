// E 课堂拓展词录入卡（弹层）
// 菲教在网课里临时教了教材外的词（如 broccoli），在这里现场录进本课拓展词。
// en 必填；zh 缺省时走逐词词典/有道兜底查询，emoji 缺省 📝。

import { useState } from 'react'
import { lookupZh, wordBase } from '@/utils/bookDict'
import type { Word } from '@/data/starlight'

interface Props {
  open: boolean
  /** 已存在的拓展词 en（小写比较），同课重复时提交会被拒绝 */
  existing: string[]
  onSubmit: (w: Word) => boolean
  onCancel: () => void
}

export default function ExtensionWordEntry({ open, existing, onSubmit, onCancel }: Props) {
  const [en, setEn] = useState('')
  const [zh, setZh] = useState('')
  const [emoji, setEmoji] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  const submit = () => {
    const word = en.trim()
    if (!word) {
      setError('请先输入英文单词')
      return
    }
    if (existing.some((x) => x.toLowerCase() === word.toLowerCase())) {
      setError('这一课已经加过这个单词啦')
      return
    }
    const guessed = zh.trim() || lookupZh(wordBase(word)) || ''
    const ok = onSubmit({ en: word, zh: guessed, emoji: emoji.trim() || '📝' })
    if (!ok) {
      setError('录入失败，请再试一次')
      return
    }
    setEn('')
    setZh('')
    setEmoji('')
    setError('')
    onCancel()
  }

  return (
    <div className="ext-entry-mask" onClick={onCancel}>
      <div className="ext-entry" onClick={(e) => e.stopPropagation()}>
        <h3 className="ext-entry-title">➕ 加一个拓展词</h3>
        <label className="ext-entry-field">
          <span>English *</span>
          <input
            type="text"
            value={en}
            autoFocus
            placeholder="例如 broccoli"
            onChange={(e) => { setEn(e.target.value); setError('') }}
          />
        </label>
        <label className="ext-entry-field">
          <span>中文（选填）</span>
          <input
            type="text"
            value={zh}
            placeholder="留空自动查词典"
            onChange={(e) => setZh(e.target.value)}
          />
        </label>
        <label className="ext-entry-field">
          <span>Emoji（选填）</span>
          <input
            type="text"
            value={emoji}
            placeholder="🥦"
            maxLength={4}
            onChange={(e) => setEmoji(e.target.value)}
          />
        </label>
        {error && <p className="ext-entry-error">{error}</p>}
        <div className="ext-entry-actions">
          <button type="button" className="btn btn-soft" onClick={onCancel}>取消</button>
          <button type="button" className="btn" onClick={submit}>保存</button>
        </div>
      </div>
    </div>
  )
}
