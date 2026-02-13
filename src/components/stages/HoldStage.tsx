import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { PointerEvent, TouchEvent } from 'react'
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
  const [hint, setHint] = useState(stage.rules.idleHint ?? '')

  const rafRef = useRef<number | null>(null)
  const startAtRef = useRef<number | null>(null)
  const activePointerIdRef = useRef<number | null>(null)

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

  const startHold = () => {
    if (isCompleted || isHolding) {
      return
    }

    onTap()
    setIsHolding(true)
    setHint(stage.rules.idleHint ?? '')
    startAtRef.current = null
    stopRaf()
    rafRef.current = window.requestAnimationFrame(tick)
  }

  const stopHold = () => {
    if (isCompleted || !isHolding) {
      return
    }

    setIsHolding(false)
    stopRaf()
    startAtRef.current = null
    setProgress(0)
    setHint(stage.rules.resetHint)
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    activePointerIdRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    startHold()
  }

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (
      activePointerIdRef.current !== null &&
      event.currentTarget.hasPointerCapture(activePointerIdRef.current)
    ) {
      event.currentTarget.releasePointerCapture(activePointerIdRef.current)
    }

    activePointerIdRef.current = null
    stopHold()
  }

  const handlePointerCancel = () => {
    activePointerIdRef.current = null
    stopHold()
  }

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    event.preventDefault()
    startHold()
  }

  const handleTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    event.preventDefault()
    stopHold()
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
          <span
            className={stageStyles.holdProgressFill}
            style={{ '--hold-progress': `${progress / 100}` } as CSSProperties}
          />
        </div>
      </div>

      <button
        className={stageStyles.holdButton}
        type="button"
        disabled={isCompleted}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {buttonLabel}
      </button>

      {hint && <p className={stageStyles.helperText}>{hint}</p>}
    </div>
  )
}

export default HoldStage
