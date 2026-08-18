import type { Food, FoodHistory, PeerStats } from '../types'
import HistoryStrip from './HistoryStrip'
import PeerBlock from './PeerBlock'

const WASH: Record<Food['colorWash'], string> = {
  green: '#EDF5E6',
  yellow: '#F7F3D4',
  blue: '#DCE7F0',
  clay: '#F6DDDA',
}

/**
 * The reverse face. Same dimensions, same wash, same corner radius as the
 * front, because it has to read as the other side of one object rather than
 * a second screen.
 *
 * The front is what you thought. The back is what you used to think, and
 * what everyone else thinks.
 */
export default function CardBack({
  food,
  history,
  stats,
  scale = 1,
}: {
  food: Food
  history: FoodHistory
  stats: PeerStats | undefined
  scale?: number
}) {
  const s = (n: number) => `${n * scale}px`

  const divider = (
    <div
      aria-hidden="true"
      style={{ height: 1, backgroundColor: '#EAEBE7', margin: `${s(16)} 0` }}
    />
  )

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        width: s(260),
        height: s(360),
        borderRadius: s(24),
        backgroundColor: WASH[food.colorWash],
        padding: s(20),
      }}
    >
      {/* A label, not a title — the front already introduced this food. */}
      <div className="flex items-center justify-between" style={{ gap: s(8) }}>
        <span role="img" aria-hidden="true" style={{ fontSize: s(28), lineHeight: 1 }}>
          {food.emoji}
        </span>
        <span
          className="truncate font-bold text-ink"
          style={{ fontSize: s(13), lineHeight: s(18) }}
        >
          {food.name}
        </span>
      </div>

      {divider}

      <HistoryStrip history={history} scale={scale} />

      {divider}

      <PeerBlock stats={stats} foodName={food.name} scale={scale} />

      <div
        className="mt-auto text-center font-semibold text-ink/40"
        style={{ fontSize: s(9), lineHeight: s(12) }}
      >
        hey nouri
      </div>
    </div>
  )
}
