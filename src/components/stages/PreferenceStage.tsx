import { useState } from 'react'
import classNames from 'classnames'
import type { PreferenceStage as PreferenceStageConfig } from '../../types/quiz'
import stageStyles from './StageCommon.module.scss'

type PreferenceStageProps = {
  stage: PreferenceStageConfig
  onSelect: () => void
  onTap: () => void
}

const PreferenceStage = ({ stage, onSelect, onTap }: PreferenceStageProps) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleClick = (optionId: string) => {
    setSelected(optionId)
    onTap()

    if (stage.rules.type === 'any') {
      window.setTimeout(() => onSelect(), 280)
      return
    }

    if (optionId === stage.rules.correctOptionId) {
      setFeedback('')
      window.setTimeout(() => onSelect(), 280)
      return
    }

    setFeedback(stage.rules.incorrectMessage)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.helperText}>{stage.helper}</p>
      <div className={stageStyles.answerGrid}>
        {stage.options.map((option) => (
          <button
            key={option.id}
            className={classNames(stageStyles.answerButton, {
              [stageStyles.answerButtonSelected]: selected === option.id,
            })}
            type="button"
            onClick={() => handleClick(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {feedback && <p className={stageStyles.helperText}>{feedback}</p>}
    </div>
  )
}

export default PreferenceStage
