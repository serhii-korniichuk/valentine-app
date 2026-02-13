import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import classNames from 'classnames'
import type { RhythmStage as RhythmStageConfig } from '../../types/quiz'
import Button from '../shared/Button'
import stageStyles from './StageCommon.module.scss'

type RhythmStageProps = {
  stage: RhythmStageConfig
  onComplete: () => void
  onTap: () => void
}

const RhythmStage = ({ stage, onComplete, onTap }: RhythmStageProps) => {
  const [hits, setHits] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [message, setMessage] = useState(stage.rules.idleMessage)
  const [isBeatNow, setIsBeatNow] = useState(false)
  const [phasePercent, setPhasePercent] = useState(0)
  const startAtRef = useRef<number>(performance.now())
  const frameRef = useRef<number | null>(null)

  const timingStyle = useMemo(
    () => ({ '--rhythm-duration': `${stage.rules.tempoMs}ms` }) as CSSProperties,
    [stage.rules.tempoMs],
  )

  useEffect(() => {
    const tick = () => {
      const elapsed = performance.now() - startAtRef.current
      const phaseMs = elapsed % stage.rules.tempoMs
      const distanceMs = Math.min(phaseMs, stage.rules.tempoMs - phaseMs)
      setIsBeatNow(distanceMs <= stage.rules.hitWindowMs)
      setPhasePercent((phaseMs / stage.rules.tempoMs) * 100)
      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [stage.rules.hitWindowMs, stage.rules.tempoMs])

  const handleTap = () => {
    if (isCompleted) {
      return
    }

    onTap()
    const elapsed = performance.now() - startAtRef.current
    const phaseMs = elapsed % stage.rules.tempoMs
    const distanceMs = Math.min(phaseMs, stage.rules.tempoMs - phaseMs)

    if (distanceMs > stage.rules.hitWindowMs) {
      setMessage(stage.rules.failMessage)
      return
    }

    setHits((prev) => {
      const next = prev + 1
      if (next >= stage.rules.targetTaps) {
        setIsCompleted(true)
        setMessage(stage.rules.successMessage)
      } else {
        setMessage(stage.rules.hitMessage)
      }

      return next
    })
  }

  const retry = () => {
    onTap()
    setHits(0)
    setIsCompleted(false)
    setMessage(stage.rules.idleMessage)
    startAtRef.current = performance.now()
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.helperText}>
        {stage.rules.counterLabel}: {hits}/{stage.rules.targetTaps}
      </p>

      <div className={stageStyles.rhythmTimingRow}>
        <span
          className={classNames(stageStyles.rhythmTimingBadge, {
            [stageStyles.rhythmTimingBadgeReady]: isBeatNow,
          })}
        >
          {isBeatNow ? stage.rules.readyLabel : stage.rules.waitingLabel}
        </span>
        <div className={stageStyles.rhythmTimingTrack} aria-hidden>
          <span className={stageStyles.rhythmTimingMarker} style={{ left: `${phasePercent}%` }} />
        </div>
      </div>

      <div className={stageStyles.rhythmPulseWrap} style={timingStyle} aria-hidden>
        <span className={stageStyles.rhythmPulseCore} />
      </div>

      <Button variant="primary" type="button" onClick={handleTap} disabled={isCompleted}>
        {stage.rules.actionButtonLabel}
      </Button>

      <p className={stageStyles.helperText}>{message}</p>

      {isCompleted && (
        <div className={stageStyles.catchActions}>
          <Button variant="outline" type="button" onClick={retry}>
            {stage.rules.retryButtonLabel}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => {
              onTap()
              onComplete()
            }}
          >
            {stage.rules.continueButtonLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

export default RhythmStage
