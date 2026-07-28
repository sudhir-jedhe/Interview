```js
// Input: arr[] = {5, 2, 7, 12}
// Output: 4 2 8 16
// Explanation:
// The nearest power of arr[0] ( = 5) is 4.
// The nearest power of arr[1] ( = 2) is 2.
// The nearest power of arr[2] ( = 7) is 8.
// The nearest power of arr[3] ( = 12) are 8 and 16. Print 16, as it is the largest.

// Input: arr[] = {31, 13, 64}
// Output: 32 16 64

// JavaScript program to implement
// the above approach

// Function to find the nearest power of two
// for every element of the given array
function nearestPowerOfTwo(arr, N) {
  // Traverse the array
  for (i = 0; i < N; i++) {
    // Calculate log of the
    // current array element
    var lg = parseInt(Math.log(arr[i]) / Math.log(2));
    var a = parseInt(Math.pow(2, lg));
    var b = parseInt(Math.pow(2, lg + 1));

    // Find the nearest
    if (arr[i] - a < b - arr[i]) document.write(a + " ");
    else document.write(b + " ");
  }
}

// Driver Code

var arr = [5, 2, 7, 12];
var N = arr.length;
nearestPowerOfTwo(arr, N);

// This code is contributed by todaysgaurav
