import classNames from 'classnames'
import type { QuizStage } from '../types/quiz'
import localStyles from './StageScreen.module.scss'
import screenStyles from './shared/ScreenCard.module.scss'
import ScreenCard from './shared/ScreenCard'
import CatchStage from './stages/CatchStage'
import ChoiceStage from './stages/ChoiceStage'
import HoldStage from './stages/HoldStage'
import MemoryStage from './stages/MemoryStage'
import PuzzleStage from './stages/PuzzleStage'
import ReactionStage from './stages/ReactionStage'
import SoundToggle from './SoundToggle'
import TruthStage from './stages/TruthStage'
import TicTacToeStage from './stages/TicTacToeStage'

type StageScreenProps = {
  stage: QuizStage
  onComplete: (options?: { skipCelebration?: boolean }) => void
  onCelebrate: () => void
  soundEnabled: boolean
  soundEnabledLabel: string
  soundDisabledLabel: string
  onToggleSound: () => void
  onTap: () => void
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

      {stage.kind === 'puzzle' && <PuzzleStage stage={stage} onComplete={onComplete} onTap={onTap} />}

      {stage.kind === 'hold' && <HoldStage stage={stage} onComplete={onComplete} onTap={onTap} />}

      {stage.kind === 'reaction' && <ReactionStage stage={stage} onComplete={onComplete} onTap={onTap} />}

      {stage.kind === 'memory' && <MemoryStage stage={stage} onComplete={onComplete} onTap={onTap} />}

      {stage.kind === 'tic_tac_toe' && <TicTacToeStage stage={stage} onComplete={onComplete} onTap={onTap} />}
    </ScreenCard>
  )
}

export default StageScreen
