import { useDictionary } from '../dictionary'
import screenStyles from './shared/ScreenCard.module.scss'
import ScreenCard from './shared/ScreenCard'

type HomeScreenProps = {
  onStart: () => void
}

const HomeScreen = ({ onStart }: HomeScreenProps) => {
  const { messages } = useDictionary()

  return (
    <ScreenCard>
      <p className={screenStyles.badge}>{messages.home.badge}</p>
      <h1 className={screenStyles.heading}>{messages.home.title}</h1>
      <p className={screenStyles.leadText}>{messages.home.subtitle}</p>
      <button className={screenStyles.primaryButton} type="button" onClick={onStart}>
        {messages.home.startButton}
      </button>
    </ScreenCard>
  )
}

export default HomeScreen
