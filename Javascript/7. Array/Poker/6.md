const CARD = /^([\d+,J,K,Q,A]+)[S,H,D,C]$/,
  FACES = { A: 14, K: 13, Q: 12, J: 11 },
  SPECIALS = { 2: true, 3: true, 4: true, 7: true, 8: true };

export const bestHands = (hands) => {
  let winHigh,
    winHand,
    winKicker,
    winScore = 0,
    winners = { 0: true };

  for (let i = 0; i < hands.length; ++i) {
    let kicker,
      high = 0,
      score = 1, // assume high card by default
      hand = hands[i].split(" ").sort((a, b) => {
        if (a === b) {
          return 0;
        }

        let x = a.match(CARD)[1],
          y = b.match(CARD)[1];

        return (Number(x) || FACES[x]) - (Number(y) || FACES[y]);
      }),
      [s1, s2, s3, s4, s5] = hand.map((card) => {
        return card[card.length - 1];
      }),
      faces = hand.map((card) => {
        let face = card.match(CARD)[1];
        return Number(face) || FACES[face];
      }),
      [a, b, c, d, e] = faces;

    if (
      s1 === s2 &&
      s2 === s3 &&
      s3 === s4 &&
      s4 === s5 &&
      (b === a + 1 || (b === 2 && a === 14)) &&
      c === b + 1 &&
      d === c + 1 &&
      (e === d + 1 || (e === 14 && a === 2))
    ) {
      // straight flush
      score = 9;
    } else if (a === b && b === c && c === d) {
      // four of a kind
      score = 8;
      high = Number(a) || FACES[a];
      kicker = Number(e) || FACES[e];
    } else if (b === c && c === d && d === e) {
      // four of a kind
      score = 8;
      high = Number(b) || FACES[b];
      kicker = Number(a) || FACES[a];
    } else if (a === b && d === e && b === c) {
      // full house
      score = 7;
      high = Number(a) || FACES[a];
    } else if (a === b && d === e && c === d) {
      // full house
      score = 7;
      high = Number(c) || FACES[c];
    } else if (s1 === s2 && s2 === s3 && s3 === s4 && s4 === s5) {
      // flush
      score = 6;
    } else if (
      (b === a + 1 || (b === 2 && a === 14)) &&
      c === b + 1 &&
      d === c + 1 &&
      (e === d + 1 || (e === 14 && a === 2))
    ) {
      // straight
      score = 5;
    } else if (a === b && b === c) {
      // three of a kind
      score = 4;
      high = Number(a) || FACES[a];
    } else if (b === c && c === d) {
      // three of a kind
      score = 4;
      high = Number(b) || FACES[b];
    } else if (c === d && d === e) {
      // three of a kind
      score = 4;
      high = Number(c) || FACES[c];
    } else if (a === b && c === d) {
      // two pair
      score = 3;
      high = Math.max(a, c);
    } else if (b === c && d === e) {
      // two pair
      score = 3;
      high = Math.max(b, d);
    } else if (a === b && d === e) {
      // two pair
      score = 3;
      high = Math.max(a, d);
    } else if (a === b) {
      // pair
      score = 2;
      high = Number(a) || FACES[a];
    } else if (b === c) {
      // pair
      score = 2;
      high = Number(b) || FACES[b];
    } else if (c === d) {
      // pair
      score = 2;
      high = Number(c) || FACES[c];
    } else if (d === e) {
      // pair
      score = 2;
      high = Number(e) || FACES[e];
    }

    if (score > winScore) {
      winHand = hand;
      winScore = score;
      winners = { [i]: true };

      if (SPECIALS[score]) {
        winHigh = high;
      }
      if (score === 8) {
        winKicker = kicker;
      }

      continue;
    }
    if (score === winScore) {
      if (SPECIALS[score] && high > winHigh) {
        winHand = hand;
        winHigh = high;
        winScore = score;
        winners = { [i]: true };

        continue;
      }
      if (score === 8 && kicker > winKicker) {
        winHand = hand;
        winHigh = high;
        winScore = score;
        winKicker = kicker;
        winners = { [i]: true };

        continue;
      }

      let j;

      for (j = 4; j >= 0; --j) {
        let card = winHand[j].match(CARD)[1];

        card = Number(card) || FACES[card];

        if (faces[j] > card && !(score === 5 && faces[j] === 14 && j === 4)) {
          winHand = hand;
          winScore = score;
          winners = { [i]: true };

          if (SPECIALS[score]) {
            winHigh = high;
          }

          break;
        }
        if (faces[j] < card) {
          break;
        }
      }

      if (j === -1 && score === 1 && score === winScore && !winners[i]) {
        winners[i] = true;
      }
    }
  }

  return hands.filter((_, i) => {
    return winners[i];
  });
};
