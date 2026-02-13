import { useEffect, useState } from 'react'
import type { CatchStage as CatchStageConfig } from '../../types/quiz'
import screenStyles from '../shared/ScreenCard.module.scss'
import stageStyles from './StageCommon.module.scss'

type CatchStageProps = {
  stage: CatchStageConfig
  onComplete: () => void
  onTap: () => void
}

const nextPosition = () => {
  return {
    x: 10 + Math.round(Math.random() * 78),
    y: 12 + Math.round(Math.random() * 72),
  }
}

const CatchStage = ({ stage, onComplete, onTap }: CatchStageProps) => {
  const [score, setScore] = useState(0)
  const [seconds, setSeconds] = useState(stage.rules.durationSec)
  const [deadlineAt, setDeadlineAt] = useState(() => Date.now() + stage.rules.durationSec * 1000)
  const [position, setPosition] = useState(nextPosition)

  useEffect(() => {
    if (score >= stage.rules.target) {
      onComplete()
    }
  }, [onComplete, score, stage.rules.target])

  useEffect(() => {
    if (score >= stage.rules.target) {
      return
    }

    const interval = window.setInterval(() => {
      const nextSeconds = Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000))
      setSeconds((prev) => (prev === nextSeconds ? prev : nextSeconds))

      if (nextSeconds <= 0) {
        window.clearInterval(interval)
      }
    }, 100)

    return () => window.clearInterval(interval)
  }, [deadlineAt, score, stage.rules.target])

  const clickHeart = () => {
    if (seconds <= 0) {
      return
    }

    onTap()
    setScore((prev) => prev + 1)
    setPosition(nextPosition())
  }

  const canRetry = seconds === 0 && score < stage.rules.target && stage.rules.allowRetryAfterTimeout

  const retryRound = () => {
    setScore(0)
    setSeconds(stage.rules.durationSec)
    setPosition(nextPosition())
    setDeadlineAt(Date.now() + stage.rules.durationSec * 1000)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.helperText}>
        {stage.scoreLabel}: {score}/{stage.rules.target} • {stage.timeLabel}: {seconds}
        {stage.secondsSuffix}
      </p>
      <div className={stageStyles.catchArea}>
        <button
          aria-label={stage.heartAriaLabel}
          className={stageStyles.catchHeart}
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
          type="button"
          onClick={clickHeart}
        >
          ❤
        </button>
      </div>
      {canRetry && <p className={stageStyles.helperText}>{stage.rules.timeoutPraiseText}</p>}
      {canRetry && (
        <button className={screenStyles.primaryButton} type="button" onClick={retryRound}>
          {stage.rules.retryButtonLabel}
        </button>
      )}
    </div>
  )
}

export default CatchStage
