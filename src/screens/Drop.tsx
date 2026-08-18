import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import Screen from '../components/Screen'
import Button from '../components/Button'
import { useApp } from '../lib/appState'
import { useSprings } from '../lib/motion'
import type { Food } from '../types'

const WASH: Record<Food['colorWash'], string> = {
  green: 'bg-wash-green',
  yellow: 'bg-wash-yellow',
  blue: 'bg-wash-blue',
  clay: 'bg-wash-clay',
}

export default function Drop() {
  const { currentFood, state, go, shuffle, startTrial } = useApp()
  const { soft, bloom, tap, snap, reduced } = useSprings()

  if (!currentFood) return null

  return (
    <Screen>
      <div className="safe-top px-5">
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

      {/* Vertically balanced rather than top-aligned: the food is the subject
          of the screen, so it sits where the eye lands. */}
      <div className="flex flex-1 flex-col items-center justify-center px-5">
        {/* Keyed on the food id so a shuffle replays the whole entrance. */}
        <motion.div
          key={currentFood.id}
          initial={reduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={bloom}
          className={`flex h-[180px] w-[180px] items-center justify-center rounded-pill ${WASH[currentFood.colorWash]}`}
        >
          <motion.span
            key={`${currentFood.id}-emoji`}
            initial={reduced ? { opacity: 0 } : { y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...soft, delay: reduced ? 0 : 0.04 }}
            role="img"
            aria-label={currentFood.name}
            className="text-[96px] leading-none"
          >
            {currentFood.emoji}
          </motion.span>
        </motion.div>

        <h1 className="mt-8 text-center text-display text-ink">{currentFood.name}</h1>

        <p className="mt-3 max-w-[300px] text-center text-body-lg text-slate">
          {currentFood.hook}
        </p>
      </div>

      <div className="safe-bottom flex flex-col gap-3 px-5 pt-4">
        <Button onClick={startTrial}>I&rsquo;ll try it</Button>
        {/* Vanishes completely once used. No disabled state, no explanation. */}
        {!state.shuffleUsed ? (
          <Button variant="ghost" onClick={shuffle}>
            Give me a different one
          </Button>
        ) : null}
      </div>
    </Screen>
  )
}
