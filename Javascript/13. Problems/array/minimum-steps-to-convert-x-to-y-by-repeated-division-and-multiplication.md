```js
// Input: X = 8, Y = 12
// Output: 2
// Explanation:
// First divide 8 by 2: 8/2 = 4
// Then multiply by 3: 4*3 = 12

// Input: X = 4, Y = 8
// Output: 1
// Explanation:
// To convert 4 to 8 multiply 4 by 2: 4 * 2 = 8

// Javascript implementation to find minimum
// steps to convert X to Y by repeated
// division and multiplication

function solve(X, Y) {
  // Check if X is greater than Y
  // then swap the elements
  if (X > Y) {
    let temp = X;
    X = Y;
    Y = temp;
  }

  // Check if X equals Y
  if (X == Y) document.write(0);
  else if (Y % X == 0) document.write(1);
  else document.write(2);
}

let X = 8,
  Y = 13;
solve(X, Y);
