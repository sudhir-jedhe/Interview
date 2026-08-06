```js
// Input : mat[N][N] = {{1, 0, 0},
//                      {0, -1, 0},
//                      {0, 0, -1}}
// Output : Involutory Matrix

// Input : mat[N][N] = {{1, 0, 0},
//                      {0, 1, 0},
//                      {0, 0, 1}}
// Output : Involutory Matrix

// A matrix is said to be involutory matrix if matrix multiply by itself return the identity matrix.
//  Involutory matrix is the matrix that is its own inverse.
// The matrix A is said to be involutory matrix if A * A = I. Where I is the identity matrix.

// Javascript to implement involutory matrix.
var N = 3;

// Function for matrix multiplication.
function multiply(mat, res) {
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      res[i][j] = 0;
      for (var k = 0; k < N; k++) res[i][j] += mat[i][k] * mat[k][j];
    }
  }
}

// Function to check involutory matrix.
function InvolutoryMatrix(mat) {
  var res = Array(N)
    .fill(0)
    .map((x) => Array(N).fill(0));

  // Multiply function call.
  multiply(mat, res);

  for (var i = 0; i < N; i++) {
    for (var j = 0; j < N; j++) {
      if (i == j && res[i][j] != 1) return false;
      if (i != j && res[i][j] != 0) return false;
    }
  }
  return true;
}

// Driver code
var mat = [
  [1, 0, 0],
  [0, -1, 0],
  [0, 0, -1],
];

// Function call. If function return
// true then if part will execute
// otherwise else part will execute.
if (InvolutoryMatrix(mat)) document.write("Involutory Matrix");
else document.write("Not Involutory Matrix");

// This code is contributed by 29AjayKumar
