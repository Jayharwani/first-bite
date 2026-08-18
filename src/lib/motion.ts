import { useEffect, useState } from 'react'
import type { Transition } from 'framer-motion'

export const spring = {
  soft: { type: 'spring', stiffness: 260, damping: 30 } as Transition, // default transitions
  snap: { type: 'spring', stiffness: 420, damping: 26 } as Transition, // taps, toggles
  bloom: { type: 'spring', stiffness: 180, damping: 18 } as Transition, // the card mint only
}

export const instant: Transition = { duration: 0 }

/** Live subscription — the user can flip the OS setting while the app is open. */
export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * Every animated component pulls its springs through here. When reduced
 * motion is on, all three collapse to a zero-duration transition, so
 * positions still resolve correctly but nothing travels.
 */
export const useSprings = () => {
  const reduced = useReducedMotion()
  return {
    reduced,
    soft: reduced ? instant : spring.soft,
    snap: reduced ? instant : spring.snap,
    bloom: reduced ? instant : spring.bloom,
    /** Press feedback, suppressed entirely under reduced motion. */
    tap: reduced ? {} : { scale: 0.97 },
  }
}
