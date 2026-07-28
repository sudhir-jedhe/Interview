```js
// Declare and initialize an Array
let marks = [12, 25, 31, 23, 75, 81, 100];

// Print Before sorting array
console.log("Original Array");
console.log(marks);

// Sort elements using compare method
marks.sort(function (a, b) {
  return a - b;
});

console.log("After sorting in Ascending order");

// Print sorted Numeric array
console.log(marks);

/********************************************** */

// Declare and initialize an Array
let marks = [12, 25, 31, 23, 75, 81, 100];

// Print Before sorting array
console.log("Original Array");
console.log(marks);

// Sort elements using compare method
marks.sort(function (a, b) {
  return b - a;
});

console.log("After sorting in Ascending order");

// Print sorted Numeric array
console.log(marks);

/****************************** */

// Sorting function
function Numeric_sort(ar) {
  let i = 0,
    j;
  while (i < ar.length) {
    j = i + 1;
    while (j < ar.length) {
      if (ar[j] < ar[i]) {
        let temp = ar[i];
        ar[i] = ar[j];
        ar[j] = temp;
      }
      j++;
    }
    i++;
  }
}

// Original Array
let arr = [1, 15, 10, 45, 27, 100];

// Print Before sorting array
console.log("Original Array");
console.log(arr);

// Function call
Numeric_sort(arr);

console.log("Sorted Array");

// Print sorted Numeric array
console.log(arr);
