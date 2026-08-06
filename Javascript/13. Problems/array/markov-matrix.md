```js
// The matrix in which the sum of each row is equal to 1.

/*
Input :
1    0   0
0.5  0  0.5
0    0   1
Output : yes

Explanation :
Sum of each row results to 1, 
therefore it is a Markov Matrix.

Input :
1 0 0
0 0 2
1 0 0
Output :
no
*/

// Javascript code to check Markov Matrix

let n = 3;

function checkMarkov(m) {
  // outer loop to access rows
  // and inner to access columns
  for (let i = 0; i < n; i++) {
    // Find sum of current row
    let sum = 0;
    for (let j = 0; j < n; j++) sum = sum + m[i][j];

    if (sum != 1) return false;
  }

  return true;
}

// driver code

// Matrix to check
let m = [
  [0, 0, 1],
  [0.5, 0, 0.5],
  [1, 0, 0],
];

// calls the function check()
if (checkMarkov(m)) document.write(" yes ");
else document.write(" no ");
