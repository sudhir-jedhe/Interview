```js
// Array of object
let arr = [
  {
    a: 10,
    b: 25,
  },
  {
    a: 30,
    b: 5,
  },
  {
    a: 20,
    b: 15,
  },
  {
    a: 50,
    b: 35,
  },
  {
    a: 40,
    b: 45,
  },
];

// Returns max value of
// attribute 'a' in array
function fun(arr) {
  let maxValue = Number.MIN_VALUE;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].a > maxValue) {
      maxValue = arr[i].a;
    }
  }
  return maxValue;
}

let maxValue = fun(arr);
console.log(maxValue);

/********************************************************************** */
let arr = [
  {
    a: 10,
    b: 25,
  },
  {
    a: 30,
    b: 5,
  },
  {
    a: 20,
    b: 15,
  },
  {
    a: 50,
    b: 35,
  },
  {
    a: 40,
    b: 45,
  },
];

let maxValue = Math.max.apply(
  null,
  arr.map(function (o) {
    return o.a;
  })
);

console.log(maxValue);

/************************************************************* */
let array = [
  { a: 1, b: 2 },
  { a: 2, b: 4 },
  { a: 3, b: 6 },
  { a: 4, b: 8 },
  { a: 5, b: 10 },
  { a: 6, b: 12 },
];

let maxValue = array.reduce((acc, value) => {
  return (acc = acc > value.b ? acc : value.b);
}, 0);

console.log(maxValue);
