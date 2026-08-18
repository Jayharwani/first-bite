import { useState } from 'react'
import Screen from '../components/Screen'
import Button from '../components/Button'
import FoodCard from '../components/FoodCard'
import { historyFor, monthName } from '../lib/storage'
import { peerStatsFor } from '../data/peerStats'
import { STAR_WORD } from '../components/StarRating'
import { useApp } from '../lib/appState'

/**
 * The card comes first, already turned to its history, and the ask comes
 * second. That ordering is the whole screen: the kid should be looking at
 * their own record before anyone suggests they revisit it.
 *
 * Quieter than the Drop screen on purpose. This is an invitation, not a
 * reveal.
 */
export default function SecondOpinion() {
  const { state, pendingReRunFood, pendingReRunReview, reviewerName, startReRun, declineReRun } =
    useApp()
  // Starts on the back. The kid can turn it over if they want the verdict.
  const [flipped, setFlipped] = useState(true)

  if (!pendingReRunFood || !pendingReRunReview) return null

  return (
    <Screen className="overflow-y-auto">
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
        <FoodCard
          food={pendingReRunFood}
          review={pendingReRunReview}
          reviewerName={reviewerName}
          scale={0.7}
          flipped={flipped}
          onFlipToggle={() => setFlipped((f) => !f)}
          history={historyFor(state, pendingReRunFood.id)}
          stats={peerStatsFor(pendingReRunFood.id)}
        />

        <h1 className="mt-8 text-center text-title text-ink">Second opinion</h1>

        <p className="mt-2 max-w-[300px] text-center text-body-lg text-slate">
          You gave {pendingReRunFood.name.toLowerCase()} {STAR_WORD[pendingReRunReview.stars]} in{' '}
          {monthName(pendingReRunReview.createdAt)}.
          <br />
          Reviewers change their minds. About one in five do.
        </p>
      </div>

      <div className="safe-bottom flex flex-col gap-1 px-5 pt-4">
        <Button onClick={startReRun}>Review it again</Button>
        {/* Same size, same weight, no fill. Turning this down is a real option. */}
        <Button variant="quiet" onClick={declineReRun}>
          Still no
        </Button>
      </div>
    </Screen>
  )
}
