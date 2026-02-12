import { useState } from 'react'

interface ChoiceStageProps {
  prompt: string
  options: string[]
  onSelect: () => void
  onTap: () => void
}

function ChoiceStage({ prompt, options, onSelect, onTap }: ChoiceStageProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (option: string) => {
    setSelected(option)
    onTap()
    window.setTimeout(() => {
      onSelect()
    }, 280)
  }

  return (
    <div className="stage-body">
      <p className="stage-prompt">{prompt}</p>
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

export default ChoiceStage
