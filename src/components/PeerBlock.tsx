import type { PeerStats } from '../types'
import { tagLabel } from '../data/tags'
import { PEER_MIN_SAMPLE } from '../data/peerStats'

/**
 * What other kids said about this food.
 *
 * Every line describes the food. Not one line describes a child, and none of
 * it can be arranged into a ranking — no per-child counts, no streaks, no
 * names. In a weight-management product aimed at children, comparing them to
 * each other is the one thing that cannot be built, so the guardrail lives in
 * the data shape rather than in a review checklist.
 *
 * Below the minimum sample the block is absent outright: no placeholder, no
 * "not enough data yet". A small sample dressed as a finding is worse than
 * silence.
 */
export default function PeerBlock({
  stats,
  foodName,
  scale = 1,
}: {
  stats: PeerStats | undefined
  foodName: string
  scale?: number
}) {
  if (!stats || stats.reviewerCount < PEER_MIN_SAMPLE) return null

  const s = (n: number) => `${n * scale}px`
  const top = stats.topTags[0]

  const line = { fontSize: s(11), lineHeight: s(15) }
  const Num = ({ children }: { children: React.ReactNode }) => (
    <span className="tnum font-bold text-ink">{children}</span>
  )

  return (
    <ul className="text-slate" style={{ display: 'grid', rowGap: s(8) }}>
      <li style={line}>
        <Num>{stats.reviewerCount}</Num> Nouri kids reviewed {foodName.toLowerCase()}
      </li>

      {top ? (
        <li style={line}>
          <Num>{top.percent}%</Num> said &ldquo;{tagLabel(top.tag)}&rdquo;
        </li>
      ) : null}

      <li style={line}>
        <Num>{stats.neverAgainCount}</Num> said never again
      </li>

      {/* Below three this is an anecdote, not a pattern. */}
      {stats.changedMindCount >= 3 ? (
        <li style={line}>
          <Num>{stats.changedMindCount}</Num> changed their mind on a re-run
        </li>
      ) : null}
    </ul>
  )
}
