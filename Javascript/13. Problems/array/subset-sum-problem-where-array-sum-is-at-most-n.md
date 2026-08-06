```js
// Input: arr[] = {1, 0, 0, 0, 0, 2, 3}, queries[] = {3, 7, 6}
// Output:
// Possible
// Not Possible
// Possible
// Explanation: 3 is spossible. 6 can be obtained by the subset {1, 2, 3}
// 7 is greater than the sum of all array elements.

// Input: arr[] = {0, 1, 2}, queries[] = {1, 2, 3, 0}
// Output:
// Possible
// Possible
// Possible
// Possible
// Explanation: All the sums can be obtained by using the elements.

// JavaScript code to implement the approach

// Function to find if the queries
// are possible or not
function findSol(arr, queries) {
  let s = 0;

  // Calculating sum of array
  for (let item of arr) {
    s += item;
  }

  // Coordinate compression,
  // make frequency-value pairs
  let mp = new Map();
  for (let item of arr) {
    if (mp.has(item)) mp.set(item, mp.get(item) + 1);
    else mp.set(item, 1);
  }

  let val = [],
    freq = [];

  // Frequency mapping
  for (let [x, y] of mp) {
    val.push(x);
    freq.push(y);
  }

  let len = val.length;
  let dp = new Array(len + 1).fill(0).map(() => new Array(s + 1).fill(0));

  for (let j = 1; j <= s; ++j) {
    dp[0][j] = -1;
  }

  // Loop to build the dp[][]
  for (let i = 1; i <= len; ++i) {
    for (let j = 1; j <= s; ++j) {
      let v = val[i - 1];
      let f = freq[i - 1];

      if (dp[i - 1][j] != -1) {
        dp[i][j] = 0;
      } else if (j >= v && dp[i][j - v] != -1 && dp[i][j - v] + 1 <= f) {
        dp[i][j] = dp[i][j - v] + 1;
      } else {
        dp[i][j] = -1;
      }
    }
  }

  // Answer queries
  for (let q of queries) {
    if (q > s || dp[len][q] == -1) {
      console.log("Not Possible");
    } else {
      console.log("Possible");
    }
  }
}

// Driver Code

let arr = [1, 0, 0, 0, 0, 2, 3];
let queries = [3, 7, 6];

// Function call
findSol(arr, queries);

// This code is contributed by shinjanpatra
// Possible
// Not Possible
// Possible
