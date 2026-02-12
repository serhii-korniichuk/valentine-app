import localStyles from './FinalScreen.module.scss'
import screenStyles from './shared/ScreenCard.module.scss'

type FinalScreenProps = {
  hearts: string[]
  onReward: () => void
  rewardOpened: boolean
}

const FinalScreen = ({ hearts, onReward, rewardOpened }: FinalScreenProps) => {
  return (
    <section className={`${screenStyles.screenCard} ${localStyles.finalCard}`}>
      <p className={screenStyles.badge}>Фінал</p>
      <h2 className={screenStyles.heading}>Ти відкрила всі 10 сердець ❤</h2>
      <p className={screenStyles.leadText}>
        Дякую, що ти є в моєму житті. Ти робиш мої дні теплішими, а мене кращим. Я дуже тебе кохаю.
      </p>

      <div className={localStyles.heartCollection}>
        {hearts.map((heart) => (
          <span key={heart} className={localStyles.heartChip}>
            {heart}
          </span>
        ))}
      </div>

      <button className={screenStyles.primaryButton} type="button" onClick={onReward}>
        Відкрити подарунок
      </button>

      {rewardOpened && (
        <div className={localStyles.rewardBox}>
          <p>Нагорода: купон на ідеальне побачення + 1000 обіймів без обмежень.</p>
          <p>Промокод: LOVE-FOREVER</p>
        </div>
      )}
    </section>
  )
}

export default FinalScreen
