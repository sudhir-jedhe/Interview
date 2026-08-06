```js
// Input:  arr[] = {1, 10, 3, 11, 6, 15};
// Output: 2
// Input:  arr[] = {1, 1, 1, 1};
// Output: 5
// Input:  arr[] = {1, 1, 3, 4};
// Output: 10
// Input:  arr[] = {1, 2, 5, 10, 20, 40};
// Output: 4
// Input:  arr[] = {1, 2, 3, 4, 5, 6};
// Output: 22

// javascript program to find the smallest positive value that cannot be
// represented as sum of subsets of a given sorted array

// Returns the smallest number that cannot be represented as sum
// of subset of elements from set represented by sorted array arr[0..n-1]
function findSmallest(arr, n) {
  var res = 1; // Initialize result

  // Traverse the array and increment 'res' if arr[i] is
  // smaller than or equal to 'res'.
  for (i = 0; i < n && arr[i] <= res; i++) res = res + arr[i];

  return res;
}

// Driver program to test above functions

var arr1 = [1, 3, 4, 5];
var n1 = arr1.length;
document.write(findSmallest(arr1, n1) + "<br/>");

var arr2 = [1, 2, 6, 10, 11, 15];
var n2 = arr2.length;
document.write(findSmallest(arr2, n2) + "<br/>");

var arr3 = [1, 1, 1, 1];
var n3 = arr3.length;
document.write(findSmallest(arr3, n3) + "<br/>");

var arr4 = [1, 1, 3, 4];
var n4 = arr4.length;
document.write(findSmallest(arr4, n4) + "<br/>");

// This code is contributed by aashish1995

/*************************************** */
function smallestPositiveInteger(arr) {
  const n = arr.length;
  let s = 0;
  for (let i = 0; i < n; i++) {
    s += arr[i]; // compute sum of all elements
  }
  const dp = new Array(s + 1).fill(false); // initialize dp array with false values
  dp[0] = true; // a subset with sum 0 can always be formed
  for (let i = 0; i < n; i++) {
    for (let j = s; j >= arr[i]; j--) {
      if (dp[j - arr[i]]) {
        // if it's possible to form a subset with sum j-arr[i]
        dp[j] = true; // then it's also possible to form a subset with sum j
      }
    }
  }
  for (let i = 1; i <= s; i++) {
    if (!dp[i]) {
      // find the smallest positive integer that cannot be formed
      return i;
    }
  }
  return s + 1; // if all integers can be formed, then the answer is s+1
}

// Driver code
const arr1 = [1, 3, 4, 5];
console.log(smallestPositiveInteger(arr1));

const arr2 = [1, 2, 6, 10, 11, 15];
console.log(smallestPositiveInteger(arr2));

const arr3 = [1, 1, 1, 1];
console.log(smallestPositiveInteger(arr3));

const arr4 = [1, 1, 3, 4];
console.log(smallestPositiveInteger(arr4));
