import { motion } from 'framer-motion'
import { Apple, Trophy, MessageCircle, User, Plus } from 'lucide-react'
import type { ScreenName } from '../types'
import { useSprings } from '../lib/motion'

type Tab = {
  id: string
  label: string
  icon: typeof Apple
  screen?: ScreenName
}

/**
 * Chat and Profile belong to the wider Hey Nouri app and are out of scope
 * here, so they render disabled rather than pretending to work. Progress
 * points at the deck, which is genuinely what it would show.
 */
const LEFT: Tab[] = [
  { id: 'today', label: 'Today', icon: Apple, screen: 'home' },
  { id: 'progress', label: 'Progress', icon: Trophy, screen: 'deck' },
]
const RIGHT: Tab[] = [
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
]

function TabButton({
  tab,
  active,
  onSelect,
}: {
  tab: Tab
  active: boolean
  onSelect: (s: ScreenName) => void
}) {
  const { tap, snap } = useSprings()
  const Icon = tab.icon
  const enabled = Boolean(tab.screen)

  return (
    <motion.button
      type="button"
      disabled={!enabled}
      onClick={() => tab.screen && onSelect(tab.screen)}
      whileTap={enabled ? tap : {}}
      transition={snap}
      aria-current={active ? 'page' : undefined}
      aria-label={enabled ? tab.label : `${tab.label} — not part of this prototype`}
      className={[
        'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-tile',
        enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-40',
        active ? 'text-sprout-deep' : 'text-slate',
      ].join(' ')}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
      <span className="text-[10px] font-semibold leading-none">{tab.label}</span>
    </motion.button>
  )
}

export default function TabBar({
  screen,
  onSelect,
  onAdd,
}: {
  screen: ScreenName
  onSelect: (s: ScreenName) => void
  onAdd: () => void
}) {
  const { tap, snap } = useSprings()

  return (
    <nav
      aria-label="Main"
      className="relative shrink-0 border-t border-hairline bg-paper px-3 pt-2"
      style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-stretch">
        {LEFT.map((t) => (
          <TabButton key={t.id} tab={t} active={screen === t.screen} onSelect={onSelect} />
        ))}
        <span className="w-16 shrink-0" aria-hidden="true" />
        {RIGHT.map((t) => (
          <TabButton key={t.id} tab={t} active={false} onSelect={onSelect} />
        ))}
      </div>

      <motion.button
        type="button"
        onClick={onAdd}
        whileTap={tap}
        transition={snap}
        aria-label="Start this week&rsquo;s First Bite trial"
        /* Centring lives here rather than in -translate-x-1/2 -translate-y-1/2.
           Framer writes the whole `transform` property, so a Tailwind translate
           utility is erased the instant whileTap applies a scale — the button
           jumps half its size down and right, and the pointerup then lands
           outside it, swallowing the first click. As motion values, x and y
           compose with scale instead of fighting it. */
        style={{ x: '-50%', y: '-50%' }}
        className="absolute left-1/2 top-0 flex h-14 w-14 cursor-pointer items-center justify-center rounded-pill bg-sprout shadow-fab"
      >
        <Plus size={26} strokeWidth={2.75} className="text-ink" aria-hidden="true" />
      </motion.button>
    </nav>
  )
}
