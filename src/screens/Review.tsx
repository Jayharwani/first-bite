import { AnimatePresence, motion } from 'framer-motion'
import Screen from '../components/Screen'
import Button from '../components/Button'
import TagChip from '../components/TagChip'
import StarRating, { VERDICT } from '../components/StarRating'
import { TAGS } from '../data/tags'
import { useApp } from '../lib/appState'
import { useSprings } from '../lib/motion'

const NOTE_MAX = 140

export default function Review() {
  const { currentFood, draft, setDraft, toggleTag, publish } = useApp()
  const { soft, reduced } = useSprings()

  if (!currentFood) return null

  return (
    <Screen>
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="safe-top">
          <h1 className="text-title text-ink">Your review</h1>
          <p className="mt-1 text-body text-slate">
            <span role="img" aria-hidden="true" className="mr-1">
              {currentFood.emoji}
            </span>
            {currentFood.name}
          </p>
        </div>

        <div className="mt-7">
          <StarRating value={draft.stars} onChange={(stars) => setDraft({ stars })} />
          {/* The verdict is a mirror, never a nudge. One star gets a label as
              confident as five. */}
          <div className="mt-3 flex h-[18px] items-center justify-center" aria-live="polite">
            <AnimatePresence mode="wait">
              {draft.stars !== null ? (
                <motion.span
                  key={draft.stars}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={soft}
                  className="text-label text-sprout-deep"
                >
                  {VERDICT[draft.stars]}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-7">
          <h2 className="text-label text-slate">What was it like?</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <TagChip
                key={t.id}
                label={t.label}
                selected={draft.tags.includes(t.id)}
                onToggle={() => toggleTag(t.id)}
              />
            ))}
          </div>
        </div>

        <div className="mt-7">
          <label htmlFor="note" className="sr-only">
            Anything else about {currentFood.name}? Optional, up to {NOTE_MAX} characters.
          </label>
          <textarea
            id="note"
            value={draft.note}
            maxLength={NOTE_MAX}
            rows={3}
            onChange={(e) => setDraft({ note: e.target.value.slice(0, NOTE_MAX) })}
            placeholder="Anything else? (optional)"
            className="w-full resize-none rounded-tile border border-hairline bg-paper p-4 text-body text-ink placeholder:text-mist"
          />
          <p className="tnum mt-1 text-right text-caption text-mist">
            {draft.note.length}/{NOTE_MAX}
          </p>
        </div>
      </div>

      <div className="safe-bottom border-t border-hairline bg-canvas px-5 pt-4">
        <Button onClick={publish} disabled={draft.stars === null}>
          Publish review
        </Button>
      </div>
    </Screen>
  )
}
