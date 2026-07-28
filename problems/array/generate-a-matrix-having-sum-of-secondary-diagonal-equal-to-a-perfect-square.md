```js
// Input: N = 3
// Output:
// 1 2 3
// 2 3 1
// 3 2 1
// Explanation:
// The sum of secondary diagonal = 3 + 3 + 3 = 9(= 32).

// Input: N = 7
// Output:
// 1 2 3 4 5 6 7
// 2 3 4 5 6 7 1
// 3 4 5 6 7 1 2
// 4 5 6 7 1 2 3
// 5 6 7 1 2 3 4
// 6 7 1 2 3 4 5
// 7 1 2 3 4 5 6
// Explanation:
// The sum of secondary diagonal = 7 + 7 + 7 + 7 + 7 + 7 + 7 = 49(= 72).

// Javascript program to implement
// the above approach

// Function to print the matrix whose sum
// of element in secondary diagonal is a
// perfect square
function diagonalSumPerfectSquare(arr, N) {
  // Iterate for next N - 1 rows
  for (let i = 0; i < N; i++) {
    // Print the current row after
    // the left shift
    for (let j = 0; j < N; j++) {
      document.write(arr[(j + i) % 7] + " ");
    }
    document.write("<br/>");
  }
}

// Driver Code

// Given N
let N = 7;

let arr = new Array(N).fill(0);

// Fill the array with elements
// ranging from 1 to N
for (let i = 0; i < N; i++) {
  arr[i] = i + 1;
}

// Function Call
diagonalSumPerfectSquare(arr, N);

/********************************************************* */
