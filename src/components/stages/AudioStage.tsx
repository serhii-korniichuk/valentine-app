import { useState } from 'react'
import screenStyles from '../shared/ScreenCard.module.scss'
import stageStyles from './StageCommon.module.scss'

type AudioStageProps = {
  prompt: string
  caption: string
  onPlay: () => Promise<void>
  onComplete: () => void
}

const AudioStage = ({ prompt, caption, onPlay, onComplete }: AudioStageProps) => {
  const [played, setPlayed] = useState(false)

  const handlePlay = async () => {
    await onPlay()
    setPlayed(true)
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{prompt}</p>
      <button className={screenStyles.primaryButton} type="button" onClick={handlePlay}>
        Відтворити
      </button>
      {played && <p className={stageStyles.audioCaption}>{caption}</p>}
      <button className={screenStyles.secondaryButton} type="button" onClick={onComplete}>
        Продовжити
      </button>
    </div>
  )
}

export default AudioStage
