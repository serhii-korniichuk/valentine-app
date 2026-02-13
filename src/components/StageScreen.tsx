import classNames from 'classnames'
import type { QuizStage } from '../types/quiz'
import localStyles from './StageScreen.module.scss'
import screenStyles from './shared/ScreenCard.module.scss'
import ScreenCard from './shared/ScreenCard'
import AudioStage from './stages/AudioStage'
import CatchStage from './stages/CatchStage'
import ChoiceStage from './stages/ChoiceStage'
import DateStage from './stages/DateStage'
import PreferenceStage from './stages/PreferenceStage'
import PuzzleStage from './stages/PuzzleStage'
import SoundToggle from './SoundToggle'
import TruthStage from './stages/TruthStage'

type StageScreenProps = {
  stage: QuizStage
  onComplete: (options?: { skipCelebration?: boolean }) => void
  onCelebrate: () => void
  soundEnabled: boolean
  soundEnabledLabel: string
  soundDisabledLabel: string
  onToggleSound: () => void
  onTap: () => void
  onAudioPlay: () => Promise<void>
}

const StageScreen = ({
  stage,
  onComplete,
  onCelebrate,
  soundEnabled,
  soundEnabledLabel,
  soundDisabledLabel,
  onToggleSound,
  onTap,
  onAudioPlay,
}: StageScreenProps) => {
  return (
    <ScreenCard>
      <div className={localStyles.cardHead}>
        <p className={classNames(screenStyles.badge, localStyles.badgeReset)}>{stage.title}</p>
        <SoundToggle
          enabled={soundEnabled}
          enabledLabel={soundEnabledLabel}
          disabledLabel={soundDisabledLabel}
          onToggle={onToggleSound}
        />
      </div>

      {stage.kind === 'choice' && <ChoiceStage stage={stage} onSelect={onComplete} onTap={onTap} />}

      {stage.kind === 'truth' && <TruthStage stage={stage} onComplete={onComplete} onTap={onTap} />}

      {stage.kind === 'catch' && <CatchStage stage={stage} onComplete={onComplete} onCelebrate={onCelebrate} onTap={onTap} />}

      {stage.kind === 'preference' && <PreferenceStage stage={stage} onSelect={onComplete} onTap={onTap} />}

      {stage.kind === 'date' && <DateStage stage={stage} onComplete={onComplete} onTap={onTap} />}

      {stage.kind === 'puzzle' && <PuzzleStage stage={stage} onComplete={onComplete} onTap={onTap} />}

      {stage.kind === 'audio' && <AudioStage stage={stage} onPlay={onAudioPlay} onComplete={onComplete} />}
    </ScreenCard>
  )
}

export default StageScreen
