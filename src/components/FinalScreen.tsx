import { useDictionary } from '../dictionary'
import localStyles from './FinalScreen.module.scss'
import screenStyles from './shared/ScreenCard.module.scss'
import ScreenCard from './shared/ScreenCard'

type FinalScreenProps = {
  hearts: string[]
  onReward: () => void
  rewardOpened: boolean
}

const FinalScreen = ({ hearts, onReward, rewardOpened }: FinalScreenProps) => {
  const { messages } = useDictionary()

  return (
    <ScreenCard className={localStyles.finalCard}>
      <p className={screenStyles.badge}>{messages.final.badge}</p>
      <h2 className={screenStyles.heading}>{messages.final.title}</h2>
      <p className={screenStyles.leadText}>{messages.final.message}</p>

      <div className={localStyles.heartCollection}>
        {hearts.map((heart) => (
          <span key={heart} className={localStyles.heartChip}>
            {heart}
          </span>
        ))}
      </div>

      <button className={screenStyles.primaryButton} type="button" onClick={onReward}>
        {messages.final.rewardButton}
      </button>

      {rewardOpened && (
        <div className={localStyles.rewardBox}>
          <p>{messages.final.rewardLine1}</p>
          <p>{messages.final.rewardLine2}</p>
        </div>
      )}
    </ScreenCard>
  )
}

export default FinalScreen
