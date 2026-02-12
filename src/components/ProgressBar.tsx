interface ProgressBarProps {
  current: number
  total: number
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className="progress-wrap" aria-label="Прогрес квізу">
      <div className="progress-label-row">
        <span>
          Етап {Math.min(current + 1, total)}/{total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
