```js
// Input : N = 2
// Output : 1    0.5
//         0.5  0.33
// Input : N = 3
// Output : 1.0000    0.5000    0.3333
//         0.5000    0.3333    0.2500
//         0.3333    0.2500    0.2000

//         A Hilbert Matrix is a square matrix whose each element is a unit fraction.

// Let H be a Hilbert Matrix of NxN.
// Then
// H(i, j) = 1/(i+j-1)

// JavaScript program for Hilbert Matrix

// Function that generates a Hilbert matrix
function printMatrix(n) {
  let H = new Array(n);

  for (var i = 0; i < n; i++) {
    H[i] = new Array(n);
    for (var j = 0; j < n; j++) {
      // using the formula to generate
      // hilbert matrix
      H[i][j] = 1.0 / (i + 1 + (j + 1) - 1.0);
    }
  }

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) process.stdout.write(H[i][j] + " ");
    process.stdout.write("\n");
  }
}

// driver function
n = 3;
printMatrix(n);

// This code is contributed by phasing17
/*


1           0.5         0.333333 
0.5         0.333333    0.25 
0.333333    0.25        0.2 

*/
