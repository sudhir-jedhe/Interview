```js
// Given an array arr[] consisting of N integers and an integer K, the task is to find the
// maximum number of disjoint subsets that the given array can be split into such that the
// product of the minimum element of each subset with the size of the subset is at least K.

// Examples:

// Input: arr[] = {7, 11, 2, 9, 5}, K = 10
// Output: 2
// Explanation:
// All such disjoint subsets possible are:
// Subset {11}: Product of minimum and size of the subset = 11 * 1 = 11 ( > 10).
// Subset {5, 9, 7}: Product of minimum and size of the subset = 5 * 3 = 15( > 10).
// Therefore, the total number of subsets formed is 2.

// Input: arr[] = {1, 3, 3, 7}, K = 12
// Output: 0

// JavaScript program to implement
// the above approach

// Function to reverse the sorted array
function reverse(arr) {
  // Length of the array
  let n = arr.length;

  // Swapping the first half elements with last half
  // elements
  for (let i = 0; i < n / 2; i++) {
    // Storing the first half elements temporarily
    let temp = arr[i];

    // Assigning the first half to the last half
    arr[i] = arr[n - i - 1];

    // Assigning the last half to the first half
    arr[n - i - 1] = temp;
  }
}

// Function to find the maximum number
// of subsets possible such that
// product of their minimums and the
// size of subsets are at least K
function maximumSubset(arr, N, K) {
  // Sort the array in
  // descending order
  arr.sort();
  arr.reverse();
  // Stores the size of
  // the current subset
  let len = 0;

  // Stores the count of subsets
  let ans = 0;

  // Traverse the array arr[]
  for (let i = 0; i < N; i++) {
    // Increment length of the
    // subsets by 1
    len++;

    // If arr[i] * len >= K
    if (arr[i] * len >= K) {
      // Increment ans by one
      ans++;

      // Update len
      len = 0;
    }
  }

  // Return the maximum possible
  // subsets formed
  return ans;
}

// Driver code

let arr = [7, 11, 2, 9, 5];
let K = 10;
let N = arr.length;
document.write(maximumSubset(arr, N, K));
