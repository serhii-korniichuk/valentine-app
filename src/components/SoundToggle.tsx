import styles from './SoundToggle.module.scss'

type SoundToggleProps = {
  enabled: boolean
  onToggle: () => void
}

const SoundToggle = ({ enabled, onToggle }: SoundToggleProps) => {
  return (
    <button
      aria-label={enabled ? 'Вимкнути звук' : 'Увімкнути звук'}
      className={styles.soundToggle}
      title={enabled ? 'Вимкнути звук' : 'Увімкнути звук'}
      type="button"
      onClick={onToggle}
    >
      {enabled ? (
        <svg aria-hidden className={styles.icon} viewBox="0 0 24 24">
          <path d="M3 10V14H7L12 18V6L7 10H3Z" />
          <path d="M15.2 8.8C16.9 10.5 16.9 13.5 15.2 15.2" />
          <path d="M17.8 6.2C20.9 9.3 20.9 14.7 17.8 17.8" />
        </svg>
      ) : (
        <svg aria-hidden className={styles.icon} viewBox="0 0 24 24">
          <path d="M3 10V14H7L12 18V6L7 10H3Z" />
          <path d="M15.2 8.8C16.9 10.5 16.9 13.5 15.2 15.2" />
          <path d="M17.8 6.2C20.9 9.3 20.9 14.7 17.8 17.8" />
          <path d="M4.5 5L19.5 19" />
        </svg>
      )}
    </button>
  )
}

export default SoundToggle
