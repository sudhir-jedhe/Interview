// Javascript code to linearly search x in arr[].

function search(arr, n, x) {
  for (let i = 0; i < n; i++) if (arr[i] == x) return i;
  return -1;
}

// Driver code

let arr = [2, 3, 4, 10, 40];
let x = 10;
let n = arr.length;

// Function call
let result = search(arr, n, x);
result == -1
  ? console.log("Element is not present in array")
  : console.log("Element is present at index " + result);

// This code is contributed by Manoj
//arr[] = {10, 50, 30, 70, 80, 20, 90, 40} and key = 30

/********************************* */
// LinearSearch (array, index, key):
//     if index < 0:
//         return -1;
//     if item = key:
//         return index
//     return LinearSearch (array, index-1, key)
let linearsearch = (arr, size, key) => {
  if (size == 0) {
    return -1;
  } else if (arr[size - 1] == key) {
    // Return the index of found key.
    return size - 1;
  }
  return linearsearch(arr, size - 1, key);
};

// Driver Code
let main = () => {
  let arr = [5, 15, 6, 9, 4];
  let key = 4;
  let ans = linearsearch(arr, 5, key);
  if (ans == -1) {
    console.log(`The element ${key} is not found.`);
  } else {
    console.log(
      `The element ${key} is found at ${ans} index of the given array.`
    );
  }
  return 0;
};

main();

/****************************************************** */
// Javascript program for transposition
// to improve the Linear Search
// Algorithm

// Structure of the
// array
class Array {
  constructor(A, size, length) {
    this.A = A;
    this.size = size;
    this.length = length;
  }
}

// Function to print the
// array element
function Display(arr) {
  let i;

  // Traverse the array arr[]
  for (i = 0; i < arr.length; i++) {
    console.log(arr.A[i] + " ");
  }
  console.log("<br>");
}

// Function that performs the Linear
// Search Transposition
function LinearSearchTransposition(arr, key) {
  let i;

  // Traverse the array
  for (i = 0; i < arr.length; i++) {
    // If key is found, then swap
    // the element with it's
    // previous index
    if (key == arr.A[i]) {
      // If key is first element
      if (i == 0) return i;
      let temp = arr.A[i];
      arr.A[i] = arr.A[i - 1];
      arr.A[i - 1] = temp;
      return i;
    }
  }
  return -1;
}

// Driver Code

// Given array arr[]
let tempArr = [2, 23, 14, 5, 6, 9, 8, 12];
let arr = new Array(tempArr, 10, 8);

console.log("Elements before Linear" + " Search Transposition: ");

// Function Call for displaying
// the array arr[]
Display(arr);

// Function Call for transposition
LinearSearchTransposition(arr, 14);

console.log("Elements after Linear" + " Search Transposition: ");

// Function Call for displaying
// the array arr[]
Display(arr);

// This code is contributed by Saurabh Jaiswal
/*********************************************************************** */
// JavaScript implementation of Move to Front optimization for Linear Search

// Structure of the array
class Array {
  constructor(A, size, length) {
    this.A = A;
    this.size = size;
    this.length = length;
  }
}

// Function to print the array element
const display = (arr) => {
  // Traverse the array arr[]
  for (let i = 0; i < arr.length; i++) {
    console.log(arr.A[i]);
  }
  console.log("\n");
};

// Function that performs the move to front operation for Linear Search
const linearSearchMoveToFront = (arr, key) => {
  // Traverse the array
  for (let i = 0; i < arr.length; i++) {
    // If key is found, then swap the element with 0-th index
    if (key === arr.A[i]) {
      let temp = arr.A[i];
      arr.A[i] = arr.A[0];
      arr.A[0] = temp;
      return i;
    }
  }
  return -1;
};

// Given array arr[]
const a = [2, 23, 14, 5, 6, 9, 8, 12];
const arr = new Array(a, 10, 8);

console.log("Elements before Linear Search Move To Front: ");

// Function Call for displaying the array arr[]
display(arr);

// Function Call for Move to front operation
linearSearchMoveToFront(arr, 14);

console.log("Elements after Linear Search Move To Front: ");

// Function Call for displaying the array arr[]
display(arr);
/************************************************************** */
function linearSearchWithHashTable(arr, target) {
  // Create a hash table to map each element to its position
  const hashTable = {};
  for (let i = 0; i < arr.length; i++) {
    hashTable[arr[i]] = i;
  }

  // Search for the target element in the hash table
  if (hashTable[target] !== undefined) {
    return hashTable[target];
  } else {
    return -1;
  }
}

const arr = [1, 5, 3, 9, 2, 7];
const target = 9;

const index = linearSearchWithHashTable(arr, target);
if (index !== -1) {
  console.log(`Found ${target} at index ${index}`);
} else {
  console.log(`${target} not found in the list`);
}
