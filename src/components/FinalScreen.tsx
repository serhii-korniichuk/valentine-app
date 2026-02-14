import localStyles from './FinalScreen.module.scss'
import ScreenCard from './shared/ScreenCard'
import screenStyles from './shared/ScreenCard.module.scss'
import Button from './shared/Button'
import { heartSymbols } from '../config/heartSymbols'

type FinalScreenProps = {
  badge: string
  title: string
  message: string
  rewardButtonLabel: string
  rewardLine1: string
  rewardLine2: string
  onReward: () => void
  rewardOpened: boolean
}

const FinalScreen = ({
  badge,
  title,
  message,
  rewardButtonLabel,
  rewardLine1,
  rewardLine2,
  onReward,
  rewardOpened,
}: FinalScreenProps) => {
  const titleWithHeart = `${title} ${rewardOpened ? heartSymbols.special : heartSymbols.primary}`

  return (
    <ScreenCard className={localStyles.finalCard}>
      <p className={screenStyles.badge}>{badge}</p>
      <h2 className={screenStyles.heading}>{titleWithHeart}</h2>
      <p className={screenStyles.leadText}>{message}</p>

      {!rewardOpened && (
        <Button variant="primary" type="button" onClick={onReward}>
          {rewardButtonLabel}
        </Button>
      )}

      {rewardOpened && (
        <div className={localStyles.rewardBox}>
          <p>{rewardLine1}</p>
          <p>{rewardLine2}</p>
        </div>
      )}
    </ScreenCard>
  )
}

export default FinalScreen
