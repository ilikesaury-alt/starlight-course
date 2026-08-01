import StoryPage from '@/pages/StoryPage'
import { rocketGirlStories, getStory, RG_THEME } from '@/data/rocketgirl'

export default function RocketGirlStory() {
  return (
    <StoryPage
      moduleId="rocketgirl"
      theme={RG_THEME}
      stories={rocketGirlStories}
      getStory={getStory}
      basePath="/rocketgirl"
      label="Rocket Girl"
      moduleEmoji="🚀"
    />
  )
}
