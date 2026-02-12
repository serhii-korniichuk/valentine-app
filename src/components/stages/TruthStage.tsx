interface TruthStageProps {
  prompt: string
  statement: string
  onComplete: () => void
  onTap: () => void
}

function TruthStage({ prompt, statement, onComplete, onTap }: TruthStageProps) {
  const handleAnswer = () => {
    onTap()
    onComplete()
  }

  return (
    <div className="stage-body">
      <p className="stage-prompt">{prompt}</p>
      <p className="truth-statement">{statement}</p>
      <div className="answer-grid answer-grid-two">
        <button className="answer-btn" type="button" onClick={handleAnswer}>
          Правда
        </button>
        <button className="answer-btn" type="button" onClick={handleAnswer}>
          Неправда (але мило)
        </button>
      </div>
    </div>
  )
}

export default TruthStage
