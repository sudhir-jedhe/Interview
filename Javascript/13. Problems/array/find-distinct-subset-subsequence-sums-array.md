```js
// Input  : arr[] = {1, 2, 3}
// Output : 0 1 2 3 4 5 6
// Distinct subsets of given set are
// {}, {1}, {2}, {3}, {1,2}, {2,3},
// {1,3} and {1,2,3}.  Sums of these
// subsets are 0, 1, 2, 3, 3, 5, 4, 6
// After removing duplicates, we get
// 0, 1, 2, 3, 4, 5, 6

// Input : arr[] = {2, 3, 4, 5, 6}
// Output : 0 2 3 4 5 6 7 8 9 10 11 12
//          13 14 15 16 17 18 20

// Input : arr[] = {20, 30, 50}
// Output : 0 20 30 50 70 80 100

// Javascript program to print distinct
// subset sums of a given array.

// sum denotes the current sum
// of the subset currindex denotes
// the index we have reached in
// the given array
function distSumRec(arr, n, sum, currindex, s) {
  if (currindex > n) return;

  if (currindex == n) {
    s.add(sum);
    return;
  }

  distSumRec(arr, n, sum + arr[currindex], currindex + 1, s);
  distSumRec(arr, n, sum, currindex + 1, s);
}

// This function mainly calls
// recursive function distSumRec()
// to generate distinct sum subsets.
// And finally prints the generated subsets.
function printDistSum(arr, n) {
  let s = new Set();
  distSumRec(arr, n, 0, 0, s);
  let s1 = [...s];
  s1.sort(function (a, b) {
    return a - b;
  });
  // Print the result
  for (let [key, value] of s1.entries()) document.write(value + " ");
}

//Driver code
let arr = [2, 3, 4, 5, 6];
let n = arr.length;
printDistSum(arr, n);

// This code is contributed by unknown2108
/******************************************** */

// Javascript program to print distinct
// subset sums of a given array.

// Uses Dynamic Programming to find
// distinct subset sums
function printDistSum(arr, n) {
  var sum = 0;
  for (var i = 0; i < n; i++) sum += arr[i];

  // dp[i][j] would be true if arr[0..i-1] has
  // a subset with sum equal to j.
  var dp = Array.from(Array(n + 1), () => Array(sum + 1).fill(0));

  // There is always a subset with 0 sum
  for (var i = 0; i <= n; i++) dp[i][0] = true;

  // Fill dp[][] in bottom up manner
  for (var i = 1; i <= n; i++) {
    dp[i][arr[i - 1]] = true;
    for (var j = 1; j <= sum; j++) {
      // Sums that were achievable
      // without current array element
      if (dp[i - 1][j] == true) {
        dp[i][j] = true;
        dp[i][j + arr[i - 1]] = true;
      }
    }
  }

  // Print last row elements
  for (var j = 0; j <= sum; j++) if (dp[n][j] == true) document.write(j + " ");
}

// Driver code
var arr = [2, 3, 4, 5, 6];
var n = arr.length;

printDistSum(arr, n);

// This code is contributed by importantly

/*************************************** */
// Javascript Program to Demonstrate Bit Optimised Knapsack
// Solution

// Driver Code

// Input Array
var a = [2, 3, 4, 5, 6];
var n = a.length;

// Used a variable "dp" and initialized that with "1"
// because sum 0 is always possible
// Since binary of "1" is also "1" which means getting
// "1" at 0th index and it means sum=0
var dp = 1;

// dp transitions as explained in article
for (var i = 0; i < n; ++i) {
  dp |= dp << a[i];
}

//Getting that dp as binary bits of string
var ans = dp.toString(2);

// print all the 1s in that binary string, this will be the
// all the unique sums possible
for (var j = 0; j <= ans.length; j++) {
  if (ans[j] == "1") {
    console.log(j + " ");
  }
}
