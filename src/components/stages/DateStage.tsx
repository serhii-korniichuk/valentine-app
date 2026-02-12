import { useState } from 'react'
import type { FormEvent } from 'react'

type DateStageProps = {
  prompt: string
  hint: string
  onComplete: () => void
  onTap: () => void
}

const DateStage = ({ prompt, hint, onComplete, onTap }: DateStageProps) => {
  const [value, setValue] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onTap()
    onComplete()
  }

  return (
    <form className="stage-body" onSubmit={submit}>
      <p className="stage-prompt">{prompt}</p>
      <p className="helper-text">{hint}</p>
      <input
        className="date-input"
        placeholder="Наприклад: 14.02"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button className="primary-btn" type="submit">
        Підтвердити
      </button>
    </form>
  )
}

export default DateStage
