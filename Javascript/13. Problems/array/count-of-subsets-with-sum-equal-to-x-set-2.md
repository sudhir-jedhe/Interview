```js
// Input: arr[] = {1, 2, 3, 3}, X = 6
// Output: 3
// Explanation: All the possible subsets are {1, 2, 3}, {1, 2, 3} and {3, 3}.

// Input: arr[] = {1, 1, 1, 1}, X = 1
// Output: 4

// Javascript implementation of the above approach

// Function to find the count of subsets
// having the given sum
function subsetSum(arr, n, sum) {
  // Initializing the dp-table
  let dp = new Array(sum + 1).fill(0);

  // Case for sum of elements in empty set
  dp[0] = 1;

  // Loop to iterate over array elements
  for (let i = 0; i < n; i++) {
    for (let j = sum; j >= 0; j--) {
      // If j-arr[i] is a valid index
      if (j - arr[i] >= 0) {
        dp[j] = dp[j - arr[i]] + dp[j];
      }
    }
  }

  // Return answer
  return dp[sum];
}

// Driven Code
let arr = [1, 1, 1, 1];
let N = arr.length;
let sum = 1;

document.write(subsetSum(arr, N, sum));

// This code is contributed by gfgking.

/********************************************** */
// Recursive function to count subsets with a sum equal to X
const countSubsets = (arr, X, dp, i, sum) => {
  // Base case: if we have reached the end of the array
  if (i < 0) {
    return sum === X ? 1 : 0;
  }

  // If the subproblem has already been solved, return the solution
  if (dp[i][sum] !== -1) {
    return dp[i][sum];
  }

  // If we don't include the current element in the subset
  let ans = countSubsets(arr, X, dp, i - 1, sum);

  // If we include the current element in the subset
  if (sum + arr[i] <= X) {
    ans += countSubsets(arr, X, dp, i - 1, sum + arr[i]);
  }

  // Memoize the solution to the subproblem
  dp[i][sum] = ans;

  // Return the solution to the current subproblem
  return ans;
};

// Driver code
const arr = [1, 1, 1, 1];
const X = 1;

const dp = new Array(arr.length + 1)
  .fill()
  .map(() => new Array(X + 1).fill(-1));

const ans = countSubsets(arr, X, dp, arr.length - 1, 0);

console.log(ans);
