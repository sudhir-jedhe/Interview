```js
// Input: arr[] = {1, 1}
// Output: 6
// All possible subsets:
// a) {} : 0
// All the possible subsets of this subset
// will be {}, Sum = 0
// b) {1} : 1
// All the possible subsets of this subset
// will be {} and {1}, Sum = 0 + 1 = 1
// c) {1} : 1
// All the possible subsets of this subset
// will be {} and {1}, Sum = 0 + 1 = 1
// d) {1, 1} : 4
// All the possible subsets of this subset
// will be {}, {1}, {1} and {1, 1}, Sum = 0 + 1 + 1 + 2 = 4
// Thus, ans = 0 + 1 + 1 + 4 = 6
// Input: arr[] = {1, 4, 2, 12}
// Output: 513

// Javascript implementation of the approach

var ans = 0;

var c = [];

// Function to sum of all subsets of a
// given array
function subsetSum(i, curr) {
  // Base case
  if (i == c.length) {
    ans += curr;
    return;
  }

  // Recursively calling subsetSum
  subsetSum(i + 1, curr + c[i]);
  subsetSum(i + 1, curr);
}

// Function to generate the subsets
function subsetGen(arr, i, n, ans) {
  // Base-case
  if (i == n) {
    // Finding the sum of all the subsets
    // of the generated subset
    subsetSum(0, ans, 0);
    return;
  }

  // Recursively accepting and rejecting
  // the current number
  subsetGen(arr, i + 1, n, ans);
  c.push(arr[i]);
  subsetGen(arr, i + 1, n, ans);
  c.pop();
}

// Driver code
var arr = [1, 1];
var n = arr.length;
// To store the final ans
var ans = 0;
var c = [];
subsetGen(arr, 0, n, ans);
document.write(ans);
