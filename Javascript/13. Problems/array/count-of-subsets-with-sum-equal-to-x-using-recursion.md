```js
// Input: arr[] = {2, 3, 5, 6, 8, 10}, X = 10
// Output: 3
// Explanation:
// All possible subsets with sum 10 are {2, 3, 5}, {2, 8}, {10}

// Input: arr[] = {1, 2, 3, 4, 5}, X = 7
// Output: 3
// Explanation:
// All possible subsets with sum 7 are {2, 5}, {3, 4}, {1, 2, 4}

// Javascript program to print the count of
// subsets with sum equal to the given value X

// Recursive function to return the count
// of subsets with sum equal to the given value
function subsetSum(arr, n, i, sum, count) {
  // The recursion is stopped at N-th level
  // where all the subsets of the given array
  // have been checked
  if (i == n) {
    // Incrementing the count if sum is
    // equal to 0 and returning the count
    if (sum == 0) {
      count++;
    }
    return count;
  }

  // Recursively calling the function for two cases
  // Either the element can be counted in the subset
  // If the element is counted, then the remaining sum
  // to be checked is sum - the selected element
  // If the element is not included, then the remaining sum
  // to be checked is the total sum
  count = subsetSum(arr, n, i + 1, sum - arr[i], count);
  count = subsetSum(arr, n, i + 1, sum, count);
  return count;
}

// Driver code
var arr = [1, 2, 3, 4, 5];
var sum = 10;
var n = arr.length;
document.write(subsetSum(arr, n, 0, sum, 0));
