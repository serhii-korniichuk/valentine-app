const hearts = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${Math.round((index / 14) * 100)}%`,
  delay: `${(index % 7) * 0.7}s`,
  duration: `${7 + (index % 5)}s`,
}))

const BackgroundHearts = () => {
  return (
    <div className="background-hearts" aria-hidden>
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="background-heart"
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  )
}

export default BackgroundHearts
