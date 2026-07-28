```js
// Input : arr[] = {2, 2, 2, -4}
// Output : 0
// arr[0] + arr[1] + arr[3] = 0
// That’s why answer is zero.
// Input : arr[] = {1, 1, 1, 1}
// Output : 1

// Javascript Program for above approach

let arrSize = 51;
let maxSum = 201;
let MAX = 100;
let inf = 999999;

// Variable to store states of dp
let dp = new Array(arrSize);
let visit = new Array(arrSize);

for (let i = 0; i < arrSize; i++) {
  dp[i] = new Array(maxSum);
  visit[i] = new Array(maxSum);
  for (let j = 0; j < maxSum; j++) {
    dp[i][j] = 0;
    visit[i][j] = 0;
  }
}

// Function to return the number
// closer to integer s
function RetClose(a, b, s) {
  if (Math.abs(a - s) < Math.abs(b - s)) return a;
  else return b;
}

// To find the sum closest to zero
// Since sum can be negative, we will add MAX
// to it to make it positive
function MinDiff(i, sum, arr, n) {
  // Base cases
  if (i == n) return 0;

  // Checks if a state is already solved
  if (visit[i][sum + MAX] > 0) return dp[i][sum + MAX];
  visit[i][sum + MAX] = 1;

  // Recurrence relation
  dp[i][sum + MAX] = RetClose(
    arr[i] + MinDiff(i + 1, sum + arr[i], arr, n),
    MinDiff(i + 1, sum, arr, n),
    -1 * sum
  );

  // Returning the value
  return dp[i][sum + MAX];
}

// Function to calculate the closest sum value
function FindClose(arr, n) {
  let ans = inf;

  // Calculate the Closest value for every
  // subarray arr[i-1:n]
  for (let i = 1; i <= n; i++)
    ans = RetClose(arr[i - 1] + MinDiff(i, arr[i - 1], arr, n), ans, 0);

  document.write(ans);
}

// Input array
let arr = [25, -9, -10, -4, -7, -33];
let n = arr.length;

FindClose(arr, n);
