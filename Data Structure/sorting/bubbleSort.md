function swap(arr, xp, yp) {
  var temp = arr[xp];
  arr[xp] = arr[yp];
  arr[yp] = temp;
}

// An optimized version of Bubble Sort
function bubbleSort(arr, n) {
  var i, j;
  for (i = 0; i < n - 1; i++) {
    for (j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
}

/* Function to print an array */
function printArray(arr, size) {
  var i;
  for (i = 0; i < size; i++) console.log(arr[i] + " ");
}

// Driver program to test above functions
var arr = [5, 1, 4, 2, 8];
var n = 5;
console.log("UnSorted array:");
printArray(arr, n);

bubbleSort(arr, n);
console.log("Sorted array: ");
printArray(arr, n);



/************************************************ */

Bubble sort

Definition
Bubble sort is a simple sorting algorithm that repeatedly steps through the array, compares adjacent elements and swaps them if they are in the wrong order. The pass through the array is repeated until the array is sorted.

Implementation
Declare a variable, swapped, that indicates if any values were swapped during the current iteration.
Use the spread operator (...) to clone the original array, arr.
Use a for loop to iterate over the elements of the cloned array, terminating before the last element.
Use a nested for loop to iterate over the segment of the array between 0 and i, swapping any adjacent out of order elements and setting swapped to true.
If swapped is false after an iteration, no more changes are needed, so the cloned array is returned.
const bubbleSort = arr => {
  let swapped = false;
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    swapped = false;
    for (let j = 0; j < a.length - i; j++) {
      if (a[j + 1] < a[j]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) return a;
  }
  return a;
};

bubbleSort([2, 1, 4, 3]); // [1, 2, 3, 4]
Complexity
The algorithm has an average time complexity of O(n^2), where n is the size of the input array.

L