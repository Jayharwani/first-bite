import { Fragment } from 'react'
import type { FoodHistory } from '../types'

/**
 * The kid's own ratings, oldest to newest.
 *
 * A rise is marked by colouring the connector sprout and by nothing else. No
 * arrow, no label, no "you're improving". The strip states what happened and
 * leaves the conclusion to the person who lived it — writing that conclusion
 * for them is exactly the moment this feature exists to protect.
 */
export default function HistoryStrip({
  history,
  scale = 1,
}: {
  history: FoodHistory
  scale?: number
}) {
  const s = (n: number) => `${n * scale}px`
  const { entries } = history
  const lastIndex = entries.length - 1

  return (
    <div>
      <ol className="flex items-start">
        {entries.map((entry, i) => {
          const improved = i > 0 && entry.stars > entries[i - 1].stars
          const isLatest = i === lastIndex
          return (
            <Fragment key={`${entry.month}-${i}`}>
              {i > 0 ? (
                <li
                  aria-hidden="true"
                  className="shrink-0 grow"
                  style={{
                    height: 1,
                    marginTop: s(20),
                    backgroundColor: improved ? '#8FC96B' : '#EAEBE7',
                  }}
                />
              ) : null}
              <li className="flex shrink-0 flex-col items-center" style={{ width: s(40) }}>
                <span
                  className={[
                    'tnum flex items-center justify-center rounded-pill font-bold',
                    isLatest ? 'bg-ink text-paper' : 'bg-paper text-ink',
                  ].join(' ')}
                  style={{ width: s(40), height: s(40), fontSize: s(16), lineHeight: 1 }}
                >
                  {entry.stars}
                </span>
                <span
                  className="text-slate"
                  style={{ fontSize: s(13), lineHeight: s(18), marginTop: s(5) }}
                >
                  {entry.month}
                </span>
              </li>
            </Fragment>
          )
        })}
      </ol>

      {entries.length === 1 ? (
        // slate, not mist: this line sits on a wash surface, where mist
        // measures 3.76:1 and misses the AA floor the feature is held to.
        <p className="text-slate" style={{ fontSize: s(13), lineHeight: s(18), marginTop: s(8) }}>
          First review
        </p>
      ) : null}
    </div>
  )
}
