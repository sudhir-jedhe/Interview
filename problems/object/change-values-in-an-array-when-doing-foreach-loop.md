```js
let arr = [1, 2, 3];
arr.forEach((element, index) => {
  arr[index] = element + 10;
});
console.log(arr);

/***************************** */
let arr = [
  { name: "Geeks", roll: 1 },
  { name: "For", roll: 2 },
  { name: "Geeks", roll: 3 },
];

arr.forEach((element, index) => {
  arr[index] = { name: "GFG", age: 4 };
});

console.log(arr);

/******************************************* */
let arr = [
  { name: "Geeks", roll: 1 },
  { name: "For", roll: 2 },
  { name: "Geeks", roll: 3 },
];

arr.forEach(function (item, index) {
  arr[index].name = "GFG";
});

console.log(arr);
