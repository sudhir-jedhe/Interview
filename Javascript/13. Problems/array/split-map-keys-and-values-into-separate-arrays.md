```js
const map = new Map([
  ["India", 1],
  ["USA", 2],
  ["Russia", 3],
  ["Canada", 4],
]);

let keys = Array.from(map.keys());
let values = Array.from(map.values());

console.log("Keys are :", keys);
console.log("Values are :", values);
/*
Keys are : [ 'India', 'USA', 'Russia', 'Canada' ]
Values are : [ 1, 2, 3, 4 ]
*/

/************************************************************** */
const language = new Map([
  ["HTML", 1],
  ["CSS", 2],
  ["JavaScript", 3],
]);

let keys = [];
let values = [];

language.forEach((value, key) => {
  keys.push(key);
  values.push(value);
});

console.log(keys);
console.log(values);

/******************************************************* */
const map = new Map([
  ["Virat kohli", 18],
  ["Rohit sharma", 45],
  ["M.s Dhoni", 7],
]);

let entries = [...map.entries()];
let keys = entries.map(([key, value]) => key);
let values = entries.map(([key, value]) => value);

console.log(keys);
console.log(values);

/****************************************************** */
const map = new Map([
  [1, "HTML"],
  [2, "CSS"],
  [3, "JavaScript"],
]);

let keys = [];
let values = [];

for (const [key, value] of map) {
  keys.push(key);
  values.push(value);
}

console.log(keys);
console.log(values);
