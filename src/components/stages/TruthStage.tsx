import { useState } from 'react'
import classNames from 'classnames'
import type { TruthStage as TruthStageConfig } from '../../types/quiz'
import stageStyles from './StageCommon.module.scss'

type TruthStageProps = {
  stage: TruthStageConfig
  onComplete: () => void
  onTap: () => void
}

const TruthStage = ({ stage, onComplete, onTap }: TruthStageProps) => {
  const [selected, setSelected] = useState<'truth' | 'false' | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleAnswer = (answer: 'truth' | 'false') => {
    setSelected(answer)
    onTap()

    if (stage.rules.type === 'any') {
      window.setTimeout(() => {
        onComplete()
      }, 280)
      return
    }

    if (answer === stage.rules.correctAnswer) {
      setFeedback('')
      window.setTimeout(() => {
        onComplete()
      }, 280)
      return
    }

    setFeedback(stage.rules.incorrectMessage)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.truthStatement}>{stage.statement}</p>
      <div className={classNames(stageStyles.answerGrid, stageStyles.answerGridTwo)}>
        <button
          className={classNames(stageStyles.answerButton, {
            [stageStyles.answerButtonSelected]: selected === 'truth',
          })}
          type="button"
          onClick={() => handleAnswer('truth')}
        >
          {stage.trueButtonLabel}
        </button>
        <button
          className={classNames(stageStyles.answerButton, {
            [stageStyles.answerButtonSelected]: selected === 'false',
          })}
          type="button"
          onClick={() => handleAnswer('false')}
        >
          {stage.falseButtonLabel}
        </button>
      </div>
      {feedback && <p className={stageStyles.helperText}>{feedback}</p>}
    </div>
  )
}

export default TruthStage
