```js
// Input:
// Matrix:    1  2  3
//                4  5  6
//                7  8  9

// Output:  3  6  9
//                2  5  8
//                1  4  7

// Input:
// Matrix:    1  2  3  4
//                5  6  7  8
//                9 10 11 12
//               13 14 15 16

// Output:  4  8 12 16
//                3  7 11 15
//                2  6 10 14
//                1  5  9 13

// Javascript program to rotate a
// matrix by 90 degrees

// An Inplace function to
// rotate a N x N matrix
// by 90 degrees in
// anti-clockwise direction
function rotateMatrix(N, mat) {
  // Consider all squares one by one
  for (let x = 0; x < N / 2; x++) {
    // Consider elements in group
    // of 4 in current square
    for (let y = x; y < N - x - 1; y++) {
      // Store current cell in
      // temp variable
      let temp = mat[x][y];

      // Move values from right to top
      mat[x][y] = mat[y][N - 1 - x];

      // Move values from bottom to right
      mat[y][N - 1 - x] = mat[N - 1 - x][N - 1 - y];

      // Move values from left to bottom
      mat[N - 1 - x][N - 1 - y] = mat[N - 1 - y][x];

      // Assign temp to left
      mat[N - 1 - y][x] = temp;
    }
  }
}

// Function to print the matrix
function displayMatrix(N, mat) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) document.write(" " + mat[i][j]);

    document.write("<br>");
  }
  document.write("<br>");
}

/* Driver program to test above functions */
let N = 4;
let mat = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

// displayMatrix(mat);
rotateMatrix(N, mat);

// Print rotated matrix
displayMatrix(N, mat);

// This code is contributed by rag2127.

/********************************************************* */

// JavaScript program to rotate
// a matrix by 90 degrees
function rotateMatrix(mat) {
  // reversing the matrix
  for (let i = 0; i < mat.length; i++) {
    mat[i].reverse();
  }

  // make transpose of the matrix
  for (let i = 0; i < mat.length; i++) {
    for (let j = i; j < mat.length; j++) {
      // swapping mat[i][j] and mat[j][i]
      let temp = mat[i][j];
      mat[i][j] = mat[j][i];
      mat[j][i] = temp;
    }
  }
}

// Function to print the matrix
function displayMatrix(mat) {
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat.length; j++) {
      document.write(mat[i][j], " ");
    }
    document.write("</br>");
  }
}

let mat = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

rotateMatrix(mat);

// Print rotated matrix
displayMatrix(mat);

// This code is contributed by shinjanpatra

/************************************************ */

// JavaScript program for the above approach
function rotateMatrix(matrix) {
  let n = matrix.length;

  // transpose the matrix
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  // reverse each column
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n / 2; j++) {
      temp = matrix[n - j - 1][i];
      matrix[n - j - 1][i] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
}

// driver program
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
rotateMatrix(matrix);
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[0].length; j++) {
    console.log(matrix[i][j] + " ");
  }
  console.log("<br>");
}

// THIS CODE IS CONTRIBUTED BY YASH AGARWAL(YASHAGAWRAL2852002)
