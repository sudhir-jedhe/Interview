
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  let first, second;
  // second  = target - fisrt;
  // check whether second no present in array
  // if present index

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
};

/*********************************** */
export const twoSum = (nums, target) => {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
};

/************************************* */

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

/************************************** */

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


/*************************************** */
export const twoSum = (nums, target) => {
  const sortedNums = nums.slice().sort((a, b) => a - b);
  let left = 0,
    right = sortedNums.length - 1;

  while (left < right) {
    const sum = sortedNums[left] + sortedNums[right];

    if (sum === target) {
      const index1 = nums.indexOf(sortedNums[left]);
      const index2 = nums.indexOf(sortedNums[right], index1 + 1);
      return [index1, index2];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
};


/******************************* */

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


