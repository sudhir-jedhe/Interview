// Javascript program for insertion sort

// Function to sort an array using insertion sort
function insertionSort(arr, n) {
  let i, key, j;
  for (i = 1; i < n; i++) {
    key = arr[i];
    j = i - 1;

    /* Move elements of arr[0..i-1], that are 
		greater than key, to one position ahead 
		of their current position */
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}

// A utility function to print an array of size n
function printArray(arr, n) {
  let i;
  for (i = 0; i < n; i++) console.log(arr[i] + " ");
}

// Driver code
let arr = [12, 11, 13, 5, 6];
let n = arr.length;
console.log("Elements before sorting:");
printArray(arr, n);
insertionSort(arr, n);
console.log("Elements after sorting:");
printArray(arr, n);


/*********************************** */

Home
JavaScript
Algorithms
Insertion sort
Insertion sort

Definition
Insertion sort is a simple sorting algorithm that builds the final sorted array one element at a time. It uses comparison to find the correct position to insert the current element at, in order to maintain the sorted subarray.

Implementation
Use Array.prototype.reduce() to iterate over all the elements in the given array.
If the length of the accumulator is 0, add the current element to it.
Use Array.prototype.some() to iterate over the results in the accumulator until the correct position is found.
Use Array.prototype.splice() to insert the current element into the accumulator.
const insertionSort = arr =>
  arr.reduce((acc, x) => {
    if (!acc.length) return [x];
    acc.some((y, j) => {
      if (x <= y) {
        acc.splice(j, 0, x);
        return true;
      }
      if (x > y && j === acc.length - 1) {
        acc.splice(j + 1, 0, x);
        return true;
      }
      return false;
    });
    return acc;
  }, []);

insertionSort([6, 3, 4, 1]); // [1, 3, 4, 6]
Complexity
The algorithm has an average time complexity of O(n^2), where n is the size of the input array.


/************************** */

recursiveInsertionSort 


//Recursive insertion sort
let recursiveInsertionSort = (arr, i = arr.length) => {
  //if index is less than 1 then return
  if(i <= 1){
    return;
  }
   
  //Recursively call the same function
  recursiveInsertionSort(arr, i - 1);  

  let key = arr[i - 1];
  let j = i - 2;
  
  //Sort the array
  while(j >= 0 && arr[j] > key){
    arr[j + 1] = arr[j];
    j--;
  }

  arr[j + 1] = key; 
}