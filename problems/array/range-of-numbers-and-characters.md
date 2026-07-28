```js
const startNum = 1;
const endNum = 8;
const numbers = Array.from(
  { length: endNum - startNum + 1 },
  (_, index) => startNum + index
);

const startChar = "A";
const endChar = "G";
const CharCode1 = startChar.charCodeAt(0);
const CharCode2 = endChar.charCodeAt(0);
const characters = Array.from(
  { length: CharCode2 - CharCode1 + 1 },
  (_, index) => String.fromCharCode(CharCode1 + index)
);

console.log(numbers);
console.log(characters);
// [
//     1, 2, 3, 4,
//     5, 6, 7, 8
//   ]
//   [
//     'A', 'B', 'C',
//     'D', 'E', 'F',
//     'G'
//   ]

/*************************** */

function generateNumber(num1, num2) {
  const result = [];

  for (let i in [...Array(num2 - num1 + 1)]) {
    result.push(Number(i) + num1);
  }

  return result;
}

const result = generateNumber(1, 8);
console.log(result);
/******************************** */
const startChar = "A";
const endChar = "G";
const result = [];

for (
  let charCode = startChar.charCodeAt(0);
  charCode <= endChar.charCodeAt(0);
  charCode++
) {
  result.push(String.fromCharCode(charCode));
}

console.log(result);
