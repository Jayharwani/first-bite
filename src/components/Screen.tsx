import type { ReactNode } from 'react'

/**
 * Layout wrapper for a screen's contents.
 *
 * The enter/exit animation deliberately lives on the single keyed motion
 * element in App, not here: AnimatePresence only learns that an exit has
 * finished from its own direct child, so the transition has exactly one
 * owner.
 */
export default function Screen({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={['flex min-h-0 flex-1 flex-col', className].join(' ')}>{children}</div>
}
