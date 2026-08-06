/* Comments:
 * This exercise was very hard.
 * Comparing it with the Python version, just showcases how "weak" JS is at "number comparisons".
 * https://exercism.org/tracks/python/exercises/poker/solutions/DeepspaceFreelancer
 * I had to implement all from scratch
 */

class Card {
  value;
  suit;

  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  toString() {
    return `${this.value}${this.suit}`;
  }
}

function decodeToInternal(hands) {
  return hands.map((hand) =>
    hand.split(" ").map((card) => new Card(card.slice(0, -1), card.slice(-1)))
  );
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

function counter(array) {
  return array.reduce(
    (acc, value, index) => (
      (acc[value] = value in acc ? acc[value] + 1 : 1), acc
    ),
    {}
  );
}

function unzip(array) {
  return array.reduce(
    (acc, value) => (
      value.forEach((innerValue, i) => acc[i].push(innerValue)), acc
    ),
    Array.from({ length: Math.max(...array.map((a) => a.length)) }, (_) => [])
  );
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

class Ranks {
  rankArray;

  constructor(ranks) {
    this.rankArray = ranks;
  }

  equal(other) {
    if (this.rankArray.length === other.rankArray.length) {
      for (let i = 0; i < this.rankArray.length; ++i) {
        if (this.rankArray[i] !== other.rankArray[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}

class HandRank {
  handCode;
  numbers;

  constructor(handCode, numbers) {
    this.handCode = handCode;
    this.numbers = numbers;
  }

  greater(other) {
    if (this.handCode === other.handCode) {
      for (let i = 0; i < this.numbers.length; ++i) {
        if (this.numbers[i] === other.numbers[i]) {
          continue;
        }
        return this.numbers[i] > other.numbers[i];
      }
    }
    return this.handCode > other.handCode;
  }
}

class Hand {
  static CARD_VALUE_SC = Object.assign(
    {},
    ...range(9, 2).map((value, index) => ({ [`${value}`]: value }))
  );
  static CARD_VALUE = Object.assign({}, Hand.CARD_VALUE_SC, {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
  });

  cards;
  ranks;
  handRank;

  constructor(cards) {
    this.cards = cards;
    this.ranks = Hand.#rankHand(this.cards);
    this.handRank = Hand.#handRank(this.ranks, this.cards);
  }

  static #rankHand(cards) {
    const ranks = cards.map((card) => Hand.CARD_VALUE[card.value]);
    ranks.sort((a, b) => a - b).reverse();
    return arraysEqual(ranks, [14, 5, 4, 3, 2])
      ? new Ranks([5, 4, 3, 2, 1])
      : new Ranks(ranks);
  }

  static #handRank(ranks, cards) {
    const cardsFrequency = counter(ranks.rankArray);
    const groups = Object.keys(cardsFrequency).map((card) => [
      cardsFrequency[card],
      parseInt(card),
    ]);
    groups.sort((a, b) =>
      a[0] === b[0] ? Math.sign(b[1] - a[1]) : Math.sign(b[0] - a[0])
    );
    const [counts, numbers] = unzip(groups);
    const straight =
      counts.length === 5 && Math.max(...numbers) - Math.min(...numbers) === 4;
    const flush = new Set(cards.map((card) => card.suit)).size === 1;
    const handCode = () => {
      if (straight && flush) return 8;
      else if (arraysEqual(counts, [4, 1])) return 7;
      else if (arraysEqual(counts, [3, 2])) return 6;
      else if (flush) return 5;
      else if (straight) return 4;
      else if (arraysEqual(counts, [3, 1, 1])) return 3;
      else if (arraysEqual(counts, [2, 2, 1])) return 2;
      else if (arraysEqual(counts, [2, 1, 1, 1])) return 1;
      else return 0;
    };
    return new HandRank(handCode(), numbers);
  }

  toString() {
    return this.cards.map((card) => card.toString()).join(" ");
  }
}

export function bestHands(hands) {
  const handsInternal = decodeToInternal(hands).map((hand) => new Hand(hand));
  const maxHand = handsInternal.reduce((prev, current) =>
    prev.handRank.greater(current.handRank) ? prev : current
  );
  return handsInternal
    .filter((hand) => maxHand.ranks.equal(hand.ranks))
    .map((hand) => hand.toString());
}
