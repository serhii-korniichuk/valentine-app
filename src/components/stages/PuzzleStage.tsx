import { useMemo, useState } from 'react'

interface PuzzleStageProps {
  prompt: string
  words: string[]
  targetPhrase: string
  onComplete: () => void
  onTap: () => void
}

function PuzzleStage({ prompt, words, targetPhrase, onComplete, onTap }: PuzzleStageProps) {
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
    <div className="stage-body">
      <p className="stage-prompt">{prompt}</p>
      <p className="puzzle-line">{picked.join(' ') || '...'} </p>
      <div className="answer-grid">
        {available.map((word) => (
          <button key={word} className="answer-btn" type="button" onClick={() => chooseWord(word)}>
            {word}
          </button>
        ))}
      </div>
      {attempts > 0 && <p className="helper-text">Трохи інакше, але мені все одно подобається твій варіант ❤</p>}
    </div>
  )
}

export default PuzzleStage
