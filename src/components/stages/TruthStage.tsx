import classNames from 'classnames'
import { useDictionary } from '../../dictionary'
import stageStyles from './StageCommon.module.scss'

type TruthStageProps = {
  prompt: string
  statement: string
  onComplete: () => void
  onTap: () => void
}

const TruthStage = ({ prompt, statement, onComplete, onTap }: TruthStageProps) => {
  const { messages } = useDictionary()

  const handleAnswer = () => {
    onTap()
    onComplete()
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{prompt}</p>
      <p className={stageStyles.truthStatement}>{statement}</p>
      <div className={classNames(stageStyles.answerGrid, stageStyles.answerGridTwo)}>
        <button className={stageStyles.answerButton} type="button" onClick={handleAnswer}>
          {messages.stageUi.truth.trueButton}
        </button>
        <button className={stageStyles.answerButton} type="button" onClick={handleAnswer}>
          {messages.stageUi.truth.falseButton}
        </button>
      </div>
    </div>
  )
}

export default TruthStage
