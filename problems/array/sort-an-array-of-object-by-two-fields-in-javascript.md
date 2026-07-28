```js
// Create input array of objects
let arr = [
  { first: 3, second: 4 },
  { first: 3, second: 1 },
  { first: 1, second: 10 },
];

// Apply array.sort with custom comparision funtion
arr.sort(function (a, b) {
  // Compare first value then second
  return a.first - b.first || a.second - b.second;
});

// Display the output
console.log(
  "'" +
    JSON.stringify(arr[0]) +
    ", " +
    JSON.stringify(arr[1]) +
    ", " +
    JSON.stringify(arr[2]) +
    "'"
);
// '{"first":1,"second":10}, {"first":3,"second":1}, {"first":3,"second":4}'

/********************************************************* */
// Create an array of objects
let arr = [
  { first: 3, second: 4 },
  { first: 3, second: 1 },
  { first: 1, second: 10 },
];

// Apply array.sort with comparison function
arr.sort(function (a, b) {
  let af = a.first;
  let bf = b.first;
  let as = a.second;
  let bs = b.second;

  // If first value is same
  if (af == bf) {
    return as < bs ? -1 : as > bs ? 1 : 0;
  } else {
    return af < bf ? -1 : 1;
  }
});

// Display output
console.log(
  "'" +
    JSON.stringify(arr[0]) +
    ", " +
    JSON.stringify(arr[1]) +
    ", " +
    JSON.stringify(arr[2]) +
    "'"
);

//{"first":1,"second":10}, {"first":3,"second":1}, {"first":3,"second":4}'
