```js
// Given two arrays A[] and B[] having N integers, the task is to find the minimum operations
// required to make all the elements of both the array equal where at each operation, the following can be done:

// Decrement the value of A[i] by 1 where i lies in the range [0, N).
// Decrement the value of B[i] by 1 where i lies in the range [0, N).
// Decrement the value of A[i] and B[i] by 1 where i lies in the range [0, N).
// Note: Elements in array A[] and B[] need not be equal to one another.

// Example:

// Input: arr1[] = {1, 2, 3}, arr2[] = {5, 4, 3}
// Output: 5
// Explanation: Operations can be performed in the following way:

// Decrement element at index 2 of A[] by 1. Hence, A[] = {1, 2, 2}.
// Decrement element at index 2 of A[] by 1. Hence, A[] = {1, 2, 1}.
// Decrement element at index 0 of B[] by 1. Hence, B[] = {4, 4, 3}.
// Decrement element at index 0 of B[] by 1. Hence, B[] = {3, 4, 3}.
// Decrement element at index 1 of both A[] and B[] by 1. Hence A[] = {1, 1, 1} and B[] = {3, 3, 3}
// Therefore, all the elements of both the arrays A[] and B[] can be made equal in 5 operation which is the minimum possible.

// Input: A[] = {7, 2, 8, 5, 3}, B[] = {3, 4, 5, 9, 1}, N = 5
// Output: 23

// Javascript program for the above approach

// Function to find the minimum operations
// required to make elements of each array
// equal of the given two arrays
function minOperations(a, b, N) {
  // Stores the minimum element in array a[]
  let min_a = Math.min.apply(Math, a);

  // Stores the minimum element in array b[]
  let min_b = Math.min.apply(Math, b);

  // Variable to store the required ans
  let ans = 0;

  // Iterate over the elements
  for (let i = 0; i < N; i++) {
    // Store the difference between current
    // element and minimum of respective array
    let x = a[i] - min_a;
    let y = b[i] - min_b;

    // Add maximum of x and y to ans
    ans += Math.max(x, y);
  }

  // Return Answer
  return ans;
}

// Driver Code
let a = [7, 2, 8, 5, 3];
let b = [3, 4, 5, 9, 1];
let N = a.length;

document.write(minOperations(a, b, N));

// This code is contributed by Samim Hossain Mondal.
