import { motion } from 'framer-motion'
import { useSprings } from '../lib/motion'

export default function TagChip({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  const { tap, snap } = useSprings()

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={tap}
      transition={snap}
      aria-pressed={selected}
      className={[
        'inline-flex min-h-[44px] cursor-pointer items-center rounded-pill border px-4',
        'text-[13px] font-semibold leading-[18px] transition-colors duration-200',
        selected
          ? 'border-ink bg-ink text-paper'
          : 'border-hairline bg-paper text-slate',
      ].join(' ')}
    >
      {label}
    </motion.button>
  )
}
