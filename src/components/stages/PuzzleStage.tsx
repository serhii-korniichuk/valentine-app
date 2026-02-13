import { useMemo, useState } from 'react'
import { heartSymbols } from '../../config/heartSymbols'
import type { PuzzleStage as PuzzleStageConfig } from '../../types/quiz'
import Button from '../shared/Button'
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

const toSentenceCase = (value: string) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`
}

const PuzzleStage = ({ stage, onComplete, onTap }: PuzzleStageProps) => {
  const [picked, setPicked] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')
  const [isSolved, setIsSolved] = useState(false)
  const [isFailedAttempt, setIsFailedAttempt] = useState(false)

  const available = useMemo(() => {
    return stage.words.filter((word) => !picked.includes(word))
  }, [picked, stage.words])

  const chooseWord = (word: string) => {
    if (isSolved || isFailedAttempt) {
      return
    }

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
        setIsSolved(true)
        return
      }

      setFeedback(stage.rules.incorrectMessage)
      setIsFailedAttempt(true)
    }
  }

  const phraseText = picked.length > 0 ? toSentenceCase(picked.join(' ')) : stage.previewPlaceholder
  const phraseWithHeart = isSolved && picked.length > 0 ? `${phraseText} ${heartSymbols.primary}` : phraseText

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{stage.prompt}</p>
      <div className={stageStyles.puzzlePreviewBox}>
        <p className={stageStyles.puzzleLine}>{phraseWithHeart}</p>
      </div>
      {!isSolved && !isFailedAttempt && (
        <div className={stageStyles.answerGrid}>
          {available.map((word) => (
            <button key={word} className={stageStyles.answerButton} type="button" onClick={() => chooseWord(word)}>
              {word}
            </button>
          ))}
        </div>
      )}
      {isSolved && (
        <Button
          variant="primary"
          type="button"
          onClick={() => {
            onTap()
            onComplete()
          }}
        >
          {stage.rules.continueButtonLabel}
        </Button>
      )}
      {isFailedAttempt && (
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            onTap()
            setPicked([])
            setFeedback('')
            setIsFailedAttempt(false)
          }}
        >
          {stage.rules.retryButtonLabel}
        </Button>
      )}
      {feedback && <p className={stageStyles.helperText}>{feedback}</p>}
    </div>
  )
}

export default PuzzleStage
