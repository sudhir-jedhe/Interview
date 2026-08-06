// Merge sort is a stable comparison-based algorithm, with a time complexity of O(nlog(n)) in all cases. It is commonly used in practice as a general-purpose algorithm for sorting arrays of all sizes.

// Clarification Questions
// If unspecified:

// Should the data be sorted in an ascending or descending order?
// Should the data be sorted in-place or is it acceptable to use additional data structures?
// What kinds of inputs do we need to handle?
// Will it just be an array of integers or should we handle other data types?
// Are there a large number of duplicate elements?
// How should negative numbers be handled?

/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function mergeSort(arr) {
  // Return if array only has 0 or 1 elements (base case).
  if (arr.length <= 1) {
    return arr;
  }

  // Divide the array into two.
  const midPoint = Math.floor(arr.length / 2);
  const left = arr.slice(0, midPoint);
  const right = arr.slice(midPoint);

  // Merge sort each half recursively.
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);

  // Merge sorted halves.
  return merge(sortedLeft, sortedRight);
}

/**
 * Merges two sorted arrays of elements into one.
 * @param {Array<number>} left
 * @param {Array<number>} right
 * @return {Array<number>}
 */
function merge(left, right) {
  // Create an empty array to store the merged result.
  const mergedResult = [];

  let l = 0;
  let r = 0;
  // Repeatedly compare smallest element from each half
  // and append it to the merged result.
  // When one half runs out of elements,
  // append all the elements of the remaining half to the merged array
  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) {
      mergedResult.push(left[l]);
      l++;
    } else {
      mergedResult.push(right[r]);
      r++;
    }
  }

  // Append any remaining elements from each sides.
  mergedResult.push(...left.slice(l), ...right.slice(r));
  return mergedResult;
}
