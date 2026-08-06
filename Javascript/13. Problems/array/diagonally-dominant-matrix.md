```js
// Input : A = { { 3, -2, 1 },
//               { 1, -3, 2 },
//               { -1, 2, 4 } };
// Output : YES
// Given matrix is diagonally dominant
// because absolute value of every diagonal
// element is more than sum of absolute values
// of corresponding row.

// Input : A = { { -2, 2, 1 },
//               { 1, 3, 2 },
//               { 1, -2, 0 } };
// Output : NO

// JavaScript Program to check whether given matrix
// is Diagonally Dominant Matrix.

// check the given matrix is Diagonally
// Dominant Matrix or not.
function isDDM(m, n) {
  // for each row
  for (let i = 0; i < n; i++) {
    // for each column, finding
    //sum of each row.
    let sum = 0;
    for (let j = 0; j < n; j++) sum += Math.abs(m[i][j]);

    // removing the diagonal element.
    sum -= Math.abs(m[i][i]);

    // checking if diagonal element is less
    // than sum of non-diagonal element.
    if (Math.abs(m[i][i]) < sum) return false;
  }

  return true;
}

// Driver code

let n = 3;
let m = [
  [3, -2, 1],
  [1, -3, 2],
  [-1, 2, 4],
];

if (isDDM(m, n)) document.write("YES");
else document.write("NO");
