```js
// Input: A[] = {1, 1, 2, 3}, diff = 1
// Output: 3
// Explanation: All possible combinations are as follows:

// {1, 1, 2} and {3}
// {1, 3} and {1, 2}
// {1, 2} and {1, 3}
// All partitions have difference between their sums equal to 1. Therefore, the count of ways is 3.

// Input: A[] = {1, 6, 11, 5}, diff=1
// Output: 2

// JavaScript program for the above approach

// Function to count the number of ways to divide
// the array into two subsets and such that the
// difference between their sums is equal to diff
function countSubset(arr, n, diff) {
  // Store the sum of the set S1
  var sum = 0;
  for (var i = 0; i < n; i++) {
    sum += arr[i];
  }
  sum += diff;
  sum = sum / 2;

  // Initializing the matrix
  //int t[n + 1][sum + 1];
  var t = new Array(n + 1);

  // Loop to create 2D array using 1D array
  for (var i = 0; i < t.length; i++) {
    t[i] = new Array(sum + 1);
  }

  // Loop to initialize 2D array elements.
  for (var i = 0; i < t.length; i++) {
    for (var j = 0; j < t[i].length; j++) {
      t[i][j] = 0;
    }
  }

  // Number of ways to get sum
  // using 0 elements is 0
  for (var j = 0; j <= sum; j++) t[0][j] = 0;

  // Number of ways to get sum 0
  // using i elements is 1
  for (var i = 0; i <= n; i++) t[i][0] = 1;

  // Traverse the 2D array
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= sum; j++) {
      // If the value is greater
      // than the sum store the
      // value of previous state
      if (arr[i - 1] > j) t[i][j] = t[i - 1][j];
      else {
        t[i][j] = t[i - 1][j] + t[i - 1][j - arr[i - 1]];
      }
    }
  }

  // Return the result
  return t[n][sum];
}

// Driver Code

// Given Input
var diff = 1;
var n = 4;
var arr = [1, 1, 2, 3];

// Function Call
document.write(countSubset(arr, n, diff));

/***************************************** */
// Function to count the number of ways to divide
// the array into two subsets and such that the
// difference between their sums is equal to diff
function countSubset(arr, n, diff) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += arr[i];
  }
  sum += diff;
  sum = Math.floor(sum / 2);

  // Initializing the vector Dp
  let dp = new Array(sum + 1).fill(0);

  // Base Case
  dp[0] = 1;

  // Iterate over subproblems to get the current
  // computation
  for (let i = 0; i < n; i++) {
    for (let j = sum; j >= arr[i]; j--) {
      // Update DP from previous values
      dp[j] += dp[j - arr[i]];
    }
  }

  // Return answer
  return dp[sum];
}

// Driver Code
let diff = 1,
  n = 4;
let arr = [1, 1, 2, 3];

// Function Call
console.log(countSubset(arr, n, diff));
