import { useState } from 'react'

interface PreferenceStageProps {
  prompt: string
  helper: string
  options: string[]
  onSelect: () => void
  onTap: () => void
}

function PreferenceStage({ prompt, helper, options, onSelect, onTap }: PreferenceStageProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (option: string) => {
    setSelected(option)
    onTap()
    window.setTimeout(() => onSelect(), 280)
  }

  return (
    <div className="stage-body">
      <p className="stage-prompt">{prompt}</p>
      <p className="helper-text">{helper}</p>
      <div className="answer-grid">
        {options.map((option) => (
          <button
            key={option}
            className={`answer-btn ${selected === option ? 'is-selected' : ''}`}
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
