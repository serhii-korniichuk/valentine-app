import { useState } from 'react'
import classNames from 'classnames'
import stageStyles from './StageCommon.module.scss'

type PreferenceStageProps = {
  prompt: string
  helper: string
  options: string[]
  onSelect: () => void
  onTap: () => void
}

const PreferenceStage = ({ prompt, helper, options, onSelect, onTap }: PreferenceStageProps) => {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (option: string) => {
    setSelected(option)
    onTap()
    window.setTimeout(() => onSelect(), 280)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{prompt}</p>
      <p className={stageStyles.helperText}>{helper}</p>
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

export default PreferenceStage
