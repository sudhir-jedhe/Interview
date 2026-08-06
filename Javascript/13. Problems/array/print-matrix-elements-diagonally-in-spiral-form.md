```js
// Input : N=5, M=6, K=15, arr[][]={{1, 2, 3, 4, 5, 6},
//                                                      {7, 8, 9, 10, 11, 12},
//                                                      {13, 14, 15, 16, 17, 18},
//                                                      {19, 20, 21, 22, 23, 24},
//                                                      {25, 26, 27, 28, 29, 30}}
// Output: 1, 2, 7, 13, 8, 3, 4, 9, 14, 19, 25, 20, 15
// Explanation:

// 1	2	3	4	5	6
// 7	8	9	10	11	12
// 13	14	15	16	17	18
// 19	20	21	22	23	24
// 25	26	27	28	29	30
// 1st diagonal printed: {1}
// 2nd diagonal printed: {2, 7}
// 3rd diagonal printed: {13, 8, 3}
// ……
// 5th diagonal printed {25, 20, 15}.
// Since 15 is encountered, no further matrix element is printed.

// Input: N = 4, M = 3, K = 69, arr[][]={{4, 87, 24},
//                                                     {17, 1, 18},
//                                                     {25, 69, 97},
//                                                     {19, 27, 85}}
// Output: 4, 87, 17, 25, 1, 24, 18, 69

// JavaScript implementation for the above approach

// Function to check if the
// indices are valid or not
function isValid(i, j, N, M) {
  return i >= 0 && i < N && j >= 0 && j < M;
}

// Function to evaluate the next
// index while moving diagonally up
function up(i, j, N, M) {
  if (isValid(i - 1, j + 1, N, M)) return [i - 1, j + 1];
  else return [-1, -1];
}

// Function to evaluate the next
// index while moving diagonally down
function down(i, j, N, M) {
  if (isValid(i + 1, j - 1, N, M)) return [i + 1, j - 1];
  else return [-1, -1];
}

// Function to print matrix elements
// diagonally in Spiral Form
function SpiralDiagonal(N, M, K, a) {
  var i = 0,
    j = 0;

  // Total Number of Diagonals
  // = N + M - 1
  for (var diagonal = 0; diagonal < N + M - 1; diagonal++) {
    while (1) {
      // Stop when K is
      // encountered
      if (a[i][j] == K) {
        document.write(K);
        return;
      }

      // Print the integer
      document.write(a[i][j], ", ");

      // Store the next index
      var next = new Array(2);
      if (diagonal & 1) {
        next = down(i, j, N, M);
      } else {
        next = up(i, j, N, M);
      }

      // If current index is invalid
      if (next[0] == next[1] && next[0] == -1) {
        // Move to the next diagonal
        if (diagonal & 1) {
          i + 1 < N ? ++i : ++j;
        } else {
          j + 1 < M ? ++j : ++i;
        }
        break;
      }

      // Otherwise move to the
      // next valid index
      else {
        i = next[0];
        j = next[1];
      }
    }
  }
}

// Driver Code
var N = 5,
  M = 6,
  K = 15;
var arr = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30],
];

// Function Call
SpiralDiagonal(N, M, K, arr);
