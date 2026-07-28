```js
// Input: Array[] = {1, 3, 5, 7, 9}, K = 2.
// Output: 7 9 1 3 5
// Explanation:
// After 1st rotation - {9, 1, 3, 5, 7}
// After 2nd rotation - {7, 9, 1, 3, 5}

// Input: Array[] = {1, 2, 3, 4, 5}, K = 4.
// Output: 2 3 4 5 1

// Javascript implementation of right rotation
// of an array K number of times

// Function to rightRotate array
function RightRotate(a, n, k) {
  // If rotation is greater
  // than size of array
  k = k % n;

  for (let i = 0; i < n; i++) {
    if (i < k) {
      // Printing rightmost
      // kth elements
      document.write(a[n + i - k] + " ");
    } else {
      // Prints array after
      // 'k' elements
      document.write(a[i - k] + " ");
    }
  }
  document.write("<br>");
}

// Driver code
let Array = [1, 2, 3, 4, 5];
let N = Array.length;
let K = 2;

RightRotate(Array, N, K);

// This code is contributed by gfgking.
