import { useEffect, useState } from 'react'

type CatchStageProps = {
  prompt: string
  target: number
  onComplete: () => void
  onTap: () => void
}

const nextPosition = () => {
  return {
    x: 10 + Math.round(Math.random() * 78),
    y: 12 + Math.round(Math.random() * 72),
  }
}

const CatchStage = ({ prompt, target, onComplete, onTap }: CatchStageProps) => {
  const [score, setScore] = useState(0)
  const [seconds, setSeconds] = useState(10)
  const [position, setPosition] = useState(nextPosition)

  useEffect(() => {
    if (score >= target) {
      onComplete()
    }
  }, [onComplete, score, target])

  useEffect(() => {
    if (seconds <= 0 || score >= target) {
      return
    }

    const timeout = window.setTimeout(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => window.clearTimeout(timeout)
  }, [score, seconds, target])

  const clickHeart = () => {
    onTap()
    setScore((prev) => prev + 1)
    setPosition(nextPosition())
  }

  const canFinish = seconds === 0 && score < target

  return (
    <div className="stage-body">
      <p className="stage-prompt">{prompt}</p>
      <p className="helper-text">
        Спіймано: {score}/{target} • Час: {seconds}с
      </p>
      <div className="catch-area">
        <button
          aria-label="Спіймати сердечко"
          className="catch-heart"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          type="button"
          onClick={clickHeart}
        >
          ❤
        </button>
      </div>
      {canFinish && (
        <button className="primary-btn" type="button" onClick={onComplete}>
          Далі (ти все одно перемогла)
        </button>
      )}
    </div>
  )
}

export default CatchStage
