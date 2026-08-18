import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useSprings } from '../lib/motion'

type Variant = 'primary' | 'ghost' | 'quiet'

type Props = {
  children: ReactNode
  onClick?: () => void
  variant?: Variant
  disabled?: boolean
  full?: boolean
  className?: string
  'aria-label'?: string
}

/**
 * `primary` carries ink on the brand green rather than white. White on
 * #8FC96B measures 1.96:1 — well under AA — while ink on the same fill
 * reaches 9.11:1 and keeps the exact green from the product screenshots.
 *
 * `ghost` is the trial exit and the secondary action. It is deliberately the
 * same height, the same type size and the same weight as `primary`, because a
 * way out that looks smaller than the way forward is not really a way out.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-sprout text-ink shadow-fab active:bg-sprout-dark',
  ghost: 'bg-paper text-ink border border-hairline shadow-card',
  quiet: 'bg-transparent text-slate',
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  full = true,
  className = '',
  ...rest
}: Props) {
  const { tap, snap } = useSprings()

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : tap}
      transition={snap}
      aria-label={rest['aria-label']}
      className={[
        'inline-flex min-h-[52px] items-center justify-center rounded-tile px-6',
        'text-[15px] font-semibold leading-[22px]',
        full ? 'w-full' : '',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        VARIANTS[variant],
        className,
      ].join(' ')}
    >
      {children}
    </motion.button>
  )
}
