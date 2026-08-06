```js
let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalse(arr) {
  // Create a new array
  let output = [];
  for (x of arr) {
    if (x) {
      // Check if x is truthy
      output.push(x);
    }
  }
  return output;
}

console.log(removeFalse(arr));

```

```js

let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalse(arr) {
  // Create a new array
  let output = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      output.push(arr[i]);
    }
  }
  return output;
}
console.log(removeFalse(arr));

```