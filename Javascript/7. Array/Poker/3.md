//
// This is only a SKELETON file for the 'Poker' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

export const bestHands = (hands) => {
  hands = hands.map((h) => new Hand(h));
  if (hands.length === 1) {
    return [hands[0].toString()];
  }
  let highCardHands = hands.slice().reduce((acc, item) => {
    if (acc.length === 0) return [item];
    let result = Hand.compare(acc[0], item);
    if (result.length === 2) {
      acc.push(item);
      return acc;
    }
    if (result[0] == acc[0]) return acc;
    return [item];
  }, []);
  return highCardHands.map((h) => h.toString());
};
const RANK_ORDER = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
class Hand {
  constructor(str) {
    this.str = str;
    this.cards = str
      .split(" ")
      .map((c) => ({
        rank: c.slice(0, c.length - 1),
        suit: c.slice(c.length - 1),
      }));
  }
  toString() {
    return this.str;
  }
  static compare(h1, h2) {
    if (h1.isStraightFlush && !h2.isStraightFlush) return [h1];
    if (!h1.isStraightFlush && h2.isStraightFlush) return [h2];
    if (h1.isFourOfAKind && h2.isFourOfAKind) {
      return h1.quadRank > h2.quadRank ? [h1] : [h2];
    }
    if (h1.isFourOfAKind && !h2.isFourOfAKind) return [h1];
    if (!h1.isFourOfAKind && h2.isFourOfAKind) return [h2];
    if (h1.isFullHouse && h2.isFullHouse) {
      if (h1.tripletRank !== h2.tripletRank) {
        return h1.tripletRank > h2.tripletRank ? [h1] : [h2];
      } else {
        return h1.pairRank > h2.pairRank ? [h1] : [h2];
      }
    }
    if (h1.isFullHouse && !h2.isFullHouse) return [h1];
    if (!h1.isFullHouse && h2.isFullHouse) return [h2];
    if (h1.isFlush && !h2.isFlush) return [h1];
    if (!h1.isFlush && h2.isFlush) return [h2];
    if (h1.isStraight && !h2.isStraight) return [h1];
    if (!h1.isStraight && h2.isStraight) return [h2];
    if (h1.isStraight && h2.isStraight) {
      if (!h1.isFiveHighStraight && h2.isFiveHighStraight) return [h1];
      if (h1.isFiveHighStraight && !h2.isFiveHighStraight) return [h2];
    }
    if (h1.isThreeOfAKind && !h2.isThreeOfAKind) return [h1];
    if (!h1.isThreeOfAKind && h2.isThreeOfAKind) return [h2];
    if (h1.isTwoPair && !h2.isTwoPair) return [h1];
    if (!h1.isTwoPair && h2.isTwoPair) return [h2];
    if (h1.isOnePair && !h2.isOnePair) return [h1];
    if (!h1.isOnePair && h2.isOnePair) return [h2];
    return Hand.highCard(h1, h2);
  }
  static highCard(h1, h2) {
    let ri1 = h1.rankIndexes,
      ri2 = h2.rankIndexes;
    while (ri1.length && ri2.length && ri1[0] === ri2[0]) {
      ri1.shift();
      ri2.shift();
    }
    if (ri1.length === 0) {
      return [h1, h2];
    }
    if (ri1[0] === ri2[0]) {
      return [h1, h2];
    }
    return ri1[0] > ri2[0] ? [h1] : [h2];
  }
  get rankIndexes() {
    return this.cards
      .map((c) => RANK_ORDER.indexOf(c.rank))
      .sort((a, b) => b - a);
  }
  get isOnePair() {
    let c = this.rankIndexes.reduce((acc, item) => {
      acc[item] = acc[item] ?? 0;
      acc[item]++;
      return acc;
    }, {});
    for (let k in c) {
      if (c[k] == 2) return true;
    }
    return false;
  }
  get isTwoPair() {
    let c = this.rankIndexes.reduce((acc, item) => {
      acc[item] = acc[item] ?? 0;
      acc[item]++;
      return acc;
    }, {});
    let found = 0;
    for (let k in c) {
      if (c[k] == 2) found++;
    }
    return found == 2;
  }
  get isThreeOfAKind() {
    let c = this.rankIndexes.reduce((acc, item) => {
      acc[item] = acc[item] ?? 0;
      acc[item]++;
      return acc;
    }, {});
    let found = 0;
    for (let k in c) {
      if (c[k] == 3) found++;
    }
    return found == 1;
  }
  get isStraight() {
    let ri = this.rankIndexes.sort((a, b) => a - b);
    if (ri.indexOf(0) >= 0 && ri.indexOf(12) >= 0) {
      // includes A and 2, so 'rotate' the ace around to the bottom
      ri = ri.map((i) => i + 1);
      ri[ri.indexOf(13)] = 0;
      ri.sort((a, b) => a - b);
    }
    let diff = ri[0];
    for (let i = 1; i < ri.length; i++) {
      if (ri[i] - i != diff) return false;
    }
    return true;
  }
  get isFiveHighStraight() {
    if (!this.isStraight) return false;
    let ri = this.rankIndexes;
    console.log({ ri });
    return ri.indexOf(3) != -1 && ri.indexOf(12) != -1;
  }
  get isFlush() {
    return new Set(this.cards.map((c) => c.suit)).size === 1;
  }
  get isFullHouse() {
    return this.isOnePair && this.isThreeOfAKind;
  }
  get tripletRank() {
    let c = this.rankIndexes.reduce((acc, item) => {
      acc[item] = acc[item] ?? 0;
      acc[item]++;
      return acc;
    }, {});
    for (let k in c) {
      if (c[k] == 3) return Number(k);
    }
    return -1;
  }
  get pairRank() {
    let c = this.rankIndexes.reduce((acc, item) => {
      acc[item] = acc[item] ?? 0;
      acc[item]++;
      return acc;
    }, {});
    for (let k in c) {
      if (c[k] == 2) return Number(k);
    }
    return -1;
  }
  get quadRank() {
    let c = this.rankIndexes.reduce((acc, item) => {
      acc[item] = acc[item] ?? 0;
      acc[item]++;
      return acc;
    }, {});
    for (let k in c) {
      if (c[k] == 4) return Number(k);
    }
    return -1;
  }
  get isFourOfAKind() {
    return this.quadRank > -1;
  }
  get isStraightFlush() {
    return this.isStraight && this.isFlush;
  }
}
