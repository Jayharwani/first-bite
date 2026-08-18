export type Tag = { id: string; label: string }

/**
 * The review vocabulary. Deliberately biased toward texture and sensation
 * rather than approval — a kid should be able to describe a food precisely
 * without the words implying they were meant to enjoy it.
 */
export const TAGS: Tag[] = [
  { id: 'slimy', label: 'slimy' },
  { id: 'crunchy', label: 'crunchy' },
  { id: 'weird-smell', label: 'weird smell' },
  { id: 'too-soft', label: 'too soft' },
  { id: 'actually-fine', label: 'actually fine' },
  { id: 'sour', label: 'sour' },
  { id: 'bitter', label: 'bitter' },
  { id: 'sweet', label: 'sweet' },
  { id: 'looks-worse', label: 'looks worse than it tastes' },
  { id: 'friends-house', label: "would eat at a friend's house" },
  { id: 'mushy', label: 'mushy' },
  { id: 'squeaky', label: 'squeaky' },
  { id: 'surprisingly-ok', label: 'surprisingly ok' },
  { id: 'not-again', label: 'not doing that again' },
]

export const tagLabel = (id: string): string =>
  TAGS.find((t) => t.id === id)?.label ?? id
