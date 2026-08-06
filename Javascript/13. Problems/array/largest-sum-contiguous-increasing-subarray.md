```js
// Input : arr[] = {2, 1, 4, 7, 3, 6}
// Output : 12
// Contiguous Increasing subarray {1, 4, 7} = 12
// Input : arr[] = {38, 7, 8, 10, 12}
// Output : 38

// Javascript implementation of largest sum
// contiguous increasing subarray

// Returns sum of longest
// increasing subarray.
function largestSum(arr, n) {
  // Initialize result
  var result = -1000000000;

  // Note that i is incremented
  // by inner loop also, so overall
  // time complexity is O(n)
  for (var i = 0; i < n; i++) {
    // Find sum of longest
    // increasing subarray
    // starting from arr[i]
    var curr_sum = arr[i];
    while (i + 1 < n && arr[i + 1] > arr[i]) {
      curr_sum += arr[i + 1];
      i++;
    }

    // Update result if required
    if (curr_sum > result) result = curr_sum;
  }

  // required largest sum
  return result;
}

// Driver Code
var arr = [1, 1, 4, 7, 3, 6];
var n = arr.length;
document.write("Largest sum = " + largestSum(arr, n));
