//
// This is only a SKELETON file for the 'Poker' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

const cardValues = [
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

const analyseHand = (hand) => {
  let [pair, twoPair, threeKind, straight, flush, fullHouse, fourKind] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  let colors = { H: 0, C: 0, D: 0, S: 0 };
  let valueCount = {
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    J: 0,
    Q: 0,
    K: 0,
    A: 0,
  };
  let highValue = 0;
  let sndValue = 0;
  let trdValue = 0;
  let sValues = hand
    .split(" ")
    .map((elem) => elem.substring(0, elem.length - 1))
    .sort((a, b) => cardValues.indexOf(a) - cardValues.indexOf(b));

  for (const elem of hand.split(" ")) {
    valueCount[elem.substring(0, elem.length - 1)]++;
    colors[elem.charAt(elem.length - 1)]++;
  }
  for (const key in colors) if (colors[key] == 5) flush = true;
  if (
    sValues[0] === sValues[1] &&
    sValues[3] === sValues[4] &&
    (sValues[1] === sValues[2] || sValues[2] === sValues[3])
  )
    fullHouse = true;
  for (const key in valueCount) {
    if (valueCount[key] == 2 && pair) twoPair = true;
    else if (valueCount[key] == 2) pair = true;
    else if (valueCount[key] == 3) threeKind = true;
    else if (valueCount[key] == 4) fourKind = true;
    else if (valueCount[key] == 1)
      trdValue = Math.max(cardValues.indexOf(key), trdValue);
    if (valueCount[key] == 2 && (twoPair || fullHouse))
      sndValue = cardValues.indexOf(key) + 1;
    else if (
      valueCount[key] == 2 ||
      valueCount[key] == 3 ||
      valueCount[key] == 4
    )
      highValue = cardValues.indexOf(key) + 1;
    if (twoPair) {
      let sndHolder = sndValue;
      sndValue = Math.min(highValue, sndHolder);
      highValue = Math.max(highValue, sndHolder);
    }
  }
  if (
    cardValues.indexOf(sValues[0]) + 1 == cardValues.indexOf(sValues[1]) &&
    cardValues.indexOf(sValues[1]) + 1 == cardValues.indexOf(sValues[2]) &&
    cardValues.indexOf(sValues[2]) + 1 == cardValues.indexOf(sValues[3]) &&
    cardValues.indexOf(sValues[3]) + 1 == cardValues.indexOf(sValues[4])
  )
    straight = true;
  if (sValues.join("") == "2345A") {
    straight = true;
    highValue = -1;
  }
  if (highValue == 0) highValue = cardValues.indexOf(sValues[4]);

  if (straight && flush)
    return 100000 + highValue * 200 + sndValue * 10 + trdValue;
  if (fourKind) return 90000 + highValue * 200 + sndValue * 10 + trdValue;
  if (fullHouse) return 80000 + highValue * 200 + sndValue * 10 + trdValue;
  if (flush) return 70000 + highValue * 200 + sndValue * 10 + trdValue;
  if (straight) return 60000 + highValue * 200 + sndValue * 10 + trdValue;
  if (threeKind) return 50000 + highValue * 200 + sndValue * 10 + trdValue;
  if (twoPair) return 40000 + highValue * 200 + sndValue * 10 + trdValue;
  if (pair) return 20000 + highValue * 200 + sndValue * 10 + trdValue;
  return highValue * 200 + sndValue * 10 + trdValue;
};

export const bestHands = (hands) => {
  let bestHand = 0;
  let bestValue = 0;
  for (let i = 0; i < hands.length; i++) {
    if (analyseHand(hands[i]) > bestValue) {
      bestHand = i;
      bestValue = analyseHand(hands[i]);
    } else if (
      analyseHand(hands[i]) == bestValue &&
      hands[i][0] == hands[bestHand][0]
    ) {
      return [hands[bestHand], hands[i]];
    }
  }
  return [hands[bestHand]];
};
