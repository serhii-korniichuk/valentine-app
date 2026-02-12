type SoundToggleProps = {
  enabled: boolean
  onToggle: () => void
}

const SoundToggle = ({ enabled, onToggle }: SoundToggleProps) => {
  return (
    <button className="sound-toggle" type="button" onClick={onToggle}>
      {enabled ? 'Звук: Увімкнено' : 'Звук: Вимкнено'}
    </button>
  )
}

export default SoundToggle
