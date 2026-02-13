import screenStyles from './shared/ScreenCard.module.scss'
import ScreenCard from './shared/ScreenCard'

type HomeScreenProps = {
  badge: string
  title: string
  subtitle: string
  startButtonLabel: string
  onStart: () => void
}

const HomeScreen = ({ badge, title, subtitle, startButtonLabel, onStart }: HomeScreenProps) => {
  return (
    <ScreenCard>
      <p className={screenStyles.badge}>{badge}</p>
      <h1 className={screenStyles.heading}>{title}</h1>
      <p className={screenStyles.leadText}>{subtitle}</p>
      <button className={screenStyles.primaryButton} type="button" onClick={onStart}>
        {startButtonLabel}
      </button>
    </ScreenCard>
  )
}

export default HomeScreen
