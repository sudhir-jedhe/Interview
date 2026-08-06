```js
function twoSum(nums, target) {
    const numMap = {}; // Object to store numbers and their indices
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (complement in numMap) {
            return [numMap[complement], i];
        }
        
        numMap[nums[i]] = i;
    }
    
    return []; // In case no solution is found (though problem guarantees there will be exactly one solution)
}

// Example usage:
const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(result); // Output: [0, 1] (because nums[0] + nums[1] equals 9)
/*********************************** */
function twoSumHashTable(nums, target) {
    const seen = {};
    for (let i = 0; i < nums.length; i++) {
      const difference = target - nums[i];
      if (difference in seen) {
        return [seen[difference], i];
      }
      seen[nums[i]] = i;
    }
    return []; // No solution found
  }
  
  const nums = [2, 7, 11, 15];
  const target = 9;
  const result = twoSumHashTable(nums, target);
  console.log(result); // Output: [0, 1]

  
  /***************************************** */

  function twoSumSorting(nums, target) {
    // Sort the array in ascending order
    nums.sort((a, b) => a - b);
  
    let left = 0;
    let right = nums.length - 1;
  
    while (left <= right) {
      const currentSum = nums[left] + nums[right];
      if (currentSum === target) {
        return [left, right];
      } else if (currentSum < target) {
        left++;
      } else {
        right--;
      }
    }
    return []; // No solution found
  }
  
  const nums = [2, 7, 11, 15];
  const target = 9;
  const result = twoSumSorting(nums.slice(), target); // Slice to avoid modifying the original array
  console.log(result); // Output: [0, 1]