import { useRef, useState } from 'react'
import type { HoldStage as HoldStageConfig } from '../../types/quiz'
import stageStyles from './StageCommon.module.scss'

type HoldStageProps = {
  stage: HoldStageConfig
  onComplete: () => void
  onTap: () => void
}

const HoldStage = ({ stage, onComplete, onTap }: HoldStageProps) => {
  const [progress, setProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [hint, setHint] = useState(stage.rules.idleHint)

  const rafRef = useRef<number | null>(null)
  const startAtRef = useRef<number | null>(null)

  const stopRaf = () => {
    if (rafRef.current === null) {
      return
    }

    window.cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  const finishStage = () => {
    setIsCompleted(true)
    setIsHolding(false)
    setProgress(100)
    setHint(stage.rules.successMessage)
    stopRaf()
    onComplete()
  }

  const tick = (timestamp: number) => {
    if (startAtRef.current === null) {
      startAtRef.current = timestamp
    }

    const elapsed = timestamp - startAtRef.current
    const nextProgress = Math.min(100, (elapsed / stage.rules.holdDurationMs) * 100)
    setProgress(nextProgress)

    if (nextProgress >= 100) {
      finishStage()
      return
    }

    rafRef.current = window.requestAnimationFrame(tick)
  }

  const handlePointerDown = () => {
    if (isCompleted || isHolding) {
      return
    }

    onTap()
    setIsHolding(true)
    setHint(stage.rules.idleHint)
    startAtRef.current = null
    stopRaf()
    rafRef.current = window.requestAnimationFrame(tick)
  }

  const handlePointerUp = () => {
    if (isCompleted || !isHolding) {
      return
    }

    setIsHolding(false)
    stopRaf()
    startAtRef.current = null
    setProgress(0)
    setHint(stage.rules.resetHint)
  }

  const buttonLabel = isCompleted
    ? stage.rules.buttonSuccessLabel
    : isHolding
      ? stage.rules.buttonHoldingLabel
      : stage.rules.buttonIdleLabel

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>

      <div className={stageStyles.holdProgressWrap}>
        <p className={stageStyles.helperText}>
          {stage.rules.progressLabel}: {Math.round(progress)}%
        </p>
        <div className={stageStyles.holdProgressTrack} aria-hidden>
          <span className={stageStyles.holdProgressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button
        className={stageStyles.holdButton}
        type="button"
        disabled={isCompleted}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {buttonLabel}
      </button>

      <p className={stageStyles.helperText}>{hint}</p>
    </div>
  )
}

export default HoldStage
