```js
// Input: N = 10
// Output: 4
// Explanation: The integers that cannot be expressed as sum of two or more consecutive
// integers are {1, 2, 4, 8}. Therefore, the count of integers is 4.

// Input: N = 100
// Output: 7

// JavaScript program for the above approach

// Function to check if a number can
// be expressed as a power of 2
function isPowerof2(n) {
  // f N is power of
  // two
  return n & (n - 1) && n;
}

// Function to count numbers that
// cannot be expressed as sum of
// two or more consecutive +ve integers
function countNum(N) {
  // Stores the resultant
  // count of integers
  let count = 0;

  // Iterate over the range [1, N]
  for (let i = 1; i <= N; i++) {
    // Check if i is power of 2
    let flag = isPowerof2(i);

    // Increment the count if i
    // is not power of 2
    if (!flag) {
      count++;
    }
  }

  // Print the value of count
  document.write(count + "\n");
}

// Driver code

let N = 100;
countNum(N);

// This code is contributed by souravghosh0416.

/****************************** */

// Javascript program for the above approach

// Function to count numbers that
// cannot be expressed as sum of
// two or more consecutive +ve integers
function countNum(N) {
  // Stores the count
  // of such numbers
  var ans = parseInt(Math.log(N) / Math.log(2)) + 1;

  document.write(ans);
}

// Driver Code
var N = 100;
countNum(N);

// This code contributed by shikhasingrajput
