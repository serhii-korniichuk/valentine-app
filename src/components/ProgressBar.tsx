import styles from './ProgressBar.module.scss'

type ProgressBarProps = {
  current: number
  total: number
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percent = Math.round((current / total) * 100)

  return (
    <div className={styles.progressWrap} aria-label="Прогрес квізу">
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
