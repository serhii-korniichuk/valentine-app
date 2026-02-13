import classNames from 'classnames'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'outline' | 'soft'

type ButtonProps = {
  variant?: ButtonVariant
  pulse?: boolean
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ variant = 'primary', pulse = false, className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={classNames(styles.button, styles[variant], { [styles.pulse]: pulse }, className)}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
