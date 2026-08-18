import type { Food } from '../types'

/**
 * Twelve foods, biased toward things a 9-to-18-year-old has a real reason
 * to push away: bitter, fishy, fermented, slimy, strong-smelling.
 *
 * Every hook is a piece of trivia. None of them is a reason to eat the food.
 * If a hook could be finished with a reason to swallow it, it is wrong.
 */
export const FOODS: Food[] = [
  {
    id: 'roasted-red-pepper',
    name: 'Roasted red pepper',
    emoji: '\u{1FAD1}',
    category: 'vegetable',
    colorWash: 'green',
    hook: "It's a green pepper that stayed on the plant longer.",
  },
  {
    id: 'brussels-sprout',
    name: 'Brussels sprout',
    emoji: '\u{1F96C}',
    category: 'vegetable',
    colorWash: 'green',
    hook: 'They grow in a spiral up one thick stalk, forty at a time.',
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    emoji: '\u{1F966}',
    category: 'vegetable',
    colorWash: 'green',
    hook: "It doesn't grow wild anywhere on earth. People built it out of a wild cabbage.",
  },
  {
    id: 'pickled-onion',
    name: 'Pickled onion',
    emoji: '\u{1F9C5}',
    category: 'vegetable',
    colorWash: 'yellow',
    hook: "The vinegar wasn't about flavour. It was how you kept an onion through winter.",
  },
  {
    id: 'olive',
    name: 'Olive',
    emoji: '\u{1FAD2}',
    category: 'fruit',
    colorWash: 'clay',
    hook: "Straight off the tree they're inedible. Every olive you've eaten was cured first.",
  },
  {
    id: 'grapefruit',
    name: 'Grapefruit',
    emoji: '\u{1F34A}',
    category: 'fruit',
    colorWash: 'yellow',
    hook: 'Nobody bred it on purpose. An orange and a pomelo crossed by accident in Barbados.',
  },
  {
    id: 'lemon',
    name: 'Lemon',
    emoji: '\u{1F34B}',
    category: 'fruit',
    colorWash: 'yellow',
    hook: "Not a wild fruit. It's a cross between a bitter orange and a citron.",
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    emoji: '\u{1F344}',
    category: 'other',
    colorWash: 'clay',
    hook: 'On the family tree it sits closer to you than it does to a plant.',
  },
  {
    id: 'seaweed',
    name: 'Seaweed',
    emoji: '\u{1F33F}',
    category: 'other',
    colorWash: 'green',
    hook: 'The sheets wrapped around sushi start out growing on ropes in the sea.',
  },
  {
    id: 'sardine',
    name: 'Sardine',
    emoji: '\u{1F41F}',
    category: 'protein',
    colorWash: 'blue',
    hook: 'Named after Sardinia, where the boats used to come back with nets full of them.',
  },
  {
    id: 'blue-cheese',
    name: 'Blue cheese',
    emoji: '\u{1F9C0}',
    category: 'protein',
    colorWash: 'blue',
    hook: 'The blue lines running through it are mould. That part is deliberate.',
  },
  {
    id: 'rye-bread',
    name: 'Rye bread',
    emoji: '\u{1F35E}',
    category: 'grain',
    colorWash: 'clay',
    hook: 'Rye keeps growing in cold, poor soil where wheat gives up entirely.',
  },
]

export const foodById = (id: string | null | undefined): Food | undefined =>
  FOODS.find((f) => f.id === id)

/** How many slots the deck shows. Drives the dashed empty slots. */
export const DECK_TARGET = 8
