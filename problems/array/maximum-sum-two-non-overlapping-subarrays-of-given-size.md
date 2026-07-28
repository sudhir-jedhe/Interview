```js
// Input : arr[] = [2, 5, 1, 2, 7, 3, 0]
//         K = 2
// Output : 2 5
//          7 3
// We can choose two arrays of maximum sum
// as [2, 5] and [7, 3], the sum of these two
// subarrays is maximum among all possible
// choices of subarrays of length 2.

// Input : arr[] = {10, 1, 3, 15, 30, 40, 4, 50, 2, 1}
//         K = 3
// Output : 3 15 30
//          40 4 50

// JavaScript program to get maximum sum two non-overlapping
// subarrays of same specified length

// Utility method to get sum of subarray
// from index i to j
function getSubarraySum(sum, i, j) {
  if (i == 0) return sum[j];
  else return sum[j] - sum[i - 1];
}

// Method prints two non-overlapping subarrays of
// length K whose sum is maximum
function maximumSumTwoNonOverlappingSubarray(arr, N, K) {
  let sum = new Array(N);

  // filling prefix sum array
  sum[0] = arr[0];
  for (let i = 1; i < N; i++) sum[i] = sum[i - 1] + arr[i];

  // initializing subarrays from (N-2K) and (N-K) indices
  let resIndex = [N - 2 * K, N - K];

  // initializing result sum from above subarray sums
  let maxSum2Subarray =
    getSubarraySum(sum, N - 2 * K, N - K - 1) +
    getSubarraySum(sum, N - K, N - 1);

  // storing second subarray maximum and its starting index
  let secondSubarrayMax = [N - K, getSubarraySum(sum, N - K, N - 1)];

  // looping from N-2K-1 towards 0
  for (let i = N - 2 * K - 1; i >= 0; i--) {
    // get subarray sum from (current index + K)
    let cur = getSubarraySum(sum, i + K, i + 2 * K - 1);

    // if (current index + K) sum is more then update
    // secondSubarrayMax
    if (cur >= secondSubarrayMax[1]) secondSubarrayMax = [i + K, cur];

    // now getting complete sum (sum of both subarrays)
    cur = getSubarraySum(sum, i, i + K - 1) + secondSubarrayMax[1];

    // if it is more then update main result
    if (cur >= maxSum2Subarray) {
      maxSum2Subarray = cur;
      resIndex = [i, secondSubarrayMax[0]];
    }
  }

  // printing actual subarrays
  for (let i = resIndex[0]; i < resIndex[0] + K; i++)
    document.write(arr[i] + " ");
  document.write("<br>");

  for (let i = resIndex[1]; i < resIndex[1] + K; i++)
    document.write(arr[i] + " ");
  document.write("<br>");
}

// Driver code to test above methods

let arr = [2, 5, 1, 2, 7, 3, 0];
let N = arr.length;

// K will be given such that (N >= 2K)
let K = 2;

maximumSumTwoNonOverlappingSubarray(arr, N, K);
