/**
 * 3Sum Closest (LeetCode 16).
 *
 * Find three numbers whose sum is closest to the target and return that sum.
 *
 * Sort, then for each index run a two-pointer scan over the rest.
 * Time  O(n^2)
 * Space O(1) beyond the sort
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {number}
 */

let a = 10;
let b = 20;
const sum = a + b;
console.log(sum);
function threeSumClosest(nums, target) {
  const arr = [...nums].sort((a, b) => a - b);
  let best = arr[0] + arr[1] + arr[2];

  for (let i = 0; i < arr.length - 2; i++) {
    if (i > 0 && arr[i] === arr[i - 1]) continue; // skip duplicate anchors

    let lo = i + 1;
    let hi = arr.length - 1;

    while (lo < hi) {
      const sum = arr[i] + arr[lo] + arr[hi];

      if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      if (sum === target) return sum; // cannot do better

      if (sum < target) lo++;
      else hi--;
    }
  }

  return best;
}

/** The triplet itself, not just the sum. */
function threeSumClosestTriplet(nums, target) {
  const arr = [...nums].sort((a, b) => a - b);
  let best = [arr[0], arr[1], arr[2]];
  let bestSum = arr[0] + arr[1] + arr[2];

  for (let i = 0; i < arr.length - 2; i++) {
    let lo = i + 1;
    let hi = arr.length - 1;

    while (lo < hi) {
      const sum = arr[i] + arr[lo] + arr[hi];

      if (Math.abs(sum - target) < Math.abs(bestSum - target)) {
        bestSum = sum;
        best = [arr[i], arr[lo], arr[hi]];
      }

      if (sum === target) return { sum, triplet: best };
      if (sum < target) lo++;
      else hi--;
    }
  }

  return { sum: bestSum, triplet: best };
}

/** All unique triplets summing to exactly zero (LeetCode 15). */
function threeSum(nums) {
  const arr = [...nums].sort((a, b) => a - b);
  const out = [];

  for (let i = 0; i < arr.length - 2; i++) {
    if (arr[i] > 0) break; // no way back to zero
    if (i > 0 && arr[i] === arr[i - 1]) continue; // skip duplicates

    let lo = i + 1;
    let hi = arr.length - 1;

    while (lo < hi) {
      const sum = arr[i] + arr[lo] + arr[hi];

      if (sum === 0) {
        out.push([arr[i], arr[lo], arr[hi]]);
        while (arr[lo] === arr[lo + 1]) lo++;
        while (arr[hi] === arr[hi - 1]) hi--;
        lo++;
        hi--;
      } else if (sum < 0) lo++;
      else hi--;
    }
  }

  return out;
}

// ---- Examples ----
// console.log(threeSumClosest([-1, 2, 1, -4], 1)); // 2
// console.log(threeSumClosest([0, 0, 0], 1)); // 0
// console.log(threeSumClosestTriplet([-1, 2, 1, -4], 1)); // { sum: 2, triplet: [-1, 1, 2] }
// console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2], [-1,0,1]]

module.exports = { threeSumClosest, threeSumClosestTriplet, threeSum };
