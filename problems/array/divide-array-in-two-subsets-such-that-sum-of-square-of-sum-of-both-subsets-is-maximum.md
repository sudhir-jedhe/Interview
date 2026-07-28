```js
// Input: arr[] = {1, 2, 3}
// Output: 26
// Explanation:
// Sum of Subset Pairs are as follows
// (1)2 + (2 + 3)2 = 26
// (2)2 + (1 + 3)2 = 20
// (3)2 + (1 + 2)2 = 18
// Maximum among these is 26, Therefore the required sum is 26

// Input: arr[] = {7, 2, 13, 4, 25, 8}
// Output: 2845

// javascript implementation of the approach
// Creating the bblSort function
function bblSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    // Last i elements are already in place
    for (var j = 0; j < arr.length - i - 1; j++) {
      // Checking if the item at present iteration
      // is greater than the next iteration
      if (arr[j] > arr[j + 1]) {
        // If the condition is true then swap them
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  // return the sorted array
  return arr;
}
// Function to return the maximum sum of the
// square of the sum of two subsets of an array
function maxSquareSubsetSum(A, N) {
  // Initialize variables to store
  // the sum of subsets
  var sub1 = 0,
    sub2 = 0;

  // Sorting the array
  A = bblSort(A);

  // Loop through the array
  for (i = 0; i < N; i++) {
    // Sum of the first subset
    if (i < N / 2 - 1) sub1 += A[i];
    // Sum of the second subset
    else sub2 += A[i];
  }

  // Return the maximum sum of
  // the square of the sum of subsets
  return sub1 * sub1 + sub2 * sub2;
}

// Driver code

var arr = [7, 2, 13, 4, 25, 8];
var N = arr.length;

document.write(maxSquareSubsetSum(arr, N));

// This code is contributed by todaysgaurav
