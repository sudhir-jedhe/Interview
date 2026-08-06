```js
// Input :  1  2  3
//          4  5  6
//          7  8  9

// Output : 9 8 7
//          6 5 4
//          3 2 1

// Input :  1 2 3 4
//          5 6 7 8
//          9 0 1 2
//          3 4 5 6

// Output : 6 5 4 3
//          2 1 0 9
//          8 7 6 5
//          4 3 2 1

// Javascript program to rotate a
// matrix by 180 degrees
N = 3;

// Function to Rotate the
// matrix by 180 degree
function rotateMatrix(mat) {
  // Simply print from last
  // cell to first cell.
  for (var i = N - 1; i >= 0; i--) {
    for (var j = N - 1; j >= 0; j--) document.write(mat[i][j] + " ");

    document.write("<br>");
  }
}

// Driver Code
var mat = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

rotateMatrix(mat);

// This code is contributed by kirti

/************************************************ */

// Javascript program for left
// rotation of matrix by 180

let R = 4,
  C = 4,
  t = 0;

// Function to rotate the
// matrix by 180 degree
function reverseColumns(arr) {
  for (let i = 0; i < C; i++) {
    for (let j = 0, k = C - 1; j < k; j++, k--) {
      t = arr[j][i];
      arr[j][i] = arr[k][i];
      arr[k][i] = t;
    }
  }
}

// Function for transpose of matrix
function transpose(arr) {
  for (let i = 0; i < R; i++) {
    for (let j = i; j < C; j++) {
      t = arr[i][j];
      arr[i][j] = arr[j][i];
      arr[j][i] = t;
    }
  }
}

// Function for display the matrix
function printMatrix(arr) {
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) document.write(arr[i][j] + " ");
    document.write("<br>");
  }
}

// Function to anticlockwise
// rotate matrix by 180 degree
function rotate180(arr) {
  transpose(arr);
  reverseColumns(arr);
  transpose(arr);
  reverseColumns(arr);
}

// Driver Code
let arr = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];
rotate180(arr);
printMatrix(arr);

//This code is contributed by avanitrachhadiya2155

/********************************************* */

// Reverse Row at specified index in the matrix
// @param data matrix
// @param index row index
function reverseRow(data, index) {
  let cols = data[index].length;
  for (let i = 0; i < cols / 2; i++) {
    let temp = data[index][i];
    data[index][i] = data[index][cols - i - 1];
    data[index][cols - i - 1] = temp;
  }
}

/**
 * Print Matrix data
 * @param data matrix
 */
function printMatrix(data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      document.write(data[i][j] + " ");
    }
    document.write("<br>");
  }
}

/**
 * Rotate Matrix by 180 degrees
 * @param data matrix
 */
function rotateMatrix180(data) {
  let rows = data.length;
  let cols = data[0].length;

  if (rows % 2 != 0) {
    // If N is odd reverse the middle
    // row in the matrix
    reverseRow(data, Math.floor(data.length / 2));
  }

  // Swap the value of matrix [i][j]
  // with [rows - i - 1][cols - j - 1]
  // for half the rows size.
  for (let i = 0; i <= rows / 2 - 1; i++) {
    for (let j = 0; j < cols; j++) {
      let temp = data[i][j];
      data[i][j] = data[rows - i - 1][cols - j - 1];
      data[rows - i - 1][cols - j - 1] = temp;
    }
  }
}

// Driver code
let data = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
];
// Rotate Matrix
rotateMatrix180(data);

// Print Matrix
printMatrix(data);

// This code is contributed by rag2127
