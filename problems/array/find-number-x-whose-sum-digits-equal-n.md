```js
// Input : N = 21
// Output : X = 15
// Explanation : X + its digit sum
//             = 15 + 1 + 5
//             = 21
// Input  : N = 5
// Output : -1
// Input : N = 100000001
// Output : X = 99999937
//          X = 100000000

// JavaScript program to find x such that
// X + sumOfDigits(X) = N

// Computing the sum of digits of x
function sumOfDigits(x) {
  let sum = 0;
  while (x > 0) {
    sum += x % 10;
    x = Math.floor(x / 10);
  }
  return sum;
}

// Checks for 100 numbers on both left
// and right side of the given number to
// find such numbers X such that
// X + sumOfDigits(X) = N and prints solution.
function compute(n) {
  let answer = [];
  let pos = 0;

  // Checking for all possibilities
  // of the answer in the given range
  for (let i = 0; i <= 100; i++) {
    // Evaluating the value on the
    // left side of the given number
    let valueOnLeft = Math.abs(n - i) + sumOfDigits(Math.abs(n - i));

    // Evaluating the value on the right
    // side of the given number
    let valueOnRight = n + i + sumOfDigits(n + i);

    // Checking the condition of equality
    // on both sides of the given number N
    // and updating the answer vector
    if (valueOnRight == n) answer[pos++] = n + i;
    if (valueOnLeft == n) answer[pos++] = Math.abs(n - i);
  }

  if (pos == 0) document.write(-1);
  else
    for (let i = 0; i < pos; i++) document.write("X = " + answer[i] + "<br/>");
}

// Driver Code
let N = 100000001;

compute(N);

/****************************************************** */

// Function to calculate the sum of the digits of a number
function digitSum(n) {
  let sum = 0;
  while (n > 0) {
    sum += n % 10; // Add the last digit of n to the sum
    n = Math.floor(n / 10); // Remove the last digit of n
  }
  return sum;
}

// Function to check if a number X has the desired digit sum N
function checkNumberWithDigitSum(X, N) {
  return X + digitSum(X) === N; // Return true if X + its digit sum equals N
}

// Function to find the smallest number that has the desired digit sum N
function findNumberWithDigitSum(N) {
  let low = 1;
  let high = N; // Set the search range to [1, N]
  while (low <= high) {
    // Perform binary search until the range is empty
    let mid = Math.floor((low + high) / 2); // Calculate the midpoint of the range
    if (checkNumberWithDigitSum(mid, N)) {
      // Check if the midpoint has the desired digit sum
      return mid; // Return the midpoint if it does
    } else if (mid + digitSum(mid) < N) {
      // If the midpoint has a digit sum less than N
      low = mid + 1; // Search the upper half of the range
    } else {
      // If the midpoint has a digit sum greater than or equal to N
      high = mid - 1; // Search the lower half of the range
    }
  }
  return -1; // If no number with the desired digit sum is found, return -1
}

const N = 100000001; // Choose a desired digit sum
console.log(findNumberWithDigitSum(N)); // Find the smallest number with that digit sum and output it
