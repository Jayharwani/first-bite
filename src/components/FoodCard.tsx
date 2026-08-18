import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { forwardRef } from 'react'
import type { Food, Review } from '../types'
import { VERDICT } from './StarRating'
import { useSprings } from '../lib/motion'

const WASH: Record<Food['colorWash'], string> = {
  green: '#EDF5E6',
  yellow: '#F7F3D4',
  blue: '#DCE7F0',
  clay: '#F6DDDA',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })

type Props = {
  food: Food
  review: Review
  reviewerName: string
  /** 1 = the full 260x360 collectible. The deck renders at 0.55. */
  scale?: number
  layoutId?: string
  /** The one-shot diagonal sheen. Mint only, never in the deck. */
  sheen?: boolean
  /** Stagger the contents in. Mint only. */
  stagger?: boolean
}

/**
 * Sized from a scale factor rather than a CSS transform, so the deck's
 * smaller cards stay crisp and Framer's shared-layout transition has a real
 * box to interpolate between.
 */
const FoodCard = forwardRef<HTMLDivElement, Props>(function FoodCard(
  { food, review, reviewerName, scale = 1, layoutId, sheen = false, stagger = false },
  ref,
) {
  const { bloom, soft, reduced } = useSprings()
  const s = (n: number) => `${n * scale}px`

  const item = (i: number) =>
    stagger && !reduced
      ? {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { ...soft, delay: 0.35 + i * 0.06 },
        }
      : {}

  return (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      transition={bloom}
      className="relative flex shrink-0 flex-col overflow-hidden"
      style={{
        width: s(260),
        height: s(360),
        borderRadius: s(24),
        backgroundColor: WASH[food.colorWash],
        boxShadow: '0 8px 32px rgba(20, 25, 20, 0.10)',
        padding: s(20),
      }}
    >
      {/* Inset frame — 1px white at 40%, the thing that makes it read as a card
          rather than a tile. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          inset: s(8),
          borderRadius: s(17),
          border: `1px solid rgba(255,255,255,0.4)`,
        }}
      />

      {/* Art */}
      <motion.div
        {...item(0)}
        className="flex flex-1 items-center justify-center"
        style={{ fontSize: s(88), lineHeight: 1 }}
      >
        <span role="img" aria-label={food.name}>
          {food.emoji}
        </span>
      </motion.div>

      {/* Name */}
      <motion.h3
        {...item(1)}
        className="text-center font-extrabold text-ink"
        style={{ fontSize: s(22), lineHeight: s(26), letterSpacing: '-0.02em' }}
      >
        {food.name}
      </motion.h3>

      {/* The kid's verdict, in ink — not the app's approval, so never green. */}
      <motion.div
        {...item(2)}
        className="flex items-center justify-center"
        style={{ gap: s(2), marginTop: s(8) }}
        role="img"
        aria-label={`${review.stars} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((v) => (
          <Star
            key={v}
            size={14 * scale}
            strokeWidth={2}
            className={v <= review.stars ? 'fill-ink text-ink' : 'fill-transparent text-ink/25'}
            aria-hidden="true"
          />
        ))}
      </motion.div>

      <motion.div {...item(3)} className="flex justify-center" style={{ marginTop: s(10) }}>
        <span
          className="rounded-pill bg-ink font-semibold text-paper"
          style={{ fontSize: s(11), lineHeight: s(16), padding: `${s(4)} ${s(10)}` }}
        >
          {VERDICT[review.stars]}
        </span>
      </motion.div>

      {review.note ? (
        <motion.p
          {...item(4)}
          className="overflow-hidden text-center italic text-ink/70"
          style={{
            fontSize: s(11),
            lineHeight: s(15),
            marginTop: s(10),
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          “{review.note}”
        </motion.p>
      ) : null}

      <motion.div
        {...item(5)}
        className="tnum flex items-end justify-between"
        style={{ marginTop: s(12), fontSize: s(11), lineHeight: s(14) }}
      >
        <span className="font-semibold text-ink/70">{reviewerName}</span>
        <span className="text-ink/70">{formatDate(review.createdAt)}</span>
      </motion.div>

      <div
        className="text-center font-semibold text-ink/40"
        style={{ fontSize: s(9), lineHeight: s(12), marginTop: s(6) }}
      >
        hey nouri
      </div>

      {/* One diagonal pass. Never loops. */}
      {sheen && !reduced ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.7, delay: 0.75, ease: 'easeInOut' }}
          style={{
            background:
              'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.75) 50%, transparent 65%)',
          }}
        />
      ) : null}
    </motion.div>
  )
})

export default FoodCard
