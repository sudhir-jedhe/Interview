```js
let a = []; // Array

// Add elemets to it
a.push({ name: "a", class: 1 });
a.push({ name: "b", class: 9 });
a.push({ name: "c", class: 2 });
a.push({ name: "d", class: 6 });

// Custom sorting function
let sortedList = a.sort(function (a, b) {
  return a.class - b.class;
});

// Output
console.log(sortedList);

/******************************************************** */

let list = new Array();

list.push({ key: "a", value: 101 });
list.push({ key: "b", value: 43 });
list.push({ key: "d", value: 42 });
list.push({ key: "k", value: 71 });

list.sort(function (a, b) {
  if (a.value > b.value) {
    return -1;
  } else if (a.value < b.value) {
    return 1;
  }
  return 0;
});

console.log(list);

/******************************************* */
const a = {
  a: 90,
  e: 12,
  o: 27,
};

const arr = Object.entries(a);

arr.sort((a, b) => a[1] - b[1]);

const res = arr.reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {});

console.log(res);

/********************************************** */

const arr = {
  b: 3,
  a: 1,
  d: 2,
};
const keys = Object.keys(arr);

const sarr = keys.sort((a, b) => arr[a] - arr[b]);

const obj = sarr.reduce((acc, key) => {
  acc[key] = arr[key];
  return acc;
}, {});

console.log(obj);
