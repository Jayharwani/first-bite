import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, X } from 'lucide-react'
import Screen from '../components/Screen'
import FoodCard from '../components/FoodCard'
import { foodById, DECK_TARGET } from '../data/foods'
import { useApp } from '../lib/appState'
import { useSprings } from '../lib/motion'
import type { Review } from '../types'

const SCALE = 0.55

export default function Deck() {
  const { state, reviewerName, go } = useApp()
  const { bloom, soft, tap, snap, reduced } = useSprings()
  const [open, setOpen] = useState<Review | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // Chronological. The deck is a record of what happened, so it is never
  // sorted by rating and never scored.
  const reviews = [...state.reviews].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  )
  const emptySlots = Math.max(0, DECK_TARGET - reviews.length)

  useEffect(() => {
    if (!open) {
      // Send focus back to the card that opened the overlay.
      returnFocusRef.current?.focus()
      returnFocusRef.current = null
      return
    }
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const openFood = open ? foodById(open.foodId) : undefined

  return (
    <Screen>
      <div className="safe-top flex items-center gap-1 px-5">
        <motion.button
          type="button"
          onClick={() => go('home')}
          whileTap={tap}
          transition={snap}
          aria-label="Back to today"
          className="-ml-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill text-ink"
        >
          <ChevronLeft size={24} strokeWidth={2.25} aria-hidden="true" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <h1 className="mt-1 text-title text-ink">Your deck</h1>
        <p className="tnum mt-1 text-body text-slate">
          {reviews.length} {reviews.length === 1 ? 'food' : 'foods'} reviewed
        </p>

        <ul className="mt-6 grid grid-cols-2 justify-center gap-4">
          {reviews.map((r) => {
            const food = foodById(r.foodId)
            if (!food) return null
            return (
              <li key={r.foodId} className="flex justify-center">
                <motion.button
                  type="button"
                  onClick={(e) => {
                    returnFocusRef.current = e.currentTarget
                    setOpen(r)
                  }}
                  whileTap={tap}
                  transition={snap}
                  aria-label={`${food.name}, ${r.stars} ${r.stars === 1 ? 'star' : 'stars'}. Open the full card.`}
                  className="cursor-pointer rounded-card"
                >
                  <FoodCard
                    food={food}
                    review={r}
                    reviewerName={reviewerName}
                    scale={SCALE}
                    layoutId={`card-${r.foodId}`}
                  />
                </motion.button>
              </li>
            )
          })}

          {Array.from({ length: emptySlots }, (_, i) => (
            <li key={`slot-${i}`} className="flex justify-center">
              <div
                className="flex items-center justify-center rounded-card border-2 border-dashed border-hairline"
                style={{ width: 260 * SCALE, height: 360 * SCALE }}
              >
                <span className="text-title text-mist" aria-hidden="true">
                  ?
                </span>
                <span className="sr-only">Not reviewed yet</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open && openFood ? (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={soft}
            role="dialog"
            aria-modal="true"
            aria-label={`${openFood.name} card`}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close the card"
              className="absolute inset-0 cursor-pointer bg-ink/50"
            />
            <motion.div layoutId={`card-${open.foodId}`} transition={bloom} className="relative">
              <FoodCard food={openFood} review={open} reviewerName={reviewerName} />
            </motion.div>
            <motion.button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(null)}
              whileTap={tap}
              initial={reduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-label="Close the card"
              className="absolute right-5 top-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill bg-paper text-ink shadow-card"
            >
              <X size={20} strokeWidth={2.25} aria-hidden="true" />
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Screen>
  )
}
