import { useState } from 'react'
import classNames from 'classnames'
import stageStyles from './StageCommon.module.scss'

type ChoiceStageProps = {
  prompt: string
  options: string[]
  onSelect: () => void
  onTap: () => void
}

const ChoiceStage = ({ prompt, options, onSelect, onTap }: ChoiceStageProps) => {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (option: string) => {
    setSelected(option)
    onTap()
    window.setTimeout(() => {
      onSelect()
    }, 280)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{prompt}</p>
      <div className={stageStyles.answerGrid}>
        {options.map((option) => (
          <button
            key={option}
            className={classNames(stageStyles.answerButton, {
              [stageStyles.answerButtonSelected]: selected === option,
            })}
            type="button"
            onClick={() => handleClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChoiceStage
