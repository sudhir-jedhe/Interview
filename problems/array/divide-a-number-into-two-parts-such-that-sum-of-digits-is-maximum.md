```js
// Input: N = 35
// Output: 17
// 35 = 9 + 26
// SumOfDigits(26) = 8, SumOfDigits(9) = 9
// So, 17 is the answer.
// Input: N = 7
// Output: 7

// JavaScript implementation of above approach

// Returns sum of digits of x
function sumOfDigitsSingle(x) {
  let ans = 0;
  while (x) {
    ans += x % 10;
    x = Math.floor(x / 10);
  }
  return ans;
}

// Function to find the sum of digits
// of two parts
function sumOfDigitsTwoParts(N) {
  // To store answer
  let ans = Number.MIN_VALUE;

  for (let i = 0; i <= N; i++) {
    // Find sum of Digits of both
    // first number and second number
    let temp = sumOfDigitsSingle(i) + sumOfDigitsSingle(N - i);

    // Update ans with maximum
    // sum of digits
    ans = Math.max(ans, temp);
  }
  return ans;
}

// Driver Code
let N = 35;
console.log(sumOfDigitsTwoParts(N));

/******************
 *
 */

// JavaScript implementation of above approach

// Returns sum of digits of x
function sumOfDigitsSingle(x) {
  let ans = 0;
  while (x) {
    ans += x % 10;
    x = Math.floor(x / 10);
  }
  return ans;
}

// Returns closest number to x
// in terms of 9's.
function closest(x) {
  let ans = 0;

  while (ans * 10 + 9 <= x) ans = ans * 10 + 9;

  return ans;
}

function sumOfDigitsTwoParts(N) {
  let A = closest(N);
  return sumOfDigitsSingle(A) + sumOfDigitsSingle(N - A);
}

// Driver code
let N = 35;

document.write(sumOfDigitsTwoParts(N));

// This code is contributed by Surbhi Tyagi.
