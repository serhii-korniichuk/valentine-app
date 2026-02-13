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
  const [wrongSelection, setWrongSelection] = useState<'truth' | 'false' | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleAnswer = (answer: 'truth' | 'false') => {
    setSelected(answer)
    setWrongSelection(null)
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

    setWrongSelection(answer)
    window.setTimeout(() => {
      setWrongSelection((prev) => (prev === answer ? null : prev))
    }, 380)
    setFeedback(stage.rules.incorrectMessage)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <div className={stageStyles.truthStatementBox}>
        <p className={stageStyles.truthStatement}>{stage.statement}</p>
      </div>
      <div className={classNames(stageStyles.answerGrid, stageStyles.answerGridTwo)}>
        <button
          className={classNames(stageStyles.answerButton, {
            [stageStyles.answerButtonSelected]: selected === 'truth',
            [stageStyles.answerButtonWrong]: wrongSelection === 'truth',
          })}
          type="button"
          onClick={() => handleAnswer('truth')}
        >
          {stage.trueButtonLabel}
        </button>
        <button
          className={classNames(stageStyles.answerButton, {
            [stageStyles.answerButtonSelected]: selected === 'false',
            [stageStyles.answerButtonWrong]: wrongSelection === 'false',
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
