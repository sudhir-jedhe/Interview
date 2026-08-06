```js
// JavaScript code to illustrate pop() function
// to remove array elements

function func() {
  let arr = ["shift", "splice", "filter", "pop"];

  // Popping the last element from the array
  let popped = arr.pop();
  console.log("Removed element: " + popped);
  console.log("Remaining elements: " + arr);
}
func();

/***************************** */

// Declare and initialize an array
let array = ["pop", "splice", "filter", "shift"];

console.log("Original array: " + array + "<br>");

// Loop run while array length not zero
while (array.length) {
  // Remove elements from array
  array.pop();
}
console.log("Array Length: " + array.length);

/********************************* */

// JavaScript code to illustrate shift() method
// to remove elements from array
function func() {
  let arr = ["shift", "splice", "filter", "pop"];

  // Removing the first element from array
  let shifted = arr.shift();
  console.log("Removed element: " + shifted);
  console.log("Remaining elements: " + arr);
}
func();

/*************************************** */
// JavaScript code to illustrate splice() function

function func() {
  let arr = ["shift", "splice", "filter", "pop"];

  // Removing the specified element from the array
  let spliced = arr.splice(1, 1);
  console.log("Removed element: " + spliced);
  console.log("Remaining elements: " + arr);
}
func();

/****************************************** */
// JavaScript code to illustrate splice() function
function func() {
  let arr = ["shift", "splice", "filter", "pop"];

  // Removing the specified element by value from the array
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "splice") {
      let spliced = arr.splice(i, 1);
      console.log("Removed element: " + spliced);
      console.log("Remaining elements: " + arr);
    }
  }
}
func();

/**************************************** */
// JavaScript to illustrate filter() method
function isPositive(value) {
  return value > 0;
}

function func() {
  let filtered = [101, 98, 12, -1, 848].filter(isPositive);
  console.log("Positive elements in array: " + filtered);
}
func();

/********************************************** */
// Declare and initialize an array
let array = ["lowdash", "remove", "delete", "reset"];

// Delete element at index 2
let deleted = delete array[2];

console.log("Removed: " + deleted);
console.log("Remaining elements: " + array);

/*********************************** */
// Declare and initialize an array
let array = ["lodash", "remove", "delete", "reset"];

console.log("Original array: " + array + "<br>");

// Making the array length to 0
array.length = 0;
console.log("Empty array: " + array);

/******************************************* */
let removeElement = (array, n) => {
  let newArray = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] !== n) {
      newArray.push(array[i]);
    }
  }
  return newArray;
};

let passed_in_array = [1, 2, 3, 4, 5];
let element_to_be_removed = 2;
let result = removeElement(passed_in_array, element_to_be_removed);

console.log("Remaining elements: " + result);
