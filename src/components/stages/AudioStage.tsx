import { useState } from 'react'
import type { AudioStage as AudioStageConfig } from '../../types/quiz'
import screenStyles from '../shared/ScreenCard.module.scss'
import stageStyles from './StageCommon.module.scss'

type AudioStageProps = {
  stage: AudioStageConfig
  onPlay: () => Promise<void>
  onComplete: () => void
}

const AudioStage = ({ stage, onPlay, onComplete }: AudioStageProps) => {
  const [played, setPlayed] = useState(false)

  const handlePlay = async () => {
    await onPlay()
    setPlayed(true)
  }

  const continueDisabled = stage.rules.requirePlayBeforeContinue && !played

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <button className={screenStyles.primaryButton} type="button" onClick={handlePlay}>
        {stage.playButtonLabel}
      </button>
      {played && <p className={stageStyles.audioCaption}>{stage.caption}</p>}
      <button className={screenStyles.secondaryButton} type="button" onClick={onComplete} disabled={continueDisabled}>
        {stage.continueButtonLabel}
      </button>
    </div>
  )
}

export default AudioStage
