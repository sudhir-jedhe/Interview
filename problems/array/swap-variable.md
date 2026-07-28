```js
// Swapping array using temporary variable
let array = [10, 2, 5, 12, 7];
temp = array[1];
array[1] = array[0];
array[0] = temp;

console.log("Array after swapping : " + array);

/*************************************** */

// Swapping first two elements of the array
let array = [10, 2, 5, 12, 7];
[array[0], array[1]] = [array[1], array[0]];
console.log("Array after swapping : " + array);

/************************************************ */

let a = 3,
  b = 5;

// Code to swap 'a' and 'b'
// a value changes to 8
a = a + b;

// b value changes to 3
b = a - b;

// a value changes to 5
a = a - b;

console.log("After Swapping: x value is : " + a + " and b value is :" + b);
/************************************************* */

let a = 20;
let b = 60;

a = a ^ b;
b = a ^ b;
a = a ^ b;

console.log(a); // Output: 60
console.log(b); // Output: 20
