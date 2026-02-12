import { useMemo } from 'react'
import { createRandomGlassStyle } from './shared/glass'
import styles from './ProgressBar.module.scss'

type ProgressBarProps = {
  current: number
  total: number
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percent = Math.round((current / total) * 100)
  const glassStyle = useMemo(
    () =>
      createRandomGlassStyle({
        alphaMin: 0.3,
        alphaMax: 0.44,
        accentAlphaMin: 0.06,
        accentAlphaMax: 0.14,
        blobAlphaMin: 0.015,
        blobAlphaMax: 0.04,
        blob2AlphaMin: 0.01,
        blob2AlphaMax: 0.03,
      }),
    [],
  )

  return (
    <div className={styles.progressWrap} style={glassStyle} aria-label="Прогрес квізу">
      <div className={styles.progressLabelRow}>
        <span>
          Етап {Math.min(current + 1, total)}/{total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
