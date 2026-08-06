// Sorted Squared Array
// Given an array of integers A, sorted in non-decreasing order, return an array of the squares of each number, also in sorted non-decreasing order.

// Keep in mind these are integers - Therefore both negative and positive numbers will be there.

// Example
// Input
// arr = [-6, -4, 1, 2, 3, 5])
// Output
// [ 1, 4, 9, 16, 25, 36 ]
// Explanation
// The output array is the result of every number squared, and sorted in increasing order.

// Example
// Input
// arr = [-7, -5, -4, 3, 6, 8, 9]
// Output
// [9, 16, 25, 36, 49, 64, 81]
// Constraints
// -10000 <= arr[n] <= 10000
// 1 <= arr.length <= 100


// Time: O(NlogN)
const sortedSquaredArray = (arr) => {
    let result = new Array(arr.length).fill(0);
  
    let k = 0;
    for (let i = 0; i < arr.length; i++) {
      result[k] = arr[i] * arr[i];
      k++;
    }
    return result.sort((a, b) => a - b);
  };
  
  console.log(sortedSquaredArray([-7, -5, -4, 3, 6, 8, 9]));

  /*************************************** */

  // Time: O(N)
const sortedSquaredArray = (arr) => {
    let result = new Array(arr.length).fill(0);
    let start = 0,
      end = arr.length - 1,
      k = arr.length - 1;
  
    while (start <= end) {
      if (Math.abs(arr[start]) <= Math.abs(arr[end])) {
        result[k] = arr[end] * arr[end];
        end--;
        k--;
      } else {
        result[k] = arr[start] * arr[start];
        start++;
        k--;
      }
    }
  
    return result;
  };
  
  console.log(sortedSquaredArray([-7, -5, -4, 3, 6, 8, 9]));