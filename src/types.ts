export type Food = {
  id: string
  name: string // "Roasted red pepper"
  emoji: string // single emoji, used as the card art
  category: 'vegetable' | 'fruit' | 'grain' | 'protein' | 'other'
  colorWash: 'green' | 'yellow' | 'blue' | 'clay'
  /** A neutral, curiosity-framed fact. Never a health claim. */
  hook: string
}

export type TrialStep = 'look' | 'smell' | 'touch' | 'taste'

export type Stars = 1 | 2 | 3 | 4 | 5

export type Review = {
  foodId: string
  /** 1 for the first review, 2+ for a re-run of the same food. */
  runNumber: number
  stars: Stars
  tags: string[] // tag ids from data/tags.ts
  note?: string // free text, max 140 chars
  stepsCompleted: TrialStep[] // may be partial — that is fine
  bailedAt?: TrialStep // which step they stopped at, if any
  createdAt: string // ISO
}

export type AppState = {
  version: 2
  currentFoodId: string | null
  shuffleUsed: boolean
  reviews: Review[]
  exploredCount: number // = reviews.length. Never counts "eaten".
  /** Every time a re-run was turned down. Carries no penalty of any kind. */
  declinedReRuns: { foodId: string; at: string }[]
}

/** The shape written by the version before re-runs existed. */
export type AppStateV1 = Omit<AppState, 'version' | 'declinedReRuns' | 'reviews'> & {
  version: 1
  reviews: Omit<Review, 'runNumber'>[]
}

/**
 * Peer opinion data. Ships as static seed data — there is no backend.
 *
 * Everything here describes a food. Nothing here describes a child. See
 * PeerBlock for why that line is load-bearing rather than stylistic.
 */
export type PeerStats = {
  foodId: string
  reviewerCount: number // must be >= 10 to render
  topTags: { tag: string; percent: number }[] // max 3, sorted desc
  neverAgainCount: number
  changedMindCount: number // rated higher on a later re-run
}

/** Derived at read time from reviews. Never stored. */
export type FoodHistory = {
  foodId: string
  entries: { stars: Stars; month: string }[] // month = "Mar", "Apr"
}

export type ScreenName =
  | 'home'
  | 'drop'
  | 'trial'
  | 'review'
  | 'mint'
  | 'deck'
  | 'secondOpinion'

export const TRIAL_STEPS: TrialStep[] = ['look', 'smell', 'touch', 'taste']
