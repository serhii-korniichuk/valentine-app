import { useMemo, useState } from 'react'
import { useDictionary } from '../../dictionary'
import stageStyles from './StageCommon.module.scss'

type PuzzleStageProps = {
  prompt: string
  words: string[]
  targetPhrase: string
  onComplete: () => void
  onTap: () => void
}

const PuzzleStage = ({ prompt, words, targetPhrase, onComplete, onTap }: PuzzleStageProps) => {
  const { messages } = useDictionary()
  const [picked, setPicked] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)

  const available = useMemo(() => {
    return words.filter((word) => !picked.includes(word))
  }, [picked, words])

  const chooseWord = (word: string) => {
    onTap()
    const next = [...picked, word]
    setPicked(next)

    if (next.length === words.length) {
      const phrase = next.join(' ').trim().toLowerCase()
      if (phrase === targetPhrase.trim().toLowerCase() || attempts > 0) {
        onComplete()
        return
      }

      setAttempts((prev) => prev + 1)
      window.setTimeout(() => {
        setPicked([])
      }, 500)
    }
  }

  return (
    <div className={stageStyles.stageBody}>
      <p className={stageStyles.stagePrompt}>{prompt}</p>
      <p className={stageStyles.puzzleLine}>{picked.join(' ') || messages.stageUi.puzzle.previewPlaceholder}</p>
      <div className={stageStyles.answerGrid}>
        {available.map((word) => (
          <button key={word} className={stageStyles.answerButton} type="button" onClick={() => chooseWord(word)}>
            {word}
          </button>
        ))}
      </div>
      {attempts > 0 && <p className={stageStyles.helperText}>{messages.stageUi.puzzle.helperAfterAttempt}</p>}
    </div>
  )
}

export default PuzzleStage
