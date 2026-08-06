// Ques 4 - Given an integer array nums, find the subarray with the largest sum,
// and return its sum.

// Input: [-2,1,-3,4,-1,2,1,-5,4]     ----->>>>>    Output: 6,   [4,-1,2,1]
// Input: [5,4,-1,7,8]                ----->>>>>    Output: 23,  [5,4,-1,7,8]

// Brute Force Approach
function maxSubArrayBruteForce(nums) {
  let maxSum = nums[0];
  let startIdx = 0;
  let endIdx = 0;

  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    for (let j = i; j < nums.length; j++) {
      currentSum = currentSum + nums[j];
      if (currentSum > maxSum) {
        maxSum = currentSum;
        startIdx = i;
        endIdx = j;
      }
    }
  }

  return {
    sum: maxSum,
    subArray: nums.slice(startIdx, endIdx + 1),
  };
}

// Time Complexity - O(n^2)
// Space Complexity - O(1)

// console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

// Kadane's Algorithm

// [-2,1,-3,4,-1,2,1,-5,4]
function maxSubArray(nums) {
  let sum = 0;
  let max = nums[0];

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (sum > max) {
      max = sum;
    }
    if (sum < 0) {
      sum = 0;
    }
  }

  return max;
}

// Time Complexity - O(n)
// Space Complexity - O(1)

console.log(maxSubArray([5, 4, -1, 7, 8]));


/****************************************** */

function maxSubArray(nums) {
  let maxSum = nums[0]; // Initialize maxSum with the first element
  let currentSum = nums[0]; // Initialize currentSum with the first element
  
  for (let i = 1; i < nums.length; i++) {
      currentSum = Math.max(nums[i], currentSum + nums[i]);
      maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Output: 6
console.log(maxSubArray([1])); // Output: 1
console.log(maxSubArray([5,4,-1,7,8])); // Output: 23


/************************************** */
function maxSubarraySum(nums) {
  let currentMax = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Consider starting a new subarray or continuing the current one
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSum = Math.max(maxSum, currentMax);
  }

  return maxSum;
}

// Examples
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // Output: 6
console.log(maxSubarraySum([1])); // Output: 1
console.log(maxSubarraySum([5, 4, -1, 7, 8])); // Output: 23



/***************************************** */
function maxSubarraySum(nums) {
  // Base case: single element array
  if (nums.length === 1) return nums[0];

  // Divide the array into two halves
  const mid = Math.floor(nums.length / 2);
  const leftMax = maxSubarraySum(nums.slice(0, mid));
  const rightMax = maxSubarraySum(nums.slice(mid));

  // Find the maximum subarray within each half
  const maxCrossingSum = findMaxCrossingSubarray(nums, mid);

  // Return the maximum between: left half, right half, and crossing subarray
  return Math.max(leftMax, rightMax, maxCrossingSum);
}

function findMaxCrossingSubarray(nums, mid) {
  let leftSum = Number.NEGATIVE_INFINITY;
  let sum = 0;

  // Find the maximum subarray sum ending at mid from the left half
  for (let i = mid - 1; i >= 0; i--) {
    sum += nums[i];
    leftSum = Math.max(leftSum, sum);
  }

  sum = 0;
  let rightSum = Number.NEGATIVE_INFINITY;

  // Find the maximum subarray sum starting at mid + 1 from the right half
  for (let i = mid; i < nums.length; i++) {
    sum += nums[i];
    rightSum = Math.max(rightSum, sum);
  }

  // Return the sum of the maximum subarrays from both halves + the element at mid
  return leftSum + nums[mid] + rightSum;
}

// Examples
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // Output: 6
console.log(maxSubarraySum([1])); // Output: 1
console.log(maxSubarraySum([5, 4, -1, 7, 8])); // Output: 23


/***************************************** */
function maxCrossingSum(nums, left, mid, right) {
  let leftMaxSum = -Infinity;
  let sum = 0;
  
  for (let i = mid; i >= left; i--) {
      sum += nums[i];
      if (sum > leftMaxSum) {
          leftMaxSum = sum;
      }
  }
  
  let rightMaxSum = -Infinity;
  sum = 0;
  
  for (let i = mid + 1; i <= right; i++) {
      sum += nums[i];
      if (sum > rightMaxSum) {
          rightMaxSum = sum;
      }
  }
  
  return leftMaxSum + rightMaxSum;
}

function maxSubArrayHelper(nums, left, right) {
  if (left === right) {
      return nums[left]; // Base case: single element array
  }
  
  let mid = Math.floor((left + right) / 2);
  
  // Recursively find maximum subarray sums in left and right halves
  let leftMax = maxSubArrayHelper(nums, left, mid);
  let rightMax = maxSubArrayHelper(nums, mid + 1, right);
  let crossingMax = maxCrossingSum(nums, left, mid, right);
  
  // Return the maximum of the three sums
  return Math.max(leftMax, rightMax, crossingMax);
}

function maxSubArray(nums) {
  if (nums.length === 0) return 0;
  return maxSubArrayHelper(nums, 0, nums.length - 1);
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Output: 6
console.log(maxSubArray([1])); // Output: 1
console.log(maxSubArray([5,4,-1,7,8])); // Output: 23
