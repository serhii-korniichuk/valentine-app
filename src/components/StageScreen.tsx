import type { QuizStage } from '../types/quiz'
import AudioStage from './stages/AudioStage'
import CatchStage from './stages/CatchStage'
import ChoiceStage from './stages/ChoiceStage'
import DateStage from './stages/DateStage'
import PreferenceStage from './stages/PreferenceStage'
import PuzzleStage from './stages/PuzzleStage'
import TruthStage from './stages/TruthStage'

type StageScreenProps = {
  stage: QuizStage
  onComplete: () => void
  onTap: () => void
  onAudioPlay: () => Promise<void>
}

const StageScreen = ({ stage, onComplete, onTap, onAudioPlay }: StageScreenProps) => {
  return (
    <section className="screen-card">
      <p className="badge">{stage.title}</p>

      {stage.kind === 'choice' && (
        <ChoiceStage prompt={stage.prompt} options={stage.options} onSelect={onComplete} onTap={onTap} />
      )}

      {stage.kind === 'truth' && (
        <TruthStage prompt={stage.prompt} statement={stage.statement} onComplete={onComplete} onTap={onTap} />
      )}

      {stage.kind === 'catch' && (
        <CatchStage prompt={stage.prompt} target={stage.target} onComplete={onComplete} onTap={onTap} />
      )}

      {stage.kind === 'preference' && (
        <PreferenceStage
          prompt={stage.prompt}
          helper={stage.helper}
          options={stage.options}
          onSelect={onComplete}
          onTap={onTap}
        />
      )}

      {stage.kind === 'date' && (
        <DateStage prompt={stage.prompt} hint={stage.hint} onComplete={onComplete} onTap={onTap} />
      )}

      {stage.kind === 'puzzle' && (
        <PuzzleStage
          prompt={stage.prompt}
          words={stage.words}
          targetPhrase={stage.targetPhrase}
          onComplete={onComplete}
          onTap={onTap}
        />
      )}

      {stage.kind === 'audio' && (
        <AudioStage prompt={stage.prompt} caption={stage.caption} onPlay={onAudioPlay} onComplete={onComplete} />
      )}
    </section>
  )
}

export default StageScreen
