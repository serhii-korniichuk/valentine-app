import { useMemo, useState } from 'react'
import type { PuzzleStage as PuzzleStageConfig } from '../../types/quiz'
import stageStyles from './StageCommon.module.scss'

type PuzzleStageProps = {
  stage: PuzzleStageConfig
  onComplete: () => void
  onTap: () => void
}

const normalizeValue = (value: string, mode: PuzzleStageConfig['rules']['normalize']) => {
  if (mode === 'trim_lower') {
    return value.trim().toLowerCase()
  }

  return value
}

const PuzzleStage = ({ stage, onComplete, onTap }: PuzzleStageProps) => {
  const [picked, setPicked] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')

  const available = useMemo(() => {
    return stage.words.filter((word) => !picked.includes(word))
  }, [picked, stage.words])

  const chooseWord = (word: string) => {
    onTap()
    const next = [...picked, word]
    setPicked(next)

    if (next.length === stage.words.length) {
      const phrase = normalizeValue(next.join(' '), stage.rules.normalize)
      const matches = stage.rules.acceptedPhrases.some((accepted) => {
        return normalizeValue(accepted, stage.rules.normalize) === phrase
      })

      if (matches) {
        setFeedback('')
        onComplete()
        return
      }

      setFeedback(stage.rules.incorrectMessage)
      window.setTimeout(() => {
        setPicked([])
      }, 500)
    }
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <p className={stageStyles.puzzleLine}>{picked.join(' ') || stage.previewPlaceholder}</p>
      <div className={stageStyles.answerGrid}>
        {available.map((word) => (
          <button key={word} className={stageStyles.answerButton} type="button" onClick={() => chooseWord(word)}>
            {word}
          </button>
        ))}
      </div>
      {feedback && <p className={stageStyles.helperText}>{feedback}</p>}
    </div>
  )
}

export default PuzzleStage
