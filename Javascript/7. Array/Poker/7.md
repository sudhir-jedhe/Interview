const regex =
  /^(?<royalFlush>(A)(.) K\w Q\w J\w 10\w)|(?<straightFlush>(K)(.) Q\6 J\6 10\6 9\6|(Q)(.) J\8 10\8 9\8 8\8|(J)(.) 10\10 9\10 8\10 7\10|(10)(.) 9\12 8\12 7\12 6\12|(9)(.) 8\14 7\14 6\14 5\14|(8)(.) 7\16 6\16 5\16 4\16|(7)(.) 6\18 5\18 4\18 3\18|(6)(.) 5\20 4\20 3\20 2\20|(A)(.) 5\22 4\22 3\22 2\22)|(?<poker>.*(.). \24. \24. \24..*)|(?<full>(.). \26. (.). \27. \27.|(.). \28. \28. (.). \29.)|(?<flush>(.)(.) .\32 .\32 .\32 .\32)|(?<straight>(A). K. Q. J. 10.|(K). Q. J. 10. 9.|(Q). J. 10. 9. 8.|(J). 10. 9. 8. 7.|(10). 9. 8. 7. 6.|(9). 8. 7. 6. 5.|(8). 7. 6. 5. 4.|(7). 6. 5. 4. 3.|(6). 5. 4. 3. 2.|A. (5). 4. 3. 2.)|(?<three>.*(.). \45. \45..*)|(?<doublePair>.*(.). \47. .*(.). \48..*)|(?<pair>.*(.). \50..*)|(?<highCard>(.).*)$/;

export const bestHands = (hands) =>
  getWinnerHand(hands.map((hand) => new Hand(hand)).sort(sortHands));

const sortHands = (handA, handB) => {
  if (handA.sortIndex !== handB.sortIndex)
    return handA.sortIndex - handB.sortIndex;

  const comparsion = handA.compareTo(handB.involvedCards, handA.involvedCards);
  if (comparsion) return comparsion;

  const indexHandA = handA.highCard.sortIndex;
  const indexHandB = handB.highCard.sortIndex;
  return indexHandA !== indexHandB
    ? indexHandA - indexHandB
    : handA.compareToHandWithoutInvolvedCard(handB);
};

const getWinnerHand = (hands) => {
  const firstVictory = hands[0].sortedCards.map((card) => card.value).join("");
  return hands
    .filter(
      (hand) =>
        hand.sortedCards.map((card) => card.value).join("") === firstVictory
    )
    .map((hand) => hand.originalCards);
};

class Hand {
  sortingHandsArray = [
    "straightFlush",
    "poker",
    "full",
    "flush",
    "straight",
    "three",
    "doublePair",
    "pair",
    "highCard",
  ];

  constructor(hand) {
    this.setPlayFromHand(hand);
  }

  setPlayFromHand(hand) {
    const sortHand = this.createSortedCards(hand);
    const regexResult = regex.exec(this.getSortedHand(sortHand));
    const group = regexResult.groups;
    const result = Object.keys(group).find((f) => group[f] !== undefined);

    this.type = result;
    this.originalCards = hand;
    this.sortedCards =
      result === "full"
        ? this.fullSort(group[result])
        : this.createSortedCards(group[result]);
    this.highCard = this.setHighCard();
    this.sortIndex = this.sortingHandsArray.indexOf(result);
    this.involvedCards =
      result === "highCard"
        ? [this.highCard]
        : regexResult
            .filter((f) => f !== undefined && f.length <= 2)
            .map((card) =>
              /^f/g.test(result) ? this.sortedCards : new Card(card, null)
            )
            .sort(this.sortPlays);
  }

  getSortedHand = (hand) => hand.map((m) => m.toString()).join(" ");

  createSortedCards = (hand, sort = this.sortPlays) =>
    this.sortCards(this.createCards(hand), sort);

  createCards = (hand) =>
    hand
      .split(" ")
      .map((card) => new Card(card.slice(0, card.length - 1), card.slice(-1)));

  sortCards = (cards, sort) => cards.sort(sort);

  setHighCard = () => this.sortedCards[0];

  sortPlays = (cardA, cardB) =>
    cardA.sortIndex > cardB.sortIndex
      ? 1
      : cardA.sortIndex < cardB.sortIndex
      ? -1
      : 0;

  fullSort = (hand) => {
    const cards = this.createCards(hand);
    const values = cards.map((m) => m.value);
    const maxValue =
      values[0] === values[2] ? values[1] : values[values.length - 1];
    return cards.sort((cardA) => {
      return cardA.value !== maxValue ? 1 : -1;
    });
  };

  compareTo(other, current = this.sortedCards) {
    for (const [index, value] of current.entries()) {
      const otherValue = other[index];
      if (value.value === otherValue.value) continue;
      return value.compareTo(other[index]);
    }
    return 0;
  }

  compareToHandWithoutInvolvedCard(other) {
    const currentHand = this.sortedCards.filter(
      (card) => card.value !== this.involvedCards.value
    );
    const otherHand = other.sortedCards.filter(
      (card) => card.value !== this.involvedCards.value
    );
    return this.compareTo(otherHand, currentHand);
  }
}

class Card {
  sortingCardsArray = [
    "A",
    "K",
    "Q",
    "J",
    "10",
    "1",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];

  constructor(value, type) {
    this.value = value;
    this.type = type;
    this.sortIndex = this.sortingCardsArray.indexOf(value);
  }

  compareTo = (other) =>
    this.value > other.value ? -1 : this.value < other.value ? 1 : 0;

  toString = () => `${this.value}${this.type}`;
}
