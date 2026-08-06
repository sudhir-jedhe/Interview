```js
// Define first array
let arr1 = [1, 2, 3, 4, 5, 77, 876, 453];

// Define second array
let arr2 = [1, 2, 45, 4, 231, 453];

// Create a empty object of array
let result = [];

// Checked the matched element between two
// array and add into result array
arr1.forEach((val) => arr2.includes(val) && result.push(val));

// Print the result on console
console.log(result); // [ 1, 2, 4, 453 ]

/************************************* */
// Define first array
let arr1 = [1, 2, 3, 4, 5, 77, 876, 453];

// Define second array
let arr2 = [1, 2, 45, 4, 231, 453];

// Checked the matched element between two array
// and add into the result array
let result = arr1.filter((val) => arr2.includes(val));

// Print the result on console
console.log(result);
