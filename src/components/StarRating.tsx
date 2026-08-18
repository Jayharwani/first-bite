import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Stars } from '../types'
import { useSprings } from '../lib/motion'

export const VERDICT: Record<Stars, string> = {
  1: 'Never again',
  2: 'Not for me',
  3: 'It was fine',
  4: 'Actually good',
  5: 'Bring it back',
}

/** Spelled out, because prose reads better than a digit mid-sentence. */
export const STAR_WORD: Record<Stars, string> = {
  1: 'one star',
  2: 'two stars',
  3: 'three stars',
  4: 'four stars',
  5: 'five stars',
}

const VALUES: Stars[] = [1, 2, 3, 4, 5]

export default function StarRating({
  value,
  onChange,
}: {
  value: Stars | null
  onChange: (v: Stars) => void
}) {
  const { snap, reduced } = useSprings()

  return (
    <div
      role="radiogroup"
      aria-label="Your rating, one to five stars"
      className="flex items-center justify-center gap-1"
    >
      {VALUES.map((v) => {
        const filled = value !== null && v <= value
        return (
          <motion.button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            aria-label={`${v} ${v === 1 ? 'star' : 'stars'} — ${VERDICT[v]}`}
            onClick={() => onChange(v)}
            transition={snap}
            /* The tapped star pops to 1.2 and settles. */
            animate={reduced ? {} : { scale: value === v ? 1.2 : 1 }}
            whileTap={reduced ? {} : { scale: 0.9 }}
            className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-tile"
          >
            <Star
              size={40}
              strokeWidth={1.75}
              className={filled ? 'fill-sprout text-sprout' : 'fill-transparent text-hairline'}
              aria-hidden="true"
            />
          </motion.button>
        )
      })}
    </div>
  )
}
