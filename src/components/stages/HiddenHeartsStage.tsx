import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { heartSymbols } from '../../config/heartSymbols'
import type { HiddenStage as HiddenStageConfig } from '../../types/quiz'
import Button from '../shared/Button'
import stageStyles from './StageCommon.module.scss'

type HiddenHeartsStageProps = {
  stage: HiddenStageConfig
  onComplete: () => void
  onTap: () => void
}

type HiddenHeart = {
  id: string
  x: number
  y: number
  size: number
}

const createHearts = (count: number): HiddenHeart[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `hidden-heart-${index}`,
    x: 8 + Math.random() * 84,
    y: 10 + Math.random() * 76,
    size: 0.95 + Math.random() * 0.35,
  }))
}

const HiddenHeartsStage = ({ stage, onComplete, onTap }: HiddenHeartsStageProps) => {
  const [hearts, setHearts] = useState<HiddenHeart[]>(() => createHearts(stage.rules.target))
  const [foundIds, setFoundIds] = useState<string[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  const foundCount = foundIds.length

  const handleFound = (heartId: string) => {
    if (isCompleted || foundIds.includes(heartId)) {
      return
    }

    onTap()
    setFoundIds((prev) => {
      const next = [...prev, heartId]
      if (next.length >= stage.rules.target) {
        setIsCompleted(true)
      }
      return next
    })
  }

  const restart = () => {
    onTap()
    setHearts(createHearts(stage.rules.target))
    setFoundIds([])
    setIsCompleted(false)
  }

  const message = isCompleted ? stage.rules.successMessage : stage.rules.searchHint

  const renderedHearts = useMemo(() => hearts, [hearts])

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.helperText}>
        {stage.rules.foundLabel}: {foundCount}/{stage.rules.target}
      </p>

      <div className={stageStyles.hiddenArea}>
        {renderedHearts.map((heart) => {
          const isFound = foundIds.includes(heart.id)

          return (
            <button
              key={heart.id}
              className={classNames(stageStyles.hiddenHeart, {
                [stageStyles.hiddenHeartFound]: isFound,
              })}
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                fontSize: `${heart.size}rem`,
              }}
              type="button"
              onClick={() => handleFound(heart.id)}
              disabled={isFound}
              aria-label="Знайти сердечко"
            >
              {heartSymbols.primary}
            </button>
          )
        })}
      </div>

      <p className={stageStyles.helperText}>{message}</p>

      {isCompleted && (
        <div className={stageStyles.catchActions}>
          <Button variant="outline" type="button" onClick={restart}>
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

export default HiddenHeartsStage
