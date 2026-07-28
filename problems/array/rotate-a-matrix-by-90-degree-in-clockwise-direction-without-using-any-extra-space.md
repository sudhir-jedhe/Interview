```js
// Input:
// 1 2 3
// 4 5 6
// 7 8 9
// Output:
// 7 4 1
// 8 5 2
// 9 6 3

// Input:
// 1 2
// 3 4
// Output:
// 3 1
// 4 2

// Javascript implementation of above approach

var N = 4;

// Function to rotate the matrix 90 degree clockwise
function rotate90Clockwise(a) {
  // Traverse each cycle
  for (i = 0; i < parseInt(N / 2); i++) {
    for (j = i; j < N - i - 1; j++) {
      // Swap elements of each cycle
      // in clockwise direction
      var temp = a[i][j];
      a[i][j] = a[N - 1 - j][i];
      a[N - 1 - j][i] = a[N - 1 - i][N - 1 - j];
      a[N - 1 - i][N - 1 - j] = a[j][N - 1 - i];
      a[j][N - 1 - i] = temp;
    }
  }
}

// Function for print matrix
function printMatrix(arr) {
  for (i = 0; i < N; i++) {
    for (j = 0; j < N; j++) document.write(arr[i][j] + " ");
    document.write("<br/>");
  }
}

// Driver code

var arr = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];
rotate90Clockwise(arr);
printMatrix(arr);

// This code contributed by Rajput-Ji

/**************************************** */

// javascript implementation of above approach
var N = 4;

// Function to rotate the matrix 90 degree clockwise
function rotate90Clockwise(arr) {
  // printing the matrix on the basis of
  // observations made on indices.
  for (j = 0; j < N; j++) {
    for (i = N - 1; i >= 0; i--) document.write(arr[i][j] + " ");
    document.write("<br/>");
  }
}

var arr = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];
rotate90Clockwise(arr);

/********************************** */

// Rotate matrix elements by one place
const R = 3;
const C = 3;

// A function to rotate a matrix mat[][] of size R x C.
// Initially, m = R and n = C
function rotateMatrix(m, n, mat) {
  let row = 0,
    col = 0;
  let prev, curr;

  // Store the first element of next row, this
  // element will replace first element of current
  // row
  while (row < m && col < n) {
    if (row + 1 === m || col + 1 === n) break;

    prev = mat[row + 1][col];

    // Move elements of first row
    // from the remaining rows
    for (let i = col; i < n; i++) {
      curr = mat[row][i];
      mat[row][i] = prev;
      prev = curr;
    }
    row++;

    // Move elements of last column
    // from the remaining columns
    for (let i = row; i < m; i++) {
      curr = mat[i][n - 1];
      mat[i][n - 1] = prev;
      prev = curr;
    }
    n--;

    // Move elements of last row
    // from the remaining rows
    if (row < m) {
      for (let i = n - 1; i >= col; i--) {
        curr = mat[m - 1][i];
        mat[m - 1][i] = prev;
        prev = curr;
      }
    }
    m--;

    // Move elements of first column
    // from the remaining rows
    if (col < n) {
      for (let i = m - 1; i >= row; i--) {
        curr = mat[i][col];
        mat[i][col] = prev;
        prev = curr;
      }
    }
    col++;
  }
}

// Drive code
const mat = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

rotateMatrix(R, C, mat);
console.log(mat);

//Rotations in Matrix by row or column ( Transpose of the matrix ):

// Function to transpose a square matrix
function transpose(A) {
  // Get the size of the square matrix
  const N = A.length;
  // Create an empty array to store the transposed matrix
  const B = [];

  // Loop through the rows of the original matrix
  for (let i = 0; i < N; i++) {
    // Create a new row in the transposed matrix
    B[i] = [];
    // Loop through the columns of the original matrix
    for (let j = 0; j < N; j++) {
      // Swap the elements of the original matrix to create the transposed matrix
      // Rows become columns and columns become rows
      B[i][j] = A[j][i];
    }
  }

  // Return the transposed matrix
  return B;
}

// Driver code

// Define a 3x3 matrix 'A'
const A = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Call the 'transpose' function to get the transposed matrix 'B'
const B = transpose(A);

// Display the transposed matrix 'B'
console.log("Modified matrix is:");
for (let i = 0; i < B.length; i++) {
  let rowStr = "";
  for (let j = 0; j < B[i].length; j++) {
    // Create a string representation of the matrix elements for printing
    rowStr += " " + B[i][j];
  }
  // Log the row of the transposed matrix
  console.log(rowStr);
}

// Modified matrix is
//  1 4 7
//  2 5 8
//  3 6 9
