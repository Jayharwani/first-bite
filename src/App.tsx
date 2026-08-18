import { AnimatePresence, motion } from 'framer-motion'
import TabBar from './components/TabBar'
import Home from './screens/Home'
import Drop from './screens/Drop'
import Trial from './screens/Trial'
import ReviewScreen from './screens/Review'
import Mint from './screens/Mint'
import Deck from './screens/Deck'
import SecondOpinion from './screens/SecondOpinion'
import { useApp } from './lib/appState'
import { useSprings } from './lib/motion'

/** Top-level destinations. The trial itself is a flow, so it hides the bar. */
const TOP_LEVEL = new Set(['home', 'deck'])

export default function App() {
  const { screen, go, currentReview, openExistingCard } = useApp()
  const { soft, reduced } = useSprings()

  const SCREENS = {
    home: <Home />,
    drop: <Drop />,
    trial: <Trial />,
    review: <ReviewScreen />,
    mint: <Mint />,
    deck: <Deck />,
    secondOpinion: <SecondOpinion />,
  } as const

  // The centre button resumes rather than restarts once a review exists.
  const onAdd = () => (currentReview ? openExistingCard() : go('drop'))

  return (
    <div className="app-frame">
      <div className="app-shell">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={soft}
            className="flex min-h-0 flex-1 flex-col"
          >
            {SCREENS[screen]}
          </motion.div>
        </AnimatePresence>
        {TOP_LEVEL.has(screen) ? (
          <TabBar screen={screen} onSelect={go} onAdd={onAdd} />
        ) : null}
      </div>
    </div>
  )
}
