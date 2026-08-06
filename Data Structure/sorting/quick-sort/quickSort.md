// Quick sort is generally regarded as the most efficient general-purpose sorting algorithm for any array size, being faster than merge sort on average. The standard form of quick sort is generally done recursively and in-place. However, it is an unstable sort and hence merge sort could be preferred in cases where stability is important.

// Should the data be sorted in an ascending or descending order?
// Should the data be sorted in-place or is it acceptable to use additional data structures?
// What kinds of inputs do we need to handle?
// Will it just be an array of integers or should we handle other data types?
// Are there a large number of duplicate elements?
// How should negative numbers be handled?
// Solution
// Note: This question tackles a standard quick sort which is recursive and in-place for an output in ascending order.

/**
 * Partitions an array into two parts according to a pivot.
 * @param {Array<number>} arr The array to be sorted.
 * @param {number} lo Starting index of the array to partition
 * @param {number} hi Ending index (inclusive) of the array to partition
 * @return {number} The pivot index that was chosen.
 */
function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;

  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  if (arr[hi] < arr[i + 1]) {
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  }

  return i + 1;
}

/**
 * Sorts an array of elements in-place.
 * @param {Array<number>} arr The array to be sorted
 * @param {number} lo Starting index of the array to sort
 * @param {number} hi Ending index (inclusive) of the array to sort
 */
function quickSortImpl(arr, lo, hi) {
  if (lo >= hi) {
    return;
  }

  const pivot = partition(arr, lo, hi);
  quickSortImpl(arr, lo, pivot - 1);
  quickSortImpl(arr, pivot + 1, hi);
}

/**
 * Sorts an array of elements
 * @param {number[]} arr The array to be sorted.
 * @return {number[]}
 */
export default function quickSort(arr) {
  quickSortImpl(arr, 0, arr.length - 1);
  return arr;
}

// Edge Cases
// Non-integer element input: If the input array comprises of elements of different data types, you may need to return an error, settle for sorting on a best-effort basis, for e.g., only sorting a subset of the input data, or even define custom comparison functions for non-integers.
// Single element / Empty input: Either return the original data structure, raise an error, or clarify required handling.
// Already sorted input: You may want to detect sorting and return the input unchanged.
// Invalid input: If the input is not a array, consider throwing an error.
// Time Complexity
// In the case of merge sort, the best and average case time complexity is O(nlog(n)), while the worst case time complexity is O(n2). Despite this, quick sort is generally faster than merge sort as the conditions for a worst or best case time complexity makes it extremely rare.

// The time complexity of merge sort is dependent on the selection of the pivot element for every recursive call. The closer the pivot is to the median of the array or subarray, the faster the algorithm. This is because it affects the partitioning time for every recursive call, which refers to the time it takes to scan each subarray and place it in the smaller or larger subarray.

// In the worst case, for every recursive call, we happen to select the pivot element furthest away from the median - that is, the largest or smallest element in the array or subarrays. This means that the partitioning time is c(n) (c for some constant) for the first recursive call, c(n-1) for the second recursive call (after selecting 1 pivot element), and so on. When we total up the partitioning times for n recursive calls, it comes up to about O(n2) running time.

// In the best case, the pivot element for every recursive call is very close to the median such that partitions are always as evenly balanced as possible. In this case, we expect every subarray to be evenly halved each time, meaning that we only need 2 * (n/2) partitioning time for every recursive call (where n refers to the size of the subarray to be partitioned). Given that there are also log(n) + 1 recursive calls to be made, we expect a total of cn(log(n) + 1) running time, which in big O notation is O(nlog(n)).

// As we can see from above, the best and worst requires very specific conditions for them to happen.

// Meanwhile, the average case is more likely to occur for quick sort. The average case is derived from the fact that any split of constant proportionality will produce a recursion tree of depth O(log(n)), where the partitioning cost for every recursion level is O(log(n)). Hence, the time complexity tends to be O(nlog(n)).

// Using an example where we assume a partially unbalanced split in the ratio of (9:1):

// The left subtree of the recurrence will decrease at a factor of 1/10, which puts its depth at log10(n).
// The right subtree of the recurrence will decrease at a factor of 9/10, which puts its depth at log10/9(n) = O(log(n)).
// The cost to partition at each level of recursion is around c(n).
// With the above, we see that the cost is around O(nlog(n)).

// Space Complexity
// In terms of space complexity, although quick sort is an in-place algorithm, as a recursive function it still uses a call stack. The space complexity will therefore depend on the size of the recursion call stack, which is the height of the recursion tree.

// In the worst case, pivots are chosen badly in every recursive call and there is therefore only 1 call at each level of recursion. This causes the height of the recursion tree to be O(n).

// In the best case, the space complexity tends to be O(log(n)), whereby there are 2 recursive calls at every recursion level. This occurs when the pivot is always the median or close to it, such that the recursion tree is balanced.

// To avoid the worst case time or space complexity, we could use a better pivot selection strategy. An example of such a strategy is the random pivot selection strategy. By randomly selecting the pivot element, we can ensure that the pivot is not always the smallest or largest element in the array, which reduces the likelihood of the worst-case time complexity occurring.

// // Select a pivot element randomly
// const pivotIndex = Math.floor(Math.random() * arr.length);
// const pivot = arr[pivotIndex];
