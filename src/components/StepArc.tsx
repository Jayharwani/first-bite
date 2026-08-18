import { motion } from 'framer-motion'
import { useSprings } from '../lib/motion'

const SIZE = 64
const R = 26
const C = SIZE / 2
const GAP = 12 // degrees of empty space between segments

const point = (angleDeg: number) => {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) }
}

const arc = (i: number, total: number) => {
  const span = 360 / total
  const start = i * span + GAP / 2
  const end = (i + 1) * span - GAP / 2
  const s = point(start)
  const e = point(end)
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

/**
 * Four segments, one per sensory step. Filled segments are sprout, the rest
 * hairline. The active segment breathes rather than races — this reads as a
 * position in a sequence, not a countdown running out.
 */
export default function StepArc({
  current,
  total = 4,
  label,
}: {
  current: number // zero-based index of the active step
  total?: number
  label: string
}) {
  const { reduced, soft } = useSprings()

  return (
    <div
      className="relative"
      style={{ width: SIZE, height: SIZE }}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-valuetext={label}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => {
          const done = i < current
          const active = i === current
          return (
            <motion.path
              key={i}
              d={arc(i, total)}
              fill="none"
              strokeWidth={5}
              strokeLinecap="round"
              stroke={done || active ? '#8FC96B' : '#EAEBE7'}
              initial={false}
              animate={
                reduced || !active
                  ? { opacity: 1 }
                  : { opacity: [1, 0.45, 1] }
              }
              transition={
                reduced || !active
                  ? soft
                  : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          )
        })}
      </svg>
      <span className="tnum absolute inset-0 flex items-center justify-center text-[13px] font-bold leading-none text-ink">
        {current + 1}
        <span className="text-mist">/{total}</span>
      </span>
    </div>
  )
}
