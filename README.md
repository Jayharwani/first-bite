# First Bite

**The current app asks kids whether they ate the broccoli. First Bite asks them what they thought of it.**

A feature prototype for [Hey Nouri](https://heynouri.com/), the pediatric weight-management app for 9-to-18-year-olds. One new food a week. The kid does not have to eat it. They have to review it.

---

## Why it exists

The app today handles new foods with a pass/fail checkbox — *"Broccoli for dinner"* with a tick and an X. A kid who refuses gets an X. A kid who wants the points taps the tick and lies.

First Bite deletes the fail state. A one-star review earns exactly the same credit as a five-star one, because the reward is attached to **exploring**, never to **eating**.

## The seven rules the build is held to

1. **There is no fail state.** A one-star review is a completed mission.
2. **We reward exploring, never eating.** No reward is ever gated on swallowing.
3. **No calories, no macros, no grams, no portion sizes** — not in copy, not in the data model, not in a tooltip.
4. **No good food / bad food framing.** No health scores, no "healthy choice" badges.
5. **The kid can quit at any step and still get credit.** Every trial step has a visible way out.
6. **The kid's opinion is the content.** A low rating is never overwritten with encouragement.
7. **No weight, no body, no measurements** anywhere in the feature.

## The flow

| Screen | What it does |
|---|---|
| **Home** | The entry card, shown inside a reconstruction of the real Today screen so the feature is seen in the company it actually keeps |
| **Drop** | This week's food, its emoji, and one piece of trivia. One shuffle, then the option disappears for good |
| **Trial** | Four sensory steps — look, smell, touch, taste — each with an exit that is the same size and weight as the primary button |
| **Review** | Five stars, a texture-first tag vocabulary, an optional note. Publish unlocks on the star alone |
| **Mint** | The collectible card blooms in, its contents stagger, and a single sheen passes across it once |
| **Deck** | The collection as a chronological record. Tap any card to open it full size and share it — not just the one just made. No sorting by rating, no favourites, no aggregate score |

Sharing exports the card to PNG at 2x and hands it to the OS share sheet, falling back to a download where the Web Share API cannot take files. The export targets the card node itself rather than its animated wrapper, so it is always full size regardless of what the open transition is doing.

Bailing out is recorded honestly: the review stores `stepsCompleted` and `bailedAt`, and still mints a full card.

## Stack

Vite · React 18 · TypeScript · Tailwind v3 · Framer Motion · lucide-react · `html-to-image` · `localStorage`. No router, no state library, no backend.

```bash
npm install
npm run dev
```

Append `?reset=1` to the URL to wipe local state and replay the flow from the start.

## Design system

Tokens are lifted from the live Hey Nouri screenshots and live in `tailwind.config.js` — never as arbitrary values in components.

Typeface is **Manrope** throughout: 800 for the two display moments (the drop headline and the card title), 400–700 for UI.

### Three tokens were changed to meet the accessibility floor

The spec requires AA contrast and calls out two pairs by name. Measured against the real surfaces, three values did not clear it. Each was darkened along its own hue rather than replaced:

| Token | Specified | Shipped | Why |
|---|---|---|---|
| `mist` | `#9BA398` | `#6D766A` | 2.48:1 on `canvas` — a hard AA failure. Now 4.51:1, and still lighter than `slate`, so the three-step text hierarchy survives |
| `sprout.deep` | `#5E9A42` | `#4A7A34` | 3.40:1 on `paper`, below AA at the 12–13px sizes it is used at. Now ≥4.54:1 on every surface it touches |
| Primary button label | white on `sprout` | `ink` on `sprout` | White on `#8FC96B` measures **1.96:1**. `ink` on the same fill reaches **9.11:1** and keeps the exact brand green from the screenshots |

One further rule follows from this: `mist` is never placed on a `wash` surface (4.23:1 there). Those captions use `slate`, which clears AA on every surface in the system.

Verified in-browser across all six screens: **zero contrast failures, zero touch targets under 44×44, no horizontal overflow at 360px or 430px.**

## Motion

Three springs — `soft`, `snap`, `bloom` — pulled through a single `useSprings()` hook. When `prefers-reduced-motion` is set, all three collapse to a zero-duration transition and the mint sequence becomes a plain fade. Nothing animates position under reduced motion; layout still resolves correctly.

## Notes on two decisions

**Emoji as card art, lucide for everything else.** Emoji are inconsistent as *iconography*, so every structural icon is a vector from one family. The food emoji is illustration — the subject of the card, not a control.

**Framer Motion is pinned to 11.x.** React 18 is fixed by the brief, and the 11 line is the most heavily deployed against it. Everything used here — `AnimatePresence`, shared-layout `layoutId`, springs — is stable in that line.

## Out of scope, deliberately

No parent view, no accounts, no coach chat, no backend, no notifications, no settings, no history calendar, no dark mode. The Chat and Profile tabs render disabled rather than pretending to work.

---

Built as a feature prototype. Not affiliated with Hey Nouri.
