export function bestHands(hands) {
  const best = String(hands.map(pokerRank).sort().at(-1));
  return hands.filter((h) => pokerRank(h) == best);
}

const CARDS = "2 3 4 5 6 7 8 9 10 J Q K A".split(" ");
const count = (arr) =>
  arr.reduce((cs, x) => ((cs[x] = (cs[x] ?? 0) + 1), cs), {});
const digit = (d) =>
  d <= 9 ? d : String.fromCharCode("a".charCodeAt(0) + d - 10);

function pokerRank(hand) {
  let ranks = hand
    .split(" ")
    .map((card) => 2 + CARDS.indexOf(card.slice(0, -1)))
    .sort((a, b) => b - a);
  if (ranks == "14,5,4,3,2")
    // ace acts like a "one"
    ranks = [5, 4, 3, 2, 1];
  const counts = Object.values(count(ranks)).sort((a, b) => b - a);
  const isStraight =
    counts.length == 5 && 4 == Math.max(...ranks) - Math.min(...ranks);
  const isFlush =
    1 == new Set(hand.split(" ").map((card) => card.slice(-1))).size;
  const cards = Object.entries(count(ranks))
    .sort((a, b) => b[1] - a[1])
    .map(([x, _]) => digit(Number(x))); // transform to single digits: easy to compare
  if (counts == "5")
    // five of a kind
    return [9];
  if (isStraight && isFlush)
    // straight flush
    return [8, ...cards];
  if (counts == "4,1")
    // four of a kind
    return [7, ...cards];
  if (counts == "3,2")
    // full house
    return [6, ...cards];
  if (isFlush) return [5, ...cards];
  if (isStraight) return [4, ...cards];
  if (counts[0] == 3)
    // three of a kind
    return [3, ...cards];
  if (counts == "2,2,1") {
    // two pairs
    if (cards[0] < cards[1]) [cards[0], cards[1]] = [cards[1], cards[0]];
    return [2, ...cards];
  }
  if (counts[0] == 2)
    // one pair
    return [1, ...cards];
  return [0, ...cards]; // high card
}
