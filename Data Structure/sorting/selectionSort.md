// Javascript program for implementation of selection sort
function swap(arr, xp, yp) {
  var temp = arr[xp];
  arr[xp] = arr[yp];
  arr[yp] = temp;
}

function selectionSort(arr, n) {
  var i, j, min_idx;

  // One by one move boundary of unsorted subarray
  for (i = 0; i < n - 1; i++) {
    // Find the minimum element in unsorted array
    min_idx = i;
    for (j = i + 1; j < n; j++) if (arr[j] < arr[min_idx]) min_idx = j;

    // Swap the found minimum element with the first element
    swap(arr, min_idx, i);
  }
}

function printArray(arr, size) {
  var i;
  for (i = 0; i < size; i++) console.log(arr[i] + " ");
}

var arr = [64, 25, 12, 22, 11];
var n = 5;
console.log("UnSorted array: ");
printArray(arr, n);
selectionSort(arr, n);
console.log("Sorted array:");
printArray(arr, n);




/********************************************** */
Selection sort

Definition
Selection sort is an in-place comparison sorting algorithm. It divides the input array into a sorted and an unsorted subarray. It then repeatedly finds the minimum element in the unsorted subarray and swaps it with the leftmost element in the unsorted subarray, moving the subarray boundaries one element to the right.

Implementation
Use the spread operator (...) to clone the original array, arr.
Use a for loop to iterate over elements in the array.
Use Array.prototype.slice() and Array.prototype.reduce() to find the index of the minimum element in the subarray to the right of the current index. Perform a swap, if necessary.
const selectionSort = arr => {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    const min = a
      .slice(i + 1)
      .reduce((acc, val, j) => (val < a[acc] ? j + i + 1 : acc), i);
    if (min !== i) [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
};

selectionSort([5, 1, 4, 2, 3]); // [1, 2, 3, 4, 5]
Complexity
The algorithm has an average time complexity of O(n^2), where n is the size of the input array.