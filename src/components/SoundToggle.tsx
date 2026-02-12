interface SoundToggleProps {
  enabled: boolean
  onToggle: () => void
}

function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button className="sound-toggle" type="button" onClick={onToggle}>
      {enabled ? 'Звук: Увімкнено' : 'Звук: Вимкнено'}
    </button>
  )
}

export default SoundToggle
