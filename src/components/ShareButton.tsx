import { useState, type RefObject } from 'react'
import { Share2 } from 'lucide-react'
import Button from './Button'
import { shareCard } from '../lib/cardImage'

type Props = {
  /** The card node to rasterise. */
  targetRef: RefObject<HTMLElement | null>
  foodId: string
  label?: string
  /** Sitting on the scrim rather than on canvas, so the status needs a fill. */
  onDark?: boolean
}

/**
 * One share control for both places a card can be shared from — the mint
 * moment and any card reopened from the deck — so the timeout, the fallback
 * to download and the wording never drift apart.
 */
export default function ShareButton({
  targetRef,
  foodId,
  label = 'Share my review',
  onDark = false,
}: Props) {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const onClick = async () => {
    const node = targetRef.current
    if (!node || busy) return
    setBusy(true)
    setStatus(null)
    const result = await shareCard(node, `first-bite-${foodId}.png`)
    setBusy(false)
    setStatus(
      result === 'shared'
        ? 'Shared.'
        : result === 'downloaded'
          ? 'Saved to your downloads.'
          : 'Could not save the card. Try again.',
    )
  }

  return (
    <>
      <Button onClick={onClick} disabled={busy}>
        <span className="flex items-center gap-2">
          <Share2 size={18} strokeWidth={2.25} aria-hidden="true" />
          {busy ? 'Preparing…' : label}
        </span>
      </Button>

      <div className="mt-2 flex min-h-[18px] justify-center" aria-live="polite">
        {status ? (
          onDark ? (
            // Plain text would have to survive the scrim over whatever card is
            // behind it. A solid chip is legible over all of them.
            <span className="rounded-pill bg-ink px-3 py-1 text-caption font-semibold text-paper">
              {status}
            </span>
          ) : (
            <span className="text-caption text-slate">{status}</span>
          )
        ) : null}
      </div>
    </>
  )
}
