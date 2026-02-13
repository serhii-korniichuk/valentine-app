import { useState } from 'react'
import type { FormEvent } from 'react'
import type { DateStage as DateStageConfig } from '../../types/quiz'
import Button from '../shared/Button'
import stageStyles from './StageCommon.module.scss'

type DateStageProps = {
  stage: DateStageConfig
  onComplete: () => void
  onTap: () => void
}

const normalizeValue = (value: string, mode: DateStageConfig['rules']['normalize']) => {
  if (mode === 'trim_lower') {
    return value.trim().toLowerCase()
  }

  return value
}

const DateStage = ({ stage, onComplete, onTap }: DateStageProps) => {
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onTap()

    const normalizedInput = normalizeValue(value, stage.rules.normalize)
    const canPass = stage.rules.acceptedAnswers.some((answer) => {
      return normalizeValue(answer, stage.rules.normalize) === normalizedInput
    })

    if (canPass) {
      setFeedback('')
      onComplete()
      return
    }

    setFeedback(stage.rules.incorrectMessage)
  }

  return (
    <form className={stageStyles.stageBody} onSubmit={submit}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.helperText}>{stage.hint}</p>
      <input
        className={stageStyles.dateInput}
        placeholder={stage.placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button variant="primary" type="submit">
        {stage.submitButtonLabel}
      </Button>
      {feedback && <p className={stageStyles.helperText}>{feedback}</p>}
    </form>
  )
}

export default DateStage
