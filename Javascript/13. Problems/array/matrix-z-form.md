```js
// are matrix of order n*n, we need to print elements of the matrix in Z form

//     Input: [[4, 5, 6, 8],
//             [1, 2, 3, 1],
//             [7, 8, 9, 4],
//             [1, 8, 7, 5]]

//     Output: 4 5 6 8
//                 3
//               8
//             1 8 7 5

//     Input: [[4, 5, 6, 8, 5],
//             [1, 2, 3, 1, 4],
//             [7, 8, 9, 4, 7],
//             [1, 8, 7, 5, 2],
//             [7, 9, 5, 6, 9],
//             [9, 4, 5, 6, 6]]

//     Output: 4 5 6 8 5
//                   1
//                 9
//               8
//             7
//            9 4 5 6 6

// JavaScript program to print a square
// matrix in Z form

function printZform(mat, n) {
  var i, j;

  // print first row
  for (i = 0; i < n; i++) {
    document.write(mat[0][i] + " ");
  }
  // Print diagonal
  i = 1;
  j = n - 2;

  while (i < n && j >= 0) {
    // print diagonal
    document.write(mat[i][j] + " ");
    i++;
    j--;
  }

  // Print last row
  for (i = 1; i < n; i++) document.write(mat[n - 1][i] + " ");
}
// Driver code
var mat = [
  [4, 5, 6, 8],
  [1, 2, 3, 1],
  [7, 8, 9, 4],
  [1, 8, 7, 5],
];
printZform(mat, 4);

/****************************** */
// JavaScript program to print a square
// matrix in Z form

function printZform(mat, n) {
  var i = 0,
    j;

  // print first row except last element
  for (i = 0; i < n - 1; i++) {
    document.write(mat[0][i] + " ");
  }

  // Print second diagonal except last element
  for (i = 0; i < n - 1; i++) {
    document.write(mat[i][n - i - 1] + " ");
  }

  // Print last row
  for (i = 0; i < n; i++) {
    document.write(mat[n - 1][i] + " ");
  }
}

// Driver code
var mat = [
  [4, 5, 6, 8],
  [1, 2, 3, 1],
  [7, 8, 9, 4],
  [1, 8, 7, 5],
];
printZform(mat, 4);

// This code is contributed by Aarti_Rathi
