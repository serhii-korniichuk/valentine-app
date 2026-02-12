interface HomeScreenProps {
  onStart: () => void
}

function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <section className="screen-card">
      <p className="badge">Valentine quiz</p>
      <h1>Для найкоханішої</h1>
      <p className="lead-text">10 маленьких кроків до великого сюрпризу, який я зробив тільки для тебе.</p>
      <button className="primary-btn" type="button" onClick={onStart}>
        Почати нашу історію
      </button>
    </section>
  )
}

export default HomeScreen
