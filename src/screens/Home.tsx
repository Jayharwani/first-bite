import { motion } from 'framer-motion'
import { Sprout, Check, ArrowRight } from 'lucide-react'
import Screen from '../components/Screen'
import Button from '../components/Button'
import { STAR_WORD } from '../components/StarRating'
import { useApp } from '../lib/appState'
import { useSprings } from '../lib/motion'
import { monthName } from '../lib/storage'
import type { Food } from '../types'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU']

const WASH_CLASS: Record<Food['colorWash'], string> = {
  green: 'bg-wash-green',
  yellow: 'bg-wash-yellow',
  blue: 'bg-wash-blue',
  clay: 'bg-wash-clay',
}

const today = () =>
  new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export default function Home() {
  const {
    currentFood,
    currentReview,
    pendingReRunFood,
    pendingReRunReview,
    homeState,
    secondaryReRunFood,
    foodsReviewed,
    reviewerName,
    go,
    declineReRun,
    openExistingCard,
  } = useApp()
  const { tap, snap } = useSprings()

  if (!currentFood) return null

  // A food waiting on a second opinion outranks this week's drop, but never
  // a mission the kid finished today. homeState resolves that in one place.
  const reRun = homeState === 'reRun' ? pendingReRunFood : null

  return (
    <Screen className="overflow-y-auto">
      <div className="safe-top px-5 pb-6">
        {/* Surrounding app chrome. Context only — the First Bite card is the
            feature, everything above it is the room it sits in. */}
        <p className="tnum text-caption text-slate">{today()}</p>
        <h1 className="mt-1 text-title text-ink">
          <span className="font-extrabold">Hey</span>{' '}
          <span className="font-medium">{reviewerName}</span>
        </h1>

        <div className="mt-5 rounded-card bg-wash-yellow p-5">
          <div className="flex items-center gap-1.5">
            <Sprout size={14} className="text-sprout-deep" aria-hidden="true" />
            <span
              className="text-caption font-semibold text-sprout-deep"
              style={{ letterSpacing: '0.08em' }}
            >
              STREAK
            </span>
          </div>
          <p className="tnum mt-1 text-ink">
            <span className="text-[30px] font-extrabold leading-9">36</span>{' '}
            <span className="text-body font-semibold">DAYS</span>
          </p>
          <ul className="mt-3 flex justify-between">
            {DAYS.map((d) => (
              <li key={d} className="flex flex-col items-center gap-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-sprout-dark">
                  <Check size={16} strokeWidth={3} className="text-paper" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-semibold tracking-wide text-slate">{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="mt-7 text-title text-ink">Today&rsquo;s missions</h2>

        {/* ---- First Bite entry card ---- */}
        <section
          className={[
            'mt-4 rounded-card p-5 shadow-card',
            // Wearing the returning food's own colour makes the ask feel
            // specific to that food rather than generic.
            reRun ? WASH_CLASS[reRun.colorWash] : 'bg-wash-green',
          ].join(' ')}
        >
          <div className="flex items-center gap-1.5">
            <Sprout size={14} className="text-sprout-deep" aria-hidden="true" />
            <span
              className="text-caption font-semibold text-sprout-deep"
              style={{ letterSpacing: '0.08em' }}
            >
              {reRun ? 'SECOND OPINION' : 'FIRST BITE'}
            </span>
          </div>

          {reRun && pendingReRunReview ? (
            <>
              <h3 className="mt-2 text-title text-ink">{reRun.name}, again</h3>
              <p className="mt-2 text-body text-slate">
                You gave it {STAR_WORD[pendingReRunReview.stars]} in{' '}
                {monthName(pendingReRunReview.createdAt)}.
              </p>
              <div className="mt-4">
                <Button onClick={() => go('secondOpinion')}>Take another look</Button>
              </div>
              <div className="mt-1">
                <Button variant="quiet" onClick={declineReRun}>
                  Not this week
                </Button>
              </div>
            </>
          ) : homeState === 'done' && currentReview ? (
            <>
              <div className="mt-3 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-tile bg-paper text-[30px] leading-none shadow-card"
                >
                  {currentFood.emoji}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-body-lg font-bold text-ink">{currentFood.name}</h3>
                  <p className="tnum text-body text-slate">
                    Reviewed &mdash; {currentReview.stars}{' '}
                    {currentReview.stars === 1 ? 'star' : 'stars'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="ghost" onClick={openExistingCard}>
                  Look at your card
                </Button>
              </div>
              {/* Offered under the finished mission, not in place of it. */}
              {secondaryReRunFood ? (
                <div className="mt-1">
                  <Button variant="quiet" onClick={() => go('secondOpinion')}>
                    Take another look at {secondaryReRunFood.name.toLowerCase()}
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h3 className="mt-2 text-title text-ink">This week: {currentFood.name}</h3>
              <p className="mt-2 text-body text-slate">
                You don&rsquo;t have to like it. You just have to review it.
              </p>
              <div className="mt-4">
                <Button onClick={() => go('drop')}>Start the trial</Button>
              </div>
            </>
          )}

          {/* text-slate, not text-mist: mist measures 4.23:1 on wash.green,
              under the AA floor this feature is held to. */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="tnum text-caption text-slate">
              {foodsReviewed} {foodsReviewed === 1 ? 'food' : 'foods'} reviewed
            </p>
            <motion.button
              type="button"
              onClick={() => go('deck')}
              whileTap={tap}
              transition={snap}
              className="-mr-2 flex min-h-[44px] cursor-pointer items-center gap-1 px-2 text-caption font-semibold text-sprout-deep"
            >
              See your deck
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
            </motion.button>
          </div>
        </section>

        {/* Two sibling missions, so the First Bite card is seen in the company
            it actually keeps. */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          {['Track breakfast', 'Track lunch'].map((m) => (
            <div
              key={m}
              className="rounded-card border border-hairline bg-paper p-4 text-center shadow-card"
            >
              <p className="text-body font-semibold text-ink">{m}</p>
              <span className="mx-auto mt-2 flex h-7 w-7 items-center justify-center rounded-pill bg-wash-green">
                <Check size={15} strokeWidth={3} className="text-sprout-deep" aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  )
}
