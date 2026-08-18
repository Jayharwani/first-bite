import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { forwardRef, useMemo, type KeyboardEvent } from "react";
import type { Food, FoodHistory, PeerStats, Review } from "../types";
import { VERDICT } from "./StarRating";
import CardBack from "./CardBack";
import { useSprings } from "../lib/motion";

const WASH: Record<Food["colorWash"], string> = {
  green: "#EDF5E6",
  yellow: "#F7F3D4",
  blue: "#DCE7F0",
  clay: "#F6DDDA",
};

const SHADOW_REST = "0 8px 32px rgba(20, 25, 20, 0.10)";
const SHADOW_MID = "0 16px 48px rgba(20, 25, 20, 0.18)";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

type Props = {
  food: Food;
  review: Review;
  reviewerName: string;
  /** 1 = the full 260x360 collectible. The deck grid renders at 0.55. */
  scale?: number;
  layoutId?: string;
  /** The one-shot diagonal sheen. Mint only, never in the deck. */
  sheen?: boolean;
  /** Stagger the contents in. Mint only. */
  stagger?: boolean;
  /** Passing a toggle makes the card flippable and interactive. */
  flipped?: boolean;
  onFlipToggle?: () => void;
  history?: FoodHistory;
  stats?: PeerStats;
  /** The flip hint sits on a scrim in the deck overlay and needs a fill. */
  hintOnDark?: boolean;
};

/**
 * Sized from a scale factor rather than a CSS transform, so smaller cards
 * stay crisp and Framer's shared-layout transition has a real box to
 * interpolate between.
 *
 * The flip is split across two elements on purpose: layoutId sits on the
 * outer container, where Framer owns the transform, and rotateY sits on the
 * inner one, which this component owns. Putting both on a single node means
 * whichever writes `transform` last wins, and the deck-to-fullscreen
 * transition loses.
 */
const FoodCard = forwardRef<HTMLDivElement, Props>(function FoodCard(
  {
    food,
    review,
    reviewerName,
    scale = 1,
    layoutId,
    sheen = false,
    stagger = false,
    flipped = false,
    onFlipToggle,
    history,
    stats,
    hintOnDark = false,
  },
  ref,
) {
  const { bloom, soft, reduced } = useSprings();
  const s = (n: number) => `${n * scale}px`;
  const flippable = Boolean(onFlipToggle && history);

  const item = (i: number) =>
    stagger && !reduced
      ? {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { ...soft, delay: 0.35 + i * 0.06 },
        }
      : {};

  /**
   * Memoised because the tilt is expressed as keyframes: a fresh array on
   * every render would replay the flourish whenever anything re-renders.
   */
  const flipAnimation = useMemo(() => {
    if (reduced) return { animate: {}, transition: {} };
    return {
      animate: {
        rotateY: flipped ? 180 : 0,
        // A flat spin reads like a CSS demo. The slight roll and lift through
        // the midpoint is what makes it a hand turning a card over.
        rotateZ: [0, -6, 0],
        scale: [1, 1.04, 1],
      },
      transition: {
        rotateY: soft,
        rotateZ: {
          duration: 0.5,
          times: [0, 0.5, 1],
          ease: "easeInOut" as const,
        },
        scale: {
          duration: 0.5,
          times: [0, 0.5, 1],
          ease: "easeInOut" as const,
        },
      },
    };
  }, [flipped, reduced, soft]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onFlipToggle) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlipToggle();
    }
  };

  const front = (
    <motion.div
      ref={ref}
      className="relative flex flex-col overflow-hidden"
      style={{
        width: s(260),
        height: s(360),
        borderRadius: s(24),
        backgroundColor: WASH[food.colorWash],
        padding: s(20),
        backfaceVisibility: reduced ? "visible" : "hidden",
        WebkitBackfaceVisibility: reduced ? "visible" : "hidden",
      }}
      // Correct from the first paint rather than after one frame: this card
      // can mount already flipped, and a crossfade that has not run yet would
      // otherwise show the wrong face.
      initial={reduced ? { opacity: flipped ? 0 : 1 } : undefined}
      animate={reduced ? { opacity: flipped ? 0 : 1 } : undefined}
      transition={reduced ? { duration: 0.2 } : undefined}
    >
      {/* Inset frame — 1px white at 40%, the thing that makes it read as a
          card rather than a tile. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          inset: s(8),
          borderRadius: s(17),
          border: "1px solid rgba(255,255,255,0.4)",
        }}
      />

      <motion.div
        {...item(0)}
        className="flex flex-1 items-center justify-center"
        style={{ fontSize: s(88), lineHeight: 1 }}
      >
        <span role="img" aria-label={food.name}>
          {food.emoji}
        </span>
      </motion.div>

      <motion.h3
        {...item(1)}
        className="text-center font-extrabold text-ink"
        style={{ fontSize: s(22), lineHeight: s(26), letterSpacing: "-0.02em" }}
      >
        {food.name}
      </motion.h3>

      {/* The kid's verdict, in ink — not the app's approval, so never green. */}
      <motion.div
        {...item(2)}
        className="flex items-center justify-center"
        style={{ gap: s(2), marginTop: s(8) }}
        role="img"
        aria-label={`${review.stars} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((v) => (
          <Star
            key={v}
            size={14 * scale}
            strokeWidth={2}
            className={
              v <= review.stars
                ? "fill-ink text-ink"
                : "fill-transparent text-ink/25"
            }
            aria-hidden="true"
          />
        ))}
      </motion.div>

      <motion.div
        {...item(3)}
        className="flex justify-center"
        style={{ marginTop: s(10) }}
      >
        <span
          className="rounded-pill bg-ink font-semibold text-paper"
          style={{
            fontSize: s(11),
            lineHeight: s(16),
            padding: `${s(4)} ${s(10)}`,
          }}
        >
          {VERDICT[review.stars]}
        </span>
      </motion.div>

      {review.note ? (
        <motion.p
          {...item(4)}
          className="overflow-hidden text-center italic text-ink/70"
          style={{
            fontSize: s(11),
            lineHeight: s(15),
            marginTop: s(10),
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          &ldquo;{review.note}&rdquo;
        </motion.p>
      ) : null}

      <motion.div
        {...item(5)}
        className="tnum flex items-end justify-between"
        style={{ marginTop: s(12), fontSize: s(11), lineHeight: s(14) }}
      >
        <span className="font-semibold text-ink/70">{reviewerName}</span>
        <span className="text-ink/70">{formatDate(review.createdAt)}</span>
      </motion.div>

      <div
        className="text-center font-semibold text-ink/40"
        style={{ fontSize: s(9), lineHeight: s(12), marginTop: s(6) }}
      >
        hey nouri
      </div>

      {/* One diagonal pass. Never loops. */}
      {sheen && !reduced ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 0.7, delay: 0.75, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.75) 50%, transparent 65%)",
          }}
        />
      ) : null}
    </motion.div>
  );

  if (!flippable) {
    return (
      <motion.div
        layoutId={layoutId}
        transition={bloom}
        className="shrink-0"
        style={{ borderRadius: s(24), boxShadow: SHADOW_REST }}
      >
        {front}
      </motion.div>
    );
  }

  const hint = (
    // Outside the card node on purpose: cardRef points at the front face, so
    // the exported PNG can never pick this up. Also aria-hidden, because the
    // card's own aria-label already says what tapping does.
    //
    // The wrapper carries the 44px tap area so the visible pill can stay
    // small — a control that reads as quiet still has to be catchable.
    <div
      aria-hidden="true"
      onClick={onFlipToggle}
      className="flex min-h-[44px] cursor-pointer select-none items-center justify-center"
      style={{ marginTop: s(4) }}
    >
      <span
        className={
          hintOnDark
            ? "rounded-pill bg-ink font-semibold text-paper"
            : "font-semibold text-slate"
        }
        style={{
          fontSize: s(12),
          lineHeight: s(16),
          padding: hintOnDark ? `${s(6)} ${s(12)}` : undefined,
        }}
      >
        {flipped ? "Tap to flip back" : "Tap for your history"}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layoutId={layoutId}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? `${food.name} card, showing your history. Tap to see the front.`
            : `${food.name} card. Tap to see your history.`
        }
        onClick={onFlipToggle}
        onKeyDown={onKeyDown}
        className="relative shrink-0 cursor-pointer"
        style={{ borderRadius: s(24), perspective: 1200 }}
        animate={
          reduced
            ? undefined
            : { boxShadow: [SHADOW_REST, SHADOW_MID, SHADOW_REST] }
        }
        // bloom drives the shared-layout transition; boxShadow overrides it so
        // the lift is keyframed rather than sprung.
        transition={
          reduced
            ? bloom
            : {
                ...bloom,
                boxShadow: {
                  duration: 0.5,
                  times: [0, 0.5, 1],
                  ease: "easeInOut",
                },
              }
        }
      >
        {/* The entire affordance: 3px of the back sheet showing past the right
          edge. No icon, no chevron, no "tap to see more". */}
        {!flipped && !reduced ? (
          <div
            aria-hidden="true"
            className="absolute"
            style={{
              top: s(10),
              bottom: s(10),
              right: s(-3),
              width: s(14),
              borderTopRightRadius: s(10),
              borderBottomRightRadius: s(10),
              backgroundColor: WASH[food.colorWash],
              filter: "brightness(0.93)",
            }}
          />
        ) : null}

        <motion.div
          className="relative"
          style={{ transformStyle: reduced ? "flat" : "preserve-3d" }}
          initial={false}
          animate={flipAnimation.animate}
          transition={flipAnimation.transition}
        >
          {front}

          <motion.div
            className="absolute inset-0"
            style={{
              backfaceVisibility: reduced ? "visible" : "hidden",
              WebkitBackfaceVisibility: reduced ? "visible" : "hidden",
              // Under reduced motion nothing rotates, so the back must not be
              // pre-flipped or it would crossfade in mirrored.
              transform: reduced ? undefined : "rotateY(180deg)",
              pointerEvents: "none",
            }}
            initial={reduced ? { opacity: flipped ? 1 : 0 } : undefined}
            animate={reduced ? { opacity: flipped ? 1 : 0 } : undefined}
            transition={reduced ? { duration: 0.2 } : undefined}
          >
            <CardBack
              food={food}
              history={history!}
              stats={stats}
              scale={scale}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      {hint}
    </div>
  );
});

export default FoodCard;
