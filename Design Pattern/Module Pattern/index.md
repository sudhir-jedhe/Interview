// The module pattern is a great way to split a larger file into multiple smaller, reusable pieces.
// It also promotes code encapsulation, since the values within modules are kept private inside
// the module by default, and cannot be modified. Only the values that are explicitly exported
// with the export keyword are accessible to other files.

// import {
//   add as addValues,
//   subtract,
//   multiply as multiplyValue,
//   divide,
// } from "./math";

function add(...args) {
  return args.reduce((acc, curr) => acc + curr, 0);
}

function multiply(...args) {
  return args.reduce((acc, curr) => acc * curr);
}

/******************* */ // math.js
console.log("add", addValues(4, 5)); // 9

console.log("subtract", subtract(4, 5)); // -1

console.log("multiply", multiplyValue(4, 5)); // 20

console.log("divide", divide(10, 5)); // 2

/******************************* */ // index.js

console.log("add", add(4, 5)); // 9

console.log("multiply", multiply(4, 5)); // 20
