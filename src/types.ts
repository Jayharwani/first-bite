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
  stars: Stars
  tags: string[] // tag ids from data/tags.ts
  note?: string // free text, max 140 chars
  stepsCompleted: TrialStep[] // may be partial — that is fine
  bailedAt?: TrialStep // which step they stopped at, if any
  createdAt: string // ISO
}

export type AppState = {
  version: 1
  currentFoodId: string | null
  shuffleUsed: boolean
  reviews: Review[]
  exploredCount: number // = reviews.length. Never counts "eaten".
}

export type ScreenName = 'home' | 'drop' | 'trial' | 'review' | 'mint' | 'deck'

export const TRIAL_STEPS: TrialStep[] = ['look', 'smell', 'touch', 'taste']
