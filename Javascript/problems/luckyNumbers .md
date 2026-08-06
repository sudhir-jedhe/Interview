```js
// luckyNumbers.js
export function luckyNumbers(matrix) {
  const luckyNumbers = [];

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const minInRow = Math.min(...row); // Find the minimum element in the row
    const colIndex = row.indexOf(minInRow); // Get the index of the minimum element

    // Check if the minimum element is the maximum in its column
    let isMaxInCol = true;
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[j][colIndex] > minInRow) {
        isMaxInCol = false;
        break;
      }
    }

    // If the minimum element is the maximum in its column, it's a lucky number
    if (isMaxInCol) {
      luckyNumbers.push(minInRow);
    }
  }

  return luckyNumbers;
}

// main.js
import { luckyNumbers } from "./luckyNumbers.js";

const matrix = [
  [3, 7, 8],
  [9, 11, 13],
  [15, 16, 17],
];
console.log(luckyNumbers(matrix)); // Output: [15]

// In this lab, you will be working with a challenge related to lucky numbers in
// a matrix. You will identify and return all the lucky numbers in a given
// matrix. A lucky number is an element of the matrix that is the minimum
// element in its row and maximum in its column. You will have to follow the
// rules of ESM import/export and create multiple challenges.

// Example 1:

// const matrix = [
//   [3, 7, 8],
//   [9, 11, 13],
//   [15, 16, 17],
// ];
// // Output: [15]
// Example 2:

// const matrix = [
//   [1, 10, 4, 2],
//   [9, 3, 8, 7],
//   [15, 16, 17, 12],
// ];
// // Output: [12]
```
