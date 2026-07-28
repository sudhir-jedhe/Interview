```js
// Input: N = 3
// Output:
// 1 2 8
// 1 3 4
// 0 3 4
// Input: N = 4
// Output:
// 1 2 2 3
// 1 3 4 2
// 0 3 4 2
// 0 0 1 4

// Given a positive integer N, the task is to print the Upper Hessenberg matrix of order N which includes any one-digit random positive integer as its non-zero elements.
// Upper Hessenberg matrix is a square matrix in which all of its elements below the sub-diagonal are zero. In mathematical term mat[i][j] = 0 for all i > j + 1.

// Javascript implementation of the approach

// Function to print the Upper Hessenberg
// matrix of order n
function UpperHessenbergMatrix(n) {
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= n; j++) {
      // If element is below sub-diagonal
      // then print 0
      if (i > j + 1) document.write("0" + " ");
      // Print a random digit for
      // every non-zero element
      else document.write(Math.floor(Math.random() * 10) + " ");
    }
    document.write("<br>");
  }
}

// Driver code
var n = 4;
UpperHessenbergMatrix(n);
