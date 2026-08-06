
```js

let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalse(arr) {
  // newly created array
  let newArr = [];

  // Iterate the array using the forEach loop
  arr.forEach((k) => {
    // check for the truthy value
    if (k) {
      newArr.push(k);
    }
  });
  // return the new array
  return newArr;
}
console.log(removeFalse(arr));

```


