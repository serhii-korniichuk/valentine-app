import screenStyles from './shared/ScreenCard.module.scss'

type HomeScreenProps = {
  onStart: () => void
}

const HomeScreen = ({ onStart }: HomeScreenProps) => {
  return (
    <section className={screenStyles.screenCard}>
      <p className={screenStyles.badge}>Valentine quiz</p>
      <h1 className={screenStyles.heading}>Для найкоханішої</h1>
      <p className={screenStyles.leadText}>
        10 маленьких кроків до великого сюрпризу, який я зробив тільки для тебе.
      </p>
      <button className={screenStyles.primaryButton} type="button" onClick={onStart}>
        Почати нашу історію
      </button>
    </section>
  )
}

export default HomeScreen
