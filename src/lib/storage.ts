import type { AppState, AppStateV1, FoodHistory, Review, Stars } from '../types'
import { FOODS } from '../data/foods'

const KEY = 'heynouri.firstbite.v1'

/** The kid's name, printed on every card. One constant, one place. */
export const REVIEWER_NAME = 'Hayley'

/** How long a declined food stays quiet. */
const DECLINE_QUIET_WEEKS = 3

/**
 * How long *every* re-run stays quiet after any decline.
 *
 * Without this, turning one food down immediately surfaces the next
 * candidate, which is nagging dressed as a feature. The button says "Not
 * this week", so a week is what it has to mean.
 */
const DECLINE_COOLDOWN_DAYS = 7

/**
 * How long a food must have been left alone before it can come back.
 *
 * Without this a review published a minute ago already qualifies, and the
 * app offers to re-review the thing the kid just finished. A rematch only
 * means anything once the memory has faded — the seeded radish arc runs
 * across months, not minutes.
 */
const RERUN_MIN_GAP_DAYS = 21

const daysAgo = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/** Mid-month, so subtracting months can never roll over a short one. */
const monthsAgo = (n: number): string => {
  const d = new Date()
  d.setDate(15)
  d.setMonth(d.getMonth() - n)
  return d.toISOString()
}

export const monthLabel = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'short' })

export const monthName = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'long' })


/**
 * Four reviews already in the deck on first run, plus two foods that carry
 * the re-run story.
 *
 * Radish is the whole argument in one card: one star in March, two in April,
 * four in June. The notes have to sound like the same kid getting bored of
 * their own objection, not like a testimonial.
 *
 * Cucumber is deliberately left mid-arc at two stars so something is still
 * unresolved and the Second Opinion prompt has somewhere to point.
 */
const seedReviews = (): Review[] => [
  {
    foodId: 'radish',
    runNumber: 1,
    stars: 1,
    tags: ['bitter', 'not-again'],
    note: 'Tastes like a spicy rock.',
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: monthsAgo(5),
  },
  {
    foodId: 'radish',
    runNumber: 2,
    stars: 2,
    tags: ['bitter', 'crunchy'],
    note: 'Still spicy. Slightly less rock.',
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: monthsAgo(4),
  },
  {
    foodId: 'radish',
    runNumber: 3,
    stars: 4,
    tags: ['crunchy', 'surprisingly-ok'],
    note: 'Fine if it is thin. I was wrong about the rock.',
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: monthsAgo(2),
  },
  {
    foodId: 'cucumber',
    runNumber: 1,
    stars: 2,
    tags: ['squeaky', 'too-soft'],
    note: 'Squeaks on my teeth. Weird.',
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: monthsAgo(4),
  },
  {
    foodId: 'brussels-sprout',
    runNumber: 1,
    stars: 1,
    tags: ['weird-smell', 'not-again', 'mushy'],
    note: 'It smelled like the inside of a bin. I did touch it though.',
    stepsCompleted: ['look', 'smell', 'touch'],
    bailedAt: 'taste',
    createdAt: daysAgo(23),
  },
  {
    foodId: 'olive',
    runNumber: 1,
    stars: 3,
    tags: ['sour', 'looks-worse', 'squeaky'],
    note: 'Salty in a way I did not expect. The middle bit is the worst part.',
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: daysAgo(16),
  },
  {
    foodId: 'sardine',
    runNumber: 1,
    stars: 2,
    tags: ['weird-smell', 'too-soft'],
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: daysAgo(9),
  },
  {
    foodId: 'seaweed',
    runNumber: 1,
    stars: 3,
    tags: ['looks-worse', 'actually-fine'],
    note: 'Like a crisp made of the sea. Not bad.',
    stepsCompleted: ['look', 'smell', 'touch', 'taste'],
    createdAt: daysAgo(5),
  },
  {
    foodId: 'grapefruit',
    runNumber: 1,
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
    version: 2,
    currentFoodId: firstUnreviewed(reviews),
    shuffleUsed: false,
    reviews,
    exploredCount: reviews.length,
    declinedReRuns: [],
  }
}

/**
 * Bring any recognised payload up to the current shape. A returning kid must
 * never lose their deck to a schema change, so this upgrades in place and
 * only gives up when the blob is unrecognisable.
 */
const migrate = (raw: unknown): AppState | null => {
  if (typeof raw !== 'object' || raw === null) return null
  const blob = raw as Partial<AppState>
  if (!Array.isArray(blob.reviews)) return null

  if (blob.version === 2) {
    return {
      ...(blob as AppState),
      exploredCount: blob.reviews.length,
      declinedReRuns: Array.isArray(blob.declinedReRuns) ? blob.declinedReRuns : [],
    }
  }

  if (blob.version === 1) {
    const v1 = raw as AppStateV1
    return {
      version: 2,
      currentFoodId: v1.currentFoodId,
      shuffleUsed: v1.shuffleUsed,
      // Everything written before re-runs existed was, by definition, run one.
      reviews: v1.reviews.map((r) => ({ ...r, runNumber: 1 })),
      exploredCount: v1.reviews.length,
      declinedReRuns: [],
    }
  }

  return null
}

export const load = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const initial = freshState()
      save(initial)
      return initial
    }
    const migrated = migrate(JSON.parse(raw) as unknown)
    if (!migrated) throw new Error('shape mismatch')
    // Persist the upgrade so migration runs once, not on every load.
    save(migrated)
    return migrated
  } catch {
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

// ---- derivations. Nothing below this line is stored. ----

const byDate = (a: Review, b: Review) => Date.parse(a.createdAt) - Date.parse(b.createdAt)

export const reviewsFor = (state: AppState, foodId: string): Review[] =>
  state.reviews.filter((r) => r.foodId === foodId).sort(byDate)

/** The review that represents a food now: its most recent run. */
export const latestReviewFor = (state: AppState, foodId: string | null): Review | undefined => {
  if (!foodId) return undefined
  const all = reviewsFor(state, foodId)
  return all[all.length - 1]
}

/** One entry per food. Drives the deck, which shows foods and not runs. */
export const latestReviews = (state: AppState): Review[] =>
  [...new Set(state.reviews.map((r) => r.foodId))]
    .map((id) => latestReviewFor(state, id))
    .filter((r): r is Review => Boolean(r))
    .sort(byDate)

/** Distinct foods reviewed. Diverges from reviews.length once re-runs exist. */
export const foodsReviewedCount = (state: AppState): number =>
  new Set(state.reviews.map((r) => r.foodId)).size

export const historyFor = (state: AppState, foodId: string): FoodHistory => ({
  foodId,
  entries: reviewsFor(state, foodId).map((r) => ({
    stars: r.stars as Stars,
    month: monthLabel(r.createdAt),
  })),
})

const declinedRecently = (state: AppState, foodId: string): boolean => {
  const cutoff = Date.now() - DECLINE_QUIET_WEEKS * 7 * 24 * 60 * 60 * 1000
  return state.declinedReRuns.some((d) => d.foodId === foodId && Date.parse(d.at) > cutoff)
}

/**
 * A food comes back when the kid did not get on with it, has not already
 * worked it to death, and has not just said no.
 *
 * When several qualify, the one that has been quiet longest wins — the point
 * is to revisit something that has faded, not to nag about last week.
 */
export const pendingReRunFoodId = (state: AppState): string | null => {
  const cooldown = Date.now() - DECLINE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000
  if (state.declinedReRuns.some((d) => Date.parse(d.at) > cooldown)) return null

  const candidates = [...new Set(state.reviews.map((r) => r.foodId))]
    .map((id) => ({ id, all: reviewsFor(state, id) }))
    .filter(({ id, all }) => {
      const latest = all[all.length - 1]
      const gapCutoff = Date.now() - RERUN_MIN_GAP_DAYS * 24 * 60 * 60 * 1000
      return (
        latest.stars <= 2 &&
        all.length < 4 &&
        Date.parse(latest.createdAt) < gapCutoff &&
        !declinedRecently(state, id)
      )
    })
    .sort(
      (a, b) =>
        Date.parse(a.all[a.all.length - 1].createdAt) -
        Date.parse(b.all[b.all.length - 1].createdAt),
    )
  return candidates[0]?.id ?? null
}
