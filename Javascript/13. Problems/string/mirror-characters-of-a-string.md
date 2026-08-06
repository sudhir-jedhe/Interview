```js
// Input : N = 3
//         paradox
// Output : paizwlc
// We mirror characters from position 3 to end.

// Input : N = 6
//         pneumonia
// Output : pnefnlmrz

function reverseAlphabetFromPosition(inputString, startPosition) {
  let reverseAlphabet = "zyxwvutsrqponmlkjihgfedcba";
  let inputStringLength = inputString.length;
  let newString = "";

  for (let i = 0; i < startPosition; i++) newString += inputString[i];

  for (let i = startPosition; i < inputStringLength; i++)
    newString +=
      reverseAlphabet[inputString[i].charCodeAt() - "a".charCodeAt()];

  return newString;
}

let givenString = "geeksforgeeks";
let startingPosition = 5;
console.log(reverseAlphabetFromPosition(givenString, startingPosition - 1));

/************************************************* */
let givenString = "geeksforgeeks";
let startingPosition = 5;
let mirroredString = "";
for (let i = 0; i < givenString.length; i++) {
  if (i >= startingPosition - 1) {
    mirroredString += String.fromCharCode(219 - givenString.charCodeAt(i));
  } else {
    mirroredString += givenString[i];
  }
}
console.log(mirroredString);

/************************* */
let givenString = "geeksforgeeks";
let startingPosition = 5;
const mirrorMap = {
  a: "z",
  b: "y",
  c: "x",
  d: "w",
  e: "v",
  f: "u",
  g: "t",
  h: "s",
  i: "r",
  j: "q",
  k: "p",
  l: "o",
  m: "n",
  n: "m",
  o: "l",
  p: "k",
  q: "j",
  r: "i",
  s: "h",
  t: "g",
  u: "f",
  v: "e",
  w: "d",
  x: "c",
  y: "b",
  z: "a",
};

let mirroredString = "";
for (let char of givenString) {
  startingPosition--;
  if (startingPosition > 0) {
    mirroredString += char;
  } else mirroredString += mirrorMap[char] || char;
}
console.log(mirroredString);
