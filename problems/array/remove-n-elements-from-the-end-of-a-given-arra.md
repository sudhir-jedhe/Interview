```js
// Define the array
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log("Original Array:", arr);

// Define the number of elements to remove
let elemsToDelete = 3;

// Using the splice() method to remove from
// the last nth index for n elements
arr.splice(arr.length - elemsToDelete, elemsToDelete);

console.log("Modified Array:", arr);

/****************************** */

// Define the array
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log("Original Array:", arr);

// Define the number of elements to remove
let elemsToDelete = 5;

// Loop for the number of elements
// to delete
while (elemsToDelete--)
  // Pop the last element from the
  // end of the array
  arr.pop();

console.log("Modified Array:", arr);

/************************************ */
// Define the array
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log("Original Array:", arr);

// Define the number of elements to remove
let elemsToDelete = 5;

// Loop for the number of elements
// to delete
let k = arr.filter((x, i) => i + elemsToDelete < arr.length);

// Pop the last element from the
// end of the array
console.log("Modified Array:", k);

/**************************************** */
const arr = [1, 2, 3, 4, 5, 6];

const withoutLast = arr.slice(0, -1);
//orignal array
console.log(arr);
//Modified array
console.log(withoutLast);

/********************************** */
const arr = [1, 2, 3, 4, 5, 6];

//remove the last 3 elements from an array
let n = 3;

while (n > 0) {
  n -= 1;
  arr.pop();
}
console.log(arr);
