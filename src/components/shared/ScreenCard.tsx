import { useMemo } from 'react'
import type { ReactNode } from 'react'
import classNames from 'classnames'
import { createRandomGlassStyle } from './glass'
import styles from './ScreenCard.module.scss'

type ScreenCardProps = {
  children: ReactNode
  className?: string
}

const ScreenCard = ({ children, className = '' }: ScreenCardProps) => {
  const glassStyle = useMemo(() => createRandomGlassStyle(), [])

  return (
    <section className={classNames(styles.screenCard, className)} style={glassStyle}>
      <div className={styles.content}>{children}</div>
    </section>
  )
}

export default ScreenCard
