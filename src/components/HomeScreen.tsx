import homeStyles from './HomeScreen.module.scss'
import ScreenCard from './shared/ScreenCard'
import screenStyles from './shared/ScreenCard.module.scss'
import Button from './shared/Button'

type HomeScreenProps = {
  badge: string
  title: string
  subtitle: string
  startButtonLabel: string
  startButtonPulse: boolean
  onStart: () => void
}

const HomeScreen = ({ badge, title, subtitle, startButtonLabel, startButtonPulse, onStart }: HomeScreenProps) => {
  return (
    <ScreenCard className={homeStyles.homeScreen}>
      <p className={screenStyles.badge}>{badge}</p>
      <h1 className={screenStyles.heading}>{title}</h1>
      <p className={screenStyles.leadText}>{subtitle}</p>
      <Button variant="primary" pulse={startButtonPulse} type="button" onClick={onStart}>
        {startButtonLabel}
      </Button>
    </ScreenCard>
  )
}

export default HomeScreen
