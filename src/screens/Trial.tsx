import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import Screen from '../components/Screen'
import Button from '../components/Button'
import StepArc from '../components/StepArc'
import { useApp } from '../lib/appState'
import { useSprings } from '../lib/motion'
import { TRIAL_STEPS, type TrialStep } from '../types'

const COPY: Record<TrialStep, { verb: string; instruction: string; exit: string }> = {
  look: {
    verb: 'Look at it',
    instruction: 'What colour is it, really? Look at the edges and the inside.',
    exit: "That's far enough",
  },
  smell: {
    verb: 'Smell it',
    instruction: 'Get close. Does it smell like anything you already know?',
    exit: "That's far enough",
  },
  touch: {
    verb: 'Touch it',
    instruction: 'Pick it up. Is it wet, dry, squishy, hard?',
    exit: "That's far enough",
  },
  taste: {
    verb: 'Taste it',
    instruction: 'A tiny bit is enough. You can spit it out.',
    exit: "I'm not tasting it",
  },
}

export default function Trial() {
  const { currentFood, go, finishTrial } = useApp()
  const { soft, tap, snap, reduced } = useSprings()
  const [i, setI] = useState(0)

  if (!currentFood) return null

  const step = TRIAL_STEPS[i]
  const copy = COPY[step]
  const isLast = i === TRIAL_STEPS.length - 1

  const advance = () => {
    if (isLast) finishTrial([...TRIAL_STEPS])
    else setI((n) => n + 1)
  }

  // Leaving early is a completed trial with fewer steps, not a failure.
  const leave = () => finishTrial(TRIAL_STEPS.slice(0, i), step)

  const back = () => (i === 0 ? go('drop') : setI((n) => n - 1))

  return (
    <Screen>
      <div className="safe-top flex items-center justify-between px-5">
        <motion.button
          type="button"
          onClick={back}
          whileTap={tap}
          transition={snap}
          aria-label={i === 0 ? 'Back to this week&rsquo;s food' : 'Back to the previous step'}
          className="-ml-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill text-ink"
        >
          <ChevronLeft size={24} strokeWidth={2.25} aria-hidden="true" />
        </motion.button>
        <StepArc current={i} total={TRIAL_STEPS.length} label={`Step ${i + 1}: ${copy.verb}`} />
        <span className="h-11 w-11" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={soft}
            className="flex flex-col items-center"
          >
            <h1 className="text-center text-title text-ink">{copy.verb}</h1>
            <p className="mt-3 max-w-[300px] text-center text-body-lg text-slate">
              {copy.instruction}
            </p>
            <span
              role="img"
              aria-label={currentFood.name}
              className="mt-8 text-[64px] leading-none opacity-90"
            >
              {currentFood.emoji}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The exit is the same height and the same type size as Done. If it
          read as a smaller, greyer link, the concept would not survive it. */}
      <div className="safe-bottom flex flex-col gap-1 px-5 pt-4">
        <Button onClick={advance}>Done</Button>
        <Button variant="quiet" onClick={leave}>
          {copy.exit}
        </Button>
      </div>
    </Screen>
  )
}
