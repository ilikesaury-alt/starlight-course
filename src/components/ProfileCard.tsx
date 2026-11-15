// 孩子档案卡：昵称 + 头像。
//
// 放在「学习进度」页顶部 —— 那一页已经是「我的成长记录」，档案放这里最自然，
// 也不会在孩子的学习路径上多出一道要填的表。
//
// 交互取舍：
// - **不做首启强制引导**。孩子点开应用想学英语，先拦一个「请输入昵称」是纯阻碍。
//   未设置时这里显示「给自己起个名字吧」，愿意填就填，不填照常学。
// - 编辑是就地展开，不跳页；保存后立刻收起并回显。
// - 昵称截断到 12 字（store 里也截），头像从 12 个 emoji 里挑。

import { useState } from 'react'
import { PROFILE_AVATARS, useCourseStore } from '@/store/useCourseStore'

export default function ProfileCard() {
  const profile = useCourseStore((s) => s.profile)
  const updateProfile = useCourseStore((s) => s.updateProfile)

  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(profile.name)
  const [draftAvatar, setDraftAvatar] = useState(profile.avatar)

  const open = () => {
    setDraftName(profile.name)
    setDraftAvatar(profile.avatar)
    setEditing(true)
  }

  const save = () => {
    updateProfile({ name: draftName, avatar: draftAvatar })
    setEditing(false)
  }

  const named = profile.name.trim().length > 0

  return (
    <div className="profile-card">
      <div className="pc-avatar" aria-hidden="true">
        {profile.avatar}
      </div>

      <div className="pc-body">
        {!editing ? (
          <>
            <div className="pc-name">
              {named ? profile.name : <span className="pc-unnamed">给自己起个名字吧</span>}
            </div>
            <div className="pc-sub">{named ? '学习档案' : '填了以后，成绩单上就是你的名字'}</div>
          </>
        ) : (
          <div className="pc-edit">
            <label className="pc-label" htmlFor="pc-name-input">
              昵称
            </label>
            <input
              id="pc-name-input"
              className="pc-input"
              value={draftName}
              maxLength={12}
              placeholder="比如：小明"
              onChange={(e) => setDraftName(e.target.value)}
              // 回车即保存：孩子/家长都不想为了存一个名字去点按钮
              onKeyDown={(e) => {
                if (e.key === 'Enter') save()
                if (e.key === 'Escape') setEditing(false)
              }}
            />
            <div className="pc-label pc-label--avatars">选个头像</div>
            <div className="pc-avatars" role="radiogroup" aria-label="选择头像">
              {PROFILE_AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={draftAvatar === a}
                  className={'pc-avatar-opt' + (draftAvatar === a ? ' is-on' : '')}
                  onClick={() => setDraftAvatar(a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="pc-actions">
              <button type="button" className="btn btn--sm" onClick={save}>
                保存
              </button>
              <button
                type="button"
                className="btn btn--sm btn--soft"
                onClick={() => setEditing(false)}
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>

      {!editing && (
        <button type="button" className="pc-edit-btn" onClick={open}>
          {named ? '改' : '设置'}
        </button>
      )}
    </div>
  )
}
