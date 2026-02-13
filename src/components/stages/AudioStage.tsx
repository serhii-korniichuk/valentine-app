import { useState } from 'react'
import type { AudioStage as AudioStageConfig } from '../../types/quiz'
import Button from '../shared/Button'
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
      <Button variant="primary" type="button" onClick={handlePlay}>
        {stage.playButtonLabel}
      </Button>
      {played && <p className={stageStyles.audioCaption}>{stage.caption}</p>}
      <Button variant="soft" type="button" onClick={onComplete} disabled={continueDisabled}>
        {stage.continueButtonLabel}
      </Button>
    </div>
  )
}

export default AudioStage
