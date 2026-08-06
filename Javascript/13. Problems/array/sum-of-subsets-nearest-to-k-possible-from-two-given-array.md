```js
// Given two arrays A[] and B[] consisting of N and M integers respectively, and an integer K,
// the task is to find the sum nearest to K possible by selecting
// exactly one element from the array A[] and an element from the array B[], at most twice.

// Input: A[] = {1, 7}, B[] = {3, 4}, K = 10
// Output: 10
// Explanation:
// Sum obtained by selecting A[0] and A[1] = 3 + 7 = 10, which is closest to the value K(= 10).

// Input: A[] = {2, 3}, B[] = {4, 5, 30}, K = 18
// Output: 17

// Javascript program for the above approach

// Stores the sum closest to K
let ans = Number.MAX_SAFE_INTEGER;

// Stores the minimum absolute difference
let mini = Number.MAX_SAFE_INTEGER;

// Function to choose the elements
// from the array B[]
function findClosestTarget(i, curr, B, M, K) {
  // If absolute difference is less
  // then minimum value
  if (Math.abs(curr - K) < mini) {
    // Update the minimum value
    mini = Math.abs(curr - K);

    // Update the value of ans
    ans = curr;
  }

  // If absolute difference between
  // curr and K is equal to minimum
  if (Math.abs(curr - K) == mini) {
    // Update the value of ans
    ans = Math.min(ans, curr);
  }

  // If i is greater than M - 1
  if (i >= M) return;

  // Includes the element B[i] once
  findClosestTarget(i + 1, curr + B[i], B, M, K);

  // Includes the element B[i] twice
  findClosestTarget(i + 1, curr + 2 * B[i], B, M, K);

  // Excludes the element B[i]
  findClosestTarget(i + 1, curr, B, M, K);
}

// Function to find a subset sum
// whose sum is closest to K
function findClosest(A, B, N, M, K) {
  // Traverse the array A[]
  for (let i = 0; i < N; i++) {
    // Function Call
    findClosestTarget(0, A[i], B, M, K);
  }

  // Return the ans
  return ans;
}

// Driver Code
// Input
let A = [2, 3];
let B = [4, 5, 30];
let N = A.length;
let M = B.length;
let K = 18;

// Function Call
document.write(findClosest(A, B, N, M, K));

//This code is contributed by Hritik.
