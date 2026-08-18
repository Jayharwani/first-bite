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
import { load, save, reset as clearStorage, REVIEWER_NAME } from './storage'

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
  currentFood: ReturnType<typeof foodById>
  currentReview: Review | undefined
  /** The card Mint should show. */
  mintReview: Review | undefined
  go: (s: ScreenName) => void
  shuffle: () => void
  startTrial: () => void
  finishTrial: (stepsCompleted: TrialStep[], bailedAt?: TrialStep) => void
  setDraft: (patch: Partial<Draft>) => void
  toggleTag: (id: string) => void
  publish: () => void
  openExistingCard: () => void
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  // `?reset=1` wipes storage before the first read. Lets anyone replay the
  // whole flow from a shared link without a settings screen.
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

  const commit = useCallback((next: AppState) => {
    const withCount = { ...next, exploredCount: next.reviews.length }
    setStateRaw(withCount)
    save(withCount)
  }, [])

  const currentFood = foodById(state.currentFoodId)
  const currentReview = state.reviews.find((r) => r.foodId === state.currentFoodId)
  const mintReview = state.reviews.find((r) => r.foodId === mintFoodId)

  const go = useCallback((s: ScreenName) => setScreen(s), [])

  const shuffle = useCallback(() => {
    if (state.shuffleUsed) return
    const reviewed = new Set(state.reviews.map((r) => r.foodId))
    const options = FOODS.filter((f) => !reviewed.has(f.id) && f.id !== state.currentFoodId)
    if (options.length === 0) return
    // Deterministic enough for a demo and avoids repeating the same food.
    const next = options[Math.floor(Math.random() * options.length)]
    commit({ ...state, currentFoodId: next.id, shuffleUsed: true })
  }, [state, commit])

  const startTrial = useCallback(() => {
    setDraftRaw(emptyDraft())
    setScreen('trial')
  }, [])

  const finishTrial = useCallback((stepsCompleted: TrialStep[], bailedAt?: TrialStep) => {
    setDraftRaw((d) => ({ ...d, stepsCompleted, bailedAt }))
    setScreen('review')
  }, [])

  const setDraft = useCallback((patch: Partial<Draft>) => {
    setDraftRaw((d) => ({ ...d, ...patch }))
  }, [])

  // Derived from the previous draft inside the updater, never from a value
  // captured at render. Two chips tapped in the same frame would otherwise
  // both read an empty list and the second would erase the first.
  const toggleTag = useCallback((id: string) => {
    setDraftRaw((d) => ({
      ...d,
      tags: d.tags.includes(id) ? d.tags.filter((t) => t !== id) : [...d.tags, id],
    }))
  }, [])

  const publish = useCallback(() => {
    if (!state.currentFoodId || draft.stars === null) return
    const review: Review = {
      foodId: state.currentFoodId,
      stars: draft.stars,
      tags: draft.tags,
      note: draft.note.trim() ? draft.note.trim() : undefined,
      stepsCompleted: draft.stepsCompleted,
      bailedAt: draft.bailedAt,
      createdAt: new Date().toISOString(),
    }
    const reviews = [...state.reviews.filter((r) => r.foodId !== review.foodId), review]
    setMintFoodId(review.foodId)
    commit({ ...state, reviews })
    setScreen('mint')
  }, [state, draft, commit])

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
      currentReview,
      mintReview,
      go,
      shuffle,
      startTrial,
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
      currentReview,
      mintReview,
      go,
      shuffle,
      startTrial,
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
