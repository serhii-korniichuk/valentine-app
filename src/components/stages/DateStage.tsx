import { useState } from 'react'
import type { FormEvent } from 'react'
import { useDictionary } from '../../dictionary'
import screenStyles from '../shared/ScreenCard.module.scss'
import stageStyles from './StageCommon.module.scss'

type DateStageProps = {
  prompt: string
  hint: string
  onComplete: () => void
  onTap: () => void
}

const DateStage = ({ prompt, hint, onComplete, onTap }: DateStageProps) => {
  const { messages } = useDictionary()
  const [value, setValue] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onTap()
    onComplete()
  }

  return (
    <form className={stageStyles.stageBody} onSubmit={submit}>
      <p className={stageStyles.stagePrompt}>{prompt}</p>
      <p className={stageStyles.helperText}>{hint}</p>
      <input
        className={stageStyles.dateInput}
        placeholder={messages.stageUi.date.placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button className={screenStyles.primaryButton} type="submit">
        {messages.stageUi.date.submitButton}
      </button>
    </form>
  )
}

export default DateStage
