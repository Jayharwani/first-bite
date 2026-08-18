import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import Button from '../components/Button'
import FoodCard from '../components/FoodCard'
import ShareButton from '../components/ShareButton'
import { foodById } from '../data/foods'
import { peerStatsFor } from '../data/peerStats'
import { historyFor, latestReviews } from '../lib/storage'
import { useApp } from '../lib/appState'
import { useSprings } from '../lib/motion'
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
  const [flipped, setFlipped] = useState(false)

  const food = foodById(mintReview?.foodId)
  if (!mintReview || !food) return null

  // Position among foods, not among runs — a re-run does not add a card.
  const position = latestReviews(state).findIndex((r) => r.foodId === mintReview.foodId) + 1

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
            flipped={flipped}
            onFlipToggle={() => setFlipped((f) => !f)}
            history={historyFor(state, food.id)}
            stats={peerStatsFor(food.id)}
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
        <div className="mt-4">
          <ShareButton targetRef={cardRef} foodId={food.id} />
        </div>
        <Button variant="ghost" onClick={() => go('home')}>
          Back to today
        </Button>
      </motion.div>
    </Screen>
  )
}
