```js
// 1. The matrix direct(kronecker) product of the 2×2 matrix A
//    and the 2×2 matrix B is given by the 4×4 matrix :

// Input : A = 1 2    B = 0 5
//             3 4        6 7

// Output : C = 0  5  0  10
//              6  7  12 14
//              0  15 0  20
//              18 21 24 28

// 2. The matrix direct(kronecker) product of the 2×3 matrix A
//    and the 3×2 matrix B is given by the 6×6 matrix :

// Input : A = 1 2    B = 0 5 2
//             3 4        6 7 3
//             1 0

// Output : C = 0      5    2    0     10    4
//              6      7    3   12     14    6
//              0     15    6    0     20    8
//             18     21    9   24     28   12
//              0      5    2    0      0    0
//              6      7    3    0      0    0

// Javascript code to find the Kronecker Product of
// two matrices and stores it as matrix C

// rowa and cola are no of rows and columns
// of matrix A
// rowb and colb are no of rows and columns
// of matrix B
let cola = 2,
  rowa = 3,
  colb = 3,
  rowb = 2;

// Function to computes the Kronecker Product
// of two matrices
function Kroneckerproduct(A, B) {
  let C = new Array(rowa * rowb);
  for (let i = 0; i < rowa * rowb; i++) {
    C[i] = new Array(cola * colb);
    for (let j = 0; j < cola * colb; j++) {
      C[i][j] = 0;
    }
  }

  // i loops till rowa
  for (let i = 0; i < rowa; i++) {
    // k loops till rowb
    for (let k = 0; k < rowb; k++) {
      // j loops till cola
      for (let j = 0; j < cola; j++) {
        // l loops till colb
        for (let l = 0; l < colb; l++) {
          // Each element of matrix A is
          // multiplied by whole Matrix B
          // resp and stored as Matrix C
          C[i + l + 1][j + k + 1] = A[i][j] * B[k][l];
          document.write(C[i + l + 1][j + k + 1] + " ");
        }
      }
      document.write("</br>");
    }
  }
}

let A = [
  [1, 2],
  [3, 4],
  [1, 0],
];

let B = [
  [0, 5, 2],
  [6, 7, 3],
];

Kroneckerproduct(A, B);
