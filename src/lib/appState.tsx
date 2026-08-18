import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppState, Review, ScreenName, Stars, TrialStep } from '../types'
import { FOODS, foodById } from '../data/foods'
import {
  load,
  save,
  reset as clearStorage,
  REVIEWER_NAME,
  latestReviewFor,
  foodsReviewedCount,
  pendingReRunFoodId,
  reviewsFor,
  isToday,
} from './storage'

export type Draft = {
  stars: Stars | null
  tags: string[]
  note: string
  stepsCompleted: TrialStep[]
  bailedAt?: TrialStep
}

const emptyDraft = (): Draft => ({ stars: null, tags: [], note: '', stepsCompleted: [] })

type Ctx = {
  state: AppState
  screen: ScreenName
  draft: Draft
  reviewerName: string
  /** This week's drop. */
  currentFood: ReturnType<typeof foodById>
  /** The food a trial is actually running on — a re-run overrides the drop. */
  activeFood: ReturnType<typeof foodById>
  currentReview: Review | undefined
  mintReview: Review | undefined
  /** The food being offered a second opinion, if any. */
  pendingReRunFood: ReturnType<typeof foodById>
  pendingReRunReview: Review | undefined
  /** What the Today card shows. One source of truth for Home and the FAB. */
  homeState: 'reRun' | 'done' | 'drop'
  foodsReviewed: number
  go: (s: ScreenName) => void
  shuffle: () => void
  startTrial: () => void
  startReRun: () => void
  declineReRun: () => void
  finishTrial: (stepsCompleted: TrialStep[], bailedAt?: TrialStep) => void
  setDraft: (patch: Partial<Draft>) => void
  toggleTag: (id: string) => void
  publish: () => void
  openExistingCard: () => void
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(location.search).has('reset')) {
      clearStorage()
      history.replaceState(null, '', location.pathname)
    }
    return load()
  })
  const [screen, setScreen] = useState<ScreenName>('home')
  const [draft, setDraftRaw] = useState<Draft>(emptyDraft)
  const [mintFoodId, setMintFoodId] = useState<string | null>(null)
  // Not persisted: a re-run is a property of this session, not of the save.
  const [reRunFoodId, setReRunFoodId] = useState<string | null>(null)

  const commit = useCallback((next: AppState) => {
    const withCount = { ...next, exploredCount: next.reviews.length }
    setStateRaw(withCount)
    save(withCount)
  }, [])

  const currentFood = foodById(state.currentFoodId)
  const activeFoodId = reRunFoodId ?? state.currentFoodId
  const activeFood = foodById(activeFoodId)
  const currentReview = latestReviewFor(state, state.currentFoodId)
  const mintReview = latestReviewFor(state, mintFoodId)

  const reRunId = pendingReRunFoodId(state)
  const pendingReRunFood = foodById(reRunId)
  const pendingReRunReview = latestReviewFor(state, reRunId)

  /**
   * A mission finished today keeps the Today card for the rest of the day.
   * A second opinion is allowed to replace the weekly *offer*, but not to
   * wipe work the kid has just done — that reads as the mission resetting.
   */
  const completedToday = Boolean(currentReview && isToday(currentReview.createdAt))
  const homeState: 'reRun' | 'done' | 'drop' =
    !completedToday && pendingReRunFood && pendingReRunReview
      ? 'reRun'
      : currentReview
        ? 'done'
        : 'drop'

  const go = useCallback((s: ScreenName) => setScreen(s), [])

  const shuffle = useCallback(() => {
    if (state.shuffleUsed) return
    const reviewed = new Set(state.reviews.map((r) => r.foodId))
    const options = FOODS.filter((f) => !reviewed.has(f.id) && f.id !== state.currentFoodId)
    if (options.length === 0) return
    const next = options[Math.floor(Math.random() * options.length)]
    commit({ ...state, currentFoodId: next.id, shuffleUsed: true })
  }, [state, commit])

  const startTrial = useCallback(() => {
    setReRunFoodId(null)
    setDraftRaw(emptyDraft())
    setScreen('trial')
  }, [])

  /** Straight to the trial. The kid already knows what the food is. */
  const startReRun = useCallback(() => {
    if (!reRunId) return
    setReRunFoodId(reRunId)
    setDraftRaw(emptyDraft())
    setScreen('trial')
  }, [reRunId])

  /**
   * Logged, and then nothing. No toast, no counter-offer, no consequence.
   * The silence is the feature.
   */
  const declineReRun = useCallback(() => {
    if (!reRunId) return
    commit({
      ...state,
      declinedReRuns: [...state.declinedReRuns, { foodId: reRunId, at: new Date().toISOString() }],
    })
    setScreen('home')
  }, [reRunId, state, commit])

  const finishTrial = useCallback((stepsCompleted: TrialStep[], bailedAt?: TrialStep) => {
    setDraftRaw((d) => ({ ...d, stepsCompleted, bailedAt }))
    setScreen('review')
  }, [])

  const setDraft = useCallback((patch: Partial<Draft>) => {
    setDraftRaw((d) => ({ ...d, ...patch }))
  }, [])

  // Derived inside the updater, never from a value captured at render. Two
  // chips tapped in the same frame would otherwise both read an empty list.
  const toggleTag = useCallback((id: string) => {
    setDraftRaw((d) => ({
      ...d,
      tags: d.tags.includes(id) ? d.tags.filter((t) => t !== id) : [...d.tags, id],
    }))
  }, [])

  const publish = useCallback(() => {
    if (!activeFoodId || draft.stars === null) return
    const previous = reviewsFor(state, activeFoodId)
    const review: Review = {
      foodId: activeFoodId,
      // Appended, never replacing. The earlier runs are the whole point.
      runNumber: previous.length + 1,
      stars: draft.stars,
      tags: draft.tags,
      note: draft.note.trim() ? draft.note.trim() : undefined,
      stepsCompleted: draft.stepsCompleted,
      bailedAt: draft.bailedAt,
      createdAt: new Date().toISOString(),
    }
    setMintFoodId(activeFoodId)
    setReRunFoodId(null)
    commit({ ...state, reviews: [...state.reviews, review] })
    setScreen('mint')
  }, [state, draft, activeFoodId, commit])

  const openExistingCard = useCallback(() => {
    setMintFoodId(state.currentFoodId)
    setScreen('mint')
  }, [state.currentFoodId])

  const value = useMemo<Ctx>(
    () => ({
      state,
      screen,
      draft,
      reviewerName: REVIEWER_NAME,
      currentFood,
      activeFood,
      currentReview,
      mintReview,
      pendingReRunFood,
      pendingReRunReview,
      homeState,
      foodsReviewed: foodsReviewedCount(state),
      go,
      shuffle,
      startTrial,
      startReRun,
      declineReRun,
      finishTrial,
      setDraft,
      toggleTag,
      publish,
      openExistingCard,
    }),
    [
      state,
      screen,
      draft,
      currentFood,
      activeFood,
      currentReview,
      mintReview,
      pendingReRunFood,
      pendingReRunReview,
      homeState,
      go,
      shuffle,
      startTrial,
      startReRun,
      declineReRun,
      finishTrial,
      setDraft,
      toggleTag,
      publish,
      openExistingCard,
    ],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export const useApp = (): Ctx => {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
