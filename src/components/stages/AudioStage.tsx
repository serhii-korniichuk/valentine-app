import { useState } from 'react'

interface AudioStageProps {
  prompt: string
  caption: string
  onPlay: () => Promise<void>
  onComplete: () => void
}

function AudioStage({ prompt, caption, onPlay, onComplete }: AudioStageProps) {
  const [played, setPlayed] = useState(false)

  const handlePlay = async () => {
    await onPlay()
    setPlayed(true)
  }

  return (
    <div className="stage-body">
      <p className="stage-prompt">{prompt}</p>
      <button className="primary-btn" type="button" onClick={handlePlay}>
        Відтворити
      </button>
      {played && <p className="audio-caption">{caption}</p>}
      <button className="secondary-btn" type="button" onClick={onComplete}>
        Продовжити
      </button>
    </div>
  )
}

export default AudioStage
