import { useEffect, useState } from 'react'
import { useDictionary } from '../../dictionary'
import screenStyles from '../shared/ScreenCard.module.scss'
import stageStyles from './StageCommon.module.scss'

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
  const { messages } = useDictionary()
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
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{prompt}</p>
      <p className={stageStyles.helperText}>
        {messages.stageUi.catch.caughtLabel}: {score}/{target} • {messages.stageUi.catch.timeLabel}: {seconds}
        {messages.stageUi.catch.secondsSuffix}
      </p>
      <div className={stageStyles.catchArea}>
        <button
          aria-label={messages.stageUi.catch.heartAriaLabel}
          className={stageStyles.catchHeart}
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          type="button"
          onClick={clickHeart}
        >
          ❤
        </button>
      </div>
      {canFinish && (
        <button className={screenStyles.primaryButton} type="button" onClick={onComplete}>
          {messages.stageUi.catch.continueButton}
        </button>
      )}
    </div>
  )
}

export default CatchStage
