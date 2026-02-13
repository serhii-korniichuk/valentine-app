import { useEffect, useRef, useState } from 'react'
import type { ReactionStage as ReactionStageConfig } from '../../types/quiz'
import Button from '../shared/Button'
import stageStyles from './StageCommon.module.scss'

type ReactionStageProps = {
  stage: ReactionStageConfig
  onComplete: () => void
  onTap: () => void
}

const resolveMarkerPosition = (elapsedMs: number, cycleDurationMs: number) => {
  const phase = (elapsedMs % cycleDurationMs) / cycleDurationMs

  if (phase <= 0.5) {
    return phase * 200
  }

  return (1 - phase) * 200
}

const ReactionStage = ({ stage, onComplete, onTap }: ReactionStageProps) => {
  const [markerPosition, setMarkerPosition] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [message, setMessage] = useState(stage.rules.idleMessage)

  const startAtRef = useRef(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    startAtRef.current = performance.now()

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startAtRef.current
      const next = resolveMarkerPosition(elapsed, stage.rules.cycleDurationMs)
      setMarkerPosition(next)
      frameRef.current = window.requestAnimationFrame(animate)
    }

    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [stage.rules.cycleDurationMs])

  const handleTry = () => {
    if (isCompleted) {
      return
    }

    onTap()
    const elapsedNow = performance.now() - startAtRef.current
    const markerNow = resolveMarkerPosition(elapsedNow, stage.rules.cycleDurationMs)
    const isInSweetSpot =
      markerNow >= stage.rules.sweetSpotStart && markerNow <= stage.rules.sweetSpotEnd

    if (!isInSweetSpot) {
      setMessage(stage.rules.failMessage)
      return
    }

    setIsCompleted(true)
    setMessage(stage.rules.successMessage)

    window.setTimeout(() => {
      onComplete()
    }, stage.rules.successDelayMs)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>

      <div className={stageStyles.reactionWrap}>
        <p className={stageStyles.helperText}>{stage.rules.meterLabel}</p>
        <div className={stageStyles.reactionTrack} aria-hidden>
          <span
            className={stageStyles.reactionSweetSpot}
            style={{
              left: `${stage.rules.sweetSpotStart}%`,
              width: `${stage.rules.sweetSpotEnd - stage.rules.sweetSpotStart}%`,
            }}
          />
          <span className={stageStyles.reactionMarker} style={{ left: `${markerPosition}%` }} />
        </div>
      </div>

      <Button variant="primary" type="button" onPointerDown={handleTry} disabled={isCompleted}>
        {stage.rules.actionButtonLabel}
      </Button>

      <p className={stageStyles.helperText}>{message}</p>
    </div>
  )
}

export default ReactionStage
