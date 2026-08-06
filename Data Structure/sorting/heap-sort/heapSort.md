/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function heapSort(arr) {
  // Begin by building a max heap.
  const size = arr.length;
  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
    // Start with the index of the last parent node.
    // heapify: Swaps parent with child as long as child is larger than parent.
    heapify(arr, size, i);
  }

  // Iterate through the heap backwards, swapping the last element of the heap with the max element (the root of a max heap).
  // Max elements swapped to the end constitute the sorted part of the array (ignored in the next iteration by "i--").
  for (let i = size - 1; i >= 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Build a max heap again in preparation for the swap in the next iteration.
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, size, parentIdx) {
  let largest = parentIdx; // Initiate largest value's index with parent index.
  const leftChildIdx = 2 * parentIdx + 1; // Calculate index of left child.
  const rightChildIdx = 2 * parentIdx + 2; // Calculate index of right child.
  // Set `largest` to index with highest value between parent, left and right child.
  // See if left child of parent exists and is larger than parent.
  if (leftChildIdx < size && arr[leftChildIdx] > arr[largest]) {
    largest = leftChildIdx;
  }
  // See if right child of parent exists and is larger than parent.
  if (rightChildIdx < size && arr[rightChildIdx] > arr[largest]) {
    largest = rightChildIdx;
  }
  // If `largest` is not the current parent, swap positions with the current parent.
  if (largest !== parentIdx) {
    [arr[parentIdx], arr[largest]] = [arr[largest], arr[parentIdx]];
    // Continue to recursively heapify the affected subtree.
    heapify(arr, size, largest);
  }
}



/******************************************** */
// If asked to sort in descending order: Change comparison operators in heapify() function in order to build a min heap instead of a max heap, then use it as per normal in heapSort:
function heapifyMin(arr, size, parentIdx) {
  let smallest = parentIdx; // initiate smallest value's index with parent index
  const leftChildIdx = 2 * parentIdx + 1; // calculate index of left child
  const rightChildIdx = 2 * parentIdx + 2; // calculate index of right child
  // set 'smallest' to index with lowest value between parent, left and right child
  if (leftChildIdx < size && arr[leftChildIdx] < arr[smallest]) {
    smallest = leftChildIdx;
  }
  if (rightChildIdx < size && arr[rightChildIdx] < arr[smallest]) {
    smallest = rightChildIdx;
  }
  // if 'smallest' is not the current parent, swap positions with the current parent
  if (smallest !== parentIdx) {
    [arr[parentIdx], arr[smallest]] = [arr[smallest], arr[parentIdx]];
    // continue to recursively heapify the affected subtree
    heapifyMin(arr, size, smallest);
  }
}
If asked to use additional data structures or to write a pure function rather than sorting the data in-place, create a copy of the array and return a shallow copy of the sorted array:
function heapSort(arr) {
  const result = arr.slice(0);
  const size = arr.length;
  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
    heapify(result, size, i);
  }
  for (let i = size - 1; i >= 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    heapify(result, i, 0);
  }
  return result;
}
// If you're wondering why Math.floor(size / 2 - 1) was able to calculate the index of the last parent node, it's because in a complete binary tree, the number of parent nodes is equal to Math.floor(size / 2). The -1 at the end is needed because the indices in the array start at 0, not 1.
// Time Complexity
// The best, average and worst case time complexity of heap sort is O(nlog n). Regardless of whether the elements are already sorted, the algorithm will always take O(nlog(n)) time to complete. This is accurate unless you detect sorted arrays and return them immediately for a O(n) time complexity at the best case with a completely sorted array.

// To understand the time complexity of heap sort, understanding the time complexity of heapify() is critical. In heapify(), we walk through the tree from top to bottom, which means the time complexity is proportional to the height of the binary tree, which is O(log(n)) at most for a tree of size n. Therefore, time complexity for the heapify() function is O(log(n)).

// The time complexity of heap sort is O(nlog(n)) as there are 2 steps to the algorithm: Building the heap and then sorting the data.

// Building the heap has a time complexity of O(n) because the heapify() method is called for each parent node backward, starting with the last node and ending at the tree root. On average, this can be done optimally at O(n).
// When sorting the data, we call the heapify() method n-1 times to maintain the heap property on the unsorted part of the array. Hence, the total time complexity is O(nlog(n)).
// The total time complexity of heap sort is the sum of the time complexity of each step, which is O(n) + O(nlog(n)) = O(nlog(n)).

// Space Complexity
// The space complexity for heap sort is O(1), as it does in-place sorting and does not require additional storage proportional to input size.

// However, the space complexity will be O(n) if the algorithm is implemented using recursive function calls, which requires additional memory space to store the function call stack.



Question Language
