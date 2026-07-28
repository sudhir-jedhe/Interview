```js
// Input : 00011110001110
// Output : 2
// We need to convert 1's sequence
// so string consist of all 0's.

// Input : 010101100011
// Output : 4

const inputStr = "010101100011";
const regex = /([01])\1*/g;
const result = inputStr.match(regex) || [];
let flips = 0;

for (const match of result) {
  flips += match.length - 1;
}

console.log("Minimum flips needed :", flips);

/**************************************** */

let inputStr = "010101100011";
let result = 0;

for (let i in inputStr) {
  if (i % 2 === 0 && inputStr[i] !== "0") {
    result++;
  } else if (i % 2 === 1 && inputStr[i] !== "1") {
    result++;
  }
}

console.log("Minimum flips needed:", result);
