import { useEffect, useMemo, useState } from 'react'
import styles from './ConfettiBurst.module.scss'

type ConfettiBurstProps = {
  trigger: number
}

type ConfettiPiece = {
  id: string
  left: string
  delay: string
  rotate: string
  hue: number
}

const PIECE_COUNT = 50

const createPieces = (seed: number): ConfettiPiece[] => {
  return Array.from({ length: PIECE_COUNT }, (_, index) => ({
    id: `${seed}-${index}`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.35}s`,
    rotate: `${Math.round(Math.random() * 260 - 130)}deg`,
    hue: 330 + Math.round(Math.random() * 20),
  }))
}

const ConfettiBurst = ({ trigger }: ConfettiBurstProps) => {
  const [visible, setVisible] = useState(false)
  const pieces = useMemo(() => createPieces(trigger), [trigger])

  useEffect(() => {
    if (trigger === 0) {
      return
    }

    setVisible(true)
    const timeout = window.setTimeout(() => setVisible(false), 1800)

    return () => window.clearTimeout(timeout)
  }, [trigger])

  if (!visible) {
    return null
  }

  return (
    <div className={styles.confettiLayer} aria-hidden>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={styles.confettiPiece}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            rotate: piece.rotate,
            background: `hsl(${piece.hue} 100% 74%)`,
          }}
        />
      ))}
    </div>
  )
}

export default ConfettiBurst
