```js
/*
Input :  N = 3, M = 3, K = 2
         12 23 34
         45 56 67
         78 89 91 

Output : 23 34 12
         56 67 45
         89 91 78 


Input :  N = 2, M = 2, K = 2
         1 2
         3 4
         
Output : 1 2
         3 4

         */

// Javascript program to rotate a matrix
// right by k times

// size of matrix
var M = 3;
var N = 3;

// function to rotate matrix by k times
function rotateMatrix(matrix, k) {
  // temporary array of size M
  var temp = Array(M).fill(0);

  // within the size of matrix
  k = k % M;

  for (i = 0; i < N; i++) {
    // copy first M-k elements
    // to temporary array
    for (t = 0; t < M - k; t++) temp[t] = matrix[i][t];

    // copy the elements from k
    // to end to starting
    for (j = M - k; j < M; j++) matrix[i][j - M + k] = matrix[i][j];

    // copy elements from
    // temporary array to end
    for (j = k; j < M; j++) matrix[i][j] = temp[j - k];
  }
}

// function to display the matrix
function displayMatrix(matrix) {
  for (i = 0; i < N; i++) {
    for (j = 0; j < M; j++) document.write(matrix[i][j] + " ");
    document.write("<br/>");
  }
}

// Driver code

var matrix = [
  [12, 23, 34],
  [45, 56, 67],
  [78, 89, 91],
];
var k = 2;

// rotate matrix by k
rotateMatrix(matrix, k);

// display rotated matrix
displayMatrix(matrix);

// This code contributed by umadevi9616

// 23 34 12
// 56 67 45
// 89 91 78
