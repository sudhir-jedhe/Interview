```js
// Input: arr[] = {2, 2, 3}
// Output: 6
// All possible sub-sets are {2}, {2}, {2, 2}, {2, 3}, {2, 3} and {2, 2, 3}

// Input: arr[] = {3, 3, 3}
// Output: 6

// Approach: We already know that:

// Even * Even = Even
// Odd * Even = Even
// Odd * Odd = Odd

// Javascript implementation of above approach

// Function to find total number of subsets
// in which product of the elements is even
function find(a, n) {
  var count_odd = 0;

  for (var i = 0; i < n; i++) {
    // counting number of odds elements
    if (i % 2 != 0) count_odd += 1;
  }

  var result = Math.pow(2, n) - 1;
  result -= Math.pow(2, count_odd) - 1;
  document.write(result);
}

// Driver code
var a = [2, 2, 3];
var n = a.length;

// function calling
find(a, n);
