export const bestHands = (hands) => {
  let handValues = hands.map((hand) => evaluate(hand));
  let maxValue = handValues.reduce((acc, e) => (e > acc ? e : acc), 0);
  return hands.filter((_, i) => handValues[i] === maxValue);
};

class Hand {
  constructor(hand) {
    this.values = hand.map((card) => cardValue(card)).sort((a, b) => b - a);
    this.suits = hand.map((card) => card.slice(-1));
    this.talliedValues = tallyValues(this.values);
  }

  isFlush = () => new Set(this.suits).size === 1;

  isStraight = () => {
    if (new Set(this.values).size != 5) return false;
    // Ace High and other situations
    if (this.values[0] - this.values[4] === 4) return true;
    // Deal with Ace Low
    if (JSON.stringify(this.values) == "[14,5,4,3,2]") {
      this.values = [5, 4, 3, 2, 1];
      return true;
    }
    return false;
  };

  isFourOfAKind = () => this.talliedValues == "[1,4]";

  isFullHouse = () => this.talliedValues == "[2,3]";

  isThreeOfAKind = () => this.talliedValues == "[1,1,3]";

  isTwoPair = () => this.talliedValues == "[1,2,2]";

  isOnePair = () => this.talliedValues == "[1,1,1,2]";

  get groupSort() {
    let t = Object.entries(tally(this.values)).sort(([aa, a], [bb, b]) =>
      b - a == 0 ? bb - aa : b - a
    );
    return t.map(([n, times]) => Array(times).fill(parseInt(n))).flat();
  }
}

function evaluate(pokerHand) {
  let hand = new Hand(pokerHand.split(" "));
  let value;
  switch (true) {
    case hand.isFlush() && hand.isStraight():
      value = 8000000;
      break;
    case hand.isFourOfAKind():
      value = 7000000;
      break;
    case hand.isFullHouse():
      value = 6000000;
      break;
    case hand.isFlush():
      value = 5000000;
      break;
    case hand.isStraight():
      value = 4000000;
      break;
    case hand.isThreeOfAKind():
      value = 3000000;
      break;
    case hand.isTwoPair():
      value = 2000000;
      break;
    case hand.isOnePair():
      value = 1000000;
      break;
    default:
      value = 0;
      break;
  }
  return value + score(hand.groupSort);
}

function cardValue(card) {
  let value = card.slice(0, -1);
  switch (value) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 11;
    default:
      return parseInt(value);
  }
}

function score(values) {
  let [e, d, c, b, a] = values;
  return a + b * 14 + c * 14 ** 2 + d * 14 ** 3 + e * 14 ** 4;
}

function tally(arr) {
  return arr.reduce((acc, el) => {
    if (acc[el]) {
      acc[el] += 1;
    } else {
      acc[el] = 1;
    }
    return acc;
  }, {});
}

function tallyValues(arr) {
  let result = tally(arr);
  return JSON.stringify(Object.values(result).sort());
}
