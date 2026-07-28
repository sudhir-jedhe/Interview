```js
let arr = new Array(5);
console.log(arr.length);
console.log(arr);

/************************************ */
let arr = Array.apply(null, Array(5)).map(function () {});

console.log(arr.length);
console.log(arr);

/******************************************* */

let arr = Array.apply(null, Array(5)).map(function (y, i) {
  return i;
});

console.log(arr.length);
console.log(arr);

/*************************************** */
let arr = Array.from(Array(5));
console.log(arr.length);
console.log(arr);

/******************************************************** */
let arr = Array.from("GEEKSFORGEEKS");
console.log(arr.length);
console.log(arr);

/************************************** */
let arr = Array.from("G".repeat(5));
console.log(arr.length);
console.log(arr);

/************************************************* */
let arr = Array.from({ length: 5 }, (x, i) => i);
console.log(arr.length);
console.log(arr);

/**************************************** */
const size = 5;
const array = [];

for (let i = 0; i < size; i++) {
  array.push(undefined);
}

console.log(array);
