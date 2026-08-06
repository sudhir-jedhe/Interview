```js
// Creating array
let arr = [4, 8, 7, 13, 12];

// Function to find the sum of the array using recursion
function sumArray(arr, index) {
  if (index === arr.length) {
    return 0;
  }
  return arr[index] + sumArray(arr, index + 1);
}

console.log("Sum is " + sumArray(arr, 0));

/********************************* */

// Creating array
let arr = [4, 8, 7, 13, 12];

// Using reduce function to find the sum
let sum = arr.reduce(function (x, y) {
  return x + y;
}, 0);

// Prints: 44
console.log("Sum using Reduce method: " + sum);

/******************************************* */
// Creating array
let arr = [4, 8, 7, 13, 12];

// Creating variable to store the sum
let sum = 0;

// Calculation the sum using forEach
arr.forEach((x) => {
  sum += x;
});

// Prints: 44
console.log("Sum is " + sum);

/************************************************** */
// Creating array
let arr = [4, 8, 7, 13, 12];

// Creating variable to store the sum
let sum = 0;

// Running the for loop
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}

console.log("Sum is " + sum); // Prints: 44
