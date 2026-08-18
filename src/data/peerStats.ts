import type { PeerStats } from '../types'

/**
 * Static seed data. There is no backend.
 *
 * Every field here is a property of a *food*: how many people reviewed it,
 * what they called it, how many refused it, how many came back and rated it
 * higher. Nothing here is a property of a child, and nothing here can be
 * arranged into a ranking of children. That constraint is the reason the
 * shape is this narrow.
 *
 * `tag` holds a tag id from data/tags.ts, resolved to its label at render
 * time, so a peer stat can never quote a word a kid could not have picked.
 */
export const PEER_STATS: PeerStats[] = [
  {
    foodId: 'radish',
    reviewerCount: 41,
    topTags: [
      { tag: 'bitter', percent: 60 },
      { tag: 'crunchy', percent: 44 },
      { tag: 'not-again', percent: 21 },
    ],
    neverAgainCount: 12,
    changedMindCount: 9,
  },
  {
    foodId: 'cucumber',
    reviewerCount: 33,
    topTags: [
      { tag: 'squeaky', percent: 52 },
      { tag: 'actually-fine', percent: 38 },
      { tag: 'too-soft', percent: 17 },
    ],
    neverAgainCount: 5,
    changedMindCount: 7,
  },
  {
    foodId: 'brussels-sprout',
    reviewerCount: 68,
    topTags: [
      { tag: 'weird-smell', percent: 71 },
      { tag: 'mushy', percent: 40 },
      { tag: 'not-again', percent: 29 },
    ],
    neverAgainCount: 24,
    changedMindCount: 11,
  },
  {
    foodId: 'olive',
    reviewerCount: 52,
    topTags: [
      { tag: 'sour', percent: 63 },
      { tag: 'slimy', percent: 35 },
      { tag: 'looks-worse', percent: 22 },
    ],
    neverAgainCount: 15,
    changedMindCount: 8,
  },
  {
    foodId: 'sardine',
    reviewerCount: 37,
    topTags: [
      { tag: 'weird-smell', percent: 66 },
      { tag: 'too-soft', percent: 41 },
      { tag: 'not-again', percent: 25 },
    ],
    neverAgainCount: 14,
    // Under three: the "changed their mind" line is suppressed on a card the
    // deck can actually open, so the threshold is visible and not just coded.
    changedMindCount: 2,
  },
  {
    foodId: 'grapefruit',
    reviewerCount: 45,
    topTags: [
      { tag: 'sour', percent: 78 },
      { tag: 'surprisingly-ok', percent: 36 },
      { tag: 'sweet', percent: 19 },
    ],
    neverAgainCount: 6,
    changedMindCount: 13,
  },
  {
    foodId: 'roasted-red-pepper',
    reviewerCount: 29,
    topTags: [
      { tag: 'sweet', percent: 48 },
      { tag: 'slimy', percent: 33 },
      { tag: 'actually-fine', percent: 27 },
    ],
    neverAgainCount: 4,
    changedMindCount: 6,
  },
  {
    foodId: 'blue-cheese',
    reviewerCount: 31,
    topTags: [
      { tag: 'weird-smell', percent: 74 },
      { tag: 'not-again', percent: 32 },
      { tag: 'friends-house', percent: 15 },
    ],
    neverAgainCount: 17,
    changedMindCount: 3,
  },
  {
    foodId: 'mushroom',
    reviewerCount: 26,
    topTags: [
      { tag: 'slimy', percent: 57 },
      { tag: 'squeaky', percent: 30 },
      { tag: 'mushy', percent: 24 },
    ],
    neverAgainCount: 9,
    changedMindCount: 5,
  },
  {
    foodId: 'pickled-onion',
    reviewerCount: 18,
    topTags: [
      { tag: 'sour', percent: 69 },
      { tag: 'crunchy', percent: 42 },
      { tag: 'not-again', percent: 20 },
    ],
    neverAgainCount: 7,
    changedMindCount: 4,
  },
  {
    foodId: 'broccoli',
    reviewerCount: 61,
    topTags: [
      { tag: 'squeaky', percent: 45 },
      { tag: 'actually-fine', percent: 39 },
      { tag: 'bitter', percent: 26 },
    ],
    neverAgainCount: 11,
    changedMindCount: 16,
  },
  {
    // changedMindCount below 3, so that fourth line correctly does not render.
    foodId: 'lemon',
    reviewerCount: 11,
    topTags: [
      { tag: 'sour', percent: 91 },
      { tag: 'bitter', percent: 36 },
    ],
    neverAgainCount: 3,
    changedMindCount: 1,
  },
  {
    // Under the minimum sample. The peer block does not render at all.
    foodId: 'seaweed',
    reviewerCount: 4,
    topTags: [{ tag: 'weird-smell', percent: 50 }],
    neverAgainCount: 1,
    changedMindCount: 0,
  },
  {
    // Also under the minimum. Absence is the correct output.
    foodId: 'rye-bread',
    reviewerCount: 7,
    topTags: [{ tag: 'too-soft', percent: 43 }],
    neverAgainCount: 2,
    changedMindCount: 1,
  },
]

/** The sample below which no peer figure may be shown, in any form. */
export const PEER_MIN_SAMPLE = 10

export const peerStatsFor = (foodId: string): PeerStats | undefined =>
  PEER_STATS.find((p) => p.foodId === foodId)
