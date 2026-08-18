import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import Button from '../components/Button'
import FoodCard from '../components/FoodCard'
import { foodById } from '../data/foods'
import { useApp } from '../lib/appState'
import { useSprings } from '../lib/motion'
import { shareCard } from '../lib/cardImage'
import type { Food } from '../types'

const WASH: Record<Food['colorWash'], string> = {
  green: 'bg-wash-green',
  yellow: 'bg-wash-yellow',
  blue: 'bg-wash-blue',
  clay: 'bg-wash-clay',
}

export default function Mint() {
  const { state, mintReview, reviewerName, go } = useApp()
  const { bloom, soft, reduced } = useSprings()
  const cardRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const food = foodById(mintReview?.foodId)
  if (!mintReview || !food) return null

  const position = state.reviews.findIndex((r) => r.foodId === mintReview.foodId) + 1

  const onShare = async () => {
    if (!cardRef.current || busy) return
    setBusy(true)
    setStatus(null)
    const result = await shareCard(cardRef.current, `first-bite-${food.id}.png`)
    setBusy(false)
    setStatus(
      result === 'shared'
        ? 'Shared.'
        : result === 'downloaded'
          ? 'Saved to your downloads.'
          : 'Could not save the card. Try again.',
    )
  }

  return (
    <Screen>
      <div className="relative flex flex-1 items-center justify-center px-5">
        {/* The bloom behind the card. */}
        <motion.div
          aria-hidden="true"
          initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={bloom}
          className={`absolute h-[240px] w-[240px] rounded-pill ${WASH[food.colorWash]}`}
        />

        <motion.div
          initial={reduced ? { opacity: 0 } : { scale: 0.6, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={reduced ? soft : { ...bloom, delay: 0.15 }}
          className="relative"
        >
          <FoodCard
            ref={cardRef}
            food={food}
            review={mintReview}
            reviewerName={reviewerName}
            stagger
            sheen
          />
        </motion.div>
      </div>

      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...soft, delay: reduced ? 0 : 0.9 }}
        className="safe-bottom px-5 pt-2"
      >
        <p className="tnum text-center text-caption text-mist">
          Card {position} of your deck
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <Button onClick={onShare} disabled={busy}>
            {busy ? 'Preparing…' : 'Share my review'}
          </Button>
          <Button variant="ghost" onClick={() => go('home')}>
            Back to today
          </Button>
        </div>
        <p className="mt-2 min-h-[16px] text-center text-caption text-slate" aria-live="polite">
          {status}
        </p>
      </motion.div>
    </Screen>
  )
}
