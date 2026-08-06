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

// JavaScript implementation of the approach

// To store factorial values
let fact = new Array(10);

// Function to return ncr
function ncr(n, r) {
  return fact[n] / fact[r] / fact[n - r];
}

// Function to return the required sum
function findSum(arr, n) {
  // Initialising factorial
  fact[0] = 1;
  for (let i = 1; i < n; i++) fact[i] = i * fact[i - 1];

  // Multiplier
  let mul = 0;

  // Finding the value of multiplier
  // according to the formula
  for (let i = 0; i <= n - 1; i++) mul += Math.pow(2, i) * ncr(n - 1, i);

  // To store the final answer
  let ans = 0;

  // Calculate the final answer
  for (let i = 0; i < n; i++) ans += mul * arr[i];

  return ans;
}

// Driver code

let arr = [1, 1];
let n = arr.length;

document.write(findSum(arr, n));

// This code is contributed by Mayank Tyagi
