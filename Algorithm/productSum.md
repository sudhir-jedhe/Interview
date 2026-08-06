/**
 * Problem: Product Sum: Given an array (that can have nested arrays) - return the sum of all the numbers in the array.
 * If nested array is encountered, recursively add the numbers in the nested array multiplied by the depth of the nested array.
 */

const productSum = (arr) => {
    return productSumHelper(arr, (depth = 1));
  };
  
  // Time: O(N) Space: O(d) where d is the depth of the array
  productSumHelper = (arr, depth) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        sum += productSumHelper(arr[i], depth + 1);
      } else {
        sum += arr[i];
      }
    }
    return sum * depth;
  };
  
  const arr = [5, 2, [7, -1], 3, [6, [-13, 8], 4]];
  
  console.log(productSum(arr));
  

//   Example
// Input: [5, 2, [7, -1], 3, [6, [-13, 8], 4]]
// Output: 12
// Explanation
// If we encounter a non nested value - we simply add it to the global sum. If we encounter a nested array, the sum inside of the nested array is multiplied with the depth of that array and then returned.

// So the array [5, 2, [7, -1], 3, [6, [-13, 8], 4]] becomes:

// Equation = (5 + 2 + (7 - 1) * 2 + 3 + (6 + (-13 + 8)*3 + 4)*2) * 1  = 12