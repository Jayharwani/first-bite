import type { AppState, Review } from '../types'
import { FOODS } from '../data/foods'

const KEY = 'heynouri.firstbite.v1'

/** The kid's name, printed on every card. One constant, one place. */
export const REVIEWER_NAME = 'Hayley'

const daysAgo = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/**
 * Four reviews already in the deck on first run, so the collection reads as
 * a record of a habit rather than an empty grid.
 *
 * The ratings are deliberately spread and the 1-star carries a note. A demo
 * where everything is five stars would quietly argue the opposite of the
 * product: that we are still hoping they like it.
 */
const seedReviews = (): Review[] => [
  {
    foodId: 'brussels-sprout',
    stars: 1,
    tags: ['weird-smell', 'not-again', 'mushy'],
    note: 'It smelled like the inside of a bin. I did touch it though.',
    stepsCompleted: ['look', 'smell', 'touch'],
    bailedAt: 'taste',
    createdAt: daysAgo(23),
  },
  {
    foodId: 'olive',
    stars: 3,
    tags: ['sour', 'looks-worse', 'squeaky'],
    note: 'Salty in a way I did not expect. The middle bit is the worst part.',
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: daysAgo(16),
  },
  {
    foodId: 'sardine',
    stars: 2,
    tags: ['weird-smell', 'too-soft'],
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: daysAgo(9),
  },
  {
    foodId: 'grapefruit',
    stars: 5,
    tags: ['sour', 'surprisingly-ok', 'actually-fine'],
    note: 'Sour but good sour. Would eat again.',
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: daysAgo(2),
  },
]

/** The food on offer this week: the first one nobody has reviewed yet. */
const firstUnreviewed = (reviews: Review[]): string => {
  const done = new Set(reviews.map((r) => r.foodId))
  return (FOODS.find((f) => !done.has(f.id)) ?? FOODS[0]).id
}

const freshState = (): AppState => {
  const reviews = seedReviews()
  return {
    version: 1,
    currentFoodId: firstUnreviewed(reviews),
    shuffleUsed: false,
    reviews,
    exploredCount: reviews.length,
  }
}

/** Narrow an unknown parsed blob to AppState, or reject it. */
const isAppState = (v: unknown): v is AppState => {
  if (typeof v !== 'object' || v === null) return false
  const s = v as Partial<AppState>
  return s.version === 1 && Array.isArray(s.reviews)
}

export const load = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const initial = freshState()
      save(initial)
      return initial
    }
    const parsed: unknown = JSON.parse(raw)
    if (!isAppState(parsed)) throw new Error('shape mismatch')
    // exploredCount is derived, never trusted from disk.
    return { ...parsed, exploredCount: parsed.reviews.length }
  } catch {
    // Corrupt or superseded payload: start clean rather than crash the app.
    const initial = freshState()
    save(initial)
    return initial
  }
}

export const save = (state: AppState): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Private mode or a full quota. The session still works in memory.
  }
}

export const reset = (): void => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to undo */
  }
}

export const reviewFor = (state: AppState, foodId: string | null): Review | undefined =>
  foodId ? state.reviews.find((r) => r.foodId === foodId) : undefined
