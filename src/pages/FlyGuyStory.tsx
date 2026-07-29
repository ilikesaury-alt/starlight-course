import StoryPage from '@/pages/StoryPage'
import { flyGuyStories, getStory, FG_THEME } from '@/data/flyguy'

export default function FlyGuyStory() {
  return (
    <StoryPage
      moduleId="flyguy"
      theme={FG_THEME}
      stories={flyGuyStories}
      getStory={getStory}
      basePath="/flyguy"
      label="Fly Guy"
      moduleEmoji="🐝"
      navLayout="flyguy"
    />
  )
}
