interface FinalScreenProps {
  hearts: string[]
  onReward: () => void
  rewardOpened: boolean
}

function FinalScreen({ hearts, onReward, rewardOpened }: FinalScreenProps) {
  return (
    <section className="screen-card final-card">
      <p className="badge">Фінал</p>
      <h2>Ти відкрила всі 10 сердець ❤</h2>
      <p className="lead-text">
        Дякую, що ти є в моєму житті. Ти робиш мої дні теплішими, а мене кращим. Я дуже тебе кохаю.
      </p>

      <div className="heart-collection">
        {hearts.map((heart) => (
          <span key={heart} className="heart-chip">
            {heart}
          </span>
        ))}
      </div>

      <button className="primary-btn" type="button" onClick={onReward}>
        Відкрити подарунок
      </button>

      {rewardOpened && (
        <div className="reward-box">
          <p>Нагорода: купон на ідеальне побачення + 1000 обіймів без обмежень.</p>
          <p>Промокод: LOVE-FOREVER</p>
        </div>
      )}
    </section>
  )
}

export default FinalScreen
