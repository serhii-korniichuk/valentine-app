import { useState } from 'react'
import classNames from 'classnames'
import type { ChoiceStage as ChoiceStageConfig } from '../../types/quiz'
import stageStyles from './StageCommon.module.scss'

type ChoiceStageProps = {
  stage: ChoiceStageConfig
  onSelect: () => void
  onTap: () => void
}

const ChoiceStage = ({ stage, onSelect, onTap }: ChoiceStageProps) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [wrongSelection, setWrongSelection] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleClick = (optionId: string) => {
    setSelected(optionId)
    setWrongSelection(null)
    onTap()

    if (stage.rules.type === 'any') {
      window.setTimeout(() => {
        onSelect()
      }, 280)
      return
    }

    if (optionId === stage.rules.correctOptionId) {
      setFeedback('')
      window.setTimeout(() => {
        onSelect()
      }, 280)
      return
    }

    setWrongSelection(optionId)
    window.setTimeout(() => {
      setWrongSelection((prev) => (prev === optionId ? null : prev))
    }, 380)
    setFeedback(stage.rules.incorrectMessage)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <div className={stageStyles.answerGrid}>
        {stage.options.map((option) => (
          <button
            key={option.id}
            className={classNames(stageStyles.answerButton, {
              [stageStyles.answerButtonSelected]: selected === option.id,
              [stageStyles.answerButtonWrong]: wrongSelection === option.id,
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

export default ChoiceStage
