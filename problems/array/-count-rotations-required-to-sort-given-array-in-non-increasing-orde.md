```js
// Input: arr[] = {2, 1, 5, 4, 3}
// Output: 2
// Explanation: Two anti-clockwise rotations are required to sort the array in decreasing order, i.e. {5, 4, 3, 2, 1}

// Input: arr[] = {2, 3, 1}
// Output: -1

// JavaScript program for the above approach

// Function to count minimum anti-
// clockwise rotations required to
// sort the array in non-increasing order
function minMovesToSort(arr, N) {
  // Stores count of arr[i + 1] > arr[i]
  let count = 0;

  // Store last index of arr[i+1] > arr[i]
  let index = 0;

  // Traverse the given array
  for (let i = 0; i < N - 1; i++) {
    // If the adjacent elements are
    // in increasing order
    if (arr[i] < arr[i + 1]) {
      // Increment count
      count++;

      // Update index
      index = i;
    }
  }

  // Print result according
  // to the following conditions
  if (count == 0) {
    document.write("0");
  } else if (count == N - 1) {
    document.write(N - 1);
  } else if (count == 1 && arr[0] <= arr[N - 1]) {
    document.write(index + 1);
  }

  // Otherwise, it is not
  // possible to sort the array
  else {
    document.write("-1");
  }
}

// Driver Code

// Given array
let arr = [2, 1, 5, 4, 2];
let N = arr.length;

// Function Call
minMovesToSort(arr, N);
